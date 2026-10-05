import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {TOOL_REGISTRY, getToolDefinition} from "../../src/features/tools/tool-registry";

const ids = ["map", "artillery-calculator", "weapon-compare", "ammo-matcher", "loadout-budget", "cash-xp-calculator", "logistics-planner", "progression-route", "system-check"];

describe("tool registry contracts", () => {
  it("keeps all nine precise existing tool destinations unique and resolvable", () => {
    expect(TOOL_REGISTRY.map(({id}) => id)).toEqual(ids);
    expect(new Set(TOOL_REGISTRY.map(({href}) => href)).size).toBe(9);
    for (const id of ids) expect(getToolDefinition(id)?.href).toBe(`/tools/${id}`);
    expect(getToolDefinition("unknown")).toBeUndefined();
  });
  it("gives every tool a localized purpose, task, group and existing guide context", () => {
    for (const tool of TOOL_REGISTRY) {
      expect(tool.labelKey).toMatch(/^nav\./);
      expect(tool.descriptionKey).toBe(`toolsHub.tools.${tool.id}.description`);
      expect(tool.task).toBeTruthy();
      expect(["combat", "economy", "logistics", "progression", "fixes"]).toContain(tool.group);
      expect(tool.relatedGuideSlugs.length).toBeGreaterThan(0);
      for (const slug of tool.relatedGuideSlugs) expect(guideManifest.some((guide) => guide.slug === slug), slug).toBe(true);
    }
  });
});
