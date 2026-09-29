import {expect, test, type Page} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
});

async function ready(page: Page) {
  await expect(page.locator("[data-map-viewport]")).toHaveAttribute("aria-busy", "false");
  await expect.poll(() => page.locator("[data-map-content] img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 2048)).toBe(true);
  await expect(page.getByText("Map could not load", {exact: true})).toHaveCount(0);
}

async function nonblank(page: Page) {
  const result = await page.locator("[data-map-content] img").evaluate((img: HTMLImageElement) => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!; ctx.drawImage(img, 0, 0, 64, 64);
    const bytes = ctx.getImageData(0, 0, 64, 64).data;
    const colors = new Set<string>();
    for (let i = 0; i < bytes.length; i += 4) colors.add(`${bytes[i] >> 4},${bytes[i + 1] >> 4},${bytes[i + 2] >> 4}`);
    return {colors: colors.size, width: img.naturalWidth};
  });
  expect(result.colors).toBeGreaterThan(30);
  expect(result.width).toBe(2048);
}

test("desktop: full basemaps, versioned share, marker editing and sourced search", async ({page}, testInfo) => {
  await page.goto("/en/tools/map"); await ready(page);
  for (const id of ["bakurani", "ozeti", "zestafona"]) {
    await page.getByRole("combobox", {name: "Map", exact: true}).selectOption(id);
    await ready(page); await nonblank(page);
    await expect(page.locator("[data-map-content]")).toHaveAttribute("data-zoom", "1");
  }
  await page.getByRole("button", {name: "Zoom in", exact: true}).click();
  await page.getByRole("button", {name: "Mark view center", exact: true}).click();
  await page.getByRole("textbox", {name: "Marker name", exact: true}).fill("Rally <A> & B");
  await page.getByRole("button", {name: "Share view and markers", exact: true}).click();
  const url = await page.getByRole("textbox", {name: "Share link", exact: true}).inputValue();
  const state = JSON.parse(new URLSearchParams(new URL(url).hash.slice(1)).get("map")!);
  expect(state.schema).toBe(1); expect(state.dataVersion).toBe("2026-09-27-v1");
  expect(state.map).toBe("zestafona"); expect(state.markers[0].label).toBe("Rally <A> & B");
  await page.goto("about:blank");
  await page.goto(url); await ready(page);
  await expect(page.locator("[data-map-marker]")).toHaveCount(1);
  await expect(page.locator("[data-map-content]")).toHaveAttribute("data-zoom", "1.35");
  await page.getByRole("button", {name: "Search map references", exact: true}).click();
  await page.getByRole("searchbox", {name: "Search map references", exact: true}).fill("Tower");
  await expect(page.locator("[data-map-reference]")).toHaveCount(1);
  await expect(page.locator("[data-map-reference]")).toContainText("Position not verified");
  await expect(page.locator("[data-map-reference] a").first()).toHaveAttribute("href", "/en/guides/wardogs-towers-guide");
  await expect(page.getByRole("button", {name: "Measure distance", exact: true})).toBeEnabled();
  await page.getByRole("searchbox").fill("");
  await page.getByRole("button", {name: "Close", exact: true}).click();
  await page.locator("[data-map-viewer]").evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 100));
  await page.locator("[data-map-viewer]").screenshot({path: testInfo.outputPath("map-desktop.png")});
});

test("failure has retry and slow loads have a visible status", async ({page}) => {
  let fail = true;
  await page.route("**/images/maps/bakurani/overview.webp*", async (route) => {
    if (fail) { await route.abort(); return; }
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto("/en/tools/map");
  await expect(page.getByText("Map could not load", {exact: true})).toBeVisible();
  fail = false;
  await page.getByRole("button", {name: "Retry", exact: true}).click();
  await expect(page.getByText("Loading map", {exact: true})).toBeVisible();
  await ready(page);
});

test("invalid data versions are rejected without phantom markers", async ({page}) => {
  const hash = new URLSearchParams({map: JSON.stringify({schema: 1, dataVersion: "old", map: "ozeti", view: {zoom: 2, x: 0.5, y: 0.5}, markers: []})});
  await page.goto(`/en/tools/map#${hash}`); await ready(page);
  await expect(page.getByText("This map link is invalid or uses a different data version.", {exact: true})).toBeVisible();
  await expect(page.getByRole("combobox", {name: "Map", exact: true})).toHaveValue("bakurani");
  await expect(page.locator("[data-map-marker]")).toHaveCount(0);
});

test("phone: genuine touch pinch, drag, cancellation and fullscreen fallback", async ({browser}, testInfo) => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  const page = await context.newPage();
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  await page.addInitScript(() => { Element.prototype.requestFullscreen = async () => {throw new Error("Unavailable");}; });
  await page.goto(`${testInfo.project.use.baseURL}/en/tools/map`); await ready(page);
  await page.locator("[data-map-viewport]").scrollIntoViewIfNeeded();
  const box = (await page.locator("[data-map-viewport]").boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x: x - 35, y, id: 1}, {x: x + 35, y, id: 2}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x: x - 85, y: y + 8, id: 1}, {x: x + 85, y: y + 8, id: 2}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
  await expect.poll(async () => Number(await page.locator("[data-map-content]").getAttribute("data-zoom"))).toBeGreaterThan(2);
  const before = await page.locator("[data-map-content]").getAttribute("style");
  await cdp.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x, y, id: 3}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x: x - 30, y: y - 30, id: 3}]});
  await cdp.send("Input.dispatchTouchEvent", {type: "touchCancel", touchPoints: []});
  await expect(page.locator("[data-map-content]")).not.toHaveAttribute("style", before!);
  await expect(page.locator("[data-map-marker]")).toHaveCount(0);
  await page.getByRole("button", {name: "Fullscreen", exact: true}).click();
  await expect(page.locator("[data-map-viewer]")).toHaveAttribute("data-fullscreen", "fallback");
  await nonblank(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const bounds = await page.locator("[data-map-viewer]").evaluate((element) => ({height: element.clientHeight, content: element.scrollHeight}));
  expect(bounds.content).toBeLessThanOrEqual(bounds.height + 1);
  await page.screenshot({path: testInfo.outputPath("map-phone-fullscreen.png")});
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-map-viewer]")).toHaveAttribute("data-fullscreen", "off");
  await page.getByRole("button", {name: "Reset view", exact: true}).click();
  await expect(page.locator("[data-map-content]")).toHaveAttribute("data-zoom", "1");
  await context.close();
});

test("item photo: stored pixels, provenance, keyboard close and focus restoration", async ({page}, testInfo) => {
  await page.goto("/en/items/weapons/ak74");
  const trigger = page.getByRole("button", {name: /^Inspect image:/});
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.locator("[data-item-full-image]").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(dialog.locator("[data-item-image-provenance]")).toContainText("not independent license certification");
  await expect(dialog.getByRole("link", {name: "Open stored image"})).toHaveAttribute("href", /\/images\/catalogue\/weapons\/ak74.webp$/);
  await dialog.getByRole("button", {name: "Actual pixels", exact: true}).click();
  await expect(dialog.getByRole("button", {name: "Fit image", exact: true})).toBeVisible();
  await dialog.screenshot({path: testInfo.outputPath("item-image-desktop.png")});
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  await page.setViewportSize({width: 375, height: 812}); await trigger.click();
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(375);
  await dialog.screenshot({path: testInfo.outputPath("item-image-phone.png")});
});
