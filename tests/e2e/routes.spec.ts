import {expect, test} from "@playwright/test";

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
