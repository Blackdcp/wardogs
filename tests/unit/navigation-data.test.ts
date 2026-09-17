import {describe, expect, it} from "vitest";
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
      "/items/ammo",
      "/items/attachments",
      "/items/gear",
      "/items/equipment",
      "/items/loadouts",
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
  });

  it("selects tools and maps by explicit type instead of URL shape", () => {
    const groups: NavigationGroup[] = [{
      id: "guides",
      label: "Field reference",
      items: [
        {href: "/tools/not-a-tool", label: "Guide with a tool-shaped URL", searchType: "guide"},
        {href: "/planner", label: "Future planner", searchType: "tool"},
        {href: "/maps", label: "Operations atlas", searchType: "map"}
      ]
    }];

    expect(selectSearchNavigationItems(groups)).toEqual([
      {href: "/planner", label: "Future planner", searchType: "tool", category: "Field reference"},
      {href: "/maps", label: "Operations atlas", searchType: "map", category: "Field reference"}
    ]);
  });
});
