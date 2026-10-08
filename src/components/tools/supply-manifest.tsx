"use client";

import {Plus, Trash2} from "lucide-react";
import type {ToolCopy} from "@/features/tools/tool-copy";
import type {LogisticsStage} from "@/features/tools/logistics-plan";
import {calculateSupplyPlan, maximumPlanLines, type SupplyLine, type SupplyPlan} from "@/features/tools/workflow-state";
import {getWorkflowCopy} from "@/features/tools/workflow-copy";
import {PlanNumber, planInputClass} from "./plan-number";

export function SupplyManifest({copy, stages, plan, onChange}: {copy: ToolCopy; stages: readonly LogisticsStage[]; plan: SupplyPlan; onChange: (plan: SupplyPlan) => void}) {
  const t = getWorkflowCopy(copy.locale);
  const result = calculateSupplyPlan(plan);
  const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 border border-[#46534d] px-3 py-2 text-sm text-white enabled:hover:border-[#69c78f] disabled:opacity-40";
  const updateLine = (index: number, patch: Partial<SupplyLine>) => onChange({...plan, lines: plan.lines.map((line, row) => row === index ? {...line, ...patch} : line)});
  const number = (value: number | null) => value === null ? t.unknown : value.toLocaleString(copy.locale, {maximumFractionDigits: 2});
  return <section className="border-t border-[#354039] p-5 md:p-8" aria-labelledby="supply-manifest-title" data-clarity-mask="true">
    <h2 id="supply-manifest-title" className="text-xl font-semibold text-white">{t.manifest}</h2>
    <p className="mt-2 text-xs leading-5 text-[#e4c35f]">{t.supplyNote}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.resource}<input className={planInputClass} maxLength={60} value={plan.resource} onChange={(event) => onChange({...plan, resource: event.target.value})} /></label>
      <PlanNumber label={t.demand} placeholder={t.unknown} value={plan.demand} onChange={(demand) => onChange({...plan, demand})} />
      <PlanNumber label={t.stock} value={plan.stock} onChange={(stock) => onChange({...plan, stock: stock ?? 0})} />
      <PlanNumber label={t.capacity} placeholder={t.unknown} value={plan.capacity} onChange={(capacity) => onChange({...plan, capacity})} />
    </div>
    <ol className="mt-5 divide-y divide-[#354039]">
      {plan.lines.map((line, index) => <li className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]" key={index}>
        <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.name}<input className={planInputClass} maxLength={100} value={line.name} onChange={(event) => updateLine(index, {name: event.target.value})} /></label>
        <label className="grid gap-2 text-sm text-[#cbd5cf]">{t.stage}<select className={planInputClass} value={line.stage} onChange={(event) => updateLine(index, {stage: event.target.value})}>{!stages.some(({id}) => id === line.stage) ? <option value={line.stage}>{t.unknown}: {line.stage}</option> : null}{stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.title}</option>)}</select></label>
        <PlanNumber label={t.quantity} integer minimum={1} maximum={10_000} value={line.quantity} onChange={(quantity) => updateLine(index, {quantity: quantity ?? 1})} />
        <PlanNumber label={t.supplies} placeholder={t.unknown} value={line.supplies} onChange={(supplies) => updateLine(index, {supplies})} />
        <button className={`${buttonClass} self-end`} type="button" title={t.remove} aria-label={`${t.remove}: ${line.name}`} onClick={() => onChange({...plan, lines: plan.lines.filter((_, row) => row !== index)})}><Trash2 aria-hidden="true" size={17} /></button>
      </li>)}
    </ol>
    <button className={`${buttonClass} mt-4`} type="button" disabled={plan.lines.length >= maximumPlanLines || !stages.length} onClick={() => onChange({...plan, lines: [...plan.lines, {name: stages.find(({id}) => id === "construction")?.title ?? stages[0].title, stage: stages.find(({id}) => id === "construction")?.id ?? stages[0].id, quantity: 1, supplies: null}]})}><Plus aria-hidden="true" size={16} />{t.addLine}</button>
    {plan.lines.length >= maximumPlanLines ? <p className="mt-2 text-xs text-[#e4c35f]">{t.limit}</p> : null}
    {plan.lines.length ? <dl className="mt-5 grid gap-3 sm:grid-cols-2">{[...new Set(plan.lines.map(({stage}) => stage))].map((stage) => {
      const lines = plan.lines.filter((line) => line.stage === stage);
      const value = lines.some(({supplies}) => supplies === null) ? null : lines.reduce((sum, line) => sum + Math.round(line.supplies! * 100) * line.quantity, 0) / 100;
      return <div className="border-l border-[#46534d] pl-3" key={stage}><dt className="text-xs text-[#9daea4]">{t.perStage}: {stages.find(({id}) => id === stage)?.title ?? stage}</dt><dd className="text-white">{number(value)}</dd></div>;
    })}</dl> : null}
    <dl className="mt-5 grid gap-5 border-t border-[#354039] pt-5 sm:grid-cols-3" aria-live="polite">{[[t.required, result.demand], [t.outstanding, result.remaining], [t.trips, result.trips]].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-sm text-[#9daea4]">{label}</dt><dd className="mt-2 break-words text-2xl font-semibold text-white">{number(value as number | null)}</dd></div>)}</dl>
  </section>;
}
