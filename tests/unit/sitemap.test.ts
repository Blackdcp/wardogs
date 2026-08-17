import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";

const weaponModelSlugs = [
  "a-91", "ak74", "amp-9", "amr-50", "bmr-308", "bushmaster-m17s", "compound-bow",
  "deagle", "fal", "galil", "ggx-17", "ggx-18", "judge", "kh-2002"
] as const;

const vehicleModelSlugs = [
  "ah-6m-miniguns", "ah-6r-rockets", "bobcat", "dune-buggy", "flakpanzer-gepard",
  "havoc", "humvee-m249", "humvee-minigun", "humvee", "kodiak-m249",
  "kodiak-pickup", "kodiak", "l2a6", "mh-6", "sph-2", "uh-1y-miniguns",
  "uh-1y", "ural-defender-m249", "ural-defender", "ural"
] as const;

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

  it("indexes published English weapon and vehicle models only in English", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.filter((url) => url.includes("/items/weapons/"))).toEqual([
      "http://localhost:3000/en/items/weapons/mortar",
      ...weaponModelSlugs.map((slug) => `http://localhost:3000/en/items/weapons/${slug}`),
      "http://localhost:3000/ru/items/weapons/mortar"
    ]);
    expect(urls).not.toContain("http://localhost:3000/ru/items/weapons/ak74");
    for (const slug of vehicleModelSlugs) {
      expect(urls).toContain(`http://localhost:3000/en/items/vehicles/${slug}`);
      expect(urls).not.toContain(`http://localhost:3000/ru/items/vehicles/${slug}`);
    }
  });

  it("includes every published vehicle detail URL without fragments or filter URLs", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const slug of vehicleModelSlugs) expect(urls.some((url) => new RegExp(`/en/items/vehicles/${slug}/?$`).test(url))).toBe(true);
    expect(urls.some((url) => url.includes("#") || url.includes("?") || /\/(?:items\/)?(?:weapons|vehicles)\/(?:filter|search)\//.test(url))).toBe(false);
  });

  it("uses the same trailing-slash URL form in the production sitemap", () => {
    const previous = process.env.GITHUB_PAGES;
    process.env.GITHUB_PAGES = "true";
    try {
      expect(sitemap().map((entry) => entry.url)).toContain("http://localhost:3000/en/items/weapons/");
    } finally {
      if (previous === undefined) delete process.env.GITHUB_PAGES;
      else process.env.GITHUB_PAGES = previous;
    }
  });
});
