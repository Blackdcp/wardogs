import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {NEWS_UPDATES} from "../../src/features/news/news-data";

const locales = ["en", "de", "ru", "pt-br", "ja"] as const;

describe("weekly source-gap refresh", () => {
  it("turns the September FPS Games Show into a current livestream guide in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-livestream");
      const sources = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(guide?.frontmatter.updatedAt, locale).toBe("2026-08-28");
      expect(guide?.body, locale).toContain("FPS Games Show");
      expect(guide?.body, locale).toContain("3 September 2026");
      expect(guide?.body, locale).toContain("7pm BST");
      expect(sources, locale).toContain("https://www.youtube.com/watch?v=VQRd91fcQUM");
      expect(sources, locale).toContain("https://x.com/FPSGamesShow/status/2090076326120300897");
    }

    expect(NEWS_UPDATES).toContainEqual({
      date: "2026-09-03",
      status: "Confirmed",
      titleKey: "fpsGameShow",
      guideSlug: "wardogs-livestream"
    });
  });

  it("adds current community-tested HOTAS setup limits without copying hardware rankings", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-helicopter-guide");
      const sources = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(guide?.body, locale).toContain("HOTAS");
      expect(guide?.body, locale).toMatch(locale === "ja" ? /自動|切り替/ : /auto(?:matic(?:ally)?)? switch/i);
      expect(guide?.body, locale).toMatch(locale === "ja" ? /割り当て|再設定/ : /remap|rebind|binding/i);
      expect(sources, locale).toContain("https://www.reddit.com/r/WarDogs/comments/1vqvbk7/hotas_mega/");
      expect(guide?.body, locale).not.toMatch(/best flight stick|buy the|affiliate/i);
    }
  });
});
