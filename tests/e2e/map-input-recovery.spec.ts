import {expect, test, type Page} from "@playwright/test";
import {getMapPlannerCopy} from "../../src/features/maps/map-planner-copy";
import {getMapViewerCopy} from "../../src/features/maps/map-viewer-copy";
import {initialMapState} from "../../src/features/maps/map-state";
import {initialMeasurement} from "../../src/features/maps/map-measurement";
import {exportMapPlan, initialTacticalPlan, MAX_ROUTE_POINTS, readTacticalPlanHash} from "../../src/features/maps/map-planner";

const ui = getMapPlannerCopy("en"), viewer = getMapViewerCopy("en");

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

async function ready(page: Page) {
  await page.goto("/en/tools/map");
  await expect(page.locator("[data-map-viewport]")).toHaveAttribute("aria-busy", "false");
}

async function point(page: Page, x: number, y: number) {
  const viewport = page.locator("[data-map-viewport]");
  const box = (await viewport.boundingBox())!;
  const side = Math.min(box.width, box.height);
  await viewport.click({position: {x: box.width / 2 + (x - .5) * side, y: box.height / 2 + (y - .5) * side}});
}

async function sharedPlan(page: Page) {
  await page.getByRole("button", {name: viewer.share, exact: true}).click();
  const link = await page.getByRole("textbox", {name: viewer.shareLink, exact: true}).inputValue();
  const parsed = readTacticalPlanHash(new URL(link).hash, "bakurani");
  expect(parsed.invalid).toBe(false);
  return parsed.state!;
}

for (const viewport of [{width: 1440, height: 1000}, {width: 390, height: 844}]) {
  test(`route keeps all 17 waypoints after the 18th click at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    await ready(page);
    await page.getByRole("button", {name: ui.routeTitle, exact: true}).click();
    await expect(page.getByRole("button", {name: ui.routeTitle, exact: true})).toHaveAttribute("aria-pressed", "true");
    for (let i = 0; i < MAX_ROUTE_POINTS; i++) await point(page, .15 + (i % 6) * .12, .2 + Math.floor(i / 6) * .2);
    await expect(page.locator("[data-route-overlay] circle")).toHaveCount(MAX_ROUTE_POINTS);
    const saved = await sharedPlan(page);
    await point(page, .8, .85);
    await expect(page.getByRole("status").filter({hasText: ui.routeLimit.replace("{limit}", String(MAX_ROUTE_POINTS))})).toBeVisible();
    await expect(page.locator("[data-route-overlay] circle")).toHaveCount(MAX_ROUTE_POINTS);
    expect((await sharedPlan(page)).route.points).toEqual(saved.route.points);
    await page.getByRole("button", {name: ui.undo, exact: true}).click();
    await point(page, .8, .85);
    const replaced = await sharedPlan(page);
    expect(replaced.route.points).toHaveLength(MAX_ROUTE_POINTS);
    expect(replaced.route.points.slice(0, -1)).toEqual(saved.route.points.slice(0, -1));
    expect(replaced.route.points.at(-1)).not.toEqual(saved.route.points.at(-1));
  });
}

test("marker targets require a chosen gun and editing hidden layers restores the overlays", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await ready(page);
  const plan = initialTacticalPlan("bakurani");
  const fixture = {
    format: "wardogs-map-plan" as const, version: 1 as const,
    map: {...initialMapState(), markers: [{id: "m1", x: .4, y: .5, label: "Chosen gun"}, {id: "m2", x: .42, y: .5, label: "Chosen target"}]},
    ruler: initialMeasurement("bakurani"),
    plan: {...plan, layers: plan.layers.map(layer => ["routes", "fire-support"].includes(layer.id) ? {...layer, enabled: false} : layer)}
  };
  await page.getByRole("button", {name: viewer.search, exact: true}).click();
  await page.locator('input[type="file"]').setInputFiles({name: "markers.json", mimeType: "application/json", buffer: Buffer.from(exportMapPlan(fixture))});
  await expect(page.getByText(ui.imported, {exact: true})).toBeVisible();
  await expect(page.getByRole("button", {name: ui.setTarget, exact: true}).first()).toBeDisabled();
  await expect(page.getByText(ui.gunRequired, {exact: true})).toBeVisible();
  expect((await sharedPlan(page)).fireSupport.points).toEqual([]);
  await page.getByRole("button", {name: ui.setGun, exact: true}).first().click();
  await expect(page.locator("[data-range-overlay] circle")).toHaveCount(1);
  await page.getByRole("button", {name: viewer.search, exact: true}).click();
  await expect(page.getByRole("button", {name: ui.setTarget, exact: true}).nth(1)).toBeEnabled();
  await page.getByRole("button", {name: ui.setTarget, exact: true}).nth(1).click();
  expect((await sharedPlan(page)).fireSupport.points).toEqual([{x: .4, y: .5}, {x: .42, y: .5}]);
  await expect(page.locator("[data-range-overlay] circle")).toHaveCount(2);
  await page.getByRole("button", {name: viewer.search, exact: true}).click();
  await page.getByRole("button", {name: ui.routePoint, exact: true}).last().click();
  await expect(page.locator("[data-route-overlay] circle")).toHaveCount(1);
  const saved = await sharedPlan(page);
  expect(saved.layers.find(({id}) => id === "routes")?.enabled).toBe(true);
  expect(saved.route.points).toEqual([{x: .42, y: .5}]);
});
