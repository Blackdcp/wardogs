import {expect, test, type Page} from "@playwright/test";
import {locales} from "../../src/config/site";
import {getGoldBudgetCopy} from "../../src/components/markets/gold-budget-panel";
import {goldBudgetCalculatorCopy} from "../../src/features/markets/gold-budget-copy";
import {recentVideoCopy} from "../../src/features/videos/recent-video-copy";
import {recentVideoUi} from "../../src/features/videos/recent-video-data";

// Inspect first-party rendering and navigation without ad impressions, analytics
// hits, or a YouTube connection. Player src changes are the tested handoff.
test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.hostname === "www.youtube-nocookie.com" && url.pathname.startsWith("/embed/")) {
      return route.fulfill({status: 200, contentType: "text/html", body: '<!doctype html><html><body style="margin:0;background:#000"></body></html>'});
    }
    return route.abort();
  });
  await context.routeWebSocket("**/*", (route) => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
});

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
}

for (const video of [
  {locale: "en" as const, width: 1440, height: 900, id: "liRK9si1Ubo", slug: "wardogs-season-2-developer-interview", chapter: "46:04", seconds: 2764, chapterIndex: 1},
  {locale: "en" as const, width: 1440, height: 900, id: "Qx1ndM1tc2Y", slug: "wardogs-fob-income-breakdown", chapter: "55:54", seconds: 3354, chapterIndex: 5},
  {locale: "ja" as const, width: 390, height: 844, id: "PhAVGZMIYCg", slug: "wardogs-offensive-support-playstyle", chapter: "8:14", seconds: 494, chapterIndex: 3},
  {locale: "ja" as const, width: 390, height: 844, id: "z7wMLQQtIIM", slug: "wardogs-solo-duo-fob-layout", chapter: "14:07", seconds: 847, chapterIndex: 3}
]) {
  test(`new ${video.locale} ${video.slug} watch page keeps the player above the fold and navigates a real chapter at ${video.width}px`, async ({page}, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({width: video.width, height: video.height});
    const pathname = `/${video.locale}/videos/${video.slug}`;
    expect((await page.goto(pathname))?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveText(recentVideoCopy[video.id][video.locale].title);
    const player = page.locator("[data-video-primary-player] iframe");
    await expect(player).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`);
    await expect(player).toBeInViewport({ratio: 0.5});
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expectNoHorizontalOverflow(page);
    const screenshot = info.outputPath(`video-${video.locale}-${video.width}.png`);
    await page.screenshot({path: screenshot});
    await info.attach("new-watch-first-screen", {path: screenshot, contentType: "image/png"});

    const chapter = page.getByRole("navigation", {name: recentVideoUi[video.locale].chapters, exact: true})
      .getByRole("link", {name: video.chapter, exact: true});
    await expect(chapter).toHaveAttribute("href", `${pathname}?t=${video.seconds}`);
    await chapter.click();
    await expect(page).toHaveURL((url) => url.pathname === pathname && url.searchParams.get("t") === String(video.seconds));
    await expect(player).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&start=${video.seconds}`);
    await expect(page.locator("[data-video-primary-player] figcaption a")).toHaveAttribute("href", `https://www.youtube.com/watch?v=${video.id}&t=${video.seconds}s`);
    const chapterTitle = recentVideoCopy[video.id][video.locale].chapterTitles[video.chapterIndex];
    await expect(page.locator(".guide-prose h2").filter({hasText: chapterTitle})).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

test("promoted videos preserve previously shared candidate anchors", async ({page}) => {
  for (const [id, slug] of [["Qx1ndM1tc2Y", "wardogs-fob-income-breakdown"], ["PhAVGZMIYCg", "wardogs-offensive-support-playstyle"]]) {
    await page.goto(`/en/videos#candidate-${id}`);
    await expect(page.locator(`#candidate-${id}`)).toHaveCount(1);
    const card = page.locator(`[data-current-video-source="${id}"]`);
    await expect(card).toBeInViewport();
    await expect(card.locator("a").first()).toHaveAttribute("href", `/en/videos/${slug}`);
    await card.locator("a").first().click();
    await expect(page).toHaveURL(new RegExp(`/en/videos/${slug}$`));
    await expect(page.locator("[data-video-primary-player] iframe")).toBeVisible();
  }
});

test("Gold budgets render all eight languages with complete steps and contained mobile layout", async ({page}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({width: 390, height: 844});
  for (const locale of locales) {
    expect((await page.goto(`/${locale}/gold-market`))?.status(), locale).toBe(200);
    const copy = getGoldBudgetCopy(locale);
    const panel = page.getByRole("region", {name: copy.title, exact: true});
    await expect(panel.getByRole("heading", {level: 2, name: copy.title, exact: true})).toBeVisible();
    await expect(panel.locator("ol > li")).toHaveText([...copy.steps]);
    await expect(panel.locator("thead th")).toHaveText([...copy.headings]);
    await expect(panel.locator("tbody tr")).toHaveCount(3);
    for (const [index, [state, decision]] of copy.rows.entries()) {
      await expect(panel.locator("tbody tr").nth(index).getByRole("rowheader")).toHaveText(state);
      await expect(panel.locator("tbody tr").nth(index).getByRole("cell")).toHaveText(decision);
    }
    await expect(panel.getByText(copy.example, {exact: true})).toBeVisible();
    for (const other of locales.filter(candidate => candidate !== locale)) {
      await expect(panel).not.toContainText(getGoldBudgetCopy(other).intro);
    }
    await expect(panel.getByRole("link", {name: `${copy.budget} →`, exact: true})).toHaveAttribute("href", `/${locale}/tools/loadout-budget`);
    await expect(panel.getByRole("link", {name: `${copy.wipe} →`, exact: true})).toHaveAttribute("href", `/${locale}/guides/wardogs-what-to-buy-before-wipe`);
    if (locale === "ja" || locale === "zh-tw") {
      await expect(page.locator("main")).not.toContainText(/Złoto można odkładać|Wywiad o rynku sprawdzony|Turn a cosmetic goal into a cash budget/);
      await panel.scrollIntoViewIfNeeded();
      const screenshot = info.outputPath(`gold-budget-${locale}-390.png`);
      await panel.screenshot({path: screenshot});
      await info.attach(`gold-budget-${locale}`, {path: screenshot, contentType: "image/png"});
    }
    await expectNoHorizontalOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("solo and reporting guides have usable localized related links and no self-link", async ({page, request, baseURL}) => {
  await page.setViewportSize({width: 390, height: 844});
  const checked = new Set<string>();
  for (const locale of ["en", "ja"] as const) {
    const solo = `/${locale}/guides/wardogs-solo-guide`;
    const report = `/${locale}/guides/wardogs-report-player`;
    expect((await page.goto(solo))?.status()).toBe(200);
    const toReport = page.locator(`.guide-prose a[href="${report}"]`);
    await expect(toReport).toHaveCount(1);
    await toReport.click();
    await expect(page).toHaveURL(new RegExp(`${report}$`));
    await expect(page.locator("main h1")).toBeVisible();
    const toSolo = page.locator(`.guide-prose a[href="${solo}"]`);
    await expect(toSolo).toHaveCount(1);
    await toSolo.click();
    await expect(page).toHaveURL(new RegExp(`${solo}$`));
    for (const pathname of [solo, report]) {
      expect((await page.goto(pathname))?.status()).toBe(200);
      const related = page.locator('section[aria-labelledby="related-title"]');
      const targets = await related.locator("a").evaluateAll(links => links.map(link => (link as HTMLAnchorElement).getAttribute("href")!));
      expect(targets.length).toBeGreaterThan(0);
      expect(new Set(targets).size).toBe(targets.length);
      for (const target of targets) {
        const url = new URL(target, baseURL!);
        expect(url.origin).toBe(new URL(baseURL!).origin);
        expect(url.pathname.startsWith(`/${locale}/guides/`)).toBe(true);
        expect(url.pathname).not.toBe(pathname);
        if (checked.has(url.pathname)) continue;
        checked.add(url.pathname);
        expect((await request.get(url.pathname, {maxRedirects: 0})).status(), url.pathname).toBe(200);
      }
      await expectNoHorizontalOverflow(page);
    }
  }
});

test("Gold offer calculation protects playing cash and clears stale results after editing", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/ja/gold-market");
  const panel = page.locator("[data-gold-budget-calculator]");
  const copy = goldBudgetCalculatorCopy.ja;
  for (const [key, value] of Object.entries({target: "30", owned: "21", cash: "1000000", reserve: "200000", offerGold: "9", offerCash: "750000"})) {
    await panel.getByLabel(copy.fields[key as keyof typeof copy.fields], {exact: true}).fill(value);
  }
  await panel.getByRole("button", {name: copy.calculate, exact: true}).click();
  await expect(panel.getByRole("status")).toContainText(copy.fits);
  await expect(panel.getByRole("status")).toContainText("250,000");
  await panel.getByLabel(copy.fields.offerCash, {exact: true}).fill("900000");
  await expect(panel.getByRole("status")).toBeEmpty();
  await panel.getByRole("button", {name: copy.calculate, exact: true}).click();
  await expect(panel.getByRole("status")).toContainText(copy.reserveRisk);
  await panel.getByRole("button", {name: copy.reset, exact: true}).click();
  await expect(panel.getByLabel(copy.fields.target, {exact: true})).toHaveValue("");
  await expect(panel.getByRole("status")).toBeEmpty();
  const path = page.locator("[data-season-task-path]");
  await expect(path.locator("[aria-current=page]")).toHaveText("ゴールドマーケット");
  await path.locator('a[href="/ja/guides/wardogs-launch-checklist"]').click();
  await expect(page.locator("main h1")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
