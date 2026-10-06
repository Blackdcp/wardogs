import {expect, test} from "@playwright/test";

test.setTimeout(90_000);

async function installFixedCreativeFixture(page: import("@playwright/test").Page) {
  // Paint test creatives without adding children to React's hydrating tree.
  await page.addStyleTag({content: `
    [data-ad-placement]::after, [data-ad-slot="adsterra-native"]::after {
      content: "ADVERTISEMENT";
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 90px;
      width: 100%;
      background: #111512;
      border: 1px solid #46534d;
      color: #82938a;
      font: 10px sans-serif;
    }
    [data-ad-placement="mobile-sticky"]::after { min-height: 50px; }
  `});
}

async function expectNoOverlap(page: import("@playwright/test").Page, target: import("@playwright/test").Locator) {
  await target.scrollIntoViewIfNeeded();
  const [targetBox, adBox] = await Promise.all([
    target.boundingBox(),
    page.locator('[data-ad-placement="mobile-sticky"]').boundingBox()
  ]);
  expect(targetBox).not.toBeNull();
  expect(adBox).not.toBeNull();
  const overlaps = Boolean(targetBox && adBox
    && targetBox.x < adBox.x + adBox.width
    && targetBox.x + targetBox.width > adBox.x
    && targetBox.y < adBox.y + adBox.height
    && targetBox.y + targetBox.height > adBox.y);
  expect(overlaps).toBe(false);
}

for (const viewport of [{width: 390, height: 844}, {width: 1700, height: 1000}]) {
  test("ad slots render correctly at " + viewport.width + "px", async ({page, context}) => {
    await page.setViewportSize(viewport);
    await context.route("https://bauval.org/**", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: 'console.log("Mock adsterra script loaded");'
      })
    );

    await page.goto("/en/guides/wardogs-artillery-guide");
    await installFixedCreativeFixture(page);

    const nativeSlot = page.locator('[data-ad-slot="adsterra-native"]');
    await expect(nativeSlot).toBeVisible();
    const nativeContainer = page.locator("#container-481d6501bcd0c27b98bc3c4776a26f6e");
    await expect(nativeContainer).toHaveCount(1);

    const rectangleSlot = page.locator('[data-ad-placement="rectangle"]');
    await expect(rectangleSlot).toBeVisible();
    const rectangleUnit = page.locator('[data-adsterra-unit="3342dc928824e6ed5c01555e7f9e9e0f"]');
    await expect(rectangleUnit).toHaveCount(1);

    if (viewport.width === 390) {
      const mobile = page.locator('[data-ad-placement="mobile-sticky"]');
      await expect(mobile).toBeVisible();
      await page.getByRole("button", {name: "Close advertisement", exact: true}).click();
      await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toHaveCount(0);
    } else {
      await expect(page.locator('[data-ad-placement="left-rail"]')).toBeVisible();
      await expect(page.locator('[data-ad-placement="right-rail"]')).toBeVisible();
    }
  });
}

test("fixed mobile creatives do not cover homepage search, tasks, navigation, or the dismiss control", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/en");
  await installFixedCreativeFixture(page);

  const sticky = page.locator('[data-ad-placement="mobile-sticky"]');
  await expect(sticky).toBeVisible();
  await expectNoOverlap(page, page.locator("header").first());
  await expectNoOverlap(page, page.locator('[data-home-task="search"]').first());
  await expectNoOverlap(page, page.locator("[data-home-task]:visible").nth(1));
  await expect(page.getByRole("button", {name: "Close advertisement", exact: true})).toBeVisible();
});

test("client route changes keep one inline inventory shell per page", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/en");
  await expect(page.locator('[data-page-ad-inventory="home"]')).toHaveCount(1);
  await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);

  await page.locator('a[href="/en/guides"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/guides\/?$/);
  await expect(page.locator('[data-page-ad-inventory="guides"]')).toHaveCount(1);
  await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);

  await page.locator('a[href="/en/items"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/items\/?$/);
  await expect(page.locator('[data-page-ad-inventory="items"]')).toHaveCount(1);
  await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);
  await expect(page.locator("#container-481d6501bcd0c27b98bc3c4776a26f6e")).toHaveCount(1);
});
