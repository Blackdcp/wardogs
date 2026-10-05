import {expect, test} from "@playwright/test";
import {getToolCopy} from "../../src/features/tools/tool-copy";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.routeWebSocket("**/*", (route) => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
});

for (const locale of ["en", "ja"] as const) {
  const copy = getToolCopy(locale);
  test(`weapon guide, catalogue, tool query and return retain ${locale}`, async ({page}) => {
    await page.goto(`/${locale}/guides/wardogs-best-weapons-loadouts`);
    await page.locator(`[data-guide-task-panel] a[href="/${locale}/items/weapons"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/items/weapons$`));
    await page.locator(`main a[href="/${locale}/items/weapons/amp-9"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/items/weapons/amp-9$`));
    await page.locator(`main a[href="/${locale}/tools/weapon-compare?left=amp-9"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/tools/weapon-compare\\?left=amp-9$`));
    await expect(page.getByRole("combobox", {name: copy.leftWeapon, exact: true})).toHaveValue("amp-9");
    const toolUrl = page.url();
    await page.locator(`[data-tool-related-guides] a[href="/${locale}/guides/wardogs-best-weapons-loadouts"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/wardogs-best-weapons-loadouts$`));
    await page.goBack();
    await expect(page).toHaveURL(toolUrl);
    await expect(page.getByRole("combobox", {name: copy.leftWeapon, exact: true})).toHaveValue("amp-9");
  });
  test(`logistics guide and planner return retain ${locale} and user stages`, async ({page}) => {
    await page.goto(`/${locale}/guides/wardogs-cargo-guide`);
    await page.locator(`[data-guide-task-panel] a[href="/${locale}/tools/logistics-planner"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/tools/logistics-planner$`));
    await page.goto(`/${locale}/tools/logistics-planner?lp_stages=construction,transport`);
    const toolUrl = page.url();
    await page.locator(`[data-tool-related-guides] a[href="/${locale}/guides/wardogs-fob-guide"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/wardogs-fob-guide$`));
    await page.goBack();
    await expect(page).toHaveURL(toolUrl);
    expect(new URL(page.url()).searchParams.get("lp_stages")).toBe("construction,transport");
    await expect(page.locator('[data-tool-related-guides]')).toBeVisible();
    await expect(page.getByRole("heading", {name: copy.selectedPlan, exact: true}).locator("..").locator("ol > li")).toHaveCount(2);
  });
  test(`artillery and map guides provide both return paths in ${locale}`, async ({page}) => {
    await page.goto(`/${locale}/guides/wardogs-artillery-guide`);
    await page.locator(`[data-guide-task-panel] a[href="/${locale}/tools/artillery-calculator"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/tools/artillery-calculator$`));
    await expect(page.locator('[data-fire-solution-panel]')).toBeVisible();
    await page.locator(`[data-tool-related-guides] a[href="/${locale}/guides/wardogs-mortar-guide"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/wardogs-mortar-guide$`));
    await page.goto(`/${locale}/guides/wardogs-map`);
    await page.locator(`[data-guide-task-panel] a[href="/${locale}/tools/map"]`).click();
    await expect(page.locator('[data-map-viewer]')).toBeVisible();
    await page.locator(`[data-tool-related-guides] a[href="/${locale}/guides/wardogs-map"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/wardogs-map$`));
  });
  test(`crash and settings return without unrelated catalogue routes in ${locale}`, async ({page}) => {
    await page.goto(`/${locale}/guides/wardogs-crash-fix`);
    await expect(page.locator('[data-guide-task-panel] a[href*="/items/"]')).toHaveCount(0);
    await page.locator(`[data-guide-task-panel] a[href="/${locale}/tools/system-check"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/tools/system-check$`));
    await expect(page.locator('[data-tool-related-guides] a[href*="/items/"]')).toHaveCount(0);
    await page.locator(`[data-tool-related-guides] a[href="/${locale}/guides/wardogs-best-settings"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/wardogs-best-settings$`));
  });
}
