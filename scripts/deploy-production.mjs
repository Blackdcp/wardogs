import {execFileSync} from "node:child_process";
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {SITE_ORIGIN, fetchLiveSitemapUrls, submitIndexNow} from "./submit-indexnow.mjs";

const defaultSnapshotPath = path.join(process.cwd(), ".indexnow", "predeploy-sitemap.json");
const defaultTrafficContractPath = path.join(process.cwd(), "config", "traffic-protected-routes.json");
const localePattern = /^(?:en|de|ru|pt-br|ja|zh-cn|zh-tw|pl)$/;
const homeSections = ["command", "proven-demand", "live-intel", "workbench", "database", "library"];

export function loadTrafficRouteContract(contractPath = defaultTrafficContractPath) {
  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  if (contract?.schemaVersion !== 1 || contract?.production?.origin !== SITE_ORIGIN ||
    !Array.isArray(contract.canonical) || !Array.isArray(contract.legacy) || !Array.isArray(contract.knownMissing)) {
    throw new Error(`Production smoke: invalid traffic route contract at ${contractPath}.`);
  }
  return contract;
}

function linkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] ?? null;
}

function relIncludes(tag, value) {
  return (attribute(tag, "rel") ?? "").toLowerCase().split(/\s+/).includes(value);
}

function hasCanonical(html, expected) {
  return linkTags(html).some((tag) => relIncludes(tag, "canonical") && attribute(tag, "href") === expected);
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

function normalizedPath(url) {
  const pathname = new URL(url).pathname;
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function localizedSuffix(pathname) {
  return pathname.replace(/^\/(?:en|de|ru|pt-br|ja|zh-cn|zh-tw|pl)(?=\/|$)/, "") || "";
}

function requiresStructuredMainEntity(pathname) {
  const suffix = localizedSuffix(pathname);
  return suffix === "" || suffix === "/guides" || suffix.startsWith("/guides/") ||
    suffix === "/items" || suffix.startsWith("/items/") || suffix === "/tools" ||
    suffix === "/maps" || /^\/videos\/[^/]+$/.test(suffix);
}

function structuredDataState(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let validEntities = 0;
  let invalid = 0;
  for (const [, source] of scripts) {
    try {
      const value = JSON.parse(source);
      const values = Array.isArray(value) ? value : [value];
      if (values.some((entry) => entry && typeof entry === "object" && (entry["@type"] || Array.isArray(entry["@graph"])))) {
        validEntities += 1;
      }
    } catch {
      invalid += 1;
    }
  }
  return {invalid, validEntities};
}

function validateCanonicalHtml(pathname, html, headers, siteOrigin, canonicalPaths, pathsBySuffix) {
  const failures = [];
  if (hasNoindex(html) || /\bnoindex\b/i.test(headers.get("x-robots-tag") ?? "")) {
    failures.push(`${pathname} unexpectedly has noindex.`);
  }
  if (!hasCanonical(html, `${siteOrigin}${pathname}`)) {
    failures.push(`${pathname} has no matching canonical URL.`);
  }
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() ?? "";
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find(([tag]) => attribute(tag, "name")?.toLowerCase() === "description")?.[0] ?? "";
  const description = attribute(descriptionTag, "content")?.trim() ?? "";
  const h1Count = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  if (title.length < 5) failures.push(`${pathname} is missing a substantive title.`);
  if (description.length < 30) failures.push(`${pathname} is missing a substantive meta description.`);
  if (h1Count !== 1) failures.push(`${pathname} must render exactly one H1; found ${h1Count}.`);
  const structured = structuredDataState(html);
  if (structured.invalid > 0) failures.push(`${pathname} contains invalid JSON-LD.`);
  if (requiresStructuredMainEntity(pathname) && structured.validEntities === 0) {
    failures.push(`${pathname} is missing JSON-LD for its main entity.`);
  }

  const alternateTags = linkTags(html).filter((tag) => relIncludes(tag, "alternate") && attribute(tag, "hreflang"));
  const alternateByLanguage = new Map(alternateTags.map((tag) => [
    attribute(tag, "hreflang")?.trim().toLowerCase(),
    attribute(tag, "href")
  ]));
  const expectedPaths = pathsBySuffix.get(localizedSuffix(pathname)) ?? [];
  for (const expectedPath of expectedPaths) {
    const locale = expectedPath.split("/")[1];
    const language = locale === "pt-br" ? "pt-BR" : locale === "zh-cn" ? "zh-CN" : locale === "zh-tw" ? "zh-TW" : locale;
    if (alternateByLanguage.get(language.toLowerCase()) !== `${siteOrigin}${expectedPath}`) {
      failures.push(`${pathname} has missing or invalid hreflang ${language}.`);
    }
  }
  const englishPath = expectedPaths.find((candidate) => candidate.startsWith("/en"));
  if (englishPath && alternateByLanguage.get("x-default") !== `${siteOrigin}${englishPath}`) {
    failures.push(`${pathname} has missing or invalid hreflang x-default.`);
  }
  for (const href of alternateByLanguage.values()) {
    try {
      if (!href || new URL(href).origin !== siteOrigin || !canonicalPaths.has(normalizedPath(href))) {
        failures.push(`${pathname} has hreflang outside the canonical contract: ${href ?? "missing"}.`);
      }
    } catch {
      failures.push(`${pathname} has an invalid hreflang URL: ${href}.`);
    }
  }

  if (/^\/(?:en|de|ru|pt-br|ja|zh-cn|zh-tw|pl)$/.test(pathname)) {
    const actualSections = [...html.matchAll(/\bdata-home-section=["']([^"']+)["']/gi)].map((match) => match[1]);
    if (actualSections.join("|") !== homeSections.join("|")) {
      failures.push(`${pathname} does not expose the exact six-section homepage contract.`);
    }
    if (!/\bdata-home-task=["']search["']/i.test(html)) {
      failures.push(`${pathname} is missing the primary search entry.`);
    }
    if (!new RegExp(`\\bhref=["']${pathname}/items["']`, "i").test(html)) {
      failures.push(`${pathname} is missing its exact localized /items entry.`);
    }
    if (!/\bdata-page-ad-inventory=["']home["']/i.test(html) ||
      !/\bdata-ad-container=["']rectangle["']/i.test(html) ||
      !/\bdata-ad-slot=["']adsterra-native["']/i.test(html)) {
      failures.push(`${pathname} is missing the frozen home ad inventory.`);
    }
  }
  return failures;
}

async function fetchWithRetry(fetchImpl, url, init, pause) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchImpl(url, init);
      if (response.status < 500 || attempt === 1) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === 1) throw error;
    }
    await pause();
  }
  throw lastError;
}

async function mapWithConcurrency(values, limit, run) {
  const results = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({length: Math.min(limit, values.length)}, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await run(values[index], index);
    }
  }));
  return results;
}

