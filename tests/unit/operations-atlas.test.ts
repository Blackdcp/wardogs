import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {
  filterOperationsAtlas,
  getOperationsAtlasCopy,
  operationsAtlasRecords,
  operationsAtlasTaskOrder,
} from "../../src/features/maps/operations-atlas";

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
    for (const locale of locales) {
      const copy = getOperationsAtlasCopy(locale);
      expect(copy.metaTitle.length, locale).toBeGreaterThan(20);
      expect(copy.metaDescription.length, locale).toBeGreaterThanOrEqual(120);
      expect(Object.keys(copy.filters), locale).toEqual(expect.arrayContaining([...operationsAtlasTaskOrder]));
      expect(Object.keys(copy.entries).sort(), locale).toEqual(operationsAtlasRecords.map(({id}) => id).sort());
      for (const entry of Object.values(copy.entries)) {
        expect(entry.title.trim().length, locale).toBeGreaterThan(3);
        expect(entry.objective.trim().length, locale).toBeGreaterThan(5);
        expect(entry.context.trim().length, locale).toBeGreaterThan(5);
        expect(entry.summary.trim().length, locale).toBeGreaterThan(20);
      }
    }
  });
});
