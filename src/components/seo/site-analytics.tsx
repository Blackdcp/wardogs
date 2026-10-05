"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import type {Locale} from "@/config/site";
import {getDiscoveryClickEvent, getHomeTaskClickEvent, LEGACY_HOME_TASKS} from "@/features/analytics/discovery-taxonomy";
import {ANALYTICS_EVENTS, getTrackedLinkEvent, installAnalyticsPageViewLifecycle, notifyAnalyticsLocationChange, trackAnalyticsEvent} from "@/lib/analytics-events";

export function installSiteAnalytics(locale: Locale) {
    const legacyTasks = new Set<string>(LEGACY_HOME_TASKS);
    const cleanupPageViews = installAnalyticsPageViewLifecycle();
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLElement & {href?: string}>("a[href], button[data-home-task]");
      if (!link) return;
      const href = link.href ?? link.dataset.homeTarget;
      if (!href) return;

      const context = {locale, pagePath: window.location.pathname, origin: window.location.origin, basePath: process.env.NEXT_PUBLIC_BASE_PATH};
      const discoveryEvent = getDiscoveryClickEvent(link.dataset, href, context);
      const homeEvent = discoveryEvent ? null : getHomeTaskClickEvent(link.dataset, href, context);
      if (discoveryEvent) trackAnalyticsEvent(discoveryEvent.name, discoveryEvent.parameters);
      if (homeEvent) {
        trackAnalyticsEvent(homeEvent.name, homeEvent.parameters);
        // Only home_task_click is canonical. This separate event preserves historical reports.
        if (legacyTasks.has(homeEvent.parameters.task)) {
          trackAnalyticsEvent(`${ANALYTICS_EVENTS.homeTaskClick}_${homeEvent.parameters.task}`, {...homeEvent.parameters, legacy_compat: true});
        }
      }

      const trackedEvent = getTrackedLinkEvent(href, window.location.origin, {
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
    return () => {
      document.removeEventListener("click", handleClick);
      cleanupPageViews();
    };
}

export function SiteAnalytics({locale}: {locale: Locale}) {
  const pathname = usePathname();
  useEffect(() => installSiteAnalytics(locale), [locale]);
  useEffect(() => notifyAnalyticsLocationChange(), [pathname]);

  return null;
}
