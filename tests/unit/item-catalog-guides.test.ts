import {describe, expect, it} from "vitest";
import {
  catalogGuides,
  getCatalogEntryCount
} from "../../src/features/items/item-catalog-guides";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

describe("WARDOGS item catalog guides", () => {
  it("covers every catalogue players can browse from the competitor-shaped guide matrix", () => {
    expect(catalogGuides.map((guide) => guide.id)).toEqual([
      "weapons",
      "vehicles",
      "ammo",
      "attachments",
      "gear",
      "equipment",
      "loadouts"
    ]);
  });

  it("publishes the observed Alpha 1 catalogue counts", () => {
    expect(getCatalogEntryCount("weapons")).toBe(33);
    expect(getCatalogEntryCount("vehicles")).toBe(20);
    expect(getCatalogEntryCount("ammo")).toBe(14);
    expect(getCatalogEntryCount("attachments")).toBe(55);
    expect(getCatalogEntryCount("gear")).toBe(11);
    expect(getCatalogEntryCount("equipment")).toBe(13);
    expect(getCatalogEntryCount("loadouts")).toBe(3);
  });

  it("keeps every row aligned with its guide columns and labels pre-release evidence", () => {
    for (const guide of catalogGuides) {
      expect(guide.dataAsOf).toContain("Alpha 1");
      expect(guide.disclaimer).toContain("pre-release");
      expect(guide.sections.length).toBeGreaterThan(0);
      expect(guide.insights.length).toBeGreaterThanOrEqual(3);
      expect(guide.unknowns.length).toBeGreaterThanOrEqual(2);

      for (const section of guide.sections) {
        for (const row of section.rows) {
          expect(row.cells).toHaveLength(guide.columns.length);
        }
      }
    }
  });

  it("does not expose competitor URLs as public sources", () => {
    const serialized = JSON.stringify(catalogGuides);
    expect(serialized).not.toMatch(/wardogshub\.gg|wardogs\.wiki|gamblewithyourfriends\.net/i);
    expect(catalogGuides.flatMap((guide) => guide.officialSources).every((source) => isApprovedSourceUrl(source.url))).toBe(true);
  });

  it("uses one canonical label for shared ammunition", () => {
    const cells = catalogGuides.flatMap((guide) => guide.sections.flatMap((section) => section.rows.flatMap((catalogueRow) => catalogueRow.cells)));
    const russianRifleCells = cells.filter((cell) => cell.startsWith("7.62x54"));
    const winchesterCells = cells.filter((cell) => cell.startsWith(".308"));

    expect(new Set(russianRifleCells)).toEqual(new Set(["7.62x54mmR"]));
    expect(new Set(winchesterCells)).toEqual(new Set([".308 Winchester"]));
  });
});
