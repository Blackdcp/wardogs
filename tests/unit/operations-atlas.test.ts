import {describe, expect, it, vi} from "vitest";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {OperationsAtlas} from "../../src/components/maps/operations-atlas";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {
  filterOperationsAtlas,
  getOperationsAtlasCopy,
  operationsAtlasRecords,
  operationsAtlasTaskOrder,
} from "../../src/features/maps/operations-atlas";

vi.mock("@/i18n/navigation", () => ({
  Link: ({children, href, ...props}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {href: string}) =>
    React.createElement("a", {href, ...props}, children),
}));

describe("operations atlas", () => {
  it("builds seven sourced workflows from the normalized map records", () => {
    const guideSlugs = new Set(guideManifest.map(({slug}) => slug));
    const mapSlugs = new Set(getCatalogueRecords("maps").map(({slug}) => slug));

    expect(operationsAtlasRecords).toHaveLength(7);
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

  it("separates editorial workflow from the exact sourced facts and source scope", () => {
    const copy = getOperationsAtlasCopy("en");
    const html = renderToStaticMarkup(
      React.createElement(OperationsAtlas, {copy, guideTitles: {}, locale: "en", toolLabels: {}})
    );

    expect(html).toContain("data-atlas-editorial-workflow");
    expect(html).toContain("data-atlas-sourced-facts");
    expect(html).toContain(copy.workflowNote);
    expect(html).toContain(copy.sourceScopeLabel);
    expect(html).toContain("The official Steam description confirms the randomized objective model");
    expect(html).toContain("Randomized 2 x 2 km Control Zone");
  });
});
