import {describe, expect, it} from "vitest";
import {getFeaturedVideoArticles, videoArticles} from "../../src/features/videos/video-library";

describe("video article library", () => {
  it("keeps every collected YouTube source as its own indexable article", () => {
    expect(videoArticles).toHaveLength(19);
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
      "Em9HAhrZFeI"
    ]);
    expect(new Set(videoArticles.map(({slug}) => slug)).size).toBe(19);
    expect(videoArticles.every((article) => article.internalGuideSlug.length > 0)).toBe(true);
  });

  it("promotes the strongest video articles first", () => {
    expect(getFeaturedVideoArticles(3).map(({slug}) => slug)).toEqual([
      "wardogs-everything-before-playing",
      "wardogs-40-tips",
      "wardogs-first-10000"
    ]);
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
