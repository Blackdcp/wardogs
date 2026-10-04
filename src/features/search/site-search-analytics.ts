import type {Locale} from "@/config/site";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";
import type {SiteSearchEntry} from "./site-search-runtime";

// Search input is user-generated. Exclude contact details and URLs from analytics.
export function safeSearchTerm(query: string): string | null {
  const term = query.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (term.length < 2 || term.length > 80) return null;
  if (/[\r\n@:/\\]/.test(term) || /(?:www\.|\.com\b|\.net\b|\.org\b)/i.test(term)) return null;
  if (/\d[\d\s().-]{6,}\d/.test(term)) return null;
  return term;
}

export type SiteSearchSource = "home" | "header" | "hero";

export function recordSiteSearch(query: string, resultCount: number, locale: Locale, source: SiteSearchSource) {
  const searchTerm = safeSearchTerm(query);
  if (!searchTerm) return;
  const parameters = {search_term: searchTerm, result_count: resultCount, locale, search_source: source};
  trackAnalyticsEvent(ANALYTICS_EVENTS.siteSearch, parameters);
  if (resultCount === 0) trackAnalyticsEvent(ANALYTICS_EVENTS.siteSearchNoResults, parameters);
}

// One query can finish through Enter, blur and a result click. Record that
// outcome once per mounted search surface; never record each keystroke.
export function createSiteSearchRecorder(locale: Locale, source: SiteSearchSource) {
  let previous: string | null = null;
  return (query: string, resultCount: number) => {
    const term = safeSearchTerm(query);
    if (!term) return;
    const key = JSON.stringify([term, resultCount]);
    if (key === previous) return;
    previous = key;
    recordSiteSearch(term, resultCount, locale, source);
  };
}

export function recordSiteSearchResult(query: string, result: SiteSearchEntry, locale: Locale, source: SiteSearchSource) {
  const searchTerm = safeSearchTerm(query);
  if (!searchTerm) return;
  trackAnalyticsEvent(ANALYTICS_EVENTS.siteSearchResultOpen, {
    search_term: searchTerm,
    result_type: result.type,
    result_id: result.id,
    locale,
    search_source: source
  });
}
