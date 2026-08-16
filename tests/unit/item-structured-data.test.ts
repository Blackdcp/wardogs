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
  });

  it("uses collection schema for item hubs", () => {
    const jsonLd = buildItemIndexJsonLd("en");

    expect(jsonLd[0]["@type"]).toBe("CollectionPage");
    expect(jsonLd[1]["@type"]).toBe("ItemList");
  });

  it("includes catalogue rows in type-page ItemList schema", () => {
    const weapons = buildItemTypeJsonLd("en", "weapons");
    const ammo = buildItemTypeJsonLd("en", "ammo");

    expect(weapons[1].itemListElement).toHaveLength(33);
    expect(ammo[1].itemListElement).toHaveLength(14);
  });
});
