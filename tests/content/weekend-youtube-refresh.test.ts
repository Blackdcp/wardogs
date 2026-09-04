import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";
import {NEWS_UPDATES} from "../../src/features/news/news-data";
import {getLocalizedVideoArticle} from "../../src/features/videos/video-localization";
import {videoArticles} from "../../src/features/videos/video-library";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

describe("2026-08-28 weekend and YouTube refresh", () => {
  it("publishes a source-backed artillery guide in every supported locale", async () => {
    expect(guideManifest).toContainEqual(expect.objectContaining({
      slug: "wardogs-artillery-guide",
      keyword: "wardogs artillery guide",
    }));

    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-artillery-guide");
      const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(guide, `${locale}/wardogs-artillery-guide`).not.toBeNull();
      expect(guide?.frontmatter.updatedAt).toBe(locale === "zh-cn" ? "2026-09-01" : "2026-08-28");
      expect(sourceUrls).toContain("https://www.youtube.com/watch?v=oP9RelmWk6A");
      expect(sourceUrls).toContain("https://www.youtube.com/watch?v=ZFRrDSru7Kg");
      expect(guide?.body).toMatch(/SPH-?2/i);
      expect(guide?.body).toMatch(/stabili|стабилиз|stabilisieren|estabiliz|安定化|稳定/i);
      expect(guide?.body).toMatch(/reload|перезар|nachladen|recarga|リロード|装填|换弹|重新加载/i);
      expect(guide?.body).toMatch(/build-sensitive|buildabhängig|версии сборки|dependente da build|ビルド依存|版本相关|构建敏感/i);
    }
  });

  it("adds the four newly researched creator videos to the localized video library", () => {
    const expectedVideos = new Map([
      ["wardogs-artillery-tank-guide", "oP9RelmWk6A"],
      ["wardogs-ammo-types-tested", "trlcyJgeZOo"],
      ["wardogs-stingray-anti-vehicle-drone", "OBjq7kVgtnQ"],
      ["wardogs-fast-money-routes", "Jm7ogJLKIJo"],
    ]);

    for (const [slug, youtubeId] of expectedVideos) {
      expect(videoArticles).toContainEqual(expect.objectContaining({slug, youtubeId}));
      for (const locale of locales) {
        expect(getLocalizedVideoArticle(locale, slug), `${locale}/videos/${slug}`).toBeDefined();
      }
    }
  });

  it("folds verified video findings into the maintained beginner, FOB, and money guides", async () => {
    for (const locale of locales) {
      const beginner = await loadGuideDocument(locale, "wardogs-beginner-guide");
      const fob = await loadGuideDocument(locale, "wardogs-fob-guide");
      const money = await loadGuideDocument(locale, "wardogs-money-guide");

      expect(beginner?.frontmatter.updatedAt, locale).toBe(locale === "zh-cn" ? "2026-09-01" : "2026-08-28");
      expect(fob?.frontmatter.updatedAt, locale).toBe(locale === "zh-cn" ? "2026-09-01" : "2026-08-29");
      expect(money?.frontmatter.updatedAt, locale).toBe(locale === "zh-cn" ? "2026-09-01" : "2026-08-29");

      expect(beginner?.frontmatter.sources.some(({url}) => url.includes("Msg78ysR_hQ"))).toBe(true);
      expect(beginner?.body).toMatch(/practice range|Übungsplatz|полигон|campo de treino|射撃練習場|训练场|实践范围/i);
      expect(beginner?.body).toMatch(/vehicle ammo|Fahrzeugmunition|боеприпас.*техник|munição do veículo|車両弾薬|车辆弹药/i);

      expect(fob?.frontmatter.sources.some(({url}) => url.includes("F5YU7eaQHBU"))).toBe(true);
      expect(fob?.frontmatter.sources.some(({url}) => url.includes("kg46BZ1H2W0"))).toBe(true);
      expect(fob?.body).toMatch(/ammo.*build.*fuel.*mechanical|Munition.*Bau.*Treibstoff.*mechanisch|боеприпас.*строит.*топлив.*механ|munição.*construção.*combustível.*mecân|弾薬.*建築.*燃料.*機械|弹药.*建造.*燃料.*机械/i);
      expect(fob?.body).toMatch(/small.*medium.*large|klein.*mittel.*groß|мал.*сред.*больш|pequen.*médio.*grande|小型.*中型.*大型|小.*中.*大/i);

      expect(money?.frontmatter.sources.some(({url}) => url.includes("Jm7ogJLKIJo"))).toBe(true);
      expect(money?.body).toMatch(/pilot|Pilot|пилот|piloto|パイロット|飞行员/i);
      expect(money?.body).toMatch(/Gold Bars|Goldbarren|золот.*слит|Barras de Ouro|ゴールドバー/i);
      expect(money?.body).toMatch(/not confirmed|nicht bestätigt|не подтверж|não confirmad|未確認|尚未(?:得到)?确认|未确认/i);
    }
  });

  it("keeps the completed reveal, live Beta 02, and official beta recap aligned", async () => {
    expect(NEWS_UPDATES).toContainEqual(expect.objectContaining({
      date: "2026-08-24",
      titleKey: "betaRecap",
      guideSlug: "wardogs-beta",
    }));

    for (const locale of locales) {
      const livestream = await loadGuideDocument(locale, "wardogs-livestream");
      const price = await loadGuideDocument(locale, "wardogs-price");
      const release = await loadGuideDocument(locale, "wardogs-release-date");

      expect(livestream?.frontmatter.updatedAt).toBe("2026-09-04");
      expect(livestream?.frontmatter.sources.map(({url}) => url)).toContain("https://www.twitch.tv/thefpsgamesshow");
      expect(livestream?.body).toMatch(/18:00 UTC/);
      expect(price?.frontmatter.updatedAt).toBe("2026-09-04");
      expect(price?.body).toContain("Beta 02");
      expect(price?.body).toContain("19:00 UTC");
      expect(release?.frontmatter.updatedAt).toBe("2026-09-04");
      expect(release?.body).toContain("Beta 02");
      expect(release?.body).toContain("08:00 UTC");
    }
  });
});
