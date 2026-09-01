import {describe, expect, it} from "vitest";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {catalogueMediaSources} from "../../src/features/catalogue/catalogue-media-sources";
import {getItemByTypeAndSlug} from "../../src/features/items/item-library";

describe("catalogue competitive expansion contract", () => {
  it("publishes the documented pre-launch weapon and vehicle coverage", () => {
    expect(getCatalogueRecords("weapons")).toHaveLength(38);
    expect(getCatalogueRecords("vehicles")).toHaveLength(28);
  });

  it("keeps incomplete weapon identifiers visibly separate from verified records", () => {
    const incomplete = getCatalogueRecords("weapons").filter(
      (record) => record.evidenceTier === "identifier-only",
    );

    expect(incomplete).toHaveLength(4);
    expect(incomplete.every((record) => record.mediaState === "pending")).toBe(true);
    expect(incomplete.every((record) => record.sourceNotes.length > 0)).toBe(true);
  });

  it("labels the applicable build on every expanded record", () => {
    const expandedRecords = [
      ...getCatalogueRecords("weapons"),
      ...getCatalogueRecords("vehicles"),
    ];

    expect(expandedRecords.every((record) => record.dataAsOf.length > 0)).toBe(true);
    expect(expandedRecords.every((record) => record.sourceNotes.length > 0)).toBe(true);
  });

  it("renders source-linked imagery on the high-demand Mortar detail route", () => {
    const mortar = getItemByTypeAndSlug("weapons", "mortar");

    expect(mortar?.detailImage).toBe("/images/catalogue/vehicles/l81-mortar.webp");
    expect(mortar?.detailImageAlt).toMatch(/L81 mortar/i);
    expect(catalogueMediaSources[mortar!.detailImage!]).toEqual(expect.objectContaining({
      sourceUrl: "https://www.youtube.com/watch?v=kg46BZ1H2W0",
      capturedAt: "01:16",
    }));
  });
});
