import {test} from "@playwright/test";
import {expectImagesLoaded, expectNoHorizontalOverflow} from "./helpers";

for (const viewport of [
  {name: "mobile", width: 390, height: 844},
  {name: "tablet", width: 768, height: 1024},
  {name: "desktop", width: 1440, height: 1200},
  {name: "wide", width: 1920, height: 1200}
]) {
  test(`${viewport.name} layouts load assets without overflow`, async ({page}) => {
    await page.setViewportSize(viewport);
    for (const pathname of ["/en", "/en/news", "/de/guides", "/pt-br/guides/wardogs-gameplay"]) {
      await page.goto(pathname);
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);
    }
  });
}
