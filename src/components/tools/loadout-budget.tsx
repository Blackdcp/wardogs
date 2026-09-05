"use client";

import {CheckCircle2, Copy, TriangleAlert} from "lucide-react";
import {useMemo, useState, useSyncExternalStore} from "react";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {calculateBudget, decodeBudgetState, encodeBudgetState, type BudgetState} from "@/features/tools/share-state";

const defaults: BudgetState = {cash: 10_000, loadout: 3_000, vehicle: 0, reserve: 2_000};
const emptySearch = () => "";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

export function LoadoutBudget({copy}: {copy: ToolCopy}) {
  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, emptySearch);
  const sharedState = useMemo(() => decodeBudgetState(search), [search]);
  const [editedState, setEditedState] = useState<BudgetState | null>(null);
  const state = editedState ?? sharedState ?? defaults;
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateBudget(state), [state]);

  async function copyResult() {
    const url = new URL(window.location.href);
    url.search = encodeBudgetState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  const fields = [
    {key: "cash", label: copy.cash}, {key: "loadout", label: copy.loadout},
    {key: "vehicle", label: copy.vehicle}, {key: "reserve", label: copy.reserve},
  ] as const;

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-labelledby="loadout-budget-form">
      <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
        <div className="grid content-start gap-5 sm:grid-cols-2">
          {fields.map(({key, label}) => <label className="grid gap-2 text-sm text-[#cbd5cf]" key={key}>{label}<input className="min-h-11 border border-[#3a473f] bg-[#0c100e] px-3 text-white" min="0" max="1000000" type="number" value={state[key]} onChange={(event) => setEditedState({...state, [key]: Number.isFinite(event.target.valueAsNumber) ? Math.max(0, event.target.valueAsNumber) : 0})} /></label>)}
          <p className="text-sm leading-6 text-[#a8b4ae] sm:col-span-2">{copy.buildWarning}</p>
        </div>
        <div className="flex min-h-72 flex-col justify-between border-l-0 border-[#354039] md:border-l md:pl-8">
          <div aria-live="polite">
            <p className="font-mono text-xs uppercase text-[#d9a93a]">{copy.result}</p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-[#8f9d95]">{copy.spent}</dt><dd className="display-font mt-1 text-3xl text-white">${result.spent.toLocaleString()}</dd></div>
              <div><dt className="text-sm text-[#8f9d95]">{copy.remaining}</dt><dd className={`display-font mt-1 text-3xl ${result.remaining < 0 ? "text-[#ee8a8a]" : "text-white"}`}>${result.remaining.toLocaleString()}</dd></div>
            </dl>
            <div className="mt-6 flex items-center gap-3">{result.reserveMet ? <CheckCircle2 className="size-5 text-[#69c78f]" aria-hidden="true" /> : <TriangleAlert className="size-5 text-[#d9a93a]" aria-hidden="true" />}<span className="font-semibold text-[#d7e2dc]">{result.reserveMet ? copy.reserveMet : copy.reserveMissed}</span></div>
          </div>
          <button className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyResult} type="button" title={copy.share}><Copy className="size-4" aria-hidden="true" />{copied ? copy.copied : copy.share}</button>
        </div>
      </div>
    </section>
  );
}
