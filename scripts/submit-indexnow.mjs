import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";

export const INDEXNOW_KEY = "8a4e2c91d70b46f8ab32458d0937ce61";
export const SITE_ORIGIN = "https://www.wardogswiki.com";
export const MAX_URLS_PER_RUN = 100;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_DELAY_MS = 200;
const localeIdsPattern = "en|de|ru|pt-br|ja|zh-cn";
const localizedPathPattern = `(?:${localeIdsPattern})`;

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
  if (changedFiles.length === 0) return [];

  const wantedPaths = new Set();
  const wantedPatterns = [];

  for (const originalFile of changedFiles) {
    const file = originalFile.replaceAll("\\", "/");
    const contentPage = file.match(new RegExp(`^content\/(${localeIdsPattern})\/(guides|news)\/([^/]+)\\.mdx$`));
    const messages = file.match(new RegExp(`^messages\/(${localeIdsPattern})\\.json$`));

    if (contentPage) {
      const [, locale, section, slug] = contentPage;
      wantedPaths.add(`/${locale}`);
      wantedPaths.add(`/${locale}/${section}`);
      wantedPaths.add(`/${locale}/${section}/${slug}`);
      continue;
    }
    if (messages) {
      const locale = messages[1];
      for (const route of ["", "/guides", "/items", "/news", "/videos", "/privacy", "/terms"]) {
        wantedPaths.add(`/${locale}${route}`);
      }
      continue;
    }
    if (file === "src/features/videos/video-library.ts") {
      wantedPatterns.push(new RegExp(`^\/${localizedPathPattern}\/videos(?:\/|$)`));
      continue;
    }
    if (file === "src/features/items/weapon-items.ts") {
      wantedPatterns.push(new RegExp(`^\/${localizedPathPattern}\/items(?:$|\/weapons(?:\/|$))`));
      continue;
    }
    if (file === "src/features/items/vehicle-items.ts") {
      wantedPatterns.push(new RegExp(`^\/${localizedPathPattern}\/items(?:$|\/vehicles(?:\/|$))`));
      continue;
    }
    if ([
      "src/features/items/item-catalog-guides.ts",
      "src/features/items/item-library.ts",
      "src/features/items/item-ui.ts",
      "src/features/catalogue/catalogue-records.ts",
      "src/lib/item-metadata.ts"
    ].includes(file)) {
      wantedPatterns.push(new RegExp(`^\/${localizedPathPattern}\/items(?:\/|$)`));
    }
  }

  const selected = [];
  const seen = new Set();
  for (const url of sitemapUrls) {
    if (seen.has(url)) continue;
    const pathname = normalizedPath(url);
    if (!wantedPaths.has(pathname) && !wantedPatterns.some((pattern) => pattern.test(pathname))) continue;
    seen.add(url);
    selected.push(url);
    if (selected.length === MAX_URLS_PER_RUN) break;
  }
  return selected;
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
    console.warn("Could not resolve changed files; IndexNow notification will be skipped.", error);
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitIndexNowUrls(urls, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const keyLocation = options.keyLocation ?? `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
  const pause = options.pause ?? (() => wait(INDEXNOW_DELAY_MS));
  const urlList = [...new Set(urls)].slice(0, MAX_URLS_PER_RUN);

  for (let index = 0; index < urlList.length; index += 1) {
    const endpoint = new URL(INDEXNOW_ENDPOINT);
    endpoint.searchParams.set("url", urlList[index]);
    endpoint.searchParams.set("key", INDEXNOW_KEY);
    endpoint.searchParams.set("keyLocation", keyLocation);
    const response = await fetchImpl(endpoint.toString());

    if (![200, 202].includes(response.status)) {
      throw new Error(`IndexNow returned ${response.status} for ${urlList[index]}: ${await response.text()}`);
    }
    if (index < urlList.length - 1) await pause();
  }

  return {submitted: urlList.length};
}

export async function submitIndexNow() {
  const changedFiles = changedFilesFromGit();
  if (changedFiles.length === 0) {
    console.log("No reliable changed-file diff found; IndexNow notification skipped.");
    return {submitted: 0};
  }

  const keyLocation = await verifyOwnershipKey();
  const sitemapXml = await fetchText(`${SITE_ORIGIN}/sitemap.xml?indexnow=${Date.now()}`);
  const sitemapUrls = parseSitemapUrls(sitemapXml);
  const urlList = deriveIndexNowUrls(changedFiles, sitemapUrls);

  if (urlList.length === 0) {
    console.log("No indexable page changes detected; IndexNow notification skipped.");
    return {submitted: 0};
  }

  const result = await submitIndexNowUrls(urlList, {keyLocation});
  console.log(`IndexNow accepted ${result.submitted} updated URLs as throttled single-page notifications.`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  submitIndexNow().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
