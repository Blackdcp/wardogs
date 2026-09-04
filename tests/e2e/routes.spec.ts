import {expect, test} from "@playwright/test";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "../../src/features/catalogue/catalogue-types";
import {expectImagesLoaded} from "./helpers";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const;
const weaponModelSlugs = getCatalogueRecords("weapons")
  .filter((record) => record.detailStatus === "published")
  .map((record) => record.slug);
const vehicleModelSlugs = getCatalogueRecords("vehicles")
  .filter((record) => record.detailStatus === "published")
  .map((record) => record.slug);

test("root redirects and primary routes resolve", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
  for (const pathname of ["/en", "/en/guides", "/en/videos", "/en/news", "/en/guides/wardogs-gameplay", "/en/guides/wardogs-twitch-drops", "/en/guides/wardogs-beginner-guide", "/en/guides/wardogs-fob-guide", "/en/guides/wardogs-crash-fix", "/en/guides/wardogs-towers-guide", "/en/guides/wardogs-money-guide", "/en/guides/wardogs-helicopter-guide", "/en/guides/wardogs-mortar-guide", "/en/videos/wardogs-mortars-indirect-fire", "/en/videos/wardogs-everything-before-playing", "/en/videos/wardogs-best-settings", "/en/editorial-policy", "/en/privacy", "/en/terms"]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }
  expect((await page.goto("/en/guides/not-a-topic"))?.status()).toBe(404);
});

test("discovery media and editorial trust signals render on published articles", async ({page, request}) => {
  await page.goto("/en/guides/wardogs-crash-fix");

  await expect(page.getByRole("link", {name: "WARDOGS Wiki Editorial Team"})).toHaveAttribute("href", "/en/editorial-policy");
  await expect(page.locator('main img[src*="fupZGU7LJaU/hqdefault.jpg"]')).toHaveCount(1);

  const videoResponse = await request.get("/en/videos/wardogs-loadout-gear-guide");
  const videoHtml = await videoResponse.text();
  expect(videoResponse.status()).toBe(200);
  expect(videoHtml).toContain('"@type":"Clip"');
  expect(videoHtml).toContain("?t=474");

  await page.goto("/en/editorial-policy");
  await expect(page.getByRole("heading", {level: 1, name: "How We Research WARDOGS"})).toBeVisible();
  await expect(page.getByRole("heading", {level: 2, name: "Our verification method"})).toBeVisible();
});

test("guide direct answer uses the first explanatory paragraph instead of a markdown heading", async ({page}) => {
  await page.goto("/en/guides/wardogs-gameplay");
  const answer = page.locator("article > aside").first().locator("p").nth(1);

  await expect(answer).toContainText("BULKHEAD's upcoming tactical all-out warfare FPS");
  await expect(answer).toContainText("2016 War Dogs movie");
  await expect(answer).not.toHaveText("Quick Answer");
});

test("all localized home, index, and article routes resolve", async ({page}) => {
  test.setTimeout(90_000);

  for (const locale of locales) {
    expect((await page.goto(`/${locale}`))?.status(), locale).toBe(200);
    expect((await page.goto(`/${locale}/guides`))?.status(), `${locale} guide index`).toBe(200);
    expect((await page.goto(`/${locale}/news`))?.status(), `${locale} news`).toBe(200);
    await page.goto(`/${locale}/guides`);
    const hrefs = await page.locator('main a[href*="/guides/wardogs-"]').evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).pathname))]
    );
    expect(hrefs.length, `${locale} guide links`).toBeGreaterThan(0);
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
  for (const count of [
    `${getCatalogueRecords("weapons").length} weapons`,
    `${getCatalogueRecords("vehicles").length} vehicles`,
    `${getCatalogueRecords("ammo").length} calibres`,
    "21 optics + 34 magazines",
    `${getCatalogueRecords("gear").length} gear records`,
    "13 equipment items",
    "3 budget bands"
  ]) {
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
  for (const href of [
    "/en/items/weapons/a-91",
    "/en/items/weapons/amp-9",
    "/en/items/weapons/compound-bow",
    "/en/items/vehicles/bobcat",
    "/en/items/vehicles/l2a6",
    "/en/items/vehicles/uh-1y"
  ]) {
    await expect(previewRows.locator(`[data-catalogue-preview] a[href="${href}"]`), href).toHaveCount(1);
    expect((await page.request.get(href)).status(), href).toBe(200);
  }
  await expect(previewRows.locator('[data-catalogue-preview] > a')).toHaveCount(6);
  await expect(previewRows.locator("a")).toHaveCount(8);
  await expectImagesLoaded(page);
});

