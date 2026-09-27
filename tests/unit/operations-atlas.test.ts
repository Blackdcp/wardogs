import {describe, expect, it, vi} from "vitest";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {OperationsAtlas} from "../../src/components/maps/operations-atlas";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {
  filterOperationsAtlas,
  getLocalizedOperationsAtlasRecords,
  getOperationsAtlasCopy,
  operationsAtlasRecords,
  operationsAtlasTaskOrder,
} from "../../src/features/maps/operations-atlas";
import {getOperationsAtlasMediaSource} from "../../src/features/maps/operations-atlas-media";

vi.mock("@/i18n/navigation", () => ({
  Link: ({children, href, ...props}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {href: string}) =>
    React.createElement("a", {href, ...props}, children),
}));

describe("operations atlas", () => {
  it("builds seven sourced workflows from the normalized map records", () => {
    const guideSlugs = new Set(guideManifest.map(({slug}) => slug));
    const mapSlugs = new Set(getCatalogueRecords("maps").map(({slug}) => slug));

    expect(operationsAtlasRecords).toHaveLength(7);
    expect(operationsAtlasRecords[0]?.evidence.sourceUrl).toBe("https://www.team17.com/games/wardogs");
    expect(operationsAtlasRecords[0]?.sourceLabel).toBe("Official WARDOGS Team17 description");
    for (const record of operationsAtlasRecords) {
      expect(mapSlugs.has(record.id), record.id).toBe(true);
      expect(record.evidence.verifiedAt, record.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.evidence.sourceUrl, record.id).toMatch(/^https:\/\//);
      expect(record.evidence.sourceClass, record.id).toMatch(/official|creator-current|creator-historical|live-client|community-report/);
      expect(record.facts.length, record.id).toBeGreaterThanOrEqual(2);
      expect(record.sourceNotes.length, record.id).toBeGreaterThan(0);
      expect(guideSlugs.has(record.guideSlug), record.guideSlug).toBe(true);
      expect(record.relatedGuideSlugs.every((slug) => guideSlugs.has(slug)), record.id).toBe(true);
      expect(record.relatedToolHrefs.every((href) => href.startsWith("/tools/")), record.id).toBe(true);
      expect(JSON.stringify(record)).not.toMatch(/latitude|longitude|coordinates|gridReference/i);
    }
  });

  it("filters by task in stable source order", () => {
    expect(filterOperationsAtlas(operationsAtlasRecords, "all").map(({id}) => id)).toEqual([
      "battlefield-control-zone",
      "tower-terminal",
      "oil-rig-hot-zone",
      "fob-network",
      "cargo-route",
      "mortar-support",
      "helicopter-transport",
    ]);
    expect(filterOperationsAtlas(operationsAtlasRecords, "logistics").map(({id}) => id)).toEqual([
      "fob-network",
      "cargo-route",
      "helicopter-transport",
    ]);
    expect(filterOperationsAtlas(operationsAtlasRecords, "fire-support").map(({id}) => id)).toEqual([
      "mortar-support",
    ]);
    expect(operationsAtlasTaskOrder).toEqual([
      "all",
      "orientation",
      "objective",
      "construction",
      "logistics",
      "fire-support",
      "air-operations",
    ]);
  });

  it("has complete page, filter, evidence, visual, and entry copy in all six locales", () => {
    const englishTitles = Object.fromEntries(Object.entries(getOperationsAtlasCopy("en").entries).map(([id, entry]) => [id, entry.title]));
    for (const locale of locales) {
      const copy = getOperationsAtlasCopy(locale);
      expect(copy.metaTitle.length, locale).toBeGreaterThan(20);
      const isCjk = locale === "ja" || locale === "zh-cn";
      expect(copy.metaDescription.length, locale).toBeGreaterThanOrEqual(isCjk ? 60 : 120);
      expect(copy.metaDescription.length, locale).toBeLessThanOrEqual(isCjk ? 110 : 160);
      expect(Object.keys(copy.filters), locale).toEqual(expect.arrayContaining([...operationsAtlasTaskOrder]));
      expect(Object.keys(copy.entries).sort(), locale).toEqual(operationsAtlasRecords.map(({id}) => id).sort());
      for (const [id, entry] of Object.entries(copy.entries)) {
        expect(entry.title.trim().length, locale).toBeGreaterThan(3);
        if (locale !== "en") expect(entry.title, `${locale}/${id}`).not.toBe(englishTitles[id]);
        expect(entry.objective.trim().length, locale).toBeGreaterThan(5);
        expect(entry.context.trim().length, locale).toBeGreaterThan(5);
        expect(entry.summary.trim().length, locale).toBeGreaterThan(20);
      }
    }
  });

  it("localizes current, historical, contextual, and pending source scope without translating source titles", () => {
    const sourceScopeMatrix = {
      en: {
        "battlefield-control-zone": "The official Team17 description confirms the 256 km² map and randomized 2 x 2 km Control Zone; no fixed route is asserted.",
        "oil-rig-hot-zone": "The creator source demonstrates the Closed Beta construction, delivery, and activation sequence; numeric costs, cooldowns, and current availability remain unverified.",
        "cargo-route": "The approved cargo walkthrough demonstrates a Closed Beta purchase, loading, transport, and unloading sequence; controls, capacity, prices, and routes remain historical.",
      },
      de: {
        "battlefield-control-zone": "Die offizielle Team17-Beschreibung bestätigt die 256 km² große Karte und die zufällige 2 × 2 km große Control Zone; eine feste Route wird nicht behauptet.",
        "oil-rig-hot-zone": "Die Creator-Quelle zeigt den Bau-, Liefer- und Aktivierungsablauf der Closed Beta; Zahlenwerte für Kosten und Abklingzeiten sowie die aktuelle Verfügbarkeit bleiben unbestätigt.",
        "cargo-route": "Der freigegebene Fracht-Walkthrough zeigt den Kauf-, Belade-, Transport- und Entladeablauf der Closed Beta; Steuerung, Kapazität, Preise und Routen bleiben historische Angaben.",
      },
      ru: {
        "battlefield-control-zone": "Официальное описание Team17 подтверждает карту площадью 256 км² и случайную зону контроля 2 × 2 км; фиксированный маршрут не заявляется.",
        "oil-rig-hot-zone": "Источник автора показывает последовательность строительства, доставки и активации в Closed Beta; числовые значения стоимости и перезарядки, а также текущая доступность остаются неподтверждёнными.",
        "cargo-route": "Одобренное руководство по грузам показывает последовательность покупки, погрузки, перевозки и разгрузки в Closed Beta; управление, вместимость, цены и маршруты остаются историческими данными.",
      },
      "pt-br": {
        "battlefield-control-zone": "A descrição oficial da Team17 confirma o mapa de 256 km² e a Control Zone aleatória de 2 × 2 km; nenhuma rota fixa é afirmada.",
        "oil-rig-hot-zone": "A fonte do criador demonstra a sequência de construção, entrega e ativação da Closed Beta; custos numéricos, tempos de recarga e disponibilidade atual continuam não verificados.",
        "cargo-route": "O guia aprovado de carga demonstra a sequência de compra, carregamento, transporte e descarregamento da Closed Beta; controles, capacidade, preços e rotas permanecem históricos.",
      },
      ja: {
        "battlefield-control-zone": "Team17の公式説明は256 km²のマップとランダムに決まる2×2 kmのControl Zoneを確認しており、固定ルートがあるとはしていません。",
        "oil-rig-hot-zone": "クリエイターの資料は Closed Beta における建設、配送、起動の手順を示していますが、費用やクールダウンの数値、現在の利用可否は未確認です。",
        "cargo-route": "承認済みの貨物解説は Closed Beta における購入、積載、輸送、荷下ろしの手順を示していますが、操作、容量、価格、ルートは過去ビルドの情報です。",
      },
      "zh-cn": {
        "battlefield-control-zone": "Team17 官方说明确认地图面积为 256 平方公里，控制区为随机的 2×2 公里；未确认固定路线。",
        "oil-rig-hot-zone": "创作者来源展示了 Closed Beta 中建造、运输与启动的流程；具体成本、冷却时间及当前可用性仍未核验。",
        "cargo-route": "已批准的货运讲解展示了 Closed Beta 中购买、装载、运输与卸载的流程；按键、容量、价格和路线均属于历史版本信息。",
      },
    } as const;
    const cases = [
      {id: "battlefield-control-zone", current: true, sourceClass: "official", visual: "contextual"},
      {id: "oil-rig-hot-zone", current: false, sourceClass: "creator-historical", visual: "pending"},
      {id: "cargo-route", current: false, sourceClass: "creator-historical", visual: "contextual"},
    ] as const;

    for (const locale of locales) {
      const localizedRecords = getLocalizedOperationsAtlasRecords(locale);
      const copy = getOperationsAtlasCopy(locale);
      const html = renderToStaticMarkup(
        React.createElement(OperationsAtlas, {copy, guideTitles: {}, locale, toolLabels: {}}),
      );

      expect(html, locale).toContain(copy.sourceScopeLabel);
      expect(localizedRecords.map(({id}) => id), locale).toEqual(operationsAtlasRecords.map(({id}) => id));
      for (const localized of localizedRecords) {
        const original = operationsAtlasRecords.find(({id}) => id === localized.id)!;
        expect(localized.sourceNotes.length, `${locale}/${localized.id}`).toBeGreaterThan(0);
        expect(localized.sourceLabel, `${locale}/${localized.id}`).toBe(original.sourceLabel);
        if (locale !== "en") {
          expect(localized.sourceNotes, `${locale}/${localized.id}`).not.toEqual(original.sourceNotes);
          expect(html, `${locale}/${localized.id}`).not.toContain(original.sourceNotes[0]);
        }
      }
      for (const evidenceCase of cases) {
        const original = operationsAtlasRecords.find(({id}) => id === evidenceCase.id)!;
        const localized = localizedRecords.find(({id}) => id === evidenceCase.id)!;
        const expectedNote = sourceScopeMatrix[locale][evidenceCase.id];

        expect(localized.sourceNotes, `${locale}/${evidenceCase.id}`).toEqual([expectedNote]);
        expect(localized.evidence, `${locale}/${evidenceCase.id}`).toEqual(original.evidence);
        expect(localized.evidence.current, `${locale}/${evidenceCase.id}`).toBe(evidenceCase.current);
        expect(localized.evidence.sourceClass, `${locale}/${evidenceCase.id}`).toBe(evidenceCase.sourceClass);
        expect(localized.visual.state, `${locale}/${evidenceCase.id}`).toBe(evidenceCase.visual);
        expect(localized.sourceLabel, `${locale}/${evidenceCase.id}`).toBe(original.sourceLabel);
        expect(html, `${locale}/${evidenceCase.id}`).toContain(expectedNote);
        expect(html, `${locale}/${evidenceCase.id}`).toContain(original.sourceLabel);
      }
    }
  });

  it("separates editorial workflow from the exact sourced facts and source scope", () => {
    const copy = getOperationsAtlasCopy("en");
    const html = renderToStaticMarkup(
      React.createElement(OperationsAtlas, {copy, guideTitles: {}, locale: "en", toolLabels: {}})
    );

    expect(html).toContain("data-atlas-editorial-workflow");
    expect(html).toContain("data-atlas-sourced-facts");
    expect(html).toContain(copy.workflowNote);
    expect(html).toContain(copy.sourceScopeLabel);
    expect(html).toContain("The official Team17 description confirms the 256 km² map");
    expect(html).toContain("Official WARDOGS Team17 description");
    expect(html).toContain("Randomized 2 x 2 km Control Zone");
  });

  it("retains and separately renders complete localized visual provenance", () => {
    const englishRecords = getLocalizedOperationsAtlasRecords("en");

    for (const record of englishRecords) {
      const registrySource = getOperationsAtlasMediaSource(record.id);
      if (!registrySource) {
        expect(record.visual.state, record.id).toBe("pending");
        continue;
      }
      expect(record.visual, record.id).toMatchObject({
        state: registrySource.state,
        image: registrySource.image,
        sourceUrl: registrySource.sourceUrl,
        sourceLabel: registrySource.sourceLabel,
        retrievedAt: registrySource.retrievedAt,
        usageNote: registrySource.usageNote,
      });
    }

    const mortar = englishRecords.find(({id}) => id === "mortar-support")!;
    expect(mortar.visual.sourceUrl).toBe("https://www.youtube.com/watch?v=kg46BZ1H2W0");
    expect(mortar.visual.sourceUrl).not.toBe(mortar.evidence.sourceUrl);

    for (const locale of locales) {
      const records = getLocalizedOperationsAtlasRecords(locale);
      const copy = getOperationsAtlasCopy(locale);
      const html = renderToStaticMarkup(
        React.createElement(OperationsAtlas, {copy, guideTitles: {}, locale, toolLabels: {}}),
      );

      expect(html, `${locale} visual source label`).toContain(copy.visualSourceLabel);
      expect(html, `${locale} visual usage label`).toContain(copy.visualUsageLabel);
      for (const record of records.filter(({visual}) => visual.state !== "pending")) {
        const english = englishRecords.find(({id}) => id === record.id)!;
        expect(record.visual.sourceLabel, `${locale}/${record.id} source title`).toBe(english.visual.sourceLabel);
        expect(record.visual.sourceUrl, `${locale}/${record.id} source URL`).toBe(english.visual.sourceUrl);
        expect(record.visual.retrievedAt, `${locale}/${record.id} retrieved`).toBe(english.visual.retrievedAt);
        expect(record.visual.usageNote?.trim().length, `${locale}/${record.id} usage note`).toBeGreaterThan(20);
        expect(html, `${locale}/${record.id} usage render`).toContain(record.visual.usageNote);
        if (locale !== "en") expect(record.visual.usageNote, `${locale}/${record.id} localized usage`).not.toBe(english.visual.usageNote);
      }
    }
  });
});
