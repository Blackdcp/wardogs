import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {existsSync} from "node:fs";
import path from "node:path";
import {describe, expect, it, vi, afterEach} from "vitest";
import {locales} from "../../src/config/site";
import {LoadoutPresetList} from "../../src/components/tools/loadout-preset-list";
import {LoadoutBudgetEditor} from "../../src/components/tools/loadout-budget-editor";
import {getLoadoutCatalogue} from "../../src/features/tools/loadout-catalogue";
import {appendLoadoutPreset, createLoadoutPresetState, getLoadoutPresetCopy, getLoadoutPresetHref, getLoadoutPresets, getMatchingLoadoutPresets, loadoutPresetIds} from "../../src/features/tools/loadout-presets";
import {decodeBudgetState, encodeBudgetState, type BudgetState} from "../../src/features/tools/share-state";
import {getToolCopy} from "../../src/features/tools/tool-copy";
import {calculatePurchases, inspectToolState, isToolShareWithinLimit, maximumPlanLines, purchaseLinesSchema, totalPurchases, type PurchaseLine} from "../../src/features/tools/workflow-state";

afterEach(() => {vi.unstubAllEnvs(); vi.useRealTimers();});

function containsText(html: string, value: string) {
  const escaped = renderToStaticMarkup(createElement("span", null, value)).slice(6, -7);
  expect(html.includes(escaped)).toBe(true);
}

