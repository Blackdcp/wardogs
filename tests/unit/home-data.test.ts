import {describe, expect, it} from "vitest";
import {
  CONFIRMED_RUMOR_ITEMS,
  HOME_ACTIONS,
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
      {number: "1", slug: "wardogs-beta", titleKey: "playtest"},
      {number: "2", slug: "wardogs-download", titleKey: "download"},
      {number: "3", slug: "wardogs-controls", titleKey: "controls"},
      {number: "4", slug: "wardogs-known-issues", titleKey: "issues"},
      {number: "5", slug: "wardogs-100k-clip-contest", titleKey: "contest"},
      {number: "6", slug: "wardogs-launch-checklist", titleKey: "launch"}
    ]);
    expect(facts.every((fact) => typeof fact === "string")).toBe(true);
  });

  it("promotes core homepage SEO links and maintenance signals", () => {
    expect(TOP_GUIDE_SLUGS).toEqual([
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
      "wardogs-linux-proton",
      "wardogs-beginner-guide",
      "wardogs-best-weapons-loadouts",
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
    expect(CONFIRMED_RUMOR_ITEMS.map((item) => item.status)).toEqual([
      "confirmed",
      "confirmed",
      "confirmed",
      "confirmed",
      "rumor"
    ]);
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "closedBeta02",
      slug: "wardogs-beta"
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual({
      status: "confirmed",
      titleKey: "paidPrepurchase",
      slug: "wardogs-price"
    });
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
      expect.objectContaining({titleKey: "closedBeta02", status: "confirmed"}),
      expect.objectContaining({titleKey: "clipContest", status: "confirmed"}),
      expect.objectContaining({titleKey: "ps5Release", status: "rumor"})
    ]);
  });

  it("defines four task-first homepage actions with visual assets", () => {
    expect(HOME_ACTIONS).toEqual([
      expect.objectContaining({key: "play", href: "/guides/wardogs-download"}),
      expect.objectContaining({key: "fix", href: "/guides/wardogs-known-issues"}),
      expect.objectContaining({key: "gear", href: "/items"}),
      expect.objectContaining({key: "system", href: "/tools/system-check"})
    ]);
    expect(HOME_ACTIONS).toHaveLength(4);
    expect(HOME_ACTIONS.every((action) => action.image.startsWith("/images/"))).toBe(true);
    expect(new Set(HOME_ACTIONS.map((action) => action.image)).size).toBe(4);
  });
});
