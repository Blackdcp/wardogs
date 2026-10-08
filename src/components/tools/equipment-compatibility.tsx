"use client";

import {hasSharedToolState, markToolShare} from "@/features/tools/tool-analytics";
import {useToolAnalytics} from "./use-tool-analytics";

import Image from "next/image";
import {Check, Copy, ExternalLink, ImageOff, Search} from "lucide-react";
import {useMemo, useState, useSyncExternalStore} from "react";
import type {Locale} from "@/config/site";
import type {CompatibilityDataset} from "@/features/tools/equipment-compatibility";
import {getCompatibilityCopy} from "@/features/tools/equipment-compatibility-copy";
import {decodeCompatibilitySelection, filterCompatibilityEntries, writeCompatibilitySelection, type CompatibilitySelection} from "@/features/tools/equipment-compatibility-runtime";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";
import {formatLocalizedDate} from "@/lib/localized-date";

function subscribeLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function EquipmentCompatibility({dataset, locale}: {dataset: CompatibilityDataset; locale: Locale}) {
  const copy = getCompatibilityCopy(locale);
  const search = useSyncExternalStore(subscribeLocation, () => window.location.search, () => "");
  const shared = useMemo(() => decodeCompatibilitySelection(search, dataset.weapons.map(({slug}) => slug)), [search, dataset]);
  const analytics = useToolAnalytics("equipment-compatibility", locale, !shared.invalid && hasSharedToolState(search, writeCompatibilitySelection(new URL("https://analytics.invalid"), shared.selection).search, ["fitWeapon", "fitKind", "fitQuery", "fitNamed"], "equipment-compatibility"));
  const [edited, setEdited] = useState<{search: string; selection: CompatibilitySelection} | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const selection = edited?.search === search ? edited.selection : shared.selection;
  const entries = filterCompatibilityEntries(dataset.attachments, selection);
  const weaponNames = new Map(dataset.weapons.map(({slug, name}) => [slug, name]));

  function commit(next: CompatibilitySelection) {
    analytics.engage();
    const url = writeCompatibilitySelection(new URL(window.location.href), next);
    setEdited({search: url.search, selection: next});
    setCopyState("idle");
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  async function copySelection() {
    analytics.beginShare();
    const url = writeCompatibilitySelection(new URL(window.location.href), selection);
    markToolShare(url, "equipment-compatibility");
    try { await navigator.clipboard.writeText(url.toString()); analytics.shareCopied(); setCopyState("copied"); }
    catch { setCopyState("failed"); }
  }

  return (
    <section className="mt-12 border-t border-[#354039] pt-8" id="equipment-compatibility" aria-labelledby="compatibility-title" data-compatibility-matrix>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <h2 className="text-2xl font-bold leading-tight text-white" id="compatibility-title">{copy.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#b7c3bd]">{copy.intro}</p>
        </div>
        <button aria-label={copy.copy} className="flex size-11 shrink-0 items-center justify-center border border-[#495a51] text-[#80cea1] hover:bg-[#193023]" onClick={copySelection} title={copy.copy} type="button">
          {copyState === "copied" ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
        </button>
      </header>
      <p aria-live="polite" className="mt-2 text-xs text-[#dfc56b]">{copyState === "copied" ? copy.copied : copyState === "failed" ? copy.failed : shared.invalid && !edited ? copy.invalid : ""}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="grid min-w-0 gap-2 text-sm text-[#c4d0c9]">{copy.weapon}
          <select aria-label={copy.weapon} className="min-h-11 w-full min-w-0 border border-[#495a51] bg-[#101411] px-3 text-white" value={selection.weapon} onChange={(event) => commit({...selection, weapon: event.target.value, namedOnly: event.target.value ? selection.namedOnly : false})}>
            <option value="">{copy.allWeapons}</option>
            {dataset.weapons.map(({slug, name}) => <option key={slug} value={slug}>{name}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm text-[#c4d0c9]">{copy.kind}
          <select aria-label={copy.kind} className="min-h-11 w-full min-w-0 border border-[#495a51] bg-[#101411] px-3 text-white" value={selection.kind} onChange={(event) => commit({...selection, kind: event.target.value as CompatibilitySelection["kind"]})}>
            <option value="all">{copy.all}</option><option value="magazine">{copy.magazine}</option><option value="optic">{copy.optic}</option>
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm text-[#c4d0c9]">{copy.search}
          <span className="flex min-h-11 items-center gap-2 border border-[#495a51] bg-[#101411] px-3"><Search aria-hidden="true" className="shrink-0" size={16} /><input className="w-full min-w-0 bg-transparent text-white outline-none" maxLength={120} value={selection.query} onChange={(event) => commit({...selection, query: event.target.value})} /></span>
        </label>
      </div>
      <label className="mt-4 flex min-h-11 items-center gap-3 text-sm text-[#b7c3bd] has-disabled:opacity-50"><input checked={selection.namedOnly} disabled={!selection.weapon} onChange={(event) => commit({...selection, namedOnly: event.target.checked})} type="checkbox" />{copy.namedOnly}</label>
      <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label={copy.title}>
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="border-y border-[#495a51] text-xs text-[#a9bbb1]"><tr>{[copy.item, copy.named, copy.specification, copy.current].map((label) => <th className="px-3 py-3 font-semibold" key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{entries.map((entry) => <tr className="border-b border-[#354039] align-top" key={entry.slug} data-fit="unknown">
            <th className="w-[40%] px-3 py-4 font-normal" scope="row">
              <div className="flex items-start gap-3">
                {entry.image ? <Image alt={entry.imageAlt ?? entry.name} className="size-14 shrink-0 object-contain" height={56} loading="lazy" src={assetPath(entry.image)} width={56} /> : <ImageOff aria-hidden="true" className="size-8 shrink-0 text-[#8b9992]" />}
                <div className="min-w-0"><p className="break-words font-semibold text-white">{entry.name}</p><span className="mt-1 block text-xs text-[#dfc56b]">{copy.historical}</span>
                  <details className="mt-2 text-xs leading-5 text-[#a9bbb1]"><summary className="cursor-pointer text-[#80cea1]">{copy.evidence}</summary>
                    <p className="mt-2">{copy.version}: {entry.evidence.build}</p>
                    <p>{copy.checked}: {formatLocalizedDate(entry.evidence.verifiedAt, locale)}</p>
                    <p className="mt-2">{copy.purchase}: {copy.unitUnknown}</p>
                    <p className="mt-2">{copy.scope}</p>
                    {entry.evidence.sourceUrl ? <a className="mt-2 inline-flex min-h-9 items-center gap-1 text-[#80cea1]" href={entry.evidence.sourceUrl} rel="noreferrer" target="_blank" title={`${copy.source}: ${entry.name}`}>{copy.source}<ExternalLink aria-hidden="true" size={12} /></a> : <Link className="mt-2 inline-flex min-h-9 text-[#80cea1]" href="/editorial-policy" title={copy.archive}>{copy.archive}</Link>}
                  </details>
                </div>
              </div>
            </th>
            <td className="px-3 py-4 text-[#c4d0c9]">{entry.namedWeapons.length ? entry.namedWeapons.map((slug) => weaponNames.get(slug)).join(" / ") : copy.notNamed}</td>
            <td className="px-3 py-4 text-[#c4d0c9]">{entry.historicalSpecification?.replace(/rounds$/, copy.rounds) ?? copy.unknown}</td>
            <td className="px-3 py-4 text-[#dfc56b]">{copy.unknown}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {!entries.length ? <p className="border-b border-[#354039] py-5 text-sm text-[#c4d0c9]" role="status">{copy.empty}</p> : null}
      <h3 className="mt-6 text-base font-semibold text-white">{copy.checklist}</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#b7c3bd]">{copy.checks.map((check) => <li key={check}>{check}</li>)}</ol>
    </section>
  );
}
