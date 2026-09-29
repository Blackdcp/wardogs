import {expect, test, type Page} from "@playwright/test";

type CapturedEvent = {
  name: string;
  parameters: Record<string, unknown>;
};

test.use({serviceWorkers: "block"});

test.beforeEach(async ({context, baseURL}) => {
  if (!baseURL || !["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL).hostname)) {
    throw new Error("Analytics tests must run on a local server.");
  }
  const origin = new URL(baseURL).origin;
  // Fail closed: no test page, popup, beacon, or vendor script may contact GA.
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    return route.abort();
  });
  await context.routeWebSocket("**/*", (route) => {
    const url = new URL(route.url());
    if (url.host === new URL(origin).host) route.connectToServer();
    else route.close();
  });
});

async function dataLayerEvents(page: Page, eventName: string): Promise<CapturedEvent[]> {
  return page.evaluate((name) => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.flatMap((entry) => {
      const command = Array.from(entry as ArrayLike<unknown>);
      if (command[0] !== "event" || command[1] !== name) return [];
      return [{name: String(command[1]), parameters: (command[2] ?? {}) as Record<string, unknown>}];
    });
  }, eventName);
}

async function waitForAnalyticsReady(page: Page) {
  await page.waitForFunction(() => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.some((entry) => Array.from(entry as ArrayLike<unknown>)[0] === "config");
  });
}

test("delegated official and catalogue links emit analytics events", async ({page}) => {
  await page.goto("/en/guides/wardogs-preload");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest("a[data-analytics-destination]")) event.preventDefault();
    }, true);
  });
  await page.getByRole("link", {name: "Official WARDOGS Closed Beta 02 announcement"}).click();

  await expect.poll(() => dataLayerEvents(page, "official_outbound_click")).toEqual([
    expect.objectContaining({
      name: "official_outbound_click",
      parameters: expect.objectContaining({destination: "official_source", locale: "en"})
    })
  ]);

  await page.goto("/en/items/weapons");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest('a[href*="/items/weapons/"]')) event.preventDefault();
    }, true);
  });
  await page.locator('a[href="/en/items/weapons/ak74"]').first().click();

  await expect.poll(() => dataLayerEvents(page, "catalogue_item_open")).toEqual([
    expect.objectContaining({
      name: "catalogue_item_open",
      parameters: expect.objectContaining({item_slug: "ak74", item_type: "weapons", locale: "en"})
    })
  ]);
});

test("homepage priority links emit a task click before navigation", async ({page}) => {
  await page.goto("/en");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest("a[data-home-task]")) event.preventDefault();
    }, true);
  });
  await page.locator('a[data-home-task="weapons"]').click();
  await expect.poll(() => dataLayerEvents(page, "home_task_click")).toEqual([
    expect.objectContaining({
      parameters: expect.objectContaining({task: "weapons", placement: "hero", locale: "en"})
    })
  ]);
});

test("video starts and catalogue filters emit their dedicated events", async ({page}) => {
  await page.goto("/en/videos/wardogs-everything-before-playing");
  await waitForAnalyticsReady(page);
  await page.getByRole("button", {name: /WARDOGS - Everything You Need to Know/}).click();
  await expect.poll(() => dataLayerEvents(page, "video_start")).toHaveLength(1);

  await page.goto("/en/items/weapons");
  await waitForAnalyticsReady(page);
  await page.getByRole("button", {name: "Assault rifle", exact: true}).click();
  await expect.poll(() => dataLayerEvents(page, "catalogue_filter")).toEqual([
    expect.objectContaining({
      name: "catalogue_filter",
      parameters: expect.objectContaining({filter_value: "assault-rifle", locale: "en"})
    })
  ]);
});

test("language switching emits before navigation", async ({page}) => {
  const captured: CapturedEvent[] = [];
  await page.exposeFunction("captureAnalyticsEvent", (command: unknown[]) => {
    if (command[0] !== "event") return;
    captured.push({
      name: String(command[1]),
      parameters: (command[2] ?? {}) as Record<string, unknown>
    });
  });

  await page.goto("/en/guides/wardogs-gameplay");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => {
    (window as Window & {gtag?: (...args: unknown[]) => void}).gtag = (...args: unknown[]) => {
      void (window as Window & {captureAnalyticsEvent?: (command: unknown[]) => Promise<void>})
        .captureAnalyticsEvent?.(args);
    };
  });
  await page.locator('select:visible').selectOption("de");
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay\/?$/);
  await expect.poll(() => captured).toContainEqual({
    name: "language_switch",
    parameters: expect.objectContaining({from_locale: "en", to_locale: "de"})
  });
});

test("engaged guide fires once after both time and depth thresholds", async ({page}) => {
  await page.clock.install();
  await page.goto("/en/guides/wardogs-gameplay");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.clock.fastForward(60_000);
  await expect.poll(() => dataLayerEvents(page, "engaged_guide")).toHaveLength(1);

  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event("resize"));
  });
  await page.waitForTimeout(100);
  await expect(dataLayerEvents(page, "engaged_guide")).resolves.toHaveLength(1);
});

test("background time cannot qualify a guide or create a page view", async ({page}) => {
  await page.clock.install();
  await page.addInitScript(() => {
    Object.defineProperty(document, "visibilityState", {configurable: true, get: () => "hidden"});
  });
  await page.goto("/en/guides/wardogs-gameplay");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event("scroll"));
  });
  await page.clock.fastForward(35 * 60_000);
  await expect(dataLayerEvents(page, "engaged_guide")).resolves.toEqual([]);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {configurable: true, get: () => "visible"});
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(59_000);
  await expect(dataLayerEvents(page, "engaged_guide")).resolves.toEqual([]);
  await page.clock.fastForward(1_000);
  await expect.poll(() => dataLayerEvents(page, "engaged_guide")).toHaveLength(1);
  await expect(dataLayerEvents(page, "page_view")).resolves.toEqual([]);
});

test("client navigation and back retain one config without manual page views", async ({page}) => {
  await page.goto("/en");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => { document.documentElement.dataset.analyticsDocument = "same-document"; });
  await page.locator('a[data-home-task="weapons"]').click();
  await expect(page).toHaveURL(/\/en\/items\/weapons\/?$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/?$/);
  const commands = await page.evaluate(() => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.map((entry) => Array.from(entry as ArrayLike<unknown>));
  });
  expect(commands.filter((entry) => entry[0] === "config")).toEqual([["config", "G-0GJ404WEYV"]]);
  expect(commands.findIndex((entry) => entry[0] === "config")).toBeLessThan(
    commands.findIndex((entry) => entry[0] === "event" && entry[1] === "home_task_click")
  );
  await expect(page.locator("html")).toHaveAttribute("data-analytics-document", "same-document");
  await expect(dataLayerEvents(page, "page_view")).resolves.toEqual([]);
});
