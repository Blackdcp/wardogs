import {existsSync} from "node:fs";
import path from "node:path";
import {describe, expect, it, vi} from "vitest";
import sitemap from "../../src/app/sitemap";

vi.mock("@/i18n/navigation", () => ({Link: () => null}));
vi.mock("next/navigation", () => ({notFound: () => { throw new Error("NEXT_NOT_FOUND"); }}));

const helperPath = path.join(process.cwd(), "src", "features", "tools", "share-state.ts");

describe("shareable player tools", () => {
  it("publishes both tool entry pages in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn"]) {
      expect(urls.has(`http://localhost:3000/${locale}/tools/system-check`)).toBe(true);
      expect(urls.has(`http://localhost:3000/${locale}/tools/loadout-budget`)).toBe(true);
      expect(urls.has(`http://localhost:3000/${locale}/tools/weapon-compare`)).toBe(true);
      expect(urls.has(`http://localhost:3000/${locale}/tools/ammo-matcher`)).toBe(true);
    }
  });

  it("round-trips a system-check result through a compact URL state", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {decodeSystemCheckState, encodeSystemCheckState, evaluateSystemCheck} = await import("../../src/features/tools/share-state");
    const state = {os: "windows-11", ramGb: 32, storageGb: 84, cpuTier: "recommended", gpuTier: "minimum"} as const;

    const encoded = encodeSystemCheckState(state);
    expect(decodeSystemCheckState(encoded)).toEqual(state);
    expect(evaluateSystemCheck(state)).toEqual({level: "minimum", limiting: ["gpuTier"]});
  });

  it("rejects malformed shared state instead of inventing values", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {decodeSystemCheckState, decodeBudgetState} = await import("../../src/features/tools/share-state");
    expect(decodeSystemCheckState("os=linux&ram=lots")).toBeNull();
    expect(decodeBudgetState("cash=-1&loadout=oops")).toBeNull();
  });

  it("round-trips and calculates a loadout budget without using unverified item prices", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {calculateBudget, decodeBudgetState, encodeBudgetState} = await import("../../src/features/tools/share-state");
    const state = {cash: 10_000, loadout: 3_200, vehicle: 1_500, reserve: 2_000};

    expect(decodeBudgetState(encodeBudgetState(state))).toEqual(state);
    expect(calculateBudget(state)).toEqual({spent: 4_700, remaining: 5_300, reserveMet: true});
  });

  it("round-trips distinct weapon selections and repairs missing, unknown, or duplicate values", async () => {
    const {decodeWeaponCompareState, encodeWeaponCompareState} = await import("../../src/features/tools/share-state");
    const allowed = ["amp-9", "deagle", "fal"];

    const selected = {left: "deagle", right: "fal"};
    expect(decodeWeaponCompareState(encodeWeaponCompareState(selected), allowed)).toEqual(selected);
    expect(decodeWeaponCompareState("", allowed)).toEqual({left: "amp-9", right: "deagle"});
    expect(decodeWeaponCompareState("left=unknown&right=fal", allowed)).toEqual({left: "amp-9", right: "fal"});
    expect(decodeWeaponCompareState("left=deagle&right=deagle", allowed)).toEqual({left: "deagle", right: "amp-9"});
    expect(decodeWeaponCompareState("left=deagle&left=fal&right=amp-9", allowed)).toEqual({left: "amp-9", right: "deagle"});
  });

  it("round-trips matcher state while rejecting repeated and unknown parameters", async () => {
    const {decodeAmmoMatcherState, encodeAmmoMatcherState} = await import("../../src/features/tools/share-state");
    const weapons = ["amp-9", "deagle"];
    const ammo = ["9x19mm", "50-ae"];
    const state = {weapon: "amp-9", ammo: "9x19mm"};

    expect(decodeAmmoMatcherState(encodeAmmoMatcherState(state), weapons, ammo)).toEqual(state);
    expect(decodeAmmoMatcherState("weapon=unknown&ammo=50-ae", weapons, ammo)).toEqual({weapon: null, ammo: "50-ae"});
    expect(decodeAmmoMatcherState("weapon=amp-9&ammo=9x19mm&ammo=50-ae", weapons, ammo)).toEqual({weapon: "amp-9", ammo: null});
    expect(decodeAmmoMatcherState("", weapons, ammo)).toEqual({weapon: null, ammo: null});
  });

  it("preserves repeated server search parameters so validation can reject them", async () => {
    const {serializeToolSearchParams} = await import("../../src/features/tools/share-state");

    expect(serializeToolSearchParams({left: ["deagle", "fal"], right: "amp-9", empty: undefined}))
      .toBe("left=deagle&left=fal&right=amp-9");
  });

  it("adds both evidence tools to explicit shared navigation", async () => {
    const {buildNavigation} = await import("../../src/features/navigation/navigation-data");
    const items = buildNavigation((key) => key).flatMap((group) => group.items);

    expect(items).toContainEqual(expect.objectContaining({href: "/tools/weapon-compare", searchType: "tool"}));
    expect(items).toContainEqual(expect.objectContaining({href: "/tools/ammo-matcher", searchType: "tool"}));
  });

  it("provides readable source-class and confidence labels in all six locales", async () => {
    const {getToolCopy} = await import("../../src/features/tools/tool-copy");

    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const) {
      const copy = getToolCopy(locale);
      expect([
        copy.sourceClass,
        copy.confidence,
        copy.sourceOfficial,
        copy.sourceLiveClient,
        copy.sourceCreatorCurrent,
        copy.sourceCreatorHistorical,
        copy.sourceCommunityReport,
        copy.confidenceConfirmed,
        copy.confidenceObserved,
        copy.confidenceCorroborated,
        copy.confidenceUnverified,
      ].every((label) => label.trim().length > 0), locale).toBe(true);
    }
  });

  it("builds localized metadata for both evidence tools in all six locales", async () => {
    const weaponPage = await import("../../src/app/[locale]/tools/weapon-compare/page");
    const ammoPage = await import("../../src/app/[locale]/tools/ammo-matcher/page");

    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn"]) {
      const weaponMetadata = await weaponPage.generateMetadata({params: Promise.resolve({locale})});
      const ammoMetadata = await ammoPage.generateMetadata({params: Promise.resolve({locale})});

      expect(weaponMetadata.title).toBeTruthy();
      expect(weaponMetadata.description).toBeTruthy();
      expect(weaponMetadata.alternates?.canonical).toBe(`http://localhost:3000/${locale}/tools/weapon-compare`);
      expect(ammoMetadata.title).toBeTruthy();
      expect(ammoMetadata.description).toBeTruthy();
      expect(ammoMetadata.alternates?.canonical).toBe(`http://localhost:3000/${locale}/tools/ammo-matcher`);
    }
  });
});
