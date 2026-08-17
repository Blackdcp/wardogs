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

  it("uses English canonical URLs throughout non-English hub schema", () => {
    const jsonLd = buildItemIndexJsonLd("de");

    expect(jsonLd[0].url).toBe("http://localhost:3000/en/items");
    expect(jsonLd[1].itemListElement).toEqual([
      {"@type": "ListItem", position: 1, name: "WARDOGS Weapons", url: "http://localhost:3000/en/items/weapons"},
      {"@type": "ListItem", position: 2, name: "WARDOGS Vehicles", url: "http://localhost:3000/en/items/vehicles"},
      {"@type": "ListItem", position: 3, name: "WARDOGS Ammo", url: "http://localhost:3000/en/items/ammo"},
      {"@type": "ListItem", position: 4, name: "WARDOGS Attachments", url: "http://localhost:3000/en/items/attachments"},
      {"@type": "ListItem", position: 5, name: "WARDOGS Gear", url: "http://localhost:3000/en/items/gear"},
      {"@type": "ListItem", position: 6, name: "WARDOGS Equipment", url: "http://localhost:3000/en/items/equipment"},
      {"@type": "ListItem", position: 7, name: "WARDOGS Loadouts", url: "http://localhost:3000/en/items/loadouts"}
    ]);
    expect(jsonLd[2].itemListElement).toEqual([
      {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: "http://localhost:3000/en"},
      {"@type": "ListItem", position: 2, name: "Catalogue", item: "http://localhost:3000/en/items"}
    ]);
    expect(JSON.stringify(jsonLd)).not.toContain("http://localhost:3000/de");
  });

  it("includes catalogue rows in type-page ItemList schema", () => {
    const weapons = buildItemTypeJsonLd("en", "weapons");
    const ammo = buildItemTypeJsonLd("en", "ammo");

    expect(weapons[1].itemListElement).toHaveLength(33);
    expect(ammo[1].itemListElement).toHaveLength(14);
    expect((weapons[2].itemListElement as Array<{name: string}>)[1].name).toBe("Catalogue");
  });
});
