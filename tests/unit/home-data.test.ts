import {describe, expect, it} from "vitest";
import {
  CONFIRMED_RUMOR_ITEMS,
  HOME_ACTIONS,
  getHomeCurrentBuildChanges,
  getHomeFacts,
  getHomePriorityGuides,
  getRecentlyUpdatedGuides,
  TOP_GUIDE_SLUGS,
  START_GUIDES
} from "../../src/features/home/home-data";

describe("homepage data", () => {
  it("uses four intuitive facts and six current start routes", () => {
    const copy = {
      earlyAccess: "Early Access Sep 10, 2026",
      players: "Up to 100 Players",
      teams: "3 Teams",
      controlZone: "2 x 2 km Control Zone"
    } as const;

    const facts = getHomeFacts((key) => copy[key]);

    expect(facts).toEqual([
      "Early Access Sep 10, 2026",
      "Up to 100 Players",
      "3 Teams",
      "2 x 2 km Control Zone"
    ]);
    expect(START_GUIDES).toEqual([
      {number: "1", slug: "wardogs-beginner-guide", titleKey: "beginner"},
      {number: "2", slug: "wardogs-money-guide", titleKey: "money"},
      {number: "3", slug: "wardogs-progression-wipes-guide", titleKey: "progression"},
      {number: "4", slug: "wardogs-best-weapons-loadouts", titleKey: "loadouts"},
      {number: "5", slug: "wardogs-community-servers-guide", titleKey: "communityServers"},
      {number: "6", slug: "wardogs-known-issues", titleKey: "issues"}
    ]);
    expect(facts.every((fact) => typeof fact === "string")).toBe(true);
  });

  it("promotes core homepage SEO links and maintenance signals", () => {
    expect(TOP_GUIDE_SLUGS).toEqual([
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
    ]);
    expect(new Set(TOP_GUIDE_SLUGS).size).toBe(TOP_GUIDE_SLUGS.length);

    const latest = getRecentlyUpdatedGuides([
      {slug: "older", updatedAt: "2026-08-01", title: "Older"},
      {slug: "newest", updatedAt: "2026-08-13", title: "Newest"},
      {slug: "middle", updatedAt: "2026-08-08", title: "Middle"}
    ], 2);

    expect(latest.map((guide) => guide.slug)).toEqual(["newest", "middle"]);
    expect(CONFIRMED_RUMOR_ITEMS.map((item) => item.status)).toEqual(["confirmed", "confirmed", "rumor"]);
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual({
      status: "confirmed",
      titleKey: "steamEarlyAccess",
      slug: "wardogs-early-access"
    });
    expect(CONFIRMED_RUMOR_ITEMS.map((item) => item.titleKey)).not.toContain("closedBeta02");
    expect(CONFIRMED_RUMOR_ITEMS.map((item) => item.titleKey)).not.toContain("clipContest");
  });

  it("keeps the homepage intel panel concise while preserving confirmed and rumor states", () => {
    const guides = Array.from({length: 20}, (_, index) => ({
      slug: `guide-${index}`,
      title: `Guide ${index}`,
      updatedAt: `2026-08-${String(index + 1).padStart(2, "0")}`
    }));
    const result = getHomePriorityGuides(guides);

    expect(result.top).toHaveLength(0);
    expect(result.recent).toHaveLength(3);
    expect(result.status).toEqual([
      expect.objectContaining({titleKey: "steamEarlyAccess", status: "confirmed"}),
      expect.objectContaining({titleKey: "patch011", status: "confirmed"}),
      expect.objectContaining({titleKey: "ps5Release", status: "rumor"})
    ]);
  });

  it("defines exactly eight task-first homepage actions with valid internal destinations", () => {
    expect(HOME_ACTIONS).toEqual([
      {key: "firstMatch", href: "/guides/wardogs-beginner-guide"},
      {key: "money", href: "/guides/wardogs-money-guide"},
      {key: "progression", href: "/guides/wardogs-progression-wipes-guide"},
      {key: "weapons", href: "/guides/wardogs-best-weapons-loadouts"},
      {key: "logistics", href: "/guides/wardogs-fob-guide"},
      {key: "vehicles", href: "/items/vehicles"},
      {key: "controls", href: "/guides/wardogs-controls"},
      {key: "pcFixes", href: "/guides/wardogs-crash-fix"}
    ]);
    expect(HOME_ACTIONS).toHaveLength(8);
    expect(HOME_ACTIONS.every((action) => action.href.startsWith("/"))).toBe(true);
  });

  it("builds the current-change band only from dated official Season 1 evidence", () => {
    const changes = getHomeCurrentBuildChanges();

    expect(changes).toHaveLength(6);
    expect(changes.map((change) => change.key)).toEqual([
      "fobVendor",
      "largeHammer",
      "artilleryTank",
      "ural",
      "duneBuggy",
      "deagle"
    ]);
    for (const change of changes) {
      expect(change.effectiveBuild).toBe("Season 1");
      expect(change.verifiedAt).toBe("2026-09-09");
      expect(change.sourceUrl).toBe("https://store.steampowered.com/news/app/1867240/view/701027323413004455");
      expect(change.previousValue).not.toBe(change.currentValue);
    }
  });
});
