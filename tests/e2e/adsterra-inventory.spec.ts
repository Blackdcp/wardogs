import {expect, test} from "@playwright/test";
import {expectNoHorizontalOverflow} from "./helpers";

async function blockAdNetworks(page: import("@playwright/test").Page) {
  await page.route("**/arkgleamfox.com/**", (route) => route.abort("blockedbyclient"));
  await page.route("**/effectivecpmnetwork.com/**", (route) => route.abort("blockedbyclient"));
}

test("mobile inventory keeps the sticky banner visible without horizontal overflow", async ({page}) => {
  await blockAdNetworks(page);
  await page.setViewportSize({height: 844, width: 390});
  await page.goto("/en");

  await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="horizontal"]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("desktop and wide layouts expose inline and rail inventory", async ({page}) => {
  await blockAdNetworks(page);
  await page.setViewportSize({height: 1200, width: 1920});
  await page.goto("/en/guides/wardogs-gameplay");

  await expect(page.locator('[data-ad-placement="rectangle"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="left-rail"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="right-rail"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const content = await page.locator(".site-container").first().boundingBox();
  const leftRail = await page.locator('[data-ad-placement="left-rail"]').boundingBox();
  const rightRail = await page.locator('[data-ad-placement="right-rail"]').boundingBox();
  expect((leftRail?.x ?? 0) + (leftRail?.width ?? 0)).toBeLessThanOrEqual(content?.x ?? 0);
  expect(rightRail?.x ?? 0).toBeGreaterThanOrEqual((content?.x ?? 0) + (content?.width ?? 0));
});
