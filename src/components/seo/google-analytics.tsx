import Script from "next/script";
import {googleAnalyticsConfigScript} from "@/features/analytics/google-analytics-bootstrap";
export {GOOGLE_TAG_ID, googleAnalyticsConfigScript, googleAnalyticsScriptSrc} from "@/features/analytics/google-analytics-bootstrap";

export {
  createAnalyticsEventCommand,
  getTrackedLinkEvent,
  hasReachedScrollDepth,
  trackAnalyticsEvent
} from "@/lib/analytics-events";

export function GoogleAnalytics() {
  return (
      <Script id="google-analytics" strategy="afterInteractive">
        {googleAnalyticsConfigScript()}
      </Script>
  );
}
