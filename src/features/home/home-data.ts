import {seasonOneChanges, type SeasonOneChange} from "@/features/catalogue/catalogue-evidence";

export const HOME_FACT_KEYS = ["earlyAccess", "players", "teams", "controlZone"] as const;
export type HomeFactKey = (typeof HOME_FACT_KEYS)[number];

export function getHomeFacts(translate: (key: HomeFactKey) => string): string[] {
  return HOME_FACT_KEYS.map(translate);
}

export const START_GUIDES = [
  {number: "1", slug: "wardogs-beginner-guide", titleKey: "beginner"},
  {number: "2", slug: "wardogs-money-guide", titleKey: "money"},
  {number: "3", slug: "wardogs-progression-wipes-guide", titleKey: "progression"},
  {number: "4", slug: "wardogs-best-weapons-loadouts", titleKey: "loadouts"},
  {number: "5", slug: "wardogs-community-servers-guide", titleKey: "communityServers"},
  {number: "6", slug: "wardogs-known-issues", titleKey: "issues"}
] as const;

export const HOME_ACTIONS = [
  {key: "firstMatch", href: "/guides/wardogs-beginner-guide"},
  {key: "money", href: "/guides/wardogs-money-guide"},
  {key: "progression", href: "/guides/wardogs-progression-wipes-guide"},
  {key: "weapons", href: "/guides/wardogs-best-weapons-loadouts"},
  {key: "logistics", href: "/guides/wardogs-fob-guide"},
  {key: "vehicles", href: "/items/vehicles"},
  {key: "controls", href: "/guides/wardogs-controls"},
  {key: "pcFixes", href: "/guides/wardogs-crash-fix"}
] as const;

export const HOME_CATEGORY_GUIDES = [
  {key: "access", slug: "wardogs-launch-checklist"},
  {key: "release", slug: "wardogs-release-date"},
  {key: "store", slug: "wardogs-steam"},
  {key: "platform", slug: "wardogs-ps5"},
  {key: "video", slug: "wardogs-trailer"},
  {key: "community", slug: "wardogs-discord"},
  {key: "developer", slug: "wardogs-game-developers"},
  {key: "guide", slug: "wardogs-gameplay"}
] as const;

export const TOP_GUIDE_SLUGS = [
  "wardogs-season-2",
  "wardogs-server-status",
  "wardogs-patch-notes",
  "wardogs-beginner-guide",
  "wardogs-money-guide",
  "wardogs-progression-wipes-guide",
  "wardogs-best-weapons-loadouts",
  "wardogs-community-servers-guide",
  "wardogs-known-issues",
  "wardogs-download",
  "wardogs-controls",
  "wardogs-map",
  "wardogs-early-access",
  "wardogs-price",
  "wardogs-system-requirements",
  "wardogs-linux-proton",
  "wardogs-fob-guide",
  "wardogs-crash-fix"
] as const;

export type RecentlyUpdatedGuideInput = {
  slug: string;
  updatedAt: string;
  order?: number;
};

export function getRecentlyUpdatedGuides<T extends RecentlyUpdatedGuideInput>(guides: readonly T[], limit = 6): T[] {
  return [...guides]
    .sort((a, b) => {
      const dateCompare = Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      if (dateCompare !== 0) return dateCompare;
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);
}

export const CONFIRMED_RUMOR_ITEMS = [
  {status: "confirmed", titleKey: "season02", slug: "wardogs-season-2"},
  {status: "confirmed", titleKey: "steamEarlyAccess", slug: "wardogs-early-access"},
  {status: "confirmed", titleKey: "patch011", slug: "wardogs-patch-notes"},
  {status: "rumor", titleKey: "ps5Release", slug: "wardogs-ps5"}
] as const;

export function getHomePriorityGuides<T extends RecentlyUpdatedGuideInput>(guides: readonly T[]) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const top = TOP_GUIDE_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((guide): guide is T => Boolean(guide))
    .slice(0, 6);

  return {
    top,
    recent: getRecentlyUpdatedGuides(guides, 3),
    status: CONFIRMED_RUMOR_ITEMS
  } as const;
}

const homeBuildChangeEntities = [
  ["fobVendor", "FOB vendor"],
  ["largeHammer", "Large Hammer vendor"],
  ["artilleryTank", "Artillery Tank career unlock"],
  ["ural", "URAL unlock"],
  ["duneBuggy", "Dune Buggy unlock"],
  ["deagle", "Deagle required level"]
] as const;

export type HomeBuildChange = SeasonOneChange & {
  key: (typeof homeBuildChangeEntities)[number][0];
};

export function getHomeCurrentBuildChanges(): HomeBuildChange[] {
  return homeBuildChangeEntities.map(([key, entity]) => {
    const change = seasonOneChanges.find((candidate) => candidate.entity === entity);
    if (!change) throw new Error(`Missing approved Season 1 evidence for ${entity}`);
    return {...change, key};
  });
}

export const BEGINNER_TIP_KEYS = ["objective", "economy", "support", "mobility"] as const;
export const HOME_FAQ_KEYS = ["game", "release", "controlZone", "official"] as const;
