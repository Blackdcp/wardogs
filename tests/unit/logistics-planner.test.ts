import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {seasonOneChanges} from "../../src/features/catalogue/catalogue-evidence";
import {isApprovedSourceUrl} from "../../src/content/source-policy";
import {
  buildLogisticsPlan,
  getLogisticsStages,
  logisticsStageIds,
} from "../../src/features/tools/logistics-plan";

describe("logistics planner", () => {
  it("defines the six operational stages in the approved default order", () => {
    expect(logisticsStageIds).toEqual(["spawn", "construction", "supply", "transport", "defense", "recovery"]);

    const stages = getLogisticsStages("en");
    expect(stages.map(({id}) => id)).toEqual(logisticsStageIds);
    for (const stage of stages) {
      expect(stage.title.trim(), stage.id).not.toBe("");
      expect(stage.action.trim(), stage.id).not.toBe("");
      expect(["current", "historical", "unknown"], stage.id).toContain(stage.evidenceState);
      expect(stage.checkedAt, stage.id).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(isApprovedSourceUrl(stage.sourceUrl), stage.id).toBe(true);
    }
  });

  it("preserves a selected order while removing duplicates and unknown IDs", () => {
    const plan = buildLogisticsPlan(["transport", "supply", "transport", "unknown", "recovery"], "en");
    expect(plan.map(({id}) => id)).toEqual(["transport", "supply", "recovery"]);
    expect(new Set(plan.map(({id}) => id)).size).toBe(plan.length);
  });

  it("only attaches numeric changes that exist in normalized approved evidence", () => {
    for (const stage of getLogisticsStages("en")) {
      for (const change of stage.changes) {
        expect(seasonOneChanges).toContainEqual(change);
        expect(change.sourceUrl).toBe(stage.sourceUrl);
        expect(change.verifiedAt).toBe(stage.checkedAt);
      }
    }
  });

  it("localizes all stages while keeping the evidence and ordering identical", () => {
    const english = getLogisticsStages("en");
    for (const locale of locales) {
      const localized = getLogisticsStages(locale);
      expect(localized.map(({id}) => id), locale).toEqual(logisticsStageIds);
      expect(localized.every(({title, action, evidenceNote}) => title.trim() && action.trim() && evidenceNote.trim()), locale)
        .toBe(true);
      expect(localized.map(({changes}) => changes), locale).toEqual(english.map(({changes}) => changes));
    }
  });
});