test("localized catalogue hubs keep model previews in the active locale", async ({page}) => {
  for (const locale of locales) {
    await page.goto(`/${locale}/items`);
    for (const href of [`/${locale}/items/weapons/amp-9`, `/${locale}/items/vehicles/bobcat`]) {
      await expect(page.locator(`[data-catalogue-preview] a[href="${href}"]`), href).toHaveCount(1);
      expect((await page.request.get(href)).status(), href).toBe(200);
    }
  }
});

test("category routes render approved heroes, complete explorers, safe anchors, and no ads", async ({page}) => {
  const visualCategories = [
    {type: "weapons", hero: "weapons-1280"},
    {type: "vehicles", hero: "vehicles-1280"},
    {type: "ammo", hero: "556x45mm"},
    {type: "attachments", hero: "attachments-1280"},
    {type: "gear", hero: "heavy-armor"}
  ];

  for (const category of visualCategories) {
    await page.goto(`/en/items/${category.type}`);
    await expect(page.locator('[data-catalogue-category-hero] img')).toHaveAttribute("src", new RegExp(category.hero));
    const recordCount = getCatalogueRecords(category.type as CatalogueRecordType).length;
    const imageCount = getCatalogueRecords(category.type as CatalogueRecordType)
      .filter((record) => record.mediaState !== "pending").length;
    await expect(page.locator('[data-catalogue-record]')).toHaveCount(recordCount);
    await expect(page.locator('[data-catalogue-record] img')).toHaveCount(imageCount);
    const linkedRecordCount = getCatalogueRecords(category.type as CatalogueRecordType)
      .filter((record) => record.detailStatus === "published").length;
    await expect(page.locator('[data-catalogue-record] a')).toHaveCount(linkedRecordCount);
    await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(0);
    await expectImagesLoaded(page);
  }

  for (const category of [
    {type: "equipment", hero: "meta-1280"},
    {type: "loadouts", hero: "loadouts-1280"}
  ]) {
    await page.goto(`/en/items/${category.type}`);
    await expect(page.locator('[data-catalogue-category-hero] img')).toHaveAttribute("src", new RegExp(category.hero));
    await expect(page.locator('[data-catalogue-explorer]')).toHaveCount(0);
    await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(0);
  }
});

test("weapon categories use locale-specific model links and keep standalone articles unique", async ({page}) => {
  await page.goto("/en/items/weapons");
  const standalone = page.getByRole("heading", {name: "Weapons: Detailed Guides"}).locator("xpath=ancestor::section");

  await expect(standalone.locator('a[href="/en/items/weapons/mortar"]')).toHaveCount(1);
  await expect(standalone.getByText("WARDOGS Mortar", {exact: true})).toHaveCount(1);
  for (const slug of weaponModelSlugs) {
    const href = `/en/items/weapons/${slug}`;
    const name = getCatalogueRecords("weapons").find((record) => record.slug === slug)?.name;
    expect(name, `${slug} catalogue record`).toBeDefined();
    const catalogueCard = page.locator(`[data-catalogue-record="${slug}"]`);
    await expect(catalogueCard.locator(`a[href="${href}"]`), `${slug} catalogue card`).toHaveCount(1);
    await expect(catalogueCard.getByText(name!, {exact: true}), `${slug} catalogue card name`).toHaveCount(1);
    await expect(page.locator(`th a[href="${href}"]`), `${slug} catalogue table row`).toHaveCount(1);
    await expect(standalone.locator(`a[href="${href}"]`), `${slug} standalone duplicate`).toHaveCount(0);
    await expect(standalone.getByText(`WARDOGS ${name}`, {exact: true}), `${slug} standalone name duplicate`).toHaveCount(0);
    await expect(page.locator(`a[href="${href}"]`), `${slug} visible links`).toHaveCount(2);
  }

  for (const locale of locales.filter((candidate) => candidate !== "en")) {
    expect((await page.goto(`/${locale}/items/weapons`))?.status(), `${locale} category`).toBe(200);
    for (const slug of weaponModelSlugs) {
      const localizedHref = `/${locale}/items/weapons/${slug}`;
      await expect(page.locator(`[data-catalogue-record="${slug}"] a[href="${localizedHref}"]`), `${locale} ${slug} card`).toHaveCount(1);
      await expect(page.locator(`th a[href="${localizedHref}"]`), `${locale} ${slug} table row`).toHaveCount(1);
    }
    expect((await page.request.get(`/${locale}/items/weapons/amp-9`)).status(), `${locale} model route`).toBe(200);
  }
});

