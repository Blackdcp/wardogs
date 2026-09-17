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
    });
    expect(requiredLevel?.right).toMatchObject({value: null, state: "unknown"});
    expect(price?.left.state).toBe("historical");
    expect(price?.right.state).toBe("historical");
    expect(weight?.left).toMatchObject({value: null, state: "unknown"});
    expect(weight?.right.state).toBe("historical");
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
