import AxeBuilder from "@axe-core/playwright";
import {expect, test, type Page} from "@playwright/test";
import {installDeterministicExternalMediaFallback} from "./helpers";

async function expectNoSeriousViolations(page: Page) {
  await page.evaluate(async () => {await document.fonts.ready;});
  const violations = (await new AxeBuilder({page}).analyze()).violations
    .filter(({impact}) => impact === "serious" || impact === "critical");
  expect(violations).toEqual([]);
}

for (const pathname of [
  "/en",
  "/en/guides",
  "/en/guides/wardogs-gameplay",
  "/en/items",
  "/en/items/weapons",
  "/en/items/vehicles",
  "/en/items/weapons/amp-9",
  "/en/items/vehicles/bobcat"
]) {
  test(`has no serious accessibility violations on ${pathname}`, async ({page}) => {
    await installDeterministicExternalMediaFallback(page);
    await page.goto(pathname);
    await expect(page.locator("main")).toHaveCount(1);
    await expectNoSeriousViolations(page);
  });
}

// Every tool is audited once. Alternating locale/viewport covers long labels and
// compact forms without multiplying nine pages by the full four-way matrix.
const toolCases = [
  {id: "map", locale: "en", mobile: false},
  {id: "artillery-calculator", locale: "ja", mobile: true},
  {id: "weapon-compare", locale: "ja", mobile: false},
  {id: "ammo-matcher", locale: "en", mobile: true},
  {id: "loadout-budget", locale: "en", mobile: false},
  {id: "cash-xp-calculator", locale: "ja", mobile: true},
  {id: "logistics-planner", locale: "ja", mobile: false},
  {id: "progression-route", locale: "en", mobile: true},
  {id: "system-check", locale: "en", mobile: false}
] as const;
for (const {id, locale, mobile} of toolCases) {
  test(`${locale} ${id} ${mobile ? "mobile" : "desktop"} tool has no serious accessibility violations`, async ({page}) => {
    await installDeterministicExternalMediaFallback(page);
    await page.setViewportSize(mobile ? {width: 390, height: 844} : {width: 1440, height: 900});
    await page.goto(`/${locale}/tools/${id}`);
    await expect(page.locator(`[data-tool-page-hero="${id}"]`)).toBeVisible();
    await expect(page.locator(`[data-tool-related-guides="${id}"]`)).toHaveCount(1);
    await expectNoSeriousViolations(page);
  });
}

for (const locale of ["en", "ja"] as const) {
  for (const mobile of [false, true]) {
    test(`${locale} ${mobile ? "mobile" : "desktop"} Tools hub and open search states have no serious accessibility violations`, async ({page}) => {
      await installDeterministicExternalMediaFallback(page);
      await page.setViewportSize(mobile ? {width: 390, height: 844} : {width: 1440, height: 900});
      await page.goto(`/${locale}/tools`);
      await expect(page.locator('main [data-hub-header="hub"]')).toBeVisible();
      await expectNoSeriousViolations(page);

      // Force an observable loading phase, then let the real locale index
      // complete and audit populated options rather than a closed dialog.
      let releaseIndex: () => void = () => {};
      const indexReady = new Promise<void>((resolve) => {releaseIndex = resolve;});
      await page.route(`**/api/search-index/${locale}*`, async (route) => {
        await indexReady;
        await route.continue();
      });
      const label = locale === "ja" ? "WARDOGS Wikiを検索" : "Search WARDOGS Wiki";
      const trigger = page.getByRole("button", {name: label, exact: true});
      await trigger.click();
      const dialog = page.getByRole("dialog", {name: label});
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("combobox")).toBeFocused();
      try {
        await expect(dialog.locator('svg[aria-label]')).toHaveCount(1);
        await expectNoSeriousViolations(page);
      } finally {
        releaseIndex();
      }
      await expect(dialog.locator('svg[aria-label]')).toHaveCount(0);
      if (locale === "en" && mobile) {
        await expectNoSeriousViolations(page); // Loaded index, empty input prompt.
        await dialog.getByRole("combobox").fill("zzzz-no-existing-wardogs-result");
        await expect(dialog.getByText("No maintained result matches that search. Try a broader task or category.", {exact: true})).toBeVisible();
        await expect(dialog.getByRole("option")).toHaveCount(0);
        await expectNoSeriousViolations(page);
      }
      await dialog.getByRole("combobox").fill("SPH-2");
      await expect(dialog.getByRole("option").first()).toBeVisible();
      await expectNoSeriousViolations(page);
      await dialog.getByRole("combobox").press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}

// An unavailable index is a separate template: retry button and a real guide
// link both enter the dialog's focus sequence and require an axe audit.
test("Japanese mobile search failure has no serious accessibility violations", async ({page}) => {
  await installDeterministicExternalMediaFallback(page);
  await page.setViewportSize({width: 390, height: 844});
  await page.route("**/api/search-index/ja*", (route) => route.fulfill({status: 503, body: "Unavailable"}));
  await page.goto("/ja");
  await page.locator('[data-hero-search-trigger="true"]').click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator('a[href="/ja/guides"]')).toBeVisible();
  await expectNoSeriousViolations(page);
});
