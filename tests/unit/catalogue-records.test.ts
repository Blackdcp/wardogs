import {existsSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {
  catalogueRecords,
  getCatalogueRecord,
  getCatalogueRecords
} from "../../src/features/catalogue/catalogue-records";
import {getCatalogueGroup} from "../../src/features/catalogue/catalogue-groups";

describe("catalogue records", () => {
  it("exposes exactly 99 image-backed records", () => {
    expect(catalogueRecords).toHaveLength(99);
    expect(getCatalogueRecords("weapons")).toHaveLength(14);
    expect(getCatalogueRecords("vehicles")).toHaveLength(20);
    expect(getCatalogueRecords("ammo")).toHaveLength(14);
    expect(getCatalogueRecords("attachments")).toHaveLength(40);
    expect(getCatalogueRecords("gear")).toHaveLength(11);
  });

  it("publishes every weapon and vehicle model at its exact detail route", () => {
    const published = catalogueRecords.filter((record) => record.detailStatus === "published");
    const planned = catalogueRecords.filter((record) => record.detailStatus === "planned");

    expect(published).toHaveLength(34);
    expect(published.every((record) => record.type === "weapons" || record.type === "vehicles")).toBe(true);
    expect(published.every((record) => record.detailHref === `/items/${record.type}/${record.slug}`)).toBe(true);
    expect(planned).toHaveLength(0);
  });

  it("keeps inline records useful without fake routes", () => {
    const ammo = getCatalogueRecord("ammo", "5-56x45mm");
    expect(ammo?.detailStatus).toBe("inline");
    expect(ammo?.detailHref).toBeUndefined();
    expect(ammo?.facts.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps each record grounded in an approved image and observed catalogue data", () => {
    for (const record of catalogueRecords) {
      expect(existsSync(join(process.cwd(), "public", record.image))).toBe(true);
      expect(record.summary).not.toBe("Not captured");
      expect(record.facts.length).toBeGreaterThanOrEqual(2);
      expect(record.filterValues.length).toBeGreaterThan(0);
      expect(record.evidenceStatus).toBe("pre-release-build");
      expect(record.dataAsOf).toBe("Alpha 1 - 7 Aug 2026");
    }
  });

  it("exposes a focused filter group for each catalogue type", () => {
    expect(getCatalogueGroup("weapons")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("vehicles")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("ammo")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("attachments")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("gear")?.filters.length).toBeGreaterThan(0);
  });
});
