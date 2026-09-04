import {expect, type Page} from "@playwright/test";

export async function installDeterministicExternalMediaFallback(page: Page) {
  await page.route("https://i.ytimg.com/**", (route) => route.abort("failed"));
}

export async function expectImagesLoaded(page: Page) {
  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    const src = await image.getAttribute("src");
    await expect.poll(
      () => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
      {message: `Image did not load: ${src ?? "missing src"}`}
    ).toBe(true);
  }
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth}));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
}
