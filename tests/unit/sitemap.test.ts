import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";
import {getItemByTypeAndSlug} from "../../src/features/items/item-library";

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

const newModelContracts = [
  ...weaponModelSlugs.map((slug) => ({type: "weapons" as const, slug})),
  ...vehicleModelSlugs.map((slug) => ({type: "vehicles" as const, slug}))
];
const newModelUrls = newModelContracts.map(({type, slug}) => `http://localhost:3000/en/items/${type}/${slug}`);
const legacyWeaponAndVehicleSlugs = new Set(["mortar", "littlebird", "tank", "attack-helicopter", "armored-transport"]);

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

  it("contains the exact 34 English model URLs once and no localized copies", () => {
    const modelEntries = sitemap().filter((entry) => {
      const match = new URL(entry.url).pathname.match(/^\/(?:en|ru|de|pt-br)\/items\/(weapons|vehicles)\/([^/]+)\/?$/);
      return match && !legacyWeaponAndVehicleSlugs.has(match[2]);
    });

    expect(modelEntries.map((entry) => entry.url)).toEqual(newModelUrls);
    expect(new Set(modelEntries.map((entry) => entry.url)).size).toBe(34);
  });

  it("gives every new model only English and x-default sitemap alternates", () => {
    const modelEntries = sitemap().filter((entry) => newModelUrls.includes(entry.url));

    expect(modelEntries).toHaveLength(34);
    for (const entry of modelEntries) {
      expect(entry.alternates?.languages, entry.url).toEqual({en: entry.url, "x-default": entry.url});
    }
  });

  it("uses each new model article's actual detailUpdatedAt and weekly frequency", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const contract of newModelContracts) {
      const item = getItemByTypeAndSlug(contract.type, contract.slug);
      const url = `http://localhost:3000/en/items/${contract.type}/${contract.slug}`;
      expect(item?.detailUpdatedAt, `${contract.type}/${contract.slug} article date`).toBeDefined();
      expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url).toBe(new Date(`${item!.detailUpdatedAt}T00:00:00.000Z`).toISOString());
      expect(entriesByUrl.get(url)?.changeFrequency, url).toBe("weekly");
    }
  });

  it("contains no fragments, queries, or filter routes", () => {
    const urls = sitemap().map((entry) => entry.url);

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
