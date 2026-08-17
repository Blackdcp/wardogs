import {describe, expect, it} from "vitest";
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

  it("publishes all 14 manually authored English weapon model guides", () => {
    const weaponModels = itemLibrary.filter((item) => item.type === "weapons" && item.slug !== "mortar");

    expect(weaponModels.map((item) => item.slug)).toEqual(weaponSlugs);
    expect(weaponModels).toHaveLength(14);
    expect(weaponModels.every((item) => item.indexLocales.length === 1 && item.indexLocales[0] === "en")).toBe(true);
    expect(weaponModels.every((item) => item.facts.length >= 4)).toBe(true);
    expect(weaponModels.every((item) => item.strengths.length >= 3 && item.cautions.length >= 3)).toBe(true);
    expect(weaponModels.every((item) => item.confirmedFacts && item.confirmedFacts.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.confirmedFacts?.every((fact) => fact.startsWith("Observed in Alpha 1:")))).toBe(true);
    expect(weaponModels.every((item) => item.unconfirmedFacts && item.unconfirmedFacts.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.unconfirmedFacts?.every((fact) => /Early Access|final release/.test(fact)))).toBe(true);
    expect(weaponModels.every((item) => item.sources.length > 0 && item.relatedGuides.length > 0 && item.relatedItems.length > 0)).toBe(true);
    expect(weaponModels.every((item) => item.detailImage && item.detailImageAlt && item.detailUpdatedAt)).toBe(true);
    expect(new Set(weaponModels.map((item) => item.summary)).size).toBe(14);
    expect(new Set(weaponModels.map((item) => item.description)).size).toBe(14);

    for (const record of getCatalogueRecords("weapons")) {
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
      detailUpdatedAt: "2026-08-07"
    });
    expect(amp9?.confirmedFacts).toContain("Observed in Alpha 1: Ammunition: 9x19mm");
    expect(amp9?.unconfirmedFacts).not.toEqual([]);
    expect(amp9?.indexLocales).toEqual(["en"]);
  });

  it("keeps article fields off indexable route paths", () => {
    const path: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar"};
    expect(path).toEqual({locale: "en", type: "weapons", slug: "mortar"});

    // @ts-expect-error Article images do not belong to indexable paths.
    const invalidPath: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar", detailImage: "/images/catalogue/weapons/amp-9.webp"};
    expect(invalidPath).toBeDefined();
  });

  it("includes published related models only in their indexed locales", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const itemWithRelatedModels = {...mortar!, relatedItems: ["mobile-fob", "amp-9"]};

    expect(getRelatedItems(itemWithRelatedModels, "en").map((item) => item.slug)).toEqual(["mobile-fob", "amp-9"]);
    expect(getRelatedItems(itemWithRelatedModels, "ru").map((item) => item.slug)).toEqual(["mobile-fob"]);
  });

  it("indexes English and Russian item details first", () => {
    const paths = getIndexableItemPaths();

    expect(paths).toContainEqual({locale: "en", type: "weapons", slug: "mortar"});
    expect(paths).toContainEqual({locale: "ru", type: "vehicles", slug: "littlebird"});
    expect(paths).not.toContainEqual({locale: "de", type: "weapons", slug: "mortar"});
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
});
