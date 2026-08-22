"use client";

import {useEffect} from "react";
import type {Locale} from "@/config/site";
import {getTrackedLinkEvent, trackAnalyticsEvent} from "@/lib/analytics-events";

export function SiteAnalytics({locale}: {locale: Locale}) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const trackedEvent = getTrackedLinkEvent(link.href, window.location.origin, {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH,
        officialDestination: link.dataset.analyticsDestination
      });
      if (!trackedEvent) return;

      trackAnalyticsEvent(trackedEvent.name, {
        ...trackedEvent.parameters,
        locale,
        page_path: window.location.pathname,
        link_text: link.textContent?.trim().slice(0, 100) || "unlabeled"
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [locale]);

  return null;
}
