import {expect, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.route("**/bauval.org/**", (route) => route.abort("blockedbyclient"));
  await page.route("**/arkgleamfox.com/**", (route) => route.abort("blockedbyclient"));
});

test("closing the mobile ad persists across reloads and languages in the current session", async ({page}) => {
  await page.goto("/en");
  const slot = page.locator('[data-ad-placement="mobile-sticky"]');
  await expect(slot).toBeVisible();
  await page.getByRole("button", {name: "Close advertisement", exact: true}).click();
  await expect(slot).toHaveCount(0);
  await page.reload();
  await expect(slot).toHaveCount(0);
  await page.goto("/ja");
  await expect(slot).toHaveCount(0);
});

test("navigation and search temporarily hide the same creative without remounting it", async ({page}) => {
  await page.goto("/en");
  const slot = page.locator('[data-ad-placement="mobile-sticky"]');
  const creative = slot.locator("[data-adsterra-unit]");
  await expect(slot).toBeVisible();
  await creative.evaluate((element) => element.setAttribute("data-lifecycle-proof", "same-creative"));
  const menu = page.locator('[aria-controls="mobile-navigation"]');
  await menu.click();
  await expect(slot).toBeHidden();
  await expect(slot).toHaveAttribute("data-ad-suppressed", "modal");
  await menu.click();
  await expect(slot).toBeVisible();
  await expect(creative).toHaveAttribute("data-lifecycle-proof", "same-creative");
  await page.locator('[data-hero-search-trigger="true"]').click();
  await expect(page.locator('[data-search-dialog-panel="command"]')).toBeVisible();
  await expect(slot).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(slot).toBeVisible();
  await expect(creative).toHaveAttribute("data-lifecycle-proof", "same-creative");
});

test("map fullscreen control stays clickable when scrolled into the bottom ad area", async ({page}) => {
  await page.goto("/en/tools/map");
  const fullscreen = page.getByRole("button", {name: "Fullscreen", exact: true});
  await expect(fullscreen).toBeVisible();
  await fullscreen.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    window.scrollTo({top: window.scrollY + rect.top - (window.innerHeight - 95), behavior: "instant"});
  });
  const slot = page.locator('[data-ad-placement="mobile-sticky"]');
  await expect(slot).toBeHidden();
  await expect(slot).toHaveAttribute("data-ad-suppressed", "tool-controls");
  expect(await fullscreen.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return button.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
  })).toBe(true);
  await fullscreen.click();
  await expect(page.locator('[data-map-viewer]')).not.toHaveAttribute("data-fullscreen", "off");
  await expect(slot).toBeHidden();
});
