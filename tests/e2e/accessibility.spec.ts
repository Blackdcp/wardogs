import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";
import {expectAdSlotsTerminal, installDeterministicAdFallback} from "./helpers";

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
    await installDeterministicAdFallback(page);
    await page.goto(pathname);
    await expect(page.locator("main")).toHaveCount(1);
    await expectAdSlotsTerminal(page);
    const violations = (await new AxeBuilder({page}).analyze()).violations
      .filter(({impact}) => impact === "serious" || impact === "critical");
    expect(violations).toEqual([]);
  });
}
