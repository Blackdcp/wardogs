import {describe, expect, it} from "vitest";
import {compareWeapons, getComparableWeapons} from "../../src/features/tools/weapon-compare-data";

describe("weapon comparison data", () => {
  it("offers only evidence-first weapons with indexable detail routes", () => {
    const weapons = getComparableWeapons();

    expect(weapons.map(({slug}) => slug)).toContain("amp-9");
    expect(weapons.map(({slug}) => slug)).toContain("deagle");
    expect(weapons.map(({slug}) => slug)).not.toContain("m4");
    expect(weapons.every(({href}) => href.startsWith("/items/weapons/"))).toBe(true);
  });

  it("keeps current, historical, and unknown evidence states on each compared field", () => {
    const comparison = compareWeapons("deagle", "amp-9");

    expect(comparison).not.toBeNull();
    const requiredLevel = comparison?.rows.find(({key}) => key === "change:Required level");
    const price = comparison?.rows.find(({key}) => key === "price");
    const weight = comparison?.rows.find(({key}) => key === "weight");

    expect(requiredLevel?.left).toMatchObject({
      value: "85",
      state: "current",
      build: "Season 1",
      sourceClass: "official",
      confidence: "confirmed",
    });
    expect(requiredLevel?.right).toMatchObject({value: null, state: "unknown"});
    expect(price?.left).toMatchObject({
      state: "historical",
      sourceClass: "live-client",
      confidence: "observed",
    });
    expect(price?.right).toMatchObject({
      state: "historical",
      sourceClass: "live-client",
      confidence: "observed",
    });
    expect(weight?.left).toMatchObject({
      value: null,
      state: "unknown",
      build: "Alpha 1 - 7 Aug 2026",
      verifiedAt: "2026-08-07",
      sourceClass: "live-client",
      confidence: "observed",
    });
    expect(weight?.right.state).toBe("historical");
  });

  it("does not borrow Deagle evidence for AMP-9's missing Required level field", () => {
    const comparison = compareWeapons("amp-9", "deagle");
    const requiredLevel = comparison?.rows.find(({key}) => key === "change:Required level");

    expect(requiredLevel?.left).toEqual({
      value: null,
      state: "unknown",
      build: null,
      verifiedAt: null,
      sourceClass: null,
      confidence: null,
    });
    expect(requiredLevel?.right).toMatchObject({
      value: "85",
      state: "current",
      build: "Season 1",
      verifiedAt: "2026-09-09",
      sourceClass: "official",
      confidence: "confirmed",
    });
  });

  it("rejects unknown or duplicate weapon selections", () => {
    expect(compareWeapons("amp-9", "amp-9")).toBeNull();
    expect(compareWeapons("not-a-weapon", "deagle")).toBeNull();
  });

  it("keeps translated missing values unknown instead of treating their labels as evidence", () => {
    const comparison = compareWeapons("deagle", "amp-9", "zh-cn");
    const weight = comparison?.rows.find(({key}) => key === "weight");

    expect(weight?.left).toMatchObject({value: null, state: "unknown"});
    expect(weight?.right.state).toBe("historical");
  });
});
