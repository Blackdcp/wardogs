"use client";

import {CheckCircle2, Copy, ExternalLink, TriangleAlert} from "lucide-react";
import {useMemo, useState, useSyncExternalStore} from "react";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {
  decodeSystemCheckState,
  encodeSystemCheckState,
  evaluateSystemCheck,
  type HardwareTier,
  type SystemCheckState,
  type WindowsVersion,
} from "@/features/tools/share-state";

const defaults: SystemCheckState = {os: "windows-11", ramGb: 16, storageGb: 50, cpuTier: "unknown", gpuTier: "unknown"};
const emptySearch = () => "";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

export function SystemChecker({copy}: {copy: ToolCopy}) {
  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, emptySearch);
  const sharedState = useMemo(() => decodeSystemCheckState(search), [search]);
  const [editedState, setEditedState] = useState<SystemCheckState | null>(null);
  const state = editedState ?? sharedState ?? defaults;
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => evaluateSystemCheck(state), [state]);

  const tierOptions: {value: HardwareTier; label: string}[] = [
    {value: "unknown", label: copy.unknown}, {value: "below", label: copy.below},
    {value: "minimum", label: copy.minimum}, {value: "recommended", label: copy.recommended},
  ];
  const resultText = {below: copy.resultBelow, review: copy.resultReview, minimum: copy.resultMinimum, recommended: copy.resultRecommended}[result.level];

  async function copyResult() {
    const url = new URL(window.location.href);
    url.search = encodeSystemCheckState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-labelledby="system-check-form">
      <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
        <div className="grid content-start gap-5">
          <label className="grid gap-2 text-sm text-[#cbd5cf]">{copy.os}
            <select className="min-h-11 border border-[#3a473f] bg-[#0c100e] px-3 text-white" value={state.os} onChange={(event) => setEditedState({...state, os: event.target.value as WindowsVersion})}>
              <option value="windows-10">{copy.windows10}</option><option value="windows-11">{copy.windows11}</option><option value="unsupported">{copy.unsupported}</option>
            </select>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[#cbd5cf]">{copy.ram}<input className="min-h-11 border border-[#3a473f] bg-[#0c100e] px-3 text-white" min="0" max="1024" type="number" value={state.ramGb} onChange={(event) => setEditedState({...state, ramGb: Number.isFinite(event.target.valueAsNumber) ? event.target.valueAsNumber : 0})} /></label>
            <label className="grid gap-2 text-sm text-[#cbd5cf]">{copy.storage}<input className="min-h-11 border border-[#3a473f] bg-[#0c100e] px-3 text-white" min="0" max="100000" type="number" value={state.storageGb} onChange={(event) => setEditedState({...state, storageGb: Number.isFinite(event.target.valueAsNumber) ? event.target.valueAsNumber : 0})} /></label>
          </div>
          {(["cpuTier", "gpuTier"] as const).map((field) => <label className="grid gap-2 text-sm text-[#cbd5cf]" key={field}>{field === "cpuTier" ? copy.cpu : copy.gpu}<select className="min-h-11 border border-[#3a473f] bg-[#0c100e] px-3 text-white" value={state[field]} onChange={(event) => setEditedState({...state, [field]: event.target.value as HardwareTier})}>{tierOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}
        </div>
        <div className="flex min-h-72 flex-col justify-between border-l-0 border-[#354039] md:border-l md:pl-8">
          <div aria-live="polite">
            <p className="font-mono text-xs uppercase text-[#d9a93a]">{copy.result}</p>
            <div className="mt-4 flex items-start gap-3">{result.level === "below" || result.level === "review" ? <TriangleAlert className="mt-1 size-6 shrink-0 text-[#d9a93a]" aria-hidden="true" /> : <CheckCircle2 className="mt-1 size-6 shrink-0 text-[#69c78f]" aria-hidden="true" />}<p className="display-font text-3xl leading-tight text-white">{resultText}</p></div>
            {result.limiting.length > 0 && <p className="mt-4 text-sm text-[#a8b4ae]">{copy.limiting}: {result.limiting.map((key) => key === "os" ? copy.os : key === "ramGb" ? copy.ram : key === "storageGb" ? copy.storage : key === "cpuTier" ? copy.cpu : copy.gpu).join(", ")}</p>}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyResult} type="button" title={copy.share}><Copy className="size-4" aria-hidden="true" />{copied ? copy.copied : copy.share}</button>
            <a className="inline-flex min-h-11 items-center gap-2 border border-[#3a473f] px-4 text-sm font-semibold text-[#d7e2dc] hover:border-[#69c78f]" href="https://store.steampowered.com/app/1867240/WARDOGS/" target="_blank" rel="noreferrer">{copy.source}<ExternalLink className="size-4" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
