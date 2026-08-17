export type NavigationItem = {
  href: string;
  label: string;
};

export type NavigationGroup = {
  id: "game" | "guides" | "catalogue" | "videos" | "news";
  label: string;
  href?: string;
  items: readonly NavigationItem[];
};

type Translate = (key: string) => string;

export function buildNavigation(t: Translate): NavigationGroup[] {
  return [
    {
      id: "game",
      label: t("nav.game"),
      items: [
        {href: "/guides/wardogs-playtest", label: t("nav.playtest")},
        {href: "/guides/wardogs-release-date", label: t("nav.releaseDate")},
        {href: "/guides/wardogs-steam", label: t("nav.steamEarlyAccess")},
        {href: "/guides/wardogs-gameplay", label: t("nav.gameplay")},
        {href: "/guides/wardogs-factions", label: t("nav.factions")},
        {href: "/guides/wardogs-discord", label: t("nav.community")}
      ]
    },
    {
      id: "guides",
      label: t("nav.guides"),
      items: [
        {href: "/guides/wardogs-gameplay#beginner-guide", label: t("nav.beginnerGuide")},
        {href: "/guides/wardogs-gameplay", label: t("nav.gameplayGuide")},
        {href: "/items/equipment/mobile-fob", label: t("nav.fobLogistics")},
        {href: "/items/weapons/mortar", label: t("nav.mortarGuide")},
        {href: "/guides", label: t("nav.allGuides")}
      ]
    },
    {
      id: "catalogue",
      label: t("nav.catalogue"),
      items: [
        {href: "/items", label: t("nav.catalogueHome")},
        {href: "/items/weapons", label: t("nav.weapons")},
        {href: "/items/vehicles", label: t("nav.vehicles")},
        {href: "/items/ammo", label: t("nav.ammo")},
        {href: "/items/attachments", label: t("nav.attachments")},
        {href: "/items/gear", label: t("nav.gear")},
        {href: "/items/equipment", label: t("nav.equipment")},
        {href: "/items/loadouts", label: t("nav.loadouts")}
      ]
    },
    {id: "videos", label: t("nav.videos"), href: "/videos", items: []},
    {id: "news", label: t("nav.news"), href: "/news", items: []}
  ];
}
