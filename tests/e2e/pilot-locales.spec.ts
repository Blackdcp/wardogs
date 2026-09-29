import {test, expect} from "@playwright/test";
import {readdirSync} from "node:fs";
import path from "node:path";
import {publicRouteUrl} from "../../src/lib/public-url";

// Local transport must not change the public URLs emitted by the application.
const publicSiteBase = process.env.PILOT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
const publicPageUrl = (pathname: string) => publicSiteBase ? `${publicSiteBase}${pathname}` : publicRouteUrl(pathname);

const pilotGuideSlugs = Object.fromEntries(["zh-tw", "pl"].map((locale) => [locale,
  readdirSync(path.resolve("content", locale, "guides"))
    .filter((file) => file.endsWith(".mdx")).map((file) => file.slice(0, -4))
]));

test.beforeEach(async ({page}) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net|effectivegatecpm\.com|highperformanceformat\.com|effectivecpmrate\.com/, (route) => route.abort());
});

test("serves only real pilot content, self-canonical pages and reciprocal translations", async ({page, request, baseURL}) => {
  for (const [locale, slugs] of Object.entries(pilotGuideSlugs)) {
    const root = await request.get(`/${locale}`, {maxRedirects: 0});
    expect(root.status()).toBe(308);
    expect(new URL(root.headers().location, baseURL).href).toBe(`${baseURL}/${locale}/guides`);
    for (const pathname of [`/${locale}/guides`, ...slugs.map((slug) => `/${locale}/guides/${slug}`)]) {
      const response = await page.goto(pathname);
      expect(response?.status(), pathname).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicPageUrl(pathname));
      expect(await page.locator('meta[name="robots"]').getAttribute("content")).not.toContain("noindex");
      await expect(page.locator(`footer a[href="/en/privacy"]`)).toBeVisible();
      await expect(page.locator(`footer a[href="/en/terms"]`)).toBeVisible();
    }
  }
  await page.goto("/en/guides/wardogs-money-guide");
  await expect(page.locator('link[hreflang="pl"]')).toHaveAttribute("href", publicPageUrl("/pl/guides/wardogs-money-guide"));
  await expect(page.locator('link[hreflang="zh-TW"]')).toHaveAttribute("href", publicPageUrl("/zh-tw/guides/wardogs-money-guide"));
  await page.goto("/zh-tw/guides/wardogs-controls");
  await expect(page.locator('link[hreflang="pl"]')).toHaveCount(0);
  for (const pathname of ["/pl/guides/wardogs-controls", "/zh-tw/guides/wardogs-mortar-guide", "/pl/tools/map", "/zh-tw/items", "/pl/news"]) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(404);
    expect(response.headers()["x-robots-tag"], pathname).toContain("noindex");
  }
  const xml = await (await request.get("/sitemap.xml")).text();
  const pilotLocs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).filter((url) => /\/(pl|zh-tw)\//.test(url));
  const expectedPilotUrls = Object.entries(pilotGuideSlugs).flatMap(([locale, slugs]) =>
    [`/${locale}/guides`, ...slugs.map((slug) => `/${locale}/guides/${slug}`)].map(publicPageUrl));
  expect(pilotLocs.sort()).toEqual(expectedPilotUrls.sort());
});

test("switches an unavailable translation to the pilot index and preserves real equivalents", async ({page}) => {
  await page.goto("/en/guides/wardogs-controls");
  await page.locator("select:visible").selectOption("pl");
  await expect(page).toHaveURL(/\/pl\/guides$/);
  await page.locator('main article a[href="/pl/guides/wardogs-money-guide"]').first().click();
  await expect(page).toHaveURL(/\/pl\/guides\/wardogs-money-guide$/);
  await page.locator('nav a[href="/zh-tw/guides/wardogs-money-guide"]').click();
  await expect(page).toHaveURL(/\/zh-tw\/guides\/wardogs-money-guide$/);
});

test("renders readable pilot pages and local media on desktop and mobile", async ({page}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const pathname of ["/pl/guides", "/zh-tw/guides/wardogs-medic-revive-guide", "/pl/guides/wardogs-fob-guide"]) {
    await page.goto(pathname);
    await expect(page.locator("h1")).toBeVisible();
    const size = await page.evaluate(() => ({width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth}));
    expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
    const image = page.locator("main figure img");
    if (await image.count()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    }
    await page.screenshot({path: testInfo.outputPath(`${pathname.replaceAll("/", "-")}.png`), fullPage: true});
  }
  expect(errors).toEqual([]);
});
