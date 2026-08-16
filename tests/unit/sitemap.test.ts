import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";

describe("sitemap", () => {
  it("includes standalone video article URLs for indexing", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/en/videos");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-10-reasons-not-to-buy");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-mortars-indirect-fire");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-first-look-gameplay");
  });

  it("includes item hubs, item type pages, and first indexable item details", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/en/items");
    expect(urls).toContain("http://localhost:3000/en/items/weapons");
    expect(urls).toContain("http://localhost:3000/en/items/ammo");
    expect(urls).toContain("http://localhost:3000/en/items/attachments");
    expect(urls).toContain("http://localhost:3000/en/items/gear");
    expect(urls).toContain("http://localhost:3000/en/items/loadouts");
    expect(urls).not.toContain("http://localhost:3000/ru/items/weapons");
    expect(urls).not.toContain("http://localhost:3000/de/items/ammo");
    expect(urls).toContain("http://localhost:3000/en/items/weapons/mortar");
    expect(urls).toContain("http://localhost:3000/ru/items/vehicles/littlebird");
    expect(urls).not.toContain("http://localhost:3000/de/items/weapons/mortar");
  });

  it("does not add non-indexable item detail locales as hreflang alternates", () => {
    const mortar = sitemap().find((entry) => entry.url === "http://localhost:3000/en/items/weapons/mortar");

    expect(mortar?.alternates?.languages).toEqual({
      en: "http://localhost:3000/en/items/weapons/mortar",
      ru: "http://localhost:3000/ru/items/weapons/mortar",
      "x-default": "http://localhost:3000/en/items/weapons/mortar"
    });
  });

  it("does not advertise untranslated catalogue locales as hreflang alternates", () => {
    const weapons = sitemap().find((entry) => entry.url === "http://localhost:3000/en/items/weapons");

    expect(weapons?.alternates?.languages).toEqual({
      en: "http://localhost:3000/en/items/weapons",
      "x-default": "http://localhost:3000/en/items/weapons"
    });
  });
});
