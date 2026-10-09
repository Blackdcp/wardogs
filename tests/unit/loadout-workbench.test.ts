import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {getLoadoutCatalogue} from "../../src/features/tools/loadout-catalogue";
import {checkLoadoutFit, readSavedLoadouts, restoreSavedLoadout, totalLoadoutWeight} from "../../src/features/tools/loadout-workbench";
import {decodeBudgetState, encodeBudgetState, type BudgetState} from "../../src/features/tools/share-state";
import type {PurchaseLine} from "../../src/features/tools/workflow-state";
import {LoadoutChecksSummary, LoadoutLineChecks, SavedLoadouts} from "../../src/components/tools/loadout-workbench";
import {CombatScenarioPanel} from "../../src/components/tools/combat-scenario-panel";
import {emptyCombatScenario} from "../../src/features/tools/combat-scenario";
import {locales} from "../../src/config/site";
import {getWorkbenchCopy} from "../../src/features/tools/workbench-copy";

const catalogue = getLoadoutCatalogue("en");
const weapon: PurchaseLine = {id: "weapons/amp-9", quantity: 1, unit: "item", unitPrice: 100, unitWeight: 1.4, frequency: "repeat"};
const ammo: PurchaseLine = {id: "ammo/9x19mm", quantity: 3, unit: "pack", unitPrice: 5, unitWeight: 0.03, frequency: "repeat", pairedWeapon: weapon.id};
const attachment: PurchaseLine = {id: "attachments/four-reticle-reflex", quantity: 1, unit: "item", unitPrice: null, frequency: "repeat", pairedWeapon: weapon.id, fit: "confirmed"};

describe("loadout completeness and pairing", () => {
  it("sums entered purchase weights without floating point drift or pretending missing weights are zero", () => {
    const ids = catalogue.items.map(({id}) => id);
    expect(totalLoadoutWeight([weapon, ammo], ids)).toEqual({kilograms: 1.49, unknown: 0, complete: true});
    expect(totalLoadoutWeight([weapon, ammo, attachment], ids)).toEqual({kilograms: 1.49, unknown: 1, complete: false});
    expect(totalLoadoutWeight([{...weapon, unit: "unknown"}], ids)).toEqual({kilograms: 0, unknown: 1, complete: false});
    expect(totalLoadoutWeight([{...weapon, id: "removed"}], ids).complete).toBe(false);
    expect(totalLoadoutWeight([], ids).complete).toBe(false);
  });
  it("distinguishes historical matches, mismatches, absence and user observations", () => {
    expect(checkLoadoutFit(ammo, [weapon, ammo], catalogue)).toBe("historical-match");
    expect(checkLoadoutFit({...ammo, id: "ammo/50-ae"}, [weapon], catalogue)).toBe("historical-mismatch");
    expect(checkLoadoutFit({...ammo, id: "ammo/not-recorded"}, [weapon], catalogue)).toBe("unknown");
    expect(checkLoadoutFit({...ammo, pairedWeapon: undefined}, [weapon], catalogue)).toBe("unpaired");
    expect(checkLoadoutFit(ammo, [ammo], catalogue)).toBe("missing-weapon");
    expect(checkLoadoutFit(attachment, [weapon, attachment], catalogue)).toBe("user-confirmed");
    expect(checkLoadoutFit({...attachment, fit: "incompatible"}, [weapon], catalogue)).toBe("user-incompatible");
    expect(checkLoadoutFit({...attachment, fit: undefined}, [weapon], catalogue)).toBe("unknown");
    expect(checkLoadoutFit({...attachment, pairedWeapon: "weapons/deleted"}, [{...weapon, id: "weapons/deleted"}], catalogue)).toBe("missing-weapon");
    const ammoRecord = catalogue.items.find(({id}) => id === ammo.id)!;
    const variants = {...catalogue, items: [...catalogue.items,
      {...ammoRecord, id: "ammo/9mm-ap", calibreKey: "9x19mm"},
      {...ammoRecord, id: "ammo/unknown-load", calibreKey: null},
    ]};
    expect(checkLoadoutFit({...ammo, id: "ammo/9mm-ap"}, [weapon], variants)).toBe("unknown");
    expect(checkLoadoutFit({...ammo, id: "ammo/unknown-load"}, [weapon], variants)).toBe("unknown");
  });
  it("preserves weight, paired weapon and attachment observations in saved and shared plans", () => {
    const state: BudgetState = {cash: 1000, reserve: 200, loadout: 0, vehicle: 0, mode: "items", lines: [weapon, ammo, attachment], buildLabel: "My test 2026-10-09"};
    const query = encodeBudgetState(state, catalogue.dataVersion);
    expect(decodeBudgetState(query)).toEqual(state);
    const entry = {id: "test", name: "My kit", query, savedAt: "2026-10-09T00:00:00Z"};
    expect(readSavedLoadouts(JSON.stringify([entry]))).toEqual([entry]);
    expect(restoreSavedLoadout(entry)).toEqual(state);
    expect(readSavedLoadouts(JSON.stringify([entry, {...entry, query: "bad"}, {...entry, name: ""}]))).toEqual([entry]);
    expect(readSavedLoadouts("not JSON")).toEqual([]);
    expect(readSavedLoadouts(JSON.stringify(Array(20).fill(entry)))).toHaveLength(12);
  });
  it.each(locales)("renders the added panels with localized labels in %s", (locale) => {
    const localized = getLoadoutCatalogue(locale);
    const t = getWorkbenchCopy(locale);
    const html = renderToStaticMarkup(createElement("div", null,
      createElement(LoadoutChecksSummary, {locale, lines: [weapon, ammo], catalogue: localized}),
      createElement(LoadoutLineChecks, {locale, line: attachment, lines: [weapon, attachment], catalogue: localized, onChange: () => {}}),
      createElement(SavedLoadouts, {locale, query: "", dataVersion: "test", disabled: false, onRestore: () => {}}),
      createElement(CombatScenarioPanel, {locale, value: emptyCombatScenario, names: {left: "AMP-9", right: "Deagle"}, onChange: () => {}}),
    ));
    for (const label of [t.scenario, t.kit, t.name, t.weight, t.pair, t.fit]) expect(html).toContain(label);
    expect(html).toContain('data-clarity-mask="true"');
  });
});
