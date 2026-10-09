import {expect, test} from "@playwright/test";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

for (const width of [1440, 390]) {
  test(`invalid shared artillery inputs recover without a crash at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/en/tools/artillery-calculator?map=bakurani&weapon=constructor&mode=single&distance=380&azimuth=45");
    await expect(page.locator("[data-artillery-import-error]")).toContainText("incomplete or invalid");
    await expect(page.locator("[data-artillery-map-import]")).toHaveCount(0);
    await page.getByRole("button", {name: "Direct Numeric", exact: true}).click();
    await page.locator("#artillery-distance").fill("380");
    await page.locator("#artillery-azimuth").fill("45");
    await expect(page.locator("[data-artillery-import-error]")).toHaveCount(0);
    await expect(page.locator("#artillery-azimuth")).toHaveValue("45");

    await page.goto("/ja/tools/artillery-calculator?map=bakurani&weapon=mortar&mode=single&distance=380");
    await expect(page.locator("[data-artillery-import-error]")).toContainText("不完全または無効");
    await expect(page.locator("[data-artillery-map-import]")).toHaveCount(0);

    await page.goto("/en/tools/artillery-calculator?map=bakurani&weapon=mortar&mode=single&distance=380&azimuth=0&source=map");
    await expect(page.locator("[data-artillery-map-import]")).toBeVisible();
    await expect(page.locator("#artillery-azimuth")).toHaveValue("0");
    await expect(page.locator("#artillery-distance")).toHaveValue("380");
    await expect(page.locator("[data-artillery-import-error]")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
