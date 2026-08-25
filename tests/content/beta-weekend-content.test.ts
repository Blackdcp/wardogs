import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {CONFIRMED_RUMOR_ITEMS, START_GUIDES, TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";
import {NEWS_CHECKLIST_SLUGS, NEWS_UPDATES} from "../../src/features/news/news-data";

const weekendSlugs = [
  "wardogs-twitch-drops",
  "wardogs-beginner-guide",
  "wardogs-fob-guide",
] as const;

describe("WARDOGS Closed Beta reference content", () => {
  it("keeps the three beta guides in every locale with current FAQs and sources", async () => {
    for (const locale of ["en", "de", "ru", "pt-br", "ja"] as const) {
      for (const slug of weekendSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
        expect(["2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25"]).toContain(guide?.frontmatter.updatedAt);
        expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.faq.length).toBeLessThanOrEqual(5);
        expect(guide?.frontmatter.sources.length).toBeGreaterThan(0);
        expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
      }
    }
  });

  it("preserves the official WARDOGS Playtest identity after the preload window", async () => {
    for (const slug of ["wardogs-beta", "wardogs-playtest", "wardogs-download", "wardogs-steam"] as const) {
      const guide = await loadGuideDocument("en", slug);
      const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

      expect(["2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25"]).toContain(guide?.frontmatter.updatedAt);
      expect(searchable).toContain("WARDOGS Playtest");
      expect(searchable).not.toMatch(/preload (?:remain|is|also remains?) unconfirmed/i);
    }
  });

  it("keeps historical beta links while the homepage promotes current milestones", () => {
    for (const slug of weekendSlugs) {
      expect(TOP_GUIDE_SLUGS).toContain(slug);
    }
    expect(START_GUIDES[0].slug).toBe("wardogs-beginner-guide");
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "betaEnded",
      slug: "wardogs-beta",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "oneMillionWishlists",
      slug: "wardogs-steam",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "fpsGameShow",
      slug: "wardogs-livestream",
    }));
    expect(NEWS_CHECKLIST_SLUGS).toContain("wardogs-twitch-drops");
    expect(NEWS_UPDATES).toContainEqual(expect.objectContaining({
      date: "2026-08-20",
      status: "Confirmed",
      titleKey: "preload",
      guideSlug: "wardogs-download",
    }));
    expect(NEWS_UPDATES).toContainEqual(expect.objectContaining({
      date: "2026-08-21",
      status: "Confirmed",
      titleKey: "twitchDrops",
      guideSlug: "wardogs-twitch-drops",
    }));
  });
});
