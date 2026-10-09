import {readFile} from "node:fs/promises";
import {expect, test} from "@playwright/test";
import {initialMapState} from "../../src/features/maps/map-state";
import {initialMeasurement} from "../../src/features/maps/map-measurement";
import {initialTacticalPlan, exportMapPlan, importMapPlan} from "../../src/features/maps/map-planner";
import {getMapViewerCopy} from "../../src/features/maps/map-viewer-copy";

test("map plan files restore a calibrated mission and reject malformed replacements", async ({page, context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const points = [{x: .25, y: .25}, {x: .75, y: .25}];
  const fixture = {
    format: "wardogs-map-plan" as const, version: 1 as const,
    map: {...initialMapState("ozeti"), markers: [{id: "m1", x: .2, y: .3, label: "QA supply point", kind: "supply" as const}]},
    ruler: {...initialMeasurement("ozeti"), points, reference: points, calibration: {provenance: "user-supplied" as const, distanceMeters: 500, distanceErrorMeters: 10, pointErrorPixels: 2, source: "QA fixture", build: "test"}},
    plan: {...initialTacticalPlan("ozeti"), route: {label: "QA route", points}, fireSupport: {points, weaponId: "mortar" as const, mode: "single" as const}}
  };
  await page.goto("/en/tools/map");
  await expect(page.locator("[data-map-viewport]")).toHaveAttribute("aria-busy", "false");
  await page.getByRole("button", {name: getMapViewerCopy("en").search, exact: true}).click();
  await page.locator('input[type="file"]').setInputFiles({name: "plan.json", mimeType: "application/json", buffer: Buffer.from(exportMapPlan(fixture))});
  await expect(page.getByText("Plan loaded.", {exact: true})).toBeVisible();
  await expect(page.locator("[data-map-viewer] select").first()).toHaveValue("ozeti");
  await page.getByRole("button", {name: "Fire mission", exact: true}).click();
  await expect(page.getByRole("link", {name: "Open calculator with mission", exact: true})).toHaveAttribute("href", /distance=500&.*mapScale=1000&scaleSource=user-supplied/);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", {name: "Save plan file", exact: true}).click();
  const download = await downloadPromise;
  const restored = importMapPlan(await readFile((await download.path())!, "utf8"));
  expect(restored?.map.markers).toEqual(fixture.map.markers);
  expect(restored?.ruler.calibration).toEqual(fixture.ruler.calibration);
  expect(restored?.plan.fireSupport).toEqual(fixture.plan.fireSupport);
  await page.locator('input[type="file"]').setInputFiles({name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"version":99}')});
  await expect(page.getByText("Invalid plan: check file size, map version and coordinates.", {exact: true})).toBeVisible();
  await expect(page.getByRole("link", {name: "Open calculator with mission", exact: true})).toHaveAttribute("href", /distance=500&/);
});
