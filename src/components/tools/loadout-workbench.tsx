"use client";

import {useMemo, useState, useSyncExternalStore} from "react";
import type {Locale} from "@/config/site";
import type {LoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import {checkLoadoutFit, loadoutStorageKey, readSavedLoadouts, restoreSavedLoadout, totalLoadoutWeight, type SavedLoadout} from "@/features/tools/loadout-workbench";
import {getWorkbenchCopy} from "@/features/tools/workbench-copy";
import type {BudgetState} from "@/features/tools/share-state";
import {inspectToolState, totalPurchases, type PurchaseLine} from "@/features/tools/workflow-state";
import {PlanNumber, planInputClass} from "./plan-number";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";

const buttonClass = "min-h-11 border border-[#46534d] px-3 py-2 text-sm font-semibold text-white enabled:hover:bg-[#244332] disabled:opacity-40";
const storageEvent = "wardogs-loadouts-changed";
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange); window.addEventListener(storageEvent, onChange);
  return () => {window.removeEventListener("storage", onChange); window.removeEventListener(storageEvent, onChange);};
}
function snapshot() {try {return window.localStorage.getItem(loadoutStorageKey);} catch {return null;}}
const serverSnapshot = () => null;

export function SavedLoadouts({locale, query, dataVersion, disabled, onRestore}: {locale: Locale; query: string; dataVersion: string; disabled: boolean; onRestore: (state: BudgetState) => void}) {
  const t = getWorkbenchCopy(locale);
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const saved = useMemo(() => readSavedLoadouts(raw), [raw]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  function record(action: string, result: string) {trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {tool: "loadout-budget", locale, action, result});}
  function write(next: SavedLoadout[]) {
    try {window.localStorage.setItem(loadoutStorageKey, JSON.stringify(next)); window.dispatchEvent(new Event(storageEvent)); return true;}
    catch {setStatus(t.failed); record("local_save", "storage_unavailable"); return false;}
  }
  function save() {
    if (disabled || !name.trim()) return;
    if (saved.length >= 12) {setStatus(t.saveLimit); record("local_save", "limit"); return;}
    if (write([...saved, {id: crypto.randomUUID(), name: name.trim(), query, savedAt: new Date().toISOString()}])) {setStatus(t.saved); setName(""); record("local_save", "saved");}
  }
  return <details className="border-t border-[#354039] pt-5">
    <summary className="min-h-11 cursor-pointer font-semibold text-white">{t.saves} ({saved.length}/12)</summary>
    <p className="mb-4 text-xs leading-5 text-[#a8b4ae]">{t.saveNote}</p>
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="grid gap-2 text-sm text-[#cbd5cf]">{t.name}<input data-clarity-mask="true" className={planInputClass} value={name} maxLength={60} onChange={(event) => setName(event.target.value)} /></label><button type="button" className={`${buttonClass} self-end`} disabled={disabled || !name.trim()} onClick={save}>{t.save}</button></div>
    {!saved.length ? <p className="mt-4 text-sm text-[#a8b4ae]">{t.empty}</p> : <ul className="mt-4 divide-y divide-[#354039]">{saved.map((entry) => <li key={entry.id} className="flex flex-wrap items-center gap-2 py-3"><span className="min-w-0 grow break-words text-sm text-white">{entry.name}</span><button className={buttonClass} type="button" onClick={() => {const state = restoreSavedLoadout(entry); if (!state) {setStatus(t.restoreFailed); record("local_restore", "invalid"); return;} onRestore(state); setStatus(inspectToolState(entry.query, dataVersion).status === "changed" ? t.staleSave : ""); record("local_restore", "restored");}}>{t.restore}</button><button className={buttonClass} type="button" aria-label={`${t.remove}: ${entry.name}`} onClick={() => {if (write(saved.filter(({id}) => id !== entry.id))) {setStatus(""); record("local_remove", "removed");}}}>{t.remove}</button></li>)}</ul>}
    <p role="status" className="mt-3 text-sm text-[#e4c35f]">{status}</p>
  </details>;
}

export function LoadoutLineChecks({locale, line, lines, catalogue, onChange}: {locale: Locale; line: PurchaseLine; lines: PurchaseLine[]; catalogue: LoadoutCatalogue; onChange: (patch: Partial<PurchaseLine>) => void}) {
  const t = getWorkbenchCopy(locale);
  const item = catalogue.items.find(({id}) => id === line.id);
  const canPair = item?.type === "ammo" || item?.type === "attachments";
  const weapons = lines.filter(({id}) => id.startsWith("weapons/"));
  const fit = checkLoadoutFit(line, lines, catalogue);
  return <div className="mt-4 space-y-3">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div><PlanNumber label={t.weight} value={line.unitWeight ?? null} placeholder={t.unknown} onChange={(unitWeight) => onChange({unitWeight})} />{item?.weightReference ? <p className="mt-2 text-xs text-[#a8b4ae]">{t.reference}: {item.weightReference} ({item.evidence.build})</p> : null}</div>
      {canPair ? <label className="grid content-start gap-2 text-sm text-[#cbd5cf]">{t.pair}<select className={planInputClass} value={line.pairedWeapon ?? ""} onChange={(event) => onChange({pairedWeapon: event.target.value, fit: "unknown"})}><option value="">{t.unpaired}</option>{line.pairedWeapon && !weapons.some(({id}) => id === line.pairedWeapon) ? <option value={line.pairedWeapon}>{t["missing-weapon"]}</option> : null}{weapons.map(({id}) => <option value={id} key={id}>{catalogue.items.find((candidate) => candidate.id === id)?.name ?? id}</option>)}</select></label> : null}
      {item?.type === "attachments" ? <label className="grid content-start gap-2 text-sm text-[#cbd5cf]">{t.fit}<select className={planInputClass} disabled={!line.pairedWeapon || fit === "missing-weapon"} value={line.fit ?? "unknown"} onChange={(event) => onChange({fit: event.target.value as PurchaseLine["fit"]})}>{(["unknown", "confirmed", "incompatible"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></label> : null}
    </div>
    {canPair ? <p role="status" className={`text-xs ${["historical-mismatch", "missing-weapon", "user-incompatible"].includes(fit) ? "text-[#f1a094]" : "text-[#a8b4ae]"}`}>{t[fit]}</p> : null}
  </div>;
}

export function LoadoutChecksSummary({locale, lines, catalogue}: {locale: Locale; lines: PurchaseLine[]; catalogue: LoadoutCatalogue}) {
  const t = getWorkbenchCopy(locale);
  const ids = catalogue.items.map(({id}) => id);
  const weight = totalLoadoutWeight(lines, ids);
  const price = totalPurchases(lines, ids);
  return <section className="border-t border-[#354039] pt-5" aria-label={t.kit}>
    <h3 className="font-semibold text-white">{t.kit}</h3>
    <dl className="mt-4 grid gap-4 sm:grid-cols-3">{[[t.weightTotal, weight.kilograms.toLocaleString(locale, {maximumFractionDigits: 3})], [t.weightMissing, weight.unknown], [t.priceMissing, price.unknown]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#a8b4ae]">{label}</dt><dd className="mt-2 text-xl font-semibold text-white">{value}</dd></div>)}</dl>
    <p className="mt-3 text-sm text-[#e4c35f]">{weight.complete ? t.known : t.incomplete}</p>
    <p className="mt-3 text-xs leading-5 text-[#a8b4ae]">{t.weightNote}</p>
    <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{t.fitNote}</p>
  </section>;
}
