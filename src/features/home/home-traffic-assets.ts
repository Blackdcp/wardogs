import type {Locale} from "@/config/site";
import type {DiscoveryTask, TrafficAsset} from "@/features/discovery/discovery-types";

const priorityGuideTasks = {
  "wardogs-infantry-mode": "map",
  "wardogs-season-2": "season2",
  "wardogs-server-status": "status",
  "wardogs-patch-notes": "patchNotes",
  "wardogs-beginner-guide": "firstMatch",
  "wardogs-money-guide": "money",
  "wardogs-progression-wipes-guide": "progression",
  "wardogs-best-weapons-loadouts": "loadout",
  "wardogs-community-servers-guide": "status",
  "wardogs-known-issues": "pcFixes",
  "wardogs-download": "guides",
  "wardogs-controls": "controls",
  "wardogs-map": "map",
  "wardogs-early-access": "guides",
  "wardogs-price": "guides",
  "wardogs-system-requirements": "systemCheck",
  "wardogs-linux-proton": "pcFixes",
  "wardogs-fob-guide": "fob",
  "wardogs-crash-fix": "pcFixes",
  "wardogs-squad-guide": "squad",
  "wardogs-mortar-guide": "mortar",
  "wardogs-towers-guide": "towers",
  "wardogs-cargo-guide": "cargo",
  "wardogs-best-settings": "settings",
  "wardogs-artillery-guide": "calculator",
  "wardogs-equipment-tools-guide": "loadout",
  "wardogs-ammo-reload-guide": "weapons"
} as const satisfies Readonly<Record<string, DiscoveryTask>>;
type PriorityGuideSlug = keyof typeof priorityGuideTasks;

// Frozen pre-upgrade entries. Replacements require evidence and an equally visible hub handoff.
export const LOCALIZED_PRIORITY_SLUGS = {
  en: ["wardogs-infantry-mode", "wardogs-community-servers-guide", "wardogs-crash-fix", "wardogs-season-2", "wardogs-mortar-guide", "wardogs-artillery-guide"],
  ja: ["wardogs-infantry-mode", "wardogs-squad-guide", "wardogs-mortar-guide", "wardogs-towers-guide", "wardogs-best-weapons-loadouts", "wardogs-cargo-guide"],
  ru: ["wardogs-infantry-mode", "wardogs-crash-fix", "wardogs-mortar-guide", "wardogs-best-settings", "wardogs-progression-wipes-guide", "wardogs-squad-guide"],
  de: ["wardogs-infantry-mode", "wardogs-best-weapons-loadouts", "wardogs-best-settings", "wardogs-progression-wipes-guide", "wardogs-crash-fix", "wardogs-season-2"],
  "zh-cn": ["wardogs-infantry-mode", "wardogs-map", "wardogs-mortar-guide", "wardogs-equipment-tools-guide", "wardogs-crash-fix", "wardogs-season-2"],
  "zh-tw": ["wardogs-infantry-mode", "wardogs-map", "wardogs-mortar-guide", "wardogs-equipment-tools-guide", "wardogs-crash-fix", "wardogs-season-2"],
  "pt-br": ["wardogs-infantry-mode", "wardogs-beginner-guide", "wardogs-squad-guide", "wardogs-money-guide", "wardogs-best-settings", "wardogs-mortar-guide"],
  pl: ["wardogs-infantry-mode", "wardogs-progression-wipes-guide", "wardogs-crash-fix", "wardogs-ammo-reload-guide", "wardogs-community-servers-guide", "wardogs-season-2"]
} as const satisfies Readonly<Record<Locale, readonly PriorityGuideSlug[]>>;

export const TOP_GUIDE_SLUGS = [
  "wardogs-infantry-mode", "wardogs-season-2", "wardogs-server-status", "wardogs-patch-notes",
  "wardogs-beginner-guide", "wardogs-money-guide", "wardogs-progression-wipes-guide", "wardogs-best-weapons-loadouts",
  "wardogs-community-servers-guide", "wardogs-known-issues", "wardogs-download", "wardogs-controls",
  "wardogs-map", "wardogs-early-access", "wardogs-price", "wardogs-system-requirements",
  "wardogs-linux-proton", "wardogs-fob-guide", "wardogs-crash-fix"
] as const satisfies readonly PriorityGuideSlug[];

function getPriorityLocale(locale?: string): Locale | undefined {
  return locale && Object.hasOwn(LOCALIZED_PRIORITY_SLUGS, locale) ? locale as Locale : undefined;
}

export function getHomePriorityGuideEntries<T extends {slug: string}>(guides: readonly T[], locale?: string): T[] {
  const priorityLocale = getPriorityLocale(locale);
  const local = priorityLocale ? LOCALIZED_PRIORITY_SLUGS[priorityLocale] : [];
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const priorities = [...new Set<PriorityGuideSlug>([...local, ...TOP_GUIDE_SLUGS])];
  return priorities.flatMap((slug) => {
    const guide = bySlug.get(slug);
    return guide ? [guide] : [];
  }).slice(0, 6);
}

export function getHomeProtectedDemand(guides: readonly {slug: string}[], locale?: string): TrafficAsset[] {
  const priorityLocale = getPriorityLocale(locale);
  const local = new Set<PriorityGuideSlug>(priorityLocale ? LOCALIZED_PRIORITY_SLUGS[priorityLocale] : []);
  return getHomePriorityGuideEntries(guides, locale).map(({slug}) => {
    // The selector only returns the finite keys present in the priority lists.
    const prioritySlug = slug as PriorityGuideSlug;
    const task = priorityGuideTasks[prioritySlug];
    const isLocal = priorityLocale !== undefined && local.has(prioritySlug);
    return {
      id: prioritySlug,
      href: `/guides/${prioritySlug}`,
      labelKey: `home.discovery.tasks.${task}`,
      task,
      kind: "guide",
      locales: isLocal ? [priorityLocale] : "all",
      tier: isLocal ? "protected" : "support",
      evidenceKeys: [`spec-baseline:home-priority:${isLocal ? priorityLocale : "global"}`]
    };
  });
}
