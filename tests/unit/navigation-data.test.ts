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
      "/items/loadouts"
    ]);
  });
});
