import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {expect, test} from "@playwright/test";
import {getIndexableItemPaths} from "../../src/features/items/item-library";
import {ADSTERRA_SMARTLINK_URLS} from "../../src/features/ads/ad-policy";
import {getPublicSiteBase} from "../../src/lib/public-url";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://www.wardogswiki.com";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = configuredBasePath.replace(/^\/+|\/+$/g, "")
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";
const canonicalBase = getPublicSiteBase();
const previewOrigin = "http://127.0.0.1:3001";
const previewBase = `${previewOrigin}${basePath}/`;
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
const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;

function deployed(pathname: string) {
  return `${basePath}${pathname}`;
}

function getAttribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
}

function escapedText(text: string) {
  return renderToStaticMarkup(createElement("span", null, text)).slice(6, -7);
}

async function mapWithConcurrency<T, R>(values: readonly T[], limit: number, run: (value: T) => Promise<R>) {
  const results = new Array<R>(values.length);
  let cursor = 0;
  await Promise.all(Array.from({length: Math.min(limit, values.length)}, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await run(values[index]);
    }
  }));
  return results;
}

test("serves the Pages export from its deployment base", async ({page, request}) => {
  const failures: string[] = [];
  page.on("requestfailed", (failedRequest) => {
    const error = failedRequest.failure()?.errorText ?? "unknown error";
    const url = failedRequest.url();
    if (new URL(url).origin === previewOrigin && failedRequest.method() !== "HEAD" && !error.includes("ERR_ABORTED")) {
      failures.push(`${failedRequest.method()} ${url}: ${error}`);
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith(previewBase) && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(deployed("/"));
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/en/")}`);
  await expect(page.locator("main")).toHaveCount(1);

  for (const pathname of [
    "/en/",
    "/ja/",
    "/zh-tw/",
    "/pl/",
    "/en/guides/",
    "/en/tools/",
    "/ja/items/",
    "/de/items/weapons/",
    "/ru/guides/wardogs-mortar-guide/",
    "/en/guides/wardogs-gameplay/",
    "/pt-br/guides/wardogs-first-look/"
  ]) {
    const response = await page.goto(deployed(pathname));
    expect(response?.status(), pathname).toBe(200);
  }

  await page.goto(deployed("/en/guides/wardogs-gameplay/"));
  await page.locator("select:visible").selectOption("de");
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/de/guides/wardogs-gameplay/")}`);

  await page.goto(deployed("/en/"));
  const homeSections = page.locator("main > [data-home-section]");
  await expect(homeSections).toHaveCount(6);
  expect(await homeSections.evaluateAll((sections) => sections.map((section) => section.getAttribute("data-home-section")))).toEqual([
    "command",
    "proven-demand",
    "live-intel",
    "workbench",
    "database",
    "library"
  ]);
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
    const src = await image.getAttribute("src");
    const isLocalAsset = src?.startsWith(`${basePath}/`) ?? false;
    const isYouTubeThumbnail = /^https:\/\/i\.ytimg\.com\/vi\/[^/]+\/hqdefault\.jpg$/.test(src ?? "");
    expect(isLocalAsset || isYouTubeThumbnail, src ?? "missing image source").toBe(true);
  }

  const sitemap = await request.get(deployed("/sitemap.xml"));
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain(`${canonicalBase}/en/news/</loc>`);
  expect(sitemapText).toContain(`${canonicalBase}/en/tools/</loc>`);
  expect(sitemapText).toContain(`${canonicalBase}/en/guides/wardogs-gameplay/</loc>`);
  const releaseSha = process.env.WARDOGSWIKI_RELEASE_SHA;
  expect(releaseSha).toMatch(/^[0-9a-f]{40}$/);
  const revision = await request.get(deployed("/api/revision"));
  expect(revision.status()).toBe(200);
  expect(await revision.json()).toEqual({revision: releaseSha});
  expect(failures).toEqual([]);
  expect((await page.goto(deployed("/en/guides/not-a-topic/")))?.status()).toBe(404);
});

test("basePath homepage search loads the localized static index and opens a result", async ({page}) => {
  const searchRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes("/api/search-index/")) searchRequests.push(url.pathname);
  });

  await page.goto(deployed("/en/"));
  await page.locator('[data-home-task="search"]').first().click();
  const dialog = page.getByRole("dialog");
  const input = dialog.getByRole("combobox");
  await input.fill("mortar");
  await expect(dialog.getByRole("option").first()).toBeVisible();
  expect(searchRequests).toContain(`${basePath}/api/search-index/en`);
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${basePath}/en/(?:guides|items|tools)/`));
});

test("restores shared tool selections from query parameters after hydration", async ({page}) => {
  await page.goto(deployed("/en/tools/weapon-compare/?left=amp-9&right=deagle"));
  await expect(page.getByRole("combobox", {name: "First weapon"})).toHaveValue("amp-9");
  await expect(page.getByRole("combobox", {name: "Second weapon"})).toHaveValue("deagle");

  await page.goto(deployed("/en/tools/ammo-matcher/?weapon=amp-9"));
  await expect(page.getByRole("combobox", {name: "Select a weapon"})).toHaveValue("amp-9");

  await page.goto(deployed("/en/tools/progression-route/?pr_role=driver&pr_level=18"));
  await expect(page.getByRole("combobox", {name: "Role track"})).toHaveValue("driver");
  await expect(page.getByRole("spinbutton", {name: "Current level shown in your client"})).toHaveValue("18");

  await page.goto(deployed("/en/tools/logistics-planner/?lp_stages=transport%2Csupply%2Crecovery"));
  await expect(page.locator("ol > li h3")).toHaveText(["Transport", "Supply", "Recovery"]);
});

test("exports all 34 model articles in every locale with exact public URLs and real images", async ({request}) => {
  expect(modelPaths).toHaveLength(34);

  for (const locale of locales) {
    const {ads} = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as {
      ads: {sponsored: string; smartlinkCta: string; smartlinkDescription: string};
    };
    for (const {type, slug} of modelPaths) {
      const pathname = `/${locale}/items/${type}/${slug}/`;
      const canonical = `${canonicalBase}${pathname}`;
      const imagePath = `${basePath}/images/catalogue/${type}/${slug}.webp`;
      const response = await request.get(deployed(pathname));
      const html = await response.text();
      const renderedHtml = html.split("<script>self.__next_f.push")[0];
      const canonicalTags = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/g) ?? [];
      const openGraphTags = html.match(/<meta\b[^>]*\bproperty="og:url"[^>]*>/g) ?? [];
      const jsonLd = (html.match(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g) ?? []).join("\n");

      expect(response.status(), pathname).toBe(200);
      expect(existsSync(resolve("out", locale, "items", type, slug, "index.html")), pathname).toBe(true);
      expect(canonicalTags, pathname).toHaveLength(1);
      expect(getAttribute(canonicalTags[0] ?? "", "href"), pathname).toBe(canonical);
      expect(openGraphTags, pathname).toHaveLength(1);
      expect(getAttribute(openGraphTags[0] ?? "", "content"), pathname).toBe(canonical);
      expect(jsonLd, pathname).toContain(`"mainEntityOfPage":"${canonical}"`);
      expect(jsonLd, pathname).not.toMatch(/Product|Offer|AggregateRating|Rating/);
      expect(html, pathname).toContain(imagePath);
      if (basePath) {
        expect(html, pathname).not.toContain(`href="/images/catalogue/${type}/${slug}.webp"`);
        expect(html, pathname).not.toContain(`src="/images/catalogue/${type}/${slug}.webp"`);
      }
      const smartlinks = renderedHtml.match(/<aside\b[^>]*\bdata-ad-slot="adsterra-smartlink"[^>]*>[\s\S]*?<\/aside>/g) ?? [];
      expect(smartlinks, pathname).toHaveLength(1);
      const smartlink = smartlinks[0] ?? "";
      const anchors = smartlink.match(/<a\b[^>]*>/g) ?? [];
      expect(anchors, pathname).toHaveLength(1);
      const anchor = anchors[0] ?? "";
      expect(getAttribute(anchor, "data-ad-unit"), pathname).toBe(ADSTERRA_SMARTLINK_URLS[0].id);
      expect(getAttribute(anchor, "href"), pathname).toBe(ADSTERRA_SMARTLINK_URLS[0].url);
      expect(getAttribute(anchor, "target"), pathname).toBe("_blank");
      expect(getAttribute(anchor, "rel")?.split(/\s+/).sort(), pathname).toEqual(["nofollow", "noopener", "noreferrer", "sponsored"]);
      expect(smartlink, pathname).toContain(`>${escapedText(ads.sponsored)}</p>`);
      expect(smartlink, pathname).toContain(`>${escapedText(ads.smartlinkDescription)}</p>`);
      expect(smartlink, pathname).toContain(`${escapedText(ads.smartlinkCta)}<svg`);
      expect(getAttribute(anchor, "title"), pathname).toBe(escapedText(ads.smartlinkDescription));
      expect(smartlink, pathname).not.toMatch(/<script\b|\bon(?:click|load|mouseover)=/i);
      expect(renderedHtml, pathname).not.toContain(`data-ad-unit="${ADSTERRA_SMARTLINK_URLS[1].id}"`);
      expect(renderedHtml, pathname).not.toMatch(/NEXT_HTTP_ERROR_FALLBACK|<title>404|Page not found/i);

      const image = await request.get(imagePath);
      expect(image.status(), imagePath).toBe(200);
      expect(image.headers()["content-type"], imagePath).toBe("image/webp");
      expect((await image.body()).byteLength, imagePath).toBeGreaterThan(0);
    }
  }
});

test("model Smartlink opens the configured advertiser only after its labelled CTA is clicked", async ({page, context}) => {
  const destination = ADSTERRA_SMARTLINK_URLS[0].url;
  let destinationRequests = 0;
  await context.route(destination, (route) => {
    destinationRequests += 1;
    return route.fulfill({contentType: "text/html", body: "Local sponsored destination fixture"});
  });
  await page.goto(deployed("/en/items/weapons/a-91/"));
  const slot = page.locator('[data-ad-slot="adsterra-smartlink"]');
  const cta = slot.getByRole("link", {name: "Open sponsored link", exact: true});
  await expect(slot).toHaveCount(1);
  await expect(cta).toHaveAttribute("href", destination);
  await expect(cta).toHaveAttribute("target", "_blank");
  await page.locator("main h1").click();
  await cta.scrollIntoViewIfNeeded();
  expect(destinationRequests).toBe(0);
  expect(context.pages()).toHaveLength(1);

  const popupPromise = context.waitForEvent("page");
  await cta.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(destination);
  await expect(popup.locator("body")).toHaveText("Local sponsored destination fixture");
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  expect(destinationRequests).toBe(1);
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/en/items/weapons/a-91/")}`);
  await popup.close();
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

