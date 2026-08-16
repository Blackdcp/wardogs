import {describe, expect, it} from "vitest";
import {getItemBySlug} from "../../src/features/items/item-library";
import {buildItemMetadata} from "../../src/lib/item-metadata";

describe("item metadata", () => {
  it("limits item detail alternates to indexable locales", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const metadata = buildItemMetadata("en", mortar!);

    expect(metadata.alternates?.languages).toEqual({
      en: "http://localhost:3000/en/items/weapons/mortar",
      ru: "http://localhost:3000/ru/items/weapons/mortar",
      "x-default": "http://localhost:3000/en/items/weapons/mortar"
    });
  });
});
