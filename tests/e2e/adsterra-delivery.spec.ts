import {expect, test, type BrowserContext, type Page} from "@playwright/test";

const productionOrigin = "https://www.wardogswiki.com";
const nativeUnit = "481d6501bcd0c27b98bc3c4776a26f6e";
const horizontalUnit = "035c3a3eb2cdc2bcb65b641e981d4874";
const creativePath = "/__ad_delivery_fixture__/creative.html";

type AdEvent = Record<string, unknown> & {status: string; placement: string; page_path: string};

test.use({serviceWorkers: "block", viewport: {width: 1440, height: 900}});

test.afterEach(async ({page, context}) => {
  // Close the page before removing the fail-closed gateway. Local image fetches
  // still finishing during teardown must not outlive the test's route handlers.
  await page.close();
  await context.unrouteAll({behavior: "ignoreErrors"});
});

async function installDeliveryFixture(context: BrowserContext, baseURL: string | undefined, withCreative: boolean, failFirstUnits: readonly string[] = []) {
  if (!baseURL || !["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL).hostname)) {
    throw new Error("Ad delivery tests require a local server; live production is never fetched.");
  }
  const localOrigin = new URL(baseURL).origin;
  const loaderRequests: string[] = [];
  // This is the only network gateway. Every browser HTTP request is fulfilled
  // locally or blocked, and fetch cannot follow a local redirect to production.
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === productionOrigin) {
      if (url.pathname === creativePath) {
        return route.fulfill({
          contentType: "text/html",
          body: '<!doctype html><html><body style="margin:0;background:#13251d;color:white">Local creative fixture</body></html>'
        });
      }
      const response = await route.fetch({
        url: `${localOrigin}${url.pathname}${url.search}`,
        maxRedirects: 0
      });
      return route.fulfill({response});
    }
    if (url.origin === "https://bauval.org" && /^\/(21|22)\/[a-f0-9]{32}$/.test(url.pathname)) {
      loaderRequests.push(url.pathname);
      if (failFirstUnits.includes(url.pathname.split("/").at(-1)!) && loaderRequests.filter((path) => path === url.pathname).length === 1) {
        return route.abort("connectionfailed");
      }
      return route.fulfill({
        contentType: "application/javascript",
        body: withCreative ? `(() => {
          const native = ${url.pathname.startsWith("/21/")};
          const target = native
            ? document.getElementById("container-${nativeUnit}")
            : document.currentScript.parentElement;
          const frame = document.createElement("iframe");
          frame.title = "Local ad delivery fixture";
          frame.width = native ? "300" : String(window.atOptions.width);
          frame.height = native ? "90" : String(window.atOptions.height);
          frame.style.border = "0";
          frame.src = "${productionOrigin}${creativePath}";
          target.appendChild(frame);
        })();` : "/* Intentionally empty loader: no creative DOM. */"
      });
    }
    return route.abort("blockedbyclient");
  });
  await context.routeWebSocket("**/*", (route) => route.close());
  return loaderRequests;
}

async function adEvents(page: Page, placement: string, pagePath: string): Promise<AdEvent[]> {
  return page.evaluate(({placement, pagePath}) => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.flatMap((entry) => {
      const command = Array.from(entry as ArrayLike<unknown>);
      const parameters = command[2] as AdEvent | undefined;
      return command[0] === "event" && command[1] === "ad_status"
        && parameters?.placement === placement && parameters.page_path === pagePath ? [parameters] : [];
    });
  }, {placement, pagePath});
}

async function expectStatus(page: Page, placement: string, pagePath: string, status: string) {
  await expect.poll(async () => (await adEvents(page, placement, pagePath)).map((event) => event.status)).toContain(status);
}

test("empty native loader reports request, load and missing creative evidence with page attribution", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, false);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides?fixture=private#not-analytics`);
  // Deep inventory intentionally requests only near the viewport. The shell
  // exists before its loader or creative, so scroll it before awaiting delivery.
  await page.locator(`#container-${nativeUnit}`).scrollIntoViewIfNeeded();
  await expectStatus(page, "native", "/en/guides", "request_started");
  await expectStatus(page, "native", "/en/guides", "script_loaded");
  expect((await adEvents(page, "native", "/en/guides")).map((event) => event.status)).not.toContain("creative_missing");

  await page.clock.fastForward(15_001);
  await expectStatus(page, "native", "/en/guides", "creative_missing");
  const events = await adEvents(page, "native", "/en/guides");
  for (const event of events) {
    expect(event).toMatchObject({
      format: "native", ad_unit: nativeUnit, page_path: "/en/guides",
      page_type: "guide_hub", config_version: "format-expansion-v3", locale: "en"
    });
    expect(["request_started", "script_loaded", "slot_visible", "creative_missing"]).toContain(event.status);
  }
  expect(events.filter((event) => event.status === "creative_missing")).toHaveLength(1);
  expect(requests.filter((path) => path === `/21/${nativeUnit}`)).toHaveLength(1);
  const initialRequests = [...requests];
  await page.clock.fastForward(60_000);
  expect(requests).toEqual(initialRequests);
  await expect(page.locator(`#container-${nativeUnit}`)).toHaveAttribute("data-ad-status", "creative_missing");
});

