import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";
import {expectNoHorizontalOverflow} from "./helpers";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

for (const width of [390, 1440]) {
  test(`artillery direct controls normalize bearings and remain accessible at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/en/tools/artillery-calculator");
    await page.getByRole("button", {name: "Direct Numeric", exact: true}).click();
    const distance = page.getByRole("spinbutton", {name: "Target Distance (meters)", exact: true});
    const azimuth = page.getByRole("spinbutton", {name: "Target Azimuth (0° - 360°)", exact: true});
    await expect(page.getByRole("slider", {name: "Target Distance (meters)", exact: true})).toBeVisible();
    await expect(page.getByRole("slider", {name: "Target Azimuth (0° - 360°)", exact: true})).toBeVisible();
    const bearing = page.getByText("Azimuth (Bearing)", {exact: true}).locator("..");
    for (const [value, degrees, mils] of [["720", "0.0°", "0 mil"], ["-10", "350.0°", "6222 mil"]]) {
      await azimuth.fill(value);
      await azimuth.blur();
      await expect(bearing).toContainText(degrees);
      await expect(bearing).toContainText(mils);
    }
    await distance.fill("750");
    await expect(page.getByRole("button", {name: "Fire Round (TOF Timer)", exact: true})).toBeDisabled();
    await distance.fill("380");
    await page.getByRole("button", {name: "Fire Round (TOF Timer)", exact: true}).click();
    await expect(page.getByText("Estimated impact in", {exact: true})).toBeVisible();
    await page.getByRole("button", {name: "Cancel countdown", exact: true}).click();
    await expect(page.getByRole("button", {name: "Fire Round (TOF Timer)", exact: true})).toBeEnabled();
    await expectNoHorizontalOverflow(page);
    const violations = (await new AxeBuilder({page}).include("main").analyze()).violations.filter(({impact}) => impact === "serious" || impact === "critical");
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("artillery map places both gun and target with the keyboard", async ({page}) => {
  await page.goto("/en/tools/artillery-calculator");
  const map = page.getByRole("button", {name: "Operational Theatre Map", exact: true});
  await expect(map).toHaveAccessibleDescription(/arrow keys.*Enter or Space/);
  const target = page.getByText(/^TGT:/);
  const gun = page.getByText(/^GUN:/);
  const initialTarget = await target.textContent();
  const initialGun = await gun.textContent();
  await map.focus();
  for (let i = 0; i < 3; i++) await map.press("ArrowRight");
  await map.press("Enter");
  await expect(target).not.toHaveText(initialTarget!);
  await map.press("ArrowLeft");
  await map.press("Space");
  await expect(gun).not.toHaveText(initialGun!);
  const violations = (await new AxeBuilder({page}).include("main").analyze()).violations.filter(({impact}) => impact === "serious" || impact === "critical");
  expect(violations).toEqual([]);
});

test("system checker restores decimal storage and all selected tiers after copying a link", async ({context, page, baseURL}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin: new URL(baseURL!).origin});
  await page.goto("/en/tools/system-check");
  await page.getByRole("combobox", {name: "Operating system", exact: true}).selectOption("windows-11");
  await page.getByRole("combobox", {name: "CPU comparison", exact: true}).selectOption("recommended");
  await page.getByRole("combobox", {name: "GPU comparison", exact: true}).selectOption("recommended");
  await page.getByRole("spinbutton", {name: "Installed RAM (GB)", exact: true}).fill("16.5");
  await page.getByRole("spinbutton", {name: "Free storage (GB)", exact: true}).fill("84.5");
  await page.getByRole("button", {name: "Copy result link", exact: true}).click();
  await expect(page.getByRole("button", {name: "Result link copied", exact: true})).toBeVisible();
  const sharedUrl = await page.evaluate(() => navigator.clipboard.readText());
  await page.goto(sharedUrl);
  await expect(page.getByRole("spinbutton", {name: "Free storage (GB)", exact: true})).toHaveValue("84.5");
  await expect(page.getByRole("spinbutton", {name: "Installed RAM (GB)", exact: true})).toHaveValue("16.5");
  await expect(page.getByRole("combobox", {name: "CPU comparison", exact: true})).toHaveValue("recommended");
  await expect(page.getByRole("combobox", {name: "GPU comparison", exact: true})).toHaveValue("recommended");
  await expect(page.getByText("Meets the advertised recommended tier", {exact: true})).toBeVisible();
});
