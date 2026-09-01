import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

const staleGenericTestClaims = {
  en: /no (?:later|next|new|additional) (?:playtest|test)(?: date| window)? (?:is|has been|was)? ?(?:announced|confirmed|dated)|no current(?:ly announced)? playtest/i,
  de: /kein (?:weiterer|neuer|nächster) (?:Playtest|Test)(?:-Termin)? (?:ist |wurde )?(?:angekündigt|bestätigt)|ein weiterer Testtermin wurde nicht angekündigt/i,
  ru: /нов(?:ая|ый) (?:дата теста|тест|тестовая сессия) (?:не объявлен[а]?|не подтвержден[а]?)|новая тестовая сессия пока не объявлена/i,
  "pt-br": /nenhuma nova data de (?:teste|Playtest) foi anunciada|nenhum novo teste foi confirmado|nenhuma nova sessão posterior anunciada/i,
  ja: /次回(?:の)?(?:プレイテスト|テスト)(?:の日程)?は未発表|新しいテストは未発表|次回テスト未発表/,
  "zh-cn": /没有(?:公布|确认)?(?:下一次|后续)(?:的)?(?:Playtest|测试)|尚未公布下一次(?:Playtest|测试)/i,
} as const;

const stalePatchNotes = /supersedes older statements|ersetzt ältere Aussagen|заменяет старые фразы|substitui os trechos antigos|以前の記述より優先|优先于下文仍保留/i;

const currentPrepurchasePhrases = {
  en: /paid pre-purchase|paid pre-order/i,
  de: /bezahlte Vorbestellung/i,
  ru: /платн(?:ый|ого) предзаказ/i,
  "pt-br": /pré-venda paga/i,
  ja: /有料の予約購入/,
  "zh-cn": /付费预购/,
} as const;

describe("site-wide live status consistency", () => {
  it("does not publish generic no-test claims after the September 2 limited test announcement", async () => {
    for (const locale of locales) {
      for (const {slug} of guideManifest) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = [
          guide?.frontmatter.description,
          ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
          guide?.body,
        ].join("\n");

        expect(searchable, `${locale}/${slug}`).not.toMatch(staleGenericTestClaims[locale]);
        expect(searchable, `${locale}/${slug}`).not.toMatch(stalePatchNotes);
      }
    }
  });

  it("keeps the storefront on the current paid pre-purchase and edition prices", async () => {
    for (const locale of locales) {
      const steam = await loadGuideDocument(locale, "wardogs-steam");
      const price = await loadGuideDocument(locale, "wardogs-price");
      const searchable = `${steam?.frontmatter.description}\n${steam?.body}\n${price?.frontmatter.description}\n${price?.body}`;

      expect(steam?.frontmatter.updatedAt, `${locale}/wardogs-steam`).toBe("2026-09-01");
      expect(price?.frontmatter.updatedAt, `${locale}/wardogs-price`).toBe("2026-09-01");
      expect(searchable, `${locale}/commerce`).toContain("$39.99");
      expect(searchable, `${locale}/commerce`).toContain("$49.99");
      expect(searchable, `${locale}/commerce`).toMatch(currentPrepurchasePhrases[locale]);
    }
  });
});
