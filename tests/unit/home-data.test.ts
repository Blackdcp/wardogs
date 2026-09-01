import {describe, expect, it} from "vitest";
import {
  CONFIRMED_RUMOR_ITEMS,
  getHomeFacts,
  getRecentlyUpdatedGuides,
  TOP_GUIDE_SLUGS,
  START_GUIDES
} from "../../src/features/home/home-data";

describe("homepage data", () => {
  it("uses four intuitive facts and four working start routes", () => {
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
      {number: "1", slug: "wardogs-launch-checklist", titleKey: "launch"},
      {number: "2", slug: "wardogs-playtest", titleKey: "playtest"},
      {number: "3", slug: "wardogs-beginner-guide", titleKey: "beginner"},
      {number: "4", slug: "wardogs-gameplay", titleKey: "gameplay"}
    ]);
    expect(facts.every((fact) => typeof fact === "string")).toBe(true);
  });

  it("promotes core homepage SEO links and maintenance signals", () => {
    expect(TOP_GUIDE_SLUGS).toEqual([
      "wardogs-launch-checklist",
      "wardogs-playtest",
      "wardogs-livestream",
      "wardogs-early-access",
      "wardogs-release-date",
      "wardogs-price",
      "wardogs-system-requirements",
      "wardogs-download",
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
      "confirmed",
      "rumor"
    ]);
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "betaEnded",
      slug: "wardogs-beta"
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual({
      status: "confirmed",
      titleKey: "paidPrepurchase",
      slug: "wardogs-price"
    });
  });
});
