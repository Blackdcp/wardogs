import type {Locale} from "@/config/site";
import {isSiteLocale} from "@/config/site";
import {isDiscoveryTask, isHomeSection, type DiscoveryTask, type HomeSection, type LegacyHomePlacement} from "@/features/discovery/discovery-types";
import {ANALYTICS_EVENTS, normalizeAnalyticsPathname, type AnalyticsEventName} from "@/lib/analytics-events";

export const LEGACY_HOME_TASKS = [
  "weapons", "vehicles", "map", "calculator", "status", "catalogue", "season2", "firstMatch", "money",
  "progression", "logistics", "controls", "pcFixes", "videos", "guides", "faq", "about"
] as const satisfies readonly DiscoveryTask[];
export type LegacyHomeTask = (typeof LEGACY_HOME_TASKS)[number];
export const LEGACY_HOME_PLACEMENTS = [
  "hero", "action-hub", "discovery", "intel", "catalogue", "recovery", "routes", "tools", "collections",
  "tactical-hub", "editorial-path", "editorial-priority"
] as const satisfies readonly LegacyHomePlacement[];
export const DISCOVERY_HUBS = ["guides", "catalogue", "tools"] as const;
export type DiscoveryHub = (typeof DISCOVERY_HUBS)[number];
export type HomePlacement = HomeSection | LegacyHomePlacement;

export type DiscoveryClickContext = {locale: Locale; pagePath: string; origin: string; basePath?: string};
type DiscoveryDataset = Record<string, string | undefined>;
type DiscoveryEvent = {name: AnalyticsEventName; parameters: Record<string, string>};

export function isHomePlacement(value: unknown): value is HomePlacement {
  return isHomeSection(value) || (typeof value === "string" && LEGACY_HOME_PLACEMENTS.includes(value as LegacyHomePlacement));
}

export function getDiscoveryTargetPath(href: string, context: Pick<DiscoveryClickContext, "origin" | "basePath">): string | null {
  let url: URL;
  try {url = new URL(href, context.origin);} catch {return null;}
  if (url.origin !== context.origin) return null;
  const pathname = normalizeAnalyticsPathname(url.pathname, context.basePath);
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isSiteLocale(segments[0])) segments.shift();
  return `/${segments.join("/")}`;
}

export function getHomeTaskClickEvent(dataset: DiscoveryDataset, href: string, context: DiscoveryClickContext): DiscoveryEvent | null {
  if (!isDiscoveryTask(dataset.homeTask) || !isHomePlacement(dataset.homePlacement)) return null;
  const pagePath = normalizeAnalyticsPathname(context.pagePath, context.basePath);
  if (pagePath !== `/${context.locale}`) return null;
  const targetPath = getDiscoveryTargetPath(href, context);
  if (targetPath === null) return null;
  const url = new URL(href, context.origin);
  return {
    name: ANALYTICS_EVENTS.homeTaskClick,
    parameters: {
      task: dataset.homeTask, placement: dataset.homePlacement, locale: context.locale, page_path: pagePath,
      target_path: targetPath, link_url: `${url.origin}${normalizeAnalyticsPathname(url.pathname)}`
    }
  };
}

export function getDiscoveryClickEvent(dataset: DiscoveryDataset, href: string, context: DiscoveryClickContext): DiscoveryEvent | null {
  const hub = dataset.discoveryHub;
  if (!hub || !DISCOVERY_HUBS.includes(hub as DiscoveryHub) || !isDiscoveryTask(dataset.discoveryTask)) return null;
  const hubPath = hub === "catalogue" ? "items" : hub;
  const pagePath = normalizeAnalyticsPathname(context.pagePath, context.basePath);
  if (pagePath !== `/${context.locale}/${hubPath}`) return null;
  const targetPath = getDiscoveryTargetPath(href, context);
  if (targetPath === null) return null;
  if (dataset.discoveryTarget && getDiscoveryTargetPath(dataset.discoveryTarget, context) !== targetPath) return null;
  return {
    name: ANALYTICS_EVENTS.discoveryClick,
    parameters: {hub, task: dataset.discoveryTask, locale: context.locale, page_path: pagePath, target_path: targetPath}
  };
}
