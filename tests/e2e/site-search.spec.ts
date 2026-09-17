import {expect, test} from "@playwright/test";

test("search uses one combobox focus model for arrows, Enter, and Escape", async ({page}) => {
  await page.goto("/en");
  const input = page.getByRole("combobox", {name: "Search WARDOGS Wiki"});

  await input.fill("money");
  const listboxId = await input.getAttribute("aria-controls");
  expect(listboxId).toBe("site-search-results");
  const listbox = page.locator(`#${listboxId}`);
  await expect(listbox).toHaveAttribute("role", "listbox");
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
  await expect(page).toHaveURL(new RegExp(`/en${targetHref!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`));

  await page.goto("/en");
  await input.fill("money");
  await input.press("Escape");
  await expect(input).toHaveValue("");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).toBeFocused();
});

test("search options stay out of the Tab sequence and remain pointer-activatable", async ({page}) => {
  await page.goto("/en");
  const input = page.getByRole("combobox", {name: "Search WARDOGS Wiki"});
  await input.fill("money");

  const listbox = page.locator("#site-search-results");
  const options = listbox.getByRole("option");
  await expect(options.first()).toBeVisible();
  await expect(options.first().locator("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])")).toHaveCount(0);

  await input.press("Tab");
  await expect(page.locator('[data-home-action="firstMatch"] a')).toBeFocused();
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).not.toHaveAttribute("aria-activedescendant", /.+/);

  await input.focus();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  const target = options.first();
  const targetHref = await target.getAttribute("data-search-href");
  expect(targetHref).toBeTruthy();
  await target.click();
  await expect(page).toHaveURL(new RegExp(`/en${targetHref!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`));
});
