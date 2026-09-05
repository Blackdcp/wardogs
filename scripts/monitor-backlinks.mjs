import {appendFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";

export const DEFAULT_TARGET_URL = "https://www.wardogswiki.com";
export const DEFAULT_BACKLINK_URLS = [
  "https://www.moddb.com/games/wardogs/tutorials/wardogs-beginners-guide-control-zones-cash-roles-and-teamplay"
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

function extractLinkedHosts(html, baseUrl) {
  const hosts = [];
  const hrefPattern = /\bhref\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(hrefPattern)) {
    try {
      hosts.push(canonicalHost(new URL(match[1], baseUrl).hostname));
    } catch {
      // Ignore malformed links on third-party pages.
    }
  }
  return hosts;
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
      const response = await fetchImpl(url, fetchOptions(signal));
      if (!response.ok) {
        return unavailableResult(url, `HTTP ${response.status}`, response.status);
      }

      const html = await response.text();
      const wantedHost = canonicalHost(targetHost);
      const linkedHosts = extractLinkedHosts(html, response.url || url);
      const hasTargetLink = linkedHosts.some((host) =>
        host === wantedHost || host.endsWith(`.${wantedHost}`)
      );

      return {
        url,
        finalUrl: response.url || url,
        state: hasTargetLink ? "active" : "missing",
        httpStatus: response.status
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

      const results = Array.isArray(data?.results) ? data.results : [];
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
        matchingUrls: matches.map((result) => result.url)
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
    if (entry.state === "active" && oldState && oldState !== "active") gained.push(entry.url);
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
    `- Google Search Console: ${report.googleSearchConsole.state} - ${report.googleSearchConsole.reason}`,
    `- Bing Webmaster: ${report.bingWebmaster.state} - ${report.bingWebmaster.reason}`,
    "",
    "| Public URL | State | HTTP |",
    "| --- | --- | --- |",
    ...report.publicBacklinks.map((entry) =>
      `| ${markdownCell(entry.url)} | ${markdownCell(entry.state)} | ${markdownCell(entry.httpStatus)} |`
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
    "The workflow only fetches public pages and public APIs. It does not scrape authenticated Google or Bing interfaces."
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
