import {existsSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {catalogueMediaSources} from "../../src/features/catalogue/catalogue-media-sources";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";

describe("catalogue media provenance", () => {
  it("documents every record image that the UI may present as verified", () => {
    const visibleImages = catalogueRecords.filter((record) => record.mediaState !== "pending");

    for (const record of visibleImages) {
      expect(existsSync(join(process.cwd(), "public", record.image)), record.image).toBe(true);
      expect(catalogueMediaSources[record.image], record.image).toBeDefined();
      expect(catalogueMediaSources[record.image]?.sourceUrl, record.image).toMatch(/^https:\/\//);
      expect(catalogueMediaSources[record.image]?.retrievedAt, record.image).toMatch(/^2026-/);
      expect(catalogueMediaSources[record.image]?.usageNote.length, record.image).toBeGreaterThan(20);
    }
  });

  it("does not treat a pending identifier as verified media", () => {
    const pendingRecords = catalogueRecords.filter((record) => record.mediaState === "pending");

    expect(pendingRecords.length).toBeGreaterThan(0);
    expect(pendingRecords.every((record) => record.imageAlt.toLowerCase().includes("pending"))).toBe(true);
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

  it("reserves verified media state for first-party assets and labels creator captures as context", () => {
    const verifiedRecordImages = catalogueRecords
      .filter((record) => record.mediaState === "verified")
      .map((record) => record.image);
    const creatorContext = catalogueRecords.filter((record) => record.mediaState === "context-only");

    expect(verifiedRecordImages).toEqual([
      "/images/catalogue/weapons/m4.webp",
      "/images/catalogue/weapons/super-45.webp",
    ]);
    expect(creatorContext.length).toBeGreaterThan(0);
    expect(creatorContext.every((record) => catalogueMediaSources[record.image]?.sourceUrl.includes("youtube.com"))).toBe(true);
  });
});
