import {describe, expect, it} from "vitest";
import {
  getIndexableVisualViolations,
  getVisualCoverageEntries,
  getVisualCoverageSummary,
} from "../../src/features/catalogue/visual-coverage";

describe("visual coverage audit", () => {
  it("keeps every indexable detail page on one unique verified object image", () => {
    expect(getIndexableVisualViolations()).toEqual([]);
  });

  it("reports deterministic verified, contextual, and pending counts by group", () => {
    expect(getVisualCoverageSummary()).toEqual([
      {group: "weapons", total: 38, verified: 34, contextual: 0, pending: 4},
      {group: "vehicles", total: 28, verified: 25, contextual: 0, pending: 3},
      {group: "ammo", total: 14, verified: 14, contextual: 0, pending: 0},
      {group: "attachments", total: 40, verified: 40, contextual: 0, pending: 0},
      {group: "gear", total: 11, verified: 11, contextual: 0, pending: 0},
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
});
