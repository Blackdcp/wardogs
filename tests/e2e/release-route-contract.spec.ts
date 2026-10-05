import {expect, test} from "@playwright/test";
import {
  RELEASE_CANONICAL_ROUTES,
  RELEASE_LEGACY_ROUTES,
  TRAFFIC_ROUTE_CONTRACT
} from "../fixtures/route-contract";
import {publicRouteUrl} from "../../src/lib/public-url";

function linkTags(html: string) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag);
}

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] ?? null;
}

function relIncludes(tag: string, value: string) {
  return (attribute(tag, "rel") ?? "").toLowerCase().split(/\s+/).includes(value);
}

async function mapWithConcurrency<T>(values: readonly T[], limit: number, run: (value: T) => Promise<void>) {
  let cursor = 0;
  await Promise.all(Array.from({length: Math.min(limit, values.length)}, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      await run(values[index]);
    }
  }));
}

test("sitemap contains every canonical contract path and excludes redirect and clean-404 paths", async ({request}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const sitemapPaths = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname.replace(/\/$/, "")));

  for (const {path} of TRAFFIC_ROUTE_CONTRACT.canonical) expect(sitemapPaths.has(path), path).toBe(true);
  for (const {path} of TRAFFIC_ROUTE_CONTRACT.legacy) expect(sitemapPaths.has(path), path).toBe(false);
  for (const {path} of TRAFFIC_ROUTE_CONTRACT.knownMissing) expect(sitemapPaths.has(path), path).toBe(false);
});

test("protected and newly introduced hub routes return self-canonical indexable pages with valid hreflang targets", async ({request}) => {
  const origin = new URL(publicRouteUrl("/")).origin;
  const canonicalPaths = new Set(TRAFFIC_ROUTE_CONTRACT.canonical.map(({path}) => path));
  const failures: string[] = [];

  await mapWithConcurrency(RELEASE_CANONICAL_ROUTES, 6, async ({path}) => {
    const response = await request.get(path, {maxRedirects: 0});
    const html = await response.text();
    const links = linkTags(html);
    const canonical = links.find((tag) => relIncludes(tag, "canonical"));
    const alternates = links.filter((tag) => relIncludes(tag, "alternate") && attribute(tag, "hreflang"));
    if (response.status() !== 200) failures.push(`${path}: status ${response.status()}`);
    if (attribute(canonical ?? "", "href") !== `${origin}${path}`) failures.push(`${path}: canonical ${attribute(canonical ?? "", "href")}`);
    if (/noindex/i.test(html)) failures.push(`${path}: noindex`);
    for (const tag of alternates) {
      const href = attribute(tag, "href");
      if (!href || !canonicalPaths.has(new URL(href).pathname.replace(/\/$/, ""))) failures.push(`${path}: invalid alternate ${href}`);
    }
    if (alternates.length < 8) failures.push(`${path}: only ${alternates.length} hreflang links`);
  });

  expect(failures).toEqual([]);
});

test("representative legacy URLs are permanent redirects to their contracted canonical targets", async ({request, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  for (const {path, target} of RELEASE_LEGACY_ROUTES) {
    const response = await request.get(path, {maxRedirects: 0});
    expect(response.status(), path).toBe(308);
    expect(new URL(response.headers().location, origin).pathname.replace(/\/$/, ""), path).toBe(target);
  }
});

test("known missing URLs stay clean 404s without a canonical", async ({request}) => {
  for (const {path} of TRAFFIC_ROUTE_CONTRACT.knownMissing) {
    const response = await request.get(path, {maxRedirects: 0});
    const html = await response.text();
    expect(response.status(), path).toBe(404);
    expect(html, path).toMatch(/noindex/i);
    expect(linkTags(html).some((tag) => relIncludes(tag, "canonical")), path).toBe(false);
  }
});
