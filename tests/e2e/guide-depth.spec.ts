import {expect, test} from "@playwright/test";

const captureStyle = "header.sticky, [data-ad-placement='mobile-sticky'] { visibility: hidden !important; }";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.routeWebSocket("**/*", (route) => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
});

for (const width of [1440, 390]) {
  test(`guide modules and share workflows at ${width}px`, async ({page, context, baseURL}) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin: new URL(baseURL!).origin});
    await page.setViewportSize({width, height: 900});
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/en/tools/ammo-matcher?weapon=mp5&fitWeapon=mp5");
    const matrix = page.locator("[data-compatibility-matrix]");
    await expect(matrix).toBeVisible();
    await expect(matrix.getByRole("combobox", {name: "Weapon", exact: true})).toHaveValue("mp5");
    await expect(matrix.getByRole("checkbox")).toBeEnabled();
    await matrix.getByRole("checkbox").check();
    await expect(matrix.locator("tbody tr")).toHaveCount(3);
    await matrix.getByRole("button", {name: "Copy selection link"}).click();
    const shared = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(shared).searchParams.get("weapon")).toBe("mp5");
    await page.goto(shared);
    await expect(matrix.getByRole("combobox", {name: "Weapon", exact: true})).toHaveValue("mp5");
    await expect(matrix.locator("tbody tr")).toHaveCount(3);
    await matrix.locator("details").first().getByText("Evidence", {exact: true}).click();
    await expect(matrix.getByText("Purchase unit / included rounds:", {exact: false}).first()).toBeVisible();
    const ammo = page.locator("main > section").first();
    await ammo.getByRole("combobox").first().selectOption("amp-9");
    expect(new URL(page.url()).searchParams.get("fitWeapon")).toBe("mp5");
    await page.goto("/en/tools/ammo-matcher?fitWeapon=galil&fitNamed=1");
    await expect(matrix.getByRole("combobox", {name: "Weapon", exact: true})).toHaveValue("galil");
    await expect(matrix.locator("tbody tr")).toHaveCount(2);
    await matrix.screenshot({path: `.tmp/guide-depth-matrix-${width}.png`, style: captureStyle});

    await page.goto("/en/guides/wardogs-best-weapons-loadouts");
    await expect(page.locator("[data-loadout-preset]")).toHaveCount(4);
    await expect(page.getByText("Content updated", {exact: false}).first()).toBeVisible();
    const preset = page.locator("[data-loadout-preset='medic']");
    const presetHref = await preset.getByRole("link").last().getAttribute("href");
    await page.goto(presetHref!);
    await expect(page.getByRole("radio", {name: "Item list", exact: true})).toBeChecked();
    await expect(page.getByRole("combobox", {name: "Purchase unit (user-defined)"})).toHaveCount(5);
    await expect(page.getByRole("spinbutton", {name: "Unit price ($, user-defined)"}).first()).toHaveValue("");
    await page.getByRole("spinbutton", {name: "Cash available", exact: true}).fill("8000");
    await page.getByRole("combobox", {name: "Preparation template", exact: true}).selectOption("construction");
    await page.getByRole("button", {name: "Add missing items", exact: true}).click();
    await expect(page.getByRole("spinbutton", {name: "Cash available", exact: true})).toHaveValue("8000");
    await expect(page.getByRole("combobox", {name: "Purchase unit (user-defined)"})).toHaveCount(9);

    for (const slug of ["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-medic-revive-guide", "wardogs-controls"]) {
      await page.goto(`/zh-cn/guides/${slug}`);
      await expect(page.locator("[data-visual-workflow]")).toBeVisible();
      if (slug === "wardogs-cargo-guide" || slug === "wardogs-fob-guide") await expect(page.locator("[data-mission-case]")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      await page.locator("[data-workflow-image-role]").scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("[data-workflow-image-role] img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      await page.locator("[data-visual-workflow]").screenshot({path: `.tmp/guide-depth-${slug}-${width}.png`, style: captureStyle});
      const evidence = page.locator("[data-workflow-video-evidence]");
      await evidence.locator("summary").click();
      const source = evidence.locator("[data-workflow-source]").first();
      await expect(source.locator("iframe")).toHaveCount(0);
      await expect(source.locator("[data-workflow-capture-limit]")).toContainText("拍摄版本未知");
      await source.getByRole("button").click();
      const interval = slug === "wardogs-cargo-guide" ? "start=212&end=245" : slug === "wardogs-fob-guide" ? "start=35&end=75" : slug === "wardogs-medic-revive-guide" ? "start=14&end=59" : "start=394&end=410";
      await expect(source.locator("iframe")).toHaveAttribute("src", new RegExp(`youtube-nocookie\\.com/embed/.+${interval}`));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    await page.goto("/pl/guides/wardogs-progression-wipes-guide");
    await expect(page.locator("[data-progression-matrix]")).toBeVisible();
    await expect(page.locator("[data-matrix-track]")).toHaveCount(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    expect(errors).toEqual([]);
  });
}

for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]) {
  test(`guide route retains ${locale} from hub through guide to tool`, async ({page}) => {
    await page.goto(`/${locale}/guides`);
    const route = page.locator('[data-guide-route="logistics-live"]');
    await expect(route).toBeVisible();
    const guideUrl = new RegExp(`/${locale}/guides/wardogs-cargo-guide$`);
    await Promise.all([
      page.waitForURL(guideUrl, {timeout: 15_000}),
      route.locator(`a[href="/${locale}/guides/wardogs-cargo-guide"]`).click(),
    ]);
    const toolUrl = new RegExp(`/${locale}/tools/logistics-planner$`);
    await Promise.all([
      page.waitForURL(toolUrl, {timeout: 15_000}),
      page.locator(`main a[href="/${locale}/tools/logistics-planner"]`).first().click(),
    ]);
  });
}
