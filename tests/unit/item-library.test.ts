import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {isApprovedSourceUrl} from "../../src/content/source-policy";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {
  getIndexableItemPaths,
  getItemBySlug,
  getItemsByType,
  getRelatedItems,
  getStandaloneItemsByType,
  itemLibrary,
  itemTypes,
  type IndexableItemPath
} from "../../src/features/items/item-library";
import {vehicleItems} from "../../src/features/items/vehicle-items";

const weaponSlugs = [
  "a-91",
  "ak74",
  "amp-9",
  "amr-50",
  "bmr-308",
  "bushmaster-m17s",
  "compound-bow",
  "deagle",
  "fal",
  "galil",
  "ggx-17",
  "ggx-18",
  "judge",
  "kh-2002"
] as const;

const vehicleSlugs = [
  "ah-6m-miniguns",
  "ah-6r-rockets",
  "bobcat",
  "dune-buggy",
  "flakpanzer-gepard",
  "havoc",
  "humvee-m249",
  "humvee-minigun",
  "humvee",
  "kodiak-m249",
  "kodiak-pickup",
  "kodiak",
  "l2a6",
  "mh-6",
  "sph-2",
  "uh-1y-miniguns",
  "uh-1y",
  "ural-defender-m249",
  "ural-defender",
  "ural"
] as const;

const expectedVehicleRelations: Record<(typeof vehicleSlugs)[number], readonly string[]> = {
  "ah-6m-miniguns": ["ah-6r-rockets", "mh-6"],
  "ah-6r-rockets": ["ah-6m-miniguns", "havoc"],
  bobcat: ["dune-buggy", "kodiak"],
  "dune-buggy": ["bobcat", "humvee"],
  "flakpanzer-gepard": ["l2a6", "sph-2", "havoc"],
  havoc: ["ah-6r-rockets", "flakpanzer-gepard"],
  "humvee-m249": ["humvee", "humvee-minigun", "kodiak-m249"],
  "humvee-minigun": ["humvee", "humvee-m249"],
  humvee: ["humvee-m249", "humvee-minigun", "ural-defender"],
  "kodiak-m249": ["kodiak", "kodiak-pickup", "humvee-m249"],
  "kodiak-pickup": ["kodiak", "ural"],
  kodiak: ["kodiak-pickup", "kodiak-m249", "bobcat"],
  l2a6: ["flakpanzer-gepard", "sph-2"],
  "mh-6": ["ah-6m-miniguns", "uh-1y"],
  "sph-2": ["l2a6", "flakpanzer-gepard", "ural-defender"],
  "uh-1y-miniguns": ["uh-1y", "ah-6m-miniguns"],
  "uh-1y": ["uh-1y-miniguns", "mh-6"],
  "ural-defender-m249": ["ural-defender", "ural", "kodiak-m249"],
  "ural-defender": ["ural", "ural-defender-m249", "humvee"],
  ural: ["ural-defender", "ural-defender-m249", "kodiak-pickup"]
};

