import {expect, type Page} from "@playwright/test";

const adsterraScriptPattern = "**/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js";

export async function installDeterministicAdFallback(page: Page) {
  await page.route(adsterraScriptPattern, (route) => route.abort("failed"));
}

export async function expectAdSlotsTerminal(page: Page) {
  const slots = page.locator('[data-ad-slot="adsterra-native"]');
  for (let index = 0; index < await slots.count(); index += 1) {
    await expect(slots.nth(index)).toHaveAttribute("data-state", /^(filled|fallback)$/);
  }
}

export async function expectImagesLoaded(page: Page) {
  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth}));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
}