test("exports localized copies of every new model", async ({request}) => {
  const probes = locales.flatMap((locale) =>
    modelPaths.map(({type, slug}) => ({locale, type, slug}))
  );

  expect(probes).toHaveLength(272);
  await Promise.all(probes.map(async ({locale, type, slug}) => {
    const pathname = `/${locale}/items/${type}/${slug}/`;
    expect(existsSync(resolve("out", locale, "items", type, slug, "index.html")), pathname).toBe(true);
    expect((await request.get(deployed(pathname))).status(), pathname).toBe(200);
  }));
});

test("locale switching uses only exported item routes", async ({page}) => {
  await page.route("**/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js", (route) => route.abort("failed"));

  await page.goto(deployed("/en/items/vehicles/bobcat/"));
  await page.locator("select:visible").selectOption("ru");
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/ru/items/vehicles/bobcat/")}`);

  await page.goto(deployed("/en/items/weapons/mortar/"));
  await page.locator("select:visible").selectOption("ru");
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/ru/items/weapons/mortar/")}`);
  await page.locator("select:visible").selectOption("de");
  await expect(page).toHaveURL(`${previewOrigin}${deployed("/de/items/weapons/mortar/")}`);
});

test("crawls every catalogue-facing internal link across all locales", async ({page, request}) => {
  test.setTimeout(180_000);
  const categories = ["weapons", "vehicles", "ammo", "attachments", "gear", "equipment", "loadouts"] as const;
  const sourcePaths = [
    ...locales.flatMap((locale) => [
      `/${locale}/`,
      `/${locale}/items/`,
      ...categories.map((category) => `/${locale}/items/${category}/`)
    ]),
    ...getIndexableItemPaths().map(({locale, type, slug}) => `/${locale}/items/${type}/${slug}/`)
  ];
  const internalTargets = new Set<string>();
  const sourceFailures: string[] = [];

  for (const pathname of sourcePaths) {
    const response = await page.goto(deployed(pathname));
    if (response?.status() !== 200) sourceFailures.push(`${response?.status() ?? "no response"} ${pathname}`);
    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href)
    );
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== previewOrigin || !url.pathname.startsWith(`${basePath}/`)) continue;
      internalTargets.add(`${url.pathname}${url.search}`);
    }
  }

  const targetFailures = (await mapWithConcurrency([...internalTargets], 8, async (pathname) => {
    const response = await request.get(pathname);
    return response.status() >= 400 ? `${response.status()} ${pathname}` : null;
  })).filter((failure): failure is string => failure !== null);

  expect(sourceFailures).toEqual([]);
  expect(internalTargets.size).toBeGreaterThan(80);
  expect(targetFailures).toEqual([]);
});
