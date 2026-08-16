import {describe, expect, it} from "vitest";
import {getVideoArticle} from "../../src/features/videos/video-library";
import {buildVideoArticleJsonLd} from "../../src/features/videos/video-structured-data";

describe("video structured data", () => {
  it("includes uploadDate on VideoObject results for Google video indexing", () => {
    const article = getVideoArticle("wardogs-7-things-you-need-to-know");
    expect(article).toBeDefined();

    const jsonLd = buildVideoArticleJsonLd("en", article!);
    const videoObject = jsonLd.find((item) => item["@type"] === "VideoObject");

    expect(videoObject).toMatchObject({
      "@type": "VideoObject",
      uploadDate: article!.publishedDate
    });
    expect(videoObject?.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
