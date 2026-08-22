import {officialLinks} from "@/config/site";

export const ANALYTICS_EVENTS = {
  engagedGuide: "engaged_guide",
  catalogueItemOpen: "catalogue_item_open",
  videoStart: "video_start",
  officialOutboundClick: "official_outbound_click",
  languageSwitch: "language_switch",
  catalogueFilter: "catalogue_filter"
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
export type AnalyticsParameters = Record<string, string | number | boolean>;
export type AnalyticsCommand = ["event", AnalyticsEventName | string, AnalyticsParameters];
export type AnalyticsTarget = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

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

  const command = createAnalyticsEventCommand(name, parameters);
  if (analyticsTarget.gtag) {
    analyticsTarget.gtag(...command);
    return;
  }

  analyticsTarget.dataLayer ??= [];
  analyticsTarget.dataLayer.push(command);
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
  const itemMatch = routePathname.match(/^\/(?:en|ru|de|pt-br)\/items\/([^/]+)\/([^/]+)\/?$/);
  if (!itemMatch) return null;

  return {
    name: ANALYTICS_EVENTS.catalogueItemOpen,
    parameters: {
      item_slug: decodeURIComponent(itemMatch[2]),
      item_type: decodeURIComponent(itemMatch[1]),
      link_url: targetUrl.href
    }
  };
}
