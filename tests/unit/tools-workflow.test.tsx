import {describe, expect, it, vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {calculatePurchases, calculateSupplyPlan, dataFingerprint, emptySupplyPlan, findPurchaseAmmoRelationship, hasInvalidSelection, inspectToolState, isToolShareWithinLimit, maximumToolShareLength, supplyPlanSchema, totalPurchases, type PurchaseLine} from "../../src/features/tools/workflow-state";
import {decodeBudgetState, encodeBudgetState, decodeLogisticsPlanState, encodeLogisticsPlanState, encodeWeaponCompareState, decodeWeaponCompareState} from "../../src/features/tools/share-state";
import {getLoadoutCatalogue} from "../../src/features/tools/loadout-catalogue";
import {getAmmoMatcherDataset} from "../../src/features/tools/ammo-matcher-data";
import {getWorkflowCopy} from "../../src/features/tools/workflow-copy";
import {getToolCopy, resolveToolLocale} from "../../src/features/tools/tool-copy";
import {comparisonRowDiffers, searchComparableWeapons} from "../../src/features/tools/weapon-compare-runtime";
import {compareWeapons, getComparableWeapons} from "../../src/features/tools/weapon-compare-data";
import {LoadoutBudget} from "../../src/components/tools/loadout-budget";
import {LoadoutBudgetEditor} from "../../src/components/tools/loadout-budget-editor";
import {SupplyManifest} from "../../src/components/tools/supply-manifest";
import {getLogisticsStages} from "../../src/features/tools/logistics-plan";
import {ToolShareNotice} from "../../src/components/tools/tool-share-notice";

vi.mock("@/i18n/navigation", () => ({Link: ({children}: {children: React.ReactNode}) => <span>{children}</span>}));

const oldBudget = {cash: 10_000, loadout: 3_000, vehicle: 0, reserve: 2_000};
const line: PurchaseLine = {id: "weapons/amp-9", quantity: 2, unit: "item", unitPrice: 12.35, frequency: "repeat"};

describe("tool workflow calculations", () => {
  it("counts the first purchase and then replacements, protecting reserve", () => {
    expect(calculatePurchases(10000, 2000, 3000, 0)).toEqual({spent: 3000, remaining: 7000, reserveMet: true, purchases: 2, replacements: 1});
    expect(calculatePurchases(10000, 2000, 3000, 3000)).toMatchObject({spent: 6000, remaining: 4000, purchases: 1, replacements: 0});
    expect(calculatePurchases(1000, 2000, 3000, 0)).toMatchObject({purchases: 0, replacements: 0, reserveMet: false});
  });
  it("handles zero, unknown and fractional prices without Infinity or rounding loss", () => {
    expect(calculatePurchases(10000, 2000, 0, 0)?.purchases).toBeNull();
    expect(calculatePurchases(100, 50, 0, 101)?.purchases).toBe(0);
    expect(calculatePurchases(100, 0, null, 0)).toBeNull();
    expect(calculatePurchases(0.3, 0, 0.1, 0)?.purchases).toBe(3);
    expect(calculatePurchases(Infinity, 0, 1, 0)).toBeNull();
  });
  it("separates recurring and one-time item costs", () => {
    expect(totalPurchases([line, {...line, id: "gear/test", frequency: "once"}], [line.id, "gear/test"]))
      .toEqual({repeat: 24.7, once: 24.7, unknown: 0, complete: true});
  });
  it.each([{unitPrice: null}, {unit: "unknown" as const}, {id: "removed"}])("blocks incomplete totals: %j", (patch) => {
    expect(totalPurchases([{...line, ...patch}], [line.id])).toMatchObject({complete: false, unknown: 1});
  });
  it("counts supplies and remaining trips with explicit units", () => {
    const plan = {...emptySupplyPlan, resource: "build supplies", demand: 250, capacity: 100};
    expect(calculateSupplyPlan(plan)).toMatchObject({demand: 250, remaining: 250, trips: 3});
    expect(calculateSupplyPlan({...plan, stock: 60})).toMatchObject({remaining: 190, trips: 2});
    expect(calculateSupplyPlan({...plan, stock: 300})).toMatchObject({remaining: 0, trips: 0});
  });
  it("does not infer absent demand, units, prices or capacity", () => {
    expect(calculateSupplyPlan(emptySupplyPlan).trips).toBeNull();
    expect(calculateSupplyPlan({...emptySupplyPlan, demand: 250, capacity: 100}).trips).toBeNull();
    for (const capacity of [null, 0]) expect(calculateSupplyPlan({...emptySupplyPlan, demand: 250, capacity, resource: "supplies"}).trips).toBeNull();
    expect(calculateSupplyPlan({...emptySupplyPlan, resource: "supplies", capacity: 100, lines: [{name: "FOB", stage: "construction", quantity: 1, supplies: null}]}).demand).toBeNull();
  });
  it("adds construction pieces to additional demand without treating cash as supplies", () => {
    expect(calculateSupplyPlan({...emptySupplyPlan, resource: "custom resource", demand: 10, capacity: 100, lines: [{name: "User FOB", stage: "construction", quantity: 3, supplies: 80}]}))
      .toMatchObject({manifest: 240, demand: 250, trips: 3});
  });
});

describe("versioned tool shares", () => {
  it("reads old budgets unchanged and preserves saved custom prices in new shares", () => {
    expect(decodeBudgetState("cash=10000&loadout=3000&vehicle=0&reserve=2000")).toEqual(oldBudget);
    const state = {...oldBudget, once: 123.45, mode: "items" as const, lines: [line]};
    const encoded = encodeBudgetState(state, "old-catalogue");
    expect(decodeBudgetState(encoded)).toEqual(state);
    expect(inspectToolState(encoded, "new-catalogue").status).toBe("changed");
    expect(new URLSearchParams(encoded).get("createdAt")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
  it("retains deleted item IDs so they cannot disappear from totals", () => {
    const state = {...oldBudget, mode: "items" as const, lines: [{...line, id: "deleted/item"}]};
    const decoded = decodeBudgetState(encodeBudgetState(state));
    expect(decoded?.lines?.[0].id).toBe("deleted/item");
    expect(totalPurchases(decoded!.lines!, [line.id]).complete).toBe(false);
  });
  it("rejects malformed, duplicated, oversized and unsupported plans", () => {
    const base = "cash=10000&loadout=3000&vehicle=0&reserve=2000";
    for (const suffix of ["&cash=1", "&mode=items", "&lines=garbage", "&once=-1", "&once=1.234", "&schema=999&dataVersion=x"]) expect(decodeBudgetState(base + suffix)).toBeNull();
    expect(decodeBudgetState(encodeBudgetState({...oldBudget, lines: [line, line]}))).toBeNull();
    expect(decodeBudgetState(encodeBudgetState({...oldBudget, lines: [{...line, quantity: 0}]}))).toBeNull();
    expect(decodeBudgetState(encodeBudgetState({...oldBudget, lines: Array.from({length: 51}, (_, index) => ({...line, id: `item/${index}`}))}))).toBeNull();
    expect(decodeBudgetState(base + "&padding=" + "a".repeat(33_000))).toBeNull();
  });
  it("preserves supply quantities and old stage-only links", () => {
    const stages = ["construction", "transport"];
    expect(decodeLogisticsPlanState("lp_stages=transport,construction", stages)).toEqual({stages: ["transport", "construction"]});
    const state = {stages, supplies: {...emptySupplyPlan, resource: "supply", demand: 250, capacity: 100}};
    expect(decodeLogisticsPlanState(encodeLogisticsPlanState(state), stages)).toEqual(state);
    expect(decodeLogisticsPlanState("lp_stages=none&lp_supplies=garbage", stages)).toEqual({stages: []});
  });
  it("roundtrips shareable multilingual plans and blocks oversized encoded URLs", () => {
    const stages = ["construction", "transport"];
    const plan = {...emptySupplyPlan, resource: "物资", capacity: 100, lines: Array.from({length: 40}, () => ({name: "界".repeat(100), quantity: 1, supplies: 10, stage: "construction"}))};
    expect(supplyPlanSchema.safeParse(plan).success).toBe(true);
    expect(isToolShareWithinLimit(encodeLogisticsPlanState({stages, supplies: plan}))).toBe(false);
    const state = {stages, supplies: {...plan, lines: plan.lines.slice(0, 5)}};
    const encoded = encodeLogisticsPlanState(state);
    expect(isToolShareWithinLimit(encoded)).toBe(true);
    expect(decodeLogisticsPlanState(encoded, stages)).toEqual(state);
    expect(isToolShareWithinLimit("a".repeat(maximumToolShareLength))).toBe(true);
    expect(isToolShareWithinLimit("a".repeat(maximumToolShareLength + 1))).toBe(false);
  });
  it("preserves the difference filter and exposes legacy and future versions", () => {
    const state = {left: "amp-9", right: "deagle", differences: true};
    expect(decodeWeaponCompareState(encodeWeaponCompareState(state), ["amp-9", "deagle"])).toEqual(state);
    expect(inspectToolState("left=amp-9").status).toBe("legacy");
    expect(inspectToolState("schema=999&dataVersion=x").status).toBe("unsupported");
    expect(dataFingerprint({price: 1})).not.toBe(dataFingerprint({price: 2}));
  });
});

describe("catalogue reuse and usable UI", () => {
  it("uses existing catalogue and exact ammunition evidence without inferred compatibility", () => {
    const catalogue = getLoadoutCatalogue("en");
    expect(catalogue.items.some(({id}) => id === "weapons/amp-9")).toBe(true);
    expect(catalogue.items.every((item) => !("unitPrice" in item))).toBe(true);
    expect(catalogue.relationships).toEqual(getAmmoMatcherDataset("en").relationships);
    expect(catalogue.items.find(({id}) => id === "weapons/a-91")?.priceReference).toBeNull();
  });
  it("requires explicit pair evidence, preserving historical state", () => {
    const relationships = getAmmoMatcherDataset("en").relationships;
    expect(findPurchaseAmmoRelationship(relationships, "weapons/amp-9", "ammo/9x19mm")).toMatchObject({state: "historical"});
    expect(findPurchaseAmmoRelationship(relationships, "weapons/amp-9", "ammo/50-ae")).toBeNull();
    expect(findPurchaseAmmoRelationship(relationships, "weapons/amp-9", "attachments/9x19mm")).toBeNull();
  });
  it("flags repaired selections so deleted IDs are not silently replaced", () => {
    expect(hasInvalidSelection("left=deleted", "left", ["amp-9"])).toBe(true);
    expect(hasInvalidSelection("left=amp-9&left=amp-9", "left", ["amp-9"])).toBe(true);
    expect(hasInvalidSelection("left=amp-9", "left", ["amp-9"])).toBe(false);
  });
  it("filters comparison by text and type and keeps evidence differences", () => {
    const weapons = getComparableWeapons();
    expect(searchComparableWeapons(weapons, "DEAGLE").map(({slug}) => slug)).toEqual(["deagle"]);
    expect(searchComparableWeapons(weapons, "nonexistent")).toEqual([]);
    const row = compareWeapons("amp-9", "deagle")!.rows[0];
    expect(comparisonRowDiffers({...row, right: {...row.left}})).toBe(false);
    expect(comparisonRowDiffers({...row, right: {...row.left, state: "unknown"}})).toBe(true);
  });
  it.each(["en", "de", "ru", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const)("renders localized editors in %s", (locale) => {
    const copy = getToolCopy(locale);
    expect(Object.values(getWorkflowCopy(locale)).every((value) => value.trim().length > 0)).toBe(true);
    const wrapper = LoadoutBudget({copy});
    expect(wrapper.type).toBe(LoadoutBudgetEditor);
    const html = renderToStaticMarkup(wrapper);
    expect(html).toContain(getWorkflowCopy(locale).purchases);
    expect(html).not.toContain("NaN");
    const supply = renderToStaticMarkup(<SupplyManifest copy={copy} stages={getLogisticsStages(locale)} plan={emptySupplyPlan} onChange={() => undefined} />);
    expect(supply).toContain(getWorkflowCopy(locale).manifest);
  });
  it("uses full native tool copy for both newly promoted locales", () => {
    expect(resolveToolLocale("zh-tw")).toBe("zh-tw");
    expect(resolveToolLocale("pl")).toBe("pl");
    expect(getWorkflowCopy("pl").purchases).not.toBe(getWorkflowCopy("en").purchases);
    expect(getWorkflowCopy("zh-tw").purchases).not.toBe(getWorkflowCopy("zh-cn").purchases);
  });
  it("discloses changed data rather than silently rewriting a plan", () => {
    const html = renderToStaticMarkup(<ToolShareNotice locale="zh-cn" search={encodeBudgetState(oldBudget, "old")} dataVersion="new" />);
    expect(html).toContain(getWorkflowCopy("zh-cn").changed);
  });
});
