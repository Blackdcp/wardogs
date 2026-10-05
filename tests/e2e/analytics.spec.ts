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
  // The production tag is deliberately disabled locally. Events remain in the
  // in-memory queue so this suite can verify interactions without sending data.
  await page.locator("#google-analytics").waitFor({state: "attached"});
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
  await page.locator('a[data-home-task="map"][data-home-placement="hero"]').click();
  await expect.poll(() => dataLayerEvents(page, "home_task_click")).toEqual([
    expect.objectContaining({
      parameters: expect.objectContaining({task: "map", placement: "hero", locale: "en"})
    })
  ]);
  await page.locator('a[data-home-task="videos"][data-home-placement="discovery"]').click();
  await expect.poll(() => dataLayerEvents(page, "home_task_click")).toContainEqual(
    expect.objectContaining({
      parameters: expect.objectContaining({task: "videos", placement: "discovery", locale: "en"})
    })
  );
  await expect.poll(() => dataLayerEvents(page, "home_task_click_videos")).toEqual([
    expect.objectContaining({
      parameters: expect.objectContaining({task: "videos", placement: "discovery", locale: "en"})
    })
  ]);
});

test("video embed activation and catalogue filters emit their dedicated events", async ({page}) => {
  await page.goto("/en/guides/wardogs-cargo-guide");
  await waitForAnalyticsReady(page);
  const evidence = page.locator("[data-workflow-video-evidence]");
  await evidence.locator("summary").click();
  await evidence.locator("[data-workflow-source]").first().getByRole("button").click();
  await expect.poll(() => dataLayerEvents(page, "video_embed_open")).toHaveLength(1);
  await expect(dataLayerEvents(page, "video_start")).resolves.toEqual([]);

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

test("local navigation and back send no production config or manual page views", async ({page}) => {
  await page.goto("/en");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => { document.documentElement.dataset.analyticsDocument = "same-document"; });
  await page.locator('a[data-home-task="map"][data-home-placement="hero"]').click();
  await expect(page).toHaveURL(/\/en\/tools\/map\/?$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/?$/);
  const commands = await page.evaluate(() => {
    const layer = (window as Window & {dataLayer?: unknown[]}).dataLayer ?? [];
    return layer.map((entry) => Array.from(entry as ArrayLike<unknown>));
  });
  expect(commands.filter((entry) => entry[0] === "config")).toEqual([]);
  expect(commands.filter((entry) => entry[0] === "event" && entry[1] === "home_task_click")).toHaveLength(1);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-analytics-document", "same-document");
  await expect(dataLayerEvents(page, "page_view")).resolves.toEqual([]);
});

test("cash calculator emits categorical outcomes after edits without recording inputs", async ({page}) => {
  await page.goto("/en/tools/cash-xp-calculator");
  await waitForAnalyticsReady(page);
  await expect(dataLayerEvents(page, "tool_result")).resolves.toEqual([]);
  await page.getByRole("spinbutton").first().fill("2");
  await expect.poll(() => dataLayerEvents(page, "tool_result")).toEqual([
    {name: "tool_result", parameters: {tool: "cash-xp-calculator", result: "cash_positive", locale: "en"}}
  ]);
  await expect(dataLayerEvents(page, "tool_start")).resolves.toEqual([
    {name: "tool_start", parameters: {tool: "cash-xp-calculator", locale: "en"}}
  ]);
  await page.getByRole("spinbutton").first().fill("3");
  await expect(dataLayerEvents(page, "tool_result")).resolves.toHaveLength(1);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
});

test("loadout budget records reserve verdict changes after user edits", async ({page}) => {
  await page.goto("/en/tools/loadout-budget");
  await waitForAnalyticsReady(page);
  await expect(dataLayerEvents(page, "tool_result")).resolves.toEqual([]);
  await page.getByLabel("Cash available", {exact: true}).fill("1000");
  await expect.poll(() => dataLayerEvents(page, "tool_result")).toEqual([
    {name: "tool_result", parameters: {tool: "loadout-budget", result: "reserve_missed", locale: "en"}}
  ]);
  await page.getByLabel("Cash available", {exact: true}).fill("10000");
  await expect.poll(() => dataLayerEvents(page, "tool_result")).toHaveLength(2);
  await expect(dataLayerEvents(page, "tool_start")).resolves.toHaveLength(1);
});
