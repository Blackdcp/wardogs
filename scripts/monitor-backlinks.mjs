import {appendFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";

export const DEFAULT_TARGET_URL = "https://www.wardogswiki.com";
export const DEFAULT_BACKLINK_URLS = [
  "https://www.moddb.com/games/wardogs/tutorials/wardogs-beginners-guide-control-zones-cash-roles-and-teamplay",
  "https://kennel.gg/guides/reference/sources/",
  "https://kennel.gg/guides/tasks/making-money/",
  "https://kennel.gg/guides/reference/vehicles/",
  "https://kennel.gg/guides/reference/gear-and-equipment/",
  "https://wardogsmanual.wiki/tier-list",
  "https://game.savetip.co.kr/wardogs-first-match-cash-guide/",
  "https://antihype.com.br/c/games/wardogs-chefe-detalha-hora-extra-estudio-bulkhead/",
  "https://wardogs-game.com/weapons",
  "https://www.techtimes.com/articles/326774/20260906/wardogs-beta-ends-245k-players-early-access-begins-this-wednesday.htm"
];
export const DEFAULT_MARGINALIA_STATUS_URL =
  "https://api2.marginalia-search.com/search?query=site%3Awardogswiki.com&count=20";

const GOOGLE_SEARCH_CONSOLE_DOCS =
  "https://developers.google.com/webmaster-tools/v1/api_reference_index";
const BING_WEBMASTER_DOCS = "https://learn.microsoft.com/en-us/bingwebmaster/";
const MARGINALIA_API_DOCS = "https://about.marginalia-search.com/article/api/";
const DEFAULT_TIMEOUT_MS = 15_000;
const USER_AGENT = "WARDOGS-Wiki-Backlink-Monitor/1.0 (+https://www.wardogswiki.com)";

function canonicalHost(value) {
  return value.toLowerCase().replace(/^www\./, "");
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function isPrivateDashboardUrl(value) {
  const url = new URL(value);
  const host = canonicalHost(url.hostname);
  return host === "analytics.google.com"
    || (host === "search.google.com" && url.pathname.startsWith("/search-console"))
    || (host === "bing.com" && url.pathname.startsWith("/webmasters"));
}

function decodeHtml(value) {
  const named = {amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " "};
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code) => {
    if (!code.startsWith("#")) return named[code.toLowerCase()];
    const point = code[1].toLowerCase() === "x"
      ? Number.parseInt(code.slice(2), 16)
      : Number.parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

function extractLinkedAnchors(html, baseUrl, targetHost) {
  const links = [];
  // The workflow runs without npm install; inspect static anchors, not hydration strings.
  const markup = html.replace(/<!--[\s\S]*?(?:-->|$)|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const anchorPattern = /<a\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/a\s*>/gi;
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const wantedHost = canonicalHost(targetHost);
  for (const match of markup.matchAll(anchorPattern)) {
    const attributes = new Map();
    for (const attribute of match[1].matchAll(attributePattern)) {
      const name = attribute[1].toLowerCase();
      if (!attributes.has(name)) attributes.set(name, attribute[2] ?? attribute[3] ?? attribute[4] ?? "");
    }
    if (!attributes.has("href")) continue;
    try {
      const destination = new URL(decodeHtml(attributes.get("href")), baseUrl);
      const host = canonicalHost(destination.hostname);
      if (!["http:", "https:"].includes(destination.protocol)
        || (host !== wantedHost && !host.endsWith(`.${wantedHost}`))) continue;
      links.push({
        href: destination.href,
        text: decodeHtml(match[2].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim(),
        rel: decodeHtml(attributes.get("rel") || "").toLowerCase().split(/\s+/).filter(Boolean)
      });
    } catch {
      // Ignore malformed links on third-party pages.
    }
  }
  return links;
}

function fetchOptions(signal, extraHeaders = {}) {
  return {
    redirect: "follow",
    signal,
    headers: {
      "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
      "User-Agent": USER_AGENT,
      ...extraHeaders
    }
  };
}

async function withTimeout(callback, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
  try {
    return await callback(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

function unavailableResult(url, error, httpStatus) {
  return {
    url,
    state: "unavailable",
    ...(httpStatus ? {httpStatus} : {}),
    reason: error instanceof Error ? error.message : String(error)
  };
}

export function parseBacklinkUrls(value) {
  if (!value?.trim()) return [...DEFAULT_BACKLINK_URLS];

  let candidates;
  try {
    const parsed = JSON.parse(value);
    candidates = Array.isArray(parsed) ? parsed : [];
  } catch {
    candidates = value.split(/[\r\n,]+/);
  }

  return [...new Set(candidates
    .map((candidate) => String(candidate).trim())
    .filter((candidate) => candidate && isHttpUrl(candidate)))];
}

export async function checkPublicBacklink({
  url,
  targetHost,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  if (isPrivateDashboardUrl(url)) {
    return {
      url,
      state: "skipped",
      reason: "Authenticated Google and Bing dashboard pages are never scraped."
    };
  }

  try {
    return await withTimeout(async (signal) => {
      let currentUrl = url;
      let response;
      for (let redirects = 0; redirects <= 5; redirects += 1) {
        if (isPrivateDashboardUrl(currentUrl)) {
          return {url, state: "skipped", reason: "Redirect to an authenticated dashboard was not fetched."};
        }
        response = await fetchImpl(currentUrl, {...fetchOptions(signal), redirect: "manual"});
        if (![301, 302, 303, 307, 308].includes(response.status)) break;
        const location = response.headers.get("location");
        if (!location || redirects === 5) return unavailableResult(url, "Invalid or excessive redirects", response.status);
        currentUrl = new URL(location, currentUrl).href;
        if (!isHttpUrl(currentUrl)) return unavailableResult(url, "Non-HTTP redirect", response.status);
      }
      if (!response.ok) {
        return unavailableResult(url, `HTTP ${response.status}`, response.status);
      }

      const html = await response.text();
      if (response.headers.get("cf-mitigated") === "challenge"
        || /<title[^>]*>\s*(?:Just a moment|Attention Required)[^<]*<\/title>/i.test(html)) {
        return unavailableResult(url, "Public page returned an access challenge", response.status);
      }
      const finalUrl = response.url || currentUrl;
      const links = extractLinkedAnchors(html, finalUrl, targetHost);

      return {
        url,
        finalUrl,
        state: links.length > 0 ? "active" : "missing",
        httpStatus: response.status,
        links
      };
    }, timeoutMs);
  } catch (error) {
    return unavailableResult(url, error);
  }
}

export async function checkMarginalia({
  targetHost,
  statusUrl = DEFAULT_MARGINALIA_STATUS_URL,
  apiKey = process.env.MARGINALIA_API_KEY || "public",
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  try {
    return await withTimeout(async (signal) => {
      const response = await fetchImpl(statusUrl, fetchOptions(signal, {"API-Key": apiKey}));
      if (!response.ok) {
        return unavailableResult(statusUrl, `HTTP ${response.status}`, response.status);
      }

      let data;
      try {
        data = JSON.parse(await response.text());
      } catch {
        return unavailableResult(statusUrl, "Marginalia returned invalid JSON", response.status);
      }

      if (!Array.isArray(data?.results)) {
        return unavailableResult(statusUrl, "Marginalia returned no valid results array", response.status);
      }
      const results = data.results;
      const wantedHost = canonicalHost(targetHost);
      const matches = results.filter((result) => {
        try {
          const host = canonicalHost(new URL(result.url).hostname);
          return host === wantedHost || host.endsWith(`.${wantedHost}`);
        } catch {
          return false;
        }
      });

      return {
        url: statusUrl,
        state: matches.length > 0 ? "indexed" : "not-indexed",
        httpStatus: response.status,
        resultCount: matches.length,
        matchingUrls: matches.map((result) => result.url),
        reason: matches.length > 0
          ? "Matching URLs were returned by this search query."
          : "No matching URLs were returned by this query; this does not establish submission-review or database-admission status."
      };
    }, timeoutMs);
  } catch (error) {
    return unavailableResult(statusUrl, error);
  }
}

function describeGoogleSearchConsole() {
  return {
    state: "unsupported",
    reason: "The official GSC API has no sitewide external-links endpoint; it exposes Search Analytics, Sites, Sitemaps, and URL Inspection only. No logged-in UI is scraped.",
    documentation: GOOGLE_SEARCH_CONSOLE_DOCS
  };
}

function describeBingWebmaster() {
  return {
    state: "unavailable",
    reason: "No current stable Bing Link Details REST endpoint is encoded. The documented JSON/POX service was retired on 2026-08-31, and this monitor never scrapes the logged-in Bing UI.",
    documentation: BING_WEBMASTER_DOCS
  };
}

function computeChanges(current, previousReport) {
  const previous = new Map(
    (previousReport?.publicBacklinks || []).map((entry) => [entry.url, entry.state])
  );
  const gained = [];
  const lost = [];

  for (const entry of current) {
    const oldState = previous.get(entry.url);
    if (entry.state === "active" && oldState === "missing") gained.push(entry.url);
    if (entry.state === "missing" && oldState === "active") lost.push(entry.url);
  }

  return {
    baselineAvailable: Boolean(previousReport),
    gained,
    lost
  };
}

export async function buildReport({
  now = new Date(),
  targetUrl = DEFAULT_TARGET_URL,
  backlinkUrls = DEFAULT_BACKLINK_URLS,
  marginaliaStatusUrl = DEFAULT_MARGINALIA_STATUS_URL,
  marginaliaApiKey = process.env.MARGINALIA_API_KEY || "public",
  previousReport,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
  const target = new URL(targetUrl);
  const publicBacklinks = await Promise.all(backlinkUrls.map((url) => checkPublicBacklink({
    url,
    targetHost: target.hostname,
    fetchImpl,
    timeoutMs
  })));
  const marginalia = await checkMarginalia({
    targetHost: target.hostname,
    statusUrl: marginaliaStatusUrl,
    apiKey: marginaliaApiKey,
    fetchImpl,
    timeoutMs
  });

  return {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    target: target.origin,
    publicBacklinks,
    marginalia: {
      ...marginalia,
      documentation: MARGINALIA_API_DOCS
    },
    googleSearchConsole: describeGoogleSearchConsole(),
    bingWebmaster: describeBingWebmaster(),
    changes: computeChanges(publicBacklinks, previousReport)
  };
}

function markdownCell(value) {
  return String(value ?? "-").replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function formatStepSummary(report) {
  const active = report.publicBacklinks.filter((entry) => entry.state === "active").length;
  const missing = report.publicBacklinks.filter((entry) => entry.state === "missing").length;
  const unavailable = report.publicBacklinks.filter((entry) =>
    ["unavailable", "skipped"].includes(entry.state)
  ).length;
  const lines = [
    "# Weekly backlink/status monitor",
    "",
    `- Target: ${report.target}`,
    `- Generated: ${report.generatedAt}`,
    `- Public backlinks: ${active} active, ${missing} missing, ${unavailable} unavailable/skipped`,
    `- Gained: ${report.changes.gained.length}`,
    `- Lost: ${report.changes.lost.length}`,
    `- Marginalia: ${report.marginalia.state}`,
    ...(report.marginalia.reason ? [`- Marginalia observation: ${report.marginalia.reason}`] : []),
    `- Google Search Console: ${report.googleSearchConsole.state} - ${report.googleSearchConsole.reason}`,
    `- Bing Webmaster: ${report.bingWebmaster.state} - ${report.bingWebmaster.reason}`,
    "",
    "| Public URL | State | HTTP | Verified anchor destinations / rel |",
    "| --- | --- | --- | --- |",
    ...report.publicBacklinks.map((entry) =>
      `| ${markdownCell(entry.url)} | ${markdownCell(entry.state)} | ${markdownCell(entry.httpStatus)} | ${markdownCell(entry.links?.map((link) => `${link.href} [${link.rel.join(" ") || "no rel"}]`).join("; "))} |`
    ),
    "",
    "## Changes since previous report",
    "",
    report.changes.baselineAvailable
      ? `Gained: ${report.changes.gained.length}; lost: ${report.changes.lost.length}.`
      : "No previous report was available; this run establishes the baseline.",
    ...report.changes.gained.map((url) => `- Gained: ${url}`),
    ...report.changes.lost.map((url) => `- Lost: ${url}`),
    "",
    "The workflow only fetches public pages and public APIs. It does not scrape authenticated Google or Bing interfaces.",
    "Active means a static public anchor was observed, not search-engine indexing or independent editorial endorsement. Access errors are unavailable, never lost; recovery from an unavailable check is not a gained backlink."
  ];
  return `${lines.join("\n")}\n`;
}

async function readPreviousReport(filePath) {
  if (!filePath) return undefined;
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn(`Previous report unavailable: ${error.message}`);
    }
    return undefined;
  }
}

export async function runMonitor(env = process.env) {
  const outputPath = env.BACKLINK_REPORT_PATH
    || path.join("artifacts", "backlink-monitor", "report.json");
  const previousReport = await readPreviousReport(env.PREVIOUS_BACKLINK_REPORT_PATH);
  const report = await buildReport({
    targetUrl: env.BACKLINK_TARGET_URL || DEFAULT_TARGET_URL,
    backlinkUrls: parseBacklinkUrls(env.BACKLINK_URLS),
    marginaliaStatusUrl: env.MARGINALIA_STATUS_URL || DEFAULT_MARGINALIA_STATUS_URL,
    marginaliaApiKey: env.MARGINALIA_API_KEY || "public",
    previousReport
  });
  const summary = formatStepSummary(report);

  await mkdir(path.dirname(outputPath), {recursive: true});
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  if (env.GITHUB_STEP_SUMMARY) {
    await appendFile(env.GITHUB_STEP_SUMMARY, summary, "utf8");
  }

  console.log(summary);
  console.log(`JSON report written to ${outputPath}`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMonitor().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
