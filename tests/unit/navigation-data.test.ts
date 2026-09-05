import {describe, expect, it} from "vitest";
import {buildNavigation} from "../../src/features/navigation/navigation-data";

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
      "/tools/loadout-budget"
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
});
