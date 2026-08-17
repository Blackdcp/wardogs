import {expect, test} from "@playwright/test";
import {expectImagesLoaded} from "./helpers";

const locales = ["en", "ru", "de", "pt-br"];

test("root redirects and primary routes resolve", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
  for (const pathname of ["/en", "/en/guides", "/en/videos", "/en/news", "/en/guides/wardogs-gameplay", "/en/videos/wardogs-mortars-indirect-fire", "/en/privacy", "/en/terms"]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }
  expect((await page.goto("/en/guides/not-a-topic"))?.status()).toBe(404);
});

test("all localized home, index, and article routes resolve", async ({page}) => {
  for (const locale of locales) {
    expect((await page.goto(`/${locale}`))?.status(), locale).toBe(200);
    expect((await page.goto(`/${locale}/guides`))?.status(), `${locale} guide index`).toBe(200);
    expect((await page.goto(`/${locale}/news`))?.status(), `${locale} news`).toBe(200);
    await page.goto(`/${locale}/guides`);
    const hrefs = await page.locator('main a[href*="/guides/wardogs-"]').evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).pathname))]
    );
    expect(hrefs, `${locale} guide links`).toHaveLength(20);
    for (const href of hrefs) expect((await page.goto(href))?.status(), href).toBe(200);
  }
});

test("item hubs and first item detail routes resolve", async ({page}) => {
  for (const pathname of ["/en/items", "/en/items/weapons", "/en/items/weapons/mortar", "/ru/items/vehicles/littlebird"]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }
});

test("catalogue hub is a visual evidence-labelled navigation surface", async ({page}) => {
  await page.goto("/en/items");

  await expect(page.getByRole("heading", {level: 1, name: "WARDOGS Catalogue"})).toBeVisible();
  await expect(page.locator('[data-catalogue-hero] img')).toHaveAttribute("src", /thegame-1280/);

  const categories = page.locator('[data-catalogue-category]');
  await expect(categories).toHaveCount(7);
  await expect(categories.locator("img")).toHaveCount(7);
  for (const count of ["33 weapons", "20 vehicles", "14 calibres", "21 optics + 34 magazines", "11 gear records", "13 equipment items", "3 budget bands"]) {
    await expect(categories.getByText(count, {exact: true})).toBeVisible();
  }
  for (const pathname of ["weapons", "vehicles", "ammo", "attachments", "gear", "equipment", "loadouts"]) {
    await expect(categories.locator(`a[href="/en/items/${pathname}"]`)).toHaveCount(1);
  }

  const legend = page.locator('[data-evidence-legend]');
  for (const label of ["Official", "Verified in game", "Pre-release build"]) {
    await expect(legend.getByText(label, {exact: true})).toBeVisible();
  }

  const previewRows = page.locator('[data-catalogue-preview-row]');
  await expect(previewRows).toHaveCount(2);
  await expect(previewRows.getByRole("heading", {name: "Featured Weapons"})).toBeVisible();
  await expect(previewRows.getByRole("heading", {name: "Featured Vehicles"})).toBeVisible();
  await expect(previewRows.locator('[data-catalogue-preview]')).toHaveCount(6);
  await expect(previewRows.locator('[data-catalogue-preview] a')).toHaveCount(0);
  await expect(previewRows.locator("a")).toHaveCount(2);
  await expectImagesLoaded(page);
});

test("homepage promotes the catalogue before video intelligence", async ({page}) => {
  await page.goto("/en");

  const band = page.locator('[data-catalogue-home-band]');
  await expect(band.getByRole("heading", {name: "WARDOGS Catalogue"})).toBeVisible();
  await expect(band.locator("a")).toHaveCount(6);
  await expect(band.locator("img")).toHaveCount(6);
  await expect(band.getByText("Equipment", {exact: true})).toHaveCount(0);
  await expectImagesLoaded(page);

  const catalogueTop = await band.evaluate((element) => element.getBoundingClientRect().top);
  const videoTop = await page.getByRole("heading", {name: "YouTube Footage Turned Into Standalone WARDOGS Guides"}).evaluate((element) => element.getBoundingClientRect().top);
  expect(catalogueTop).toBeLessThan(videoTop);

  for (const pathname of ["weapons", "vehicles", "ammo", "attachments", "gear", "loadouts"]) {
    const href = `/en/items/${pathname}`;
    await expect(band.locator(`a[href="${href}"]`)).toHaveCount(1);
    expect((await page.request.get(href)).status(), href).toBe(200);
  }
});

test("native banner loads on content details but not on indexes", async ({page}) => {
  await page.route("**/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `document.getElementById("container-481d6501bcd0c27b98bc3c4776a26f6e").textContent = "Test native ad";`
    });
  });

  for (const pathname of [
    "/en/guides/wardogs-gameplay",
    "/en/videos/wardogs-mortars-indirect-fire",
    "/en/items/weapons/mortar"
  ]) {
    await page.goto(pathname);
    await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);
    await expect(page.getByText("Test native ad")).toBeVisible();
  }

  await page.goto("/en/items/weapons/mortar");
  await page.locator('a[href="/en/guides/wardogs-gameplay"]').first().click();
  await expect(page).toHaveURL(/\/en\/guides\/wardogs-gameplay\/?$/);
  await expect(page.getByText("Test native ad")).toBeVisible();

  for (const pathname of ["/en", "/en/guides", "/en/videos", "/en/items"]) {
    await page.goto(pathname);
    await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(0);
  }
});

test("localized privacy pages disclose the advertising provider", async ({page}) => {
  for (const locale of locales) {
    await page.goto(`/${locale}/privacy`);
    await expect(page.getByText(/Adsterra/)).toBeVisible();
    await expect(page.getByText(/IP/)).toBeVisible();
  }
});
