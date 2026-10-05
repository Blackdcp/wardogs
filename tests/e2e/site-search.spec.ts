import {expect, test} from "@playwright/test";

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("search keeps one combobox focus model for arrows and Enter and restores its trigger on Escape", async ({page}) => {
  await page.goto("/en");
  const trigger = page.locator('[data-hero-search-trigger="true"]');
  await trigger.click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  const input = dialog.getByRole("combobox", {name: "Search WARDOGS Wiki"});
  await input.fill("money");
  const listboxId = await input.getAttribute("aria-controls");
  expect(listboxId).toBe("global-site-search-results");
  const listbox = dialog.locator(`#${listboxId}`);
  await expect(listbox).toHaveAttribute("role", "listbox");
  await expect(listbox.getByRole("option").first()).toBeVisible();
  await expect(input).toBeFocused();
  const firstActiveId = await input.getAttribute("aria-activedescendant");
  expect(firstActiveId).toBeTruthy();
  await expect(page.locator(`#${firstActiveId}`)).toHaveAttribute("aria-selected", "true");
  await input.press("ArrowDown");
  const secondActiveId = await input.getAttribute("aria-activedescendant");
  expect(secondActiveId).not.toBe(firstActiveId);
  await expect(input).toBeFocused();
  const targetHref = await page.locator(`#${secondActiveId}`).getAttribute("data-search-href");
  expect(targetHref).toBeTruthy();
  await input.press("ArrowUp");
  await expect(input).toHaveAttribute("aria-activedescendant", firstActiveId!);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/en${escapePattern(targetHref!)}/?$`));
  await page.goto("/en");
  await trigger.click();
  await input.fill("money");
  await input.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("modal traps Tab while options stay pointer-activatable outside its Tab sequence", async ({page}) => {
  await page.goto("/en");
  await page.locator('[data-hero-search-trigger="true"]').click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  const input = dialog.getByRole("combobox");
  await input.fill("money");
  const options = dialog.getByRole("option");
  await expect(options.first()).toBeVisible();
  await expect(options.first().locator("a[href], button:not([tabindex='-1']), input, select, textarea, [tabindex]:not([tabindex='-1'])")).toHaveCount(0);
  await input.press("Tab");
  await expect(dialog.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(input).toBeFocused();
  const target = options.first();
  const targetHref = await target.getAttribute("data-search-href");
  expect(targetHref).toBeTruthy();
  await target.click();
  await expect(page).toHaveURL(new RegExp(`/en${escapePattern(targetHref!)}/?$`));
});

test("failed lazy search has a real guides fallback and retries successfully", async ({page}) => {
  let attempts = 0;
  await page.route("**/api/search-index/en*", async (route) => {
    attempts += 1;
    if (attempts === 1) return route.fulfill({status: 503, body: "Unavailable"});
    return route.continue();
  });
  await page.goto("/en");
  await page.locator('[data-hero-search-trigger="true"]').click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  await expect(dialog.locator('a[href="/en/guides"]')).toBeVisible();
  await dialog.getByRole("button", {name: "Retry search", exact: true}).click();
  await dialog.getByRole("combobox").fill("money");
  await expect(dialog.getByRole("option").first()).toBeVisible();
  expect(attempts).toBe(2);
});

test("header search finds a guide from an item page", async ({page}) => {
  await page.goto("/en/items/vehicles/sph-2");
  await page.getByRole("button", {name: "Search WARDOGS Wiki"}).first().click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("combobox", {name: "Search WARDOGS Wiki"});
  await input.fill("artillery guide");
  await expect(dialog.getByRole("option").first()).toContainText("SPH-2");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/en\/guides\/wardogs-artillery-guide\/?$/);
});
