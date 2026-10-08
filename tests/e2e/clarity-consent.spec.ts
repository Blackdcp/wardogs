import {expect, test, type BrowserContext} from "@playwright/test";

const origin = "https://www.wardogswiki.com";
const consentKey = "wardogs-clarity-consent-v1";
test.use({serviceWorkers: "block", viewport: {width: 1440, height: 900}});
test.afterEach(async ({page, context}) => {
  await page.close();
  await context.unrouteAll({behavior: "ignoreErrors"});
});

async function fixture(context: BrowserContext, baseURL: string | undefined) {
  if (!baseURL || !["127.0.0.1", "localhost"].includes(new URL(baseURL).hostname)) throw new Error("Clarity tests only proxy a local build; never send real analytics.");
  const local = new URL(baseURL).origin;
  const requests: string[] = [];
  const commands: unknown[][] = [];
  await context.exposeBinding("__clarityFixtureCommand", (_source, command: unknown[]) => { commands.push(command); });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if ([origin, local].includes(url.origin)) {
      const response = await route.fetch({url: `${local}${url.pathname}${url.search}`, maxRedirects: 0});
      return route.fulfill({response});
    }
    if (url.href === "https://www.clarity.ms/tag/yuie63egqv?ref=bwt") {
      requests.push(url.href);
      return route.fulfill({contentType: "application/javascript", body: `(() => {
        const queued = window.clarity.q || [];
        window.clarity = (...command) => window.__clarityFixtureCommand(command);
        queued.forEach(command => window.clarity(...command));
      })();`});
    }
    return route.abort("blockedbyclient");
  });
  await context.routeWebSocket("**/*", (route) => route.close());
  return {requests, commands};
}

test("Clarity opens only from footer settings, stays single across clean SPA, and revokes through a document reload", async ({page, context, baseURL}) => {
  const data = await fixture(context, baseURL);
  await page.goto(`${origin}/en`);
  await expect(page.locator("[data-clarity-settings]")).toBeVisible();
  await expect(page.locator("[data-clarity-consent]")).toHaveCount(0);
  await page.locator("[data-clarity-settings]").click();
  await expect(page.locator("[data-clarity-consent]")).toBeVisible();
  expect(data.requests).toHaveLength(0);
  await page.locator('[data-clarity-consent] a[href="/en/privacy"]').click();
  await expect(page).toHaveURL(`${origin}/en/privacy`);
  await expect(page.locator("[data-clarity-consent]")).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(`${origin}/en`);
  await expect(page.locator("[data-clarity-consent]")).toHaveCount(0);
  expect(data.requests).toHaveLength(0);
  await page.locator("[data-clarity-settings]").click();
  await page.locator('[data-clarity-choice="allowed"]').click();
  await expect.poll(() => data.requests.length).toBe(1);
  await expect.poll(() => data.commands).toEqual([["consentv2", {analytics_Storage: "granted", ad_Storage: "denied"}]]);
  const documentTime = await page.evaluate(() => performance.timeOrigin);
  await page.locator('footer a[href="/en/guides"]').click();
  await expect(page).toHaveURL(`${origin}/en/guides`);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentTime);
  expect(data.requests).toHaveLength(1);
  await page.locator("[data-clarity-settings]").click();
  await expect(page.locator("[data-clarity-consent]")).toBeVisible();
  await Promise.all([page.waitForEvent("load"), page.locator('[data-clarity-choice="denied"]').click()]);
  await expect(page.locator("#wardogs-microsoft-clarity")).toHaveCount(0);
  expect(data.requests).toHaveLength(1);
  expect(data.commands.slice(-2)).toEqual([["consentv2", {analytics_Storage: "denied", ad_Storage: "denied"}], ["stop"]]);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).choice, consentKey)).toBe("denied");
});

