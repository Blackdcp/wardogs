"use client";

import {useState} from "react";
import type {Locale} from "@/config/site";
import type {LoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import type {BudgetState} from "@/features/tools/share-state";
import {applyAttachmentRecipe, attachmentCreatorSource, attachmentRecipes} from "@/features/tools/attachment-recipes";
import {emptyAttachmentObservation, updateAttachmentObservation, type AttachmentObservation} from "@/features/tools/attachment-observation";
import {getAttachmentRecipeCopy} from "@/features/tools/attachment-recipe-copy";
import {getAttachmentRecordCopy} from "@/features/tools/attachment-record-copy";
import {PlanNumber, planInputClass} from "./plan-number";

const buttonClass = "inline-flex min-h-11 max-w-full items-center justify-center border border-[#397b59] px-3 py-2 text-sm font-semibold text-white hover:bg-[#244332]";

export function AttachmentRecipePanel({locale, state, catalogue, onChange}: {locale: Locale; state: BudgetState; catalogue: LoadoutCatalogue; onChange: (state: BudgetState) => void}) {
  const t = getAttachmentRecipeCopy(locale);
  const record = getAttachmentRecordCopy(locale);
  const [status, setStatus] = useState<"applied" | "limit" | "unavailable" | "conflict" | "">("");
  const observation = state.attachmentTest;
  function update(patch: Partial<AttachmentObservation>) {
    if (observation) onChange({...state, attachmentTest: updateAttachmentObservation(observation, patch)});
  }
  return <details id="attachment-tests" className="scroll-mt-24 min-w-0 border-y border-[#354039] py-4" open={observation ? true : undefined}>
    <summary className="min-h-11 cursor-pointer text-base font-semibold text-white">{t.title}</summary>
    <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{t.intro}</p>
    <button type="button" className={`${buttonClass} mt-3`} onClick={() => {setStatus(""); onChange({...state, attachmentTest: emptyAttachmentObservation("custom")});}}>{record.start}</button>
    <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-3">
      {attachmentRecipes.map((recipe, index) => <article key={recipe.id} className="min-w-0 space-y-3 border border-[#354039] p-4">
        <h3 className="break-words font-semibold text-white">{t.recipes[index]}</h3>
        <p className="text-xs leading-5 text-[#a8b4ae]">{t.recipeNotes[index]}</p>
        <a href={`${attachmentCreatorSource.url}&t=${recipe.seconds}s`} title={`${t.source}: ${t.recipes[index]}`} target="_blank" rel="noreferrer" className="block min-h-11 text-sm text-[#84d5a5]">{t.source} · {Math.floor(recipe.seconds / 60)}:{String(recipe.seconds % 60).padStart(2, "0")}</a>
        <button type="button" className={buttonClass} onClick={() => {const result = applyAttachmentRecipe(state, recipe.id, catalogue); setStatus(result.status); if (result.status === "applied") onChange(result.state);}}>{t.apply}: {t.recipes[index]}</button>
      </article>)}
    </div>
    {status ? <p role="status" className="mt-3 text-sm leading-6 text-[#e4c35f]">{t[status]}</p> : null}
    {observation ? <section data-clarity-mask="true" className="mt-5 min-w-0 border-t border-[#354039] pt-5" aria-label={t.observation}>
      <h3 className="text-base font-semibold text-white">{t.observation}: {observation.recipeId === "custom" ? record.title : t.recipes[attachmentRecipes.findIndex(({id}) => id === observation.recipeId)]}</h3>
      <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{t.note}</p>
      <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{record.note}</p>
      <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(["weapon", "grip", "muzzle"] as const).map((field) => <label key={field} className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{record[field]}<input data-clarity-mask="true" className={planInputClass} maxLength={80} value={observation[field] ?? ""} onChange={(event) => update({[field]: event.target.value})} /></label>)}
        <PlanNumber label={t.range} value={observation.rangeMeters} maximum={5_000} placeholder={t.unknown} onChange={(rangeMeters) => update({rangeMeters})} />
        {(["optic", "ammo"] as const).map((field) => <label key={field} className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t[field]}<input data-clarity-mask="true" className={planInputClass} maxLength={80} value={observation[field]} onChange={(event) => update({[field]: event.target.value})} /></label>)}
        <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.stance}<select className={planInputClass} value={observation.stance} onChange={(event) => update({stance: event.target.value as AttachmentObservation["stance"]})}>{(["unknown", "standing", "crouched", "prone"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></label>
        <label className="grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.bipod}<select className={planInputClass} value={observation.bipod} onChange={(event) => update({bipod: event.target.value as AttachmentObservation["bipod"]})}>{(["unknown", "stowed", "unmounted", "mounted"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></label>
        <PlanNumber label={t.magazine} value={observation.magazineRounds} integer minimum={1} maximum={1_000} placeholder={t.unknown} onChange={(magazineRounds) => update({magazineRounds})} />
        <fieldset className="m-0 min-w-0 border-0 p-0 disabled:opacity-50" disabled={observation.recipeId === "custom" && !observation.weapon?.trim()}><PlanNumber label={t.ads} value={observation.adsMilliseconds} maximum={60_000} placeholder={t.unknown} onChange={(adsMilliseconds) => update({adsMilliseconds})} /></fieldset>
      </div>
      <label className="mt-4 grid min-w-0 gap-2 text-sm text-[#cbd5cf]">{t.notes}<textarea data-clarity-mask="true" className={`${planInputClass} min-h-24 py-3`} maxLength={400} value={observation.notes} onChange={(event) => update({notes: event.target.value})} /></label>
      <ul className="my-4 space-y-2 text-xs leading-5 text-[#a8b4ae]">{t.checks.map((check) => <li key={check}>{check}</li>)}</ul>
      <button type="button" className={buttonClass} onClick={() => onChange({...state, attachmentTest: emptyAttachmentObservation(observation.recipeId)})}>{t.clear}</button>
    </section> : null}
  </details>;
}
