import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {
  buildNavigation,
  selectSearchNavigationItems,
  type NavigationGroup
} from "../../src/features/navigation/navigation-data";

describe("grouped navigation", () => {
  it("exposes five primary destinations with catalogue children", () => {
    const groups = buildNavigation((key) => key);
    expect(groups.map((group) => group.id)).toEqual(["game", "guides", "catalogue", "videos", "news"]);
    expect(groups.find((group) => group.id === "catalogue")?.items.map((item) => item.href)).toEqual([
      "/items",
      "/items/weapons",
      "/items/vehicles",
      "/vehicles/helicopters",
      "/items/ammo",
      "/items/attachments",
      "/items/gear",
      "/skins",
      "/items/equipment",
      "/items/medical",
      "/items/supplies",
      "/items/deployables",
      "/items/mechanics",
      "/items/loadouts",
      "/black-market",
      "/gold-market",
      "/tools/loadout-budget",
      "/tools/weapon-compare",
      "/tools/ammo-matcher"
    ]);
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.beginnerGuide")?.href)
      .toBe("/guides/wardogs-beginner-guide");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.fobLogistics")?.href)
      .toBe("/guides/wardogs-fob-guide");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.crashFix")?.href)
      .toBe("/guides/wardogs-crash-fix");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.helicopterGuide")?.href)
      .toBe("/guides/wardogs-helicopter-guide");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.systemCheck")?.href)
      .toBe("/tools/system-check");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.interactiveMap")?.href)
      .toBe("/tools/map");
  });

  it("keeps every guide link on the current locale", () => {
    const items = buildNavigation((key) => key).find((group) => group.id === "guides")?.items;

    expect(items?.find(({label}) => label === "nav.fobLogistics")).toMatchObject({href: "/guides/wardogs-fob-guide"});
    expect(items?.find(({label}) => label === "nav.mortarGuide")).toMatchObject({href: "/guides/wardogs-mortar-guide"});
    expect(items?.every(({locale}) => locale === undefined)).toBe(true);
  });

  it("classifies shared navigation destinations explicitly", () => {
    const items = buildNavigation((key) => key).flatMap((group) => group.items);
    const byHref = new Map(items.map((item) => [item.href, item.searchType]));

    expect(byHref.get("/guides/wardogs-beginner-guide")).toBe("guide");
    expect(byHref.get("/items/weapons")).toBe("item");
    expect(byHref.get("/tools/system-check")).toBe("tool");
    expect(byHref.get("/tools/loadout-budget")).toBe("tool");
    expect(byHref.get("/tools/weapon-compare")).toBe("tool");
    expect(byHref.get("/tools/ammo-matcher")).toBe("tool");
    expect(byHref.get("/maps")).toBe("map");
    expect(byHref.get("/tools/map")).toBe("map");
  });

  it("renders a localized direct-map label in the navigation for every locale", () => {
    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(resolve(`messages/${locale}.json`), "utf8"));
      const groups = buildNavigation((key) => key === "nav.interactiveMap" ? messages.nav.interactiveMap : key);
      const mapLink = groups.find((group) => group.id === "guides")?.items.find(({href}) => href === "/tools/map");

      expect(mapLink?.label, locale).toBe(messages.nav.interactiveMap);
      expect(mapLink?.label, locale).not.toBe("nav.interactiveMap");
    }
  });

  it("selects tools and maps by explicit type instead of URL shape", () => {
    const groups: NavigationGroup[] = [{
      id: "guides",
      label: "Field reference",
      items: [
        {href: "/tools/not-a-tool", label: "Guide with a tool-shaped URL", searchType: "guide"},
        {href: "/planner", label: "Future planner", searchType: "tool"},
        {href: "/maps", label: "Operations atlas", searchType: "map"},
        {href: "/tools/map", label: "Interactive map", searchType: "map"}
      ]
    }];

    expect(selectSearchNavigationItems(groups)).toEqual([
      {href: "/planner", label: "Future planner", searchType: "tool", category: "Field reference"},
      {href: "/maps", label: "Operations atlas", searchType: "map", category: "Field reference"},
      {href: "/tools/map", label: "Interactive map", searchType: "map", category: "Field reference"}
    ]);
  });
});
