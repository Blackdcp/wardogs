import {expect, test, type Page} from "@playwright/test";

async function contained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1);
  for (const control of await page.locator("main input, main select, main button").all()) {
    if (!await control.isVisible()) continue;
    const box = await control.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1);
  }
}

function result(page: Page, label: string) {
  return page.locator("dl > div").filter({has: page.locator("dt").filter({hasText: new RegExp(`^${label}$`)})}).locator("dd");
}

test.beforeEach(async ({page}) => {
  await page.route("**/*", (route) => ["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
});

for (const width of [1440, 390]) {
  test(`budget, comparison and supplies recover shared state at ${width}px`, async ({page, context, baseURL}) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin: new URL(baseURL!).origin});
    await page.setViewportSize({width, height: 900});
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/en/tools/loadout-budget?cash=10000&loadout=3000&vehicle=0&reserve=2000");
    await expect(result(page, "Total purchases")).toHaveText("2");
    await expect(result(page, "Replacements after first purchase")).toHaveText("1");
    await page.getByRole("spinbutton", {name: "One-time costs ($)", exact: true}).fill("3000");
    await expect(result(page, "Total purchases")).toHaveText("1");

    await page.goto("/en/tools/loadout-budget?pick=weapons%2Famp-9&pick=ammo%2F9x19mm");
    await expect(page.getByRole("radio", {name: "Item list"})).toBeChecked();
    await expect(page.getByText("Incomplete total:", {exact: false})).toBeVisible();
    const units = page.getByRole("combobox", {name: "Purchase unit (user-defined)"});
    const prices = page.getByRole("spinbutton", {name: "Unit price ($, user-defined)"});
    await units.nth(0).selectOption("item");
    await units.nth(1).selectOption("pack");
    await prices.nth(0).fill("100");
    await prices.nth(1).fill("10");
    await page.getByRole("spinbutton", {name: "Quantity", exact: true}).nth(1).fill("2");
    await expect(result(page, "First purchase")).toHaveText("$120");
    await expect(page.getByRole("heading", {name: "Recorded ammunition compatibility"})).toBeVisible();
    await page.getByRole("button", {name: "Copy result link"}).click();
    await expect(page.getByText("Result link copied", {exact: true})).toBeVisible();
    const budgetUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(budgetUrl).searchParams.get("schema")).toBe("2");
    expect(new URL(budgetUrl).searchParams.get("dataVersion")).toBeTruthy();
    await page.goto(budgetUrl);
    await expect(prices.nth(0)).toHaveValue("100");
    await expect(prices.nth(1)).toHaveValue("10");
    await expect(result(page, "Total purchases")).toHaveText("66");
    await contained(page);
    await page.screenshot({path: `.tmp/tools-budget-${width}.png`, fullPage: true});

    await page.getByRole("spinbutton", {name: "Cash available"}).fill("12000");
    await page.evaluate(() => {
      window.history.pushState(null, "", "/en/tools/loadout-budget?cash=20000&loadout=3000&vehicle=0&reserve=2000");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await expect(page.getByRole("spinbutton", {name: "Cash available"})).toHaveValue("20000");

    await page.goto("/en/tools/weapon-compare?left=amp-9&right=deagle");
    await page.getByRole("searchbox", {name: "Search catalogue"}).fill("fal");
    await page.getByRole("combobox", {name: "First weapon"}).selectOption("fal");
    await page.getByRole("checkbox", {name: "Only differences"}).check();
    const comparisonUrl = page.url();
    await page.goto(comparisonUrl);
    await expect(page.getByRole("checkbox", {name: "Only differences"})).toBeChecked();
    await expect(page.getByRole("combobox", {name: "First weapon"})).toHaveValue("fal");
    await expect(page.getByRole("link", {name: "Plan in budget"}).first()).toHaveAttribute("href", /pick=weapons%2Ffal/);
    await expect.poll(() => page.locator("main img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await contained(page);
    await page.screenshot({path: `.tmp/tools-compare-${width}.png`, fullPage: true});

    await page.goto("/en/tools/logistics-planner?lp_stages=construction,transport");
    await page.getByRole("textbox", {name: "Resource unit / type"}).fill("custom supplies");
    await page.getByRole("spinbutton", {name: "Additional demand (user-defined)"}).fill("10");
    await page.getByRole("spinbutton", {name: "Effective load per trip (user-defined)"}).fill("100");
    await page.getByRole("button", {name: "Add build stage"}).click();
    await expect(result(page, "Trips needed")).toHaveText("Unknown");
    await page.getByRole("textbox", {name: "Buildable / task (user-defined)"}).fill("User FOB");
    await page.getByRole("spinbutton", {name: "Quantity", exact: true}).fill("3");
    await page.getByRole("spinbutton", {name: "Supply units per piece (user-defined)"}).fill("80");
    await expect(result(page, "Total supply demand")).toHaveText("250");
    await expect(result(page, "Trips needed")).toHaveText("3");
    await page.getByRole("button", {name: "Copy tool link"}).click();
    const supplyUrl = await page.evaluate(() => navigator.clipboard.readText());
    await page.goto(supplyUrl);
    await expect(page.getByRole("textbox", {name: "Buildable / task (user-defined)"})).toHaveValue("User FOB");
    await expect(result(page, "Trips needed")).toHaveText("3");
    await contained(page);
    await page.screenshot({path: `.tmp/tools-supplies-${width}.png`, fullPage: true});
    expect(errors).toEqual([]);
  });
}

test("long multilingual supply lists cannot produce an unrestorable share", async ({page}) => {
  await page.goto("/en/tools/logistics-planner");
  for (let index = 0; index < 9; index++) {
    await page.getByRole("button", {name: "Add build stage"}).click();
    await page.getByRole("textbox", {name: "Buildable / task (user-defined)"}).nth(index).fill("界".repeat(100));
  }
  await expect(page.getByRole("button", {name: "Copy tool link"})).toBeDisabled();
  await expect(page.getByText("This plan is too long to share.", {exact: false})).toBeVisible();
  expect(new URL(page.url()).search.length).toBeLessThanOrEqual(8001);
});