test("locally served creative yields presence and foreground viewability without a new request", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, true);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  await page.locator(`#container-${nativeUnit}`).scrollIntoViewIfNeeded();
  await expectStatus(page, "native", "/en/guides", "script_loaded");
  await expectStatus(page, "native", "/en/guides", "creative_present");
  const creative = page.locator(`#container-${nativeUnit} iframe`);
  await expect(creative).toHaveCount(1);
  await creative.scrollIntoViewIfNeeded();
  await expectStatus(page, "native", "/en/guides", "creative_visible");
  await page.clock.runFor(1_000);
  await expectStatus(page, "native", "/en/guides", "creative_viewable");
  const initialRequests = [...requests];
  await page.clock.fastForward(60_000);
  const statuses = (await adEvents(page, "native", "/en/guides")).map((event) => event.status);
  expect(statuses.filter((status) => status === "creative_viewable")).toHaveLength(1);
  expect(statuses).not.toContain("creative_missing");
  expect(requests).toEqual(initialRequests);
  expect(requests.filter((path) => path === `/21/${nativeUnit}`)).toHaveLength(1);
});

test("persistent top creative is attributed to the new client route without reloading its vendor script", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, true);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  await expectStatus(page, "horizontal", "/en/guides", "script_loaded");
  await expectStatus(page, "horizontal", "/en/guides", "creative_present");
  const topCreative = page.locator('[data-global-ad-position="top"] iframe');
  await expect(topCreative).toHaveCount(1);
  await topCreative.evaluate((frame) => {frame.setAttribute("data-persistent-fixture", "same-element");});
  await page.locator("html").evaluate((element) => {element.dataset.deliveryDocument = "same-document";});
  await expectStatus(page, "horizontal", "/en/guides", "creative_visible");
  await page.clock.runFor(1_000);
  await expectStatus(page, "horizontal", "/en/guides", "creative_viewable");
  const firstRouteEvents = await adEvents(page, "horizontal", "/en/guides");
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(1);

  await page.getByRole("button", {name: "Catalogue", exact: true}).click();
  await page.locator('header a[href="/en/items"]:visible').first().click();
  await expect(page).toHaveURL(`${productionOrigin}/en/items`);
  await expect(page.locator("html")).toHaveAttribute("data-delivery-document", "same-document");
  await expect(topCreative).toHaveAttribute("data-persistent-fixture", "same-element");
  await expectStatus(page, "horizontal", "/en/items", "creative_present");
  await topCreative.scrollIntoViewIfNeeded();
  await expectStatus(page, "horizontal", "/en/items", "creative_visible");
  await page.clock.runFor(1_000);
  await expectStatus(page, "horizontal", "/en/items", "creative_viewable");
  await page.clock.fastForward(60_000);

  const events = await adEvents(page, "horizontal", "/en/items");
  for (const event of events) {
    expect(event).toMatchObject({
      format: "display", ad_unit: horizontalUnit, page_type: "catalogue_hub", config_version: "format-expansion-v3"
    });
    expect(["script_loaded", "slot_visible", "creative_present", "creative_visible", "creative_viewable"]).toContain(event.status);
  }
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(1);
  expect(await adEvents(page, "horizontal", "/en/guides")).toEqual(firstRouteEvents);
});

test("a persistent script failure retries once on a new page and preserves the recovered creative", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, true, [horizontalUnit]);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  await expectStatus(page, "horizontal", "/en/guides", "script_error");
  const slot = page.locator('[data-global-ad-position="top"] [data-adsterra-unit]');
  const script = slot.locator(`script[src="https://bauval.org/22/${horizontalUnit}"]`);
  await expect(script).toHaveCount(1);
  await script.evaluate((element) => element.setAttribute("data-failed-request", "first"));
  await page.locator("html").evaluate((element) => {element.dataset.deliveryDocument = "same-document";});
  await page.clock.fastForward(60_000);
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(1);

  await page.getByRole("button", {name: "Catalogue", exact: true}).click();
  await page.locator('header a[href="/en/items"]:visible').first().click();
  await expect(page).toHaveURL(`${productionOrigin}/en/items`);
  await expect(page.locator("html")).toHaveAttribute("data-delivery-document", "same-document");
  await expectStatus(page, "horizontal", "/en/items", "request_started");
  await expectStatus(page, "horizontal", "/en/items", "creative_present");
  await expect(script).toHaveCount(1);
  await expect(slot.locator('[data-failed-request]')).toHaveCount(0);
  await expect(slot.locator("iframe")).toHaveCount(1);
  expect((await adEvents(page, "horizontal", "/en/items")).map((event) => event.status)).not.toContain("script_error");
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(2);

  await page.goBack();
  await expect(page).toHaveURL(`${productionOrigin}/en/guides`);
  await page.clock.fastForward(60_000);
  await expect(slot.locator("iframe")).toHaveCount(1);
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(2);
});

