import {expect, test} from "@playwright/test";

test("serves the exported site from the production domain root", async ({page, request}) => {
  const failures: string[] = [];
  page.on("requestfailed", (failedRequest) => {
    const error = failedRequest.failure()?.errorText ?? "unknown error";
    const url = failedRequest.url();
    const isAnalyticsProbe = url.startsWith("https://www.googletagmanager.com/gtag/js");
    if (failedRequest.method() !== "HEAD" && !error.includes("ERR_ABORTED")) {
      if (!isAnalyticsProbe || !error.includes("ERR_BLOCKED_BY_ORB")) {
        failures.push(`${failedRequest.method()} ${url}: ${error}`);
      }
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:3001/") && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("main")).toHaveCount(1);

  for (const pathname of [
    "/en/",
    "/en/guides/",
    "/en/guides/wardogs-gameplay/",
    "/pt-br/guides/wardogs-first-look/"
  ]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }

  await page.goto("/en/guides/wardogs-gameplay/");
  await page.locator("select:visible").selectOption("de");
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay\/$/);

  await page.goto("/en/");
  const localLinks = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(localLinks.every((href) => href?.startsWith("/"))).toBe(true);
  await expect(page.locator('link[rel="icon"][href="/icons/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"][href="/site.webmanifest"]')).toHaveCount(1);

  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    expect(await image.getAttribute("src")).toMatch(/^\//);
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("https://www.wardogswiki.com/en/news/</loc>");
  expect(sitemapText).toContain("https://www.wardogswiki.com/en/guides/wardogs-gameplay/</loc>");
  expect(failures).toEqual([]);
  expect((await page.goto("/en/guides/not-a-topic/"))?.status()).toBe(404);
});
