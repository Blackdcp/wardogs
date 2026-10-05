import {isSiteLocale, officialLinks} from "@/config/site";

export const ANALYTICS_EVENTS = {
  homeTaskClick: "home_task_click",
  homeSectionView: "home_section_view",
  discoveryClick: "discovery_click",
  engagedGuide: "engaged_guide",
  catalogueItemOpen: "catalogue_item_open",
  videoStart: "video_start",
  videoEmbedOpen: "video_embed_open",
  toolStart: "tool_start",
  toolResult: "tool_result",
  toolAction: "tool_action",
  mapAction: "map_action",
  adStatus: "ad_status",
  officialOutboundClick: "official_outbound_click",
  languageSwitch: "language_switch",
  catalogueFilter: "catalogue_filter",
  siteSearch: "search",
  siteSearchNoResults: "site_search_no_results",
  siteSearchResultOpen: "site_search_result_open"
} as const;

export const PRODUCTION_HOSTNAMES = ["wardogswiki.com", "www.wardogswiki.com"] as const;

export function isProductionHostname(hostname: string) {
  return PRODUCTION_HOSTNAMES.some((allowed) => allowed === hostname.toLowerCase());
}

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
export type AnalyticsParameters = Record<string, string | number | boolean>;
export type AnalyticsCommand = ["event", AnalyticsEventName | string, AnalyticsParameters];
export type AnalyticsTarget = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export const ANALYTICS_PAGE_VIEW_EVENT = "wardogs:analytics-page-view";
const pageLocations = new WeakMap<Window, string>();

/** Route fields never contain query strings or fragments, including share state. */
export function normalizeAnalyticsPathname(value: string, basePath = "") {
  let pathname: string;
  try {pathname = new URL(value, "https://analytics.invalid").pathname;} catch {return "/";}
  pathname = pathnameWithoutBasePath(pathname, basePath).replace(/\/+$/, "");
  return pathname || "/";
}

export function notifyAnalyticsPageView(pagePath?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ANALYTICS_PAGE_VIEW_EVENT, {
    detail: {page_path: normalizeAnalyticsPathname(pagePath ?? window.location.pathname, process.env.NEXT_PUBLIC_BASE_PATH)}
  }));
}

/** Coalesce the router, native-history and popstate notifications for one navigation. */
export function notifyAnalyticsLocationChange(force = false) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const location = `${url.origin}${url.pathname}${url.search}`;
  const previous = pageLocations.get(window);
  pageLocations.set(window, location);
  if (force || (previous !== undefined && previous !== location)) notifyAnalyticsPageView();
}

export function installAnalyticsPageViewLifecycle() {
  notifyAnalyticsLocationChange();
  const handlePopstate = () => notifyAnalyticsLocationChange();
  const handlePageshow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      notifyAnalyticsLocationChange(true);
    }
  };
  window.addEventListener("popstate", handlePopstate);
  window.addEventListener("pageshow", handlePageshow);
  const history = window.history;
  let active = true;
  const originals = history ? {pushState: history.pushState, replaceState: history.replaceState} : null;
  const wrap = (original: History["pushState"]): History["pushState"] => function (this: History, ...args) {
    original.apply(this, args);
    if (active) notifyAnalyticsLocationChange();
  };
  const pushState = originals ? wrap(originals.pushState) : null;
  const replaceState = originals ? wrap(originals.replaceState) : null;
  if (history && pushState && replaceState) {
    history.pushState = pushState;
    history.replaceState = replaceState;
  }
  return () => {
    active = false;
    window.removeEventListener("popstate", handlePopstate);
    window.removeEventListener("pageshow", handlePageshow);
    if (history && originals) {
      if (history.pushState === pushState) history.pushState = originals.pushState;
      if (history.replaceState === replaceState) history.replaceState = originals.replaceState;
    }
  };
}

type TrackedLinkOptions = {
  basePath?: string;
  officialDestination?: string;
};

