import {expect, test, type Page} from "@playwright/test";
import {expectNoHorizontalOverflow} from "./helpers";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

async function ready(page: Page) {
  await expect(page.locator("[data-map-viewport]")).toHaveAttribute("aria-busy", "false");
  await expect.poll(() => page.locator("[data-map-content] img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 2048)).toBe(true);
}

test("map tactical planning hands a fire mission to the artillery calculator", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en/tools/map");
  await ready(page);

  const viewport = page.locator("[data-map-viewport]");
  await viewport.scrollIntoViewIfNeeded();
  await page.getByRole("button", {name: "Route planner", exact: true}).click();
  await expect(page.getByRole("button", {name: "Route planner", exact: true})).toHaveAttribute("aria-pressed", "true");
  await viewport.click({position: {x: 520, y: 260}});
  await viewport.click({position: {x: 700, y: 260}});
  await viewport.click({position: {x: 700, y: 360}});

  const planner = page.locator("[data-tactical-planner-panel]");
  await expect(planner).toContainText("Route planner");
  await expect(planner).toContainText("Points");
  await expect(planner).toContainText("3");
  await expect(planner).not.toContainText("0 m");

  await page.getByRole("button", {name: "Fire mission", exact: true}).click();
  await expect(page.getByRole("button", {name: "Fire mission", exact: true})).toHaveAttribute("aria-pressed", "true");
  await viewport.click({position: {x: 590, y: 300}});
  await viewport.click({position: {x: 610, y: 305}});

  const missionLink = page.getByRole("link", {name: "Open calculator with mission", exact: true});
  await expect(missionLink).toHaveAttribute("href", /\/en\/tools\/artillery-calculator\?map=bakurani&weapon=mortar&mode=single&distance=\d+(?:\.\d+)?&azimuth=\d+(?:\.\d+)?&source=map/);
  await missionLink.click();

  await expect(page).toHaveURL(/\/en\/tools\/artillery-calculator\?map=bakurani&weapon=mortar&mode=single&distance=\d+(?:\.\d+)?&azimuth=\d+(?:\.\d+)?&source=map/);
  await expect(page.locator("[data-artillery-map-import]")).toContainText("Map mission loaded");
  const distance = page.getByRole("spinbutton", {name: "Target Distance (meters)", exact: true});
  const azimuth = page.getByRole("spinbutton", {name: "Target Azimuth (0° - 360°)", exact: true});
  await expect(distance).not.toHaveValue("400");
  await expect(azimuth).not.toHaveValue("90");

  await page.getByRole("button", {name: "Short", exact: true}).click();
  await page.getByRole("button", {name: "Right", exact: true}).click();
  const previousDistance = Number(await distance.inputValue());
  await page.getByRole("button", {name: "Apply correction", exact: true}).click();
  await expect.poll(async () => Number(await distance.inputValue())).toBeGreaterThan(previousDistance);

  await page.getByRole("button", {name: "Fire Round (TOF Timer)", exact: true}).click();
  await expect(page.locator("[data-artillery-history]")).toContainText("Recent shots");
  await expect(page.locator("[data-artillery-history]")).toContainText("Mortar");
  await expectNoHorizontalOverflow(page);
});
