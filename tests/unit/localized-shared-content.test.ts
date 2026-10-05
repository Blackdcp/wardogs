import {describe, expect, it} from "vitest";
import {
  getLocalizedCatalogGuide,
  getLocalizedCatalogueEvidenceDisclaimer,
  getLocalizedCatalogueRecords,
} from "../../src/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {catalogGuides, getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {getItemBySlug, itemLibrary} from "../../src/features/items/item-library";
import {getLocalizedItem} from "../../src/features/items/item-localization";
import {getMapViewerCopy} from "../../src/features/maps/map-viewer-copy";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";
import {videoArticles} from "../../src/features/videos/video-library";
import {getVideoUi} from "../../src/features/videos/video-ui";
import {getWorkflowCopy} from "../../src/features/tools/workflow-copy";
import {getToolCopy} from "../../src/features/tools/tool-copy";
import {getCompatibilityCopy} from "../../src/features/tools/equipment-compatibility-copy";
import {getArtilleryCopy} from "../../src/features/artillery/artillery-copy";
import {getMapMeasurementCopy} from "../../src/features/maps/map-measurement-copy";
import {interactiveMapPageCopy} from "../../src/features/maps/interactive-map-page-copy";

const localizedLocales = ["ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
const allLocales = ["en", ...localizedLocales] as const;

const languageSignals = {
  ru: /[А-Яа-яЁё]/,
  de: /\b(?:der|die|das|und|mit|für|auf|Spiel|Zugang|Guide)\b/i,
  "pt-br": /\b(?:o|a|de|do|da|para|com|jogo|acesso|guia)\b/i,
  ja: /[\u3040-\u30ff\u3400-\u9fff]/,
  "zh-cn": /[\u3400-\u9fff]/,
  "zh-tw": /[\u3400-\u9fff]/,
  pl: /(?:\bi\b|oraz|dla|gry|poradnik|źród|wczesn|wersj|fakty|potwierdz)/i
} as const;

const localizedDateSignals = {
  ru: /(?:августа|сентября|сезон|бета)/i,
  de: /(?:August|September|Saison|Beta)/i,
  "pt-br": /(?:agosto|setembro|temporada|beta)/i,
  ja: /(?:年|月|日|シーズン|ベータ)/,
  "zh-cn": /(?:年|月|日|赛季|测试)/,
  "zh-tw": /(?:年|月|日|賽季|測試)/,
  pl: /(?:sierpnia|września|sezon|beta)/i
} as const;

describe("localized shared editorial content", () => {
  it("covers tool headers, results, errors and empty states across the eight-language matrix", () => {
    const surfaces = (locale: typeof allLocales[number]) => ({
      tool: getToolCopy(locale), workflow: getWorkflowCopy(locale), compatibility: getCompatibilityCopy(locale),
      artillery: getArtilleryCopy(locale), measurement: getMapMeasurementCopy(locale), map: interactiveMapPageCopy[locale],
    });
    const leaves = (value: unknown, prefix = ""): Record<string, string> => {
      if (typeof value === "string") return {[prefix]: value};
      return Object.fromEntries(Object.entries(value as object).flatMap(([key, child]) => Object.entries(leaves(child, prefix ? `${prefix}.${key}` : key))));
    };
    const english = leaves(surfaces("en"));
    const stateKeys = ["tool.systemTitle", "tool.budgetTitle", "tool.result", "tool.resultReview", "tool.resultBelow", "workflow.noResults", "workflow.invalid", "compatibility.title", "compatibility.empty", "compatibility.invalid", "compatibility.failed", "artillery.title", "artillery.tooClose", "artillery.outOfRange", "measurement.title", "measurement.invalid", "measurement.invalidLink", "map.title", "map.desc"];
    for (const locale of allLocales) {
      const copy = leaves(surfaces(locale));
      expect(Object.keys(copy).sort(), locale).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(copy)) expect(value.trim().length, `${locale}/${key}`).toBeGreaterThan(0);
      for (const key of stateKeys) {
        expect(copy[key], `${locale}/${key}`).toBeTypeOf("string");
        if (locale !== "en") expect(copy[key], `${locale}/${key}`).not.toBe(english[key]);
      }
    }
  });
  it("uses authored Taiwan catalogue terminology", () => {
    const copy = getLocalizedCatalogGuide(getCatalogGuide("weapons")!, "zh-tw");
    expect(copy.description).toContain("測試版本");
    expect(copy.insights.join(" ")).toContain("補給計畫");
    expect(JSON.stringify(copy)).not.toMatch(/補給計劃|預釋出|單個影片|條記錄/);
    const boundaries = (["current", "historical", "mixed"] as const).map((state) => getLocalizedCatalogueEvidenceDisclaimer(state, "zh-tw")).join(" ");
    expect(boundaries).toContain("目前");
    expect(boundaries).not.toMatch(/當前|複核|歷史記錄/);
    const mortar = getLocalizedItem(getItemBySlug("mortar")!, "zh-tw");
    expect(mortar.description).toContain("紀錄");
    expect(mortar.description).not.toContain("影片已顯示");
  });
  it("uses Taiwan workflow terms instead of converted Simplified Chinese wording", () => {
    const copy = getWorkflowCopy("zh-tw");
    expect(copy.shareTooLarge).toContain("項目");
    expect(copy.shareTooLarge).toContain("網址列");
    expect(copy.custom).toBe("自訂");
    expect(copy.allTypes).toBe("所有類型");
    expect(copy.noResults).toBe("沒有符合的物品");
    expect(JSON.stringify(copy)).not.toMatch(/自定義|情景|全部型別|無匹配|專案|位址列/);
  });
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
        const minimumLength = locale === "zh-cn" || locale === "zh-tw" ? 900 : 1_200;
        expect(bodyText.length, `${locale}/${article.slug}`).toBeGreaterThanOrEqual(minimumLength);
      }
    }
  });

  it("localizes every Catalogue detail and publishes it in all supported languages", () => {
    for (const item of itemLibrary) {
      expect(item.indexLocales, item.slug).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]);

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
        const minimumLength = locale === "ja" || locale === "zh-cn" || locale === "zh-tw" ? 200 : 700;
        expect(bodyText.length, `${locale}/${item.slug}`).toBeGreaterThanOrEqual(minimumLength);
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

      expect(localizedT21.dataAsOf, locale).toMatch(/Beta|ベータ|бета|封闭测试|封閉測試/i);
      expect(localizedT21.dataAsOf, locale).not.toMatch(/Alpha 1/i);
      expect(localizedGuide.dataAsOf, locale).toMatch(/Alpha 1|Alfa 1/i);
      expect(localizedGuide.dataAsOf, locale).toMatch(/Beta|ベータ|бета|封闭测试|封閉測試/i);
    }
  });

  it("keeps Simplified Chinese video surfaces free of Japanese fallbacks and English template titles", () => {
    const localizedArticles = getLocalizedVideoArticles("zh-cn");
    const uiText = JSON.stringify(getVideoUi("zh-cn"));

    expect(uiText).not.toMatch(/[\u3040-\u30ff]/);
    for (const article of localizedArticles) {
      const english = videoArticles.find(({slug}) => slug === article.slug)!;
      const bodyText = [
        article.title,
        article.description,
        article.quickAnswer,
        ...article.takeaways,
        ...article.sections.flatMap(({heading, body}) => [heading, ...body])
      ].join(" ");

      expect(article.title, article.slug).not.toContain(english.title);
      expect(bodyText, article.slug).not.toMatch(/[\u3040-\u30ff]/);
    }
  });

  it("localizes current and historical evidence boundaries without overwriting official facts", () => {
    const current = getCatalogueRecords("deployables").find((record) => record.slug === "fob-vendor");
    const historical = getCatalogueRecords("equipment").find((record) => record.slug === "binoculars");
    expect(current).toBeDefined();
    expect(historical).toBeDefined();

    for (const locale of localizedLocales) {
      const [localizedCurrent] = getLocalizedCatalogueRecords([current!], locale);
      const [localizedHistorical] = getLocalizedCatalogueRecords([historical!], locale);

      expect(localizedCurrent.dataAsOf, locale).not.toBe("Season 1");
      expect(localizedHistorical.dataAsOf, locale).not.toBe("Pre-release catalogue walkthrough - 20 Aug 2026");
      expect(localizedCurrent.summary, locale).toMatch(languageSignals[locale]);
      expect(localizedHistorical.summary, locale).toMatch(languageSignals[locale]);
      expect(localizedCurrent.summary, `${locale} current`).not.toContain("Alpha");
      expect(localizedCurrent.summary, `${locale} current`).not.toMatch(/before Early Access|vor dem Early Access|до раннего доступа|antes do Acesso Antecipado|早期アクセス前|抢先体验前/i);
      expect(localizedCurrent.evidence).toEqual(current!.evidence);
      expect(localizedHistorical.evidence).toEqual(historical!.evidence);
    }
  });

  it("uses distinct current, historical, and mixed category disclaimers in every locale", () => {
    for (const locale of allLocales) {
      const states = (["current", "historical", "mixed"] as const).map((state) =>
        getLocalizedCatalogueEvidenceDisclaimer(state, locale)
      );

      expect(new Set(states).size, locale).toBe(3);
      expect(states.every((value) => value.trim().length > 30), locale).toBe(true);
      expect(states[0], `${locale} current`).not.toMatch(/before Early Access|vor dem Early Access|до раннего доступа|antes do Acesso Antecipado|早期アクセス前|抢先体验前/i);
      if (locale !== "en") expect(states.join(" "), locale).toMatch(languageSignals[locale]);
    }

    for (const locale of allLocales) {
      const historical = getLocalizedCatalogGuide(getCatalogGuide("weapons")!, locale);
      const mixed = getLocalizedCatalogGuide(getCatalogGuide("mechanics")!, locale);
      expect(historical.disclaimer, `${locale} historical`).toBe(getLocalizedCatalogueEvidenceDisclaimer("historical", locale));
      expect(mixed.disclaimer, `${locale} mixed`).toBe(getLocalizedCatalogueEvidenceDisclaimer("mixed", locale));
    }
  });

  it("localizes every guide date and every record source note across the locale matrix", () => {
    for (const locale of localizedLocales) {
      for (const guide of catalogGuides) {
        const localizedGuide = getLocalizedCatalogGuide(guide, locale);
        expect(localizedGuide.dataAsOf, `${locale}/${guide.id}`).not.toBe(guide.dataAsOf);
        expect(localizedGuide.dataAsOf, `${locale}/${guide.id}`).toMatch(localizedDateSignals[locale]);
      }

      for (const record of getCatalogueRecords("equipment").concat(
        getCatalogueRecords("deployables"),
        getCatalogueRecords("mechanics")
      )) {
        const [localized] = getLocalizedCatalogueRecords([record], locale);
        const notes = localized.sourceNotes.join(" ");
        expect(notes, `${locale}/${record.type}/${record.slug}`).not.toBe(record.sourceNotes.join(" "));
        expect(notes, `${locale}/${record.type}/${record.slug}`).toMatch(languageSignals[locale]);
        expect(localized.dataAsOf, `${locale}/${record.type}/${record.slug}`).not.toBe(record.dataAsOf);
      }
    }
  });

  it("localizes the current-video watchlist and archive lifecycle labels", () => {
    for (const locale of localizedLocales) {
      const ui = getVideoUi(locale);
      const lifecycleText = [
        ui.currentSourcesTitle,
        ui.currentSourcesDescription,
        ui.seasonOneCurrent,
        ui.betaWorkflow,
        ui.historicalReference
      ].join(" ");

      expect(lifecycleText, locale).toMatch(languageSignals[locale]);
      expect(ui.currentSourcesTitle, locale).not.toBe(getVideoUi("en").currentSourcesTitle);
    }
  });

  it("keeps map viewer chrome fully localized instead of merging English fallback fields", () => {
    const english = getMapViewerCopy("en");
    const fields = Object.keys(english) as Array<keyof typeof english>;

    for (const locale of localizedLocales) {
      const copy = getMapViewerCopy(locale);
      for (const field of fields) {
        expect(copy[field], `${locale}.${field}`).toBeTypeOf("string");
        expect(copy[field].trim().length, `${locale}.${field}`).toBeGreaterThan(0);
      }
      for (const field of ["close", "empty", "references", "unlocated", "marker", "label", "remove", "add", "center", "pan", "shareLink", "invalid", "limit", "measure", "provenance", "source", "version", "notes", "privacy"] as const) {
        expect(copy[field], `${locale}.${field}`).not.toBe(english[field]);
      }
      expect(Object.values(copy).join(" "), locale).toMatch(languageSignals[locale]);
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

  it("does not leak Japanese build labels into Simplified Chinese item pages", () => {
    for (const item of itemLibrary) {
      const localized = getLocalizedItem(item, "zh-cn");
      const visibleText = [
        localized.subtype,
        localized.statusLabel,
        localized.build,
        ...localized.facts.flatMap(({label, value}) => [label, value]),
        ...(localized.confirmedFacts ?? [])
      ].join(" ");

      expect(visibleText, item.slug).not.toMatch(/[\u3040-\u30ff]/);
      expect(visibleText, item.slug).not.toContain("Pre-release build");
      expect(visibleText, item.slug).not.toContain("Creator footage checked");
    }
  });

  it("translates complete build provenance rather than adding a localized prefix to English", () => {
    for (const locale of localizedLocales) for (const original of itemLibrary.filter((item) => item.indexable)) {
      const copy = getLocalizedItem(original, locale);
      expect(copy.build, `${locale}/${original.slug}`).not.toMatch(/and Closed Beta footage checked|Creator footage checked|7 Aug 2026/);
    }
  });

  it("uses Simplified Chinese item terminology throughout authored prose", () => {
    for (const original of itemLibrary.filter((item) => item.indexable)) {
      const copy = getLocalizedItem(original, "zh-cn");
      const prose = [copy.summary, copy.description, copy.role, ...copy.strengths, ...copy.cautions, ...(copy.confirmedFacts ?? []), ...(copy.unconfirmedFacts ?? [])].join(" ");
      expect(prose, original.slug).not.toMatch(/砲|硬体|身分|搜寻|自走炮/);
    }
  });

  it("does not leave ordinary English catalogue phrases on Simplified Chinese item pages", () => {
    const untranslated = new Set<string>();
    const allowedAmmunitionNames = new Set([
      ".308 Winchester",
      ".45 ACP",
      ".45 Colt",
      ".50 Cal",
      "12 Gauge",
      "7.62x54mmR",
    ]);

    for (const item of itemLibrary) {
      const localized = getLocalizedItem(item, "zh-cn");
      item.facts.forEach((fact, index) => {
        const localizedFact = localized.facts[index];
        for (const [source, translated] of [[fact.label, localizedFact.label], [fact.value, localizedFact.value]]) {
          if (source === translated && /[A-Za-z]{3}/.test(source) && !allowedAmmunitionNames.has(source)) {
            untranslated.add(source);
          }
        }
      });
    }

    expect([...untranslated].sort()).toEqual([]);
  });
});
