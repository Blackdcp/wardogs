import {expect, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.route("**/*", (route) => {
    const hostname = new URL(route.request().url()).hostname;
    return ["127.0.0.1", "localhost"].includes(hostname) ? route.continue() : route.abort();
  });
});

for (const locale of ["en", "ja"] as const) {
  for (const width of [390, 1440]) {
    test(`${locale} home preserves the hero and current tasks at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height: 900});
      await page.goto(`/${locale}`);
      await expect(page.locator("#home-hero-title")).toHaveText("WARDOGS Wiki");
      const hero = page.locator('img[src*="wardogs-hero"]');
      await expect(hero).toBeVisible();
      await expect.poll(() => hero.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const summary = page.locator("[data-live-event]");
      await expect(summary).toContainText(locale === "ja" ? "10月15日" : "October 15");
      await expect(summary.locator('a[href$="/guides/wardogs-season-2"]')).toBeVisible();
      const guideHub = page.locator("[data-home-section='guide-hub']");
      await expect(guideHub).toBeVisible();
      await expect(guideHub.locator("[data-home-tools] a[href$='/tools/map']")).toBeVisible();
      if (locale === "ja") {
        await expect(guideHub.locator("[data-home-recovery='ja'] a[href$='/guides/wardogs-helicopter-guide']")).toBeVisible();
      } else {
        await expect(guideHub.locator("a[href$='/guides#collection-combat']")).toBeVisible();
      }
      if (width === 390) {
        await page.getByRole("button", {name: locale === "ja" ? "広告を閉じる" : "Close advertisement", exact: true}).click();
        await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toHaveCount(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      await page.screenshot({path: `.tmp/growth-home-${locale}-${width}-viewport.png`});
      await page.screenshot({path: `.tmp/growth-home-${locale}-${width}.png`, fullPage: true});
    });
  }
}

test("creator sources load an optional player without inventing playback verification", async ({page}) => {
  await page.setViewportSize({width: 390, height: 900});
  await page.goto("/en/videos");
  const candidates = page.locator("#creator-candidates article");
  await expect(candidates).toHaveCount(14);
  await expect(page.locator("#creator-candidates iframe")).toHaveCount(0);
  await page.getByRole("button", {name: "Close advertisement", exact: true}).click();
  await candidates.first().getByRole("button").click();
  await expect(candidates.first().locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await candidates.first().getByRole("button").click();
  await expect(page.locator("#creator-candidates iframe")).toHaveCount(0);
  await page.locator("#creator-candidates").scrollIntoViewIfNeeded();
  await page.screenshot({path: ".tmp/growth-video-mobile.png"});
});
