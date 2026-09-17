import {describe, expect, it} from "vitest";
import {
  auditCatalogueVisualCoverage,
  auditOperationsAtlasVisualCoverage,
  getIndexableVisualViolations,
  getVisualCoverageEntries,
  getVisualCoverageSummary,
} from "../../src/features/catalogue/visual-coverage";
import {catalogueMediaSources} from "../../src/features/catalogue/catalogue-media-sources";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {getOperationsAtlasCopy, operationsAtlasRecords} from "../../src/features/maps/operations-atlas";
import {operationsAtlasMediaSources} from "../../src/features/maps/operations-atlas-media";

describe("visual coverage audit", () => {
  it("keeps every indexable detail page on one unique verified object image", () => {
    expect(getIndexableVisualViolations()).toEqual([]);
  });

  it("reports deterministic verified, contextual, and pending counts by group", () => {
    expect(getVisualCoverageSummary()).toEqual([
      {group: "weapons", total: 38, verified: 34, contextual: 0, pending: 4},
      {group: "vehicles", total: 28, verified: 25, contextual: 0, pending: 3},
      {group: "ammo", total: 14, verified: 0, contextual: 0, pending: 14},
      {group: "attachments", total: 40, verified: 0, contextual: 0, pending: 40},
      {group: "gear", total: 11, verified: 0, contextual: 0, pending: 11},
      {group: "equipment", total: 5, verified: 0, contextual: 0, pending: 5},
      {group: "medical", total: 4, verified: 0, contextual: 0, pending: 4},
      {group: "supplies", total: 4, verified: 0, contextual: 0, pending: 4},
      {group: "deployables", total: 5, verified: 0, contextual: 0, pending: 5},
      {group: "mechanics", total: 4, verified: 0, contextual: 0, pending: 4},
      {group: "maps", total: 7, verified: 0, contextual: 0, pending: 7},
      {group: "operations-atlas", total: 7, verified: 1, contextual: 4, pending: 2},
    ]);
  });

  it("never uses a generic banner as record evidence", () => {
    const entries = getVisualCoverageEntries();
    const recordEvidence = entries.filter(({scope}) => scope === "catalogue");
    expect(recordEvidence.filter(({state}) => state === "verified").every(({image}) => !image?.includes("/banners/"))).toBe(true);
    expect(recordEvidence.filter(({state}) => state === "pending").every(({image, alt}) => image === undefined && alt === undefined)).toBe(true);
  });

  it("rejects wrong record state, duplicate images, banners, missing alt, missing files, and unapproved assets", () => {
    const verified = catalogueRecords.find((record) => record.mediaState === "verified")!;
    const second = catalogueRecords.find((record) => record.mediaState === "verified" && record.slug !== verified.slug)!;
    const key = `${verified.type}/${verified.slug}`;

    expect(auditCatalogueVisualCoverage([
      {...verified, mediaState: "context-only"},
    ], catalogueMediaSources, () => true)).toContain(`${key}: record media state does not match approved provenance`);

    expect(auditCatalogueVisualCoverage([
      verified,
      {...second, image: verified.image},
    ], catalogueMediaSources, () => true).join(" ")).toMatch(/duplicate object image/);

    const bannerImage = "/images/catalogue/banners/thegame-1280.webp";
    expect(auditCatalogueVisualCoverage([
      {...verified, image: bannerImage},
    ], {
      ...catalogueMediaSources,
      [bannerImage]: {...catalogueMediaSources[verified.image!]!, recordKey: key, image: bannerImage},
    }, () => true).join(" ")).toMatch(/generic banner/);

    expect(auditCatalogueVisualCoverage([{...verified, imageAlt: " "}], catalogueMediaSources, () => true).join(" ")).toMatch(/missing meaningful alt/);
    expect(auditCatalogueVisualCoverage([{...verified, image: "/images/catalogue/weapons/unapproved.webp"}], catalogueMediaSources, () => true).join(" ")).toMatch(/no approved provenance/);

    const missingImage = "/images/catalogue/weapons/missing-object.webp";
    expect(auditCatalogueVisualCoverage([
      {...verified, image: missingImage},
    ], {
      ...catalogueMediaSources,
      [missingImage]: {...catalogueMediaSources[verified.image!]!, recordKey: key, image: missingImage},
    }, () => false).join(" ")).toMatch(/asset file is missing/);
  });

  it("rejects a structurally complete provenance mutation that points at the generic overview video", () => {
    const verified = catalogueRecords.find((record) => record.mediaState === "verified")!;
    const key = `${verified.type}/${verified.slug}`;
    const source = catalogueMediaSources[verified.image!]!;

    const violations = auditCatalogueVisualCoverage([verified], {
      ...catalogueMediaSources,
      [verified.image!]: {
        ...source,
        sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
        sourceLabel: "General WARDOGS overview",
        capturedAt: "Item-specific catalogue sequence",
      },
    }, () => true);

    expect(violations).toContain(`${key}: source is not approved for object-level provenance`);
  });

  it("derives atlas coverage from provenance and catches visual mutations", () => {
    const mortar = operationsAtlasRecords.find((record) => record.id === "mortar-support")!;
    const cargo = operationsAtlasRecords.find((record) => record.id === "cargo-route")!;
    const copies = [{locale: "en", copy: getOperationsAtlasCopy("en")}];
    expect(mortar.visual.state).not.toBe("pending");
    expect(cargo.visual.state).not.toBe("pending");
    if (mortar.visual.state === "pending" || cargo.visual.state === "pending") {
      throw new Error("Atlas visual mutation fixtures require approved media");
    }
    const mortarVisual = mortar.visual;
    const cargoVisual = cargo.visual;

    expect(auditOperationsAtlasVisualCoverage([
      {...mortar, visual: {...mortarVisual, state: "contextual"}},
    ], operationsAtlasMediaSources, copies, () => true).join(" ")).toMatch(/visual state does not match approved provenance/);

    expect(auditOperationsAtlasVisualCoverage([
      mortar,
      {...cargo, visual: {...cargoVisual, image: mortarVisual.image}},
    ], operationsAtlasMediaSources, copies, () => true).join(" ")).toMatch(/duplicate atlas image/);

    const missingAltCopy = structuredClone(getOperationsAtlasCopy("en"));
    missingAltCopy.entries["mortar-support"].imageAlt = "";
    expect(auditOperationsAtlasVisualCoverage(
      [mortar],
      operationsAtlasMediaSources,
      [{locale: "en", copy: missingAltCopy}],
      () => true,
    ).join(" ")).toMatch(/missing meaningful alt/);

    expect(auditOperationsAtlasVisualCoverage([
      {...mortar, visual: {...mortarVisual, image: "/images/catalogue/vehicles/unapproved.webp"}},
    ], operationsAtlasMediaSources, copies, () => true).join(" ")).toMatch(/no approved provenance/);
  });
});
