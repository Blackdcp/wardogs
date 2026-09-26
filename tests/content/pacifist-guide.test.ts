import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

describe("non-combat WARDOGS guide", () => {
  it("answers the no-kill question in every locale using official sources without invented payouts", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-pacifist-guide");
      expect(guide, locale).toBeDefined();
      expect(guide?.frontmatter.order, locale).toBe(52);
      expect(guide?.frontmatter.sources.some((source) => source.kind === "official" && source.url.includes("store.steampowered.com/app/1867240")), locale).toBe(true);
      expect(guide?.body.length, locale).toBeGreaterThanOrEqual(1_200);
      expect(guide?.body, locale).not.toMatch(/\$\d+(?:\.\d+)?\s*(?:per|for each|each)\s*(?:revive|ride|delivery)/i);
    }
  });
});
