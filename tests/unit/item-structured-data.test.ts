import {describe, expect, it} from "vitest";
import {getItemBySlug} from "../../src/features/items/item-library";
import {buildItemArticleJsonLd, buildItemIndexJsonLd, buildItemTypeJsonLd} from "../../src/lib/item-structured-data";

describe("item structured data", () => {
  it("uses article schema for item detail pages", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const jsonLd = buildItemArticleJsonLd("en", mortar!);

    expect(jsonLd[0]["@type"]).toBe("Article");
    expect(jsonLd[0]).not.toHaveProperty("offers");
    expect(jsonLd[1]["@type"]).toBe("BreadcrumbList");
    expect((jsonLd[1].itemListElement as Array<{name: string}>)[1].name).toBe("Catalogue");
  });

  it("uses collection schema for item hubs", () => {
    const jsonLd = buildItemIndexJsonLd("en");

    expect(jsonLd.map((entry) => entry["@type"])).toEqual(["CollectionPage", "ItemList", "BreadcrumbList"]);
    expect(jsonLd[0]["@type"]).toBe("CollectionPage");
    expect(jsonLd[0].name).toBe("WARDOGS Catalogue");
    expect(jsonLd[1]["@type"]).toBe("ItemList");
    expect(jsonLd[1].itemListElement).toHaveLength(7);
    expect(jsonLd[2].itemListElement).toEqual([
      {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: "http://localhost:3000/en"},
      {"@type": "ListItem", position: 2, name: "Catalogue", item: "http://localhost:3000/en/items"}
    ]);
  });

  it("includes catalogue rows in type-page ItemList schema", () => {
    const weapons = buildItemTypeJsonLd("en", "weapons");
    const ammo = buildItemTypeJsonLd("en", "ammo");

    expect(weapons[1].itemListElement).toHaveLength(33);
    expect(ammo[1].itemListElement).toHaveLength(14);
    expect((weapons[2].itemListElement as Array<{name: string}>)[1].name).toBe("Catalogue");
  });
});
