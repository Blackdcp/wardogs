import {describe, expect, it} from "vitest";
import {
  getIndexableItemPaths,
  getItemBySlug,
  getItemsByType,
  getRelatedItems,
  itemLibrary,
  itemTypes,
  type IndexableItemPath
} from "../../src/features/items/item-library";

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

  it("prepares planned model articles with their committed detail image and observed facts", () => {
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
    expect(amp9?.unconfirmedFacts).toEqual([]);
    expect(amp9?.indexLocales).toEqual([]);
  });

  it("keeps article fields off indexable route paths", () => {
    const path: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar"};
    expect(path).toEqual({locale: "en", type: "weapons", slug: "mortar"});

    // @ts-expect-error Article images do not belong to indexable paths.
    const invalidPath: IndexableItemPath = {locale: "en", type: "weapons", slug: "mortar", detailImage: "/images/catalogue/weapons/amp-9.webp"};
    expect(invalidPath).toBeDefined();
  });

  it("excludes unpublished related models while retaining published locale routes", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const related = getRelatedItems({...mortar!, relatedItems: ["mobile-fob", "amp-9"]}, "en");

    expect(related.map((item) => item.slug)).toEqual(["mobile-fob"]);
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
});
