import {describe, expect, it} from "vitest";
import {getLocalizedCatalogGuide, getLocalizedCatalogueRecords} from "../../src/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {getItemBySlug, itemLibrary} from "../../src/features/items/item-library";
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

  it("preserves Alpha and Closed Beta evidence dates in every localized catalogue surface", () => {
    const t21 = getCatalogueRecords("weapons").find((record) => record.slug === "t-21");
    const weaponsGuide = getCatalogGuide("weapons");
    expect(t21).toBeDefined();
    expect(weaponsGuide).toBeDefined();

    for (const locale of localizedLocales) {
      const localizedT21 = getLocalizedCatalogueRecords([t21!], locale)[0];
      const localizedGuide = getLocalizedCatalogGuide(weaponsGuide!, locale);

      expect(localizedT21.dataAsOf, locale).toMatch(/Beta|ベータ|бета/i);
      expect(localizedT21.dataAsOf, locale).not.toMatch(/Alpha 1/i);
      expect(localizedGuide.dataAsOf, locale).toMatch(/Alpha 1/i);
      expect(localizedGuide.dataAsOf, locale).toMatch(/Beta|ベータ|бета/i);
    }
  });

  it("localizes new Closed Beta subtypes, fact labels, and build dates on detail pages", () => {
    const m249 = getItemBySlug("m249-saw");
    const talon = getItemBySlug("talon-9k-sam");
    expect(m249).toBeDefined();
    expect(talon).toBeDefined();

    for (const locale of localizedLocales) {
      const localizedM249 = getLocalizedItem(m249!, locale);
      const localizedTalon = getLocalizedItem(talon!, locale);

      expect(localizedM249.subtype, locale).not.toBe("LMG");
      expect(localizedTalon.subtype, locale).not.toBe("Stationary anti-air");
      expect(localizedTalon.facts.map((fact) => fact.label), locale).not.toContain("Closed Beta price");
      expect(localizedTalon.build, locale).not.toBe(talon!.build);
    }
  });
});
