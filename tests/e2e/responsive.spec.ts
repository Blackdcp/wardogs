import {expect, test} from "@playwright/test";
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
      if (pathname === "/en") {
        const band = page.locator('[data-catalogue-home-band]');
        await expect(band.locator('[data-catalogue-entry]')).toHaveCount(6);
        await expect(band.locator('[data-catalogue-entry] img')).toHaveCount(6);
        await expect(band.locator('[data-catalogue-model-entry]')).toHaveCount(4);
        await expect(band.locator('[data-catalogue-model-entry] img')).toHaveCount(4);
      }
    }
  });
}

for (const viewport of [
  {name: "mobile", width: 390, height: 844},
  {name: "desktop", width: 1440, height: 1200}
]) {
  test(`${viewport.name} catalogue grids keep controls and records within the viewport`, async ({page}) => {
    await page.setViewportSize(viewport);

    for (const pathname of ["weapons", "ammo", "attachments"]) {
      await page.goto(`/en/items/${pathname}`);
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);

      const controls = page.locator('[data-catalogue-controls]');
      const before = await controls.boundingBox();
      await controls.getByRole("button").nth(1).click();
      const after = await controls.boundingBox();
      expect(after?.width).toBe(before?.width);
      expect(after?.height).toBe(before?.height);

      const visibleRecords = page.locator('[data-catalogue-record]:visible');
      for (let index = 0; index < await visibleRecords.count(); index += 1) {
        const box = await visibleRecords.nth(index).boundingBox();
        expect(box?.x).toBeGreaterThanOrEqual(0);
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width + 1);
      }
    }
  });
}
