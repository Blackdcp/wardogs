import {describe, expect, it} from "vitest";
import sitemap, {resolveItemLastModified} from "../../src/app/sitemap";

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
const cataloguePageUrls = [
  "http://localhost:3000/en/items",
  "http://localhost:3000/en/items/weapons",
  "http://localhost:3000/en/items/vehicles",
  "http://localhost:3000/en/items/ammo",
  "http://localhost:3000/en/items/attachments",
  "http://localhost:3000/en/items/gear",
  "http://localhost:3000/en/items/equipment",
  "http://localhost:3000/en/items/loadouts"
] as const;
const legacyContracts = [
  {type: "weapons", slug: "mortar"},
  {type: "equipment", slug: "mobile-fob"},
  {type: "vehicles", slug: "littlebird"},
  {type: "vehicles", slug: "tank"},
  {type: "vehicles", slug: "attack-helicopter"},
  {type: "vehicles", slug: "armored-transport"}
] as const;
const legacyUrls = [
  "http://localhost:3000/en/items/weapons/mortar",
  "http://localhost:3000/en/items/equipment/mobile-fob",
  "http://localhost:3000/en/items/vehicles/littlebird",
  "http://localhost:3000/en/items/vehicles/tank",
  "http://localhost:3000/en/items/vehicles/attack-helicopter",
  "http://localhost:3000/en/items/vehicles/armored-transport",
  "http://localhost:3000/ru/items/weapons/mortar",
  "http://localhost:3000/ru/items/equipment/mobile-fob",
  "http://localhost:3000/ru/items/vehicles/littlebird",
  "http://localhost:3000/ru/items/vehicles/tank",
  "http://localhost:3000/ru/items/vehicles/attack-helicopter",
  "http://localhost:3000/ru/items/vehicles/armored-transport"
] as const;

type SitemapEntry = ReturnType<typeof sitemap>[number];
const cataloguePageUrlSet = new Set<string>(cataloguePageUrls);
const newModelUrlSet = new Set<string>(newModelUrls);

function collectLegacyItemEntries(entries: SitemapEntry[]) {
  const itemDetailEntries = entries.filter((entry) => {
    const pathname = new URL(entry.url).pathname;
    return /^\/[^/]+\/items(?:\/|$)/.test(pathname) && !cataloguePageUrlSet.has(entry.url);
  });

  return itemDetailEntries.filter((entry) => !newModelUrlSet.has(entry.url));
}

function expectExactLegacyItemInventory(entries: SitemapEntry[]) {
  expect(collectLegacyItemEntries(entries).map((entry) => entry.url)).toEqual(legacyUrls);
}

describe("sitemap", () => {
  it("publishes all localized beta-weekend guides with their current editorial date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of ["en", "de", "ru", "pt-br"]) {
      for (const slug of ["wardogs-twitch-drops", "wardogs-beginner-guide", "wardogs-fob-guide"]) {
        const url = `http://localhost:3000/${locale}/guides/${slug}`;
        const entry = entriesByUrl.get(url);
        expect(entry, url).toBeDefined();
        expect(new Date(entry!.lastModified!).toISOString(), url).toBe("2026-08-22T00:00:00.000Z");
        expect(entry?.alternates?.languages, url).toEqual({
          en: `http://localhost:3000/en/guides/${slug}`,
          ru: `http://localhost:3000/ru/guides/${slug}`,
          de: `http://localhost:3000/de/guides/${slug}`,
          "pt-BR": `http://localhost:3000/pt-br/guides/${slug}`,
          "x-default": `http://localhost:3000/en/guides/${slug}`,
        });
      }
    }
  });

  it("includes standalone video article URLs for indexing", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/en/videos");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-10-reasons-not-to-buy");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-loadout-gear-guide");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-mortars-indirect-fire");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-first-look-gameplay");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-everything-before-playing");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-best-settings");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-helicopter-flight-guide");
  });

  it("publishes the five new player-demand guide clusters in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));
    const slugs = [
      "wardogs-crash-fix",
      "wardogs-towers-guide",
      "wardogs-money-guide",
      "wardogs-helicopter-guide",
      "wardogs-mortar-guide"
    ];

    for (const locale of ["en", "de", "ru", "pt-br"]) {
      for (const slug of slugs) {
        expect(urls.has(`http://localhost:3000/${locale}/guides/${slug}`), `${locale}/${slug}`).toBe(true);
      }
    }
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

  it("uses the editorial publication date, not the Alpha observation date, for all 34 URLs", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const contract of newModelContracts) {
      const url = `http://localhost:3000/en/items/${contract.type}/${contract.slug}`;
      expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url).toBe("2026-08-18T00:00:00.000Z");
      expect(entriesByUrl.get(url)?.changeFrequency, url).toBe("weekly");
    }
  });

  it("resolves distinct supplied detail dates instead of a shared model constant", () => {
    expect(resolveItemLastModified({detailUpdatedAt: "2026-01-02"}).toISOString()).toBe("2026-01-02T00:00:00.000Z");
    expect(resolveItemLastModified({detailUpdatedAt: "2026-05-19"}).toISOString()).toBe("2026-05-19T00:00:00.000Z");
    expect(resolveItemLastModified(undefined).toISOString()).toBe("2026-08-16T00:00:00.000Z");
  });

  it("contains the exact six legacy English and Russian pairs with matching alternates", () => {
    const entries = collectLegacyItemEntries(sitemap());

    expectExactLegacyItemInventory(sitemap());
    expect(entries).toHaveLength(12);
    for (const {type, slug} of legacyContracts) {
      const en = `http://localhost:3000/en/items/${type}/${slug}`;
      const ru = `http://localhost:3000/ru/items/${type}/${slug}`;
      for (const url of [en, ru]) {
        expect(entries.find((entry) => entry.url === url)?.alternates?.languages, url).toEqual({
          en,
          ru,
          "x-default": en
        });
      }
    }
  });

  it("makes an unexpected seventh legacy detail fail the exact inventory contract", () => {
    const entries = sitemap();
    const unexpectedLegacyEntry = {
      ...entries[0],
      url: "http://localhost:3000/en/items/equipment/unexpected-legacy-item"
    };

    expect(() => expectExactLegacyItemInventory([...entries, unexpectedLegacyEntry])).toThrow();
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

  it("uses a host-only site URL plus the configured Pages base exactly once", () => {
    const previous = {
      basePath: process.env.NEXT_PUBLIC_BASE_PATH,
      githubPages: process.env.GITHUB_PAGES,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    };
    process.env.NEXT_PUBLIC_BASE_PATH = "/wardogs";
    process.env.GITHUB_PAGES = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://blackdcp.github.io";
    try {
      const bobcat = sitemap().find((entry) => entry.url.includes("/items/vehicles/bobcat"));
      expect(bobcat?.url).toBe("https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/");
      expect(bobcat?.alternates?.languages).toEqual({
        en: "https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/",
        "x-default": "https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/"
      });
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        const envKey = key === "basePath" ? "NEXT_PUBLIC_BASE_PATH" : key === "githubPages" ? "GITHUB_PAGES" : "NEXT_PUBLIC_SITE_URL";
        if (value === undefined) delete process.env[envKey];
        else process.env[envKey] = value;
      }
    }
  });
});
