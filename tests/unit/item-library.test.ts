import {describe, expect, it} from "vitest";
import {
  getIndexableItemPaths,
  getItemBySlug,
  getItemsByType,
  itemLibrary
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

  it("indexes English and Russian item details first", () => {
    const paths = getIndexableItemPaths();

    expect(paths).toContainEqual({locale: "en", type: "weapons", slug: "mortar"});
    expect(paths).toContainEqual({locale: "ru", type: "vehicles", slug: "littlebird"});
    expect(paths).not.toContainEqual({locale: "de", type: "weapons", slug: "mortar"});
  });
});
