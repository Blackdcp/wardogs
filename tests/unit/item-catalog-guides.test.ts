import {describe, expect, it} from "vitest";
import {
  catalogGuides,
  getCatalogEntryCount,
  getCatalogGuide,
} from "../../src/features/items/item-catalog-guides";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "../../src/features/catalogue/catalogue-types";
import {buildItemTypeJsonLd} from "../../src/lib/item-structured-data";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

const recordBackedGuideIds = [
  "weapons",
  "vehicles",
  "ammo",
  "attachments",
  "gear",
  "equipment",
  "medical",
  "supplies",
  "deployables",
  "mechanics",
] as const;

describe("WARDOGS item catalog guides", () => {
  it("describes Alpha observations as historical now that Early Access is live", () => {
    for (const guide of catalogGuides) {
      expect(`${guide.disclaimer} ${guide.unknowns.join(" ")}`, guide.id).not.toMatch(/before Early Access/i);
    }
  });

  it("covers every catalogue players can browse from the competitor-shaped guide matrix", () => {
    expect(catalogGuides.map((guide) => guide.id)).toEqual([
      "weapons",
      "vehicles",
      "ammo",
      "attachments",
      "gear",
      "equipment",
      "medical",
      "supplies",
      "deployables",
      "mechanics",
      "loadouts"
    ]);
  });

  it("derives every record-backed table, count, and ItemList entry from the same records", () => {
    for (const id of recordBackedGuideIds) {
      const guide = getCatalogGuide(id);
      const records = getCatalogueRecords(id as CatalogueRecordType);
      const rows = guide?.sections.flatMap((section) => section.rows) ?? [];
      const jsonLdEntries = buildItemTypeJsonLd("en", id)[1].itemListElement as Array<{name: string}>;

      expect(rows, `${id} table rows`).toHaveLength(records.length);
      expect(getCatalogEntryCount(id), `${id} published count`).toBe(records.length);
      expect(jsonLdEntries, `${id} JSON-LD entries`).toHaveLength(records.length);
      expect(new Set(rows.map((catalogueRow) => catalogueRow.recordSlug)).size, `${id} unique row mappings`)
        .toBe(records.length);

      for (const catalogueRow of rows) {
        const record = records.find(({slug}) => slug === catalogueRow.recordSlug);
        expect(record, `${id}/${catalogueRow.cells[0]} record mapping`).toBeDefined();
        expect(catalogueRow.cells[0], `${id}/${catalogueRow.recordSlug} identity`).toBe(record?.name);

        for (let index = 1; index < catalogueRow.cells.length; index += 1) {
          const displayedValue = catalogueRow.cells[index];
          if (!displayedValue) continue;
          expect(record?.facts, `${id}/${record?.slug} ${guide?.columns[index]}=${displayedValue}`)
            .toContainEqual({label: guide?.columns[index], value: displayedValue});
        }
      }
    }

    expect(getCatalogEntryCount("loadouts")).toBe(3);
  });

  it("keeps record-backed titles and count labels aligned", () => {
    const weapons = catalogGuides.find((guide) => guide.id === "weapons");
    const vehicles = catalogGuides.find((guide) => guide.id === "vehicles");

    const weaponCount = getCatalogueRecords("weapons").length;
    const vehicleCount = getCatalogueRecords("vehicles").length;

    expect(weapons?.title).toContain(String(weaponCount));
    expect(weapons?.countLabel).toContain(String(weaponCount));
    expect(vehicles?.title).toContain(String(vehicleCount));
    expect(vehicles?.countLabel).toContain(String(vehicleCount));
  });

  it("keeps every row aligned with its guide columns and labels pre-release evidence", () => {
    for (const guide of catalogGuides) {
      expect(guide.dataAsOf).toMatch(/Alpha 1|Closed Beta|Season 1|evidence pending/);
      expect(guide.disclaimer).toMatch(/pre-release|historical|build-sensitive|Official current|unverified/i);
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

  it("removes unsupported equipment roles, prices, and identifiers from the field table", () => {
    const equipment = getCatalogGuide("equipment");
    expect(equipment).toBeDefined();
    expect(equipment?.disclaimer).toMatch(/unverified|record-specific/i);

    const unsupported = equipment?.sections.flatMap((section) => section.rows)
      .flatMap((catalogueRow) => catalogueRow.cells.slice(1))
      .join(" ");
    expect(unsupported).not.toMatch(/\$\d|Recon|Vehicle|Utility|RangeFinder|FuelCan|RepairTool/i);
    expect(unsupported).toMatch(/source pending|no observed object facts retained/i);
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
