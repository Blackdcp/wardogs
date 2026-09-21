import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";

const root = process.cwd();

function source(pathname: string) {
  return readFileSync(join(root, pathname), "utf8");
}

describe("conservative Adsterra native placement", () => {
  it("renders one native banner on detail pages and none on index or home pages", () => {
    for (const pathname of [
      "src/app/[locale]/guides/[slug]/page.tsx",
      "src/app/[locale]/videos/[slug]/page.tsx",
      "src/app/[locale]/items/[type]/[slug]/page.tsx"
    ]) {
      const text = source(pathname);
      expect(text.match(/AdsterraNativeBanner/g) ?? [], pathname).toHaveLength(2);
      expect(text, pathname).toMatch(/<AdsterraNativeBanner label=\{[^}]+\} \/>/);
    }

    for (const pathname of [
      "src/app/[locale]/page.tsx",
      "src/app/[locale]/guides/page.tsx",
      "src/app/[locale]/videos/page.tsx",
      "src/app/[locale]/items/page.tsx",
      "src/app/[locale]/items/[type]/page.tsx"
    ]) {
      expect(source(pathname), pathname).not.toContain("AdsterraNativeBanner");
    }
  });

  it("keeps all locales labelled and discloses third-party ad processing", () => {
    for (const locale of locales) {
      const messages = JSON.parse(source(`messages/${locale}.json`)) as {
        article: {advertisement: string};
        privacy: {advertising: string};
      };

      expect(messages.article.advertisement, locale).toBeTypeOf("string");
      expect(messages.article.advertisement.trim().length, locale).toBeGreaterThan(0);
      expect(messages.privacy.advertising, locale).toMatch(/Google|AdSense/i);
      expect(messages.privacy.advertising, locale).toMatch(/Adsterra|third-party|terceiros|terceros|сторон|第三方|第三者/i);
      expect(messages.privacy.advertising, locale).toMatch(/IP/i);
      expect(messages.privacy.advertising, locale).toMatch(/browser|device|navegador|dispositivo|браузер|устройств|浏览器|设备|ブラウザ|端末/i);
    }
  });
});
