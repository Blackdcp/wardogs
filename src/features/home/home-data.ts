export const HOME_FACT_KEYS = ["earlyAccess", "players", "teams", "controlZone"] as const;
export type HomeFactKey = (typeof HOME_FACT_KEYS)[number];

export function getHomeFacts(translate: (key: HomeFactKey) => string): string[] {
  return HOME_FACT_KEYS.map(translate);
}

export const START_GUIDES = [
  {number: "1", slug: "wardogs-beta", titleKey: "playtest"},
  {number: "2", slug: "wardogs-download", titleKey: "download"},
  {number: "3", slug: "wardogs-controls", titleKey: "controls"},
  {number: "4", slug: "wardogs-known-issues", titleKey: "issues"},
  {number: "5", slug: "wardogs-100k-clip-contest", titleKey: "contest"},
  {number: "6", slug: "wardogs-launch-checklist", titleKey: "launch"}
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
  "wardogs-beta",
  "wardogs-known-issues",
  "wardogs-100k-clip-contest",
  "wardogs-download",
  "wardogs-controls",
  "wardogs-launch-checklist",
  "wardogs-playtest",
  "wardogs-early-access",
  "wardogs-release-date",
  "wardogs-price",
  "wardogs-system-requirements",
  "wardogs-beginner-guide",
  "wardogs-best-weapons-loadouts",
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
  {status: "confirmed", titleKey: "closedBeta02", slug: "wardogs-beta"},
  {status: "confirmed", titleKey: "clipContest", slug: "wardogs-100k-clip-contest"},
  {status: "confirmed", titleKey: "paidPrepurchase", slug: "wardogs-price"},
  {status: "confirmed", titleKey: "steamEarlyAccess", slug: "wardogs-early-access"},
  {status: "rumor", titleKey: "ps5Release", slug: "wardogs-ps5"}
] as const;

export const BEGINNER_TIP_KEYS = ["objective", "economy", "support", "mobility"] as const;
export const HOME_FAQ_KEYS = ["game", "release", "controlZone", "official"] as const;
