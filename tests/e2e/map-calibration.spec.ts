import {expect, test, type Page} from "@playwright/test";
import {getMapMeasurementCopy} from "../../src/features/maps/map-measurement-copy";

test.beforeEach(async ({page}) => {
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
});
async function ready(page: Page) {
  await expect(page.locator("[data-map-viewport]")).toHaveAttribute("aria-busy", "false");
  await expect(page.getByText("Map could not load", {exact: true})).toHaveCount(0);
}
async function point(page: Page, x: number, y: number) {
  await page.locator("[data-map-viewport]").scrollIntoViewIfNeeded();
  const box = (await page.locator("[data-map-viewport]").boundingBox())!;
  const side = Math.min(box.width, box.height);
  await page.mouse.click(box.x + box.width / 2 + (x - 0.5) * side, box.y + box.height / 2 + (y - 0.5) * side);
}
async function reference(page: Page) {
  await page.getByRole("radio", {name: "Reference segment", exact: true}).check();
  await point(page, 0.25, 0.5); await point(page, 0.75, 0.5);
  await page.getByLabel("Reference horizontal distance (m)", {exact: true}).fill("100");
  await page.getByLabel("Reference distance error (+/- m)", {exact: true}).fill("2");
  await page.getByLabel("Each endpoint error (image px)", {exact: true}).fill("1");
  await page.getByLabel("Reference source / observation", {exact: true}).fill("Synthetic browser fixture <A> & B");
  await page.getByLabel("Observed game build", {exact: true}).fill("test-only; not a real build");
  await page.getByRole("button", {name: "Apply calibration", exact: true}).click();
}

test("desktop: explicit calibration, error bounds, sharing and per-map isolation", async ({page}, testInfo) => {
  await page.goto("/en/tools/map"); await ready(page);
  await page.getByRole("button", {name: "Measure distance", exact: true}).click();
  await expect(page.locator("[data-measurement-provenance]")).toContainText("no verified meter scale");
  await point(page, 0.25, 0.3); await point(page, 0.75, 0.3);
  await expect(page.locator("[data-image-distance]")).toContainText("1,024 px");
  await expect(page.locator("[data-measured-distance]")).toHaveCount(0);
  await reference(page);
  await expect(page.locator("[data-measured-distance]")).toContainText("100 m");
  await expect(page.locator("[data-measurement-bounds]")).toContainText("97.62 - 102.4 m");
  await expect(page.locator("[data-measurement-provenance]")).toContainText("not game-verified");
  await expect(page.locator("[data-map-measurement]")).toContainText("Ballistics unavailable");
  await page.getByRole("button", {name: "Zoom in", exact: true}).click();
  await expect(page.locator("[data-measured-distance]")).toContainText("100 m");
  const before = await page.locator('[data-measurement-segment="distance"] line').getAttribute("x1");
  await page.getByRole("button", {name: "Zoom in", exact: true}).click();
  await expect(page.locator('[data-measurement-segment="distance"] line')).not.toHaveAttribute("x1", before!);
  await page.getByRole("button", {name: "Share view and markers", exact: true}).click();
  const url = await page.getByRole("textbox", {name: "Share link", exact: true}).inputValue();
  await page.goto("about:blank"); await page.goto(url); await ready(page);
  await expect(page.locator("[data-measured-distance]")).toContainText("100 m");
  await expect(page.locator("[data-calibration-source]")).toContainText("Synthetic browser fixture <A> & B");
  await page.getByRole("combobox", {name: "Map", exact: true}).selectOption("ozeti"); await ready(page);
  await expect(page.locator("[data-measured-distance]")).toHaveCount(0);
  await expect(page.locator("[data-measurement-provenance]")).toContainText("no verified meter scale");
  await page.getByRole("combobox", {name: "Map", exact: true}).selectOption("bakurani"); await ready(page);
  await expect(page.locator("[data-measured-distance]")).toContainText("100 m");
  await page.locator("[data-map-viewer]").screenshot({path: testInfo.outputPath("map-calibrated-desktop.png")});
  await page.getByRole("button", {name: "Remove calibration", exact: true}).click();
  await expect(page.locator("[data-measured-distance]")).toHaveCount(0);
  await expect(page.locator("[data-measurement-bounds]")).toHaveCount(0);
  await expect(page.locator("[data-image-distance]")).toContainText("1,024 px");
});