test("vehicle categories use locale-specific model links and retain each legacy guide once", async ({page}) => {
  await page.goto("/en/items/vehicles");
  const standalone = page.getByRole("heading", {name: "Vehicles: Detailed Guides"}).locator("xpath=ancestor::section");

  for (const legacy of [
    {slug: "littlebird", name: "Littlebird"},
    {slug: "tank", name: "Tank"},
    {slug: "attack-helicopter", name: "Attack Helicopter"},
    {slug: "armored-transport", name: "Armored Transport"}
  ]) {
    await expect(standalone.locator(`a[href="/en/items/vehicles/${legacy.slug}"]`)).toHaveCount(1);
    await expect(standalone.getByText(`WARDOGS ${legacy.name}`, {exact: true})).toHaveCount(1);
  }

  for (const slug of vehicleModelSlugs) {
    const href = `/en/items/vehicles/${slug}`;
    const name = getCatalogueRecords("vehicles").find((record) => record.slug === slug)?.name;
    expect(name, `${slug} catalogue record`).toBeDefined();
    const catalogueCard = page.locator(`[data-catalogue-record="${slug}"]`);
    await expect(catalogueCard.locator(`a[href="${href}"]`), `${slug} catalogue card`).toHaveCount(1);
    await expect(catalogueCard.getByText(name!, {exact: true}), `${slug} catalogue card name`).toHaveCount(1);
    await expect(page.locator(`th a[href="${href}"]`), `${slug} catalogue table row`).toHaveCount(1);
    await expect(standalone.locator(`a[href="${href}"]`), `${slug} standalone duplicate`).toHaveCount(0);
    await expect(standalone.getByText(`WARDOGS ${name}`, {exact: true}), `${slug} standalone name duplicate`).toHaveCount(0);
    await expect(page.locator(`a[href="${href}"]`), `${slug} visible links`).toHaveCount(2);
  }

  for (const locale of locales.filter((candidate) => candidate !== "en")) {
    expect((await page.goto(`/${locale}/items/vehicles`))?.status(), `${locale} category`).toBe(200);
    for (const slug of vehicleModelSlugs) {
      const localizedHref = `/${locale}/items/vehicles/${slug}`;
      await expect(page.locator(`[data-catalogue-record="${slug}"] a[href="${localizedHref}"]`), `${locale} ${slug} card`).toHaveCount(1);
      await expect(page.locator(`th a[href="${localizedHref}"]`), `${locale} ${slug} table row`).toHaveCount(1);
    }
    expect((await page.request.get(`/${locale}/items/vehicles/bobcat`)).status(), `${locale} model route`).toBe(200);
  }
});

test("visual category responses contain every record in raw server HTML", async ({request}) => {
  const visualCategories: readonly CatalogueRecordType[] = ["weapons", "vehicles", "ammo", "attachments", "gear"];

  for (const type of visualCategories) {
    const response = await request.get(`/en/items/${type}`);
    const html = await response.text();
    const expectedIds = getCatalogueRecords(type).map((record) => `record-${type}-${record.slug}`);
    const renderedIds = [...html.matchAll(new RegExp(`id="(record-${type}-[^"]+)"`, "g"))].map((match) => match[1]);

    expect(response.status(), type).toBe(200);
    expect(renderedIds, `${type} raw server record ids`).toEqual(expectedIds);
  }

  const weaponsHtml = await (await request.get("/en/items/weapons")).text();
  for (const slug of weaponModelSlugs) {
    expect(weaponsHtml).toContain(`href="/en/items/weapons/${slug}"`);
  }
  const vehiclesHtml = await (await request.get("/en/items/vehicles")).text();
  for (const slug of vehicleModelSlugs) {
    expect(vehiclesHtml).toContain(`href="/en/items/vehicles/${slug}"`);
  }
});

test("category search and filters keep canonical URLs while published table rows open details", async ({page}) => {
  await page.goto("/en/items/weapons");
  const records = page.locator('[data-catalogue-record]');

  await page.getByRole("button", {name: "SMG", exact: true}).click();
  await page.getByLabel("Search: Weapons").fill("AMP-9");
  await expect(records.filter({visible: true})).toHaveCount(1);
  await expect(page.locator("#record-weapons-ak74")).toBeHidden();
  await expect(page).toHaveURL(/\/en\/items\/weapons\/?$/);

  const tableLink = page.locator('th a[href="/en/items/weapons/ak74"]');
  await expect(tableLink).toHaveCount(1);
  await tableLink.click();

  await expect(page).toHaveURL(/\/en\/items\/weapons\/ak74\/?$/);
  await expect(page.getByRole("heading", {level: 1, name: "WARDOGS AK74"})).toBeVisible();
});

