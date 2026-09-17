import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {LogisticsPlanner} from "../../src/components/tools/logistics-planner";
import {locales} from "../../src/config/site";
import {seasonOneChanges} from "../../src/features/catalogue/catalogue-evidence";
import {isApprovedSourceUrl} from "../../src/content/source-policy";
import {
  buildLogisticsPlan,
  getLogisticsStages,
  logisticsStageIds,
} from "../../src/features/tools/logistics-plan";
import {getToolCopy} from "../../src/features/tools/tool-copy";

describe("logistics planner", () => {
  it("defines the six operational stages in the approved default order", () => {
    expect(logisticsStageIds).toEqual(["spawn", "construction", "supply", "transport", "defense", "recovery"]);

    const stages = getLogisticsStages("en");
    expect(stages.map(({id}) => id)).toEqual(logisticsStageIds);
    for (const stage of stages) {
      expect(stage.title.trim(), stage.id).not.toBe("");
      expect(stage.action.trim(), stage.id).not.toBe("");
      expect(["current", "unknown"], stage.id).toContain(stage.evidenceState);
    }
  });

  it("keeps tactical-only stages unknown and free of official provenance", () => {
    const unknownStages = getLogisticsStages("en").filter(({changes}) => changes.length === 0);

    expect(unknownStages.map(({id}) => id)).toEqual(["defense", "recovery"]);
    for (const stage of unknownStages) {
      expect(stage).toMatchObject({
        evidenceState: "unknown",
        build: null,
        sourceClass: null,
        confidence: null,
        sourceUrl: null,
        checkedAt: null,
      });
    }
  });

  it("does not render official provenance for a tactical-only stage", () => {
    const recovery = getLogisticsStages("en").find(({id}) => id === "recovery");
    expect(recovery).toBeDefined();
    if (!recovery) return;

    const html = renderToStaticMarkup(React.createElement(LogisticsPlanner, {
      copy: getToolCopy("en"),
      stages: [recovery],
      initialState: {stages: ["recovery"]},
    }));

    expect(html).toContain("Unknown");
    expect(html).not.toContain("store.steampowered.com");
    expect(html).not.toContain("Source class: Official");
    expect(html).not.toContain("Confidence: Confirmed");
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
      if (stage.changes.length > 0) {
        expect(stage.evidenceState).toBe("current");
        expect(stage.sourceClass).toBe("official");
        expect(stage.confidence).toBe("confirmed");
        expect(stage.checkedAt).toMatch(/^2026-\d{2}-\d{2}$/);
        expect(stage.sourceUrl && isApprovedSourceUrl(stage.sourceUrl), stage.id).toBe(true);
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
      expect(localized.map(({changes}) => changes.map(({id, sourceUrl, verifiedAt}) => ({id, sourceUrl, verifiedAt}))), locale)
        .toEqual(english.map(({changes}) => changes.map(({id, sourceUrl, verifiedAt}) => ({id, sourceUrl, verifiedAt}))));
      const localizedChanges = localized.flatMap(({changes}) => changes);
      for (const change of english.flatMap(({changes}) => changes).filter(({previousValue, currentValue}) => /^[$\d,]+$/.test(previousValue) && /^[$\d,]+$/.test(currentValue))) {
        expect(localizedChanges.find(({id}) => id === change.id)).toMatchObject({
          previousValue: change.previousValue,
          currentValue: change.currentValue,
        });
      }
    }
  });
});
