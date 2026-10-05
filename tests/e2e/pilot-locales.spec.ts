import {test, expect} from "@playwright/test";
import {publicRouteUrl} from "../../src/lib/public-url";

const publicSiteBase = process.env.PILOT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
const publicPageUrl = (pathname: string) => publicSiteBase ? `${publicSiteBase}${pathname}` : publicRouteUrl(pathname);

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === origin || url.protocol === "data:" ? route.continue() : route.abort();
  });
});

for (const locale of ["zh-tw", "pl"]) {
  test(`${locale} renders complete equipment and video detail pages`, async ({page}, testInfo) => {
    for (const suffix of ["/items/weapons/deagle", "/videos/wardogs-artillery-tank-guide"]) {
      const pathname = `/${locale}${suffix}`;
      const response = await page.goto(pathname);
      expect(response?.status(), pathname).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicPageUrl(pathname));
      const size = await page.evaluate(() => ({width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth}));
      expect(size.scroll, pathname).toBeLessThanOrEqual(size.width + 1);
      await page.screenshot({path: testInfo.outputPath(`${locale}-${suffix.split("/").at(-1)}.png`), fullPage: true});
    }
  });

  test(`${locale} has a real homepage and full localized sections`, async ({page, request}, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const root = await request.get(`/${locale}`, {maxRedirects: 0});
    expect(root.status()).toBe(200);
    for (const suffix of ["", "/guides", "/items/weapons", "/tools/loadout-budget", "/tools/map", "/news", "/videos", "/privacy", "/guides/wardogs-controls"]) {
      const pathname = `/${locale}${suffix}`;
      const response = await page.goto(pathname);
      expect(response?.status(), pathname).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicPageUrl(pathname));
      await expect(page.locator(`footer a[href="/${locale}/privacy"]`)).toBeVisible();
      await expect(page.locator(`footer a[href="/${locale}/terms"]`)).toBeVisible();
      const robots = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? "").join(" "));
      expect(robots).not.toContain("noindex");
      const size = await page.evaluate(() => ({width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth}));
      expect(size.scroll, pathname).toBeLessThanOrEqual(size.width + 1);
      if (!suffix || suffix === "/guides" || suffix === "/tools/loadout-budget") {
        await page.screenshot({path: testInfo.outputPath(`${locale}${suffix.replaceAll("/", "-") || "-home"}.png`), fullPage: true});
      }
      if (!suffix) {
        await expect(page.locator("h1")).toContainText("WARDOGS");
        const images = await page.locator("main img").evaluateAll((nodes) => nodes.filter((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0).length);
        expect(images).toBeGreaterThan(0);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("preserves the page and saved URL state across all language switches", async ({page}) => {
  await page.goto("/en/guides/wardogs-controls?source=bookmark#bindings");
  await expect(page.locator("select:visible").first()).toBeEnabled();
  await page.locator("select:visible").first().selectOption("pl");
  await expect(page).toHaveURL(/\/pl\/guides\/wardogs-controls\?source=bookmark#bindings$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.locator("select:visible").first()).toBeEnabled();
  await page.locator("select:visible").first().selectOption("zh-tw");
  await expect(page).toHaveURL(/\/zh-tw\/guides\/wardogs-controls\?source=bookmark#bindings$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-tw");
  await expect(page.locator('link[hreflang="pl"]')).toHaveCount(1);
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicPageUrl("/zh-tw/guides/wardogs-controls"));
  await expect(page.locator("head title")).toHaveCount(1);
  await expect(page.locator('link[hreflang="pl"]')).toHaveAttribute("href", publicPageUrl("/pl/guides/wardogs-controls"));
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", publicPageUrl("/en/guides/wardogs-controls"));
});

test("includes complete new locales in the sitemap without duplicate URLs", async ({request}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const englishGuidePaths = urls
    .map((url) => new URL(url).pathname)
    .filter((pathname) => pathname.startsWith("/en/guides/"))
    .map((pathname) => pathname.slice("/en".length));
  expect(new Set(urls).size).toBe(urls.length);
  for (const locale of ["zh-tw", "pl"]) {
    for (const suffix of ["", "/news", "/items", "/tools/map", "/guides/wardogs-controls", "/guides/wardogs-mortar-guide"]) {
      expect(urls).toContain(publicPageUrl(`/${locale}${suffix}`));
    }
    const localizedGuidePaths = urls
      .map((url) => new URL(url).pathname)
      .filter((pathname) => pathname.startsWith(`/${locale}/guides/`))
      .map((pathname) => pathname.slice(`/${locale}`.length));
    expect(new Set(localizedGuidePaths)).toEqual(new Set(englishGuidePaths));
  }
});
