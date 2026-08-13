import {expect, test} from "@playwright/test";

const locales = ["en", "ru", "de", "pt-br"];

test("root redirects and primary routes resolve", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
  for (const pathname of ["/en", "/en/guides", "/en/guides/wardogs-gameplay", "/en/privacy", "/en/terms"]) {
    const response = await page.goto(pathname);
    expect(response?.status(), pathname).toBe(200);
  }
  expect((await page.goto("/en/guides/not-a-topic"))?.status()).toBe(404);
});

test("all localized home, index, and article routes resolve", async ({page}) => {
  for (const locale of locales) {
    expect((await page.goto(`/${locale}`))?.status(), locale).toBe(200);
    expect((await page.goto(`/${locale}/guides`))?.status(), `${locale} guide index`).toBe(200);
    const hrefs = await page.locator('main a[href*="/guides/wardogs-"]').evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).pathname))]
    );
    expect(hrefs, `${locale} guide links`).toHaveLength(20);
    for (const href of hrefs) expect((await page.goto(href))?.status(), href).toBe(200);
  }
});
