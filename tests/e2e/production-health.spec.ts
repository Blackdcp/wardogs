import {expect, test as base, type Page} from "@playwright/test";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"];
type Diagnostics = {
  pageErrors: string[];
  assetErrors: string[];
  collection: {event: string; pathname: string; referrer: string; sequence: string | null}[];
};

function publicPath(value: string | null) {
  if (!value) return "";
  try {return new URL(value).pathname;} catch {return "invalid";}
}

const test = base.extend<{diagnostics: Diagnostics}>({
  diagnostics: [async ({context, page, baseURL}, use, info) => {
    const origin = new URL(baseURL!).origin;
    const diagnostics: Diagnostics = {pageErrors: [], assetErrors: [], collection: []};
    const allowGoogleTag = info.title.includes("automatic Google page views");
    const allowPlayer = info.title.includes("original video player");
    page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === origin && response.status() >= 400 && !response.request().isNavigationRequest()) {
        diagnostics.assetErrors.push(`${response.status()} ${url.pathname}`);
      }
    });
    await context.route("**/*", (route) => {
      const request = route.request();
      const url = new URL(request.url());
      // Never send test hits to a production analytics collector, including iframe hits.
      if (/\/(?:g\/|j\/)?collect\/?$/.test(url.pathname) || /(^|\.)google-analytics\.com$/.test(url.hostname)) {
        const lines = (request.postData() ?? "").split("\n").filter(Boolean);
        for (const line of lines.length ? lines : [""]) {
          const params = new URLSearchParams(url.search);
          new URLSearchParams(line).forEach((value, key) => params.set(key, value));
          if (params.has("en")) diagnostics.collection.push({event: params.get("en")!, pathname: publicPath(params.get("dl")), referrer: publicPath(params.get("dr")), sequence: params.get("_s")});
        }
        // A local acknowledgement prevents transport retries without sending a hit.
        return route.fulfill({status: 204, headers: {"access-control-allow-origin": request.headers().origin ?? "*", "access-control-allow-credentials": "true"}});
      }
      const googleScript = allowGoogleTag && url.hostname === "www.googletagmanager.com" && request.method() === "GET" && /^\/gtag\/(js|destination)$/.test(url.pathname);
      const playerAsset = allowPlayer && (/^(www\.)?youtube(?:-nocookie)?\.com$/.test(url.hostname) || /(^|\.)(?:ytimg\.com|googlevideo\.com|gstatic\.com)$/.test(url.hostname) || url.hostname === "youtubei.googleapis.com");
      if (url.origin === origin || googleScript || playerAsset) return route.continue();
      return route.abort();
    });
    await context.routeWebSocket("**/*", (route) => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
    await use(diagnostics);
    await info.attach("redacted-network-diagnostics", {body: JSON.stringify(diagnostics, null, 2), contentType: "application/json"});
  }, {auto: true}]
});

async function contained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
}

