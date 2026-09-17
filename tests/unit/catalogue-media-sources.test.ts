import {existsSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {catalogueMediaSources, getCatalogueMediaSource} from "../../src/features/catalogue/catalogue-media-sources";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";

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

    expect(pendingRecords).toHaveLength(36);
    expect(pendingRecords.every((record) => record.image === undefined && record.imageAlt === undefined)).toBe(true);
    expect(new Set(visibleImages)).toHaveLength(visibleImages.length);
    expect(visibleImages.every((image) => !image.includes("/banners/"))).toBe(true);
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

    expect(verifiedRecordImages).toHaveLength(124);
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
});
