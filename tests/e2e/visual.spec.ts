import {expect, test, type Page} from "@playwright/test";
import {expectImagesLoaded, installDeterministicExternalMediaFallback} from "./helpers";
import {calculateMobileSegmentScrollTops} from "./visual-segments";

async function expectMobileCategoryScrollSegments(page: Page, name: string) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollTops = calculateMobileSegmentScrollTops(pageHeight, viewportHeight);

  await page.evaluate((padding) => {
    document.body.style.setProperty("padding-bottom", `${padding}px`, "important");
  }, viewportHeight);

  for (const [index, top] of scrollTops.entries()) {
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), top);
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot(`${name}-mobile-segment-${index + 1}.png`, {animations: "disabled"});
  }
}

for (const viewport of [
  {name: "mobile", width: 390, height: 844},
  {name: "desktop", width: 1440, height: 1200}
]) {
  for (const pageCase of [
    {name: "home", pathname: "/en"},
    {name: "guides", pathname: "/en/guides"},
    {name: "article", pathname: "/en/guides/wardogs-gameplay"},
    {name: "video-hub", pathname: "/en/videos"},
    {name: "video-article", pathname: "/en/videos/wardogs-everything-before-playing"},
    {name: "catalogue-hub", pathname: "/en/items"},
    {name: "catalogue-weapons", pathname: "/en/items/weapons"},
    {name: "catalogue-vehicles", pathname: "/en/items/vehicles"},
    {name: "catalogue-weapon-model", pathname: "/en/items/weapons/amp-9"},
    {name: "catalogue-vehicle-model", pathname: "/en/items/vehicles/bobcat"}
  ]) {
    test(`${pageCase.name} ${viewport.name} visual`, async ({page}) => {
      test.setTimeout(120_000);
      await installDeterministicExternalMediaFallback(page);
      await page.setViewportSize(viewport);
      await page.goto(pageCase.pathname);
      await page.addStyleTag({content: "nextjs-portal { display: none !important; }"});
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
