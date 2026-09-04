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
        expect(["2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-28", "2026-08-29", "2026-09-04"]).toContain(guide?.frontmatter.updatedAt);
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

      expect(["2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-09-01", "2026-09-04"]).toContain(guide?.frontmatter.updatedAt);
      expect(searchable).toContain("WARDOGS Playtest");
      expect(searchable).not.toMatch(/preload (?:remain|is|also remains?) unconfirmed/i);
    }
  });

  it("keeps historical guides while the homepage promotes the live weekend", () => {
    for (const slug of ["wardogs-beginner-guide", "wardogs-fob-guide"] as const) {
      expect(TOP_GUIDE_SLUGS).toContain(slug);
    }
    expect(TOP_GUIDE_SLUGS).not.toContain("wardogs-twitch-drops");
    expect(TOP_GUIDE_SLUGS).toContain("wardogs-launch-checklist");
    expect(START_GUIDES[0].slug).toBe("wardogs-beta");
    expect(START_GUIDES[1].slug).toBe("wardogs-download");
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "closedBeta02",
      slug: "wardogs-beta",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "paidPrepurchase",
      slug: "wardogs-price",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "clipContest",
      slug: "wardogs-100k-clip-contest",
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
