import {describe, expect, it} from "vitest";
import {getVideoArticle} from "../../src/features/videos/video-library";
import {buildVideoArticleJsonLd} from "../../src/features/videos/video-structured-data";

describe("video structured data", () => {
  it("includes timezone-aware uploadDate on VideoObject results for Google video indexing", () => {
    const article = getVideoArticle("wardogs-7-things-you-need-to-know");
    expect(article).toBeDefined();

    const jsonLd = buildVideoArticleJsonLd("en", article!);
    const videoObject = jsonLd.find((item) => item["@type"] === "VideoObject");

    expect(videoObject).toMatchObject({
      "@type": "VideoObject",
      uploadDate: `${article!.publishedDate}T00:00:00+00:00`
    });
    expect(videoObject?.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
  });

  it("publishes transcript-backed key moments as Clip markup", () => {
    const article = getVideoArticle("wardogs-loadout-gear-guide");
    expect(article).toBeDefined();
    expect((article as typeof article & {clips?: unknown[]})?.clips).toHaveLength(8);

    const jsonLd = buildVideoArticleJsonLd("en", article!);
    const videoObject = jsonLd.find((item) => item["@type"] === "VideoObject");
    const clips = videoObject?.hasPart as Array<Record<string, unknown>> | undefined;

    expect(clips?.[0]).toMatchObject({
      "@type": "Clip",
      name: "Starter weapons and free resources",
      startOffset: 0,
      endOffset: 63,
      url: "http://localhost:3000/en/videos/wardogs-loadout-gear-guide?t=0"
    });
    expect(clips?.map((clip) => clip.startOffset)).toEqual([0, 63, 136, 203, 267, 343, 408, 474]);
  });
});
