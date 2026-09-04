import {expect, test, type Page} from "@playwright/test";

type CapturedEvent = {
  name: string;
  parameters: Record<string, unknown>;
};

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
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
      return nativeSetTimeout(handler, timeout === 60_000 ? 25 : timeout, ...args);
    }) as typeof window.setTimeout;
  });

  await page.goto("/en/guides/wardogs-gameplay");
  await waitForAnalyticsReady(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => dataLayerEvents(page, "engaged_guide")).toHaveLength(1);

  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event("resize"));
  });
  await page.waitForTimeout(100);
  await expect(dataLayerEvents(page, "engaged_guide")).resolves.toHaveLength(1);
});
