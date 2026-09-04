import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {NEWS_UPDATES} from "../../src/features/news/news-data";
import {videoArticles} from "../../src/features/videos/video-library";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const eventGuideSlugs = [
  "wardogs-beta",
  "wardogs-playtest",
  "wardogs-download",
  "wardogs-preload",
  "wardogs-launch-checklist",
  "wardogs-livestream",
] as const;
const newGuideSlugs = ["wardogs-progression-wipes-guide", "wardogs-community-servers-guide"] as const;
const beta02Url = "https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807";
const revisedScheduleUrl = "https://x.com/BULKHEAD/status/2095447401725153576";

const closedTestSignals = {
  en: /closed scale test|not an open beta/i,
  de: /geschlossene\w* skalierungstest|nicht als open beta|keine offene beta|kein open-beta/i,
  ru: /закрыт.*масштаб.*тест|не открытая бета/i,
  "pt-br": /teste fechado de escala|não é (?:um|uma) beta abert[ao]/i,
  ja: /クローズド.*テスト|オープンベータでは(?:なく|ありません|ない)/,
  "zh-cn": /封闭(?:扩容|规模)测试|不是(?:一次)?(?:公开|开放)测试/,
} as const;

describe("September 2026 live-ops content refresh", () => {
  it("publishes the revised Closed Beta 02 status across every affected guide and locale", async () => {
    for (const locale of locales) {
      for (const slug of eventGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-09-04");
        expect(sourceUrls, `${locale}/${slug}`).toContain(beta02Url);
        expect(sourceUrls, `${locale}/${slug}`).toContain(revisedScheduleUrl);
        expect(guide?.body, `${locale}/${slug}`).toContain("18:00 UTC");
        expect(guide?.body, `${locale}/${slug}`).toContain("19:00 UTC");
        expect(guide?.body, `${locale}/${slug}`).toContain("08:00 UTC");
        expect(guide?.body, `${locale}/${slug}`).toMatch(closedTestSignals[locale]);
      }
    }
  });

  it("keeps the broadcast separate from the playable server window", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-playtest");
      const currentEventSection = guide?.body.split(/^##\s+/m).slice(1, 3).join("\n") ?? "";
      const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(sourceUrls, `${locale}/wardogs-playtest announcement`).toContain(beta02Url);
      expect(sourceUrls, `${locale}/wardogs-playtest schedule`).toContain(revisedScheduleUrl);
      expect(currentEventSection, `${locale}/wardogs-playtest`).toContain("18:00 UTC");
      expect(currentEventSection, `${locale}/wardogs-playtest`).toContain("19:00 UTC");
      expect(currentEventSection, `${locale}/wardogs-playtest`).toContain("08:00 UTC");
      expect(currentEventSection, `${locale}/wardogs-playtest`).not.toContain("17:00 UTC");
    }
  });

  it("publishes progression and community-server guides as complete local-language pages", async () => {
    for (const locale of locales) {
      for (const slug of newGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-09-01");
        expect(guide?.frontmatter.sources.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(2);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(guide?.body.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(locale === "ja" ? 1_500 : 1_800);
      }
    }
  });

  it("keeps the Beta 02 news item and researched creator videos", () => {
    expect(NEWS_UPDATES).toContainEqual({
      date: "2026-09-03",
      status: "Confirmed",
      titleKey: "closedBeta02",
      guideSlug: "wardogs-beta",
    });

    for (const youtubeId of ["im60BiRZFow", "IO7-_TwxpII", "7O5QJNRzXzQ", "JSAu5nlLjJw"]) {
      expect(videoArticles).toContainEqual(expect.objectContaining({youtubeId}));
    }
  });
});
