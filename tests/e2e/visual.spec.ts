import {expect, test} from "@playwright/test";
import {expectImagesLoaded} from "./helpers";

for (const viewport of [
  {name: "mobile", width: 390, height: 844},
  {name: "desktop", width: 1440, height: 1200}
]) {
  for (const pageCase of [
    {name: "home", pathname: "/en"},
    {name: "guides", pathname: "/en/guides"},
    {name: "article", pathname: "/en/guides/wardogs-gameplay"},
    {name: "catalogue-hub", pathname: "/en/items"},
    {name: "catalogue-weapons", pathname: "/en/items/weapons"},
    {name: "catalogue-vehicles", pathname: "/en/items/vehicles"}
  ]) {
    test(`${pageCase.name} ${viewport.name} visual`, async ({page}) => {
      await page.setViewportSize(viewport);
      await page.goto(pageCase.pathname);
      await expectImagesLoaded(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page).toHaveScreenshot(`${pageCase.name}-${viewport.name}.png`, {fullPage: true, animations: "disabled"});
    });
  }
}
