import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {EvidencePanel} from "../../src/components/catalogue/evidence-panel";
import {ItemChangeHistory} from "../../src/components/catalogue/item-change-history";
import {CatalogueBuildNotice} from "../../src/components/catalogue/catalogue-build-notice";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {getLocalizedCatalogueRecords} from "../../src/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import type {CatalogueChangeHistory, CatalogueEvidence} from "../../src/features/catalogue/catalogue-types";
import {getItemUi} from "../../src/features/items/item-ui";

const historicalEvidence: CatalogueEvidence = {
  build: "Closed Beta - 21-23 Aug 2026",
  verifiedAt: "2026-08-23",
  sourceClass: "live-client",
  confidence: "observed",
  current: false,
  sourceUrl: "https://store.steampowered.com/app/1867240/WARDOGS/"
};

describe("catalogue evidence views", () => {
  it("renders every normalized evidence field and its source", () => {
    const html = renderToStaticMarkup(
      <EvidencePanel dataAsOf="Closed Beta - 21-23 Aug 2026" evidence={historicalEvidence} locale="en" />
    );

    expect(html).toContain('data-evidence-state="historical"');
    expect(html).toContain("Historical");
    expect(html).toContain("Closed Beta - 21-23 Aug 2026");
    expect(html).toContain("Aug 23, 2026");
    expect(html).toContain("Live client");
    expect(html).toContain("Observed");
    expect(html).toContain("Not safe for current Season 1 decisions");
    expect(html).toContain('href="https://store.steampowered.com/app/1867240/WARDOGS/"');
  });

  it("labels current official evidence as decision-safe", () => {
    const currentEvidence: CatalogueEvidence = {
      build: "Season 1",
      verifiedAt: "2026-09-17",
      sourceClass: "official",
      confidence: "confirmed",
      current: true,
      sourceUrl: "https://store.steampowered.com/news/app/1867240/view/701027323413004455"
    };
    const html = renderToStaticMarkup(
      <EvidencePanel dataAsOf="Season 1" evidence={currentEvidence} locale="en" />
    );

    expect(html).toContain('data-evidence-state="current"');
    expect(html).toContain("Safe for current Season 1 decisions");
    expect(html).not.toContain("Not safe for current Season 1 decisions");
  });

  it("renders official changes chronologically with old and new values", () => {
    const changes: readonly CatalogueChangeHistory[] = [
      {
        id: "deagle-level",
        field: "Required level",
        previousValue: "90",
        currentValue: "85",
        effectiveBuild: "Season 1",
        verifiedAt: "2026-09-09",
        sourceUrl: "https://store.steampowered.com/news/app/1867240/view/701027323413004455",
        note: "Current official change"
      },
      {
        id: "historical-price",
        field: "Price",
        previousValue: "$700",
        currentValue: "$900",
        effectiveBuild: "Closed Beta",
        verifiedAt: "2026-08-23",
        sourceUrl: "https://store.steampowered.com/app/1867240/WARDOGS/"
      }
    ];
    const html = renderToStaticMarkup(<ItemChangeHistory changes={changes} locale="en" />);

    expect(html).toContain("Change history");
    expect(html).toContain("Old value");
    expect(html).toContain("$700");
    expect(html).toContain("New value");
    expect(html).toContain("$900");
    expect(html).toContain("90");
    expect(html).toContain("85");
    expect(html.indexOf("Aug 23, 2026")).toBeLessThan(html.indexOf("Sep 9, 2026"));
  });

  it("provides non-empty evidence and action labels in every locale", () => {
    for (const locale of ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const) {
      const itemUi = getItemUi(locale);
      const labels = [
        itemUi.current,
        itemUi.historical,
        itemUi.unknown,
        itemUi.decisionSafe,
        itemUi.notCurrentSafe,
        itemUi.sourceClass,
        itemUi.confidence,
        itemUi.changeHistory,
        itemUi.oldValue,
        itemUi.newValue,
        itemUi.effectiveBuild,
        itemUi.compare,
        itemUi.ammoMatcher
      ];

      expect(labels.every((label) => label.trim().length > 0), locale).toBe(true);
      expect(Object.values(itemUi.sourceClassLabels).every(Boolean), `${locale} source classes`).toBe(true);
      expect(Object.values(itemUi.confidenceLabels).every(Boolean), `${locale} confidence`).toBe(true);
    }
  });

  it("shows normalized freshness on catalogue cards and the build notice", () => {
    const amp9 = getCatalogueRecords("weapons").find((record) => record.slug === "amp-9");
    expect(amp9).toBeDefined();

    const cardHtml = renderToStaticMarkup(<CatalogueCard locale="en" record={amp9!} />);
    const noticeHtml = renderToStaticMarkup(<CatalogueBuildNotice locale="en" />);

    expect(cardHtml).toContain('data-catalogue-freshness="historical"');
    expect(cardHtml).toContain("Historical");
    expect(noticeHtml).toContain("data-catalogue-freshness-summary");
    expect(noticeHtml).toMatch(/Historical: \d+/);
    expect(noticeHtml).toContain("101");
  });

  it("keeps downgraded equipment provenance visible without a borrowed source", () => {
    const binoculars = getCatalogueRecords("equipment").find((record) => record.slug === "binoculars");
    expect(binoculars).toBeDefined();

    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={binoculars!} />);

    expect(html).toContain('data-catalogue-evidence="equipment/binoculars"');
    expect(html).toContain("Observed build");
    expect(html).toContain("Verified on");
    expect(html).toContain("Source class");
    expect(html).toContain("Confidence");
    expect(html).toContain("Unverified");
    expect(html).toContain("Unknown");
    expect(html).not.toContain('href="https://www.youtube.com/watch?v=J5QZXLENLgQ"');
    expect(html).not.toMatch(/equipment sequence/i);
  });

  it("renders localized current, historical, and unknown evidence status plus source notes in all six locales", () => {
    const records = [
      getCatalogueRecords("mechanics").find((record) => record.slug === "persistent-cash")!,
      getCatalogueRecords("deployables").find((record) => record.slug === "at-mine")!,
      getCatalogueRecords("equipment").find((record) => record.slug === "binoculars")!,
    ];

    for (const locale of ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const) {
      const ui = getItemUi(locale);
      const localized = getLocalizedCatalogueRecords(records, locale);
      const html = localized.map((record) => renderToStaticMarkup(
        <CatalogueCard locale={locale} record={record} />
      )).join(" ");

      expect(html, `${locale} current`).toContain(ui.current);
      expect(html, `${locale} historical`).toContain(ui.historical);
      expect(html, `${locale} unknown`).toContain(ui.unknown);
      expect(html, `${locale} unverified`).toContain(ui.confidenceLabels.unverified);
      for (const record of localized) {
        for (const note of record.sourceNotes) expect(html, `${locale}/${record.slug}`).toContain(note);
      }
    }
  });
});
