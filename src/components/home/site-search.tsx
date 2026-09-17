"use client";

import {ArrowRight, Search} from "lucide-react";
import {useMemo, useState, type ChangeEvent, type KeyboardEvent} from "react";
import type {Locale} from "@/config/site";
import {
  getSearchKeyboardAction,
  searchSiteIndex,
  type SiteSearchCounts,
  type SiteSearchEntry,
  type SiteSearchType
} from "@/features/search/site-search-runtime";

export type SiteSearchCopy = {
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  prompt: string;
  empty: string;
  resultCount: string;
  openResult: string;
  types: Record<SiteSearchType, string>;
  counts: Record<keyof SiteSearchCounts, string>;
};

type SiteSearchProps = {
  copy: SiteSearchCopy;
  counts: SiteSearchCounts;
  index: readonly SiteSearchEntry[];
  locale: Locale;
};

function formatCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function localizedHref(locale: Locale, href: string) {
  return `/${locale}${href}`;
}

export function SiteSearch({copy, counts, index, locale}: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = useMemo(() => searchSiteIndex(index, query, 6), [index, query]);
  const selectedIndex = results.length === 0 ? -1 : Math.min(Math.max(activeIndex, 0), results.length - 1);
  const activeResult = selectedIndex >= 0 ? results[selectedIndex] : undefined;
  const hasQuery = query.trim().length > 0;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setActiveIndex(nextQuery.trim() ? 0 : -1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const action = getSearchKeyboardAction(event.key, selectedIndex, results);
    if (action.type === "none") return;
    event.preventDefault();
    if (action.type === "select") {
      setActiveIndex(action.index);
    } else if (action.type === "clear") {
      setQuery("");
      setActiveIndex(-1);
    } else {
      window.location.assign(localizedHref(locale, action.href));
    }
  }

  return (
    <section aria-labelledby="site-search-title" className="border-b border-[#26312c] bg-[#0d120f] py-12 sm:py-14" data-site-search>
      <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase text-[#79d19c]">{copy.eyebrow}</p>
          <h2 className="display-font mt-3 text-3xl leading-tight text-white sm:text-4xl" id="site-search-title">{copy.title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#a9b5af] sm:text-base">{copy.description}</p>
          <dl className="mt-7 grid grid-cols-2 border-y border-[#344039] sm:grid-cols-4 lg:grid-cols-2">
            {(Object.keys(counts) as (keyof SiteSearchCounts)[]).map((key) => (
              <div className="min-h-20 border-[#344039] py-4 pr-4 odd:border-r sm:not-last:border-r lg:even:border-r-0" key={key}>
                <dt className="text-[11px] uppercase text-[#82938a]">{copy.counts[key]}</dt>
                <dd className="display-font mt-1 text-2xl text-[#edf2ef]">{counts[key]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <label className="sr-only" htmlFor="site-search-input">{copy.label}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#82938a]" />
            <input
              aria-activedescendant={activeResult ? `site-search-option-${selectedIndex}` : undefined}
              aria-autocomplete="list"
              aria-controls="site-search-results"
              aria-expanded={hasQuery}
              autoComplete="off"
              className="h-14 w-full border border-[#526159] bg-[#151b18] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-[#75827b] focus:border-[#79d19c] focus:ring-2 focus:ring-[#79d19c]/35"
              id="site-search-input"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={copy.placeholder}
              role="combobox"
              type="search"
              value={query}
            />
          </div>

          <div aria-live="polite" className="h-[308px] overflow-y-auto border-x border-b border-[#344039] bg-[#111613]" data-site-search-results="stable" id="site-search-results">
            {!hasQuery ? (
              <p className="px-5 py-6 text-sm leading-6 text-[#98a69f]">{copy.prompt}</p>
            ) : results.length === 0 ? (
              <p className="px-5 py-6 text-sm leading-6 text-[#c4cec8]">{copy.empty}</p>
            ) : (
              <>
                <p className="border-b border-[#26312c] px-5 py-3 text-xs uppercase text-[#82938a]">
                  {formatCount(copy.resultCount, results.length)}
                </p>
                <ul aria-label={copy.resultCount.replace("{count}", String(results.length))} role="listbox">
                  {results.map((result, resultIndex) => (
                    <li aria-selected={resultIndex === selectedIndex} id={`site-search-option-${resultIndex}`} key={result.id} role="option">
                      <a
                        title={`${copy.openResult}: ${result.title}`}
                        className={`group grid min-h-[72px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#26312c] px-4 py-3 outline-none last:border-b-0 hover:bg-[#1a221e] focus-visible:bg-[#1a221e] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#79d19c] ${resultIndex === selectedIndex ? "bg-[#1a221e]" : ""}`}
                        href={localizedHref(locale, result.href)}
                        onMouseEnter={() => setActiveIndex(resultIndex)}
                      >
                        <span className="inline-flex min-w-14 justify-center border border-[#4b6255] px-2 py-1 text-[10px] font-semibold uppercase text-[#a9b5af]">
                          {copy.types[result.type]}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-[#edf2ef] group-hover:text-[#79d19c]">{result.title}</span>
                          <span className="mt-1 block truncate text-xs text-[#82938a]">{result.category}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="size-4 text-[#82938a] group-hover:text-[#79d19c]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
