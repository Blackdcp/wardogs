import {existsSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "../../src/features/catalogue/catalogue-types";
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

  it("uses a model article's exact committed image and updated date in Article schema", () => {
    const amp9 = getItemBySlug("amp-9");
    expect(amp9).toBeDefined();

    const jsonLd = buildItemArticleJsonLd("en", amp9!);

    expect(jsonLd[0]).toMatchObject({
      "@type": "Article",
      image: "http://localhost:3000/images/catalogue/weapons/amp-9.webp",
      dateModified: "2026-08-07"
    });
    expect(JSON.stringify(jsonLd)).not.toMatch(/Product|Offer|AggregateRating|Rating/);
  });

  it("uses Article schema and the exact image for a published vehicle model", () => {
    const l2a6 = getItemBySlug("l2a6");
    expect(l2a6).toBeDefined();

    const jsonLd = buildItemArticleJsonLd("en", l2a6!);

    expect(jsonLd[0]).toMatchObject({
      "@type": "Article",
      image: "http://localhost:3000/images/catalogue/vehicles/l2a6.webp",
      dateModified: "2026-08-07"
    });
    expect(JSON.stringify(jsonLd)).not.toMatch(/Product|Offer|AggregateRating|Rating/);
  });

  it("keeps legacy Article schema on the generic fallback image", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar).toBeDefined();

    const jsonLd = buildItemArticleJsonLd("en", mortar!);

    expect(jsonLd[0]).toMatchObject({image: "http://localhost:3000/images/og-wardogs.jpg"});
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

  it("uses published detail URLs and images for weapon models without duplicate entries", () => {
    const weapons = buildItemTypeJsonLd("en", "weapons");
    const entries = weapons[1].itemListElement as Array<{name: string; url: string; image?: string}>;

    expect(entries[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "A-91",
      url: "http://localhost:3000/en/items/weapons/a-91",
      image: "http://localhost:3000/images/catalogue/weapons/a-91.webp"
    });
    expect(entries[1]).toMatchObject({
      name: "AK74",
      url: "http://localhost:3000/en/items/weapons/ak74",
      image: "http://localhost:3000/images/catalogue/weapons/ak74.webp"
    });
    expect(entries[14]).toEqual({
      "@type": "ListItem",
      position: 15,
      name: "Mortar",
      url: "http://localhost:3000/en/items/weapons/mortar"
    });
    expect(entries.slice(0, 14).every((entry) => entry.image?.startsWith("http://localhost:3000/images/catalogue/weapons/"))).toBe(true);
    expect(entries.filter((entry) => entry.url.includes("/items/weapons/")).map((entry) => entry.url)).toHaveLength(15);
    expect(new Set(entries.map((entry) => entry.name)).size).toBe(15);
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

  it("keeps all 99 image-backed records ordered, anchored, and backed by filesystem images", () => {
    const expected = {
      weapons: "a-91:A-91|ak74:AK74|amp-9:AMP-9|amr-50:AMR 50|bmr-308:BMR-308|bushmaster-m17s:Bushmaster M17S|compound-bow:Compound Bow|deagle:Deagle|fal:FAL|galil:Galil|ggx-17:GGX 17|ggx-18:GGX 18|judge:Judge|kh-2002:KH-2002",
      vehicles: "ah-6m-miniguns:AH-6M Miniguns|ah-6r-rockets:AH-6R Rockets|bobcat:Bobcat|dune-buggy:Dune Buggy|flakpanzer-gepard:Flakpanzer Gepard|havoc:Havoc|humvee-m249:Humvee M249|humvee-minigun:Humvee Minigun|humvee:Humvee|kodiak-m249:Kodiak M249|kodiak-pickup:Kodiak Pickup|kodiak:Kodiak|l2a6:L2A6|mh-6:MH-6|sph-2:SPH-2|uh-1y-miniguns:UH-1Y Miniguns|uh-1y:UH-1Y|ural-defender-m249:Ural Defender M249|ural-defender:Ural Defender|ural:Ural",
      ammo: "45-acp:.45 ACP|9x19mm:9x19mm|5-45x39mm:5.45x39mm|5-56x45mm:5.56x45mm|50-ae:.50 AE|7-62x54mmr:7.62x54mmR|45-colt:.45 Colt|7-62x39mm:7.62x39mm|308-winchester:.308 Winchester|50-cal:.50 Cal|338-norma-magnum:.338 Norma Magnum|12-gauge:12 Gauge|12-7x55mm:12.7x55mm|9x39mm:9x39mm",
      attachments: "vektor-frenix-x-micro-reflex-sight:Vektor Frenix-X Micro Reflex Sight|four-reticle-reflex:Four Reticle Reflex|compact-t-2-red-dot:Compact T-2 Red Dot|holographic-sight:Holographic Sight|kobra-reflex:Kobra Reflex|okp-7-reflex:OKP 7 Reflex|tricon-1-5x-compact-prism-scope:Tricon 1.5x Compact Prism Scope|cq-2x-prism-combat-scope:CQ-2x Prism Combat Scope|2-5x-combat-optic:2.5x Combat Optic|spitfire-3x:Spitfire 3x|3x-tactical-prism-scope:3x Tactical Prism Scope|4x-combat-prism-scope-with-reflex:4x Combat Prism Scope with Reflex|spectr-4x:Spectr 4x|amp-9-15-rnd-magazine:AMP-9 15 Round Magazine|amp-9-20-rnd-magazine:AMP-9 20 Round Magazine|amp-9-30-rnd-magazine:AMP-9 30 Round Magazine|amp-9-50-rnd-magazine:AMP-9 50 Round Magazine|amr-50-10-rnd-magazine:AMR 50 10 Round Magazine|deagle-7-rnd-magazine:Deagle 7 Round Magazine|fal-bmr-308-20-rnd-magazine:FAL and BMR-308 20 Round Magazine|fal-30-rnd-magazine:FAL 30 Round Magazine|galil-35-rnd-magazine:Galil 35 Round Magazine|galil-50-rnd-magazine:Galil 50 Round Magazine|ggx-50-rnd-drum-magazine:GGX 50 Round Drum Magazine|m1911-7-rnd-magazine:M1911 7 Round Magazine|m1911-10-rnd-magazine:M1911 10 Round Magazine|m249-100-rnd-fabric-magazine:M249 100 Round Fabric Magazine|mk22-5-rnd-magazine:MK22 5 Round Magazine|mp5-20-rnd-magazine:MP5 20 Round Magazine|mp5-30-rnd-magazine:MP5 30 Round Magazine|mp5-50-rnd-magazine:MP5 50 Round Magazine|pp-19-vityaz-10-rnd-magazine:PP-19 Vityaz 10 Round Magazine|pp-19-vityaz-30-rnd-magazine:PP-19 Vityaz 30 Round Magazine|pp-19-50-rnd-magazine:PP-19 50 Round Magazine|stanag-20-rnd-magazine:STANAG 20 Round Magazine|stanag-60-rnd-magazine:STANAG 60 Round Magazine|super-45-13-rnd-magazine:Super-45 13 Round Magazine|super-45-30-rnd-magazine:Super-45 30 Round Magazine|super-45-40-rnd-drum-magazine:Super-45 40 Round Drum Magazine|svd-5-rnd-magazine:SVD 5 Round Magazine",
      gear: "light-helmet:Light Helmet|medium-helmet:Medium Helmet|heavy-helmet:Heavy Helmet|super-heavy-helmet:Super Heavy Helmet|ghillie-helmet:Ghillie Helmet|light-armor:Light Armor|medium-armor:Medium Armor|heavy-armor:Heavy Armor|super-heavy-armor:Super Heavy Armor|ghillie-armor:Ghillie Armor|scout-backpack:Scout Backpack"
    } as const;

    expect(Object.values(expected).join("|").split("|")).toHaveLength(99);
    for (const [type, encoded] of Object.entries(expected)) {
      const entries = buildItemTypeJsonLd("en", type as keyof typeof expected)[1].itemListElement as Array<{name: string; url: string; image?: string}>;
      const expectedRecords = encoded.split("|").map((value) => {
        const [slug, name] = value.split(":");
        return {slug, name};
      });
      expect(entries.slice(0, expectedRecords.length).map(({name}) => name)).toEqual(expectedRecords.map(({name}) => name));
      const records = getCatalogueRecords(type as CatalogueRecordType);
      expect(entries.slice(0, expectedRecords.length).map(({url}) => url)).toEqual(expectedRecords.map(({slug}) => {
        const record = records.find((candidate) => candidate.slug === slug);
        return record?.detailStatus === "published"
          ? `http://localhost:3000/en${record.detailHref}`
          : `http://localhost:3000/en/items/${type}#record-${type}-${slug}`;
      }));
      for (const entry of entries.slice(0, expectedRecords.length)) {
        expect(entry.image).toMatch(/^http:\/\/localhost:3000\/images\/catalogue\//);
        expect(existsSync(join(process.cwd(), "public", new URL(entry.image!).pathname))).toBe(true);
      }
    }
  });

  it("uses the production trailing-slash canonical form in catalogue JSON-LD", () => {
    const previous = process.env.GITHUB_PAGES;
    process.env.GITHUB_PAGES = "true";
    try {
      const jsonLd = buildItemTypeJsonLd("de", "weapons");
      expect(jsonLd[0].url).toBe("http://localhost:3000/en/items/weapons/");
      expect((jsonLd[1].itemListElement as Array<{url: string}>)[0].url).toBe("http://localhost:3000/en/items/weapons/a-91/");
    } finally {
      if (previous === undefined) delete process.env.GITHUB_PAGES;
      else process.env.GITHUB_PAGES = previous;
    }
  });
});
