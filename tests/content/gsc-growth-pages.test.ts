import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getItemBySlug} from "../../src/features/items/item-library";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const growthPages = [
  "wardogs-beta",
  "wardogs-playtest",
  "wardogs-crash-fix",
  "wardogs-helicopter-guide",
  "wardogs-fob-guide"
] as const;

const requiredRelatedSlugs = {
  "wardogs-beta": ["wardogs-playtest", "wardogs-release-date", "wardogs-steam"],
  "wardogs-playtest": ["wardogs-beta", "wardogs-release-date", "wardogs-steam"],
  "wardogs-crash-fix": ["wardogs-system-requirements", "wardogs-best-settings", "wardogs-controls"],
  "wardogs-helicopter-guide": ["wardogs-controls", "wardogs-fob-guide", "wardogs-towers-guide"],
  "wardogs-fob-guide": ["wardogs-mortar-guide", "wardogs-towers-guide", "wardogs-helicopter-guide"]
} as const;

describe("GSC growth page reinforcement", () => {
  it("refreshes every localized growth page with current evidence and reciprocal links", async () => {
    for (const locale of locales) {
      for (const slug of growthPages) {
        const guide = await loadGuideDocument(locale, slug);
        const expectedCheckDate = ["wardogs-beta", "wardogs-playtest", "wardogs-crash-fix"].includes(slug)
          ? "2026-09-04"
          : locale === "zh-cn" && ["wardogs-fob-guide", "wardogs-helicopter-guide"].includes(slug)
          ? "2026-09-01"
          : ["wardogs-fob-guide", "wardogs-helicopter-guide"].includes(slug)
            ? "2026-08-29"
            : "2026-08-26";

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(
          expectedCheckDate
        );
        expect(guide?.frontmatter.title.length, `${locale}/${slug} title`).toBeGreaterThanOrEqual(locale === "zh-cn" ? 12 : 24);
        expect(guide?.frontmatter.description.length, `${locale}/${slug} description`).toBeGreaterThanOrEqual(100);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug} FAQ`).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug} FAQ`).toBeLessThanOrEqual(5);
        expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
          url: "https://store.steampowered.com/app/1867240/WARDOGS/",
          kind: "official"
        }));
        expect(
          guide?.frontmatter.sources.some(({kind, checkedAt}) => kind === "official" && checkedAt === expectedCheckDate),
          `${locale}/${slug} has no official source checked on its update date`
        ).toBe(true);

        for (const relatedSlug of requiredRelatedSlugs[slug]) {
          const link = `/guides/${relatedSlug}`;
          const localizedLink = locale === "en" ? link : `/${locale}${link}`;
          expect(guide?.body, `${locale}/${slug} missing ${localizedLink}`).toContain(localizedLink);

          const relatedGuide = await loadGuideDocument(locale, relatedSlug);
          const backlink = locale === "en" ? `/guides/${slug}` : `/${locale}/guides/${slug}`;
          expect(relatedGuide?.body, `${locale}/${relatedSlug} missing backlink ${backlink}`).toContain(backlink);
        }
      }
    }
  });

  it("gives the English landing pages exact, non-overlapping search intent", async () => {
    const expectations = {
      "wardogs-beta": {
        title: "WARDOGS Closed Beta 02: Dates, Access & Status",
        phrases: ["Is WARDOGS Closed Beta 02 live?", "Is the WARDOGS beta free?"]
      },
      "wardogs-playtest": {
        title: "WARDOGS Playtest: Closed Beta 02 Access Guide",
        phrases: ["What is the current WARDOGS Playtest window?", "WARDOGS playtest sign up"]
      },
      "wardogs-crash-fix": {
        title: "WARDOGS Crash Fix: Startup, Reboots & Stutter",
        phrases: ["WARDOGS crashes on startup", "WARDOGS keeps rebooting my PC", "WARDOGS stuttering"]
      },
      "wardogs-helicopter-guide": {
        title: "WARDOGS Helicopter Controls: Fly, Land & Transport",
        phrases: ["WARDOGS helicopter controls", "How do I land a helicopter in WARDOGS?", "Does WARDOGS support HOTAS?"]
      },
      "wardogs-fob-guide": {
        title: "WARDOGS FOB Guide: How to Build, Supply & Defend",
        phrases: ["How do I build a FOB in WARDOGS?", "Why can't I spawn at a WARDOGS FOB?"]
      }
    } as const;

    for (const [slug, expectation] of Object.entries(expectations)) {
      const guide = await loadGuideDocument("en", slug);
      const searchable = `${guide?.body}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}`;
      expect(guide?.frontmatter.title).toBe(expectation.title);
      expect(guide?.frontmatter.title.length).toBeLessThanOrEqual(60);
      for (const phrase of expectation.phrases) expect(searchable).toContain(phrase);
    }
  });

  it("keeps the Mobile FOB item focused on facts while routing tactics to the guide", () => {
    const mobileFob = getItemBySlug("mobile-fob");

    expect(mobileFob?.detailUpdatedAt).toBe("2026-08-25");
    expect(mobileFob?.relatedGuides).toContain("wardogs-fob-guide");
    expect(mobileFob?.relatedGuides).not.toContain("wardogs-first-look");
  });
});
