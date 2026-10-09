import Image from "next/image";
import {ArrowRight} from "lucide-react";
import type {Locale} from "@/config/site";
import {getLoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import {getLoadoutPresetCopy, getLoadoutPresetHref, getLoadoutPresets} from "@/features/tools/loadout-presets";
import {getToolCopy} from "@/features/tools/tool-copy";
import {getWorkflowCopy} from "@/features/tools/workflow-copy";
import {assetPath} from "@/lib/assets";
import {EvidenceProvenance} from "./evidence-provenance";
import {attachmentCreatorSource, attachmentRecipes, applyAttachmentRecipe} from "@/features/tools/attachment-recipes";
import {getAttachmentRecipeCopy} from "@/features/tools/attachment-recipe-copy";
import {encodeBudgetState} from "@/features/tools/share-state";
import {publicRoutePath} from "@/lib/public-url";

export function LoadoutPresetList({locale}: {locale: Locale}) {
  const t = getLoadoutPresetCopy(locale);
  const catalogue = getLoadoutCatalogue(locale);
  const items = new Map(catalogue.items.map((item) => [item.id, item]));
  const toolCopy = getToolCopy(locale);
  const workflowCopy = getWorkflowCopy(locale);
  const attachmentCopy = getAttachmentRecipeCopy(locale);

  return <section className="not-prose my-8 min-w-0 border-y border-[#354039] py-6" aria-label={t.heading}>
    <h2 className="text-xl font-semibold text-white">{t.heading}</h2>
    <p className="mt-3 text-sm leading-6 text-[#cbd5cf]">{t.notice}</p>
    <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{t.quantities}</p>
    <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{t.budgets}</p>
    <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
      {getLoadoutPresets(locale).map((preset) => <article key={preset.id} className="min-w-0 border border-[#354039] p-4 sm:p-5" data-loadout-preset={preset.id}>
        <h3 className="break-words text-lg font-semibold text-white">{preset.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#cbd5cf]">{preset.mission}</p>
        <ul aria-label={t.items} className="mt-4 divide-y divide-[#354039]">
          {preset.lines.map((line) => {
            const item = items.get(line.id);
            return <li key={line.id} className="flex min-w-0 items-start gap-3 py-3">
              {item?.image ? <Image src={assetPath(item.image)} alt={item.imageAlt ?? item.name} width={72} height={48} className="h-12 w-[72px] shrink-0 object-contain" /> : null}
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold text-white">{item?.name ?? line.id} <span className="font-normal text-[#a8b4ae]">(1)</span></p>
                <p className="mt-1 text-xs text-[#e4c35f]">{t.unknown}</p>
                {item ? <details className="mt-2 text-xs text-[#a8b4ae]"><summary className="cursor-pointer">{workflowCopy.evidence}</summary><EvidenceProvenance copy={toolCopy} {...item.evidence} />{item.evidence.sourceUrl ? <a href={item.evidence.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all text-[#7fd0a1]" title={`${workflowCopy.evidence}: ${item.name}`}>{toolCopy.openItem}</a> : null}</details> : null}
              </div>
            </li>;
          })}
        </ul>
        <dl className="mt-4 space-y-3 text-xs leading-5">
          <div><dt className="font-semibold text-white">{t.unlock}</dt><dd className="mt-1 text-[#a8b4ae]">{preset.unlock}</dd></div>
          <div><dt className="font-semibold text-white">{t.compatibility}</dt><dd className="mt-1 text-[#a8b4ae]">{preset.compatibility}</dd></div>
        </dl>
        <a className="mt-5 inline-flex min-h-11 max-w-full items-center gap-2 border border-[#397b59] px-3 py-2 text-sm font-semibold text-white hover:bg-[#244332]" href={getLoadoutPresetHref(preset, locale, catalogue.dataVersion)} title={`${t.open}: ${preset.title}`}><span className="min-w-0 break-words">{t.open}: {preset.title}</span><ArrowRight size={16} className="shrink-0" aria-hidden="true" /></a>
      </article>)}
    </div>
    <details className="mt-6 border-t border-[#354039] pt-4">
      <summary className="min-h-11 cursor-pointer font-semibold text-white">{attachmentCopy.title}</summary>
      <p className="mt-2 text-sm leading-6 text-[#a8b4ae]">{attachmentCopy.intro}</p>
      <ul className="mt-3 divide-y divide-[#354039]">{attachmentRecipes.map((recipe, index) => {
        const result = applyAttachmentRecipe({cash: 10_000, loadout: 0, vehicle: 0, reserve: 2_000}, recipe.id, catalogue);
        return <li className="space-y-2 py-3" key={recipe.id}>
          <p className="text-sm font-semibold text-white">{attachmentCopy.recipes[index]}</p>
          <p className="text-xs leading-5 text-[#a8b4ae]">{attachmentCopy.recipeNotes[index]}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {result.status === "applied" ? <a className="inline-flex min-h-11 items-center text-sm font-semibold text-[#84d5a5]" title={`${attachmentCopy.open}: ${attachmentCopy.recipes[index]}`} href={publicRoutePath(`/${locale}/tools/loadout-budget?${encodeBudgetState(result.state, catalogue.dataVersion)}#attachment-tests`)}>{attachmentCopy.open}</a> : null}
            <a className="inline-flex min-h-11 items-center text-sm text-[#84d5a5]" title={`${attachmentCopy.source}: ${attachmentCopy.recipes[index]}`} href={`${attachmentCreatorSource.url}&t=${recipe.seconds}s`} target="_blank" rel="noreferrer">{attachmentCopy.source}</a>
          </div>
        </li>;
      })}</ul>
    </details>
  </section>;
}
