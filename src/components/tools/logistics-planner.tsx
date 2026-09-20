"use client";

import {ArrowDown, ArrowUp, Copy, ExternalLink} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import type {LogisticsStage, LogisticsEvidenceState} from "@/features/tools/logistics-plan";
import {decodeLogisticsPlanState, encodeLogisticsPlanState, type LogisticsPlanState} from "@/features/tools/share-state";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {EvidenceProvenance} from "./evidence-provenance";

function stateLabel(state: LogisticsEvidenceState, copy: ToolCopy) {
  if (state === "current") return copy.currentEvidence;
  return copy.unknownEvidence;
}

function stateClass(state: LogisticsEvidenceState) {
  if (state === "current") return "border-[#397b59] bg-[#173021] text-[#84d5a5]";
  return "border-[#46534d] bg-[#1a211e] text-[#a8b4ae]";
}

export function LogisticsPlanner({
  copy,
  stages,
  initialState,
}: {
  copy: ToolCopy;
  stages: readonly LogisticsStage[];
  initialState: LogisticsPlanState;
}) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (window.location.search) setState(decodeLogisticsPlanState(window.location.search, stages.map(({id}) => id)));
  }, [stages]);
  const stageById = useMemo(() => new Map(stages.map((stage) => [stage.id, stage])), [stages]);
  const plan = state.stages.flatMap((id) => {
    const stage = stageById.get(id as LogisticsStage["id"]);
    return stage ? [stage] : [];
  });

  function commit(next: LogisticsPlanState) {
    setState(next);
    setCopied(false);
    const url = new URL(window.location.href);
    url.search = encodeLogisticsPlanState(next);
    window.history.replaceState(null, "", url);
  }

  function toggle(id: LogisticsStage["id"], checked: boolean) {
    commit({stages: checked ? [...state.stages, id] : state.stages.filter((stage) => stage !== id)});
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= state.stages.length) return;
    const next = [...state.stages];
    [next[index], next[target]] = [next[target], next[index]];
    commit({stages: next});
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = encodeLogisticsPlanState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-label={copy.logisticsPlannerTitle}>
      <div className="grid gap-8 p-5 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] md:p-8">
        <fieldset className="min-w-0">
          <legend className="text-xs font-semibold uppercase text-[#69c78f]">{copy.availableStages}</legend>
          <div className="mt-4 divide-y divide-[#354039] border-y border-[#354039]">
            {stages.map((stage) => (
              <label className="flex min-h-12 cursor-pointer items-center gap-3 py-3 text-sm font-semibold text-[#cbd5cf]" key={stage.id}>
                <input
                  checked={state.stages.includes(stage.id)}
                  className="h-5 w-5 accent-[#397b59]"
                  type="checkbox"
                  onChange={(event) => toggle(stage.id, event.target.checked)}
                />
                <span className="min-w-0 break-words">{stage.title}</span>
              </label>
            ))}
          </div>
          <button className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyLink} type="button" title={copy.copyToolLink}>
            <Copy aria-hidden="true" size={16} />{copied ? copy.copiedToolLink : copy.copyToolLink}
          </button>
        </fieldset>

        <div className="min-w-0">
          <h2 className="display-font text-2xl text-white">{copy.selectedPlan}</h2>
          {plan.length === 0 ? (
            <p className="mt-5 border-y border-[#354039] py-8 text-sm leading-6 text-[#a8b4ae]">{copy.emptyLogisticsPlan}</p>
          ) : (
            <ol className="mt-4 divide-y divide-[#354039] border-y border-[#354039]">
              {plan.map((stage, index) => (
                <li className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_2.75rem] gap-3 py-5" key={stage.id}>
                  <span className="font-mono text-sm font-bold text-[#69c78f]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="break-words text-base font-bold text-white">{stage.title}</h3>
                      <span className={`inline-flex border px-2 py-1 text-[11px] font-semibold uppercase ${stateClass(stage.evidenceState)}`}>{stateLabel(stage.evidenceState, copy)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#c5d0ca]">{stage.action}</p>
                    <p className="mt-2 text-xs leading-5 text-[#d7bd68]">{stage.evidenceNote}</p>
                    {stage.changes.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {stage.changes.map((change) => (
                          <li className="text-xs leading-5 text-[#a8b4ae]" key={`${change.entity}-${change.field}`}>
                            <span className="font-semibold text-white">{change.entity}</span>: {change.previousValue} → <span className="text-[#84d5a5]">{change.currentValue}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {stage.evidenceState === "current" ? (
                      <>
                        <EvidenceProvenance build={stage.build} confidence={stage.confidence} copy={copy} sourceClass={stage.sourceClass} verifiedAt={stage.checkedAt} />
                        <a className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-[#7fd0a1] hover:text-white" href={stage.sourceUrl} rel="noreferrer" target="_blank" title={copy.officialSource}>
                          {copy.officialSource}<ExternalLink aria-hidden="true" size={13} />
                        </a>
                      </>
                    ) : null}
                  </div>
                  <div className="grid content-start gap-2">
                    <button aria-label={`${copy.moveEarlier}: ${stage.title}`} className="grid h-11 w-11 place-items-center border border-[#46534d] text-[#c5d0ca] enabled:hover:border-[#69c78f] enabled:hover:text-white disabled:opacity-35" disabled={index === 0} onClick={() => move(index, -1)} title={`${copy.moveEarlier}: ${stage.title}`} type="button">
                      <ArrowUp aria-hidden="true" size={17} />
                    </button>
                    <button aria-label={`${copy.moveLater}: ${stage.title}`} className="grid h-11 w-11 place-items-center border border-[#46534d] text-[#c5d0ca] enabled:hover:border-[#69c78f] enabled:hover:text-white disabled:opacity-35" disabled={index === plan.length - 1} onClick={() => move(index, 1)} title={`${copy.moveLater}: ${stage.title}`} type="button">
                      <ArrowDown aria-hidden="true" size={17} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
