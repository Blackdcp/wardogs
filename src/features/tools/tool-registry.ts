import type {DiscoveryTask} from "@/features/discovery/discovery-types";

export type ToolId = "map" | "artillery-calculator" | "weapon-compare" | "ammo-matcher" | "loadout-budget" | "cash-xp-calculator" | "logistics-planner" | "progression-route" | "system-check";
export type ToolGroup = "combat" | "economy" | "logistics" | "progression" | "fixes";
export type ToolDefinition = {
  id: ToolId;
  href: `/tools/${string}`;
  labelKey: string;
  descriptionKey: string;
  task: DiscoveryTask;
  searchType: "tool" | "map";
  group: ToolGroup;
  relatedGuideSlugs: readonly string[];
};
export const TOOL_GROUPS: readonly ToolGroup[] = ["combat", "economy", "logistics", "progression", "fixes"];

export const TOOL_REGISTRY = [
  {id: "map", href: "/tools/map", labelKey: "nav.interactiveMap", descriptionKey: "toolsHub.tools.map.description", task: "map", searchType: "map", group: "combat", relatedGuideSlugs: ["wardogs-map", "wardogs-infantry-mode"]},
  {id: "artillery-calculator", href: "/tools/artillery-calculator", labelKey: "nav.artilleryCalculator", descriptionKey: "toolsHub.tools.artillery-calculator.description", task: "calculator", searchType: "tool", group: "combat", relatedGuideSlugs: ["wardogs-artillery-guide", "wardogs-mortar-guide"]},
  {id: "weapon-compare", href: "/tools/weapon-compare", labelKey: "nav.weaponCompare", descriptionKey: "toolsHub.tools.weapon-compare.description", task: "weapons", searchType: "tool", group: "combat", relatedGuideSlugs: ["wardogs-best-weapons-loadouts"]},
  {id: "ammo-matcher", href: "/tools/ammo-matcher", labelKey: "nav.ammoMatcher", descriptionKey: "toolsHub.tools.ammo-matcher.description", task: "loadout", searchType: "tool", group: "combat", relatedGuideSlugs: ["wardogs-ammo-reload-guide"]},
  {id: "loadout-budget", href: "/tools/loadout-budget", labelKey: "nav.budgetTool", descriptionKey: "toolsHub.tools.loadout-budget.description", task: "loadout", searchType: "tool", group: "economy", relatedGuideSlugs: ["wardogs-money-guide", "wardogs-equipment-tools-guide", "wardogs-best-weapons-loadouts"]},
  {id: "cash-xp-calculator", href: "/tools/cash-xp-calculator", labelKey: "nav.cashXpCalculator", descriptionKey: "toolsHub.tools.cash-xp-calculator.description", task: "money", searchType: "tool", group: "economy", relatedGuideSlugs: ["wardogs-money-guide", "wardogs-progression-wipes-guide"]},
  {id: "logistics-planner", href: "/tools/logistics-planner", labelKey: "nav.logisticsPlanner", descriptionKey: "toolsHub.tools.logistics-planner.description", task: "logistics", searchType: "tool", group: "logistics", relatedGuideSlugs: ["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-oil-rig-guide", "wardogs-fob-layouts", "wardogs-money-guide"]},
  {id: "progression-route", href: "/tools/progression-route", labelKey: "nav.progressionRoute", descriptionKey: "toolsHub.tools.progression-route.description", task: "progression", searchType: "tool", group: "progression", relatedGuideSlugs: ["wardogs-progression-wipes-guide", "wardogs-achievements", "wardogs-season-2"]},
  {id: "system-check", href: "/tools/system-check", labelKey: "nav.systemCheck", descriptionKey: "toolsHub.tools.system-check.description", task: "systemCheck", searchType: "tool", group: "fixes", relatedGuideSlugs: ["wardogs-best-settings", "wardogs-crash-fix", "wardogs-system-requirements"]}
] as const satisfies readonly ToolDefinition[];

export function getToolDefinition(id: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((tool) => tool.id === id);
}
