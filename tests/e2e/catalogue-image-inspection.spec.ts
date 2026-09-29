import {expect, test} from "@playwright/test";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

for (const viewport of [{width: 1280, height: 900}, {width: 375, height: 812}]) {
  test(`image audit stays tucked inside inspection at ${viewport.width}px`, async ({page}, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/en/items/weapons/mortar");
    const trigger = page.getByRole("button", {name: /^Inspect image:/});
    await trigger.click();
    const dialog = page.getByRole("dialog");
    const image = dialog.locator("[data-item-full-image]");
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    const audit = dialog.locator("[data-item-image-provenance] [data-image-inspection]");
    await expect(audit).toHaveJSProperty("open", false);
    await expect(audit.locator("dl")).not.toBeVisible();
    await expect(dialog.locator("[data-item-image-provenance]")).toContainText("The complete mortar, sandbag pit, and in-game ENTER Mortar interaction");
    await page.screenshot({path: testInfo.outputPath("inspection-collapsed.png")});
    const before = await image.evaluate((element) => ({width: element.clientWidth, height: element.clientHeight}));
    await audit.locator("summary").click();
    await expect(audit.locator("dl")).toBeVisible();
    await expect(audit).toContainText("not our capture");
    await expect(audit).toContainText("current build not verified");
    await expect(audit).toContainText("No rights-holder permission evidence attached");
    expect(await image.evaluate((element) => ({width: element.clientWidth, height: element.clientHeight}))).toEqual(before);
    expect(await audit.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.screenshot({path: testInfo.outputPath("inspection-expanded.png")});
    await audit.locator("summary").click();
    await expect(audit).toHaveJSProperty("open", false);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}
