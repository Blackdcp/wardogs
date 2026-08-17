import {expect, test, type Page} from "@playwright/test";
import {expectImagesLoaded} from "./helpers";

async function expectMobileCategoryScrollSegments(page: Page, name: string) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const segmentHeight = viewportHeight - 44;
  const segmentCount = Math.ceil((pageHeight - viewportHeight) / segmentHeight) + 1;

  for (let segment = 0; segment < segmentCount; segment += 1) {
    const top = Math.min(segment * segmentHeight, pageHeight - viewportHeight);
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), top);
    await expect(page).toHaveScreenshot(`${name}-mobile-segment-${segment + 1}.png`, {animations: "disabled"});
  }
}

for (const viewport of [
  {name: "mobile", width: 390, height: 844},
  {name: "desktop", width: 1440, height: 1200}
]) {
  for (const pageCase of [
    {name: "home", pathname: "/en"},
    {name: "catalogue-hub", pathname: "/en/items"},
    {name: "catalogue-weapons", pathname: "/en/items/weapons"},
    {name: "catalogue-vehicles", pathname: "/en/items/vehicles"}
  ]) {
    test(`${pageCase.name} ${viewport.name} visual`, async ({page}) => {
      await page.setViewportSize(viewport);
      await page.goto(pageCase.pathname);
      await expectImagesLoaded(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (viewport.name === "mobile" && (pageCase.name === "catalogue-weapons" || pageCase.name === "catalogue-vehicles")) {
        await expectMobileCategoryScrollSegments(page, pageCase.name);
        return;
      }
      await expect(page).toHaveScreenshot(`${pageCase.name}-${viewport.name}.png`, {fullPage: true, animations: "disabled"});
    });
  }
}
