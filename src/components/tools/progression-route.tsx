"use client";

import {Copy, ExternalLink} from "lucide-react";
import {useMemo, useState} from "react";
import type {ProgressionRoleRoute, ProgressionRoleId} from "@/features/tools/progression-routes";
import {encodeProgressionRouteState, type ProgressionRouteState} from "@/features/tools/share-state";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {EvidenceProvenance} from "./evidence-provenance";

export function ProgressionRoute({
  copy,
  routes,
  initialState,
}: {
  copy: ToolCopy;
  routes: readonly ProgressionRoleRoute[];
  initialState: ProgressionRouteState;
}) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const route = useMemo(
    () => routes.find(({id}) => id === state.role) ?? routes[0],
    [routes, state.role],
  );

  function commit(next: ProgressionRouteState) {
    setState(next);
    setCopied(false);
    const url = new URL(window.location.href);
    url.search = encodeProgressionRouteState(next);
    window.history.replaceState(null, "", url);
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = encodeProgressionRouteState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  if (!route) return null;

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-label={copy.progressionRouteTitle}>
      <div className="grid gap-5 p-5 sm:grid-cols-2 md:p-8">
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.selectRole}
          <select
            className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white"
            value={state.role}
            onChange={(event) => commit({...state, role: event.target.value as ProgressionRoleId})}
          >
            {routes.map((option) => <option key={option.id} value={option.id}>{option.roleLabel}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.currentLevel}
          <input
            className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white"
            inputMode="numeric"
            max={999}
            min={0}
            placeholder={copy.currentLevelOptional}
            type="number"
            value={state.currentLevel ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              const parsed = raw === "" ? null : Number(raw);
              commit({...state, currentLevel: parsed !== null && Number.isInteger(parsed) && parsed >= 0 && parsed <= 999 ? parsed : null});
            }}
          />
        </label>
        <div className="flex justify-end sm:col-span-2">
          <button className="inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyLink} type="button" title={copy.copyToolLink}>
            <Copy aria-hidden="true" size={16} />{copied ? copy.copiedToolLink : copy.copyToolLink}
          </button>
        </div>
      </div>

      <div className="border-t border-[#354039] px-5 py-8 md:px-8">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{copy.selectRole}</p>
            <p className="mt-2 break-words text-xl font-bold text-white">{route.roleLabel}</p>
          </div>
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{copy.currentLevel}</p>
            <p className="mt-2 break-words text-xl font-bold text-white">{state.currentLevel ?? copy.unknownEvidence}</p>
          </div>
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{copy.routeGoal}</p>
            <p className="mt-2 text-sm leading-6 text-[#c5d0ca]">{route.goal}</p>
          </div>
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{copy.routeDuty}</p>
            <p className="mt-2 text-sm leading-6 text-[#c5d0ca]">{route.duty}</p>
          </div>
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{copy.nextUsefulAction}</p>
            <p className="mt-2 text-sm leading-6 text-[#c5d0ca]">{route.nextAction}</p>
          </div>
          <div className="min-w-0 border-t border-[#354039] pt-4">
            <p className="text-xs font-semibold uppercase text-[#d9b455]">{copy.durationEstimate}</p>
            <p className="mt-2 text-sm leading-6 text-[#d7bd68]">{route.durationLabel}</p>
          </div>
        </div>

        <div className="mt-9 border-t border-[#354039] pt-6">
          <h2 className="display-font text-2xl text-white">{copy.confirmedSeasonChanges}</h2>
          {route.changes.length > 0 ? (
            <ul className="mt-4 divide-y divide-[#354039] border-y border-[#354039]">
              {route.changes.map((change) => (
                <li className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={`${change.entity}-${change.field}`}>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-white">{change.entity}</p>
                  </div>
                  <p className="text-sm text-[#a8b4ae]">{copy.previousValue}: <span className="text-white">{change.previousValue}</span></p>
                  <p className="text-sm text-[#a8b4ae]">{copy.currentValue}: <span className="font-semibold text-[#84d5a5]">{change.currentValue}</span></p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#a8b4ae]">{copy.noPublishedRoleChanges}</p>
          )}
          <EvidenceProvenance build={route.build} confidence={route.confidence} copy={copy} sourceClass={route.sourceClass} verifiedAt={route.checkedAt} />
          <a className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#7fd0a1] hover:text-white" href={route.sourceUrl} rel="noreferrer" target="_blank" title={copy.officialSource}>
            {copy.officialSource}<ExternalLink aria-hidden="true" size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
