import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";

for (const pathname of ["/en", "/en/items", "/en/items/weapons", "/en/items/vehicles"]) {
  test(`has no serious accessibility violations on ${pathname}`, async ({page}) => {
    await page.goto(pathname);
    await expect(page.locator("main")).toHaveCount(1);
    const violations = (await new AxeBuilder({page}).analyze()).violations
      .filter(({impact}) => impact === "serious" || impact === "critical");
    expect(violations).toEqual([]);
  });
}
