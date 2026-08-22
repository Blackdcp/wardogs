import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {VideoArticleCard, videoThumbnailUrl} from "../../src/components/videos/video-article-card";
import {videoArticles} from "../../src/features/videos/video-library";

describe("VideoArticleCard", () => {
  it("uses the real YouTube thumbnail and links to the site's full article", () => {
    const article = videoArticles.find(({slug}) => slug === "wardogs-everything-before-playing")!;
    const html = renderToStaticMarkup(<VideoArticleCard article={article} locale="en" />);

    expect(videoThumbnailUrl(article.youtubeId)).toBe(
      "https://i.ytimg.com/vi/tF4-GnGlo4I/maxresdefault.jpg"
    );
    expect(html).toContain("tF4-GnGlo4I");
    expect(html).not.toContain("/_next/image");
    expect(html).toContain('href="/en/videos/wardogs-everything-before-playing"');
    expect(html).toContain("WARDOGS - Everything You Need to Know thumbnail");
  });

  it("can eagerly load the first visible thumbnail without changing later cards", () => {
    const article = videoArticles[0];
    const eagerHtml = renderToStaticMarkup(<VideoArticleCard article={article} locale="en" eager />);
    const lazyHtml = renderToStaticMarkup(<VideoArticleCard article={article} locale="en" />);

    expect(eagerHtml).toContain('loading="eager"');
    expect(lazyHtml).toContain('loading="lazy"');
  });
});
