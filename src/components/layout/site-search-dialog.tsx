"use client";

import {ArrowRight, LoaderCircle, Search, X} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import type {Locale} from "@/config/site";
import {createSiteSearchRecorder, recordSiteSearchResult, type SiteSearchSource} from "@/features/search/site-search-analytics";
import {getNextSearchSelection, searchSiteIndex, type SiteSearchEntry} from "@/features/search/site-search-runtime";
import {useRouter} from "@/i18n/navigation";

const indexCache = new Map<Locale, readonly SiteSearchEntry[]>();
const loadingLabels: Partial<Record<Locale, string>> = {"zh-tw": "搜尋載入中", pl: "Wczytywanie wyników"};

type SiteSearchDialogProps = {
  compact?: boolean;
  placeholder?: string;
  source?: SiteSearchSource;
  trigger?: "header" | "hero";
};

export function SiteSearchDialog({compact = false, placeholder, source = "header", trigger = "header"}: SiteSearchDialogProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [index, setIndex] = useState<readonly SiteSearchEntry[]>(indexCache.get(locale) ?? []);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchSiteIndex(index, query, 8), [index, query]);
  const recordSearch = useMemo(() => createSiteSearchRecorder(locale, source), [locale, source]);
  const closeSearch = useCallback(() => {
    if (!loading && !failed) recordSearch(query, results.length);
    setOpen(false);
  }, [loading, failed, recordSearch, query, results.length]);

  const openSearch = useCallback(() => {
    const cachedIndex = indexCache.get(locale);
    if (cachedIndex) {
      setIndex(cachedIndex);
      setLoading(false);
      setFailed(false);
    } else {
      setLoading(true);
      setFailed(false);
    }
    setOpen(true);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (indexCache.has(locale)) return;
    const controller = new AbortController();
    let active = true;
    fetch(`/api/search-index/${locale}`, {signal: controller.signal})
      .then((response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json() as Promise<SiteSearchEntry[]>;
      })
      .then((entries) => {
        if (!active) return;
        indexCache.set(locale, entries);
        setIndex(entries);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      })
      .finally(() => {if (active) setLoading(false);});
    return () => {active = false; controller.abort();};
  }, [open, locale]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") closeSearch();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, closeSearch]);

  function openResult(result: SiteSearchEntry) {
    recordSearch(query, results.length);
    recordSiteSearchResult(query, result, locale, source);
    setOpen(false);
    setQuery("");
    router.push(result.href);
  }

  const searchPlaceholder = placeholder ?? t("home.search.placeholder");
  const triggerButton = trigger === "hero" ? (
    <button
      aria-label={t("home.search.label")}
      className="group relative flex w-full items-center justify-between rounded-xl border border-[#4a6a53] bg-[#0f1813]/90 px-4 py-3.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all hover:border-[#79d19c] hover:bg-[#14241a] focus-visible:ring-2 focus-visible:ring-[#79d19c]"
      data-hero-search-trigger="true"
      onClick={openSearch}
      title={t("home.search.label")}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-3">
        <Search aria-hidden="true" className="size-5 shrink-0 text-[#79d19c] transition-colors group-hover:text-white" />
        <span className="truncate text-sm text-[#c3cec8] group-hover:text-[#f3faf6]">
          {searchPlaceholder}
        </span>
      </span>
      <span className="hidden shrink-0 rounded-md border border-[#35523d] bg-[#1a2e21] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#8ce2ad] group-hover:border-[#69c78f] group-hover:text-white sm:inline-flex">
        {locale === "zh-cn" || locale === "zh-tw" ? "打开搜索" : "Open Search"}
      </span>
    </button>
  ) : (
    <button
      aria-label={t("home.search.label")}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] border border-[#344c3b] text-[#d8f4e4] transition-colors hover:bg-[#244332] ${compact ? "size-11" : "min-h-11 px-3"}`}
      onClick={openSearch}
      title={t("home.search.label")}
      type="button"
    >
      <Search aria-hidden="true" className="size-5" />
      {!compact && <span className="text-xs font-semibold">{t("home.search.label")}</span>}
    </button>
  );

  return (
    <>
      {triggerButton}
      {open && createPortal(
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/75 px-4 py-14" onMouseDown={(event) => {if (event.target === event.currentTarget) closeSearch();}}>
          <section aria-label={t("home.search.label")} aria-modal="true" className="mx-auto w-full max-w-2xl border border-[#536a58] bg-[#111713] p-4 shadow-2xl sm:p-6" role="dialog">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="display-font text-2xl text-white">{t("home.search.title")}</h2>
              <button aria-label={t("common.closeMenu")} className="inline-flex size-11 items-center justify-center text-[#b8c3bd] hover:text-white" onClick={closeSearch} type="button"><X aria-hidden="true" /></button>
            </div>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#82938a]" />
              <input
                aria-label={t("home.search.label")}
                aria-controls="global-site-search-results"
                aria-expanded={Boolean(query.trim() && results.length)}
                aria-autocomplete="list"
                autoComplete="off"
                className="h-14 w-full border border-[#526159] bg-[#151b18] pl-12 pr-4 text-white outline-none focus:border-[#79d19c]"
                onChange={(event) => {setQuery(event.target.value); setSelected(0);}}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (results[selected]) openResult(results[selected]);
                    else if (!loading && !failed && query.trim()) recordSearch(query, 0);
                  } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                    event.preventDefault();
                    setSelected(getNextSearchSelection(selected, event.key as "ArrowDown" | "ArrowUp" | "Home" | "End", results.length));
                  }
                }}
                placeholder={searchPlaceholder}
                ref={inputRef}
                role="combobox"
                type="search"
                value={query}
              />
            </div>
            <div aria-live="polite" className="mt-4 min-h-6 text-sm text-[#a8b4ae]">
              {loading ? <LoaderCircle aria-label={loadingLabels[locale] ?? "Loading"} className="size-5 animate-spin" /> : failed ? <a className="text-[#79d19c] underline" href={`/${locale}#site-search-title`} title={t("home.search.label")}>{t("home.search.label")}</a> : !query.trim() ? t("home.search.prompt") : results.length === 0 ? t("home.search.empty") : t("home.search.resultCount", {count: results.length})}
            </div>
            <ul className="mt-3 max-h-[min(55vh,520px)] overflow-y-auto" id="global-site-search-results" role="listbox">
              {query.trim() && results.map((result, position) => (
                <li aria-selected={selected === position} className={`border-t border-[#2d3a31] ${selected === position ? "bg-[#1e2d23]" : ""}`} key={result.id} role="option">
                  <button className="flex min-h-14 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#244332]" onClick={() => openResult(result)} onMouseEnter={() => setSelected(position)} type="button">
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{result.title}</span><span className="block truncate text-xs text-[#9caea1]">{t(`home.search.types.${result.type}`)} · {result.category}</span></span>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[#79d19c]" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>, document.body
      )}
    </>
  );
}
