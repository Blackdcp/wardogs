import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";
import {getTacticalIntelCopy, ARTILLERY_155MM_BALLISTICS, MORTAR_81MM_BALLISTICS} from "@/features/maps/map-tactical-data";
import {communityPois} from "@/features/maps/map-community-pois";
import {getMapPlannerCopy} from "@/features/maps/map-planner-copy";

describe("map field reference provenance", () => {
  it.each(locales)("derives %s map categories and counts from the actual marker dataset", (locale) => {
    const copy = getTacticalIntelCopy(locale);
    const labels = getMapPlannerCopy(locale);
    for (const theater of copy.theaters) {
      const records = communityPois.filter((poi) => poi.map === theater.id);
      expect(theater.sectors).toHaveLength(new Set(records.map((poi) => poi.kind)).size);
      for (const kind of new Set(records.map((poi) => poi.kind))) {
        expect(theater.sectors).toContain(`${labels[kind]}: ${records.filter((poi) => poi.kind === kind).length}`);
      }
    }
    expect(JSON.stringify(copy.theaters)).not.toContain("D4/E4");
    expect(copy.ballisticsRuleDesc).not.toContain("125");
    if (locale !== "en") expect(copy.ballisticsRuleDesc).not.toEqual(getTacticalIntelCopy("en").ballisticsRuleDesc);
  });
  it("only displays finite firing-table solutions", () => {
    for (const row of [...ARTILLERY_155MM_BALLISTICS, ...MORTAR_81MM_BALLISTICS]) {
      expect(row.mils).toBeGreaterThan(0);
      expect(Number.isFinite(row.mils)).toBe(true);
      expect(row.tof).toBeGreaterThan(0);
    }
  });
});
