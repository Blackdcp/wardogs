"use client";

import {useEffect, useRef} from "react";
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
  const timeReached = useRef(false);
  const depthReached = useRef(false);
  const sent = useRef(false);

  useEffect(() => {
    function sendWhenQualified() {
      if (sent.current || !timeReached.current || !depthReached.current) return;
      sent.current = true;
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
      depthReached.current = hasReachedScrollDepth(
        window.scrollY,
        window.innerHeight,
        documentHeight,
        SCROLL_THRESHOLD
      );
      sendWhenQualified();
    }

    const timer = window.setTimeout(() => {
      timeReached.current = true;
      sendWhenQualified();
    }, ENGAGEMENT_SECONDS * 1_000);

    checkDepth();
    window.addEventListener("scroll", checkDepth, {passive: true});
    window.addEventListener("resize", checkDepth);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", checkDepth);
      window.removeEventListener("resize", checkDepth);
    };
  }, [category, locale, slug]);

  return null;
}
