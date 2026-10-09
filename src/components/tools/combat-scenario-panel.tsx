"use client";

import type {Locale} from "@/config/site";
import {calculateCombatScenario, changeCombatBuild, changeCombatContext, type CombatScenario} from "@/features/tools/combat-scenario";
import {getWorkbenchCopy} from "@/features/tools/workbench-copy";
import {PlanNumber, planInputClass} from "./plan-number";

export function CombatScenarioPanel({locale, value, names, onChange}: {locale: Locale; value: CombatScenario; names: {left: string; right: string}; onChange: (next: CombatScenario) => void}) {
  const t = getWorkbenchCopy(locale);
  return <details className="border-t border-[#354039] px-5 py-5 md:px-8" open>
    <summary className="min-h-11 cursor-pointer text-lg font-semibold text-white">{t.scenario}</summary>
    <p className="mb-5 max-w-4xl text-sm leading-6 text-[#a8b4ae]">{t.scenarioNote}</p>
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t.preset}>
      {([[25, t.close], [100, t.medium], [300, t.far]] as const).map(([range, label]) => <button className="min-h-11 border border-[#46534d] px-3 text-sm text-white aria-pressed:border-[#7fd0a1] aria-pressed:bg-[#173021]" type="button" aria-pressed={value.range === range} key={range} onClick={() => onChange(changeCombatContext(value, {range}))}>{label}</button>)}
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf] sm:col-span-2 lg:col-span-4">{t.build}<input data-clarity-mask="true" className={planInputClass} value={value.build} maxLength={80} onChange={(event) => onChange(changeCombatBuild(value, event.target.value))} /></label>
      <PlanNumber label={t.range} value={value.range} maximum={5_000} onChange={(range) => onChange(changeCombatContext(value, {range: range ?? 0}))} />
      <PlanNumber label={t.health} value={value.health} minimum={0.01} maximum={100_000} placeholder={t.unknown} onChange={(health) => onChange({...value, health})} />
      <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.armor}<select className={planInputClass} value={value.armor} onChange={(event) => onChange(changeCombatContext(value, {armor: event.target.value as CombatScenario["armor"]}))}>{(["none", "l1", "l2", "l3", "l4"] as const).map((armor) => <option key={armor} value={armor}>{armor === "none" ? t.none : armor.toUpperCase()}</option>)}</select></label>
      <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.zone}<select className={planInputClass} value={value.hitZone} onChange={(event) => onChange(changeCombatContext(value, {hitZone: event.target.value as CombatScenario["hitZone"]}))}>{(["torso", "head", "limbs"] as const).map((zone) => <option key={zone} value={zone}>{t[zone]}</option>)}</select></label>
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      {(["left", "right"] as const).map((side) => {
        const result = calculateCombatScenario(value, side);
        return <fieldset className="min-w-0 space-y-4 border border-[#354039] p-4" key={side}>
          <legend className="px-2 font-semibold text-white">{names[side]}</legend>
          <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.load}<input data-clarity-mask="true" className={planInputClass} value={value[side].load} maxLength={80} onChange={(event) => onChange({...value, [side]: {...value[side], load: event.target.value, damage: null}})} /></label>
          <PlanNumber label={t.damage} value={value[side].damage} maximum={100_000} placeholder={t.unknown} onChange={(damage) => onChange({...value, [side]: {...value[side], damage}})} />
          <PlanNumber label={t.rpm} value={value[side].rpm} maximum={100_000} placeholder={t.unknown} onChange={(rpm) => onChange({...value, [side]: {...value[side], rpm}})} />
          <div aria-live="polite" className="border-t border-[#354039] pt-4">
            {result.status !== "estimated" ? <p className="text-sm text-[#e4c35f]">{result.status === "no-damage" ? t.blocked : t.missing}</p> : <dl className="grid grid-cols-2 gap-4"><div><dt className="text-xs text-[#a8b4ae]">{t.shots}</dt><dd className="mt-2 text-2xl font-semibold text-white">{result.shots}</dd></div><div><dt className="text-xs text-[#a8b4ae]">{t.seconds}</dt><dd className="mt-2 text-2xl font-semibold text-white">{result.seconds === null ? "—" : result.seconds.toLocaleString(locale, {maximumFractionDigits: 3})}</dd></div></dl>}
          </div>
        </fieldset>;
      })}
    </div>
    <p className="mt-5 text-xs leading-5 text-[#a8b4ae]">{t.formula}</p>
  </details>;
}
