"use client";

import {useEffect} from "react";
import type {Locale} from "@/config/site";
import {ANALYTICS_EVENTS, hasReachedScrollDepth, trackAnalyticsEvent} from "@/lib/analytics-events";

const ENGAGEMENT_SECONDS = 60;
const SCROLL_THRESHOLD = 0.75;

export function GuideEngagementTracker({
  locale,
  slug,
  category
}: {
  locale: Locale;
  slug: string;
  category: string;
}) {
  useEffect(() => {
    let remainingMs = ENGAGEMENT_SECONDS * 1_000;
    let visibleSince: number | null = null;
    let timer: number | undefined;
    let depthReached = false;
    let sent = false;

    function sendWhenQualified() {
      if (sent || remainingMs > 0 || !depthReached || document.visibilityState !== "visible") return;
      sent = true;
      trackAnalyticsEvent(ANALYTICS_EVENTS.engagedGuide, {
        guide_slug: slug,
        guide_category: category,
        locale,
        engagement_seconds: ENGAGEMENT_SECONDS,
        scroll_percent: SCROLL_THRESHOLD * 100
      });
    }

    function checkDepth() {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0
      );
      depthReached = hasReachedScrollDepth(
        window.scrollY,
        window.innerHeight,
        documentHeight,
        SCROLL_THRESHOLD
      );
      sendWhenQualified();
    }

    function pauseTimer() {
      window.clearTimeout(timer);
      timer = undefined;
      if (visibleSince !== null) {
        remainingMs = Math.max(0, remainingMs - (performance.now() - visibleSince));
        visibleSince = null;
      }
    }

    // Background tabs must not satisfy the reading-time threshold.
    function handleVisibilityChange() {
      if (document.visibilityState !== "visible") {
        pauseTimer();
        return;
      }

      checkDepth();
      if (sent || remainingMs <= 0 || visibleSince !== null) return;
      visibleSince = performance.now();
      timer = window.setTimeout(() => {
        pauseTimer();
        handleVisibilityChange();
      }, remainingMs);
    }

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", checkDepth, {passive: true});
    window.addEventListener("resize", checkDepth);
    return () => {
      pauseTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", checkDepth);
      window.removeEventListener("resize", checkDepth);
    };
  }, [category, locale, slug]);

  return null;
}
