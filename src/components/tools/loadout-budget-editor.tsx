"use client";

import {ANALYTICS_EVENTS, createToolResultRecorder, trackAnalyticsEvent} from "@/lib/analytics-events";

import Image from "next/image";
import {Copy, Plus, Trash2} from "lucide-react";
import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";
import type {ToolCopy} from "@/features/tools/tool-copy";
import type {LoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import {appendLoadoutPreset, getLoadoutPresetCopy, getLoadoutPresets, getMatchingLoadoutPresets} from "@/features/tools/loadout-presets";
import {decodeBudgetState, encodeBudgetState, type BudgetState} from "@/features/tools/share-state";
import {calculatePurchases, findPurchaseAmmoRelationship, isToolShareWithinLimit, maximumPlanLines, totalPurchases, type PurchaseLine} from "@/features/tools/workflow-state";
import {getWorkflowCopy} from "@/features/tools/workflow-copy";
import {assetPath} from "@/lib/assets";
import {EvidenceProvenance} from "./evidence-provenance";
import {PlanNumber, planInputClass} from "./plan-number";
import {ToolShareNotice} from "./tool-share-notice";

const defaults: BudgetState = {cash: 10_000, loadout: 3_000, vehicle: 0, reserve: 2_000};
const emptySearch = () => "";
function subscribe(onChange: () => void) { window.addEventListener("popstate", onChange); return () => window.removeEventListener("popstate", onChange); }
const subscribeHydration = () => () => {};
const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 border border-[#397b59] px-3 py-2 text-sm font-semibold text-white enabled:hover:bg-[#244332] disabled:opacity-40";

export function LoadoutBudgetEditor({copy, catalogue}: {copy: ToolCopy; catalogue: LoadoutCatalogue}) {
  const t = getWorkflowCopy(copy.locale);
  const isHydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const search = useSyncExternalStore(subscribe, () => window.location.search, emptySearch);
  const restored = useMemo(() => decodeBudgetState(search), [search]);
  const preselected = useMemo(() => {
    const ids = new URLSearchParams(search).getAll("pick");
    return ids.length > 0 && ids.length <= maximumPlanLines ? [...new Set(ids)].map((id): PurchaseLine => ({id, quantity: 1, unit: "unknown", unitPrice: null, frequency: "repeat"})) : [];
  }, [search]);
  const [edited, setEdited] = useState<{search: string; value: BudgetState} | null>(null);
  const state: BudgetState = (edited?.search === search ? edited.value : null) ?? restored ?? (preselected.length ? {...defaults, mode: "items", lines: preselected} : defaults);
  const encodedState = encodeBudgetState(state, catalogue.dataVersion);
  const tooLarge = !isToolShareWithinLimit(encodedState);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [weapon, setWeapon] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [presetChoice, setPresetChoice] = useState<{search: string; id: string} | null>(null);
  const [presetStatus, setPresetStatus] = useState<{search: string; message: string} | null>(null);
  const lines = state.lines ?? [];
  const presetCopy = getLoadoutPresetCopy(copy.locale);
  const presets = useMemo(() => getLoadoutPresets(copy.locale), [copy.locale]);
  const matchingPresets = getMatchingLoadoutPresets(lines, presets);
  const presetId = presetChoice?.search === search ? presetChoice.id : state.mode === "items" ? matchingPresets[0]?.id ?? "" : "";
  const chosenPreset = presets.find(({id}) => id === presetId);
  const presetResult = chosenPreset ? appendLoadoutPreset(state, chosenPreset, catalogue) : null;
  const shownPresets = chosenPreset ? [chosenPreset, ...matchingPresets.filter(({id}) => id !== chosenPreset.id)] : matchingPresets;
  const itemMap = useMemo(() => new Map(catalogue.items.map((item) => [item.id, item])), [catalogue]);
  const found = catalogue.items.filter((item) => item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const totals = totalPurchases(lines, catalogue.items.map(({id}) => id));
  const itemsMode = state.mode === "items";
  const result = calculatePurchases(state.cash, state.reserve,
    itemsMode ? totals.complete && lines.length > 0 ? totals.repeat + state.vehicle : null : state.loadout + state.vehicle,
    (state.once ?? 0) + (itemsMode ? totals.once : 0));
  const selectedWeapons = lines.filter(({id}) => id.startsWith("weapons/"));
  const activeWeapon = selectedWeapons.some(({id}) => id === weapon) ? weapon : selectedWeapons[0]?.id ?? "";
  const money = (value: number) => `$${value.toLocaleString(copy.locale, {maximumFractionDigits: 2})}`;
  const resultPending = useRef(false);
  const resultRecorder = useMemo(() => createToolResultRecorder("loadout-budget", copy.locale), [copy.locale]);
  useEffect(() => {
    if (!resultPending.current) return;
    resultPending.current = false;
    resultRecorder(!result ? "incomplete" : result.reserveMet ? "reserve_met" : "reserve_missed");
  });
  function commit(next: BudgetState) { resultPending.current = true; setEdited({search, value: next}); setShareStatus(""); }
  function updateLine(index: number, patch: Partial<PurchaseLine>) { commit({...state, lines: lines.map((line, row) => row === index ? {...line, ...patch} : line)}); }
  function addItem() {
    if (!itemMap.has(selected)) return;
    const existing = lines.findIndex(({id}) => id === selected);
    if (existing >= 0) updateLine(existing, {quantity: Math.min(10_000, lines[existing].quantity + 1)});
    else if (lines.length < maximumPlanLines) commit({...state, lines: [...lines, {id: selected, quantity: 1, unit: "unknown", unitPrice: null, frequency: "repeat"}]});
  }
  function applyPreset() {
    if (!presetResult) return;
    trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {tool: "loadout-budget", action: "apply_preset", result: presetResult.status, locale: copy.locale});
    if (presetResult.status === "applied") commit(presetResult.state);
    setPresetStatus({search, message: presetCopy[presetResult.status]});
  }
  async function share() {
    if (tooLarge) return;
    const url = new URL(window.location.href);
    url.search = encodedState;
    window.history.replaceState(null, "", url);
    setEdited({search: url.search, value: state});
    try { await navigator.clipboard.writeText(url.toString()); trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {tool: "loadout-budget", action: "share", result: "copied", locale: copy.locale}); setShareStatus(copy.copied); }
    catch { trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {tool: "loadout-budget", action: "share", result: "clipboard_error", locale: copy.locale}); setShareStatus(t.shareFailed); }
  }

  return <section aria-busy={!isHydrated} className="border-y border-[#354039] bg-[#111512]" aria-labelledby="loadout-budget-form">
    <ToolShareNotice locale={copy.locale} search={search} dataVersion={catalogue.dataVersion} invalid={Boolean(search && !restored && !preselected.length && new URLSearchParams(search).has("cash"))} />
    <fieldset className="m-0 min-w-0 border-0 p-0" disabled={!isHydrated}>
      <div className="space-y-6 p-5 md:p-8">
      <section className="min-w-0 space-y-3 border-b border-[#354039] pb-5" aria-label={presetCopy.heading}>
        <h2 className="text-lg font-semibold text-white">{presetCopy.heading}</h2>
        <p className="text-xs leading-5 text-[#a8b4ae]">{presetCopy.notice}</p>
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{presetCopy.choose}<select className={planInputClass} value={presetId} onChange={(event) => {setPresetChoice({search, id: event.target.value}); setPresetStatus(null);}}><option value="">{presetCopy.placeholder}</option>{presets.map(({id, title}) => <option value={id} key={id}>{title}</option>)}</select></label>
          <button className={`${buttonClass} self-end`} type="button" disabled={!chosenPreset || presetResult?.status === "limit" || presetResult?.status === "unavailable"} onClick={applyPreset}><Plus size={16} className="shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{presetCopy.apply}</span></button>
        </div>
        <p className="text-xs leading-5 text-[#a8b4ae]">{presetCopy.append}</p>
        <p className="text-xs leading-5 text-[#a8b4ae]">{presetCopy.quantities}</p>
        {shownPresets.map((preset) => <div key={preset.id} className="space-y-2 border-l-2 border-[#397b59] pl-3 text-xs leading-5">
          <h3 className="text-sm font-semibold text-white">{preset.title}</h3>
          <p className="text-[#cbd5cf]">{preset.mission}</p>
          <dl className="space-y-2 text-[#a8b4ae]"><div><dt className="font-semibold text-white">{presetCopy.unlock}</dt><dd>{preset.unlock}</dd></div><div><dt className="font-semibold text-white">{presetCopy.compatibility}</dt><dd>{preset.compatibility}</dd></div></dl>
        </div>)}
        {shownPresets.length ? <p className="text-xs leading-5 text-[#a8b4ae]">{presetCopy.budgets}</p> : null}
        <p role="status" className="text-sm text-[#e4c35f]">{presetResult?.status === "limit" || presetResult?.status === "unavailable" ? presetCopy[presetResult.status] : presetStatus?.search === search ? presetStatus.message : ""}</p>
      </section>
      <fieldset className="flex flex-wrap gap-2">
        {[{id: "total", label: t.totalMode}, {id: "items", label: t.itemsMode}].map(({id, label}) => <label className="flex min-h-11 cursor-pointer items-center gap-2 border border-[#46534d] px-4 text-sm text-white" key={id}>
          <input type="radio" name="budget-mode" checked={(state.mode ?? "total") === id} onChange={() => commit({...state, mode: id as "total" | "items", lines})} />{label}
        </label>)}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PlanNumber label={copy.cash} value={state.cash} onChange={(cash) => commit({...state, cash: cash ?? 0})} />
        <PlanNumber label={copy.reserve} value={state.reserve} onChange={(reserve) => commit({...state, reserve: reserve ?? 0})} />
        <PlanNumber label={t.once} value={state.once ?? 0} onChange={(once) => commit({...state, once: once ?? 0})} />
        {!itemsMode ? <PlanNumber label={t.repeat} value={state.loadout} onChange={(loadout) => commit({...state, loadout: loadout ?? 0})} /> : null}
        <PlanNumber label={t.legacyVehicle} value={state.vehicle} onChange={(vehicle) => commit({...state, vehicle: vehicle ?? 0})} />
      </div>
      <p className="text-xs leading-5 text-[#a8b4ae]">{t.assumptions}</p>
      {itemsMode ? <div className="space-y-5 border-y border-[#354039] py-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.search}<input className={planInputClass} type="search" value={query} onChange={(event) => {setQuery(event.target.value); setSelected("");}} /></label>
          <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.select}<select className={planInputClass} value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">{found.length ? t.select : t.noResults}</option>{found.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <button className={`${buttonClass} self-end`} type="button" disabled={!selected || lines.length >= maximumPlanLines} onClick={addItem}><Plus size={16} aria-hidden="true" />{t.add}</button>
        </div>
        {lines.length >= maximumPlanLines ? <p className="text-sm text-[#e4c35f]">{t.limit}</p> : null}
        {!lines.length ? <p className="py-5 text-sm text-[#a8b4ae]">{t.empty}</p> : null}
        <ol className="divide-y divide-[#354039]">
          {lines.map((line, index) => {
            const item = itemMap.get(line.id);
            return <li className="py-5" key={line.id}>
              <div className="mb-4 flex items-start gap-3">
                {item?.image ? <Image alt={item.imageAlt ?? item.name} className="h-16 w-24 shrink-0 object-contain" src={assetPath(item.image)} width={96} height={64} /> : null}
                <div className="min-w-0 flex-1"><h3 className="break-words font-semibold text-white">{item?.name ?? `${t.deleted}: ${line.id}`}</h3>
                  {item?.priceReference ? <p className="mt-1 text-xs text-[#e4c35f]">{t.reference}: {item.priceReference} ({item.evidence.build})</p> : null}
                  {item ? <details className="mt-2 text-xs text-[#9daea4]"><summary className="cursor-pointer">{t.evidence}</summary><EvidenceProvenance copy={copy} {...item.evidence} />{item.evidence.sourceUrl ? <a className="break-all text-[#7fd0a1]" href={item.evidence.sourceUrl} target="_blank" rel="noreferrer" title={`${t.evidence}: ${item.name}`}>{copy.openItem}</a> : null}</details> : null}
                </div>
                <button className={buttonClass} type="button" aria-label={`${t.remove}: ${item?.name ?? line.id}`} title={t.remove} onClick={() => commit({...state, lines: lines.filter((_, row) => row !== index)})}><Trash2 size={17} aria-hidden="true" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PlanNumber label={t.quantity} value={line.quantity} integer minimum={1} maximum={10_000} onChange={(quantity) => updateLine(index, {quantity: quantity ?? 1})} />
                <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.unit}<select className={planInputClass} value={line.unit} onChange={(event) => updateLine(index, {unit: event.target.value as PurchaseLine["unit"]})}>{(["unknown", "item", "pack", "round"] as const).map((unit) => <option value={unit} key={unit}>{t[unit]}</option>)}</select></label>
                <PlanNumber label={t.price} value={line.unitPrice} placeholder={t.unknown} onChange={(unitPrice) => updateLine(index, {unitPrice})} />
                <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.frequency}<select className={planInputClass} value={line.frequency} onChange={(event) => updateLine(index, {frequency: event.target.value as PurchaseLine["frequency"]})}><option value="repeat">{t.repeatShort}</option><option value="once">{t.onceShort}</option></select></label>
              </div>
            </li>;
          })}
        </ol>
        {selectedWeapons.length ? <section className="border-t border-[#354039] pt-5">
          <h3 className="font-semibold text-white">{t.compatibility}</h3>
          <label className="mt-3 grid gap-2 text-sm text-[#cbd5cf]">{t.selectWeapon}<select className={planInputClass} value={activeWeapon} onChange={(event) => setWeapon(event.target.value)}>{selectedWeapons.map(({id}) => <option key={id} value={id}>{itemMap.get(id)?.name ?? id}</option>)}</select></label>
          <ul className="mt-3 space-y-3 text-sm text-[#cbd5cf]">{lines.filter(({id}) => id.startsWith("ammo/")).map(({id}) => {
            const relation = findPurchaseAmmoRelationship(catalogue.relationships, activeWeapon, id);
            return <li key={id}><strong>{itemMap.get(id)?.name ?? id}</strong>: {relation ? relation.state === "current" ? copy.currentEvidence : relation.state === "historical" ? copy.historicalEvidence : copy.unknownEvidence : t.compatibilityUnknown}{relation ? <EvidenceProvenance copy={copy} {...relation} /> : null}</li>;
          })}</ul>
        </section> : null}
        <p className="text-xs leading-5 text-[#e4c35f]">{t.attachmentUnknown}</p>
      </div> : null}
      <div aria-live="polite" className="border-t border-[#354039] pt-5">
        {!result ? <><p className="text-sm text-[#e4c35f]">{t.incomplete}</p><p className="mt-2 text-white">{t.subtotal}: {money(totals.repeat + totals.once + state.vehicle + (state.once ?? 0))}</p></> : <>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[
            [t.firstSpend, money(result.spent)], [copy.remaining, money(result.remaining)], [t.purchases, result.purchases === null ? t.zeroCost : String(result.purchases)], [t.replacements, result.replacements === null ? t.zeroCost : String(result.replacements)],
          ].map(([label, value]) => <div className="min-w-0" key={label}><dt className="text-xs text-[#9daea4]">{label}</dt><dd className="mt-2 break-words text-xl font-semibold text-white">{value}</dd></div>)}</dl>
          <p className={`mt-4 text-sm ${result.reserveMet ? "text-[#84d5a5]" : "text-[#e4c35f]"}`}>{result.reserveMet ? copy.reserveMet : copy.reserveMissed}</p>
        </>}
      </div>
      {tooLarge ? <p role="status" className="text-sm text-[#e4c35f]">{t.shareTooLarge}</p> : null}
      <button className={buttonClass} type="button" disabled={tooLarge} onClick={share}><Copy size={16} aria-hidden="true" />{copy.share}</button>
      <p role="status" className="text-sm text-[#a8b4ae]">{shareStatus}</p>
      </div>
    </fieldset>
  </section>;
}
