"use client";

import {Search} from "lucide-react";
import {useEffect, useId, useMemo, useState} from "react";
import {flushSync} from "react-dom";
import type {Locale} from "@/config/site";
import type {CatalogueFilterOption, CatalogueRecord} from "@/features/catalogue/catalogue-types";
import {CatalogueCard} from "./catalogue-card";

export type CatalogueExplorerLabels = {
  heading: string;
  searchLabel: string;
  searchPlaceholder: string;
  allFilterLabel: string;
  resultLabel: string;
};

type CatalogueExplorerProps = {
  locale: Locale;
  records: readonly CatalogueRecord[];
  filters: readonly CatalogueFilterOption[];
  labels: CatalogueExplorerLabels;
  featuredImage?: string;
};

function normalizeSearchValue(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

export function filterCatalogueRecords(
  records: readonly CatalogueRecord[],
  search: string,
  activeFilter: string
): readonly CatalogueRecord[] {
  const terms = normalizeSearchValue(search).split(/\s+/).filter(Boolean);

  return records.filter((record) => {
    if (activeFilter !== "all" && !record.filterValues.includes(activeFilter)) return false;
    if (terms.length === 0) return true;

    const haystack = normalizeSearchValue([
      record.name,
      record.subtype,
      record.summary,
      ...record.facts.flatMap((fact) => [fact.label, fact.value])
    ].join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}

export function CatalogueExplorer({locale, records, filters, labels, featuredImage}: CatalogueExplorerProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const searchId = useId();
  const visibleRecords = useMemo(
    () => filterCatalogueRecords(records, search, activeFilter),
    [activeFilter, records, search]
  );
  const visibleSlugs = useMemo(() => new Set(visibleRecords.map((record) => record.slug)), [visibleRecords]);
  const recordIds = useMemo(
    () => new Set(records.map((record) => `record-${record.type}-${record.slug}`)),
    [records]
  );

  useEffect(() => {
    function revealRecord(recordId: string) {
      if (!recordIds.has(recordId)) return false;

      flushSync(() => {
        setSearch("");
        setActiveFilter("all");
      });
      requestAnimationFrame(() => {
        document.getElementById(recordId)?.scrollIntoView({block: "start"});
      });
      return true;
    }

    function handleRecordLinkClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#record-"]');
      if (!link) return;

      const recordId = decodeURIComponent(link.hash.slice(1));
      if (!revealRecord(recordId)) return;

      event.preventDefault();
      window.history.pushState(null, "", `#${recordId}`);
    }

    function handleHashChange() {
      const recordId = decodeURIComponent(window.location.hash.slice(1));
      revealRecord(recordId);
    }

    document.addEventListener("click", handleRecordLinkClick);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      document.removeEventListener("click", handleRecordLinkClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [recordIds]);

  return (
    <section aria-labelledby="catalogue-explorer-title" className="border-b border-[#2c3631] bg-[#101411]" data-catalogue-explorer>
      <div className="site-container py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display-font text-3xl leading-tight text-white md:text-4xl" id="catalogue-explorer-title">{labels.heading}</h2>
          <p aria-live="polite" className="font-mono text-xs uppercase leading-5 text-[#8bb59d]">
            {visibleRecords.length} / {records.length} {labels.resultLabel}
          </p>
        </div>

        <div className="mt-7 border-y border-[#303b35] py-5" data-catalogue-controls>
          <label className="block max-w-xl" htmlFor={searchId}>
            <span className="text-sm font-semibold text-[#d6ded9]">{labels.searchLabel}</span>
            <span className="relative mt-2 block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8e87]" />
              <input
                aria-label={labels.searchLabel}
                className="min-h-11 w-full border border-[#3b463f] bg-[#0d110f] py-2 pl-10 pr-3 text-base text-white placeholder:text-[#68746e]"
                id={searchId}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={labels.searchPlaceholder}
                type="search"
                value={search}
              />
            </span>
          </label>

          <div aria-label={`${labels.heading} filters`} className="mt-4 flex flex-wrap gap-2" role="group">
            {[{label: labels.allFilterLabel, value: "all"}, ...filters].map((filter) => {
              const selected = activeFilter === filter.value;
              return (
                <button
                  aria-pressed={selected}
                  className={`min-h-11 border px-4 py-2 text-sm font-semibold transition-colors ${selected ? "border-[#68bd8d] bg-[#204632] text-white" : "border-[#3b463f] bg-[#151b18] text-[#b6c1bb] hover:border-[#68bd8d] hover:text-white"}`}
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => (
            <CatalogueCard
              eagerImage={record.image === featuredImage}
              hidden={!visibleSlugs.has(record.slug)}
              key={record.slug}
              locale={locale}
              record={record}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