async function waitForProductionRevision(fetchImpl, siteOrigin, expectedRevision, options) {
  const signal = options.signal;
  let liveRevision;
  const revisionAttempts = Math.max(1, options.revisionAttempts ?? 12);
  const pause = options.pause ?? (() => new Promise((resolve) => setTimeout(resolve, 5_000)));
  for (let attempt = 1; attempt <= revisionAttempts; attempt += 1) {
    try {
      const revisionResponse = await fetchImpl(`${siteOrigin}/api/revision`, {redirect: "manual", cache: "no-store", signal});
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
}

async function verifyProductionRoutes(fetchImpl, siteOrigin, options) {
  const signal = options.signal;
  const contract = options.contract ?? loadTrafficRouteContract();
  if (contract.production.origin !== siteOrigin) {
    throw new Error(`Production smoke: route contract origin ${contract.production.origin} does not match ${siteOrigin}.`);
  }
  const canonicalPaths = new Set(contract.canonical.map(({path: pathname}) => pathname));
  const pathsBySuffix = new Map();
  for (const pathname of canonicalPaths) {
    const locale = pathname.split("/")[1];
    if (!localePattern.test(locale)) continue;
    const suffix = localizedSuffix(pathname);
    pathsBySuffix.set(suffix, [...(pathsBySuffix.get(suffix) ?? []), pathname]);
  }
  const retryPause = options.retryPause ?? (() => Promise.resolve());
  const failures = [];

  try {
    const sitemapResponse = await fetchWithRetry(fetchImpl, `${siteOrigin}/sitemap.xml`, {redirect: "manual", cache: "no-store", signal}, retryPause);
    const sitemapXml = await sitemapResponse.text();
    if (sitemapResponse.status !== 200) {
      failures.push(`sitemap.xml returned ${sitemapResponse.status}, expected 200.`);
    } else {
      const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
      const foreign = sitemapUrls.filter((url) => {
        try {return new URL(url).origin !== siteOrigin;} catch {return true;}
      });
      const sitemapSet = new Set(sitemapUrls);
      const canonicalUrls = new Set([...canonicalPaths].map((pathname) => `${siteOrigin}${pathname}`));
      const missing = [...canonicalUrls].filter((url) => !sitemapSet.has(url));
      const forbidden = [...contract.legacy, ...contract.knownMissing]
        .map(({path: pathname}) => `${siteOrigin}${pathname}`)
        .filter((url) => sitemapSet.has(url));
      const extra = [...sitemapSet].filter((url) => !canonicalUrls.has(url));
      if (foreign.length > 0) failures.push(`sitemap.xml contains foreign or invalid URL(s): ${foreign.slice(0, 20).join(", ")}.`);
      if (missing.length > 0) failures.push(`sitemap.xml is missing ${missing.length} canonical route(s): ${missing.slice(0, 20).join(", ")}.`);
      if (forbidden.length > 0) failures.push(`sitemap.xml contains redirect or missing route(s): ${forbidden.slice(0, 20).join(", ")}.`);
      if (extra.length > 0) failures.push(`sitemap.xml contains ${extra.length} route(s) outside the canonical contract: ${extra.slice(0, 20).join(", ")}.`);
    }
  } catch (error) {
    failures.push(`sitemap.xml request failed after retry: ${error instanceof Error ? error.message : String(error)}.`);
  }

  const routeChecks = [
    ...contract.canonical.map((route) => ({kind: "canonical", route})),
    ...contract.legacy.map((route) => ({kind: "legacy", route})),
    ...contract.knownMissing.map((route) => ({kind: "missing", route}))
  ];
  const concurrency = Math.max(1, Math.min(6, options.concurrency ?? 6));
  const checkRoutes = mapWithConcurrency(routeChecks, concurrency, async ({kind, route}) => {
    const routeFailures = [];
    let response;
    try {
      response = await fetchWithRetry(fetchImpl, `${siteOrigin}${route.path}`, {redirect: "manual", cache: "no-store", signal}, retryPause);
    } catch (error) {
      return [`${route.path} request failed after retry: ${error instanceof Error ? error.message : String(error)}.`];
    }

    if (kind === "canonical") {
      if (response.status !== 200) {
        routeFailures.push(`${route.path} returned ${response.status}, expected 200.`);
      } else {
        const html = await response.text();
        routeFailures.push(...validateCanonicalHtml(route.path, html, response.headers, siteOrigin, canonicalPaths, pathsBySuffix));
      }
    } else if (kind === "legacy") {
      const location = response.headers.get("location");
      let target = null;
      try {
        if (location) target = new URL(location, siteOrigin).toString();
      } catch {
        // Report the invalid Location below.
      }
      if (response.status !== 308 || target !== `${siteOrigin}${route.target}`) {
        routeFailures.push(`${route.path} returned ${response.status} and Location ${location ?? "missing"}; expected exact 308 to ${route.target}.`);
      }
    } else {
      const html = await response.text();
      if (response.status !== 404 || !hasNoindex(html) || hasSearchMetadataLink(html) || hasSearchMetadataHeader(response.headers.get("link") ?? "")) {
        routeFailures.push(`${route.path} is not a clean 404 with noindex and without canonical/hreflang metadata.`);
      }
    }
    return routeFailures;
  });

  const routeResults = await checkRoutes;
  failures.push(...routeResults.flat());

  if (failures.length > 0) {
    throw new Error(`Production smoke failed with ${failures.length} issue(s):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  return {checked: routeChecks.length + 2};
}

async function runWithReleaseDeadline(phase, timeoutMs, run) {
  const controller = new AbortController();
  let timeout;
  try {
    return await Promise.race([
      run(controller.signal),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(new Error(`Production smoke ${phase} exceeded the ${Math.round(timeoutMs / 1_000)} second release deadline.`));
        }, timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timeout);
    controller.abort();
  }
}

export async function verifyProduction(fetchImpl = fetch, siteOrigin = SITE_ORIGIN, expectedRevision, options = {}) {
  if (!expectedRevision || !/^[a-f0-9]{40}$/i.test(expectedRevision)) {
    throw new Error("Production smoke: expected a 40-character release revision.");
  }
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1_000;
  await runWithReleaseDeadline("revision polling", timeoutMs, (signal) =>
    waitForProductionRevision(fetchImpl, siteOrigin, expectedRevision, {...options, signal})
  );
  return runWithReleaseDeadline("route verification", timeoutMs, (signal) =>
    verifyProductionRoutes(fetchImpl, siteOrigin, {...options, signal})
  );
}

function git(...args) {
  return execFileSync("git", args, {encoding: "utf8"}).trim();
}

export function assertProductionReleaseEnvironment() {
  if (process.env.GITHUB_PAGES === "true") {
    throw new Error("Production release commands are disabled in the auxiliary GitHub Pages environment.");
  }
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configuredOrigin && configuredOrigin !== SITE_ORIGIN) {
    throw new Error(`Production release commands require NEXT_PUBLIC_SITE_URL=${SITE_ORIGIN}, received ${configuredOrigin}.`);
  }
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
  assertProductionReleaseEnvironment();
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
  assertProductionReleaseEnvironment();
  const gitImpl = options.gitImpl ?? git;
  const fetchImpl = options.fetchImpl ?? fetch;
  const submitImpl = options.submitImpl ?? submitIndexNow;
  const snapshotPath = options.snapshotPath ?? defaultSnapshotPath;
  const {base, head} = releaseRevisions(gitImpl);
  const previousSitemapUrls = readSnapshot(base, head, snapshotPath);

  const smoke = await verifyProduction(fetchImpl, SITE_ORIGIN, head, options.smokeOptions);
  console.log(`Production smoke passed for ${smoke.checked} routes.`);

  process.env.BEFORE_SHA = base;
  process.env.CURRENT_SHA = head;
  const result = await submitImpl({previousSitemapUrls, fetchImpl});
  unlinkSync(snapshotPath);
  return result;
}

export async function verifyProductionRelease(options = {}) {
  assertProductionReleaseEnvironment();
  const expectedRevision = options.expectedRevision ?? process.env.WARDOGSWIKI_RELEASE_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA;
  const revisionAttempts = Number(options.revisionAttempts ?? process.env.PRODUCTION_REVISION_ATTEMPTS ?? 120);
  const result = await verifyProduction(options.fetchImpl ?? fetch, SITE_ORIGIN, expectedRevision, {
    revisionAttempts: Number.isFinite(revisionAttempts) ? revisionAttempts : 120,
    ...options.smokeOptions
  });
  console.log(`Production contract passed for ${result.checked} revision, sitemap, canonical, redirect, and clean-404 checks.`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const action = process.argv[2];
  const run = action === "prepare" ? prepareProductionRelease
    : action === "verify" ? verifyProductionRelease
      : action === "finalize" ? finalizeProductionRelease
        : null;
  (run ? run() : Promise.reject(new Error("Use release:prepare before pushing main, release:verify for the deployed SHA, then release:finalize to notify IndexNow."))).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