test("no implicit zero errors, degenerate calibration rejected, keyboard endpoints", async ({page}) => {
  await page.goto("/en/tools/map"); await ready(page);
  await page.getByRole("button", {name: "Measure distance", exact: true}).click();
  await page.getByRole("radio", {name: "Reference segment", exact: true}).check();
  for (const label of ["Reference horizontal distance (m)", "Reference distance error (+/- m)", "Each endpoint error (image px)"]) await expect(page.getByLabel(label, {exact: true})).toHaveValue("");
  await page.getByRole("button", {name: "Set endpoint at view center", exact: true}).click();
  await page.locator("[data-map-viewport]").focus(); await page.keyboard.press("Enter");
  await page.getByLabel("Reference horizontal distance (m)", {exact: true}).fill("100");
  await page.getByLabel("Reference distance error (+/- m)", {exact: true}).fill("0");
  await page.getByLabel("Each endpoint error (image px)", {exact: true}).fill("0");
  await page.getByLabel("Reference source / observation", {exact: true}).fill("Test");
  await page.getByLabel("Observed game build", {exact: true}).fill("Test");
  await page.getByRole("button", {name: "Apply calibration", exact: true}).click();
  await expect(page.locator("[data-map-measurement]").getByRole("alert")).toContainText("two separated reference points");
  await expect(page.locator("[data-measured-distance]")).toHaveCount(0);
});

test("phone: touch endpoints, pinch without extra endpoints, calibrated bounds and fullscreen", async ({browser}, testInfo) => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  const page = await context.newPage();
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  await page.addInitScript(() => {Element.prototype.requestFullscreen = async () => {throw new Error("Unsupported");};});
  await page.goto(`${testInfo.project.use.baseURL}/en/tools/map`); await ready(page);
  await page.getByRole("button", {name: "Measure distance", exact: true}).click();
  await reference(page);
  await page.locator("[data-map-viewport]").scrollIntoViewIfNeeded();
  const box = (await page.locator("[data-map-viewport]").boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.touchscreen.tap(x - box.width / 4, y - 30);
  await page.touchscreen.tap(x + box.width / 4, y - 30);
  await expect(page.locator("[data-measured-distance]")).toContainText("100 m");
  const distance = await page.locator("[data-measured-distance]").innerText();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x: x - 30, y, id: 1}, {x: x + 30, y, id: 2}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x: x - 70, y, id: 1}, {x: x + 70, y, id: 2}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
  await expect.poll(async () => Number(await page.locator("[data-map-content]").getAttribute("data-zoom"))).toBeGreaterThan(2);
  await expect(page.locator("[data-measured-distance]")).toHaveText(distance);
  await expect(page.locator('[data-measurement-segment="distance"] circle')).toHaveCount(2);
  await expect(page.locator("[data-map-marker]")).toHaveCount(0);
  await page.locator("[data-map-measurement]").screenshot({path: testInfo.outputPath("map-calibrated-phone.png")});
  await page.getByRole("button", {name: "Fullscreen", exact: true}).click();
  await expect(page.locator("[data-map-viewer]")).toHaveAttribute("data-fullscreen", "fallback");
  await expect(page.locator("[data-measurement-bounds]")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path: testInfo.outputPath("map-calibrated-phone-fullscreen.png")});
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-map-viewer]")).toHaveAttribute("data-fullscreen", "off");
  await context.close();
});

test("eight complete map locales render localized calibration controls and fit mobile", async ({page}, testInfo) => {
  await page.setViewportSize({width: 375, height: 812});
  for (const locale of ["en", "zh-cn", "de", "ru", "pt-br", "ja", "zh-tw", "pl"]) {
    const copy = getMapMeasurementCopy(locale);
    await page.goto(`/${locale}/tools/map`); await ready(page);
    await page.getByRole("button", {name: copy.measure, exact: true}).click();
    await page.getByRole("radio", {name: copy.reference, exact: true}).check();
    await expect(page.getByLabel(copy.distance, {exact: true})).toBeVisible();
    await expect(page.locator("[data-map-measurement]")).toContainText(copy.ballistics);
    await expect(page.locator("[data-measurement-provenance]")).toHaveText(copy.uncalibrated);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator("[data-map-measurement]").screenshot({path: testInfo.outputPath(`map-calibration-${locale}-phone.png`)});
  }
});
