import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import {getCompatibilityDataset} from "@/features/tools/equipment-compatibility";
import {getCompatibilityCopy} from "@/features/tools/equipment-compatibility-copy";
import {decodeCompatibilitySelection, defaultCompatibilitySelection, filterCompatibilityEntries, writeCompatibilitySelection} from "@/features/tools/equipment-compatibility-runtime";
import {getCreatorAttachmentRecords} from "@/features/tools/attachment-recipes";

describe("equipment compatibility evidence boundary", () => {
  const dataset = getCompatibilityDataset("en");
  it("covers the existing attachment catalogue without fabricated current fit or purchase contents", () => {
    expect(dataset.attachments).toHaveLength(getCatalogueRecords("attachments").length + getCreatorAttachmentRecords("en").length);
    expect(dataset.attachments.every((item) => item.currentFit === "unknown" && item.purchaseUnit === "unknown" && item.suppliedRounds === null && !item.evidence.current)).toBe(true);
  });
  it("uses explicit model names, never equal calibre or generic standard names", () => {
    const entries = filterCompatibilityEntries(dataset.attachments, {...defaultCompatibilitySelection, kind: "magazine", weapon: "mp5", namedOnly: true});
    expect(entries.map(({slug}) => slug)).toEqual(["mp5-20-rnd-magazine", "mp5-30-rnd-magazine", "mp5-50-rnd-magazine"]);
    expect(dataset.attachments.find(({slug}) => slug === "fal-bmr-308-20-rnd-magazine")?.namedWeapons).toEqual(["fal", "bmr-308"]);
    for (const slug of ["stanag-20-rnd-magazine", "ggx-50-rnd-drum-magazine", "pp-19-50-rnd-magazine"]) expect(dataset.attachments.find((item) => item.slug === slug)?.namedWeapons).toEqual([]);
    expect(dataset.attachments.filter(({kind}) => kind === "optic").every(({namedWeapons}) => namedWeapons.length === 0)).toBe(true);
  });
  it("keeps source checkpoints unchanged and localizes every supported locale", () => {
    for (const locale of locales) {
      const localized = getCompatibilityDataset(locale);
      expect(localized.attachments.filter(({origin}) => origin !== "creator").map(({evidence}) => evidence)).toEqual(dataset.attachments.filter(({origin}) => origin !== "creator").map(({evidence}) => evidence));
      expect(localized.attachments.map(({evidence}) => [evidence.sourceUrl, evidence.verifiedAt, evidence.current])).toEqual(dataset.attachments.map(({evidence}) => [evidence.sourceUrl, evidence.verifiedAt, evidence.current]));
      expect(getCompatibilityCopy(locale).checks).toHaveLength(4);
      if (locale !== "en") expect(getCompatibilityCopy(locale).title).not.toBe(getCompatibilityCopy("en").title);
    }
  });
  it("preserves unrelated share fields and sanitizes unknown selections", () => {
    const selection = {weapon: "mp5", kind: "magazine" as const, query: "30", namedOnly: true};
    const url = writeCompatibilitySelection(new URL("https://www.wardogswiki.com/en/tools/ammo-matcher?weapon=mp5&ammo=9x19mm"), selection);
    expect(url.searchParams.get("ammo")).toBe("9x19mm");
    expect(decodeCompatibilitySelection(url.search, dataset.weapons.map(({slug}) => slug))).toEqual({invalid: false, selection});
    const invalid = decodeCompatibilitySelection("?fitWeapon=bogus&fitNamed=1&fitKind=bogus", dataset.weapons.map(({slug}) => slug));
    expect(invalid.invalid).toBe(true);
    expect(invalid.selection).toEqual(defaultCompatibilitySelection);
  });
  it.each(["grip", "muzzle"] as const)("shares and filters creator %s observations without asserting current fit", (kind) => {
    const selection = {...defaultCompatibilitySelection, kind, weapon: "ak74", namedOnly: true};
    const entries = filterCompatibilityEntries(dataset.attachments, selection);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => entry.origin === "creator" && entry.kind === kind && entry.currentFit === "unknown")).toBe(true);
    const url = writeCompatibilitySelection(new URL("https://www.wardogswiki.com/en/tools/ammo-matcher?ammo=5-45x39mm"), selection);
    expect(decodeCompatibilitySelection(url.search, dataset.weapons.map(({slug}) => slug))).toEqual({invalid: false, selection});
    expect(url.searchParams.get("ammo")).toBe("5-45x39mm");
  });
});
