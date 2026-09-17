import {expect, test, type Page} from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
}

test("operations atlas filters sourced workflows without inventing a tactical map", async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto("/en/maps");

  await expect(page.getByRole("heading", {level: 1, name: "WARDOGS Operations Atlas"})).toBeVisible();
  await expect(page.locator("[data-atlas-entry]")).toHaveCount(7);
  await expect(page.locator('[data-atlas-visual="pending"]')).toHaveCount(2);
  await expect(page.locator('[data-atlas-visual="verified"]')).toHaveCount(1);
  await expect(page.locator('[data-atlas-visual="contextual"]')).toHaveCount(4);

  await page.getByRole("button", {name: "Logistics"}).click();
  await expect(page.locator("[data-atlas-entry]")).toHaveCount(3);
  await expect(page.locator('[data-atlas-entry="fob-network"]')).toBeVisible();
  await expect(page.locator('[data-atlas-entry="cargo-route"]')).toBeVisible();
  await expect(page.locator('[data-atlas-entry="helicopter-transport"]')).toBeVisible();
  await expect(page.locator('[data-atlas-entry="oil-rig-hot-zone"]')).toHaveCount(0);

  const sourceLinks = page.getByRole("link", {name: /Source:/});
  await expect(sourceLinks).toHaveCount(3);
  expect(await sourceLinks.evaluateAll((links) => links.every((link) => link.getAttribute("href")?.startsWith("https://")))).toBe(true);
  await expectNoHorizontalOverflow(page);
  await expect(page.locator("main")).not.toContainText(/latitude|longitude|grid reference/i);
  await page.screenshot({animations: "disabled", fullPage: true, path: "test-results/task7-atlas-mobile.png"});
});

test("Simplified Chinese atlas keeps localized navigation and exact guide targets", async ({page}) => {
  await page.goto("/zh-cn/maps");

  await expect(page.getByRole("heading", {level: 1, name: "WARDOGS 行动地图"})).toBeVisible();
  await page.getByRole("button", {name: "火力支援"}).click();
  await expect(page.locator("[data-atlas-entry]")).toHaveCount(1);
  await expect(page.locator('[data-atlas-entry="mortar-support"]')).toBeVisible();
  await expect(page.getByRole("link", {name: /打开对应攻略/})).toHaveAttribute("href", "/zh-cn/guides/wardogs-mortar-guide");
  await page.screenshot({animations: "disabled", fullPage: true, path: "test-results/task7-atlas-desktop-zh.png"});
});
