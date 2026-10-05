import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {VideoArticleCard} from "../../src/components/videos/video-article-card";
import {getVideoArticle} from "../../src/features/videos/video-library";

describe("video article lifecycle labels", () => {
  it("labels reusable beta workflows without presenting them as current footage", () => {
    const article = getVideoArticle("wardogs-best-settings");
    expect(article).toBeDefined();

    const html = renderToStaticMarkup(<VideoArticleCard article={article!} locale="en" />);

    expect(html).toContain("Beta workflow");
    expect(html).not.toContain("Season 1 current");
  });

  it("labels superseded news videos as historical references", () => {
    const article = getVideoArticle("wardogs-huge-news-progression");
    expect(article).toBeDefined();

    const html = renderToStaticMarkup(<VideoArticleCard article={article!} locale="en" />);

    expect(html).toContain("Historical reference");
  });
});
