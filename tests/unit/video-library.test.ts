import {describe, expect, it} from "vitest";
import {
  CURRENT_VIDEO_SOURCES_REVIEWED_AT,
  currentVideoSources,
  getCurrentVideoSourcesForGuide,
  getFeaturedVideoArticles,
  getVideoEra,
  videoArticles
} from "../../src/features/videos/video-library";

describe("video article library", () => {
  it("keeps every collected YouTube source as its own indexable article", () => {
    expect(videoArticles).toHaveLength(31);
    expect(videoArticles.map(({youtubeId}) => youtubeId)).toEqual([
      "ugkuP4a3xk4",
      "-k6IV0ITLDo",
      "J5QZXLENLgQ",
      "eAE9LOV-p3s",
      "83AVH6FtemY",
      "utnQT_Jmd5w",
      "3EynP3GjopE",
      "3Jwi15nA-gg",
      "UKL0hwMRT9s",
      "tF4-GnGlo4I",
      "Msg78ysR_hQ",
      "F5YU7eaQHBU",
      "fupZGU7LJaU",
      "2E-KNIugA2M",
      "wcsY2EeIlyc",
      "ZFRrDSru7Kg",
      "9mSvZyAk62E",
      "cSn5IGknapM",
      "Em9HAhrZFeI",
      "oP9RelmWk6A",
      "trlcyJgeZOo",
      "OBjq7kVgtnQ",
      "Jm7ogJLKIJo",
      "2aU4OB0duYg",
      "Hq6OZqPDoAc",
      "DT1_i8m8cMA",
      "SwlEyNdgw1o",
      "im60BiRZFow",
      "IO7-_TwxpII",
      "7O5QJNRzXzQ",
      "JSAu5nlLjJw"
    ]);
    expect(new Set(videoArticles.map(({slug}) => slug)).size).toBe(31);
    expect(videoArticles.every((article) => article.internalGuideSlug.length > 0)).toBe(true);
  });

  it("promotes the strongest video articles first", () => {
    expect(getFeaturedVideoArticles(3).map(({slug}) => slug)).toEqual([
      "wardogs-huge-news-progression",
      "wardogs-support-skill-leveling",
      "wardogs-kamikaze-drone-guide"
    ]);
  });

  it("publishes a current Season 1 source watchlist without duplicating archived breakdowns", () => {
    expect(CURRENT_VIDEO_SOURCES_REVIEWED_AT).toBe("2026-09-17");
    expect(currentVideoSources.map(({youtubeId}) => youtubeId)).toEqual([
      "fUKgHeT0JGY",
      "4CHoWpu4Imw",
      "Tkors4Fenh0",
      "mYXhZnJ8Eus",
      "VrtwXz94dQg",
      "XUyP1GLUF5o",
      "v0V69ZYMlgY",
      "smOE0063KOE"
    ]);
    expect(new Set(currentVideoSources.map(({youtubeId}) => youtubeId)).size).toBe(currentVideoSources.length);

    const archivedIds = new Set(videoArticles.map(({youtubeId}) => youtubeId));
    for (const source of currentVideoSources) {
      expect(archivedIds.has(source.youtubeId), source.youtubeId).toBe(false);
      expect(source.publishedDate >= "2026-09-11", source.youtubeId).toBe(true);
      expect(source.channel.length, source.youtubeId).toBeGreaterThan(0);
      expect(source.durationMinutes, source.youtubeId).toBeGreaterThan(0);
      expect(source.internalGuideSlug.length, source.youtubeId).toBeGreaterThan(0);
      expect(source.buildLabel, source.youtubeId).toBe("Season 1 current");
    }
  });

  it("returns only reviewed current sources connected to a guide", () => {
    expect(getCurrentVideoSourcesForGuide("wardogs-beginner-guide").map(({youtubeId}) => youtubeId)).toEqual([
      "fUKgHeT0JGY"
    ]);
    expect(getCurrentVideoSourcesForGuide("wardogs-controls")).toEqual([]);
  });

  it("separates reusable beta workflows from historical video evidence", () => {
    expect(getVideoEra(videoArticles.find(({slug}) => slug === "wardogs-best-settings")!)).toBe("beta-workflow");
    expect(getVideoEra(videoArticles.find(({slug}) => slug === "wardogs-huge-news-progression")!)).toBe("historical");
    expect(new Set(videoArticles.map(getVideoEra))).toEqual(new Set(["beta-workflow", "historical"]));
  });

  it("treats each video page as a full article instead of a short summary", () => {
    for (const article of videoArticles) {
      const bodyText = [
        article.quickAnswer,
        ...article.takeaways,
        ...article.sections.flatMap((section) => [section.heading, ...section.body])
      ].join(" ");

      expect(article.takeaways.length, article.slug).toBeGreaterThanOrEqual(5);
      expect(article.sections.length, article.slug).toBeGreaterThanOrEqual(5);
      expect(bodyText.length, article.slug).toBeGreaterThanOrEqual(3000);
    }
  });

  it("positions the settings video as a source breakdown for the maintained guide", () => {
    const article = videoArticles.find(({slug}) => slug === "wardogs-best-settings");

    expect(article).toBeDefined();
    expect(article?.internalGuideSlug).toBe("wardogs-best-settings");
    expect(article?.title).toMatch(/Video Breakdown/);
    expect(article?.description).toMatch(/source-specific|creator/i);
    expect(article?.quickAnswer).toMatch(/video|creator|source/i);
  });
});