describe("item library", () => {
  it("keeps item pages independent from the guide keyword matrix", () => {
    expect(itemLibrary.map((item) => item.slug)).toContain("mortar");
    expect(getItemsByType("weapons").every((item) => item.type === "weapons")).toBe(true);
  });

  it("labels pre-release facts without final stat claims", () => {
    const mortar = getItemBySlug("mortar");

    expect(mortar?.status).toBe("pre-release-build");
    expect(mortar?.facts.some((fact) => fact.label === "Final damage")).toBe(false);
    expect(mortar?.facts.every((fact) => fact.evidence.length > 0)).toBe(true);
  });

  it("retains all 14 deep weapon model guides in every supported locale", () => {
    const weaponModels = itemLibrary.filter((item) => item.type === "weapons" && weaponSlugs.includes(item.slug as (typeof weaponSlugs)[number]));

    expect(weaponModels.map((item) => item.slug)).toEqual(weaponSlugs);
    expect(weaponModels).toHaveLength(14);
    expect(weaponModels.every((item) => JSON.stringify(item.indexLocales) === JSON.stringify(["en", "ru", "de", "pt-br", "ja"]))).toBe(true);
    expect(weaponModels.every((item) => item.facts.length >= 4)).toBe(true);
    expect(weaponModels.every((item) => item.strengths.length >= 3 && item.cautions.length >= 3)).toBe(true);
    expect(weaponModels.every((item) => item.confirmedFacts && item.confirmedFacts.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.confirmedFacts?.every((fact) => fact.startsWith("Observed in Alpha 1:")))).toBe(true);
    expect(weaponModels.every((item) => item.unconfirmedFacts && item.unconfirmedFacts.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.unconfirmedFacts?.every((fact) => /Early Access|final release/.test(fact)))).toBe(true);
    expect(weaponModels.every((item) => item.sources.length > 0 && item.relatedGuides.length > 0 && item.relatedItems.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.detailImage && item.detailImageAlt)).toBe(true);
    expect(weaponModels.every((item) => item.detailUpdatedAt === "2026-08-18")).toBe(true);
    expect(weaponModels.every((item) => item.build === "Alpha 1 - 7 Aug 2026")).toBe(true);
    expect(new Set(weaponModels.map((item) => item.summary)).size).toBe(14);
    expect(new Set(weaponModels.map((item) => item.description)).size).toBe(14);

    for (const record of getCatalogueRecords("weapons").filter((candidate) => weaponSlugs.includes(candidate.slug as (typeof weaponSlugs)[number]))) {
      const item = weaponModels.find((candidate) => candidate.slug === record.slug);
      expect(item?.detailImage, record.slug).toBe(record.image);
      expect(item?.detailImageAlt, record.slug).toBe(record.imageAlt);
      expect(item?.facts.map(({label, value}) => ({label, value})), record.slug).toEqual(record.facts);
      expect(item?.observedPrice, record.slug).toBe(record.facts.find((fact) => fact.label === "Alpha price")?.value);
      expect(item?.observedAmmoOrVehicleClass, record.slug).toBe(record.facts.find((fact) => fact.label === "Ammunition")?.value);
      expect(item?.observedProgressionOrGate, record.slug).toBe(record.facts.find((fact) => fact.label === "Progression")?.value);
    }

    const amp9 = getItemBySlug("amp-9");

    expect(amp9).toMatchObject({
      detailImage: "/images/catalogue/weapons/amp-9.webp",
      detailImageAlt: "AMP-9 submachine gun",
      observedPrice: "$900",
      observedAmmoOrVehicleClass: "9x19mm",
      observedProgressionOrGate: "Medic XP",
      detailUpdatedAt: "2026-08-18"
    });
    expect(amp9?.confirmedFacts).toContain("Observed in Alpha 1: Ammunition: 9x19mm");
    expect(amp9?.unconfirmedFacts).not.toEqual([]);
    expect(amp9?.indexLocales).toEqual(["en", "ru", "de", "pt-br", "ja"]);
  });

  it("publishes all 20 vehicle model guides in every supported locale", () => {
    const vehicleModels = itemLibrary.filter((item) => vehicleSlugs.includes(item.slug as (typeof vehicleSlugs)[number]));
    const alphaOnlyVehicleModels = vehicleModels.filter((item) => item.slug !== "sph-2");
    const sph2 = vehicleModels.find((item) => item.slug === "sph-2");
    const guideSlugs = new Set(guideManifest.map((guide) => guide.slug));

    expect(vehicleItems).toHaveLength(20);
    expect(vehicleModels.map((item) => item.slug)).toEqual(vehicleSlugs);
    expect(vehicleModels).toHaveLength(20);
    expect(vehicleModels.every((item) => item.type === "vehicles")).toBe(true);
    expect(vehicleModels.every((item) => JSON.stringify(item.indexLocales) === JSON.stringify(["en", "ru", "de", "pt-br", "ja"]))).toBe(true);
    expect(vehicleModels.every((item) => item.facts.length >= 4)).toBe(true);
    expect(vehicleModels.every((item) => item.strengths.length >= 3 && item.cautions.length >= 3)).toBe(true);
    expect(vehicleModels.every((item) => item.confirmedFacts && item.confirmedFacts.length > 0)).toBe(true);
    expect(vehicleModels.every((item) => item.confirmedFacts?.every((fact) => fact.startsWith("Observed in Alpha 1:") || fact.startsWith("Observed across creator footage:")))).toBe(true);
    expect(vehicleModels.every((item) => item.unconfirmedFacts && item.unconfirmedFacts.length > 0)).toBe(true);
    expect(vehicleModels.every((item) => item.unconfirmedFacts?.every((fact) => /Early Access|final release/.test(fact)))).toBe(true);
    expect(vehicleModels.every((item) => item.sources.length > 0 && item.sources.every((source) => isApprovedSourceUrl(source.url)))).toBe(true);
    expect(vehicleModels.every((item) => item.relatedGuides.length > 0 && item.relatedGuides.every((slug) => guideSlugs.has(slug)))).toBe(true);
    expect(vehicleModels.every((item) => item.detailImage && item.detailImageAlt)).toBe(true);
    expect(alphaOnlyVehicleModels.every((item) => item.detailUpdatedAt === "2026-08-18")).toBe(true);
    expect(alphaOnlyVehicleModels.every((item) => item.build === "Alpha 1 - 7 Aug 2026")).toBe(true);
    expect(sph2).toMatchObject({
      detailUpdatedAt: "2026-08-28",
      build: "Alpha 1 and Closed Beta footage checked 2026-08-28"
    });
    expect(new Set(vehicleModels.map((item) => item.summary)).size).toBe(20);
    expect(new Set(vehicleModels.map((item) => item.description)).size).toBe(20);
    expect(new Set(vehicleModels.map((item) => item.role)).size).toBe(20);
    expect(new Set(vehicleModels.flatMap((item) => item.strengths)).size).toBe(vehicleModels.flatMap((item) => item.strengths).length);
    expect(new Set(vehicleModels.flatMap((item) => item.cautions)).size).toBe(vehicleModels.flatMap((item) => item.cautions).length);

    for (const record of getCatalogueRecords("vehicles").filter((candidate) => vehicleSlugs.includes(candidate.slug as (typeof vehicleSlugs)[number]))) {
      const item = vehicleModels.find((candidate) => candidate.slug === record.slug);
      expect(item, record.slug).toMatchObject({
        name: record.name,
        subtype: record.subtype,
        status: record.evidenceStatus
      });
      expect(item?.build, record.slug).toBe(record.slug === "sph-2" ? "Alpha 1 and Closed Beta footage checked 2026-08-28" : record.dataAsOf);
      expect(item?.detailImage, record.slug).toBe(record.image);
      expect(item?.detailImageAlt, record.slug).toBe(record.imageAlt);
      const observedFacts = item?.facts.map(({label, value}) => ({label, value}));
      if (record.slug === "sph-2") {
        expect(observedFacts, record.slug).toEqual(expect.arrayContaining([...record.facts]));
      } else {
        expect(observedFacts, record.slug).toEqual(record.facts);
      }
      expect(item?.observedPrice, record.slug).toBe(record.facts.find((fact) => fact.label === "Alpha price")?.value);
      expect(item?.observedAmmoOrVehicleClass, record.slug).toBe(record.facts.find((fact) => fact.label === "Role")?.value);
      expect(item?.observedProgressionOrGate, record.slug).toBe(record.facts.find((fact) => fact.label === "Observed gate")?.value);
      expect(item?.relatedItems, record.slug).toEqual(expectedVehicleRelations[record.slug as (typeof vehicleSlugs)[number]]);
      expect(item?.relatedItems.every((slug) => slug !== item.slug && vehicleSlugs.includes(slug as (typeof vehicleSlugs)[number])), record.slug).toBe(true);
    }
  });

  it("generates conservative detail pages for every newly published catalogue record", () => {
    for (const type of ["weapons", "vehicles"] as const) {
      const publishedRecords = getCatalogueRecords(type).filter((record) => record.detailStatus === "published");
      const publishedItems = itemLibrary.filter((item) => item.type === type && publishedRecords.some((record) => record.slug === item.slug));

      expect(publishedItems).toHaveLength(publishedRecords.length);

      for (const record of publishedRecords) {
        const item = publishedItems.find((candidate) => candidate.slug === record.slug);
        expect(item, `${type}/${record.slug}`).toBeDefined();
        expect(item?.build, `${type}/${record.slug}`).toBe(record.slug === "sph-2"
          ? "Alpha 1 and Closed Beta footage checked 2026-08-28"
          : record.dataAsOf);
        expect(item?.indexLocales, `${type}/${record.slug}`).toEqual(["en", "ru", "de", "pt-br", "ja"]);
        expect(item?.relatedGuides, `${type}/${record.slug}`).toContain(
          type === "weapons" ? "wardogs-best-weapons-loadouts" : "wardogs-equipment-tools-guide"
        );

        if (record.mediaState === "pending") {
          expect(item?.detailImage, `${type}/${record.slug}`).toBeUndefined();
        }
      }
    }
  });

  it("keeps article fields off indexable route paths", () => {
    const path: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar"};
    expect(path).toEqual({locale: "en", type: "weapons", slug: "mortar"});

    // @ts-expect-error Article images do not belong to indexable paths.
    const invalidPath: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar", detailImage: "/images/catalogue/weapons/amp-9.webp"};
    expect(invalidPath).toBeDefined();
  });

  it("includes published related models in every indexed locale", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const itemWithRelatedModels = {...mortar!, relatedItems: ["mobile-fob", "amp-9"]};

    expect(getRelatedItems(itemWithRelatedModels, "en").map((item) => item.slug)).toEqual(["mobile-fob", "amp-9"]);
    expect(getRelatedItems(itemWithRelatedModels, "ru").map((item) => item.slug)).toEqual(["mobile-fob", "amp-9"]);
    expect(getRelatedItems(itemWithRelatedModels, "ja").map((item) => item.slug)).toEqual(["mobile-fob", "amp-9"]);
  });

  it("indexes every item detail in all five locales", () => {
    const paths = getIndexableItemPaths();

    expect(paths).toHaveLength(itemLibrary.length * 5);
    expect(paths).toContainEqual({locale: "en", type: "weapons", slug: "mortar"});
    expect(paths).toContainEqual({locale: "ru", type: "vehicles", slug: "littlebird"});
    expect(paths).toContainEqual({locale: "de", type: "weapons", slug: "mortar"});
    expect(paths).toContainEqual({locale: "pt-br", type: "vehicles", slug: "bobcat"});
    expect(paths).toContainEqual({locale: "ja", type: "weapons", slug: "ak74"});
  });

  it("exposes all seven catalogue guide categories", () => {
    expect(itemTypes.map((itemType) => itemType.id)).toEqual([
      "weapons",
      "vehicles",
      "ammo",
      "attachments",
      "gear",
      "equipment",
      "loadouts"
    ]);
  });

  it("keeps published catalogue models out of the standalone weapon list", () => {
    expect(getStandaloneItemsByType("weapons").map((item) => item.slug)).toEqual(["mortar"]);
  });

  it("keeps published vehicle models out of the standalone legacy vehicle list", () => {
    expect(getStandaloneItemsByType("vehicles").map((item) => item.slug)).toEqual([
      "littlebird",
      "tank",
      "attack-helicopter",
      "armored-transport"
    ]);
  });
});
