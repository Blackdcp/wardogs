import {expect, test, type Page} from "@playwright/test";

const mobileViewport = {width: 375, height: 812};

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
}

test("mobile progression and logistics tools keep ordered share state", async ({context, page}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin: "http://127.0.0.1:3000"});
  await page.setViewportSize(mobileViewport);

  await page.goto("/en/tools/progression-route?pr_role=driver&pr_level=18");
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("combobox", {name: "Role track"})).toHaveValue("driver");
  await expect(page.getByRole("spinbutton", {name: "Current level shown in your client"})).toHaveValue("18");
  await expect(page.getByText("Verified: Sep 9, 2026").first()).toBeVisible();
  await expect(page.getByRole("link", {name: "Open official Season 1 source"})).toHaveAttribute("href", /store\.steampowered\.com/);

  await page.getByRole("combobox", {name: "Role track"}).selectOption("pilot");
  await page.getByRole("spinbutton", {name: "Current level shown in your client"}).fill("22");
  await expect(page).toHaveURL(/pr_role=pilot&pr_level=22$/);
  await page.getByRole("button", {name: "Copy tool link"}).click();
  await expect(page.getByRole("button", {name: "Tool link copied"})).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());

  await page.goto("/en/tools/logistics-planner?lp_stages=transport%2Csupply%2Crecovery");
  await expectNoHorizontalOverflow(page);
  const stageNames = () => page.locator("ol > li > div h3").allTextContents();
  expect(await stageNames()).toEqual(["Transport", "Supply", "Recovery"]);
  const recoveryStage = page.locator("ol > li").filter({has: page.getByRole("heading", {name: "Recovery"})});
  await expect(recoveryStage.getByText("Unknown")).toBeVisible();
  await expect(recoveryStage.getByRole("link", {name: "Open official Season 1 source"})).toHaveCount(0);
  await expect(recoveryStage.getByText("Source class: Official")).toHaveCount(0);

  await page.getByRole("button", {name: "Move earlier: Supply"}).click();
  await expect(page).toHaveURL(/lp_stages=supply%2Ctransport%2Crecovery$/);
  expect(await stageNames()).toEqual(["Supply", "Transport", "Recovery"]);
  await page.getByRole("checkbox", {name: "Recovery"}).uncheck();
  await expect(page).toHaveURL(/lp_stages=supply%2Ctransport$/);
  await page.getByRole("button", {name: "Copy tool link"}).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
});

test("invalid repeated progression state recovers identically in SSR and hydration", async ({browser}) => {
  const invalidUrl = "/en/tools/progression-route?pr_role=medic&pr_role=pilot&pr_level=8&pr_level=9";

  const serverContext = await browser.newContext({javaScriptEnabled: false, viewport: mobileViewport});
  const serverPage = await serverContext.newPage();
  await serverPage.goto(invalidUrl);
  await expect(serverPage.getByRole("combobox", {name: "Role track"})).toHaveValue("assault");
  await expect(serverPage.getByRole("spinbutton", {name: "Current level shown in your client"})).toHaveValue("");
  await serverContext.close();

  const hydratedContext = await browser.newContext({viewport: mobileViewport});
  const hydratedPage = await hydratedContext.newPage();
  const hydrationErrors: string[] = [];
  hydratedPage.on("console", (message) => {
    if (message.type() === "error" && /hydration|did not match|server rendered/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await hydratedPage.goto(invalidUrl);
  await expect(hydratedPage.getByRole("combobox", {name: "Role track"})).toHaveValue("assault");
  await expect(hydratedPage.getByRole("spinbutton", {name: "Current level shown in your client"})).toHaveValue("");
  expect(hydrationErrors).toEqual([]);
  await hydratedContext.close();
});