test("every English weapon model route renders complete evidence", async ({page}) => {
  for (const slug of weaponModelSlugs) {
    const response = await page.goto(`/en/items/weapons/${slug}`);
    expect(response?.status(), slug).toBe(200);

    const image = page.locator("main header figure img");
    await expect(image, `${slug} detail image`).toHaveCount(1);
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth), `${slug} image pixels`).toBeGreaterThan(0);
    await expect(page.getByText("Quick answer", {exact: true})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Observed in Alpha 1", exact: true})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Unconfirmed for Early Access / final release", exact: true})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Sources", exact: true})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Sources", exact: true}).locator("xpath=following-sibling::ul/li")).not.toHaveCount(0);
  }

  expect((await page.goto("/ru/items/weapons/amp-9"))?.status()).toBe(200);
});

test("every English vehicle model route renders complete evidence", async ({page}) => {
  for (const slug of vehicleModelSlugs) {
    const record = getCatalogueRecords("vehicles").find((candidate) => candidate.slug === slug);
    expect(record, `${slug} catalogue record`).toBeDefined();

    const response = await page.goto(`/en/items/vehicles/${slug}`);
    expect(response?.status(), slug).toBe(200);

    await expect(page.locator("main h1"), `${slug} H1 count`).toHaveCount(1);
    await expect(page.getByRole("heading", {level: 1, name: `WARDOGS ${record!.name}`, exact: true})).toBeVisible();
    const image = page.locator("main header figure img");
    await expect(image, `${slug} detail image`).toHaveCount(1);
    await expect(image).toHaveAttribute("alt", record!.imageAlt);
    const renderedSrc = await image.getAttribute("src");
    expect(renderedSrc, `${slug} image src`).toBeTruthy();
    const renderedImageUrl = new URL(renderedSrc!, page.url());
    expect(renderedImageUrl.searchParams.get("url") ?? renderedImageUrl.pathname, `${slug} exact image`).toBe(record!.image);
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth), `${slug} image pixels`).toBeGreaterThan(0);
    await expect(page.getByText("Quick answer", {exact: true})).toBeVisible();
    const observed = page.getByRole("heading", {name: "Observed in Alpha 1", exact: true});
    const uncertain = page.getByRole("heading", {name: "Unconfirmed for Early Access / final release", exact: true});
    await expect(observed).toBeVisible();
    await expect(observed.locator("xpath=following-sibling::ul/li")).not.toHaveCount(0);
    await expect(uncertain).toBeVisible();
    await expect(uncertain.locator("xpath=following-sibling::ul/li")).not.toHaveCount(0);
    const sources = page.getByRole("heading", {name: "Sources", exact: true});
    await expect(sources).toBeVisible();
    await expect(sources.locator("xpath=following-sibling::ul/li")).not.toHaveCount(0);
  }

  expect((await page.goto("/ru/items/vehicles/bobcat"))?.status()).toBe(200);
});

test("homepage promotes the catalogue before video intelligence", async ({page}) => {
  await page.goto("/en");

  const band = page.locator('[data-catalogue-home-band]');
  await expect(band.getByRole("heading", {name: "WARDOGS Catalogue"})).toBeVisible();
  await expect(band.locator('[data-catalogue-entry]')).toHaveCount(6);
  await expect(band.locator("img")).toHaveCount(10);
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

test("localized homepages feature unique weapon and vehicle model links in the active locale", async ({page}) => {
  for (const locale of locales) {
    const expected = [
      `/${locale}/items/weapons/a-91`,
      `/${locale}/items/weapons/amp-9`,
      `/${locale}/items/vehicles/bobcat`,
      `/${locale}/items/vehicles/l2a6`
    ];
    await page.goto(`/${locale}`);
    const models = page.locator('[data-catalogue-home-band] [data-catalogue-model-entry]');
    await expect(models).toHaveCount(4);
    for (const href of expected) await expect(models.locator(`a[href="${href}"]`), `${locale} ${href}`).toHaveCount(1);
    expect(new Set(await models.locator("h3").allTextContents()).size).toBe(4);
    await expectImagesLoaded(page);
  }
});

test("localized privacy pages disclose the advertising provider", async ({page}) => {
  for (const locale of locales) {
    await page.goto(`/${locale}/privacy`);
    await expect(page.getByText(/Google|AdSense/i)).toBeVisible();
    await expect(page.getByText(/IP/)).toBeVisible();
  }
});
