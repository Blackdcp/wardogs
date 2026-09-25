import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {CONFIRMED_RUMOR_ITEMS, TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const seasonAnnouncement = "https://steamcommunity.com/games/1867240/announcements/detail/677384059121304815";
const officialTeaser = "https://www.youtube.com/watch?v=3rdbnh8P0T0";
const officialWipePolicy = "https://www.youtube.com/watch?v=PQvtvAvl-78&t=185s";
const handlerM4 = "https://www.youtube.com/watch?v=W3zijGs1jbY";
const jaronMk22 = "https://www.youtube.com/watch?v=xAkcBAFUYz0";

describe("September 23 Season 02 content refresh", () => {
  it("publishes the sourced Season 02 guide in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-season-2");
      const sources = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(guide, `${locale}/wardogs-season-2`).not.toBeNull();
      expect((guide?.frontmatter.updatedAt ?? "") >= "2026-09-23", locale).toBe(true);
      expect(guide?.frontmatter.order, locale).toBe(51);
      expect(sources, `${locale}/announcement`).toContain(seasonAnnouncement);
      expect(sources, `${locale}/teaser`).toContain(officialTeaser);
      expect(sources, `${locale}/wipe policy`).toContain(officialWipePolicy);
      expect(guide?.body, `${locale}/date`).toContain("15");
      expect(guide?.body, `${locale}/year`).toContain("2026");
      expect(guide?.body.length, `${locale}/body`).toBeGreaterThanOrEqual(1_200);
    }
  });

  it("updates patch and wipe guidance without inventing Season 02 details", async () => {
    for (const locale of locales) {
      const patches = await loadGuideDocument(locale, "wardogs-patch-notes");
      const wipes = await loadGuideDocument(locale, "wardogs-progression-wipes-guide");

      expect(patches?.frontmatter.updatedAt, `${locale}/patches`).toBe(locale === "en" ? "2026-09-26" : "2026-09-23");
      expect((wipes?.frontmatter.updatedAt ?? "") >= "2026-09-23", `${locale}/wipes`).toBe(true);
      expect(patches?.frontmatter.sources.map(({url}) => url)).toContain(seasonAnnouncement);
      if (locale === "en") {
        expect(patches?.frontmatter.sources.map(({url}) => url)).toContain(officialWipePolicy);
        expect(patches?.body).toMatch(/cash and XP reset[\s\S]*Gold Bars/);
      }
      expect(wipes?.frontmatter.sources.map(({url}) => url)).toContain(seasonAnnouncement);
      expect(wipes?.frontmatter.sources.map(({url}) => url)).toContain(officialWipePolicy);
      expect(patches?.body, `${locale}/latest numbered patch`).toContain("Patch 0.11");
      expect(`${wipes?.frontmatter.faq.map(({answer}) => answer).join("\n")}\n${wipes?.body}`, `${locale}/wipe boundary`)
        .toMatch(/Gold Bars|Goldbarren|ゴールドバー|слитки/i);
    }
  });

  it("adds fresh M4 and MK22 creator samples while keeping them evidence-labeled", async () => {
    for (const locale of locales) {
      const loadouts = await loadGuideDocument(locale, "wardogs-best-weapons-loadouts");
      const sources = loadouts?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(loadouts?.frontmatter.updatedAt, locale).toBe("2026-09-23");
      expect(sources, `${locale}/M4`).toContain(handlerM4);
      expect(sources, `${locale}/MK22`).toContain(jaronMk22);
      expect(loadouts?.body, `${locale}/weapons`).toMatch(/M4[\s\S]*MK22|MK22[\s\S]*M4/);
    }
  });

  it("promotes Season 02 as the first home-page guide and a confirmed status item", () => {
    expect(TOP_GUIDE_SLUGS[0]).toBe("wardogs-season-2");
    expect(CONFIRMED_RUMOR_ITEMS[0]).toEqual({
      status: "confirmed",
      titleKey: "season02",
      slug: "wardogs-season-2",
    });
  });
});