test("empty persistent top slot diagnoses missing creative on the current route without another request", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, false);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  await expectStatus(page, "horizontal", "/en/guides", "script_loaded");
  await page.clock.fastForward(5_000);
  expect((await adEvents(page, "horizontal", "/en/guides")).map((event) => event.status)).not.toContain("creative_missing");
  const slot = page.locator('[data-global-ad-position="top"] [data-adsterra-unit]');
  await slot.evaluate((element) => {element.setAttribute("data-persistent-fixture", "same-slot");});

  await page.getByRole("button", {name: "Catalogue", exact: true}).click();
  await page.locator('header a[href="/en/items"]:visible').first().click();
  await expect(page).toHaveURL(`${productionOrigin}/en/items`);
  await expect(slot).toHaveAttribute("data-persistent-fixture", "same-slot");
  await page.clock.fastForward(15_001);
  await expectStatus(page, "horizontal", "/en/items", "creative_missing");
  const events = await adEvents(page, "horizontal", "/en/items");
  // script_loaded replays the persistent loader's known state for this page;
  // request_started is emitted only when a vendor request actually starts.
  expect(events.map((event) => event.status)).toContain("script_loaded");
  expect(events.map((event) => event.status)).not.toContain("request_started");
  expect(events.find((event) => event.status === "creative_missing")).toMatchObject({
    ad_unit: horizontalUnit, page_path: "/en/items", page_type: "catalogue_hub", config_version: "format-expansion-v3"
  });
  expect((await adEvents(page, "horizontal", "/en/guides")).map((event) => event.status)).not.toContain("creative_missing");
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(1);
  await page.clock.fastForward(60_000);
  expect(requests.filter((path) => path === `/22/${horizontalUnit}`)).toHaveLength(1);
  expect((await adEvents(page, "horizontal", "/en/items")).filter((event) => event.status === "creative_missing")).toHaveLength(1);
});

test("restoring a resized rectangle does not request the same zone again during the page visit", async ({page, context, baseURL}) => {
  const rectangleUnit = "3342dc928824e6ed5c01555e7f9e9e0f";
  const requests = await installDeliveryFixture(context, baseURL, false);
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  const container = page.locator('[data-ad-container="rectangle"]');
  await container.scrollIntoViewIfNeeded();
  await expectStatus(page, "rectangle", "/en/guides", "script_loaded");
  expect(requests.filter((path) => path === `/22/${rectangleUnit}`)).toHaveLength(1);

  await container.evaluate((element) => {element.style.width = "288px";});
  await expect(container.locator('[data-adsterra-unit]')).toHaveCount(0);
  const beforeRestore = (await adEvents(page, "rectangle", "/en/guides")).length;
  await container.evaluate((element) => {element.style.width = "400px";});
  await container.scrollIntoViewIfNeeded();
  await expect(container.locator('[data-ad-placement="rectangle"]')).toHaveAttribute("hidden", "");
  await page.clock.fastForward(60_000);
  expect(requests.filter((path) => path === `/22/${rectangleUnit}`)).toHaveLength(1);
  const restoredStatuses = (await adEvents(page, "rectangle", "/en/guides")).slice(beforeRestore).map((event) => event.status);
  expect(restoredStatuses).not.toContain("request_started");
  expect(restoredStatuses).not.toContain("script_loaded");
  expect(restoredStatuses).not.toContain("creative_missing");
});

async function smartlinkEvents(page: Page, name: "ad_exposure" | "ad_click"): Promise<Record<string, unknown>[]> {
  return page.evaluate((eventName) => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.flatMap((entry) => {
      const command = Array.from(entry as ArrayLike<unknown>);
      const parameters = command[2] as Record<string, unknown> | undefined;
      return command[0] === "event" && command[1] === eventName && parameters?.format === "smartlink" ? [parameters] : [];
    });
  }, name);
}

