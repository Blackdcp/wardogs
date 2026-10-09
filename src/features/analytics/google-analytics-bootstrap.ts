import {PRODUCTION_HOSTNAMES} from "@/lib/analytics-events";
import {sanitizeAnalyticsUrl} from "@/lib/analytics-page-context";
import {installAnalyticsHistoryPrivacy} from "@/lib/analytics-history";

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
          var installHistoryPrivacy = (${installAnalyticsHistoryPrivacy.toString()});
          installHistoryPrivacy(window.dataLayer, sanitizeUrl);
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
          function queuedCommand() { return arguments; }
          for (var i = 0; i < window.dataLayer.length; i++) {
            var queued = window.dataLayer[i];
            // gtag's command protocol uses Arguments objects. Array entries
            // queued by early React effects need the same protocol shape.
            if (queued && (queued[0] === 'event' || queued[0] === 'config')) window.dataLayer[i] = queuedCommand.apply(null, safeCommand(queued));
          }
          window.gtag = function () { return rawGtag.apply(this, safeCommand(arguments)); };
          var gtag = window.gtag;
          // Hydration can queue events before this afterInteractive bootstrap.
          // Configure their destination before the first event, retaining the
          // exact ordering of consent/set commands around those events.
          // This site does not opt visitors into Google's advertising data uses.
          // Supply defaults only when no consent implementation has queued a
          // command. Never alter a CMP's defaults, regional rules or updates.
          var hasConsent = window.dataLayer.some(function (command) {
            return command && command[0] === 'consent';
          });
          var firstEvent = window.dataLayer.findIndex(function (command) { return command && command[0] === 'event'; });
          var pending = firstEvent < 0 ? [] : window.dataLayer.splice(firstEvent);
          if (!hasConsent) gtag('consent', 'default', {ad_user_data: 'denied', ad_personalization: 'denied'});
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
          pending.forEach(function (command) { window.dataLayer.push(command); });
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
