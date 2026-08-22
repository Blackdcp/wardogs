import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";

export const INDEXNOW_KEY = "8a4e2c91d70b46f8ab32458d0937ce61";
export const SITE_ORIGIN = "https://www.wardogswiki.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function normalizedPath(url) {
  return new URL(url).pathname.replace(/\/$/, "") || "/";
}

export function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'"));
}

export function deriveIndexNowUrls(changedFiles, sitemapUrls) {
  if (changedFiles.length === 0) return [...sitemapUrls];

  const wantedPaths = new Set();
  const wantedLocalePrefixes = new Set();
  let includeAll = false;
  let includeVideos = false;

  for (const originalFile of changedFiles) {
    const file = originalFile.replaceAll("\\", "/");
    const guide = file.match(/^content\/(en|de|ru|pt-br)\/guides\/([^/]+)\.mdx$/);
    const messages = file.match(/^messages\/(en|de|ru|pt-br)\.json$/);

    if (guide) {
      const [, locale, slug] = guide;
      wantedPaths.add(`/${locale}`);
      wantedPaths.add(`/${locale}/guides`);
      wantedPaths.add(`/${locale}/guides/${slug}`);
      continue;
    }
    if (messages) {
      wantedLocalePrefixes.add(`/${messages[1]}`);
      continue;
    }
    if (file === "src/features/videos/video-library.ts") {
      includeVideos = true;
      continue;
    }
    if (file.startsWith("src/") || ["next.config.ts", "package.json", "keywords.json"].includes(file)) {
      includeAll = true;
    }
  }

  if (includeAll) return [...sitemapUrls];

  return sitemapUrls.filter((url) => {
    const pathname = normalizedPath(url);
    if (wantedPaths.has(pathname)) return true;
    if (includeVideos && /^\/(?:en|de|ru|pt-br)\/videos(?:\/|$)/.test(pathname)) return true;
    return [...wantedLocalePrefixes].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  });
}

function changedFilesFromGit() {
  const base = process.env.BEFORE_SHA;
  const head = process.env.CURRENT_SHA ?? "HEAD";
  if (!base || /^0+$/.test(base)) return [];

  try {
    return execFileSync("git", ["diff", "--name-only", base, head], {encoding: "utf8"})
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    console.warn("Could not resolve changed files; submitting the current sitemap instead.", error);
    return [];
  }
}

async function fetchText(url) {
  const response = await fetch(url, {headers: {"User-Agent": "WARDOGS-Wiki-IndexNow/1.0"}});
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function verifyOwnershipKey() {
  const keyUrl = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
  const value = (await fetchText(`${keyUrl}?deployed=${Date.now()}`)).trim();
  if (value !== INDEXNOW_KEY) throw new Error("The deployed IndexNow ownership key does not match.");
  return keyUrl;
}

export async function submitIndexNow() {
  const keyLocation = await verifyOwnershipKey();
  const sitemapXml = await fetchText(`${SITE_ORIGIN}/sitemap.xml?indexnow=${Date.now()}`);
  const sitemapUrls = parseSitemapUrls(sitemapXml);
  const urlList = deriveIndexNowUrls(changedFilesFromGit(), sitemapUrls);

  if (urlList.length === 0) {
    console.log("No indexable page changes detected; IndexNow notification skipped.");
    return {submitted: 0};
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {"Content-Type": "application/json; charset=utf-8"},
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList
    })
  });

  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
  }

  console.log(`IndexNow accepted ${urlList.length} updated URLs with status ${response.status}.`);
  return {submitted: urlList.length, status: response.status};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  submitIndexNow().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
