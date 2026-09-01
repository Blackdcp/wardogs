import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const;

function loadMessages(locale: (typeof locales)[number]) {
  return JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8")) as Record<string, unknown>;
}

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe("localized messages", () => {
  it("keeps every locale structurally identical to English", () => {
    const englishPaths = leafPaths(loadMessages("en")).sort();

    for (const locale of locales.slice(1)) {
      expect(leafPaths(loadMessages(locale)).sort(), locale).toEqual(englishPaths);
    }
  });

  it("keeps homepage SEO metadata within the requested limits", () => {
    for (const locale of locales) {
      const home = loadMessages(locale).home as {metaTitle: string; metaDescription: string};
      expect(home.metaTitle.length, `${locale} title`).toBeLessThanOrEqual(60);
      expect(home.metaDescription.length, `${locale} description`).toBeGreaterThanOrEqual(140);
      expect(home.metaDescription.length, `${locale} description`).toBeLessThanOrEqual(160);
    }
  });

  it("provides descriptive guide-index titles for search engines", () => {
    for (const locale of locales) {
      const guides = loadMessages(locale).guides as {metaTitle?: unknown};

      expect(guides.metaTitle, `${locale} guide title`).toBeTypeOf("string");
      if (typeof guides.metaTitle !== "string") continue;
      expect(guides.metaTitle.length, `${locale} guide title`).toBeGreaterThanOrEqual(30);
      expect(guides.metaTitle.length, `${locale} guide title`).toBeLessThanOrEqual(60);
      expect(guides.metaTitle, `${locale} guide title`).toContain("WARDOGS");
    }
  });

  it("provides complete privacy and terms metadata in every locale", () => {
    for (const locale of locales) {
      for (const namespace of ["privacy", "terms"] as const) {
        const messages = loadMessages(locale)[namespace] as {metaTitle?: unknown; metaDescription?: unknown};

        expect(messages.metaTitle, `${locale} ${namespace} title`).toBeTypeOf("string");
        expect(messages.metaDescription, `${locale} ${namespace} description`).toBeTypeOf("string");
        if (typeof messages.metaTitle !== "string" || typeof messages.metaDescription !== "string") continue;
        const cjk = locale === "ja" || locale === "zh-cn";
        expect(messages.metaTitle.length, `${locale} ${namespace} title`).toBeGreaterThanOrEqual(cjk ? 16 : 30);
        expect(messages.metaTitle.length, `${locale} ${namespace} title`).toBeLessThanOrEqual(60);
        expect(messages.metaDescription.length, `${locale} ${namespace} description`).toBeGreaterThanOrEqual(cjk ? 60 : 120);
        expect(messages.metaDescription.length, `${locale} ${namespace} description`).toBeLessThanOrEqual(cjk ? 110 : 160);
      }
    }
  });
});
