import {describe, expect, it} from "vitest";
import {getFeaturedVideoArticles, videoArticles} from "../../src/features/videos/video-library";

describe("video article library", () => {
  it("keeps every collected YouTube source as its own indexable article", () => {
    expect(videoArticles).toHaveLength(8);
    expect(videoArticles.map(({youtubeId}) => youtubeId)).toEqual([
      "ugkuP4a3xk4",
      "-k6IV0ITLDo",
      "eAE9LOV-p3s",
      "83AVH6FtemY",
      "utnQT_Jmd5w",
      "3EynP3GjopE",
      "3Jwi15nA-gg",
      "UKL0hwMRT9s"
    ]);
    expect(new Set(videoArticles.map(({slug}) => slug)).size).toBe(8);
    expect(videoArticles.every((article) => article.internalGuideSlug.length > 0)).toBe(true);
  });

  it("promotes the strongest video articles first", () => {
    expect(getFeaturedVideoArticles(3).map(({slug}) => slug)).toEqual([
      "wardogs-10-reasons-not-to-buy",
      "wardogs-7-things-you-need-to-know",
      "wardogs-gameplay-impressions"
    ]);
  });
});
