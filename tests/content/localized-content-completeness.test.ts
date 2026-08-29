import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

const localizedLocales = ["ru", "de", "pt-br", "ja"] as const;

const languageSignals = {
  ru: /[А-Яа-яЁё]/,
  de: /\b(?:der|die|das|und|mit|für|auf|Spiel|Zugang|Guide)\b/i,
  "pt-br": /\b(?:o|a|de|do|da|para|com|jogo|acesso|guia)\b/i,
  ja: /[\u3040-\u30ff\u3400-\u9fff]/
} as const;

const forbiddenEnglishStructureHeadings = [
  "Quick Answer",
  "Confirmed Facts",
  "What Players Search For",
  "How to Use This Guide",
  "FAQ",
  "Sources and Last Checked",
  "Related Guides"
] as const;

describe("complete localized guide library", () => {
  it("publishes every guide as substantial localized content in all four translated languages", async () => {
    await expect(assertCompleteContentMatrix(["en", ...localizedLocales])).resolves.toBeUndefined();

    for (const locale of localizedLocales) {
      const summaries = await listGuideSummaries(locale);
      expect(summaries, locale).toHaveLength(43);

      for (const summary of summaries) {
        const guide = await loadGuideDocument(locale, summary.slug);
        const localizedText = [
          guide?.frontmatter.title,
          guide?.frontmatter.description,
          guide?.body,
          ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? [])
        ].join(" ");

        expect(localizedText, `${locale}/${summary.slug}`).toMatch(languageSignals[locale]);
        expect(guide?.body.length, `${locale}/${summary.slug}`).toBeGreaterThanOrEqual(1_200);

        const headings = guide?.body
          .split(/\r?\n/)
          .filter((line) => /^##\s+/.test(line))
          .map((line) => line.replace(/^##\s+/, "")) ?? [];

        for (const heading of forbiddenEnglishStructureHeadings) {
          expect(headings, `${locale}/${summary.slug} contains English heading: ${heading}`).not.toContain(heading);
        }
      }
    }
  });
});