test("shared URLs, tool documents and local previews never load replay even with stored consent", async ({page, context, baseURL}) => {
  const data = await fixture(context, baseURL);
  await context.addInitScript((key) => {
    const now = Date.now();
    localStorage.setItem(key, JSON.stringify({version: 1, choice: "allowed", savedAt: now, expiresAt: now + 180 * 24 * 60 * 60 * 1000}));
  }, consentKey);
  for (const path of ["/en?query=private", "/en/tools/map#plan=private", "/en/tools/artillery-calculator", "/en/tools/ammo-matcher", "/en/guides/wardogs-map"]) {
    await page.goto(`${origin}${path}`);
    await expect(page.locator("[data-clarity-settings]")).toBeVisible();
    await page.locator("[data-clarity-settings]").click();
    await page.locator('[data-clarity-choice="allowed"]').click();
    await expect(page.locator("#wardogs-microsoft-clarity")).toHaveCount(0);
  }
  await page.goto(`${baseURL}/en`);
  await expect(page.locator("[data-clarity-settings]")).toBeVisible();
  await expect(page.locator("[data-clarity-consent]")).toHaveCount(0);
  expect(data.requests).toHaveLength(0);
});

test("mobile settings stay closed until requested and leave ad, search and navigation controls free", async ({page, context, baseURL}) => {
  await fixture(context, baseURL);
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(`${origin}/en`);
  const prompt = page.locator("[data-clarity-consent]");
  await expect(page.locator("[data-clarity-settings]")).toBeVisible();
  await expect(prompt).toHaveCount(0);
  await page.locator("[data-clarity-settings]").click();
  await expect(prompt).toBeVisible();
  const closeAd = page.getByRole("button", {name: "Close advertisement", exact: true});
  await expect(closeAd).toBeVisible();
  expect(await closeAd.evaluate((button) => {
    const box = button.getBoundingClientRect();
    return button.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
  })).toBe(true);
  for (const button of await page.locator("[data-clarity-choice]").all()) {
    expect(await button.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return [[box.left + 3, box.bottom - 3], [box.right - 3, box.bottom - 3], [box.left + box.width / 2, box.top + box.height / 2]]
        .every(([x, y]) => element.contains(document.elementFromPoint(x, y)));
    })).toBe(true);
  }
  const navigation = page.locator('[aria-controls="mobile-navigation"]');
  await navigation.click();
  await expect(prompt).toHaveCount(0);
  await navigation.click();
  await expect(prompt).toBeVisible();
  await page.locator('[data-hero-search-trigger="true"]').click();
  await expect(page.locator('[data-search-dialog-panel="command"]')).toBeVisible();
  await expect(prompt).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(prompt).toBeVisible();
  await page.goto(`${origin}/en/tools/map`);
  await expect(page.locator("[data-map-viewer]")).toBeVisible();
  await expect(prompt).toHaveCount(0);
});

test("Clarity's tool document boundary preserves the existing GA homepage click event", async ({page, context, baseURL}) => {
  const data = await fixture(context, baseURL);
  const homeClicks: unknown[][] = [];
  await context.exposeBinding("__captureHomeClick", (_source, args: unknown[]) => { homeClicks.push(args); });
  await page.goto(`${origin}/en`);
  await page.locator("[data-clarity-settings]").click();
  await page.locator('[data-clarity-choice="allowed"]').click();
  await expect.poll(() => data.requests.length).toBe(1);
  await page.evaluate(() => {
    const target = window as Window & {gtag?: (...args: unknown[]) => void; __captureHomeClick?: (args: unknown[]) => void};
    const original = target.gtag;
    target.gtag = (...args) => { if (args[0] === "event" && args[1] === "home_task_click") target.__captureHomeClick?.(args); original?.(...args); };
  });
  const documentTime = await page.evaluate(() => performance.timeOrigin);
  await page.locator('a[data-home-task][href="/en/tools/map"]').first().click();
  await expect(page).toHaveURL(`${origin}/en/tools/map`);
  await expect.poll(() => homeClicks.length).toBe(1);
  expect(homeClicks[0][2]).toMatchObject({page_path: "/en"});
  expect(await page.evaluate(() => performance.timeOrigin)).not.toBe(documentTime);
  await expect(page.locator("#wardogs-microsoft-clarity")).toHaveCount(0);
  expect(data.requests).toHaveLength(1);
});
