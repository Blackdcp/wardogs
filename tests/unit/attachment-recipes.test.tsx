import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {locales} from "@/config/site";
import {AttachmentRecipePanel} from "@/components/tools/attachment-recipe-panel";
import {getLoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import {attachmentRecipes, applyAttachmentRecipe, getCreatorAttachmentRecords} from "@/features/tools/attachment-recipes";
import {getAttachmentRecipeCopy} from "@/features/tools/attachment-recipe-copy";
import {attachmentObservationSchema, emptyAttachmentObservation, updateAttachmentObservation} from "@/features/tools/attachment-observation";
import {decodeBudgetState, encodeBudgetState, type BudgetState} from "@/features/tools/share-state";
import {checkLoadoutFit, readSavedLoadouts, restoreSavedLoadout, totalLoadoutWeight} from "@/features/tools/loadout-workbench";
import {maximumPlanLines, totalPurchases} from "@/features/tools/workflow-state";

const catalogue = getLoadoutCatalogue("en");
const base: BudgetState = {cash: 4000, loadout: 2000, reserve: 1000, vehicle: 0};

describe("creator attachment recipes and observation records", () => {
  it("shares and restores an explicitly named custom LMG setup without creating a creator recommendation", () => {
    const observation = {...emptyAttachmentObservation("custom"), weapon: "M249 SAW", grip: "TDG", muzzle: "Top Comp", rangeMeters: 40, bipod: "mounted" as const, adsMilliseconds: 240};
    const state = {...base, buildLabel: "Observed build A", attachmentTest: observation};
    const query = encodeBudgetState(state);
    expect(decodeBudgetState(query)).toEqual(state);
    const saved = readSavedLoadouts(JSON.stringify([{id: "lmg-a", name: "LMG A", query, savedAt: "2026-10-09T01:00:00Z"}]));
    expect(saved).toHaveLength(1);
    expect(restoreSavedLoadout(saved[0])).toEqual(state);
    expect(state).not.toHaveProperty("lines");
    expect(updateAttachmentObservation(observation, {grip: "none"}).adsMilliseconds).toBeNull();
    expect(updateAttachmentObservation(observation, {muzzle: "none"}).adsMilliseconds).toBeNull();
    expect(updateAttachmentObservation(observation, {weapon: "PKM"}).adsMilliseconds).toBeNull();
    expect(updateAttachmentObservation(observation, {notes: "Repeated three times"}).adsMilliseconds).toBe(240);
  });
  it("rejects a custom measurement with no weapon or oversized identity, retaining legacy recipe records", () => {
    const missingWeapon = {...emptyAttachmentObservation("custom"), weapon: "  ", adsMilliseconds: 240};
    expect(attachmentObservationSchema.safeParse(missingWeapon).success).toBe(false);
    expect(decodeBudgetState(encodeBudgetState({...base, attachmentTest: missingWeapon}))).toBeNull();
    expect(attachmentObservationSchema.safeParse({...emptyAttachmentObservation("custom"), weapon: "A".repeat(81)}).success).toBe(false);
    const legacy = {...emptyAttachmentObservation("evo-m4-control"), adsMilliseconds: 180};
    delete legacy.weapon;
    delete legacy.grip;
    delete legacy.muzzle;
    expect(decodeBudgetState(encodeBudgetState({...base, attachmentTest: legacy}))?.attachmentTest).toEqual(legacy);
    const changed = updateAttachmentObservation({...emptyAttachmentObservation("evo-m4-control"), adsMilliseconds: 180}, {grip: "another grip"});
    expect(changed).toMatchObject({recipeId: "custom", weapon: "M4", adsMilliseconds: null});
  });
  it.each(attachmentRecipes)("adds $id as explicit unknown purchases and fit", (recipe) => {
    const result = applyAttachmentRecipe(base, recipe.id, catalogue);
    expect(result.status).toBe("applied");
    expect(result.state.attachmentTest).toEqual(emptyAttachmentObservation(recipe.id));
    expect(result.state.lines?.every((line) => line.unitPrice === null && line.unitWeight === null && line.unit === "unknown")).toBe(true);
    const lines = result.state.lines!;
    for (const line of lines.filter(({id}) => id.startsWith("attachments/"))) expect(checkLoadoutFit(line, lines, catalogue)).toBe("unknown");
    expect(totalPurchases(lines, catalogue.items.map(({id}) => id)).complete).toBe(false);
    expect(totalLoadoutWeight(lines, catalogue.items.map(({id}) => id)).complete).toBe(false);
    expect(decodeBudgetState(encodeBudgetState(result.state, catalogue.dataVersion))).toEqual(result.state);
    if (recipe.weapon === "m4") expect(lines.some(({id}) => id.includes("magazine"))).toBe(false);
  });
  it("preserves existing purchases and budgets; recipe changes reset measurement conditions", () => {
    const existing: BudgetState = {...base, lines: [{id: "weapons/m4", quantity: 2, unit: "item", unitPrice: 2300, frequency: "repeat"}]};
    const first = applyAttachmentRecipe(existing, "evo-m4-control", catalogue).state;
    expect(first.lines?.[0]).toEqual(existing.lines?.[0]);
    expect(first.cash).toBe(base.cash);
    expect(first.reserve).toBe(base.reserve);
    const measured = {...first, attachmentTest: {...first.attachmentTest!, adsMilliseconds: 180, notes: "three runs"}};
    expect(applyAttachmentRecipe(measured, "evo-m4-control", catalogue).state).toEqual(measured);
    const second = applyAttachmentRecipe(measured, "evo-ak74-suppressed", catalogue).state;
    expect(second.lines?.slice(0, first.lines?.length)).toEqual(first.lines);
    expect(second.attachmentTest).toEqual(emptyAttachmentObservation("evo-ak74-suppressed"));
  });
  it("rejects unavailable recipes and plan overflow without truncating previous purchases", () => {
    expect(applyAttachmentRecipe(base, "evo-m4-control", {...catalogue, items: catalogue.items.filter(({id}) => id !== "weapons/m4")})).toEqual({status: "unavailable", state: base});
    const full: BudgetState = {...base, lines: Array.from({length: maximumPlanLines}, (_, index) => ({id: `saved/${index}`, quantity: 1, unit: "unknown", unitPrice: null, frequency: "repeat"}))};
    expect(applyAttachmentRecipe(full, "evo-m4-control", catalogue)).toEqual({status: "limit", state: full});
  });
  it("never silently reassigns an existing attachment to another weapon", () => {
    const m4 = applyAttachmentRecipe(base, "evo-m4-control", catalogue).state;
    expect(applyAttachmentRecipe(m4, "evo-ak74-control", catalogue)).toEqual({status: "conflict", state: m4});
    const unpaired: BudgetState = {...base, lines: [{id: "attachments/creator-rvg", quantity: 2, unit: "item", unitPrice: 20, unitWeight: 0.1, frequency: "repeat"}]};
    const next = applyAttachmentRecipe(unpaired, "evo-m4-control", catalogue).state;
    expect(next.lines?.[0]).toEqual({...unpaired.lines![0], pairedWeapon: "weapons/m4", fit: "unknown"});
  });
  it("saves and restores exact observations without applying them to weapon damage or inferred cost", () => {
    const state = applyAttachmentRecipe(base, "evo-ak74-control", catalogue).state;
    state.attachmentTest = {...state.attachmentTest!, rangeMeters: 40, optic: "recorded optic", ammo: "recorded ammunition", stance: "crouched", bipod: "stowed", magazineRounds: 30, adsMilliseconds: 250, notes: "3 runs · comparison only"};
    const query = encodeBudgetState(state, catalogue.dataVersion);
    const saved = {id: "attachment-test", name: "AK74 observation", query, savedAt: "2026-10-09T00:00:00Z"};
    expect(readSavedLoadouts(JSON.stringify([saved]))).toEqual([saved]);
    expect(restoreSavedLoadout(saved)).toEqual(state);
    expect(state).not.toHaveProperty("scenario");
    for (const patch of [{rangeMeters: -1}, {adsMilliseconds: -1}, {notes: "x".repeat(401)}, {recipeId: "invented"}]) {
      const params = new URLSearchParams(query);
      params.set("attachmentTest", JSON.stringify({...state.attachmentTest, ...patch}));
      expect(decodeBudgetState(params.toString())).toBeNull();
    }
  });
  it("clears ADS measurement whenever conditions change, preserving it for notes or an unchanged value", () => {
    const current = {...emptyAttachmentObservation("evo-m4-control"), adsMilliseconds: 170};
    for (const patch of [{rangeMeters: 40}, {optic: "2x"}, {ammo: "FMJ"}, {stance: "crouched" as const}, {bipod: "mounted" as const}, {magazineRounds: 30}, {recipeId: "evo-ak74-control" as const}]) expect(updateAttachmentObservation(current, patch).adsMilliseconds).toBeNull();
    expect(updateAttachmentObservation(current, {notes: "method"}).adsMilliseconds).toBe(170);
    expect(updateAttachmentObservation(current, {rangeMeters: null}).adsMilliseconds).toBe(170);
  });
  it.each(locales)("renders localized records and bounded masked fields in %s", (locale) => {
    const localized = getLoadoutCatalogue(locale);
    expect(localized.dataVersion).toBe(catalogue.dataVersion);
    const t = getAttachmentRecipeCopy(locale);
    const state = applyAttachmentRecipe(base, "evo-m4-control", localized).state;
    const html = renderToStaticMarkup(<AttachmentRecipePanel locale={locale} state={state} catalogue={localized} onChange={() => {}} />);
    for (const label of [t.title, t.note, t.observation, t.range, t.optic, t.ammo, t.stance, t.bipod, t.magazine, t.ads, t.notes, t.clear]) expect(html).toContain(label.replaceAll("&", "&amp;"));
    expect(html).toContain('data-clarity-mask="true"');
    expect(html).toContain('maxLength="400"');
    expect(html).toContain('maxLength="80"');
    if (locale !== "en") expect(t.title).not.toBe(getAttachmentRecipeCopy("en").title);
    for (const item of getCreatorAttachmentRecords(locale)) {
      const purchase = localized.items.find(({id}) => id === `attachments/${item.slug}`)!;
      expect(purchase.priceReference).toBeNull();
      expect(purchase.weightReference).toBeNull();
      expect(item.evidence).toMatchObject({sourceClass: "creator-current", current: false, confidence: "unverified", verifiedAt: "2026-10-09"});
      expect(item.evidence.sourceUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=kC3P-klWNxk&t=\d+s$/);
      expect(item).not.toHaveProperty("damageMultiplier");
    }
  });
});