export function createAnalyticsEventCommand(
  name: AnalyticsEventName | string,
  parameters: AnalyticsParameters
): AnalyticsCommand {
  return ["event", name, parameters];
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName | string,
  parameters: AnalyticsParameters,
  target?: AnalyticsTarget
) {
  const analyticsTarget = target ?? (typeof window === "undefined" ? undefined : window as AnalyticsTarget);
  if (!analyticsTarget) return;

  const safeParameters = name === "page_view" && typeof parameters.page_path === "string"
    ? {...parameters, page_path: normalizeAnalyticsPathname(parameters.page_path, process.env.NEXT_PUBLIC_BASE_PATH)}
    : parameters;
  const command = createAnalyticsEventCommand(name, safeParameters);
  if (name === "page_view" && typeof window !== "undefined" && analyticsTarget === window) {
    notifyAnalyticsPageView(typeof safeParameters.page_path === "string" ? safeParameters.page_path : window.location.pathname);
  }
  if (analyticsTarget.gtag) {
    analyticsTarget.gtag(...command);
    return;
  }

  analyticsTarget.dataLayer ??= [];
  analyticsTarget.dataLayer.push(command);
}

// Call only after a user edit. Repeated renders and equivalent verdicts are
// coalesced; raw configuration, coordinates and share URLs never enter GA.
export function createToolResultRecorder(
  tool: "cash-xp-calculator" | "loadout-budget",
  locale: string,
  target?: AnalyticsTarget
) {
  let previous: string | null = null;
  return (result: "cash_positive" | "cash_negative" | "reserve_met" | "reserve_missed" | "incomplete") => {
    if (result === previous) return;
    if (previous === null) trackAnalyticsEvent(ANALYTICS_EVENTS.toolStart, {tool, locale}, target);
    previous = result;
    trackAnalyticsEvent(ANALYTICS_EVENTS.toolResult, {tool, result, locale}, target);
  };
}

export function hasReachedScrollDepth(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
  threshold: number
) {
  if (documentHeight <= 0 || threshold <= 0 || threshold > 1) return false;
  return (Math.max(0, scrollY) + Math.max(0, viewportHeight)) / documentHeight >= threshold;
}

function comparableUrl(url: URL) {
  return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
}

function normalizedHostname(url: URL) {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

function normalizeBasePath(value: string) {
  const normalized = value.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
}

function pathnameWithoutBasePath(pathname: string, value: string) {
  const basePath = normalizeBasePath(value);
  if (!basePath || (pathname !== basePath && !pathname.startsWith(`${basePath}/`))) return pathname;
  return pathname.slice(basePath.length) || "/";
}

function officialDestinationFor(targetUrl: URL) {
  const hostname = normalizedHostname(targetUrl);
  const pathname = targetUrl.pathname.toLowerCase();

  if (hostname === "store.steampowered.com" && (
    pathname.startsWith("/app/1867240") || pathname.startsWith("/news/app/1867240")
  )) return "steam";
  if (hostname === "steamcommunity.com" && pathname.startsWith("/app/1867240")) return "steam_community";
  if (hostname === "bulkhead.com" && pathname.startsWith("/games/wardogs")) return "bulkhead";
  if (hostname === "team17.com" && pathname.startsWith("/games/wardogs")) return "team17";

  return null;
}

export function getTrackedLinkEvent(href: string, currentOrigin: string, options: TrackedLinkOptions = {}): {
  name: AnalyticsEventName;
  parameters: Record<string, string>;
} | null {
  let targetUrl: URL;
  try {
    targetUrl = new URL(href, currentOrigin);
  } catch {
    return null;
  }

  const officialDestination = Object.entries(officialLinks).find(([, officialHref]) => {
    return comparableUrl(new URL(officialHref)) === comparableUrl(targetUrl);
  });
  if (officialDestination) {
    return {
      name: ANALYTICS_EVENTS.officialOutboundClick,
      parameters: {destination: officialDestination[0], link_url: targetUrl.href}
    };
  }

  const officialRouteDestination = officialDestinationFor(targetUrl) ?? options.officialDestination;
  if (officialRouteDestination) {
    return {
      name: ANALYTICS_EVENTS.officialOutboundClick,
      parameters: {destination: officialRouteDestination, link_url: targetUrl.href}
    };
  }

  if (targetUrl.origin !== currentOrigin) return null;
  const routePathname = pathnameWithoutBasePath(
    targetUrl.pathname,
    options.basePath ?? process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  );
  const itemMatch = routePathname.match(/^\/([^/]+)\/items\/([^/]+)\/([^/]+)\/?$/);
  if (!itemMatch || !isSiteLocale(itemMatch[1])) return null;

  return {
    name: ANALYTICS_EVENTS.catalogueItemOpen,
    parameters: {
      item_slug: decodeURIComponent(itemMatch[3]),
      item_type: decodeURIComponent(itemMatch[2]),
      link_url: targetUrl.href
    }
  };
}