test("sponsored CTA counts one exposure per route visit and opens only a chosen link", async ({page, context, baseURL}) => {
  await installDeliveryFixture(context, baseURL, false);
  const destination = "https://araplhn.org/4/88f0d659df423718bd107ca16b5284cd";
  let destinationRequests = 0;
  await context.route(destination, (route) => {
    destinationRequests += 1;
    return route.fulfill({contentType: "text/html", body: "Local sponsored destination fixture"});
  });
  await page.goto(`${productionOrigin}/en/guides?private=share-data#not-analytics`);
  await page.locator("html").evaluate((element) => {element.dataset.smartlinkDocument = "same-document";});
  const cta = page.locator('[data-ad-slot="adsterra-smartlink"] a');
  await expect(cta).toHaveCount(1);
  await expect(cta).toHaveAttribute("target", "_blank");
  await expect(cta).toHaveAttribute("href", destination);
  await cta.scrollIntoViewIfNeeded();
  await expect.poll(() => smartlinkEvents(page, "ad_exposure")).toEqual([expect.objectContaining({
    page_path: "/en/guides", page_type: "guide_hub", section: "guide_hub:smartlink",
    ad_unit: "smartlink-1", locale: "en", config_version: "format-expansion-v3"
  })]);
  await cta.scrollIntoViewIfNeeded();
  expect(destinationRequests).toBe(0);
  expect(await smartlinkEvents(page, "ad_click")).toEqual([]);

  await page.getByRole("button", {name: "Catalogue", exact: true}).click();
  await page.locator('header a[href="/en/items"]:visible').first().click();
  await expect(page).toHaveURL(`${productionOrigin}/en/items`);
  await cta.scrollIntoViewIfNeeded();
  await expect.poll(() => smartlinkEvents(page, "ad_exposure")).toHaveLength(2);
  expect((await smartlinkEvents(page, "ad_exposure"))[1]).toMatchObject({
    page_path: "/en/items", page_type: "catalogue_hub", section: "catalogue_hub:smartlink"
  });

  await page.goBack();
  await expect(page).toHaveURL(`${productionOrigin}/en/guides?private=share-data#not-analytics`);
  await cta.scrollIntoViewIfNeeded();
  await expect.poll(() => smartlinkEvents(page, "ad_exposure")).toHaveLength(3);
  await expect(page.locator("html")).toHaveAttribute("data-smartlink-document", "same-document");
  expect((await smartlinkEvents(page, "ad_exposure"))[2]).toMatchObject({page_path: "/en/guides", section: "guide_hub:smartlink"});
  expect(destinationRequests).toBe(0);

  const popupPromise = context.waitForEvent("page");
  await cta.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(destination);
  await expect.poll(() => smartlinkEvents(page, "ad_click")).toEqual([{
    ad_unit: "smartlink-1", page_path: "/en/guides", page_type: "guide_hub",
    page_location: `${productionOrigin}/en/guides`, page_referrer: `${productionOrigin}/en/items`,
    config_version: "format-expansion-v3", section: "guide_hub:smartlink",
    format: "smartlink", placement: "smartlink", locale: "en"
  }]);
  expect(destinationRequests).toBe(1);
  await popup.close();
});

test("a top banner suppressed after resizing can serve again on the next client route", async ({page, context, baseURL}) => {
  const requests = await installDeliveryFixture(context, baseURL, true);
  const sharedHorizontal = "c6d1a3e01dc90e01385598a3c84dcaea";
  await page.clock.install();
  await page.goto(`${productionOrigin}/en/guides`);
  await expectStatus(page, "horizontal", "/en/guides", "script_loaded");
  const contentBanner = page.locator('[data-ad-placement="content-horizontal"]');
  await contentBanner.scrollIntoViewIfNeeded();
  await expectStatus(page, "content-horizontal", "/en/guides", "script_loaded");
  expect(requests.filter((path) => path === `/22/${sharedHorizontal}`)).toHaveLength(1);

  // The body has already spent this zone's page-visit request. Resizing switches
  // the top slot to that zone, so it must suppress itself without refreshing it.
  await page.setViewportSize({width: 700, height: 900});
  await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
  const topBanner = page.locator('[data-global-ad-position="top"] [data-ad-placement="horizontal"]');
  await expect(topBanner).toHaveAttribute("hidden", "");
  expect(requests.filter((path) => path === `/22/${sharedHorizontal}`)).toHaveLength(1);

  await page.locator('footer a[href="/en/items"]').first().click();
  await expect(page).toHaveURL(`${productionOrigin}/en/items`);
  await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
  await expect(topBanner).toBeVisible();
  await expectStatus(page, "horizontal", "/en/items", "script_loaded");
  await expectStatus(page, "horizontal", "/en/items", "creative_present");
  expect(requests.filter((path) => path === `/22/${sharedHorizontal}`)).toHaveLength(2);
  await page.clock.fastForward(60_000);
  expect(requests.filter((path) => path === `/22/${sharedHorizontal}`)).toHaveLength(2);
});
