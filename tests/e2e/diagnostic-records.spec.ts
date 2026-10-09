import {expect, test} from "@playwright/test";
import {getDiagnosticRecordCopy} from "../../src/features/guides/diagnostic-record-copy";

test.beforeEach(async ({context, baseURL}) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.routeWebSocket("**/*", route => new URL(route.url()).host === new URL(origin).host ? route.connectToServer() : route.close());
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin});
});
for (const {locale, width} of [{locale: "en" as const, width: 1440}, {locale: "ja" as const, width: 390}]) {
  test(`diagnostic records copy distinct usable templates in ${locale} at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const {kind, slug} of [
      {kind: "performance" as const, slug: "wardogs-best-settings"},
      {kind: "connection" as const, slug: "wardogs-server-status"},
      {kind: "linux" as const, slug: "wardogs-linux-proton"}
    ]) {
      const copy = getDiagnosticRecordCopy(locale, kind);
      await page.goto(`/${locale}/guides/${slug}`);
      const record = page.locator(`[data-diagnostic-record="${kind}"]`);
      await expect(record).toHaveCount(1);
      await record.locator("summary").click();
      await expect(record.locator("pre")).toHaveText(copy.text);
      await record.getByRole("button", {name: copy.copy, exact: true}).click();
      await expect(record.getByRole("status")).toHaveText(copy.copied);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(copy.text);
      const bounds = (await record.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    expect(errors).toEqual([]);
  });
}
