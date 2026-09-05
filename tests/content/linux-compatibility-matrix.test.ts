import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const;

describe("Linux, Proton and Steam Deck compatibility matrix", () => {
  it("publishes a table-shaped, source-scoped matrix in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-linux-proton");
      const body = guide?.body ?? "";

      expect(body, locale).toContain("{/* compatibility-matrix */}");
      expect(body, locale).toContain("Proton");
      expect(body, locale).toContain("Steam Deck");
      expect((body.match(/\|/g) ?? []).length, locale).toBeGreaterThanOrEqual(20);
      expect(body, locale).toMatch(/2026-09-05/);
    }
  });
});
