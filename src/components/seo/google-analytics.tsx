import Script from "next/script";
import {PRODUCTION_HOSTNAMES} from "@/lib/analytics-events";

export {
  createAnalyticsEventCommand,
  getTrackedLinkEvent,
  hasReachedScrollDepth,
  trackAnalyticsEvent
} from "@/lib/analytics-events";

export const GOOGLE_TAG_ID = "G-0GJ404WEYV";

export function googleAnalyticsScriptSrc() {
  return `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
}

export function googleAnalyticsConfigScript() {
  return `
        (function () {
          if (!${JSON.stringify(PRODUCTION_HOSTNAMES)}.includes(window.location.hostname.toLowerCase())) return;
          if (document.getElementById('wardogs-google-tag')) return;
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
          var gtag = window.gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
          var loader = document.createElement('script');
          loader.id = 'wardogs-google-tag';
          loader.async = true;
          loader.src = '${googleAnalyticsScriptSrc()}';
          document.head.appendChild(loader);
        })();
        `;
}

export function GoogleAnalytics() {
  return (
      <Script id="google-analytics" strategy="afterInteractive">
        {googleAnalyticsConfigScript()}
      </Script>
  );
}
