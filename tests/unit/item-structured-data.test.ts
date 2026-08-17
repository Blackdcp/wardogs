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
      {"@type": "ListItem", position: 1, name: "WARDOGS Weapons", url: "http://localhost:3000/en/items/weapons", image: "http://localhost:3000/images/catalogue/banners/weapons-1280.webp"},
      {"@type": "ListItem", position: 2, name: "WARDOGS Vehicles", url: "http://localhost:3000/en/items/vehicles", image: "http://localhost:3000/images/catalogue/banners/vehicles-1280.webp"},
      {"@type": "ListItem", position: 3, name: "WARDOGS Ammo", url: "http://localhost:3000/en/items/ammo", image: "http://localhost:3000/images/catalogue/ammo/556x45mm.webp"},
      {"@type": "ListItem", position: 4, name: "WARDOGS Attachments", url: "http://localhost:3000/en/items/attachments", image: "http://localhost:3000/images/catalogue/banners/attachments-1280.webp"},
      {"@type": "ListItem", position: 5, name: "WARDOGS Gear", url: "http://localhost:3000/en/items/gear", image: "http://localhost:3000/images/catalogue/gear/heavy-armor.webp"},
      {"@type": "ListItem", position: 6, name: "WARDOGS Equipment", url: "http://localhost:3000/en/items/equipment", image: "http://localhost:3000/images/catalogue/banners/meta-1280.webp"},
      {"@type": "ListItem", position: 7, name: "WARDOGS Loadouts", url: "http://localhost:3000/en/items/loadouts", image: "http://localhost:3000/images/catalogue/banners/loadouts-1280.webp"}
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

    expect(weapons[1].itemListElement).toHaveLength(15);
    expect(ammo[1].itemListElement).toHaveLength(14);
    expect((weapons[2].itemListElement as Array<{name: string}>)[1].name).toBe("Catalogue");
  });

  it("uses record anchors and images for planned weapon models while retaining only legacy article URLs", () => {
    const weapons = buildItemTypeJsonLd("en", "weapons");
    const entries = weapons[1].itemListElement as Array<{name: string; url: string; image?: string}>;

    expect(entries[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "A-91",
      url: "http://localhost:3000/en/items/weapons#record-weapons-a-91",
      image: "http://localhost:3000/images/catalogue/weapons/a-91.webp"
    });
    expect(entries[1]).toMatchObject({
      name: "AK74",
      url: "http://localhost:3000/en/items/weapons#record-weapons-ak74",
      image: "http://localhost:3000/images/catalogue/weapons/ak74.webp"
    });
    expect(entries[14]).toEqual({
      "@type": "ListItem",
      position: 15,
      name: "Mortar",
      url: "http://localhost:3000/en/items/weapons/mortar"
    });
    expect(entries.slice(0, 14).every((entry) => entry.image?.startsWith("http://localhost:3000/images/catalogue/weapons/"))).toBe(true);
    expect(entries.filter((entry) => entry.url.includes("/items/weapons/")).map((entry) => entry.url)).toEqual([
      "http://localhost:3000/en/items/weapons/mortar"
    ]);
  });

  it("uses the English canonical category URL and catalogue imagery in category schema", () => {
    const weapons = buildItemTypeJsonLd("de", "weapons");

    expect(weapons[0]).toMatchObject({
      "@type": "CollectionPage",
      url: "http://localhost:3000/en/items/weapons",
      image: "http://localhost:3000/images/catalogue/banners/weapons-1280.webp"
    });
    expect(JSON.stringify(weapons)).not.toContain("http://localhost:3000/de");
    expect(JSON.stringify(weapons)).not.toMatch(/Product|Offer|AggregateRating|Rating/);
  });
});
