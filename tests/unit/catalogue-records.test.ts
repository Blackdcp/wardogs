import {existsSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {
  catalogueRecords,
  getCatalogueRecord,
  getCatalogueRecords
} from "../../src/features/catalogue/catalogue-records";
import {getIndexableCatalogueItems} from "../../src/features/catalogue/catalogue-evidence";
import {getCatalogueGroup} from "../../src/features/catalogue/catalogue-groups";

describe("catalogue records", () => {
  it("exposes the expanded record inventory", () => {
    expect(catalogueRecords).toHaveLength(160);
    expect(getCatalogueRecords("weapons")).toHaveLength(38);
    expect(getCatalogueRecords("vehicles")).toHaveLength(28);
    expect(getCatalogueRecords("ammo")).toHaveLength(14);
    expect(getCatalogueRecords("attachments")).toHaveLength(40);
    expect(getCatalogueRecords("gear")).toHaveLength(11);
    expect(getCatalogueRecords("equipment")).toHaveLength(5);
    expect(getCatalogueRecords("medical")).toHaveLength(4);
    expect(getCatalogueRecords("supplies")).toHaveLength(4);
    expect(getCatalogueRecords("deployables")).toHaveLength(5);
    expect(getCatalogueRecords("mechanics")).toHaveLength(4);
    expect(getCatalogueRecords("maps")).toHaveLength(7);
    expect(catalogueRecords.every((record) => record.evidence.verifiedAt.match(/^\d{4}-\d{2}-\d{2}$/))).toBe(true);
  });

  it("keeps every new sourced group useful without creating thin detail routes", () => {
    const requiredGroups = ["equipment", "medical", "supplies", "deployables", "mechanics", "maps"] as const;

    for (const type of requiredGroups) {
      const records = getCatalogueRecords(type);
      expect(records.length, type).toBeGreaterThan(0);
      expect(getCatalogueGroup(type)?.filters.length, type).toBeGreaterThan(0);
      expect(records.every((record) => record.detailStatus === "inline"), type).toBe(true);
      expect(records.every((record) => record.detailHref === undefined), type).toBe(true);
      expect(records.every((record) => record.evidence.sourceUrl?.startsWith("https://")), type).toBe(true);
      expect(getIndexableCatalogueItems(records), type).toEqual([]);
    }
  });

  it("keeps equipment, medical, and explosive observations inside the approved creator source scope", () => {
    const approvedSlugs = [
      "binoculars",
      "rangefinder",
      "fuel-can",
      "repair-tool",
      "battery",
      "stimpen",
      "enox",
      "defibrillator",
      "medical-bag",
      "improvised-explosive-device",
      "at-mine",
      "claymore",
    ];
    const records = catalogueRecords.filter((record) => approvedSlugs.includes(record.slug));

    expect(records).toHaveLength(approvedSlugs.length);
    for (const record of records) {
      expect(record.evidence.sourceUrl, record.slug).toBe("https://www.youtube.com/watch?v=J5QZXLENLgQ");
      expect(record.evidence.sourceClass, record.slug).toBe("creator-historical");
      expect(record.evidence.confidence, record.slug).toBe("observed");
      expect(record.evidence.current, record.slug).toBe(false);
      expect(record.dataAsOf, record.slug).toContain("20 Aug 2026");
      expect(record.sourceNotes.join(" "), record.slug).toMatch(/clip|segment|walkthrough/i);
      expect(record.facts, record.slug).not.toEqual(expect.arrayContaining([
        expect.objectContaining({label: "Alpha price"}),
        expect.objectContaining({label: "Recorded identifier"}),
      ]));
      expect(JSON.stringify(record), record.slug).not.toMatch(/\$\d|ATMine|MedKit/);
    }
  });

  it("publishes every weapon and vehicle model at its exact detail route", () => {
    const published = catalogueRecords.filter((record) => record.detailStatus === "published");
    const planned = catalogueRecords.filter((record) => record.detailStatus === "planned");

    expect(published).toHaveLength(59);
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
      if (record.mediaState === "pending") {
        expect(record.image, `${record.type}/${record.slug}`).toBeUndefined();
        expect(record.imageAlt, `${record.type}/${record.slug}`).toBeUndefined();
      } else {
        expect(record.image, `${record.type}/${record.slug}`).toBeTruthy();
        expect(existsSync(join(process.cwd(), "public", record.image!)), record.image).toBe(true);
        expect(record.imageAlt?.trim().length, `${record.type}/${record.slug}`).toBeGreaterThan(4);
      }
      expect(record.summary).not.toBe("Not captured");
      expect(record.facts.length).toBeGreaterThanOrEqual(2);
      expect(record.filterValues.length).toBeGreaterThan(0);
      expect(["official", "verified-in-game", "pre-release-build", "community-report"]).toContain(record.evidenceStatus);
      expect(record.sourceNotes.length).toBeGreaterThan(0);
    }
  });

  it("exposes a focused filter group for each catalogue type", () => {
    expect(getCatalogueGroup("weapons")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("vehicles")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("ammo")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("attachments")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("gear")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("equipment")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("medical")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("supplies")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("deployables")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("mechanics")?.filters.length).toBeGreaterThan(0);
    expect(getCatalogueGroup("maps")?.filters.length).toBeGreaterThan(0);
  });
});
