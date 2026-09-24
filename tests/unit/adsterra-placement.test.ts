import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";

const root = process.cwd();

function source(pathname: string) {
  return readFileSync(join(root, pathname), "utf8");
}

describe("aggressive Adsterra placement", () => {
  it("renders native, rectangle, and dual-smartlink inventory on detail and primary index pages", () => {
    for (const pathname of [
      "src/app/[locale]/guides/[slug]/page.tsx",
      "src/app/[locale]/videos/[slug]/page.tsx",
      "src/app/[locale]/items/[type]/[slug]/page.tsx",
      "src/app/[locale]/page.tsx",
      "src/app/[locale]/guides/page.tsx",
      "src/app/[locale]/videos/page.tsx",
      "src/app/[locale]/items/page.tsx",
      "src/app/[locale]/items/[type]/page.tsx"
    ]) {
      const text = source(pathname);
      expect(text.match(/AdsterraNativeBanner/g) ?? [], pathname).toHaveLength(2);
      expect(text, pathname).toMatch(/<AdsterraNativeBanner label=\{[^}]+\}/);
      expect(text, pathname).toContain("AdsterraDisplayBanner");
      expect(text, pathname).toContain("AdsterraSmartlink");
    }
  });

  it("keeps all locales labelled and discloses third-party ad processing", () => {
    for (const locale of locales) {
      const messages = JSON.parse(source(`messages/${locale}.json`)) as {
        article: {advertisement: string};
        ads: {label: string; smartlinkCta: string; smartlinkDescription: string; sponsored: string};
        privacy: {advertising: string};
      };

      expect(messages.article.advertisement, locale).toBeTypeOf("string");
      expect(messages.article.advertisement.trim().length, locale).toBeGreaterThan(0);
      expect(Object.values(messages.ads).every((value) => value.trim().length > 0), locale).toBe(true);
      expect(messages.privacy.advertising, locale).toMatch(/Adsterra/i);
      expect(messages.privacy.advertising, locale).toMatch(/Popunder/i);
      expect(messages.privacy.advertising, locale).toMatch(/Smartlink/i);
      expect(messages.privacy.advertising, locale).toMatch(/IP/i);
      expect(messages.privacy.advertising, locale).toMatch(/browser|device|navegador|dispositivo|браузер|устройств|浏览器|设备|ブラウザ|端末/i);
    }
  });
});
