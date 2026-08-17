import {existsSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "@playwright/test";

const basePath = "/wardogs";
const canonicalBase = "https://blackdcp.github.io/wardogs";
const weaponModels = [
  "a-91", "ak74", "amp-9", "amr-50", "bmr-308", "bushmaster-m17s", "compound-bow",
  "deagle", "fal", "galil", "ggx-17", "ggx-18", "judge", "kh-2002"
] as const;
const vehicleModels = [
  "ah-6m-miniguns", "ah-6r-rockets", "bobcat", "dune-buggy", "flakpanzer-gepard",
  "havoc", "humvee-m249", "humvee-minigun", "humvee", "kodiak-m249",
  "kodiak-pickup", "kodiak", "l2a6", "mh-6", "sph-2", "uh-1y-miniguns",
  "uh-1y", "ural-defender-m249", "ural-defender", "ural"
] as const;
const modelPaths = [
  ...weaponModels.map((slug) => ({type: "weapons" as const, slug})),
  ...vehicleModels.map((slug) => ({type: "vehicles" as const, slug}))
];

function deployed(pathname: string) {
  return `${basePath}${pathname}`;
}

function getAttribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
}

test("serves the Pages export from its deployment base", async ({page, request}) => {
  const failures: string[] = [];
  page.on("requestfailed", (failedRequest) => {
    const error = failedRequest.failure()?.errorText ?? "unknown error";
    const url = failedRequest.url();
    const isAnalyticsProbe = url.startsWith("https://www.googletagmanager.com/gtag/js");
    if (failedRequest.method() !== "HEAD" && !error.includes("ERR_ABORTED")) {
      if (!isAnalyticsProbe || !error.includes("ERR_BLOCKED_BY_ORB")) {
        failures.push(`${failedRequest.method()} ${url}: ${error}`);
      }
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:3001/wardogs/") && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(deployed("/"));
  await expect(page).toHaveURL(/\/wardogs\/en\/$/);
  await expect(page.locator("main")).toHaveCount(1);

  for (const pathname of [
    "/en/",
    "/en/guides/",
    "/en/guides/wardogs-gameplay/",
    "/pt-br/guides/wardogs-first-look/"
  ]) {
    const response = await page.goto(deployed(pathname));
    expect(response?.status(), pathname).toBe(200);
  }

  await page.goto(deployed("/en/guides/wardogs-gameplay/"));
  await page.locator("select:visible").selectOption("de");
  await expect(page).toHaveURL(/\/wardogs\/de\/guides\/wardogs-gameplay\/$/);

  await page.goto(deployed("/en/"));
  const localLinks = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(localLinks.some((href) => href?.startsWith(`${basePath}/en/items/`))).toBe(true);
  expect(localLinks.filter((href) => href?.includes("/items/")).every((href) => href?.startsWith(`${basePath}/`))).toBe(true);
  await expect(page.locator(`link[rel="icon"][href="${basePath}/icons/favicon.ico"]`)).toHaveCount(1);
  await expect(page.locator(`link[rel="manifest"][href="${basePath}/site.webmanifest"]`)).toHaveCount(1);

  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    expect(await image.getAttribute("src")).toMatch(/^\/wardogs\//);
  }

  const sitemap = await request.get(deployed("/sitemap.xml"));
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain(`${canonicalBase}/en/news/</loc>`);
  expect(sitemapText).toContain(`${canonicalBase}/en/guides/wardogs-gameplay/</loc>`);
  expect(failures).toEqual([]);
  expect((await page.goto(deployed("/en/guides/not-a-topic/")))?.status()).toBe(404);
});

test("exports all 34 English model articles with exact public URLs and real images", async ({request}) => {
  expect(modelPaths).toHaveLength(34);

  for (const {type, slug} of modelPaths) {
    const pathname = `/en/items/${type}/${slug}/`;
    const canonical = `${canonicalBase}${pathname}`;
    const imagePath = `${basePath}/images/catalogue/${type}/${slug}.webp`;
    const response = await request.get(deployed(pathname));
    const html = await response.text();
    const renderedHtml = html.split("<script>self.__next_f.push")[0];
    const canonicalTags = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/g) ?? [];
    const openGraphTags = html.match(/<meta\b[^>]*\bproperty="og:url"[^>]*>/g) ?? [];
    const jsonLd = (html.match(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g) ?? []).join("\n");

    expect(response.status(), pathname).toBe(200);
    expect(existsSync(resolve("out", "en", "items", type, slug, "index.html")), pathname).toBe(true);
    expect(canonicalTags, pathname).toHaveLength(1);
    expect(getAttribute(canonicalTags[0] ?? "", "href"), pathname).toBe(canonical);
    expect(openGraphTags, pathname).toHaveLength(1);
    expect(getAttribute(openGraphTags[0] ?? "", "content"), pathname).toBe(canonical);
    expect(jsonLd, pathname).toContain(`"mainEntityOfPage":"${canonical}"`);
    expect(jsonLd, pathname).not.toMatch(/Product|Offer|AggregateRating|Rating/);
    expect(html, pathname).toContain(imagePath);
    expect(html, pathname).not.toContain(`href="/images/catalogue/${type}/${slug}.webp"`);
    expect(html, pathname).not.toContain(`src="/images/catalogue/${type}/${slug}.webp"`);
    expect(html.match(/data-ad-slot="adsterra-native"/g), pathname).toHaveLength(1);
    expect(renderedHtml, pathname).not.toMatch(/NEXT_HTTP_ERROR_FALLBACK|<title>404|Page not found/i);

    const image = await request.get(imagePath);
    expect(image.status(), imagePath).toBe(200);
    expect(image.headers()["content-type"], imagePath).toBe("image/webp");
    expect((await image.body()).byteLength, imagePath).toBeGreaterThan(0);
  }
});

test("uses exact Pages model hrefs on home, hub, cards, and catalogue tables", async ({page}) => {
  const homepageModels = [
    "/en/items/weapons/a-91/",
    "/en/items/weapons/amp-9/",
    "/en/items/vehicles/bobcat/",
    "/en/items/vehicles/l2a6/"
  ];
  const hubModels = [
    "/en/items/weapons/a-91/",
    "/en/items/weapons/amp-9/",
    "/en/items/weapons/compound-bow/",
    "/en/items/vehicles/bobcat/",
    "/en/items/vehicles/l2a6/",
    "/en/items/vehicles/uh-1y/"
  ];

  await page.goto(deployed("/en/"));
  for (const pathname of homepageModels) {
    await expect(page.locator(`[data-catalogue-model-entry] a[href="${deployed(pathname)}"]`), pathname).toHaveCount(1);
  }

  await page.goto(deployed("/en/items/"));
  for (const pathname of hubModels) {
    await expect(page.locator(`[data-catalogue-preview] a[href="${deployed(pathname)}"]`), pathname).toHaveCount(1);
  }

  for (const [type, slugs] of [["weapons", weaponModels], ["vehicles", vehicleModels]] as const) {
    await page.goto(deployed(`/en/items/${type}/`));
    for (const slug of slugs) {
      const href = deployed(`/en/items/${type}/${slug}/`);
      await expect(page.locator(`[data-catalogue-record="${slug}"] > a[href="${href}"]`), `card ${href}`).toHaveCount(1);
      await expect(page.locator(`table a[href="${href}"]`), `table ${href}`).toHaveCount(1);
    }
  }
});

test("does not export unsupported localized copies of any new model", async ({request}) => {
  const probes = ["ru", "de", "pt-br"].flatMap((locale) =>
    modelPaths.map(({type, slug}) => ({locale, type, slug}))
  );

  expect(probes).toHaveLength(102);
  await Promise.all(probes.map(async ({locale, type, slug}) => {
    const pathname = `/${locale}/items/${type}/${slug}/`;
    expect(existsSync(resolve("out", locale, "items", type, slug, "index.html")), pathname).toBe(false);
    expect((await request.get(deployed(pathname))).status(), pathname).toBe(404);
  }));
});
