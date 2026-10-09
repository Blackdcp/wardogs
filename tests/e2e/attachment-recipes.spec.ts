import {expect, test} from "@playwright/test";
import {getAttachmentRecipeCopy} from "../../src/features/tools/attachment-recipe-copy";
import {getAttachmentRecordCopy} from "../../src/features/tools/attachment-record-copy";
import {getToolCopy} from "../../src/features/tools/tool-copy";
import {getWorkbenchCopy} from "../../src/features/tools/workbench-copy";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.routeWebSocket("**/*", (route) => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin});
});

for (const {locale, width} of [{locale: "en" as const, width: 1440}, {locale: "ja" as const, width: 390}]) {
  test(`attachment recipes preserve unknowns and reproducible observations in ${locale} at ${width}px`, async ({page}) => {
    const t = getAttachmentRecipeCopy(locale);
    const copy = getToolCopy(locale);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({width, height: 900});
    await page.goto(`/${locale}/tools/loadout-budget`);
    const panel = page.locator("#attachment-tests");
    await panel.locator("summary").click();
    await panel.getByRole("button", {name: `${t.apply}: ${t.recipes[0]}`, exact: true}).click();
    await expect(panel.getByRole("heading", {name: `${t.observation}: ${t.recipes[0]}`, exact: true})).toBeVisible();
    await page.getByRole("textbox", {name: getWorkbenchCopy(locale).build, exact: true}).fill("Observed test build");
    await panel.getByRole("spinbutton", {name: t.range, exact: true}).fill("40");
    await panel.getByRole("textbox", {name: t.optic, exact: true}).fill("Recorded optic");
    await panel.getByRole("textbox", {name: t.ammo, exact: true}).fill("Recorded ammunition");
    await panel.getByRole("combobox", {name: t.stance, exact: true}).selectOption("crouched");
    await panel.getByRole("combobox", {name: t.bipod, exact: true}).selectOption("stowed");
    await panel.getByRole("spinbutton", {name: t.magazine, exact: true}).fill("30");
    await panel.getByRole("spinbutton", {name: t.ads, exact: true}).fill("180");
    await panel.getByRole("textbox", {name: t.notes, exact: true}).fill("Three repeats; source advice tested separately");
    await page.getByRole("button", {name: copy.share, exact: true}).click();
    await expect(page.getByText(copy.copied, {exact: true})).toBeVisible();
    const shared = await page.evaluate(() => navigator.clipboard.readText());
    const params = new URL(shared).searchParams;
    expect(JSON.parse(params.get("attachmentTest")!)).toMatchObject({recipeId: "evo-m4-control", rangeMeters: 40, adsMilliseconds: 180, stance: "crouched", notes: "Three repeats; source advice tested separately"});
    const lines = JSON.parse(params.get("lines")!);
    expect(lines).toHaveLength(3);
    expect(lines.every((line: {unitPrice: unknown; unitWeight: unknown}) => line.unitPrice === null && line.unitWeight === null)).toBe(true);
    await page.goto(shared);
    await expect(panel.getByRole("spinbutton", {name: t.ads, exact: true})).toHaveValue("180");
    await expect(panel.getByRole("textbox", {name: t.notes, exact: true})).toHaveValue("Three repeats; source advice tested separately");
    await panel.screenshot({path: `.tmp/attachment-recipes-${locale}-${width}.png`});
    await panel.getByRole("button", {name: `${t.apply}: ${t.recipes[1]}`, exact: true}).click();
    await expect(panel.getByRole("status")).toHaveText(t.conflict);
    await expect(panel.getByRole("spinbutton", {name: t.ads, exact: true})).toHaveValue("180");
    await panel.getByRole("textbox", {name: t.ammo, exact: true}).fill("Changed ammunition");
    await expect(panel.getByRole("spinbutton", {name: t.ads, exact: true})).toHaveValue("");
    await panel.getByRole("button", {name: t.clear, exact: true}).click();
    await expect(panel.getByRole("spinbutton", {name: t.range, exact: true})).toHaveValue("");
    await expect(panel.getByRole("textbox", {name: t.notes, exact: true})).toHaveValue("");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    for (const control of await panel.locator("input, select, textarea, button").all()) {
      if (!await control.isVisible()) continue;
      const box = (await control.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
    await page.goto(`/${locale}/tools/ammo-matcher?fitKind=muzzle&fitWeapon=ak74&fitNamed=1#equipment-compatibility`);
    const matrix = page.locator("#equipment-compatibility");
    await expect(matrix.locator('select').nth(1)).toHaveValue("muzzle");
    await expect(matrix.locator('tr[data-fit="unknown"]')).toHaveCount(2);
    await expect(matrix.getByText(`CQB74 · ${t.muzzle}`, {exact: true})).toBeVisible();
    await expect(matrix.getByText(`PBS4 · ${t.muzzle}`, {exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    expect(errors).toEqual([]);
  });
}

for (const {locale, width} of [{locale: "en" as const, width: 1440}, {locale: "ja" as const, width: 390}]) {
  test(`custom attachment identity remains paired with measurements through save, restore and share in ${locale}`, async ({page}) => {
    const t = getAttachmentRecipeCopy(locale);
    const record = getAttachmentRecordCopy(locale);
    const saved = getWorkbenchCopy(locale);
    const tool = getToolCopy(locale);
    await page.setViewportSize({width, height: 900});
    await page.goto(`/${locale}/tools/loadout-budget`);
    const panel = page.locator("#attachment-tests");
    await panel.locator("summary").click();
    await panel.getByRole("button", {name: record.start, exact: true}).click();
    await expect(panel.getByText(record.note, {exact: true})).toBeVisible();
    const ads = panel.getByRole("spinbutton", {name: t.ads, exact: true});
    await expect(ads).toBeDisabled();
    await panel.getByRole("textbox", {name: record.weapon, exact: true}).fill("M249 SAW");
    await expect(ads).toBeEnabled();
    await panel.getByRole("textbox", {name: record.grip, exact: true}).fill("TDG");
    await panel.getByRole("textbox", {name: record.muzzle, exact: true}).fill("none");
    await page.getByRole("textbox", {name: saved.build, exact: true}).fill("Recorded build A");
    await panel.getByRole("combobox", {name: t.bipod, exact: true}).selectOption("mounted");
    await ads.fill("240");
    const saves = page.locator("details").filter({has: page.locator("summary").filter({hasText: saved.saves})}).last();
    await saves.locator("summary").click();
    await saves.getByRole("textbox", {name: saved.name, exact: true}).fill("LMG test A");
    await saves.getByRole("button", {name: saved.save, exact: true}).click();
    await expect(saves.getByRole("status")).toHaveText(saved.saved);
    await panel.getByRole("textbox", {name: record.weapon, exact: true}).fill("PKM");
    await expect(ads).toHaveValue("");
    await ads.fill("300");
    await saves.getByRole("listitem").filter({hasText: "LMG test A"}).getByRole("button", {name: saved.restore, exact: true}).click();
    await expect(panel.getByRole("textbox", {name: record.weapon, exact: true})).toHaveValue("M249 SAW");
    await expect(ads).toHaveValue("240");
    await page.getByRole("button", {name: tool.share, exact: true}).click();
    await expect(page.getByText(tool.copied, {exact: true})).toBeVisible();
    const shared = await page.evaluate(() => navigator.clipboard.readText());
    expect(JSON.parse(new URL(shared).searchParams.get("attachmentTest")!)).toMatchObject({recipeId: "custom", weapon: "M249 SAW", grip: "TDG", muzzle: "none", adsMilliseconds: 240});
    await page.goto(shared);
    await expect(panel.getByRole("textbox", {name: record.weapon, exact: true})).toHaveValue("M249 SAW");
    await expect(ads).toHaveValue("240");
    await panel.getByRole("button", {name: `${t.apply}: ${t.recipes[0]}`, exact: true}).click();
    await expect(panel.getByRole("textbox", {name: record.weapon, exact: true})).toHaveValue("M4");
    await expect(panel.getByRole("textbox", {name: record.grip, exact: true})).toHaveValue("RVG");
    await expect(ads).toHaveValue("");
    await ads.fill("180");
    await panel.getByRole("textbox", {name: record.muzzle, exact: true}).fill("Another muzzle");
    await expect(ads).toHaveValue("");
    await expect(panel.getByRole("heading", {name: `${t.observation}: ${record.title}`, exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}
