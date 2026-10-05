import {readFileSync} from "node:fs";
import {expect, test, type Locator, type Page} from "@playwright/test";
import protection from "../../config/traffic-protected-routes.json" with {type: "json"};

const sections = ["command", "proven-demand", "live-intel", "workbench", "database", "library"];
async function settleFonts(page: Page) {
  await page.evaluate(async () => {await document.fonts.ready;});
}

async function expectFirstScreenControl(control: Locator, page: Page) {
  await expect(control).toBeVisible();
  const box = await control.boundingBox();
  expect(box, "command control must have a measurable touch area").not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  expect(await control.evaluate((element) => {
    const {left, top, width, height} = element.getBoundingClientRect();
    // The center and both vertical hit targets must resolve to this control,
    // including while the site's sticky advertisement remains enabled.
    return [0.25, 0.5, 0.75].every((fraction) => {
      const hit = document.elementFromPoint(left + width / 2, top + height * fraction);
      return hit !== null && element.contains(hit);
    });
  }), "command touch targets must not be covered by a sticky ad/header").toBe(true);
}

const viewports = [{width: 390, height: 844}, {width: 768, height: 1024}, {width: 1440, height: 900}, {width: 1920, height: 1080}];

for (const locale of ["en", "ja"] as const) {
  for (const viewport of viewports) {
    test(`${locale} has exactly six shared home sections at ${viewport.width}px`, async ({page}) => {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}`);
      await settleFonts(page);
      expect(await page.locator("main > section").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-home-section")))).toEqual(sections);
      await expect(page.locator("main [data-home-section-sentinel]")).toHaveCount(6);
      const demand = page.locator('[data-home-section="proven-demand"]');
      await expect(demand.locator("[data-protected-demand]")).toHaveCount(6);
      await expect(demand.locator(`a[href='/${locale}/items']`)).toHaveCount(1);
      await expect(demand.locator('[data-page-ad-inventory="home"]')).toHaveCount(1);
      await expect(page.locator('[data-page-ad-inventory="home"]')).toHaveCount(1);
      await expect(demand.locator('[data-ad-placement="rectangle"]')).toHaveCount(1);
      await expect(demand.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);
      await expect(page.locator('[data-home-route]')).toHaveCount(3);
      await expect(page.locator('[data-featured-tool]')).toHaveCount(4);
      await expect(page.locator('[data-hero-popular-links], [data-site-search], [data-live-event], [data-ad-slot="adsterra-smartlink"]')).toHaveCount(0);
      expect(await page.locator('[data-home-placement="command"][data-home-task]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-home-task")))).toEqual(["season2", "search", "map", "calculator", "weapons", "status"]);
      const command = page.locator('[data-home-section="command"]');
      const seasonTwo = command.locator('a[data-home-task="season2"]');
      await expect(seasonTwo).toBeVisible();
      await expect(seasonTwo).toHaveAttribute("href", `/${locale}/guides/wardogs-season-2`);
      await expect(seasonTwo.locator("time")).toHaveAttribute("datetime", "2026-10-15");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      const mainHeight = await page.locator("main").evaluate((main) => main.getBoundingClientRect().height);
      if (viewport.width < 768) expect(mainHeight / viewport.height).toBeLessThan(10);
      else expect(mainHeight / viewport.height).toBeLessThanOrEqual(6);
      if (viewport.width === 390) {
        expect(await page.evaluate(() => window.scrollY), "first-screen contract must run without scrolling").toBe(0);
        await expect(page.locator('[data-ad-placement="mobile-sticky-creative"]')).toHaveCount(1);
        await expectFirstScreenControl(command.locator('a[data-home-task="season2"]'), page);
        await expectFirstScreenControl(page.locator('[data-hero-search-trigger="true"]'), page);
        for (const task of ["map", "calculator"]) {
          await expectFirstScreenControl(command.locator(`a[data-home-task="${task}"]`), page);
        }
        // Keep the enabled mobile ad present while checking actual hit testing.
        await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toHaveCount(1);
        // The production capture is immutable. Never regenerate it from this candidate.
        const manifestPath = process.env.HOME_VISUAL_BASELINE ?? `.tmp/traffic-baseline/${protection.production.baselineRevision}/visual/manifest.json`;
        const baseline = JSON.parse(readFileSync(manifestPath, "utf8")) as {revision: string; captures: {locale: string; viewport: {width: number; height: number}; measurement: {mainHeight: number}}[]};
        expect(baseline.revision).toBe(protection.production.baselineRevision);
        const capture = baseline.captures.find((entry) => entry.locale === locale && entry.viewport.width === viewport.width && entry.viewport.height === viewport.height);
        expect(capture, "matching frozen production main-height capture").toBeDefined();
        expect(mainHeight).toBeLessThanOrEqual(capture!.measurement.mainHeight * 1.02);
      }
    });
  }
}

test("hero search opens in place and Escape restores its trigger", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en");
  const trigger = page.locator('[data-hero-search-trigger="true"]');
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await trigger.click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  await expect(dialog).toBeVisible();
  expect((await dialog.boundingBox())?.width ?? 0).toBeLessThanOrEqual(640);
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  expect((await input.boundingBox())?.height ?? 0).toBeLessThanOrEqual(52);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  await input.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("Japanese homepage preserves its frozen six guide destinations", async ({page}) => {
  await page.goto("/ja");
  const demand = page.locator('[data-home-section="proven-demand"]');
  for (const slug of ["wardogs-infantry-mode", "wardogs-squad-guide", "wardogs-mortar-guide", "wardogs-towers-guide", "wardogs-best-weapons-loadouts", "wardogs-cargo-guide"]) {
    await expect(demand.locator(`a[href='/ja/guides/${slug}'][data-home-task][data-home-placement='proven-demand']`)).toHaveCount(1);
  }
});

test("guide hub anchors lead to complete task collections", async ({page}) => {
  await page.goto("/en/guides");
  const collections = page.locator('section[id^="collection-"]');
  await expect(collections).toHaveCount(6);
  const links = await collections.locator('article a').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
  expect(new Set(links).size).toBe(links.length);
  for (const slug of ["wardogs-beginner-guide", "wardogs-money-guide", "wardogs-best-weapons-loadouts", "wardogs-mortar-guide", "wardogs-fob-guide", "wardogs-crash-fix", "wardogs-progression-wipes-guide"]) expect(links).toContain(`/en/guides/${slug}`);
  await page.locator('a[href="#collection-logistics"]').click();
  await expect(page).toHaveURL(/#collection-logistics$/);
  await expect(page.locator('#collection-logistics-title')).toBeInViewport();
});
