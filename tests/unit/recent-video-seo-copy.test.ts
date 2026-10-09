import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {recentVideos} from "../../src/features/videos/recent-video-data";
import {getRecentVideoArticles} from "../../src/features/videos/recent-video-articles";
import {getRecentVideoSeo, RECENT_VIDEO_SEO_SLUGS} from "../../src/features/videos/recent-video-seo-copy";

const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase().trim();

describe("recent video SEO summaries", () => {
  it("covers exactly the six published recent analyses, with no metadata-only candidates", () => {
    expect([...RECENT_VIDEO_SEO_SLUGS].sort()).toEqual(recentVideos.flatMap(video => video.articleSlug ? [video.articleSlug] : []).sort());
    expect(new Set(RECENT_VIDEO_SEO_SLUGS).size).toBe(6);
    expect(getRecentVideoSeo("en", "not-a-video")).toBeUndefined();
    expect(getRecentVideoSeo("en", "toString")).toBeUndefined();
  });

  it.each(locales)("provides concise, unique, localized descriptions and intents in %s", locale => {
    const descriptions = new Set<string>();
    const articles = getRecentVideoArticles(locale);
    for (const slug of RECENT_VIDEO_SEO_SLUGS) {
      const seo = getRecentVideoSeo(locale, slug)!;
      const article = articles.find(article => article.slug === slug)!;
      expect(seo).toBeDefined();
      expect(seo.description).toBe(seo.description.trim());
      expect(seo.description.length).toBeLessThanOrEqual(160);
      expect(seo.description.length).toBeGreaterThanOrEqual(["ja", "zh-cn", "zh-tw"].includes(locale) ? 35 : 100);
      expect(seo.description).not.toBe(article.quickAnswer);
      expect(seo.description).not.toMatch(/[<>\n]|https?:\/\//);
      descriptions.add(seo.description);
      expect(seo.keywords.length).toBeGreaterThanOrEqual(4);
      expect(seo.keywords.length).toBeLessThanOrEqual(6);
      expect(new Set(seo.keywords.map(normalize)).size).toBe(seo.keywords.length);
      for (const keyword of seo.keywords) {
        expect(keyword).toBe(keyword.trim());
        expect(keyword.length).toBeGreaterThan(2);
        expect(keyword.length).toBeLessThan(55);
        expect(keyword).not.toMatch(/wardogs|https?:|,/i);
        expect(normalize(keyword)).not.toBe(normalize(article.title));
      }
      if (locale !== "en") {
        expect(seo.description).not.toBe(getRecentVideoSeo("en", slug)!.description);
        expect(seo.keywords).not.toEqual(getRecentVideoSeo("en", slug)!.keywords);
      }
      if (locale === "ja" || locale.startsWith("zh-")) expect(seo.description).toMatch(/[\u3040-\u30ff\u3400-\u9fff]/u);
      if (locale === "ru") expect(seo.description).toMatch(/[А-Яа-яЁё]/u);
    }
    expect(descriptions.size).toBe(6);
  });

  it("keeps creator attribution, net-profit and unlock distinctions in the English snippets", () => {
    expect(getRecentVideoSeo("en", "wardogs-fob-income-breakdown")!.description).toMatch(/RadioGLHF reports 334k earned but just over 200k profit/);
    expect(getRecentVideoSeo("en", "wardogs-offensive-support-playstyle")!.description).toContain("class level from the C4 detonator unlock");
    expect(getRecentVideoSeo("en", "wardogs-season-2-developer-interview")!.description).toContain("planned Season 2 weapons");
    expect(getRecentVideoSeo("en", "wardogs-ir-rangefinder-hotfix")!.description).toContain("Gold-price theories");
  });
});
