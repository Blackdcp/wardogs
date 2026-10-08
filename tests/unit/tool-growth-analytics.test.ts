import {describe, expect, it} from "vitest";
import {createToolAnalytics, hasSharedToolState, isMarkedToolShare, markToolShare, type AnalyticsToolId} from "../../src/features/tools/tool-analytics";
import {decodeWeaponCompareState, encodeWeaponCompareState, decodeAmmoMatcherState, encodeAmmoMatcherState, decodeProgressionRouteState, encodeProgressionRouteState, decodeLogisticsPlanState, encodeLogisticsPlanState} from "../../src/features/tools/share-state";
import {decodeCashXpPlan, encodeCashXpPlan, defaultCashXpPlan} from "../../src/features/tools/cash-xp-calculator";
import {decodeCompatibilitySelection, writeCompatibilitySelection} from "../../src/features/tools/equipment-compatibility-runtime";

describe("privacy-safe tool lifecycle", () => {
  it("emits a shared open and meaningful interaction only once per mounted tool", () => {
    const target = {dataLayer: [] as unknown[]};
    const recorder = createToolAnalytics("logistics-planner", "pl", target);
    recorder.openSharedResult(); recorder.openSharedResult();
    recorder.engage(); recorder.engage(); recorder.openSharedResult();
    expect(target.dataLayer).toEqual([
      ["event", "result_shared_open", {tool: "logistics-planner", locale: "pl"}],
      ["event", "engaged_tool", {tool: "logistics-planner", locale: "pl"}],
    ]);
    createToolAnalytics("map", "pl", target).openSharedResult();
    expect(target.dataLayer).toHaveLength(3);
  });
  it("never mistakes a local edit or share attempt for an incoming shared result", () => {
    const target = {dataLayer: [] as unknown[]};
    const recorder = createToolAnalytics("ammo-matcher", "en", target);
    recorder.beginShare(); recorder.openSharedResult();
    expect(target.dataLayer).toEqual([]);
    recorder.shareCopied(); recorder.openSharedResult();
    expect(target.dataLayer).toEqual([["event", "tool_action", {tool: "ammo-matcher", locale: "en", action: "share", result: "copied"}]]);
    const edited = createToolAnalytics("map", "ja", target);
    edited.engage(); edited.openSharedResult();
    expect(target.dataLayer).toHaveLength(2);
  });
});

describe("restored shared-result qualification", () => {
  const cases: [AnalyticsToolId, string, (search: string) => string, string[]][] = [
    ["weapon-compare", "left=amp-9&right=deagle", (s) => encodeWeaponCompareState(decodeWeaponCompareState(s, ["amp-9", "deagle"])), ["left", "right", "differences"]],
    ["ammo-matcher", "weapon=amp-9&ammo=9x19", (s) => encodeAmmoMatcherState(decodeAmmoMatcherState(s, ["amp-9"], ["9x19"])), ["weapon", "ammo"]],
    ["progression-route", "pr_role=assault&pr_level=12", (s) => encodeProgressionRouteState(decodeProgressionRouteState(s, ["assault"])), ["pr_role", "pr_level"]],
    ["logistics-planner", "lp_stages=construction", (s) => encodeLogisticsPlanState(decodeLogisticsPlanState(s, ["construction"])), ["lp_stages", "lp_supplies"]],
    ["cash-xp-calculator", "count=12", (s) => encodeCashXpPlan(decodeCashXpPlan(s)), Object.keys(defaultCashXpPlan)],
    ["equipment-compatibility", "fitWeapon=amp-9&fitQuery=private%40example.test", (s) => writeCompatibilitySelection(new URL("https://example.test"), decodeCompatibilitySelection(s, ["amp-9"]).selection).search, ["fitWeapon", "fitKind", "fitQuery", "fitNamed"]],
  ];
  it.each(cases)("accepts only explicitly marked %s results, not internal links", (tool, search, encode, keys) => {
    expect(hasSharedToolState(search, encode(search), keys, tool)).toBe(false);
    const marked = search + `&wd_share=${tool}`;
    expect(hasSharedToolState(marked + "&utm_source=discord", encode(search), keys, tool)).toBe(true);
    const versioned = marked + "&schema=2&dataVersion=older-catalogue";
    expect(hasSharedToolState(versioned, encode(versioned), keys, tool)).toBe(true);
    for (const invalid of [search + "&wd_share=map", marked + `&wd_share=${tool}`]) expect(hasSharedToolState(invalid, encode(invalid), keys, tool)).toBe(false);
  });
  it.each(cases)("rejects marked defaults, campaigns, duplicates, malformed and unsupported %s state", (tool, search, encode, keys) => {
    for (const value of ["", "utm_source=discord", search + "&schema=999", search + "&padding=" + "x".repeat(8001), `${keys[0]}=invalid`, search + `&${keys[0]}=invalid`]) {
      const incoming = value + `&wd_share=${tool}`;
      expect(hasSharedToolState(incoming, encode(incoming), keys, tool), incoming.slice(0, 120)).toBe(false);
    }
  });
  it("marks map shares without touching their state fragment", () => {
    const url = markToolShare(new URL("https://example.test/en/tools/map#map-state"), "map");
    expect(url.hash).toBe("#map-state");
    expect(isMarkedToolShare(url.search, "map")).toBe(true);
    expect(isMarkedToolShare(url.search, "artillery-calculator")).toBe(false);
  });
});
