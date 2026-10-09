import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {locales} from "../../src/config/site";
import {VideoArticleCard} from "../../src/components/videos/video-article-card";
import {getVideoCandidateCopy} from "../../src/features/videos/video-candidate-copy";
import {VideoCandidateList} from "../../src/components/videos/video-candidate-list";
import {getLocalizedVideoArticle} from "../../src/features/videos/video-localization";
import {currentVideoSources, getVideoEra} from "../../src/features/videos/video-library";
import {recentVideoDate, recentVideos, recentVideoUi} from "../../src/features/videos/recent-video-data";
import {buildVideoArticleJsonLd} from "../../src/features/videos/video-structured-data";
import {getRecentNews} from "../../src/features/news/recent-news";
import {getHomeLiveIntelEntries} from "../../src/features/home/home-live-intel";

const reviewedIds = ["liRK9si1Ubo", "kC3P-klWNxk", "z7wMLQQtIIM", "j7hJXEXo5U8", "Qx1ndM1tc2Y", "PhAVGZMIYCg"];
describe("October video evidence and news discovery", () => {
  it("keeps exact upload timestamps and durations distinct from Shanghai display dates", () => {
    expect(recentVideos).toHaveLength(10);
    expect(new Set(recentVideos.map(video => video.id)).size).toBe(10);
    const evo = recentVideos.find(video => video.id === "kC3P-klWNxk")!;
    expect(evo).toMatchObject({publishedAt: "2026-10-07T12:43:50-07:00", durationSeconds: 1152});
    expect(recentVideoDate(evo)).toBe("2026-10-08");
    expect(recentVideos.filter(video => video.articleSlug).map(video => video.id)).toEqual(reviewedIds);
    expect(currentVideoSources.filter(video => !video.articleSlug).every(video => video.reviewedAt === "2026-09-17")).toBe(true);
  });
  it.each(locales)("publishes six source-specific watch pages with valid timed evidence and tools in %s", locale => {
    for (const source of recentVideos.filter(video => video.articleSlug)) {
      const article = getLocalizedVideoArticle(locale, source.articleSlug!)!;
      expect(article, source.id).toBeDefined();
      expect(getVideoEra(article)).toBe("current-analysis");
      expect(article.sections).toHaveLength(source.id === "Qx1ndM1tc2Y" ? 6 : 5);
      for (const section of article.sections) {
        expect(section.heading).toMatch(/^\d+(?::\d+){1,2}.* — .{4,}$/u);
        if (locale !== "en") {
          const index = article.sections.indexOf(section);
          expect(section.heading).not.toBe(getLocalizedVideoArticle("en", article.slug)!.sections[index].heading);
        }
      }
      expect(article.sections.map(section => section.body.join(" ")).join(" ").length).toBeGreaterThan(300);
      if (locale !== "en") expect(article.quickAnswer).not.toBe(getLocalizedVideoArticle("en", article.slug)!.quickAnswer);
      expect(article.relatedToolPath).toMatch(/^\/(tools\/|gold-market)/);
      expect(article.captionReview).toBe("full-track-read");
      expect(article.clips).toHaveLength(article.sections.length);
      for (const clip of article.clips!) {
        expect(clip.startOffset).toBeGreaterThanOrEqual(0);
        expect(clip.endOffset).toBeGreaterThan(clip.startOffset);
        expect(clip.endOffset).toBeLessThanOrEqual(source.durationSeconds);
        expect(clip.name.length).toBeGreaterThan(10);
      }
      const videoSchema = buildVideoArticleJsonLd(locale, article).find(item => item["@type"] === "VideoObject")!;
      expect(videoSchema.uploadDate).toBe(source.publishedAt);
      expect(videoSchema.duration).toBe(`PT${source.durationSeconds}S`);
      const html = renderToStaticMarkup(<VideoArticleCard locale={locale} article={article} />);
      expect(html).toContain(recentVideoUi[locale].current);
    }
  });
  it.each(locales)("reports full-caption and selected-caption review without claiming full footage in %s", locale => {
    const html = renderToStaticMarkup(<VideoCandidateList locale={locale} />);
    for (const source of recentVideos.filter(video => !video.articleSlug)) {
      const article = html.split(`id="candidate-${source.id}"`)[1].split("</article>")[0];
      expect(article).toContain("2026-10-09");
      expect(source.captionReview).not.toBe("not-reviewed");
      if (source.captionReview !== "not-reviewed") expect(article).toContain(getVideoCandidateCopy(locale).captions[source.captionReview]);
      expect(article).toContain(getVideoCandidateCopy(locale).noFootage);
      expect(article).not.toContain(recentVideoUi[locale].full);
      expect(article).toContain(source.toolPath);
    }
  });
  it.each(locales)("prioritizes the official devlog preview without inventing a published video in %s", async locale => {
    const news = getRecentNews(locale);
    const devlog = news.find(item => item.titleKey === "devlogPreviewOctober8")!;
    expect(devlog.date).toBe("2026-10-08");
    expect(devlog.sources).toEqual(["https://discord.com/channels/1464219389913071646/1464230515862278215/1557782520223895602"]);
    const home = await getHomeLiveIntelEntries(locale);
    expect(home.map(item => item.id)).toEqual(["recent-devlogPreviewOctober8", "recent-creatorGuidesOctober8", "recent-contestClosedOctober9"]);
    expect(home.every(item => item.current === false)).toBe(true);
    expect(home.every(item => item.statusLabel && item.dateLabel)).toBe(true);
    expect(home[0].verifiedAt).toBe("2026-10-08");
    expect(home[1].sourceClass).toBe("creator-current");
  });
  it("keeps income, failure costs and unlock gates in the promoted cases", () => {
    const money = getLocalizedVideoArticle("en", "wardogs-fob-income-breakdown")!;
    const support = getLocalizedVideoArticle("en", "wardogs-offensive-support-playstyle")!;
    expect(money.quickAnswer).toContain("334k earned but just over 200k profit");
    expect(money.sections.map(section => section.body.join(" ")).join(" ")).toContain("about 350 net profit");
    expect(money.clips?.map(clip => clip.startOffset)).toEqual([85, 485, 736, 1106, 2379, 3354]);
    expect(support.clips?.map(clip => clip.startOffset)).toEqual([29, 85, 353, 494, 578]);
    expect(support.quickAnswer).toContain("separate remote-detonator unlock");
    const html = renderToStaticMarkup(<VideoCandidateList locale="en" />);
    expect(html).not.toContain('id="candidate-Qx1ndM1tc2Y"');
    expect(html).not.toContain('id="candidate-PhAVGZMIYCg"');
    expect(html).toContain("1:26–43:21");
    expect(html).toContain("1:23–26:33");
    expect(html).toContain("1:31–31:51");
    const news = getRecentNews("en");
    expect(news.find(item => item.titleKey === "supportCaseOctober7")).toMatchObject({date: "2026-10-07", sourceClass: "creator-current"});
    expect(news.find(item => item.titleKey === "fobIncomeCaseOctober6")).toMatchObject({date: "2026-10-06", sourceClass: "creator-current"});
  });

});
