import {describe, expect, it} from "vitest";
import {calculateCombatScenario, changeCombatBuild, changeCombatContext, emptyCombatScenario, type CombatScenario} from "../../src/features/tools/combat-scenario";
import {decodeWeaponCompareState, encodeWeaponCompareState} from "../../src/features/tools/share-state";
import {locales} from "../../src/config/site";
import {getWorkbenchCopy} from "../../src/features/tools/workbench-copy";

const scenario: CombatScenario = {...emptyCombatScenario, health: 100, left: {load: "Test FMJ", damage: 26, rpm: 600}, right: {load: "Test AP", damage: 50, rpm: 300}};

describe("measured combat scenarios", () => {
  it("calculates the first hit at zero seconds and rounds STK upward", () => {
    expect(calculateCombatScenario(scenario, "left")).toEqual({status: "estimated", shots: 4, seconds: 0.3});
    expect(calculateCombatScenario(scenario, "right")).toEqual({status: "estimated", shots: 2, seconds: 0.2});
    expect(calculateCombatScenario({...scenario, health: 26, left: {...scenario.left, rpm: null}}, "left")).toEqual({status: "estimated", shots: 1, seconds: 0});
  });
  it("does not manufacture damage, health, ammunition identity, or fire rate", () => {
    expect(calculateCombatScenario(emptyCombatScenario, "left").status).toBe("missing");
    expect(calculateCombatScenario({...scenario, health: null}, "left").status).toBe("missing");
    expect(calculateCombatScenario({...scenario, left: {...scenario.left, load: " "}}, "left").status).toBe("missing");
    expect(calculateCombatScenario({...scenario, left: {...scenario.left, rpm: null}}, "left")).toMatchObject({shots: 4, seconds: null});
    expect(calculateCombatScenario({...scenario, left: {...scenario.left, damage: 0}}, "left")).toEqual({status: "no-damage", shots: null, seconds: null});
    expect(calculateCombatScenario({...scenario, left: {...scenario.left, damage: -5}}, "left").status).toBe("missing");
  });
  it("invalidates observed damage when range, hit zone or armor changes", () => {
    for (const change of [{range: 100}, {armor: "l4" as const}, {hitZone: "head" as const}]) {
      const next = changeCombatContext(scenario, change);
      expect(next.left.damage).toBeNull(); expect(next.right.damage).toBeNull();
      expect(next.left.rpm).toBe(600); expect(next.left.load).toBe("Test FMJ");
      expect(calculateCombatScenario(next, "left").status).toBe("missing");
    }
    expect(scenario.left.damage).toBe(26);
    expect(changeCombatContext(scenario, {range: scenario.range})).toBe(scenario);
    const newBuild = changeCombatBuild(scenario, "Different patch");
    expect(newBuild.left).toEqual({damage: null, rpm: null, load: "Test FMJ"});
    expect(newBuild.right).toEqual({damage: null, rpm: null, load: "Test AP"});
  });
  it("round-trips the entire scenario in existing comparison links and rejects malformed context", () => {
    const state = {left: "amp-9", right: "deagle", differences: true, scenario};
    const encoded = encodeWeaponCompareState(state);
    expect(decodeWeaponCompareState(encoded, ["amp-9", "deagle"])).toEqual(state);
    expect(decodeWeaponCompareState(`${encoded}&scenario={}`, ["amp-9", "deagle"]).scenario).toBeUndefined();
    expect(decodeWeaponCompareState(encoded, ["removed-weapon", "deagle"]).scenario).toBeUndefined();
    expect(decodeWeaponCompareState(`left=amp-9&right=deagle&scenario=${encodeURIComponent(JSON.stringify({...scenario, health: -1}))}`, ["amp-9", "deagle"]).scenario).toBeUndefined();
  });
  it.each(locales)("provides every workbench label in %s without English fallback", (locale) => {
    const current = getWorkbenchCopy(locale);
    expect(Object.keys(current).sort()).toEqual(Object.keys(getWorkbenchCopy("en")).sort());
    expect(Object.values(current).every((value) => value.trim().length > 0)).toBe(true);
    if (locale !== "en") expect(current.scenarioNote).not.toBe(getWorkbenchCopy("en").scenarioNote);
  });
});
