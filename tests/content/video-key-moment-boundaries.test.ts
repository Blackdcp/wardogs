import {afterEach, describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";
import {buildVideoArticleJsonLd} from "../../src/features/videos/video-structured-data";

describe.each([
  {deployment: "Vercel", githubPages: "false", basePath: "", siteUrl: "https://www.wardogswiki.com", pathPrefix: "", pathSuffix: ""},
  {deployment: "GitHub Pages", githubPages: "true", basePath: "/wardogs", siteUrl: "https://blackdcp.github.io/wardogs", pathPrefix: "/wardogs", pathSuffix: "/"}
])("$deployment video key moment boundaries", ({githubPages, basePath, siteUrl, pathPrefix, pathSuffix}) => {
  afterEach(() => vi.unstubAllEnvs());

  it.each(locales)("%s only emits complete Clip intervals with deployment-specific URLs", (locale) => {
    vi.stubEnv("GITHUB_PAGES", githubPages);
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
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
        expect(url.pathname, article.slug).toBe(`${pathPrefix}/${locale}/videos/${article.slug}${pathSuffix}`);
        expect(url.searchParams.get("t"), article.slug).toBe(String(clip.startOffset));
      }
    }
  });
});
