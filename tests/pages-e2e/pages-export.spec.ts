import {expect, test} from "@playwright/test";

test("serves the exported site under the repository base path", async ({page, request}) => {
  const failures: string[] = [];
  page.on("requestfailed", (failedRequest) => {
    const error = failedRequest.failure()?.errorText ?? "unknown error";
    if (failedRequest.method() !== "HEAD" && !error.includes("ERR_ABORTED")) {
      failures.push(`${failedRequest.method()} ${failedRequest.url()}: ${error}`);
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:3001/wardogs/") && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/wardogs/");
  await expect(page).toHaveURL(/\/wardogs\/en\/$/);
  await expect(page.locator("main")).toHaveCount(1);

  for (const pathname of [
    "/wardogs/en/",
    "/wardogs/en/guides/",
    "/wardogs/en/guides/wardogs-gameplay/",
    "/wardogs/pt-br/guides/wardogs-first-look/"
  ]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }

  await page.goto("/wardogs/en/guides/wardogs-gameplay/");
  await page.locator("select:visible").selectOption("de");
  await expect(page).toHaveURL(/\/wardogs\/de\/guides\/wardogs-gameplay\/$/);

  await page.goto("/wardogs/en/");
  const localLinks = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(localLinks.every((href) => href?.startsWith("/wardogs/"))).toBe(true);
  await expect(page.locator('link[rel="icon"][href="/wardogs/icons/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"][href="/wardogs/site.webmanifest"]')).toHaveCount(1);

  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    expect(await image.getAttribute("src")).toMatch(/^\/wardogs\//);
  }

  const sitemap = await request.get("/wardogs/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://blackdcp.github.io/wardogs/en/guides/wardogs-gameplay/</loc>");
  expect(failures).toEqual([]);
  expect((await page.goto("/wardogs/en/guides/not-a-topic/"))?.status()).toBe(404);
});
