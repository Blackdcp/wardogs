import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ContextualVideoEvidence} from "../../src/components/guides/contextual-video-evidence";
import VideosPage from "../../src/app/[locale]/videos/page";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {CURRENT_VIDEO_SOURCES_REVIEWED_AT} from "../../src/features/videos/video-library";

describe("ContextualVideoEvidence", () => {
  it("renders the reviewed source metadata, thumbnail, and both external and internal links", async () => {
    const source = getGuideTaskData("wardogs-beginner-guide", "en")!.videos[0];
    const html = renderToStaticMarkup(<ContextualVideoEvidence locale="en" sources={[source]} />);
    const anchorId = `current-video-${source.youtubeId}`;
    const hubHtml = renderToStaticMarkup(await VideosPage({params: Promise.resolve({locale: "en"})}));

    expect(html).toContain(source.title);
    expect(html).toContain(source.channel);
    expect(html).toContain(`dateTime="${source.publishedDate}"`);
    expect(html).toContain(`dateTime="${CURRENT_VIDEO_SOURCES_REVIEWED_AT}"`);
    expect(html).toContain("Season 1 current");
    expect(html).toContain(`href="${source.sourceUrl}"`);
    expect(html).toContain(`href="/en/videos#${anchorId}"`);
    expect(html).not.toContain(`href="/en/guides/${source.internalGuideSlug}"`);
    expect(hubHtml).toContain(`id="${anchorId}"`);
    expect(html).toContain(`alt="${source.title} video thumbnail"`);
    expect(html).toContain("Published");
    expect(html).toContain("Reviewed");
  });

  it("renders nothing when a guide has no reviewed current source", () => {
    expect(renderToStaticMarkup(<ContextualVideoEvidence locale="en" sources={[]} />)).toBe("");
  });
});
