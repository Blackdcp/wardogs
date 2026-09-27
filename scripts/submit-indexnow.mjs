import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";

export const INDEXNOW_KEY = "8a4e2c91d70b46f8ab32458d0937ce61";
export const SITE_ORIGIN = "https://www.wardogswiki.com";
export const MAX_URLS_PER_RUN = 10_000;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_DELAY_MS = 200;
const URLS_PER_PAGE = 200;
const MAX_REDIRECT_HOPS = 5;
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
    if (file === "src/features/news/news-data.ts") {
      for (const locale of localeIdsPattern.split("|")) wantedPaths.add(`/${locale}/news`);
      continue;
    }
    if (file === "src/features/guides/related.ts") {
      // These historical entry points render a different Related Guides block.
      // Notify the affected localized pages, not every guide on the site.
      for (const locale of localeIdsPattern.split("|")) {
        for (const slug of ["wardogs-alpha", "wardogs-alpha-key", "wardogs-beta", "wardogs-playtest"]) {
          wantedPaths.add(`/${locale}/guides/${slug}`);
        }
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
  }
  return selected;
}

export function deriveNewlyAbsentUrls(previousSitemapUrls, currentSitemapUrls) {
  const current = new Set(currentSitemapUrls);
  return [...new Set(previousSitemapUrls)].filter((url) => !current.has(url));
}

export async function fetchLiveSitemapUrls(fetchImpl = fetch) {
  const url = `${SITE_ORIGIN}/sitemap.xml?indexnow=${Date.now()}`;
  const response = await fetchImpl(url, {
    headers: {"User-Agent": "WARDOGS-Wiki-IndexNow/1.0"},
    redirect: "manual",
    cache: "no-store"
  });
  if (response.status !== 200) throw new Error(`Live sitemap returned ${response.status}.`);
  const urls = parseSitemapUrls(await response.text());
  if (urls.length === 0) throw new Error("Cannot compare an empty sitemap for IndexNow.");
  if (urls.some((entry) => new URL(entry).origin !== SITE_ORIGIN)) {
    throw new Error("Live sitemap contains a URL outside the site origin.");
  }
  return urls;
}

export async function verifyAbsentUrlsLive(urls, fetchImpl = fetch) {
  for (const url of urls) {
    let currentUrl = url;
    let redirected = false;
    const visited = new Set([url]);
    for (let hops = 0; ; hops += 1) {
      const response = await fetchImpl(currentUrl, {redirect: "manual", cache: "no-store"});
      if (!redirected && (response.status === 404 || response.status === 410)) break;
      if (redirected && response.status === 200) break;

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        if (hops >= MAX_REDIRECT_HOPS) {
          throw new Error(`Newly absent URL ${url} exceeded ${MAX_REDIRECT_HOPS} redirect hops.`);
        }
        const location = response.headers.get("location");
        let target;
        try {
          if (location) target = new URL(location, currentUrl);
        } catch {
          // An invalid Location is not a usable redirect.
        }
        if (!target || target.href === currentUrl) {
          throw new Error(`Newly absent URL ${url} returned ${response.status}; not a 404, 410, or valid redirect.`);
        }
        if (target.origin !== SITE_ORIGIN) {
          throw new Error(`Newly absent URL ${url} has a redirect outside the same-origin site.`);
        }
        if (visited.has(target.href)) throw new Error(`Newly absent URL ${url} has a redirect loop.`);
        visited.add(target.href);
        currentUrl = target.href;
        redirected = true;
        continue;
      }

      if (redirected) throw new Error(`Newly absent URL ${url} redirect final response was ${response.status}, expected 200.`);
      throw new Error(`Newly absent URL ${url} returned ${response.status}; not a 404, 410, or valid redirect.`);
    }
  }
}

function changedFilesFromGit() {
  const base = process.env.BEFORE_SHA ?? process.argv[2];
  const head = process.env.CURRENT_SHA ?? process.argv[3] ?? "HEAD";
  if (!base || /^0+$/.test(base)) {
    throw new Error("No reliable changed-file diff: BEFORE_SHA must name the previous release.");
  }

  try {
    return execFileSync("git", ["diff", "--name-only", base, head], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    })
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    throw new Error("No reliable changed-file diff: git diff failed.", {cause: error});
  }
}

async function fetchText(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {headers: {"User-Agent": "WARDOGS-Wiki-IndexNow/1.0"}});
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function verifyOwnershipKey(fetchImpl = fetch) {
  const keyUrl = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
  const value = (await fetchText(`${keyUrl}?deployed=${Date.now()}`, fetchImpl)).trim();
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
  const urlList = [...new Set(urls)];
  if (urlList.length > MAX_URLS_PER_RUN) {
    throw new Error(`IndexNow selected ${urlList.length.toLocaleString("en-US")} URLs, exceeding the ${MAX_URLS_PER_RUN.toLocaleString("en-US")} URL safety ceiling.`);
  }

  for (let pageStart = 0; pageStart < urlList.length; pageStart += URLS_PER_PAGE) {
    const pageEnd = Math.min(pageStart + URLS_PER_PAGE, urlList.length);
    for (let index = pageStart; index < pageEnd; index += 1) {
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
    if (urlList.length > URLS_PER_PAGE) console.log(`IndexNow accepted ${pageEnd}/${urlList.length} changed or newly absent URLs.`);
  }

  return {submitted: urlList.length};
}

export async function submitIndexNow(options = {}) {
  const changedFiles = options.changedFiles ?? changedFilesFromGit();
  const fetchImpl = options.fetchImpl ?? fetch;
  const keyLocation = await verifyOwnershipKey(fetchImpl);
  const sitemapUrls = await fetchLiveSitemapUrls(fetchImpl);
  const updatedUrls = deriveIndexNowUrls(changedFiles, sitemapUrls);
  const absentUrls = options.previousSitemapUrls
    ? deriveNewlyAbsentUrls(options.previousSitemapUrls, sitemapUrls)
    : [];
  await verifyAbsentUrlsLive(absentUrls, fetchImpl);
  const urlList = [...new Set([...updatedUrls, ...absentUrls])];

  if (urlList.length === 0) {
    console.log("No indexable page changes detected; IndexNow notification skipped.");
    return {submitted: 0};
  }

  const result = await submitIndexNowUrls(urlList, {keyLocation, fetchImpl, pause: options.pause});
  console.log(`IndexNow accepted ${result.submitted} changed or newly absent URLs as throttled single-page notifications.`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  submitIndexNow().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
