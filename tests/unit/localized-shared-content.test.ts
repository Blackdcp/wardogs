import {describe, expect, it} from "vitest";
import {itemLibrary} from "../../src/features/items/item-library";
import {getLocalizedItem} from "../../src/features/items/item-localization";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";
import {videoArticles} from "../../src/features/videos/video-library";

const localizedLocales = ["ru", "de", "pt-br", "ja"] as const;

const languageSignals = {
  ru: /[А-Яа-яЁё]/,
  de: /\b(?:der|die|das|und|mit|für|auf|Spiel|Zugang|Guide)\b/i,
  "pt-br": /\b(?:o|a|de|do|da|para|com|jogo|acesso|guia)\b/i,
  ja: /[\u3040-\u30ff\u3400-\u9fff]/
} as const;

describe("localized shared editorial content", () => {
  it("localizes every long-form video article instead of reusing English", () => {
    for (const locale of localizedLocales) {
      const localizedArticles = getLocalizedVideoArticles(locale);
      expect(localizedArticles, locale).toHaveLength(videoArticles.length);

      for (const article of localizedArticles) {
        const english = videoArticles.find(({slug}) => slug === article.slug)!;
        const bodyText = [
          article.title,
          article.description,
          article.quickAnswer,
          ...article.takeaways,
          ...article.sections.flatMap(({heading, body}) => [heading, ...body])
        ].join(" ");

        expect(article.title, `${locale}/${article.slug}`).not.toBe(english.title);
        expect(article.quickAnswer, `${locale}/${article.slug}`).not.toBe(english.quickAnswer);
        expect(bodyText, `${locale}/${article.slug}`).toMatch(languageSignals[locale]);
        expect(bodyText.length, `${locale}/${article.slug}`).toBeGreaterThanOrEqual(1_200);
      }
    }
  });

  it("localizes every Catalogue detail and publishes it in all five languages", () => {
    for (const item of itemLibrary) {
      expect(item.indexLocales, item.slug).toEqual(["en", "ru", "de", "pt-br", "ja"]);

      for (const locale of localizedLocales) {
        const localized = getLocalizedItem(item, locale);
        const bodyText = [
          localized.subtype,
          localized.statusLabel,
          localized.build,
          localized.summary,
          localized.description,
          localized.role,
          ...localized.strengths,
          ...localized.cautions,
          ...(localized.confirmedFacts ?? []),
          ...(localized.unconfirmedFacts ?? [])
        ].join(" ");

        expect(localized.summary, `${locale}/${item.slug}`).not.toBe(item.summary);
        expect(localized.description, `${locale}/${item.slug}`).not.toBe(item.description);
        expect(bodyText, `${locale}/${item.slug}`).toMatch(languageSignals[locale]);
        expect(bodyText.length, `${locale}/${item.slug}`).toBeGreaterThanOrEqual(700);
      }
    }
  });
});
