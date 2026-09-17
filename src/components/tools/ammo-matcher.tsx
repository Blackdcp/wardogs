"use client";

import Image from "next/image";
import {ArrowRight, Copy} from "lucide-react";
import {useMemo, useState} from "react";
import type {AmmoMatch, AmmoMatcherDataset} from "@/features/tools/ammo-matcher-data";
import {matchAmmoDataset} from "@/features/tools/ammo-matcher-runtime";
import {encodeAmmoMatcherState, type AmmoMatcherState} from "@/features/tools/share-state";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";
import {EvidenceProvenance} from "./evidence-provenance";

function MatchItem({copy, match}: {copy: ToolCopy; match: AmmoMatch}) {
  const label = match.state === "current"
    ? copy.currentEvidence
    : match.state === "historical"
      ? copy.historicalEvidence
      : copy.unknownEvidence;
  const tone = match.state === "current"
    ? "border-[#397b59] bg-[#173021] text-[#84d5a5]"
    : match.state === "historical"
      ? "border-[#806629] bg-[#2a2414] text-[#e4c35f]"
      : "border-[#46534d] bg-[#1a211e] text-[#a8b4ae]";
  return (
    <article className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-4 border-t border-[#354039] py-4">
      <Image alt={match.imageAlt} className="aspect-square w-20 object-contain" height={96} src={assetPath(match.image)} width={96} />
      <div className="min-w-0">
        <h3 className="break-words text-base font-bold text-white">{match.name}</h3>
        <p className="mt-1 break-words text-xs uppercase text-[#8fa098]">{match.relationshipValue}</p>
        <span className={`mt-2 inline-flex border px-2 py-1 text-[11px] font-semibold uppercase ${tone}`}>{label}</span>
        <EvidenceProvenance
          build={match.build}
          confidence={match.confidence}
          copy={copy}
          sourceClass={match.sourceClass}
          verifiedAt={match.verifiedAt}
        />
        {match.href ? (
          <Link className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-[#7fd0a1] hover:text-white" href={match.href} title={`${copy.openItem}: ${match.name}`}>
            {copy.openItem}<ArrowRight aria-hidden="true" size={13} />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function AmmoMatcher({
  copy,
  dataset,
  initialState,
}: {
  copy: ToolCopy;
  dataset: AmmoMatcherDataset;
  initialState: AmmoMatcherState;
}) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => matchAmmoDataset(dataset, state), [dataset, state]);

  function commit(next: AmmoMatcherState) {
    setState(next);
    setCopied(false);
    const url = new URL(window.location.href);
    url.search = encodeAmmoMatcherState(next);
    window.history.replaceState(null, "", url);
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = encodeAmmoMatcherState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-label={copy.ammoMatcherTitle}>
      <div className="grid gap-5 p-5 sm:grid-cols-2 md:p-8">
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.selectWeapon}
          <select className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white" value={state.weapon ?? ""} onChange={(event) => commit({...state, weapon: event.target.value || null})}>
            <option value="">{copy.selectWeapon}</option>
            {dataset.weapons.map((weapon) => <option key={weapon.slug} value={weapon.slug}>{weapon.name} - {weapon.subtype}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.selectAmmo}
          <select className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white" value={state.ammo ?? ""} onChange={(event) => commit({...state, ammo: event.target.value || null})}>
            <option value="">{copy.selectAmmo}</option>
            {dataset.ammo.map((ammo) => <option key={ammo.slug} value={ammo.slug}>{ammo.name}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
          <p className="max-w-2xl text-sm leading-6 text-[#d7bd68]">{copy.historicalWarning}</p>
          <button className="inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyLink} type="button" title={copy.copyToolLink}>
            <Copy aria-hidden="true" size={16} />{copied ? copy.copiedToolLink : copy.copyToolLink}
          </button>
        </div>
      </div>

      {!result.selectedWeapon && !result.selectedAmmo ? (
        <p className="border-t border-[#354039] px-5 py-10 text-center text-sm leading-6 text-[#a8b4ae] md:px-8">{copy.emptyMatcher}</p>
      ) : (
        <div className="grid border-t border-[#354039] md:grid-cols-2">
          <section className="min-w-0 p-5 md:p-8" aria-labelledby="weapon-ammo-results">
            <h2 className="display-font text-2xl text-white" id="weapon-ammo-results">{copy.weaponToAmmo}</h2>
            {result.selectedWeapon ? (
              result.ammoMatches.length > 0
                ? <div className="mt-4">{result.ammoMatches.map((match) => <MatchItem copy={copy} key={`${match.weaponSlug}-${match.ammoSlug}`} match={match} />)}</div>
                : <p className="mt-5 text-sm leading-6 text-[#a8b4ae]">{copy.noConfirmedAmmo}</p>
            ) : <p className="mt-5 text-sm leading-6 text-[#a8b4ae]">{copy.selectWeapon}</p>}
          </section>
          <section className="min-w-0 border-t border-[#354039] p-5 md:border-l md:border-t-0 md:p-8" aria-labelledby="ammo-weapon-results">
            <h2 className="display-font text-2xl text-white" id="ammo-weapon-results">{copy.ammoToWeapons}</h2>
            {result.selectedAmmo ? (
              result.weaponMatches.length > 0
                ? <div className="mt-4">{result.weaponMatches.map((match) => <MatchItem copy={copy} key={`${match.weaponSlug}-${match.ammoSlug}`} match={match} />)}</div>
                : <p className="mt-5 text-sm leading-6 text-[#a8b4ae]">{copy.noConfirmedWeapons}</p>
            ) : <p className="mt-5 text-sm leading-6 text-[#a8b4ae]">{copy.selectAmmo}</p>}
          </section>
        </div>
      )}
    </section>
  );
}
