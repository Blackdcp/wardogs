import {execFileSync, spawnSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {SITE_ORIGIN, submitIndexNow} from "./submit-indexnow.mjs";

const livePages = [
  "/en",
  "/en/guides/wardogs-squad-guide",
  "/en/guides/wardogs-known-issues"
];

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
    if (!hasCanonical(await response.text(), `${siteOrigin}${pathname}`)) {
      throw new Error(`Production smoke: ${pathname} has no matching canonical URL.`);
    }
  }

  const sitemapResponse = await fetchImpl(`${siteOrigin}/sitemap.xml`, {redirect: "manual"});
  if (sitemapResponse.status !== 200 || !(await sitemapResponse.text()).includes(`<loc>${siteOrigin}/en</loc>`)) {
    throw new Error("Production smoke: sitemap.xml is unavailable or missing the English home URL.");
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
  return {checked: 7};
}

function git(...args) {
  return execFileSync("git", args, {encoding: "utf8"}).trim();
}

export function validateDeploymentDiff(base, head, status) {
  if (!base || /^0+$/.test(base)) throw new Error("Set INDEXNOW_BASE_SHA to the last production content revision before deploying.");
  if (status) throw new Error("Commit or remove local changes before deploying, so the IndexNow diff matches production.");
  if (base === head) throw new Error("No committed changes since INDEXNOW_BASE_SHA.");
}

export async function deployProduction() {
  const base = process.env.INDEXNOW_BASE_SHA;
  const head = git("rev-parse", "HEAD");
  validateDeploymentDiff(base, head, git("status", "--porcelain"));
  git("rev-parse", "--verify", `${base}^{commit}`);
  execFileSync("git", ["merge-base", "--is-ancestor", base, head]);

  const deployment = spawnSync("vercel", ["deploy", "--prod", "--yes", "--build-env", `WARDOGSWIKI_RELEASE_SHA=${head}`], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {...process.env, NO_UPDATE_NOTIFIER: "1"}
  });
  if (deployment.error) throw deployment.error;
  if (deployment.status !== 0) throw new Error(`Production deployment failed (${deployment.status}); IndexNow was not notified.`);

  const smoke = await verifyProduction(fetch, SITE_ORIGIN, head);
  console.log(`Production smoke passed for ${smoke.checked} routes.`);

  process.env.BEFORE_SHA = base;
  process.env.CURRENT_SHA = head;
  const result = await submitIndexNow();
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  deployProduction().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
