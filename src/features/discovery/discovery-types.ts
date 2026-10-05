import type {Locale} from "@/config/site";

export const HOME_SECTIONS = ["command", "proven-demand", "live-intel", "workbench", "database", "library"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];

export const DISCOVERY_TASKS = [
  "search", "map", "calculator", "weapons", "vehicles", "status", "catalogue", "guides", "tools", "videos",
  "news", "cargo", "squad", "towers", "progression", "mortar", "fob", "controls", "helicopter", "settings",
  "pcFixes", "season2", "patchNotes", "money", "firstMatch", "loadout", "logistics", "systemCheck", "faq", "about"
] as const;
export type DiscoveryTask = (typeof DISCOVERY_TASKS)[number];

export type LegacyHomePlacement =
  | "hero" | "action-hub" | "discovery" | "intel" | "catalogue"
  | "recovery" | "routes" | "tools" | "collections" | "tactical-hub"
  | "editorial-path" | "editorial-priority";

export type DiscoveryDestination = {
  id: string;
  /** Canonical destination without a locale prefix. */
  href: string;
  labelKey: string;
  task: DiscoveryTask;
};

export type TrafficTier = "protected" | "growth" | "support";
export type TrafficAsset = DiscoveryDestination & {
  kind: "guide" | "catalogue" | "tool" | "status" | "hub";
  locales: readonly Locale[] | "all";
  tier: TrafficTier;
  evidenceKeys: readonly string[];
};

export function isHomeSection(value: unknown): value is HomeSection {
  return typeof value === "string" && HOME_SECTIONS.includes(value as HomeSection);
}

export function isDiscoveryTask(value: unknown): value is DiscoveryTask {
  return typeof value === "string" && DISCOVERY_TASKS.includes(value as DiscoveryTask);
}
