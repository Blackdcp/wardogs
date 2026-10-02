import {expect, test} from "@playwright/test";

test.setTimeout(90_000);

for (const viewport of [{width: 390, height: 844}, {width: 1700, height: 1000}]) {
  test("ad slots render correctly at " + viewport.width + "px", async ({page, context}) => {
    await page.setViewportSize(viewport);
    await context.route("https://arkgleamfox.com/**", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: 'console.log("Mock adsterra script loaded");'
      })
    );

    await page.goto("/en/guides/wardogs-artillery-guide");

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
