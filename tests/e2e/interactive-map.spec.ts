import {expect, test} from "@playwright/test";

test("each real basemap loads and switching maps resets zoom", async ({page}) => {
  await page.goto("/en/tools/map");
  const selector = page.getByRole("combobox", {name: "Map"});
  const map = page.locator("[data-map-content]");
  const image = page.locator("[data-map-content] img");

  for (const name of ["bakurani", "ozeti", "zestafona"]) {
    await selector.selectOption(name);
    await expect(image).toHaveAttribute("src", `/images/maps/${name}/overview.webp`);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 2048 && element.naturalHeight === 2048)).toBe(true);
    await page.getByRole("button", {name: "Zoom in"}).click();
    await expect(map).not.toHaveCSS("transform", "none");
  }

  await selector.selectOption("bakurani");
  await expect(page.locator("[data-map-content] [title^='T']")).toHaveCount(0);
  await expect(page.getByText(/GRID:|1:16000|Tower 01/)).toHaveCount(0);
  await expect(page.getByRole("button", {name: /layers/i})).toHaveCount(0);
});

test("describes the three switchable 2D map images without claiming calibrated coordinates", async ({page}) => {
  const localizedBasemapWording = [
    {locale: "en", phrase: "2D map images"},
    {locale: "de", phrase: "2D-Kartenbilder"},
    {locale: "ru", phrase: "2D-изображения карт"},
    {locale: "pt-br", phrase: "imagens de mapas 2D"},
    {locale: "ja", phrase: "2Dマップ画像"},
    {locale: "zh-cn", phrase: "三张 2D 战场底图"}
  ];

  for (const {locale, phrase} of localizedBasemapWording) {
    await page.goto(`/${locale}/tools/map`);
    const description = await page.locator("main > header p").innerText();

    expect(description, locale).toContain(phrase);
    for (const mapName of ["Bakurani", "Ozeti", "Zestafona"]) {
      expect(description.toLowerCase(), `${locale}/${mapName}`).toContain(mapName.toLowerCase());
    }
    expect(description, locale).not.toMatch(/coordinates?|grid references?|座標|坐标|koordinaten|координат|coordenadas/i);
  }
});

test("map fits a narrow viewport without page overflow and supports pointer panning", async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto("/en/maps");
  const viewport = page.locator("[data-map-viewport]");
  const content = page.locator("[data-map-content]");
  await page.getByRole("button", {name: "Zoom in"}).click();
  await viewport.scrollIntoViewIfNeeded();
  const before = await content.getAttribute("style");
  const bounds = await viewport.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 - 70, bounds!.y + bounds!.height / 2 - 45, {steps: 8});
  await page.mouse.up();
  await expect(content).not.toHaveAttribute("style", before ?? "");
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(375);
});
