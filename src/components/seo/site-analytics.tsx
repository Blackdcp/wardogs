"use client";

import {useEffect} from "react";
import type {Locale} from "@/config/site";
import {ANALYTICS_EVENTS, getTrackedLinkEvent, trackAnalyticsEvent} from "@/lib/analytics-events";

const HOME_TASKS = [
  "weapons",
  "vehicles",
  "map",
  "calculator",
  "status",
  "catalogue",
  "season2",
  "firstMatch",
  "money",
  "progression",
  "logistics",
  "controls",
  "pcFixes",
  "videos",
  "guides",
  "faq",
  "about"
] as const;

const HOME_TASK_SET = new Set<string>(HOME_TASKS);

export function SiteAnalytics({locale}: {locale: Locale}) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const homeTask = link.dataset.homeTask;
      if (homeTask && HOME_TASK_SET.has(homeTask)) {
        const parameters = {
          task: homeTask,
          placement: link.dataset.homePlacement || "unknown",
          locale,
          page_path: window.location.pathname,
          link_url: link.href
        };
        trackAnalyticsEvent(ANALYTICS_EVENTS.homeTaskClick, parameters);
        trackAnalyticsEvent(`${ANALYTICS_EVENTS.homeTaskClick}_${homeTask}`, parameters);
      }

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
