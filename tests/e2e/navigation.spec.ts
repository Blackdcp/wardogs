import {expect, test} from "@playwright/test";

test("locale switching preserves the current article slug", async ({page}) => {
  await page.goto("/en/guides/wardogs-gameplay");
  await page.locator('select:visible').selectOption("de");
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay\/?$/);
});

test("mobile menu is keyboard operable and returns focus on Escape", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/en");
  const trigger = page.getByRole("button", {name: "Open menu"});
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", {name: /primary/i})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", {name: /primary/i})).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("homepage exposes the official trailer and collected creator videos", async ({page}) => {
  await page.goto("/en");

  const trailer = page.getByRole("button", {name: /WARDOGS Official Reveal Trailer/});
  await expect(trailer).toBeVisible();
  await expect(page.getByText("7 Things You NEED To Know About WARDOGS", {exact: true})).toBeVisible();
  await expect(page.getByText("WARDOGS Gameplay and Impressions...", {exact: true})).toBeVisible();
  await expect(page.getByText("WARDOGS Alpha - Gameplay and Impressions!", {exact: true})).toBeVisible();

  const finalCta = page.getByRole("link", {name: /Explore the Guides/});
  await expect(finalCta).toBeVisible();
  const colors = await finalCta.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {foreground: styles.color, background: styles.backgroundColor};
  });
  expect(colors.foreground).not.toBe(colors.background);

  await trailer.click();
  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/hVtmnaUCpuQ"]')).toBeVisible();
});

test("first-look guide embeds all three supplied YouTube reports", async ({page}) => {
  await page.goto("/en/guides/wardogs-first-look");
  await expect(page.getByRole("button", {name: /7 Things You NEED To Know About WARDOGS/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Gameplay and Impressions/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Alpha - Gameplay and Impressions/})).toBeVisible();
});
