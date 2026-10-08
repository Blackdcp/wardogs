import Script from "next/script";
import {PRODUCTION_HOSTNAMES} from "@/lib/analytics-events";
import {sanitizeAnalyticsUrl} from "@/lib/analytics-page-context";

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
          var sanitizeUrl = (${sanitizeAnalyticsUrl.toString()});
          var rawGtag = window.gtag || function () { window.dataLayer.push(arguments); };
          var currentRoute = sanitizeUrl(window.location.href, false);
          var referrer = sanitizeUrl(document.referrer, false);
          function pageContext(href) {
            return {page_location: sanitizeUrl(href), page_referrer: referrer};
          }
          function safeCommand(command) {
            var args = Array.from(command);
            if (args[0] === 'event' || (args[0] === 'config' && args[1] === '${GOOGLE_TAG_ID}')) {
              args[2] = Object.assign({}, args[2] || {}, pageContext(window.location.href));
            }
            return args;
          }
          for (var i = 0; i < window.dataLayer.length; i++) {
            var queued = window.dataLayer[i];
            if (queued && (queued[0] === 'event' || queued[0] === 'config')) window.dataLayer[i] = safeCommand(queued);
          }
          window.gtag = function () { return rawGtag.apply(this, safeCommand(arguments)); };
          var gtag = window.gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
          // Keep the vendor's automatic page views. Config updates only refresh URL context.
          function updateContext(href) {
            var route = sanitizeUrl(href, false);
            if (route !== currentRoute) { referrer = currentRoute; currentRoute = route; }
            rawGtag('config', '${GOOGLE_TAG_ID}', Object.assign({update: true}, pageContext(href)));
          }
          ['pushState', 'replaceState'].forEach(function (method) {
            var original = window.history[method];
            window.history[method] = function () {
              var next = arguments[2] == null ? window.location.href : new URL(arguments[2], window.location.href).href;
              if (new URL(next).origin !== window.location.origin) return original.apply(this, arguments);
              var previousRoute = currentRoute;
              var previousReferrer = referrer;
              updateContext(next);
              try { return original.apply(this, arguments); }
              catch (error) {
                currentRoute = previousRoute;
                referrer = previousReferrer;
                rawGtag('config', '${GOOGLE_TAG_ID}', Object.assign({update: true}, pageContext(window.location.href)));
                throw error;
              }
            };
          });
          ['popstate', 'hashchange', 'pageshow'].forEach(function (name) {
            window.addEventListener(name, function () { updateContext(window.location.href); });
          });
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
