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
const newGuideSlugs = [
  "wardogs-progression-wipes-guide",
  "wardogs-community-servers-guide",
] as const;
const officialTestPost = "https://x.com/WARDOGS/status/2094074731972419976";
const producerClarification = "https://x.com/Brammflakes/status/2094076336134308024";

const limitedTestSignals = {
  en: /not an open beta/i,
  de: /keine offene Beta|kein Open-Beta/i,
  ru: /не открытая бета/i,
  "pt-br": /não é (?:um|uma) beta abert[ao]/i,
  ja: /オープンベータでは(?:ありません|ない)/,
  "zh-cn": /不是(?:一次)?(?:公开|开放)测试|并非(?:一次)?(?:公开|开放)测试/,
} as const;

const firingRangeSignals = {
  en: /Firing Range/i,
  de: /Schießstand/i,
  ru: /стрельбищ/i,
  "pt-br": /Campo de Tiro/i,
  ja: /射撃場/,
  "zh-cn": /靶场/,
} as const;

const unknownEndTimeSignals = {
  en: /official (?:end|closing) time has not been announced/i,
  de: /offizielle Endzeit wurde nicht (?:angekündigt|veröffentlicht|bestätigt)/i,
  ru: /официальное время окончания не (?:объявлено|указано)/i,
  "pt-br": /horário oficial de encerramento não (?:foi )?(?:anunciado|confirmado)/i,
  ja: /公式の終了時刻は(?:発表|告知)されていません/,
  "zh-cn": /官方(?:尚未|没有)公布结束时间|结束时间尚未公布/,
} as const;

const staleNoTestSignals = {
  en: /no (?:later|next) (?:playtest|test)|no (?:current|currently announced) playtest/i,
  de: /kein (?:späterer|nächster|neuer) (?:Playtest|Test)|kein Playtest.*angekündigt/i,
  ru: /(?:новый|следующий) (?:Playtest|тест) не (?:объявлен|подтвержден)/i,
  "pt-br": /nenhum (?:novo|próximo) (?:Playtest|teste).*(?:anunciad|confirmad)|não há (?:um )?(?:novo|próximo) (?:Playtest|teste)/i,
  ja: /次回(?:の)?(?:Playtest|プレイテスト|テスト).*(?:未発表|確認されていません)/,
  "zh-cn": /没有(?:公布|确认)?(?:下一次|后续)(?:的)?(?:Playtest|测试)|尚未公布下一次(?:Playtest|测试)/i,
} as const;

describe("September 2026 live-ops content refresh", () => {
  it("publishes the September 2 limited test status across every affected guide and locale", async () => {
    for (const locale of locales) {
      for (const slug of eventGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-09-01");
        expect(sourceUrls, `${locale}/${slug}`).toContain(officialTestPost);
        expect(guide?.body, `${locale}/${slug}`).toContain("17:00 UTC");
        expect(guide?.body, `${locale}/${slug}`).toMatch(firingRangeSignals[locale]);
        expect(guide?.body, `${locale}/${slug}`).toMatch(limitedTestSignals[locale]);
      }
    }
  });

  it("keeps the current test separate from the completed August beta window", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-playtest");
      const currentEventSection = guide?.body.split(/^##\s+/m)[1] ?? "";
      const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(sourceUrls, `${locale}/wardogs-playtest official source`).toContain(officialTestPost);
      expect(sourceUrls, `${locale}/wardogs-playtest producer clarification`).toContain(producerClarification);
      expect(currentEventSection, `${locale}/wardogs-playtest current event`).not.toContain("02:00 UTC");
      expect(guide?.body, `${locale}/wardogs-playtest unknown end time`).toMatch(unknownEndTimeSignals[locale]);
      expect(guide?.body, `${locale}/wardogs-playtest stale contradiction`).not.toMatch(staleNoTestSignals[locale]);
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

  it("adds the September 2 event and four current creator videos", () => {
    expect(NEWS_UPDATES).toContainEqual({
      date: "2026-09-02",
      status: "Confirmed",
      titleKey: "firingRangeTest",
      guideSlug: "wardogs-playtest",
    });

    for (const youtubeId of ["im60BiRZFow", "IO7-_TwxpII", "7O5QJNRzXzQ", "JSAu5nlLjJw"]) {
      expect(videoArticles).toContainEqual(expect.objectContaining({youtubeId}));
    }
  });
});
