"use client";

import Image from "next/image";
import {Copy, ExternalLink} from "lucide-react";
import {useMemo, useState, useSyncExternalStore} from "react";
import type {ComparableWeapon, ToolEvidenceState, WeaponComparisonValue} from "@/features/tools/weapon-compare-data";
import {compareWeaponOptions} from "@/features/tools/weapon-compare-runtime";
import {decodeWeaponCompareState, encodeWeaponCompareState, type WeaponCompareState} from "@/features/tools/share-state";
import type {ToolCopy} from "@/features/tools/tool-copy";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";
import {EvidenceProvenance} from "./evidence-provenance";

const emptySearch = () => "";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function stateLabel(state: ToolEvidenceState, copy: ToolCopy) {
  if (state === "current") return copy.currentEvidence;
  if (state === "historical") return copy.historicalEvidence;
  return copy.unknownEvidence;
}

function stateClass(state: ToolEvidenceState) {
  if (state === "current") return "border-[#397b59] bg-[#173021] text-[#84d5a5]";
  if (state === "historical") return "border-[#806629] bg-[#2a2414] text-[#e4c35f]";
  return "border-[#46534d] bg-[#1a211e] text-[#a8b4ae]";
}

function fieldLabel(key: string, fallback: string, copy: ToolCopy) {
  const labels: Record<string, string> = {
    role: copy.fieldRole,
    price: copy.fieldPrice,
    ammunition: copy.fieldAmmunition,
    fireModes: copy.fieldFireModes,
    weight: copy.fieldWeight,
    progression: copy.fieldProgression,
    "change:Required level": copy.fieldRequiredLevel,
  };
  return labels[key] ?? fallback;
}

function FieldValue({copy, value}: {copy: ToolCopy; value: WeaponComparisonValue}) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4">
      <p className="break-words text-sm font-semibold leading-6 text-white">{value.value ?? copy.unknownEvidence}</p>
      <span className={`mt-2 inline-flex border px-2 py-1 text-[11px] font-semibold uppercase ${stateClass(value.state)}`}>
        {stateLabel(value.state, copy)}
      </span>
      <EvidenceProvenance
        build={value.build}
        confidence={value.confidence}
        copy={copy}
        sourceClass={value.sourceClass}
        verifiedAt={value.verifiedAt}
      />
      {value.sourceUrl ? (
        <a className="mt-2 inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-[#7fd0a1] hover:text-white" href={value.sourceUrl} rel="noreferrer" target="_blank" title={copy.openItem}>
          {copy.openItem}<ExternalLink aria-hidden="true" size={13} />
        </a>
      ) : null}
    </div>
  );
}

function WeaponHeader({weapon, copy}: {weapon: ComparableWeapon; copy: ToolCopy}) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4">
      <Image alt={weapon.imageAlt} className="aspect-[16/9] w-full object-contain" height={180} src={assetPath(weapon.image)} width={320} />
      <p className="mt-3 break-words text-base font-bold text-white">{weapon.name}</p>
      <p className="mt-1 text-xs uppercase text-[#8fa098]">{weapon.subtype}</p>
      <Link className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-[#7fd0a1] hover:text-white" href={weapon.href} title={`${copy.openItem}: ${weapon.name}`}>
        {copy.openItem}
      </Link>
    </div>
  );
}

export function WeaponCompare({
  copy,
  weapons,
  initialState,
}: {
  copy: ToolCopy;
  weapons: readonly ComparableWeapon[];
  initialState: WeaponCompareState;
}) {
  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, emptySearch);
  const sharedState = useMemo(() => search
    ? decodeWeaponCompareState(search, weapons.map(({slug}) => slug))
    : initialState, [search, weapons, initialState]);
  const [editedState, setEditedState] = useState<WeaponCompareState | null>(null);
  const state = editedState ?? sharedState;
  const [copied, setCopied] = useState(false);
  const comparison = useMemo(() => state.left && state.right
    ? compareWeaponOptions(weapons, state.left, state.right)
    : null, [state, weapons]);

  function commit(next: WeaponCompareState) {
    setEditedState(next);
    setCopied(false);
    const url = new URL(window.location.href);
    url.search = encodeWeaponCompareState(next);
    window.history.replaceState(null, "", url);
  }

  function updateLeft(left: string) {
    const right = state.right === left
      ? weapons.find(({slug}) => slug !== left)?.slug ?? null
      : state.right;
    commit({left, right});
  }

  function updateRight(right: string) {
    const left = state.left === right
      ? weapons.find(({slug}) => slug !== right)?.slug ?? null
      : state.left;
    commit({left, right});
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = encodeWeaponCompareState(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  }

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-label={copy.comparison}>
      <div className="grid gap-5 p-5 sm:grid-cols-2 md:p-8">
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.leftWeapon}
          <select className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white" value={state.left ?? ""} onChange={(event) => updateLeft(event.target.value)}>
            {weapons.map((weapon) => <option key={weapon.slug} value={weapon.slug}>{weapon.name} - {weapon.subtype}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#cbd5cf]">
          {copy.rightWeapon}
          <select className="min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 text-white" value={state.right ?? ""} onChange={(event) => updateRight(event.target.value)}>
            {weapons.map((weapon) => <option key={weapon.slug} value={weapon.slug}>{weapon.name} - {weapon.subtype}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
          <p className="max-w-2xl text-sm leading-6 text-[#d7bd68]">{copy.historicalWarning}</p>
          <button className="inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyLink} type="button" title={copy.copyToolLink}>
            <Copy aria-hidden="true" size={16} />{copied ? copy.copiedToolLink : copy.copyToolLink}
          </button>
        </div>
      </div>

      {comparison ? (
        <div className="border-t border-[#354039]">
          <h2 className="px-5 pt-7 text-sm font-semibold uppercase text-[#9ba9a2] md:px-8">{copy.comparison}</h2>
          <div className="mt-4 grid grid-cols-[minmax(5.75rem,0.55fr)_repeat(2,minmax(0,1fr))] border-y border-[#354039] bg-[#1b221f]">
            <div className="px-3 py-4 text-xs font-semibold uppercase text-[#7f8e87] sm:px-4">WARDOGS</div>
            <WeaponHeader copy={copy} weapon={comparison.left} />
            <WeaponHeader copy={copy} weapon={comparison.right} />
            {comparison.rows.map((row) => (
              <div className="contents" key={row.key}>
                <div className="border-t border-[#354039] px-3 py-4 text-xs font-semibold uppercase leading-5 text-[#8fa098] sm:px-4">{fieldLabel(row.key, row.label, copy)}</div>
                <div className="border-l border-t border-[#354039]"><FieldValue copy={copy} value={row.left} /></div>
                <div className="border-l border-t border-[#354039]"><FieldValue copy={copy} value={row.right} /></div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 px-5 py-8 md:grid-cols-2 md:px-8">
            {[comparison.left, comparison.right].map((weapon) => (
              <article className="min-w-0 border-t border-[#354039] pt-5" key={weapon.slug}>
                <h3 className="display-font text-2xl text-white">{weapon.name}</h3>
                <h4 className="mt-5 text-xs font-semibold uppercase text-[#69c78f]">{copy.strengths}</h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#c5d0ca]">{weapon.strengths.map((item) => <li className="border-l border-[#397b59] pl-3" key={item}>{item}</li>)}</ul>
                <h4 className="mt-6 text-xs font-semibold uppercase text-[#d9b455]">{copy.cautions}</h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#c5d0ca]">{weapon.cautions.map((item) => <li className="border-l border-[#806629] pl-3" key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
