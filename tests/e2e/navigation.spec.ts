import {expect, test, type Page} from "@playwright/test";
import {LOCALIZED_PRIORITY_SLUGS} from "../../src/features/home/home-traffic-assets";

async function switchLocale(page: Page, locale: string, expectedUrl: RegExp) {
  const select = page.locator("select:visible");
  await expect(select).toBeEnabled();
  await Promise.all([
    page.waitForURL(expectedUrl, {waitUntil: "domcontentloaded"}),
    select.selectOption(locale)
  ]);
  await expect(page.locator("select:visible")).toHaveValue(locale);
}

test("locale switching preserves the current article slug", async ({page}) => {
  await page.goto("/en/guides/wardogs-gameplay");
  await page.locator('select:visible').selectOption("de");
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay\/?$/);
});

test("locale switching preserves supported item details", async ({page}) => {
  await page.goto("/en/items/vehicles/bobcat");
  await switchLocale(page, "ru", /\/ru\/items\/vehicles\/bobcat\/?$/);

  await page.goto("/en/items/weapons/mortar");
  await switchLocale(page, "ru", /\/ru\/items\/weapons\/mortar\/?$/);
  await switchLocale(page, "de", /\/de\/items\/weapons\/mortar\/?$/);
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
  const navigation = page.getByRole("navigation", {name: /primary/i});
  const catalogue = navigation.getByRole("button", {name: "Catalogue"});

  await catalogue.hover();
  const weapons = navigation.getByRole("link", {name: "Weapons", exact: true});
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

  const navigation = page.getByRole("navigation", {name: /primary/i});
  const catalogue = navigation.getByRole("button", {name: "Catalogue"});
  const box = await catalogue.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await page.mouse.down();
  await page.mouse.up();

  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await expect(navigation.getByRole("link", {name: "Weapons", exact: true})).toBeVisible();

  await page.mouse.down();
  await page.mouse.up();
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");

  await catalogue.focus();
  await page.keyboard.press("Enter");
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");

  const game = navigation.getByRole("button", {name: "Maps & Tools"});
  const guides = navigation.getByRole("button", {name: "Guides"});
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

  const navigation = page.getByRole("navigation", {name: /primary/i});
  const catalogue = navigation.getByRole("button", {name: "Catalogue"});
  await expect(catalogue).toHaveAttribute("aria-expanded", "false");
  await catalogue.click();
  await expect(catalogue).toHaveAttribute("aria-expanded", "true");
  const weapons = navigation.getByRole("link", {name: "Weapons", exact: true});
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
  const game = navigation.getByRole("button", {name: "Maps & Tools"});
  const catalogue = navigation.getByRole("button", {name: "Catalogue"});
  const catalogueHome = navigation.getByRole("link", {name: "Catalogue Home"});
  const map = navigation.getByRole("link", {name: "Map", exact: true});
  const news = navigation.getByRole("link", {name: "News", exact: true});

  await catalogue.click();
  await page.keyboard.press("Tab");
  await expect(catalogueHome).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(catalogue).toBeFocused();

  const catalogueContentId = await catalogue.getAttribute("aria-controls");
  expect(catalogueContentId).toBeTruthy();
  const catalogueLinks = navigation.locator(`[id="${catalogueContentId}"] a[href]`);
  expect(await catalogueLinks.count()).toBeGreaterThan(0);
  for (let position = 0; position < await catalogueLinks.count(); position += 1) {
    await page.keyboard.press("Tab");
    await expect(catalogueLinks.nth(position)).toBeFocused();
  }

  await page.keyboard.press("Tab");
  await expect(game).toBeFocused();
  await news.focus();
  await page.keyboard.press("Tab");
  await expect(map).toBeFocused();

  await map.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(news).toBeFocused();
});

test("homepage hands video discovery to the library while the official trailer remains available", async ({page}) => {
  await page.goto("/en");
  const videoLibrary = page.locator('[data-home-section="library"] a[href="/en/videos"]');
  await expect(videoLibrary).toBeVisible();
  await videoLibrary.click();
  await expect(page).toHaveURL(/\/en\/videos\/?$/);
  await expect(page.locator("#creator-candidates article")).toHaveCount(14);
  await page.goto("/en/guides/wardogs-trailer");
  const trailer = page.getByRole("button", {name: /WARDOGS Reveal Trailer/});
  await expect(trailer).toBeVisible();
  await trailer.click();
  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/hVtmnaUCpuQ"]')).toBeVisible();
});

test("new standalone video articles expose their privacy-enhanced source player", async ({page}) => {
  await page.goto("/en/videos/wardogs-everything-before-playing");

  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/tF4-GnGlo4I"]')).toBeVisible();
  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/tF4-GnGlo4I"]')).not.toHaveAttribute("src", /autoplay=1/);
});

test("homepage preserves the English traffic assets and dated live-intel routes", async ({page}) => {
  await page.goto("/en");
  const demand = page.locator('[data-home-section="proven-demand"]');
  for (const slug of LOCALIZED_PRIORITY_SLUGS.en) {
    await expect(demand.locator(`a[href="/en/guides/${slug}"][data-home-placement="proven-demand"]`)).toHaveCount(1);
  }
  const intel = page.locator('[data-home-section="live-intel"]');
  await expect(intel.locator("[data-home-intel]")).toHaveCount(3);
  await expect(intel.locator("time")).toHaveCount(3);
  const intelNavigation = intel.getByRole("navigation");
  await expect(intelNavigation.locator('a[href="/en/guides/wardogs-server-status"]')).toBeVisible();
  await expect(intelNavigation.locator('a[href="/en/guides/wardogs-patch-notes"]')).toBeVisible();
});

test("first-look guide embeds all three supplied YouTube reports", async ({page}) => {
  await page.goto("/en/guides/wardogs-first-look");
  await expect(page.getByRole("button", {name: /7 Things You NEED To Know About WARDOGS/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Gameplay and Impressions/})).toBeVisible();
  await expect(page.getByRole("button", {name: /WARDOGS Alpha - Gameplay and Impressions/})).toBeVisible();
});

test("Tools hub stays reachable through the grouped navigation and its return action", async ({page}) => {
  await page.goto("/en/guides");
  const navigation = page.getByRole("navigation", {name: /primary/i});
  await navigation.getByRole("button", {name: "Maps & Tools"}).click();
  await navigation.getByRole("link", {name: "Tools", exact: true}).click();
  await expect(page).toHaveURL(/\/en\/tools\/?$/);
  await expect(page.locator('[data-tool-entry]')).toHaveCount(9);
  await page.locator('[data-tool-entry="weapon-compare"] [data-task-link="primary"]').click();
  await expect(page.locator('[data-tool-page-hero="weapon-compare"]')).toBeVisible();
  await page.locator('[data-tool-page-hero="weapon-compare"] a[href="/en/tools"]').click();
  await expect(page).toHaveURL(/\/en\/tools\/?$/);
});
