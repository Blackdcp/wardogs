import type {Locale} from "@/config/site";
import type {GuideSummary} from "@/content/guides";
import type {DiscoveryDestination, TrafficAsset} from "@/features/discovery/discovery-types";
import {buildCatalogueHomeModel} from "@/features/catalogue/catalogue-hub-data";
import {GUIDE_ROUTES} from "@/features/guides/guide-routes";
import {getToolDefinition, type ToolDefinition, type ToolId} from "@/features/tools/tool-registry";
import {getHomeProtectedDemand} from "./home-traffic-assets";
import type {HomeLiveIntelEntry} from "./home-live-intel";

export type HomeDiscoveryModel = {
  command: readonly DiscoveryDestination[];
  protectedDemand: readonly TrafficAsset[];
  liveIntel: readonly HomeLiveIntelEntry[];
  featuredTools: readonly ToolDefinition[];
  database: readonly DiscoveryDestination[];
  library: readonly DiscoveryDestination[];
};

function requiredTool(id: ToolId) {
  const tool = getToolDefinition(id);
  if (!tool) throw new Error(`Missing home tool: ${id}`);
  return tool;
}

export function getHomeCommandDestinations(locale: Locale): DiscoveryDestination[] {
  const weapons = buildCatalogueHomeModel(locale).destinations.find((entry) => entry.id === "weapons")!;
  return [
    {id: "search", href: "/", labelKey: "home.search.label", task: "search"},
    requiredTool("map"), requiredTool("artillery-calculator"), weapons,
    {id: "status", href: "/guides/wardogs-server-status", labelKey: "home.discovery.actions.serverStatus", task: "status"}
  ];
}

export function getHomeLibraryDestinations(): DiscoveryDestination[] {
  return [
    ...GUIDE_ROUTES.map((route) => ({id: `route-${route.key}`, href: `/guides#route-${route.key}`, labelKey: route.titleKey, task: "guides" as const})),
    {id: "guides", href: "/guides", labelKey: "home.discovery.actions.allGuides", task: "guides"},
    {id: "collections", href: "/guides#collection-combat", labelKey: "home.discovery.actions.collections", task: "guides"},
    {id: "videos", href: "/videos", labelKey: "home.discovery.actions.videos", task: "videos"},
    {id: "news", href: "/news", labelKey: "home.discovery.actions.news", task: "news"},
    {id: "about", href: "/about", labelKey: "home.discovery.actions.about", task: "about"}
  ];
}

export function buildHomeDiscoveryModel(locale: Locale, guides: readonly GuideSummary[], liveIntel: readonly HomeLiveIntelEntry[]): HomeDiscoveryModel {
  const protectedDemand = getHomeProtectedDemand(guides, locale);
  if (protectedDemand.length !== 6) throw new Error(`Homepage requires six protected guides for ${locale}`);
  return {
    command: getHomeCommandDestinations(locale), protectedDemand, liveIntel: liveIntel.slice(0, 3),
    featuredTools: (["weapon-compare", "loadout-budget", "logistics-planner", "system-check"] as const).map(requiredTool),
    database: buildCatalogueHomeModel(locale).destinations, library: getHomeLibraryDestinations()
  };
}
