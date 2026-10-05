"use client";

import {useEffect} from "react";
import type {Locale} from "@/config/site";
import {isHomeSection, type HomeSection} from "@/features/discovery/discovery-types";
import {ANALYTICS_EVENTS, ANALYTICS_PAGE_VIEW_EVENT, normalizeAnalyticsPathname, trackAnalyticsEvent} from "@/lib/analytics-events";

export function installHomeSectionAnalytics(locale: Locale) {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return () => {};
  let observer: IntersectionObserver;
  let active = true;
  let seen = new Set<HomeSection>();
  let pagePath = normalizeAnalyticsPathname(window.location.pathname, process.env.NEXT_PUBLIC_BASE_PATH);
  const observe = () => {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const section = (entry.target as HTMLElement).dataset.homeSectionSentinel;
        if (!active || !entry.isIntersecting || !isHomeSection(section) || seen.has(section) || pagePath !== `/${locale}`) continue;
        seen.add(section);
        trackAnalyticsEvent(ANALYTICS_EVENTS.homeSectionView, {section, locale, page_path: pagePath});
      }
    }, {rootMargin: `-${window.innerHeight / 4}px 0px -${window.innerHeight / 4}px 0px`, threshold: 0});
    for (const sentinel of document.querySelectorAll<HTMLElement>("[data-home-section-sentinel]")) {
      if (isHomeSection(sentinel.dataset.homeSectionSentinel)) observer.observe(sentinel);
    }
  };
  const resize = () => {
    observer.disconnect();
    observe();
  };
  const reset = (event: Event) => {
    const detail = (event as CustomEvent<{page_path?: string}>).detail;
    pagePath = normalizeAnalyticsPathname(detail?.page_path ?? window.location.pathname, process.env.NEXT_PUBLIC_BASE_PATH);
    seen = new Set();
    observer.disconnect();
    observe();
  };
  observe();
  window.addEventListener(ANALYTICS_PAGE_VIEW_EVENT, reset);
  window.addEventListener("resize", resize);
  return () => {
    active = false;
    observer.disconnect();
    window.removeEventListener(ANALYTICS_PAGE_VIEW_EVENT, reset);
    window.removeEventListener("resize", resize);
  };
}

export function HomeSectionAnalytics({locale}: {locale: Locale}) {
  useEffect(() => installHomeSectionAnalytics(locale), [locale]);
  return null;
}

export function HomeSectionSentinel({section}: {section: HomeSection}) {
  return <span aria-hidden="true" className="block h-px w-px" data-home-section-sentinel={section} />;
}
