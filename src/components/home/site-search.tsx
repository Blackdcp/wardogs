"use client";

import {ArrowRight, Search} from "lucide-react";
import {useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent} from "react";
import type {Locale} from "@/config/site";
import {createSiteSearchRecorder, recordSiteSearchResult} from "@/features/search/site-search-analytics";
import {
  getSearchKeyboardAction,
  searchSiteIndex,
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
};

type SiteSearchProps = {
  copy: SiteSearchCopy;
  index: readonly SiteSearchEntry[];
  locale: Locale;
};

function formatCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function localizedHref(locale: Locale, href: string) {
  return `/${locale}${href}`;
}

export function SiteSearch({copy, index, locale}: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const listboxRef = useRef<HTMLUListElement>(null);
  const results = useMemo(() => searchSiteIndex(index, query, 6), [index, query]);
  const recordSearch = useMemo(() => createSiteSearchRecorder(locale, "home"), [locale]);
  const selectedIndex = results.length === 0 ? -1 : Math.min(Math.max(activeIndex, 0), results.length - 1);
  const activeResult = selectedIndex >= 0 ? results[selectedIndex] : undefined;
  const hasQuery = query.trim().length > 0;
  const hasResults = isOpen && hasQuery && results.length > 0;

  useEffect(() => {
    if (selectedIndex < 0) return;
    listboxRef.current
      ?.querySelector<HTMLElement>(`[data-search-index="${selectedIndex}"]`)
      ?.scrollIntoView({block: "nearest"});
  }, [selectedIndex]);

  function openResult(result: SiteSearchEntry) {
    recordSearch(query, results.length);
    recordSiteSearchResult(query, result, locale, "home");
    window.location.assign(localizedHref(locale, result.href));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setActiveIndex(nextQuery.trim() ? 0 : -1);
    setIsOpen(Boolean(nextQuery.trim()));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && results.length === 0 && query.trim()) {
      recordSearch(query, 0);
      return;
    }
    const action = getSearchKeyboardAction(event.key, selectedIndex, results);
    if (action.type === "none") return;
    event.preventDefault();
    if (action.type === "select") {
      setActiveIndex(action.index);
      setIsOpen(true);
    } else if (action.type === "clear") {
      recordSearch(query, results.length);
      setQuery("");
      setActiveIndex(-1);
      setIsOpen(false);
    } else {
      setIsOpen(false);
      const result = results.find((entry) => entry.href === action.href);
      if (result) openResult(result);
    }
  }

  return (
    <section aria-labelledby="site-search-title" className="border-b border-[#26312c] bg-[#0d120f] py-6 sm:py-7" data-site-search>
      <div className="site-container grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[#79d19c]">{copy.eyebrow}</p>
          <h2 className="display-font mt-1 text-xl leading-tight text-white sm:text-2xl" id="site-search-title">{copy.title}</h2>
          <p className="mt-1 max-w-xl text-xs leading-5 text-[#a9b5af]">{copy.description}</p>
        </div>

        <div className="min-w-0">
          <label className="sr-only" htmlFor="site-search-input">{copy.label}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#82938a]" />
            <input
              aria-activedescendant={hasResults && activeResult ? `site-search-option-${selectedIndex}` : undefined}
              aria-autocomplete="list"
              aria-controls="site-search-results"
              aria-expanded={hasResults}
              aria-haspopup="listbox"
              autoComplete="off"
              className="h-14 w-full border border-[#526159] bg-[#151b18] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-[#75827b] focus:border-[#79d19c] focus:ring-2 focus:ring-[#79d19c]/35"
              id="site-search-input"
              onBlur={() => {recordSearch(query, results.length); setIsOpen(false);}}
              onChange={handleChange}
              onFocus={() => setIsOpen(Boolean(query.trim()))}
              onKeyDown={handleKeyDown}
              placeholder={copy.placeholder}
              role="combobox"
              type="search"
              value={query}
            />
            <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto border border-[#344039] bg-[#111613] shadow-2xl" data-site-search-results="stable" hidden={!hasResults} tabIndex={-1}>
              <ul
                aria-label={copy.resultCount.replace("{count}", String(results.length))}
                id="site-search-results"
                ref={listboxRef}
                role="listbox"
              >
                {results.map((result, resultIndex) => (
                  <li
                    aria-selected={resultIndex === selectedIndex}
                    className={`group grid min-h-[68px] cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#26312c] px-4 py-3 last:border-b-0 hover:bg-[#1a221e] ${resultIndex === selectedIndex ? "bg-[#1a221e] ring-2 ring-inset ring-[#79d19c]" : ""}`}
                    data-search-href={result.href}
                    data-search-index={resultIndex}
                    id={`site-search-option-${resultIndex}`}
                    key={result.id}
                    onClick={() => openResult(result)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(resultIndex)}
                    role="option"
                    title={`${copy.openResult}: ${result.title}`}
                  >
                    <span className="inline-flex min-w-14 justify-center border border-[#4b6255] px-2 py-1 text-[10px] font-semibold uppercase text-[#a9b5af]">
                      {copy.types[result.type]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#edf2ef] group-hover:text-[#79d19c]">{result.title}</span>
                      <span className="mt-1 block truncate text-xs text-[#82938a]">{result.category}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4 text-[#82938a] group-hover:text-[#79d19c]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p aria-live="polite" className="mt-1 min-h-5 text-xs leading-5 text-[#98a69f]">
            {!hasQuery ? copy.prompt : results.length === 0 ? copy.empty : formatCount(copy.resultCount, results.length)}
          </p>
        </div>
      </div>
    </section>
  );
}
