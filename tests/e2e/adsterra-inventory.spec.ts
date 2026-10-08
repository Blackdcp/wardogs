import {expect, test} from "@playwright/test";
import {expectNoHorizontalOverflow} from "./helpers";

async function blockAdNetworks(page: import("@playwright/test").Page) {
  await page.route("**/bauval.org/**", (route) => route.abort("blockedbyclient"));
  await page.route("**/arkgleamfox.com/**", (route) => route.abort("blockedbyclient"));
  await page.route("**/effectivecpmnetwork.com/**", (route) => route.abort("blockedbyclient"));
}

test("mobile inventory keeps the sticky banner shell visible without horizontal overflow", async ({page}) => {
  await blockAdNetworks(page);
  await page.setViewportSize({height: 844, width: 390});
  await page.goto("/en");

  await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="horizontal"]')).toHaveCount(0);
  await expect(page.locator('[data-ad-slot="adsterra-smartlink"] a')).toHaveCount(1);
  await expect(page.locator('[data-ad-placement="content-horizontal"]')).toHaveCount(0);
  await expect(page.locator('[data-ad-placement="rectangle"]')).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
});

test("desktop and wide layouts expose inline, global, and rail inventory", async ({page}) => {
  await blockAdNetworks(page);
  await page.setViewportSize({height: 1200, width: 1920});
  await page.goto("/en/guides/wardogs-gameplay");

  await expect(page.locator('[data-ad-placement="horizontal"]')).toHaveCount(1);
  await expect(page.locator('[data-ad-placement="rectangle"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="left-rail"]')).toBeVisible();
  await expect(page.locator('[data-ad-placement="right-rail"]')).toBeVisible();
  await expect(page.locator('[data-ad-slot="adsterra-smartlink"] a')).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
});


test("desktop home adds the unique 468 code inside the existing six sections", async ({page}) => {
  await blockAdNetworks(page);
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en");
  await expect(page.locator("[data-home-section]")).toHaveCount(6);
  const supplemental = page.locator('[data-ad-placement="content-horizontal"]');
  await expect(supplemental).toHaveCount(1);
  await expect(supplemental).toHaveAttribute("data-ad-unit", "c6d1a3e01dc90e01385598a3c84dcaea");
  await expect(page.locator('[data-home-section="workbench"] [data-ad-placement="content-horizontal"]')).toHaveCount(1);
  await expect(page.locator('[data-home-section="library"] [data-ad-slot="adsterra-smartlink"] a')).toHaveCount(1);
  await expect(page.locator('[data-global-ad-position="top"]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});
