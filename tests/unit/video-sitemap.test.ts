import {describe, expect, it} from "vitest";
import robots from "../../src/app/robots";
import * as videoStructuredData from "../../src/features/videos/video-structured-data";
import {locales} from "../../src/config/site";
import {videoArticles} from "../../src/features/videos/video-library";

describe("video sitemap", () => {
  it("advertises a dedicated video sitemap in robots.txt", () => {
    expect(robots().sitemap).toEqual([
      "http://localhost:3000/sitemap.xml",
      "http://localhost:3000/video-sitemap.xml"
    ]);
  });

  it("describes every localized watch page with a large thumbnail and embeddable player", () => {
    const buildVideoSitemapXml = (videoStructuredData as typeof videoStructuredData & {
      buildVideoSitemapXml?: () => string;
    }).buildVideoSitemapXml;

    expect(buildVideoSitemapXml).toBeTypeOf("function");
    if (!buildVideoSitemapXml) return;

    const xml = buildVideoSitemapXml();
    expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    expect(xml).toContain("https://i.ytimg.com/vi/J5QZXLENLgQ/maxresdefault.jpg");
    expect(xml).toContain("https://www.youtube-nocookie.com/embed/J5QZXLENLgQ");
    expect(xml.match(/<video:video>/g)).toHaveLength(locales.length * videoArticles.length);
  });
});
