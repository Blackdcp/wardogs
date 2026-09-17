import {existsSync} from "node:fs";
import {join} from "node:path";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueCategoryView} from "../../src/components/catalogue/catalogue-category-view";
import {itemTypes} from "../../src/features/items/item-library";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {getCatalogueCategoryMedia} from "../../src/features/catalogue/catalogue-media";
import {
  catalogueMediaSources,
  getCatalogueCategoryMediaSource,
  getCatalogueMediaSource,
  type CatalogueMediaSource,
} from "../../src/features/catalogue/catalogue-media-sources";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {buildCatalogGuideMetadata} from "../../src/lib/item-metadata";
import {buildItemTypeJsonLd} from "../../src/lib/item-structured-data";

describe("catalogue media provenance", () => {
  it("documents every record image that the UI may present as verified", () => {
    const visibleImages = catalogueRecords.filter((record) => record.mediaState !== "pending" && record.image);

    for (const record of visibleImages) {
      expect(existsSync(join(process.cwd(), "public", record.image!)), record.image).toBe(true);
      expect(catalogueMediaSources[record.image!], record.image).toBeDefined();
      expect(catalogueMediaSources[record.image!]?.sourceUrl, record.image).toMatch(/^https:\/\//);
      expect(catalogueMediaSources[record.image!]?.retrievedAt, record.image).toMatch(/^2026-/);
      expect(catalogueMediaSources[record.image!]?.usageNote.length, record.image).toBeGreaterThan(20);
    }
  });

  it("uses unique item-specific media wherever an authentic capture exists", () => {
    const pendingRecords = catalogueRecords.filter((record) => record.mediaState === "pending");
    const visibleRecords = catalogueRecords.filter((record) => record.mediaState !== "pending");
    const visibleImages = visibleRecords.map((record) => record.image).filter((image): image is string => Boolean(image));

    expect(pendingRecords).toHaveLength(101);
    expect(pendingRecords.every((record) => record.image === undefined && record.imageAlt === undefined)).toBe(true);
    expect(new Set(visibleImages)).toHaveLength(visibleImages.length);
    expect(visibleImages.every((image) => !image.includes("/banners/"))).toBe(true);
  });

  it("keeps all 65 ammo, attachment, and gear assets pending without record-level provenance", () => {
    const records = catalogueRecords.filter((record) => ["ammo", "attachments", "gear"].includes(record.type));

    expect(records).toHaveLength(65);
    for (const record of records) {
      expect(record.mediaState, `${record.type}/${record.slug}`).toBe("pending");
      expect(record.image, `${record.type}/${record.slug}`).toBeUndefined();
      expect(record.imageAlt, `${record.type}/${record.slug}`).toBeUndefined();
      expect(getCatalogueMediaSource(record), `${record.type}/${record.slug}`).toBeUndefined();
    }
    expect(JSON.stringify(catalogueMediaSources)).not.toContain("-k6IV0ITLDo");
  });

  it("contains no competitor asset or watermark-removal source", () => {
    const serialized = JSON.stringify(catalogueMediaSources);

    expect(serialized).not.toMatch(/wardogs(?:hub|zone)|watermark|remove[_-]?watermark/i);
  });

  it("uses source-audited Team17 press-kit media for verified expansion art", () => {
    const officialAssets = [
      "/images/catalogue/weapons/m4.webp",
      "/images/catalogue/weapons/super-45.webp",
      "/images/guide-discovery/best-weapons-loadouts.webp",
      "/images/guide-discovery/armor-damage-ttk.webp",
      "/images/guide-discovery/medic-revive.webp",
      "/images/guide-discovery/equipment-tools.webp",
    ];

    for (const asset of officialAssets) {
      expect(existsSync(join(process.cwd(), "public", asset)), asset).toBe(true);
      expect(catalogueMediaSources[asset]?.sourceLabel, asset).toContain("Team17");
      expect(catalogueMediaSources[asset]?.sourceUrl, asset).toContain("team17.com");
    }
  });

  it("requires explicit object-matching provenance for every verified record image", () => {
    const verifiedRecordImages = catalogueRecords
      .filter((record) => record.mediaState === "verified")
      .map((record) => record.image)
      .filter((image): image is string => Boolean(image));

    expect(verifiedRecordImages).toHaveLength(59);
    expect(new Set(verifiedRecordImages)).toHaveLength(verifiedRecordImages.length);
    for (const record of catalogueRecords.filter((candidate) => candidate.mediaState === "verified")) {
      const source = getCatalogueMediaSource(record);
      const key = `${record.type}/${record.slug}`;
      expect(source, key).toBeDefined();
      expect(source?.assetKind, key).toBe("object");
      expect(source?.approvedState, key).toBe(record.mediaState);
      expect(source?.recordKey === key || source?.additionalRecordKeys?.includes(key), key).toBe(true);
    }
    expect(catalogueRecords.filter((record) => record.mediaState === "context-only")).toHaveLength(0);
  });

  it("publishes category hero, metadata, and JSON-LD images only through contextual approvals", () => {
    for (const {id} of itemTypes) {
      const media = getCatalogueCategoryMedia(id);
      const source = getCatalogueCategoryMediaSource(id);
      const guide = getCatalogGuide(id);

      expect(media, id).toBeDefined();
      expect(source, id).toBeDefined();
      expect(source?.assetKind, id).toBe("contextual");
      expect(source?.categoryKeys, id).toContain(id);
      expect(media?.image, id).toBe(source?.image);
      expect(media?.image, id).not.toMatch(/556x45mm|heavy-armor/);
      expect(guide, id).toBeDefined();

      const metadata = buildCatalogGuideMetadata("en", guide!);
      const collection = buildItemTypeJsonLd("en", id)[0];
      expect(metadata.openGraph?.images, `${id} metadata`).toEqual([
        expect.objectContaining({url: `http://localhost:3000${media?.image}`}),
      ]);
      expect(collection.image, `${id} JSON-LD`).toBe(`http://localhost:3000${media?.image}`);
    }
  });

  it("removes an unregistered category image from hero, metadata, and JSON-LD together", () => {
    const guide = getCatalogGuide("ammo")!;
    const approved = getCatalogueCategoryMedia("ammo")!;
    const mutableRegistry = catalogueMediaSources as Record<string, CatalogueMediaSource>;
    const source = mutableRegistry[approved.image];

    delete mutableRegistry[approved.image];
    try {
      const html = renderToStaticMarkup(React.createElement(CatalogueCategoryView, {guide, locale: "en"}));
      const metadata = buildCatalogGuideMetadata("en", guide);
      const collection = buildItemTypeJsonLd("en", "ammo")[0];

      expect(html).not.toContain(approved.image);
      expect(metadata.openGraph?.images ?? []).toEqual([]);
      expect(collection).not.toHaveProperty("image");
    } finally {
      mutableRegistry[approved.image] = source;
    }
  });
});
