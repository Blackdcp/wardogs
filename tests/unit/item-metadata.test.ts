import {afterEach, describe, expect, it, vi} from "vitest";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {getItemBySlug} from "../../src/features/items/item-library";
import {buildCatalogGuideMetadata, buildItemHubMetadata, buildItemMetadata} from "../../src/lib/item-metadata";

afterEach(() => {
  vi.unstubAllEnvs();
});

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

  it("uses a model article's exact committed image for social metadata", () => {
    const amp9 = getItemBySlug("amp-9");
    expect(amp9).toBeDefined();

    const metadata = buildItemMetadata("en", amp9!);

    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({url: "http://localhost:3000/images/catalogue/weapons/amp-9.webp", alt: "AMP-9 submachine gun"})
    ]);
    expect(metadata.twitter?.images).toEqual(["http://localhost:3000/images/catalogue/weapons/amp-9.webp"]);
  });

  it("keeps a vehicle model English-only with its exact committed image", () => {
    const bobcat = getItemBySlug("bobcat");
    expect(bobcat).toBeDefined();

    const metadata = buildItemMetadata("en", bobcat!);

    expect(metadata.alternates?.languages).toEqual({
      en: "http://localhost:3000/en/items/vehicles/bobcat",
      "x-default": "http://localhost:3000/en/items/vehicles/bobcat"
    });
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({url: "http://localhost:3000/images/catalogue/vehicles/bobcat.webp", alt: "Bobcat light transport"})
    ]);
  });

  it("canonicalizes model metadata to its only published locale", () => {
    const bobcat = getItemBySlug("bobcat");
    expect(bobcat).toBeDefined();

    const metadata = buildItemMetadata("ru", bobcat!);

    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/en/items/vehicles/bobcat",
      languages: {
        en: "http://localhost:3000/en/items/vehicles/bobcat",
        "x-default": "http://localhost:3000/en/items/vehicles/bobcat"
      }
    });
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/en/items/vehicles/bobcat");
  });

  it("keeps legacy item social metadata on the generic fallback image", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const metadata = buildItemMetadata("en", mortar!);

    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({url: "http://localhost:3000/images/og-wardogs.jpg", alt: "WARDOGS Mortar"})
    ]);
    expect(metadata.twitter?.images).toEqual(["http://localhost:3000/images/og-wardogs.jpg"]);
  });

  it("canonicalizes untranslated catalogue pages to English and keeps them out of the index", () => {
    const guide = getCatalogGuide("weapons");
    expect(guide).toBeDefined();

    const metadata = buildCatalogGuideMetadata("ru", guide!);

    expect(metadata.robots).toEqual({index: false, follow: true});
    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/en/items/weapons",
      languages: {
        en: "http://localhost:3000/en/items/weapons",
        "x-default": "http://localhost:3000/en/items/weapons"
      }
    });
  });

  it("canonicalizes the untranslated item hub to English", () => {
    const metadata = buildItemHubMetadata("de");

    expect(metadata.title).toMatch(/^WARDOGS Catalogue/);
    expect(metadata.robots).toEqual({index: false, follow: true});
    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/en/items",
      languages: {
        en: "http://localhost:3000/en/items",
        "x-default": "http://localhost:3000/en/items"
      }
    });
  });

  it("uses catalogue artwork for hub and category social metadata", () => {
    const guide = getCatalogGuide("weapons");
    expect(guide).toBeDefined();

    const hub = buildItemHubMetadata("en");
    const category = buildCatalogGuideMetadata("en", guide!);

    expect(hub.openGraph?.images).toEqual([
      expect.objectContaining({url: "http://localhost:3000/images/catalogue/banners/thegame-1280.webp"})
    ]);
    expect(category.openGraph?.images).toEqual([
      expect.objectContaining({url: "http://localhost:3000/images/catalogue/banners/weapons-1280.webp"})
    ]);
    expect(category.twitter?.images).toEqual(["http://localhost:3000/images/catalogue/banners/weapons-1280.webp"]);
  });

  it("uses the Pages production URL form consistently for canonical and social URLs", () => {
    const previous = process.env.GITHUB_PAGES;
    process.env.GITHUB_PAGES = "true";
    try {
      const metadata = buildItemHubMetadata("en");
      expect(metadata.alternates?.canonical).toBe("http://localhost:3000/en/items/");
      expect(metadata.openGraph?.url).toBe("http://localhost:3000/en/items/");
    } finally {
      if (previous === undefined) delete process.env.GITHUB_PAGES;
      else process.env.GITHUB_PAGES = previous;
    }
  });

  it("uses one host-only Pages deployment base for model canonical, Open Graph, and image URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");
    const bobcat = getItemBySlug("bobcat");

    const metadata = buildItemMetadata("ru", bobcat!);

    expect(metadata.alternates).toEqual({
      canonical: "https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/",
      languages: {
        en: "https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/",
        "x-default": "https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/"
      }
    });
    expect(metadata.openGraph?.url).toBe("https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/");
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({url: "https://blackdcp.github.io/wardogs/images/catalogue/vehicles/bobcat.webp"})
    ]);
  });
});
