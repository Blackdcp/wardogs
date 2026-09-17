import type {Locale} from "@/config/site";

export type NavigationSearchType = "guide" | "item" | "tool" | "map";

export type NavigationItem = {
  href: string;
  label: string;
  locale?: Locale;
  searchType: NavigationSearchType;
};

export type NavigationGroup = {
  id: "game" | "guides" | "catalogue" | "videos" | "news";
  label: string;
  href?: string;
  items: readonly NavigationItem[];
};

export type SearchNavigationItem = NavigationItem & {
  category: string;
  searchType: "tool" | "map";
};

type Translate = (key: string) => string;

function isSearchNavigationItem(item: NavigationItem): item is NavigationItem & {searchType: "tool" | "map"} {
  return item.searchType === "tool" || item.searchType === "map";
}

export function buildNavigation(t: Translate): NavigationGroup[] {
  return [
    {
      id: "game",
      label: t("nav.game"),
      items: [
        {href: "/guides/wardogs-playtest", label: t("nav.playtest"), searchType: "guide"},
        {href: "/guides/wardogs-release-date", label: t("nav.releaseDate"), searchType: "guide"},
        {href: "/guides/wardogs-steam", label: t("nav.steamEarlyAccess"), searchType: "guide"},
        {href: "/guides/wardogs-gameplay", label: t("nav.gameplay"), searchType: "guide"},
        {href: "/guides/wardogs-factions", label: t("nav.factions"), searchType: "guide"},
        {href: "/guides/wardogs-discord", label: t("nav.community"), searchType: "guide"}
      ]
    },
    {
      id: "guides",
      label: t("nav.guides"),
      items: [
        {href: "/guides/wardogs-beginner-guide", label: t("nav.beginnerGuide"), searchType: "guide"},
        {href: "/guides/wardogs-crash-fix", label: t("nav.crashFix"), searchType: "guide"},
        {href: "/guides/wardogs-helicopter-guide", label: t("nav.helicopterGuide"), searchType: "guide"},
        {href: "/guides/wardogs-gameplay", label: t("nav.gameplayGuide"), searchType: "guide"},
        {href: "/guides/wardogs-fob-guide", label: t("nav.fobLogistics"), searchType: "guide"},
        {href: "/guides/wardogs-mortar-guide", label: t("nav.mortarGuide"), searchType: "guide"},
        {href: "/tools/system-check", label: t("nav.systemCheck"), searchType: "tool"},
        {href: "/guides", label: t("nav.allGuides"), searchType: "guide"}
      ]
    },
    {
      id: "catalogue",
      label: t("nav.catalogue"),
      items: [
        {href: "/items", label: t("nav.catalogueHome"), searchType: "item"},
        {href: "/items/weapons", label: t("nav.weapons"), searchType: "item"},
        {href: "/items/vehicles", label: t("nav.vehicles"), searchType: "item"},
        {href: "/items/ammo", label: t("nav.ammo"), searchType: "item"},
        {href: "/items/attachments", label: t("nav.attachments"), searchType: "item"},
        {href: "/items/gear", label: t("nav.gear"), searchType: "item"},
        {href: "/items/equipment", label: t("nav.equipment"), searchType: "item"},
        {href: "/items/loadouts", label: t("nav.loadouts"), searchType: "item"},
        {href: "/tools/loadout-budget", label: t("nav.budgetTool"), searchType: "tool"},
        {href: "/tools/weapon-compare", label: t("nav.weaponCompare"), searchType: "tool"},
        {href: "/tools/ammo-matcher", label: t("nav.ammoMatcher"), searchType: "tool"}
      ]
    },
    {id: "videos", label: t("nav.videos"), href: "/videos", items: []},
    {id: "news", label: t("nav.news"), href: "/news", items: []}
  ];
}

export function selectSearchNavigationItems(groups: readonly NavigationGroup[]): SearchNavigationItem[] {
  const seen = new Set<string>();
  const selected: SearchNavigationItem[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      if (isSearchNavigationItem(item) && !seen.has(item.href)) {
        seen.add(item.href);
        selected.push({...item, category: group.label});
      }
    }
  }

  return selected;
}

export function getSearchNavigationItems(t: Translate): SearchNavigationItem[] {
  return selectSearchNavigationItems(buildNavigation(t));
}
