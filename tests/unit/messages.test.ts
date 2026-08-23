import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const locales = ["en", "ru", "de", "pt-br"] as const;

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
});
