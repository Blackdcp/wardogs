import {describe, expect, it} from "vitest";
import {buildNavigation} from "../../src/features/navigation/navigation-data";

describe("grouped navigation", () => {
  it("exposes five primary destinations with catalogue children", () => {
    const groups = buildNavigation("en", (key) => key);
    expect(groups.map((group) => group.id)).toEqual(["game", "guides", "catalogue", "videos", "news"]);
    expect(groups.find((group) => group.id === "catalogue")?.items.map((item) => item.href)).toEqual([
      "/items",
      "/items/weapons",
      "/items/vehicles",
      "/items/ammo",
      "/items/attachments",
      "/items/gear",
      "/items/equipment",
      "/items/loadouts"
    ]);
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.beginnerGuide")?.href)
      .toBe("/guides/wardogs-beginner-guide");
    expect(groups.find((group) => group.id === "guides")?.items.find(({label}) => label === "nav.fobLogistics")?.href)
      .toBe("/guides/wardogs-fob-guide");
  });

  it("keeps legacy detail links on supported locales and falls back to English elsewhere", () => {
    const russian = buildNavigation("ru", (key) => key).find((group) => group.id === "guides")?.items;
    const german = buildNavigation("de", (key) => key).find((group) => group.id === "guides")?.items;

    expect(russian?.find(({label}) => label === "nav.fobLogistics")).toMatchObject({href: "/guides/wardogs-fob-guide"});
    expect(russian?.find(({label}) => label === "nav.mortarGuide")).toMatchObject({
      href: "/items/weapons/mortar",
      locale: "ru"
    });
    expect(german?.find(({label}) => label === "nav.fobLogistics")).toMatchObject({href: "/guides/wardogs-fob-guide"});
    expect(german?.find(({label}) => label === "nav.mortarGuide")).toMatchObject({
      href: "/items/weapons/mortar",
      locale: "en"
    });
  });
});
