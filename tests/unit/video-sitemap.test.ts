import {describe, expect, it} from "vitest";
import robots from "../../src/app/robots";
import * as videoStructuredData from "../../src/features/videos/video-structured-data";
import {locales} from "../../src/config/site";
import {videoArticles} from "../../src/features/videos/video-library";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";

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
    expect(xml).toContain("https://i.ytimg.com/vi/J5QZXLENLgQ/hqdefault.jpg");
    expect(xml).toContain("https://www.youtube-nocookie.com/embed/J5QZXLENLgQ");
    expect(xml.match(/<video:video>/g)).toHaveLength(locales.length * videoArticles.length);
  });

  it("keeps every video sitemap entry aligned with its localized page and source metadata", () => {
    const xml = videoStructuredData.buildVideoSitemapXml();
    const entries = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<video:video>([\s\S]*?)<\/video:video>\s*<\/url>/g)];
    const byLocation = new Map(entries.map(([, location, video]) => [location, video]));

    for (const locale of locales) {
      for (const article of getLocalizedVideoArticles(locale)) {
        const location = `http://localhost:3000/${locale}/videos/${article.slug}`;
        const block = byLocation.get(location);
        expect(block, location).toBeDefined();
        expect(block, location).toContain(`<video:thumbnail_loc>https://i.ytimg.com/vi/${article.youtubeId}/hqdefault.jpg</video:thumbnail_loc>`);
        expect(block, location).toContain(`<video:player_loc allow_embed="yes">https://www.youtube-nocookie.com/embed/${article.youtubeId}</video:player_loc>`);
        expect(block, location).toContain(`<video:publication_date>${article.publishedDate}T00:00:00+00:00</video:publication_date>`);
      }
    }
  });
});
