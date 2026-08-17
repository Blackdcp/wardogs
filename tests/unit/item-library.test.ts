import {describe, expect, it} from "vitest";
import {
  getIndexableItemPaths,
  getItemBySlug,
  getItemsByType,
  itemLibrary,
  itemTypes
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
      detailUpdatedAt: "2026-08-07"
    });
    expect(amp9?.confirmedFacts).toContain("Ammunition: 9x19mm");
    expect(amp9?.unconfirmedFacts).toEqual([]);
    expect(amp9?.indexLocales).toEqual([]);
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
