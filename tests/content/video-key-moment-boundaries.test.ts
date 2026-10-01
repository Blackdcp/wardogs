import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";
import {buildVideoArticleJsonLd} from "../../src/features/videos/video-structured-data";

describe.each(locales)("%s video key moment boundaries", (locale) => {
  it("only emits complete Clip intervals for every localized video article", () => {
    const articles = getLocalizedVideoArticles(locale);
    for (const article of articles) {
      const video = buildVideoArticleJsonLd(locale, article).find((item) => item["@type"] === "VideoObject")!;
      const clips = video.hasPart as Array<Record<string, unknown>> | undefined;
      const boundedChapters = (article.clips ?? []).filter((clip) => clip.endOffset !== undefined);
      expect(clips?.length ?? 0, article.slug).toBe(boundedChapters.length);
      if (!boundedChapters.length) expect(video, article.slug).not.toHaveProperty("hasPart");
      for (const clip of clips ?? []) {
        expect(Number.isFinite(clip.startOffset), article.slug).toBe(true);
        expect(Number.isFinite(clip.endOffset), article.slug).toBe(true);
        expect(clip.startOffset, article.slug).toBeGreaterThanOrEqual(0);
        expect(clip.endOffset, article.slug).toBeGreaterThan(clip.startOffset as number);
        expect(clip.name, article.slug).toBeTruthy();
        const url = new URL(clip.url as string);
        expect(url.pathname, article.slug).toBe(`/${locale}/videos/${article.slug}`);
        expect(url.searchParams.get("t"), article.slug).toBe(String(clip.startOffset));
      }
    }
  });
});
