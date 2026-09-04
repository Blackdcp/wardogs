import {expect, test} from "@playwright/test";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";

test("locale switching preserves the current article slug", async ({page}) => {
  await page.goto("/en/guides/wardogs-gameplay");
  await page.locator('select:visible').selectOption("de");
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay\/?$/);
});

test("locale switching preserves supported item details", async ({page}) => {
  await page.goto("/en/items/vehicles/bobcat");
  await page.locator('select:visible').selectOption("ru");
  await expect(page).toHaveURL(/\/ru\/items\/vehicles\/bobcat\/?$/);

  await page.goto("/en/items/weapons/mortar");
  await page.locator('select:visible').selectOption("ru");
  await expect(page).toHaveURL(/\/ru\/items\/weapons\/mortar\/?$/);
  await page.locator('select:visible').selectOption("de");
  await expect(page).toHaveURL(/\/de\/items\/weapons\/mortar\/?$/);
});

test("fixed legacy navigation links target only published locales", async ({page}) => {
  await page.goto("/de");
  const guides = page.getByRole("button", {name: "Anleitungen"});
  await guides.hover();

  await expect(page.getByRole("link", {name: "FOB und Logistik"})).toHaveAttribute(
    "href",
    "/de/guides/wardogs-fob-guide"
  );
  await expect(page.getByRole("link", {name: "Mörser-Leitfaden"})).toHaveAttribute(
    "href",
    "/de/guides/wardogs-mortar-guide"
  );
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

test("desktop grouped navigation supports pointer and keyboard dismissal", async ({page}) => {
  await page.goto("/en");
  const catalogue = page.getByRole("button", {name: "Catalogue"});

  await catalogue.hover();
  const weapons = page.getByRole("link", {name: "Weapons", exact: true});
  await expect(weapons).toBeVisible();
  await expect(weapons).toHaveAttribute("href", "/en/items/weapons");
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");

  await catalogue.focus();
  await page.keyboard.press("Escape");
  await expect(weapons).toBeHidden();
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");
  await expect(catalogue).toBeFocused();

  await catalogue.click();
  await expect(weapons).toBeVisible();
  await page.getByRole("main").click({position: {x: 10, y: 10}});
  await expect(weapons).toBeHidden();
});

test("desktop disclosure stays open after a fresh pointer entry and click", async ({page}) => {
  await page.goto("/en");
  await page.mouse.move(1, 700);

  const catalogue = page.getByRole("button", {name: "Catalogue"});
  const box = await catalogue.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await page.mouse.down();
  await page.mouse.up();

  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", {name: "Weapons", exact: true})).toBeVisible();

  await page.mouse.down();
  await page.mouse.up();
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");

  await catalogue.focus();
  await page.keyboard.press("Enter");
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");

  const game = page.getByRole("button", {name: "Game"});
  const guides = page.getByRole("button", {name: "Guides"});
  await game.hover();
  await expect(game).toHaveAttribute("aria-expanded", "true");
  await guides.hover();
  await expect(game).toHaveAttribute("aria-expanded", "false");
  await expect(guides).toHaveAttribute("aria-expanded", "true");
});

test("mobile menu expands grouped catalogue links", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/en");
  await page.getByRole("button", {name: "Open menu"}).click();

  const catalogue = page.getByRole("button", {name: "Catalogue"});
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");
  await catalogue.click();
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  const weapons = page.getByRole("link", {name: "Weapons", exact: true});
  await expect(weapons).toHaveAttribute("href", "/en/items/weapons");
  await weapons.click();
  await expect(page).toHaveURL(/\/en\/items\/weapons\/?$/);
  await expect(page.getByRole("navigation", {name: /primary/i})).toBeHidden();
});

test("mobile focus trap includes expanded links and wraps in both directions", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/en");
  await page.getByRole("button", {name: "Open menu"}).click();

  const navigation = page.getByRole("navigation", {name: /primary/i});
  const game = navigation.getByRole("button", {name: "Game"});
  const catalogue = navigation.getByRole("button", {name: "Catalogue"});
  const catalogueHome = navigation.getByRole("link", {name: "Catalogue Home"});
  const videos = navigation.getByRole("link", {name: "Videos", exact: true});
  const news = navigation.getByRole("link", {name: "News", exact: true});

  await catalogue.click();
  await page.keyboard.press("Tab");
  await expect(catalogueHome).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(catalogue).toBeFocused();

  for (const linkName of [
    "Catalogue Home",
    "Weapons",
    "Vehicles",
    "Ammo",
    "Attachments",
    "Gear",
    "Equipment",
    "Loadouts"
  ]) {
    await page.keyboard.press("Tab");
    await expect(navigation.getByRole("link", {name: linkName, exact: true})).toBeFocused();
  }

  await page.keyboard.press("Tab");
  await expect(videos).toBeFocused();
  await news.focus();
  await page.keyboard.press("Tab");
  await expect(game).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(news).toBeFocused();
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

test("new standalone video articles expose their privacy-enhanced source player", async ({page}) => {
  await page.goto("/en/videos/wardogs-everything-before-playing");
  const player = page.getByRole("button", {name: /WARDOGS - Everything You Need to Know/});

  await expect(player).toBeVisible();
  await player.click();
  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/tF4-GnGlo4I"]')).toBeVisible();
});

test("homepage promotes priority guide links and confirmed status signals", async ({page}) => {
  await page.goto("/en");

  await expect(page.getByRole("heading", {name: "Top Guides"})).toBeVisible();
  await expect(page.getByRole("heading", {name: "Recently Updated"})).toBeVisible();
  await expect(page.getByRole("heading", {name: "Confirmed vs Rumor"})).toBeVisible();
  const topGuides = page.getByRole("list", {name: "Top Guides"});
  const statusSection = page.getByRole("heading", {name: "Confirmed vs Rumor"}).locator("xpath=ancestor::section");
  for (const slug of TOP_GUIDE_SLUGS) {
    await expect(topGuides.locator(`a[href="/en/guides/${slug}"]`)).toBeVisible();
  }
  await expect(statusSection.getByText("Closed Beta 02 is live", {exact: true})).toBeVisible();
  await expect(statusSection.getByText("$100K clip contest is open", {exact: true})).toBeVisible();
  await expect(statusSection.getByText("Pre-purchase guarantees test access", {exact: true})).toBeVisible();
  await expect(statusSection.getByText("Steam Early Access on September 10", {exact: true})).toBeVisible();
  await expect(statusSection.getByText("PS5 release", {exact: true})).toBeVisible();
});

test("first-look guide embeds all three supplied YouTube reports", async ({page}) => {
  await page.goto("/en/guides/wardogs-first-look");
  await expect(page.getByRole("button", {name: /7 Things You NEED To Know About WARDOGS/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Gameplay and Impressions/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Alpha - Gameplay and Impressions/})).toBeVisible();
});
