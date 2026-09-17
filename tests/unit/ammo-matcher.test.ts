import {describe, expect, it} from "vitest";
import {getAmmoMatches} from "../../src/features/tools/ammo-matcher-data";

describe("ammo matcher data", () => {
  it("matches a weapon to ammunition only through its explicit catalogue fact", () => {
    const result = getAmmoMatches({weapon: "amp-9"});

    expect(result.selectedWeapon?.slug).toBe("amp-9");
    expect(result.ammoMatches.map(({slug}) => slug)).toEqual(["9x19mm"]);
    expect(result.ammoMatches[0]).toMatchObject({
      relationshipValue: "9x19mm",
      state: "historical",
      sourceClass: "live-client",
      confidence: "observed",
    });
  });

  it("matches ammunition back to all and only weapons with the exact recorded value", () => {
    const result = getAmmoMatches({ammo: "9x19mm"});
    const names = result.weaponMatches.map(({slug}) => slug);

    expect(names).toContain("amp-9");
    expect(names).toContain("ggx-17");
    expect(names).not.toContain("deagle");
    expect(result.weaponMatches.every(({relationshipValue}) => relationshipValue === "9x19mm")).toBe(true);
  });

  it("keeps creator-historical relationship provenance distinct from live-client evidence", () => {
    const result = getAmmoMatches({weapon: "mp5"});

    expect(result.ammoMatches[0]).toMatchObject({
      relationshipValue: "9x19mm",
      sourceClass: "creator-historical",
      confidence: "corroborated",
    });
  });

  it("keeps non-indexable records unlinked and returns an honest empty match", () => {
    const m4 = getAmmoMatches({ammo: "5-56x45mm"}).weaponMatches.find(({slug}) => slug === "m4");
    const noMatch = getAmmoMatches({ammo: "338-norma-magnum"});

    expect(m4).toBeDefined();
    expect(m4?.href).toBeUndefined();
    expect(noMatch.selectedAmmo?.slug).toBe("338-norma-magnum");
    expect(noMatch.weaponMatches).toEqual([]);
  });

  it("does not accept unknown catalogue identifiers", () => {
    const result = getAmmoMatches({weapon: "made-up", ammo: "made-up"});

    expect(result.selectedWeapon).toBeNull();
    expect(result.selectedAmmo).toBeNull();
    expect(result.ammoMatches).toEqual([]);
    expect(result.weaponMatches).toEqual([]);
  });
});