describe("four localized, shareable preparation lists", () => {
  it.each(locales)("uses real catalogue IDs, approved images and unknown procurement values in %s", (locale) => {
    const catalogue = getLoadoutCatalogue(locale);
    const items = new Map(catalogue.items.map((item) => [item.id, item]));
    const presets = getLoadoutPresets(locale);
    expect(presets.map(({id}) => id)).toEqual(loadoutPresetIds);
    for (const preset of presets) {
      expect(purchaseLinesSchema.safeParse(preset.lines).success).toBe(true);
      expect(preset.lines.length).toBeGreaterThan(0);
      expect(preset.title.trim().length).toBeGreaterThan(2);
      expect([preset.mission, preset.unlock, preset.compatibility].every((value) => value.trim().length > 15)).toBe(true);
      expect(preset.lines.every(({id, quantity, unit, unitPrice, frequency}) => items.has(id) && quantity === 1 && unit === "unknown" && unitPrice === null && frequency === "repeat")).toBe(true);
      const images = preset.lines.map(({id}) => items.get(id)?.image).filter((image): image is string => Boolean(image));
      expect(images.length).toBeGreaterThan(0);
      for (const image of images) expect(existsSync(path.join(process.cwd(), "public", image))).toBe(true);
      const totals = totalPurchases(preset.lines, [...items.keys()]);
      expect(totals).toMatchObject({unknown: preset.lines.length, complete: false});
      expect(calculatePurchases(10_000, 2_000, totals.complete ? totals.repeat : null, totals.once)).toBeNull();
    }
  });

  it.each(locales)("opens all four cases using the current items protocol in %s", (locale) => {
    const catalogue = getLoadoutCatalogue(locale);
    for (const preset of getLoadoutPresets(locale)) {
      const href = getLoadoutPresetHref(preset, locale, catalogue.dataVersion);
      const url = new URL(href, "https://example.test");
      expect(url.pathname).toBe(`/${locale}/tools/loadout-budget`);
      expect(url.searchParams.has("pick")).toBe(false);
      expect(isToolShareWithinLimit(url.search)).toBe(true);
      expect(inspectToolState(url.search, catalogue.dataVersion).status).toBe("current");
      expect(decodeBudgetState(url.search)).toEqual(createLoadoutPresetState(preset));
      expect(decodeBudgetState(url.search)).toMatchObject({mode: "items", cash: 0, reserve: 0, loadout: 0, vehicle: 0, once: 0});
    }
  });

  it("uses the existing static-export and base-path URL helper", () => {
    vi.stubEnv("GITHUB_PAGES", "true");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wiki");
    const preset = getLoadoutPresets("pl")[0];
    const url = new URL(getLoadoutPresetHref(preset, "pl", "catalogue-snapshot"), "https://example.test");
    expect(url.pathname).toBe("/wiki/pl/tools/loadout-budget/");
    expect(decodeBudgetState(url.search)).toEqual(createLoadoutPresetState(preset));
  });

  it("does not relabel source evidence as the date the plan link was created", () => {
    const catalogue = getLoadoutCatalogue("en");
    const evidence = catalogue.items.map(({id, evidence}) => ({id, evidence: {...evidence}}));
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-01-02T03:04:05Z"));
    const href = getLoadoutPresetHref(getLoadoutPresets("en")[0], "en", catalogue.dataVersion);
    expect(new URL(href, "https://example.test").searchParams.get("createdAt")).toBe("2030-01-02T03:04:05.000Z");
    expect(catalogue.items.map(({id, evidence}) => ({id, evidence}))).toEqual(evidence);
  });

  it.each(locales)("renders the inline links, real images and all boundaries in %s", (locale) => {
    const t = getLoadoutPresetCopy(locale);
    expect(Object.values(t).filter((value) => typeof value === "string").every((value) => value.trim().length > 0)).toBe(true);
    const html = renderToStaticMarkup(createElement(LoadoutPresetList, {locale}));
    expect(html.match(/data-loadout-preset=/g)).toHaveLength(4);
    expect(html.match(/href="[^"]*\/tools\/loadout-budget/g)).toHaveLength(7);
    expect(html.match(/#attachment-tests/g)).toHaveLength(3);
    expect(html).toContain("mode=items");
    expect(html).toContain("unitPrice%22%3Anull");
    expect(decodeURIComponent(html).includes("/images/catalogue/")).toBe(true);
    containsText(html, t.notice);
    containsText(html, t.quantities);
    containsText(html, t.budgets);
    for (const preset of getLoadoutPresets(locale)) {
      containsText(html, preset.mission);
      containsText(html, preset.compatibility);
      containsText(html, preset.unlock);
    }
  });
});

describe("non-destructive template application", () => {
  const catalogue = getLoadoutCatalogue("en");
  const preset = getLoadoutPresets("en")[0];
  const customLine: PurchaseLine = {id: preset.lines[0].id, quantity: 7, unit: "item", unitPrice: 123.45, frequency: "once"};
  const deleted: PurchaseLine = {id: "deleted/user-choice", quantity: 2, unit: "pack", unitPrice: null, frequency: "repeat"};
  const existing: BudgetState = {cash: 9_876.54, reserve: 234.56, loadout: 123.45, vehicle: 99.99, once: 10.01, mode: "total", lines: [customLine, deleted]};

  it("appends only missing IDs and keeps user amounts, prices, units, frequencies and deleted entries", () => {
    const before = structuredClone(existing);
    const result = appendLoadoutPreset(existing, preset, catalogue);
    expect(result.status).toBe("applied");
    expect({...result.state, lines: existing.lines}).toEqual({...existing, mode: "items"});
    expect(result.state.lines?.slice(0, 2)).toEqual([customLine, deleted]);
    expect(result.state.lines?.filter(({id}) => id === customLine.id)).toHaveLength(1);
    expect(result.state.lines?.slice(2)).toEqual(preset.lines.slice(1));
    expect(existing).toEqual(before);
    expect(preset.lines[0].unitPrice).toBeNull();
    expect(purchaseLinesSchema.safeParse(result.state.lines).success).toBe(true);
    expect(decodeBudgetState(encodeBudgetState(result.state, catalogue.dataVersion))).toEqual(result.state);
  });

  it("applies to an empty plan without replacing budget fields or inserting historical prices", () => {
    const empty = {...existing, lines: []};
    const result = appendLoadoutPreset(empty, preset, catalogue);
    expect(result.status).toBe("applied");
    expect(result.state).toEqual({...empty, mode: "items", lines: preset.lines});
    expect(result.state.lines?.every(({unitPrice, unit}) => unitPrice === null && unit === "unknown")).toBe(true);
  });

  it("is idempotent and does not increase quantities on repeated application", () => {
    const first = appendLoadoutPreset(existing, preset, catalogue).state;
    const second = appendLoadoutPreset(first, preset, catalogue);
    expect(second.status).toBe("unchanged");
    expect(second.state).toBe(first);
    expect(second.state.lines?.[0]).toEqual(customLine);
  });

  it("can switch a saved complete list from total mode without clearing its inputs", () => {
    const state: BudgetState = {...existing, lines: preset.lines};
    expect(appendLoadoutPreset(state, preset, catalogue)).toEqual({status: "applied", state: {...state, mode: "items"}});
  });

  it("rejects over-limit additions atomically, including encoded URL limits", () => {
    const makeLine = (id: string): PurchaseLine => ({...customLine, id});
    const state = {...existing, lines: Array.from({length: maximumPlanLines - 1}, (_, index) => makeLine(`user/${index}`))};
    const result = appendLoadoutPreset(state, preset, catalogue);
    expect(result).toEqual({status: "limit", state});
    expect(result.state).toBe(state);
    const long = {...existing, lines: Array.from({length: 25}, (_, index) => makeLine(`${index}${"x".repeat(155)}`))};
    expect(purchaseLinesSchema.safeParse(long.lines).success).toBe(true);
    expect(appendLoadoutPreset(long, preset, catalogue)).toEqual({status: "limit", state: long});
  });

  it("does not silently remove a template item missing from the live catalogue", () => {
    const reduced = {...catalogue, items: catalogue.items.filter(({id}) => id !== preset.lines[0].id)};
    const result = appendLoadoutPreset(existing, preset, reduced);
    expect(result).toEqual({status: "unavailable", state: existing});
    expect(result.state).toBe(existing);
  });

  it("restores template boundaries from item IDs, even with custom prices and multiple appended missions", () => {
    const presets = getLoadoutPresets("en");
    let state: BudgetState = {...existing, lines: []};
    for (const preset of presets) state = appendLoadoutPreset(state, preset, catalogue).state;
    state.lines![0] = {...state.lines![0], unitPrice: 456.78, unit: "item", quantity: 3};
    const restored = decodeBudgetState(encodeBudgetState(state, catalogue.dataVersion))!;
    expect(getMatchingLoadoutPresets(restored.lines!, presets).map(({id}) => id)).toEqual(loadoutPresetIds);
    expect(new Set(restored.lines!.map(({id}) => id)).size).toBe(restored.lines!.length);
    expect(restored.lines![0]).toMatchObject({unitPrice: 456.78, quantity: 3});
    expect(getMatchingLoadoutPresets([], presets)).toEqual([]);
  });

  it("returns independent editable arrays without mutating template defaults", () => {
    const state = createLoadoutPresetState(preset);
    state.lines![0].quantity = 999;
    expect(preset.lines[0].quantity).toBe(1);
    expect(getLoadoutPresets("en")[0].lines[0].quantity).toBe(1);
  });

  it.each(locales)("renders a visible, localized, non-destructive template control in %s", (locale) => {
    const t = getLoadoutPresetCopy(locale);
    const html = renderToStaticMarkup(createElement(LoadoutBudgetEditor, {copy: getToolCopy(locale), catalogue: getLoadoutCatalogue(locale)}));
    containsText(html, t.choose);
    containsText(html, t.apply);
    containsText(html, t.append);
    containsText(html, t.notice);
    containsText(html, t.quantities);
    for (const id of loadoutPresetIds) expect(html).toContain(`value="${id}"`);
    expect(html).toContain("disabled");
  });
});
