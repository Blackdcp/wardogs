import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";
import {getRecentVideoArticle} from "@/features/videos/recent-video-articles";
import {recentVideos, recentVideoUi} from "@/features/videos/recent-video-data";
import {getVideoArticle, videoArticles} from "@/features/videos/video-library";
import {getLocalizedVideoArticle} from "@/features/videos/video-localization";
import {buildVideoArticleJsonLd, buildVideoSitemapXml} from "@/features/videos/video-structured-data";

// First four site analyses were added in 6fbbbf6 (2026-10-09 15:08 +08).
// RadioGLHF and Colvin became watch articles in db0a6f8 (2026-10-09 16:56 +08).
// These are article publication checkpoints, not the YouTube dates below.
const cases = [
  ["wardogs-season-2-developer-interview", "2026-10-01T11:52:18-07:00", "2026-10-02"],
  ["wardogs-attachments-tested", "2026-10-07T12:43:50-07:00", "2026-10-08"],
  ["wardogs-solo-duo-fob-layout", "2026-10-08T00:38:15-07:00", "2026-10-08"],
  ["wardogs-ir-rangefinder-hotfix", "2026-10-05T09:20:05-07:00", "2026-10-06"],
  ["wardogs-fob-income-breakdown", "2026-10-05T13:02:26-07:00", "2026-10-06"],
  ["wardogs-offensive-support-playstyle", "2026-10-06T09:00:03-07:00", "2026-10-07"]
] as const;
const videoLabels = ["Video published", "Video veröffentlicht", "Видео опубликовано", "Vídeo publicado", "動画公開日", "视频发布日期", "影片發布日期", "Publikacja filmu"];
const articleLabels = ["Article published", "Artikel veröffentlicht", "Статья опубликована", "Artigo publicado", "記事公開日", "文章发布日期", "文章發布日期", "Publikacja artykułu"];

describe("separate site analysis and source video publication dates", () => {
  it("assigns verified article dates only to the six newly published analyses", () => {
    const dated = recentVideos.filter(video => video.articlePublishedDate);
    expect(dated.map(video => video.articleSlug)).toEqual(cases.map(([slug]) => slug));
    expect(dated.every(video => video.articlePublishedDate === "2026-10-09")).toBe(true);
    expect(videoArticles.filter(article => article.articlePublishedDate).map(article => article.slug)).toEqual(cases.map(([slug]) => slug));
  });

  it.each(locales)("retains both dates through the real factory and localized article schema in %s", locale => {
    for (const [slug, upload, videoDay] of cases) {
      const article = getLocalizedVideoArticle(locale, slug)!;
      expect(getRecentVideoArticle(locale, slug)?.articlePublishedDate, slug).toBe("2026-10-09");
      expect(article, slug).toMatchObject({articlePublishedDate: "2026-10-09", publishedDate: videoDay, publishedAt: upload});
      const json = buildVideoArticleJsonLd(locale, article);
      expect(json.find(item => item["@type"] === "Article"), slug).toMatchObject({datePublished: "2026-10-09", dateModified: article.updatedDate});
      expect(json.find(item => item["@type"] === "VideoObject")?.uploadDate, slug).toBe(upload);
    }
    expect(videoLabels).toContain(recentVideoUi[locale].published);
    expect(articleLabels).toContain(recentVideoUi[locale].articlePublished);
    expect(recentVideoUi[locale].published).not.toBe(recentVideoUi[locale].articlePublished);
  });

  it("keeps exact YouTube upload times in all 48 new video sitemap entries", () => {
    const entries = new Map([...buildVideoSitemapXml().matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)].map(([, url, block]) => [url, block]));
    for (const locale of locales) {
      for (const [slug, upload] of cases) {
        const url = `http://localhost:3000/${locale}/videos/${slug}`;
        expect(entries.get(url), url).toContain(`<video:publication_date>${upload}</video:publication_date>`);
        expect(entries.get(url), url).not.toContain("<video:publication_date>2026-10-09");
      }
    }
  });

  it("does not refresh article publication when the review date changes or rewrite legacy dates", () => {
    const article = getVideoArticle(cases[0][0])!;
    const updated = buildVideoArticleJsonLd("en", {...article, updatedDate: "2026-10-15"});
    expect(updated.find(item => item["@type"] === "Article")).toMatchObject({datePublished: "2026-10-09", dateModified: "2026-10-15"});
    expect(updated.find(item => item["@type"] === "VideoObject")?.uploadDate).toBe(cases[0][1]);
    for (const legacy of videoArticles.filter(item => !item.articlePublishedDate)) {
      const json = buildVideoArticleJsonLd("en", legacy);
      expect(json.find(item => item["@type"] === "Article")?.datePublished, legacy.slug).toBe(legacy.publishedDate);
      expect(json.find(item => item["@type"] === "VideoObject")?.uploadDate, legacy.slug).toBe(legacy.publishedAt ?? `${legacy.publishedDate}T00:00:00+00:00`);
    }
  });
});
