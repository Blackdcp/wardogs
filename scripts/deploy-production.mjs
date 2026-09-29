import {execFileSync} from "node:child_process";
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {SITE_ORIGIN, fetchLiveSitemapUrls, submitIndexNow} from "./submit-indexnow.mjs";

const livePages = [
  "/en",
  "/ja",
  "/en/guides/wardogs-squad-guide",
  "/en/guides/wardogs-known-issues",
  "/en/tools/map",
  "/en/tools/loadout-budget",
  "/en/videos",
  "/zh-tw/guides",
  "/pl/guides"
];
const defaultSnapshotPath = path.join(process.cwd(), ".indexnow", "predeploy-sitemap.json");

function hasCanonical(html, expected) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].some(([tag]) =>
    /\brel=["']canonical["']/i.test(tag) && tag.includes(`href="${expected}"`)
  );
}

function hasNoindex(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) =>
    /\bname=["']robots["']/i.test(tag) && /\bcontent=["'][^"']*\bnoindex\b/i.test(tag)
  );
}

function hasSearchMetadataLink(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].some(([tag]) =>
    /\brel=["']canonical["']/i.test(tag) || (/\brel=["']alternate["']/i.test(tag) && /\bhreflang=/i.test(tag))
  );
}

function hasSearchMetadataHeader(value) {
  return /\brel=["']?canonical\b/i.test(value) || /\bhreflang=/i.test(value);
}

export async function verifyProduction(fetchImpl = fetch, siteOrigin = SITE_ORIGIN, expectedRevision, options = {}) {
  if (!expectedRevision || !/^[a-f0-9]{40}$/i.test(expectedRevision)) {
    throw new Error("Production smoke: expected a 40-character release revision.");
  }

  let liveRevision;
  const revisionAttempts = Math.max(1, options.revisionAttempts ?? 12);
  const pause = options.pause ?? (() => new Promise((resolve) => setTimeout(resolve, 5_000)));
  for (let attempt = 1; attempt <= revisionAttempts; attempt += 1) {
    try {
      const revisionResponse = await fetchImpl(`${siteOrigin}/api/revision`, {redirect: "manual", cache: "no-store"});
      liveRevision = revisionResponse.status === 200 ? (await revisionResponse.json()).revision : `HTTP ${revisionResponse.status}`;
      if (liveRevision === expectedRevision) break;
    } catch {
      liveRevision = "unavailable";
    }
    if (attempt < revisionAttempts) await pause();
  }
  if (liveRevision !== expectedRevision) {
    throw new Error(`Production smoke: revision ${liveRevision ?? "missing"} does not match expected ${expectedRevision}.`);
  }

  for (const pathname of livePages) {
    const response = await fetchImpl(`${siteOrigin}${pathname}`, {redirect: "manual"});
    if (response.status !== 200) throw new Error(`Production smoke: ${pathname} returned ${response.status}, expected 200.`);
    const html = await response.text();
    if (hasNoindex(html) || /\bnoindex\b/i.test(response.headers.get("x-robots-tag") ?? "")) {
      throw new Error(`Production smoke: ${pathname} unexpectedly has noindex.`);
    }
    if (!hasCanonical(html, `${siteOrigin}${pathname}`)) {
      throw new Error(`Production smoke: ${pathname} has no matching canonical URL.`);
    }
  }

  const sitemapResponse = await fetchImpl(`${siteOrigin}/sitemap.xml`, {redirect: "manual"});
  const sitemapXml = await sitemapResponse.text();
  if (sitemapResponse.status !== 200 ||
    !sitemapXml.includes(`<loc>${siteOrigin}/en</loc>`) ||
    !sitemapXml.includes(`<loc>${siteOrigin}/ja</loc>`) ||
    !sitemapXml.includes(`<loc>${siteOrigin}/en/tools/map</loc>`)) {
    throw new Error("Production smoke: sitemap.xml is unavailable or missing the English/Japanese home or map URL.");
  }

  const redirectResponse = await fetchImpl(`${siteOrigin}/maps`, {redirect: "manual"});
  const redirectTarget = redirectResponse.headers.get("location");
  if (redirectResponse.status !== 308 || !redirectTarget || new URL(redirectTarget, siteOrigin).toString() !== `${siteOrigin}/en/maps`) {
    throw new Error("Production smoke: /maps does not redirect exactly to /en/maps.");
  }

  const missingResponse = await fetchImpl(`${siteOrigin}/en/items/vehicles/littlebird`, {redirect: "manual"});
  const missingHtml = await missingResponse.text();
  if (missingResponse.status !== 404 || !hasNoindex(missingHtml) || hasSearchMetadataLink(missingHtml) || hasSearchMetadataHeader(missingResponse.headers.get("link") ?? "")) {
    throw new Error("Production smoke: unavailable item is not a clean 404 with noindex.");
  }
  return {checked: livePages.length + 4};
}

function git(...args) {
  return execFileSync("git", args, {encoding: "utf8"}).trim();
}

export function validateDeploymentDiff(base, head, status) {
  if (!base || /^0+$/.test(base)) throw new Error("Set INDEXNOW_BASE_SHA to the last production content revision before preparing the release.");
  if (status) throw new Error("Commit or remove local changes before releasing, so the IndexNow diff matches production.");
  if (base === head) throw new Error("No committed changes since INDEXNOW_BASE_SHA.");
}

function readSnapshot(base, head, snapshotPath) {
  if (!existsSync(snapshotPath)) {
    throw new Error(`IndexNow snapshot at ${snapshotPath} is missing; run release:prepare before pushing main.`);
  }
  let snapshot;
  try {
    snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
  } catch (error) {
    throw new Error(`IndexNow snapshot at ${snapshotPath} is unreadable; inspect it before retrying.`, {cause: error});
  }
  if (snapshot.base !== base || snapshot.head !== head) {
    throw new Error(`IndexNow snapshot at ${snapshotPath} belongs to a different release; inspect it before continuing.`);
  }
  if (!Array.isArray(snapshot.urls) || snapshot.urls.length === 0 ||
    snapshot.urls.some((url) => {
      try {
        return typeof url !== "string" || new URL(url).origin !== SITE_ORIGIN;
      } catch {
        return true;
      }
    })) {
    throw new Error(`IndexNow snapshot at ${snapshotPath} has invalid sitemap URLs; inspect it before retrying.`);
  }
  return snapshot.urls;
}

async function preDeploySitemapUrls(base, head, fetchImpl, snapshotPath) {
  if (existsSync(snapshotPath)) {
    console.log(`Reusing saved pre-deployment sitemap for ${head}.`);
    return readSnapshot(base, head, snapshotPath);
  }

  const urls = await fetchLiveSitemapUrls(fetchImpl);
  mkdirSync(path.dirname(snapshotPath), {recursive: true});
  writeFileSync(snapshotPath, JSON.stringify({base, head, urls}), {encoding: "utf8", flag: "wx"});
  return urls;
}

function releaseRevisions(gitImpl) {
  const branch = gitImpl("branch", "--show-current");
  if (branch !== "main") throw new Error(`Release must run on main, not ${branch || "detached HEAD"}.`);
  const base = process.env.INDEXNOW_BASE_SHA;
  const head = gitImpl("rev-parse", "HEAD");
  validateDeploymentDiff(base, head, gitImpl("status", "--porcelain"));
  gitImpl("rev-parse", "--verify", `${base}^{commit}`);
  gitImpl("merge-base", "--is-ancestor", base, head);
  return {base, head};
}

async function verifyCurrentProductionBase(fetchImpl, base) {
  const response = await fetchImpl(`${SITE_ORIGIN}/api/revision`, {redirect: "manual", cache: "no-store"});
  if (response.status !== 200) {
    throw new Error(`Release preparation: live revision returned HTTP ${response.status}; expected ${base}.`);
  }
  const {revision} = await response.json();
  if (revision !== base) {
    throw new Error(`Release preparation: live revision ${revision ?? "missing"} does not match INDEXNOW_BASE_SHA ${base}.`);
  }
}

export async function prepareProductionRelease(options = {}) {
  const gitImpl = options.gitImpl ?? git;
  const fetchImpl = options.fetchImpl ?? fetch;
  const snapshotPath = options.snapshotPath ?? defaultSnapshotPath;
  const {base, head} = releaseRevisions(gitImpl);
  if (existsSync(snapshotPath)) readSnapshot(base, head, snapshotPath);
  await verifyCurrentProductionBase(fetchImpl, base);
  const urls = await preDeploySitemapUrls(base, head, fetchImpl, snapshotPath);
  console.log(`Prepared ${urls.length} pre-deployment sitemap URLs for ${head}. Push main, then run release:finalize.`);
  return {prepared: urls.length};
}

export async function finalizeProductionRelease(options = {}) {
  const gitImpl = options.gitImpl ?? git;
  const fetchImpl = options.fetchImpl ?? fetch;
  const submitImpl = options.submitImpl ?? submitIndexNow;
  const snapshotPath = options.snapshotPath ?? defaultSnapshotPath;
  const {base, head} = releaseRevisions(gitImpl);
  const previousSitemapUrls = readSnapshot(base, head, snapshotPath);

  const smoke = await verifyProduction(fetchImpl, SITE_ORIGIN, head);
  console.log(`Production smoke passed for ${smoke.checked} routes.`);

  process.env.BEFORE_SHA = base;
  process.env.CURRENT_SHA = head;
  const result = await submitImpl({previousSitemapUrls, fetchImpl});
  unlinkSync(snapshotPath);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const action = process.argv[2];
  const run = action === "prepare" ? prepareProductionRelease : action === "finalize" ? finalizeProductionRelease : null;
  (run ? run() : Promise.reject(new Error("Use release:prepare before pushing main, then release:finalize after Vercel deploys it."))).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
