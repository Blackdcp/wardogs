import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja"] as const;
const slugs = [
  "wardogs-best-weapons-loadouts",
  "wardogs-armor-damage-ttk-guide",
  "wardogs-medic-revive-guide",
  "wardogs-equipment-tools-guide",
] as const;

const languageSignals = {
  en: /\b(?:the|and|with|guide|weapon)\b/i,
  de: /\b(?:der|die|das|und|mit|Guide|Waffe)\b/i,
  ru: /[А-Яа-яЁё]/,
  "pt-br": /\b(?:o|a|de|do|da|para|com|guia|arma)\b/i,
  ja: /[\u3040-\u30ff\u3400-\u9fff]/,
} as const;

describe("source-backed catalogue player guides", () => {
  it("publishes four substantial guide families in every supported locale", async () => {
    for (const slug of slugs) {
      expect(guideManifest).toContainEqual(expect.objectContaining({slug, category: "guide"}));

      for (const locale of locales) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.title}\n${guide?.frontmatter.description}\n${guide?.body}`;

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-08-30");
        expect(guide?.frontmatter.sources.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(2);
        expect(guide?.body.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(1_800);
        expect(searchable, `${locale}/${slug}`).toMatch(languageSignals[locale]);
        expect(guide?.body, `${locale}/${slug}`).toMatch(new RegExp(`\\(/${locale}/items/(?:weapons|vehicles|gear|attachments)`));
        expect(guide?.body, `${locale}/${slug}`).toMatch(/build-sensitive|buildabhängig|завис(?:ит|ят) от сборки|depend(?:e|em) da build|ビルド依存/i);
      }
    }
  });

  it("does not publish invented permanent damage or tier-list numbers", async () => {
    for (const locale of locales) {
      const armor = await loadGuideDocument(locale, "wardogs-armor-damage-ttk-guide");
      const weapons = await loadGuideDocument(locale, "wardogs-best-weapons-loadouts");
      const combined = `${armor?.body}\n${weapons?.body}`;

      expect(combined).toMatch(/not confirmed|nicht bestätigt|не подтвержден|não (?:está|estão)?\s*confirmad|未確認/i);
      expect(combined).not.toMatch(/(?:exact|exakt|точн|exato|正確).{0,30}(?:ttk|shots? to kill|treffer|выстрел|tiros|キル)/i);
    }
  });
});
