import {ADSTERRA_SMARTLINK_URLS} from "./ad-policy";
import {getAdReportingMetadata} from "./ad-reporting";
import {ANALYTICS_EVENTS, isProductionHostname, trackAnalyticsEvent, type AnalyticsTarget} from "@/lib/analytics-events";
import {isSiteLocale} from "@/config/site";

// Exposure means this site's sponsored CTA was visible. It is not a vendor
// impression, a destination-page visit, or evidence of billable ad delivery.
export function observeSmartlink(link: HTMLAnchorElement, pathname: string, placement = "smartlink") {
  const document = link.ownerDocument;
  const view = document.defaultView;
  if (!view || !isProductionHostname(view.location.hostname)) return () => {};
  const safePlacement = /^[a-z0-9_-]{1,40}$/.test(placement) ? placement : "smartlink";
  const locale = document.documentElement.lang.toLowerCase();
  const parameters = {
    ...getAdReportingMetadata(pathname, ADSTERRA_SMARTLINK_URLS[0].id, safePlacement),
    format: "smartlink", placement: safePlacement,
    ...(isSiteLocale(locale) ? {locale} : {})
  };
  let active = true;
  let exposed = false;
  let visible = false;
  const report = (event: typeof ANALYTICS_EVENTS.adExposure | typeof ANALYTICS_EVENTS.adClick) => {
    try {
      trackAnalyticsEvent(event, parameters, view as Window & AnalyticsTarget);
    } catch {
      // Analytics must never block a visitor's link or the rest of the page.
    }
  };
  const checkExposure = () => {
    if (!active || exposed || !visible || document.hidden) return;
    exposed = true;
    report(ANALYTICS_EVENTS.adExposure);
  };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === link) visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
    }
    checkExposure();
  }, {threshold: [0, 0.5]});
  const clicked = (event: MouseEvent) => {
    if (!active || !event.isTrusted || event.defaultPrevented) return;
    if ((event.type === "click" && event.button === 0) || (event.type === "auxclick" && event.button === 1)) {
      report(ANALYTICS_EVENTS.adClick);
    }
  };
  observer?.observe(link);
  document.addEventListener("visibilitychange", checkExposure);
  link.addEventListener("click", clicked);
  link.addEventListener("auxclick", clicked);
  return () => {
    active = false;
    observer?.disconnect();
    document.removeEventListener("visibilitychange", checkExposure);
    link.removeEventListener("click", clicked);
    link.removeEventListener("auxclick", clicked);
  };
}
