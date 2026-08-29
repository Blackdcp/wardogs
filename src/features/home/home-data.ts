export const HOME_FACT_KEYS = ["earlyAccess", "players", "teams", "controlZone"] as const;
export type HomeFactKey = (typeof HOME_FACT_KEYS)[number];

export function getHomeFacts(translate: (key: HomeFactKey) => string): string[] {
  return HOME_FACT_KEYS.map(translate);
}

export const START_GUIDES = [
  {number: "1", slug: "wardogs-beginner-guide", titleKey: "beginner"},
  {number: "2", slug: "wardogs-launch-checklist", titleKey: "launch"},
  {number: "3", slug: "wardogs-gameplay", titleKey: "gameplay"},
  {number: "4", slug: "wardogs-factions", titleKey: "factions"}
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
  "wardogs-launch-checklist",
  "wardogs-cargo-guide",
  "wardogs-ammo-reload-guide",
  "wardogs-squad-guide",
  "wardogs-oil-rig-guide",
  "wardogs-ps5",
  "wardogs-crash-fix",
  "wardogs-beginner-guide",
  "wardogs-fob-guide",
  "wardogs-best-settings",
  "wardogs-release-date",
  "wardogs-steam"
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
  {status: "confirmed", titleKey: "betaEnded", slug: "wardogs-beta"},
  {status: "confirmed", titleKey: "oneMillionWishlists", slug: "wardogs-steam"},
  {status: "confirmed", titleKey: "fpsGameShow", slug: "wardogs-livestream"},
  {status: "confirmed", titleKey: "steamEarlyAccess", slug: "wardogs-early-access"},
  {status: "rumor", titleKey: "ps5Release", slug: "wardogs-ps5"}
] as const;

export const BEGINNER_TIP_KEYS = ["objective", "economy", "support", "mobility"] as const;
export const HOME_FAQ_KEYS = ["game", "release", "controlZone", "official"] as const;