test("production crawl metadata, sitemap, robots and bot access", async ({request, page, baseURL}, info) => {
  const origin = new URL(baseURL!).origin;
  const receipts: {path: string; status: number; ms: number}[] = [];
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const rules = await robots.text();
  expect(rules).toContain("Allow: /");
  expect(rules).not.toMatch(/Disallow:\s*\/\s*$/m);
  expect(rules).toContain(`${origin}/sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = await page.evaluate((source) => Array.from(new DOMParser().parseFromString(source, "application/xml").getElementsByTagName("loc"), (node) => node.textContent!), xml);
  expect(urls.length).toBeGreaterThan(1000);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls.every((url) => new URL(url).origin === origin)).toBe(true);
  const paths = new Set(urls.map((url) => new URL(url).pathname));
  for (const locale of locales) {
    for (const suffix of ["", "/guides", "/items/weapons", "/guides/wardogs-playtest", "/guides/wardogs-money-guide", "/tools/map", "/tools/loadout-budget"]) {
      const path = `/${locale}${suffix}`;
      expect(paths.has(path), path).toBe(true);
      const began = Date.now();
      const response = await request.get(path, {maxRedirects: 0});
      receipts.push({path, status: response.status(), ms: Date.now() - began});
      expect(response.status(), path).toBe(200);
      expect(response.headers()["x-robots-tag"] ?? "", path).not.toMatch(/noindex/i);
      const html = await response.text();
      const metadata = await page.evaluate((source) => {
        const doc = new DOMParser().parseFromString(source, "text/html");
        return {
          canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          title: doc.title,
          description: doc.querySelector('meta[name="description"]')?.getAttribute("content"),
          robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
          headings: doc.querySelectorAll("h1").length,
          alternates: Array.from(doc.querySelectorAll('link[rel="alternate"][hreflang]'), (node) => node.getAttribute("href")!),
          structured: Array.from(doc.querySelectorAll('script[type="application/ld+json"]'), (node) => {JSON.parse(node.textContent!); return true;})
        };
      }, html);
      expect(metadata.canonical, path).toBe(`${origin}${path}`);
      expect(metadata.title.length, path).toBeGreaterThan(5);
      expect(metadata.description?.length, path).toBeGreaterThan(30);
      expect(metadata.robots, path).not.toMatch(/noindex/i);
      expect(metadata.headings, path).toBe(1);
      expect(metadata.alternates.length, path).toBeGreaterThanOrEqual(8);
      expect(metadata.alternates.every((url) => paths.has(new URL(url).pathname)), path).toBe(true);
    }
  }
  for (const agent of ["Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"]) {
    for (const path of ["/en", "/en/guides/wardogs-playtest", "/robots.txt"]) {
      const response = await request.get(path, {headers: {"User-Agent": agent}, maxRedirects: 0});
      expect(response.status(), `${agent}: ${path}`).toBe(200);
    }
  }
  const root = await request.get("/", {maxRedirects: 0});
  expect([307, 308]).toContain(root.status());
  expect(new URL(root.headers().location, origin).pathname).toBe("/en");
  const missing = await request.get("/en/items/vehicles/littlebird", {maxRedirects: 0});
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toMatch(/noindex/);
  await info.attach("crawl-receipts", {body: JSON.stringify({sitemapUrls: urls.length, receipts}, null, 2), contentType: "application/json"});
});

test("eight language homepages load first-party images without horizontal overflow", async ({page, diagnostics}, info) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const locale of locales) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status(), locale).toBe(200);
    await expect(page.locator("main h1")).toContainText(/WARDOGS/i);
    await page.locator("main img").first().scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator("main img").evaluateAll((images) => images.filter((image) => {
      const el = image as HTMLImageElement;
      const rect = el.getBoundingClientRect();
      return new URL(el.currentSrc || el.src).origin === location.origin && rect.top < innerHeight && rect.bottom > 0;
    }).every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)), {message: locale}).toBe(true);
    await contained(page);
    if (["en", "ja", "zh-tw", "pl"].includes(locale)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({path: info.outputPath(`home-${locale}-390.png`)});
    }
  }
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.assetErrors).toEqual([]);
});

for (const width of [768, 1440, 1920]) {
  test(`homepage and article first-party assets at ${width}px`, async ({page, diagnostics}, info) => {
    await page.setViewportSize({width, height: 900});
    for (const path of ["/en", "/zh-cn/guides/wardogs-cargo-guide"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      for (const image of await page.locator("main img").all()) {
        const src = await image.getAttribute("src");
        if (!src || (!src.startsWith("/") && new URL(src).origin !== new URL(page.url()).origin)) continue;
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      }
      await contained(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({path: info.outputPath(`${path.includes("cargo") ? "cargo" : "home"}-${width}.png`)});
    }
    expect(diagnostics.pageErrors).toEqual([]);
    expect(diagnostics.assetErrors).toEqual([]);
  });
}

test("mobile navigation and header search open a real guide", async ({page, diagnostics}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/en");
  const trigger = page.getByRole("button", {name: "Open menu"});
  await trigger.click();
  const nav = page.getByRole("navigation", {name: /primary/i});
  await nav.getByRole("button", {name: "Catalogue"}).click();
  await nav.getByRole("link", {name: "Weapons", exact: true}).click();
  await expect(page).toHaveURL(/\/en\/items\/weapons$/);
  await expect(nav).toBeHidden();
  await page.getByRole("button", {name: "Search WARDOGS Wiki"}).first().click();
  const dialog = page.getByRole("dialog", {name: "Search WARDOGS Wiki"});
  const input = dialog.getByRole("combobox", {name: "Search WARDOGS Wiki"});
  await input.fill("medic");
  await expect(dialog.getByRole("option").first()).toContainText(/medic|revive/i);
  await input.press("Enter");
  await expect(page).toHaveURL(/\/en\/guides\//);
  await expect(page.locator("main h1")).toBeVisible();
  await page.locator('select:visible').selectOption("ja");
  await page.waitForURL(/\/ja\/guides\//, {waitUntil: "domcontentloaded"});
  await expect(page.locator("main h1")).toContainText(/医療|蘇生/);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await contained(page);
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.assetErrors).toEqual([]);
});

test("automatic Google page views follow real navigation without transmitting test hits", async ({page, diagnostics}, info) => {
  await page.goto("/en");
  await expect.poll(() => diagnostics.collection.filter((row) => row.event === "page_view" && row.pathname === "/en").length).toBeGreaterThan(0);
  await page.locator('a[data-home-task="weapons"]').click();
  await expect(page).toHaveURL(/\/en\/items\/weapons$/);
  await expect.poll(() => diagnostics.collection.filter((row) => row.event === "page_view" && row.pathname === "/en/items/weapons").length).toBeGreaterThan(0);
  const beforeBack = diagnostics.collection.length;
  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  await expect.poll(() => diagnostics.collection.slice(beforeBack).filter((row) => row.event === "page_view" && row.pathname === "/en" && row.referrer === "/en/items/weapons").length).toBe(1);
  const commands = await page.evaluate(() => ((window as Window & {dataLayer?: ArrayLike<unknown>[]}).dataLayer ?? []).map((entry) => Array.from(entry)));
  expect(commands.filter((entry) => entry[0] === "config")).toHaveLength(1);
  expect(commands.filter((entry) => entry[0] === "event" && entry[1] === "page_view")).toHaveLength(0);
  expect(diagnostics.collection.filter((row) => row.event === "page_view").every((row) => Boolean(row.pathname))).toBe(true);
  expect(diagnostics.pageErrors).toEqual([]);
  await info.attach("automatic-views-summary", {body: JSON.stringify({source: "live Google tag", transport: "intercepted and locally acknowledged before collection", pageViews: diagnostics.collection.filter((row) => row.event === "page_view")}, null, 2), contentType: "application/json"});
});

test("original video player resolves on the published guide", async ({page, diagnostics}, info) => {
  await page.goto("/en/guides/wardogs-cargo-guide");
  const evidence = page.locator("[data-workflow-video-evidence]");
  await evidence.locator("summary").click();
  await evidence.getByRole("button").first().click();
  const player = page.frameLocator('iframe[src*="XUyP1GLUF5o"]');
  await expect(player.locator("body")).toContainText(/YouTube|FOB|supply|Wardogs/i);
  await expect(player.locator("body")).not.toContainText(/Video unavailable|Error 153|Error 150|Playback on other websites has been disabled/i);
  await expect.poll(() => player.locator("video").evaluateAll((videos) => videos.some((video) => video.readyState >= 2 && video.currentTime >= 212 && !video.paused && !video.error))).toBe(true);
  const playback = await player.locator("video").evaluateAll((videos) => videos.map((video) => ({readyState: video.readyState, currentTime: video.currentTime, paused: video.paused, error: video.error?.code ?? null})));
  await info.attach("player-state", {body: JSON.stringify(playback, null, 2), contentType: "application/json"});
  await page.screenshot({path: info.outputPath("live-video-embed.png")});
  expect(diagnostics.pageErrors).toEqual([]);
});
