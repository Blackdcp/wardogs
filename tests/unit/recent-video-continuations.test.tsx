import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import trafficEvidence from "../../config/traffic-demand-evidence.json";
import {getRelatedGuides, getGuideRelatedVideoLinks} from "../../src/features/guides/related";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {getRecentVideoArticles} from "../../src/features/videos/recent-video-articles";
import {getVideoUi} from "../../src/features/videos/video-ui";
import {TOOL_REGISTRY} from "../../src/features/tools/tool-registry";
import {RelatedGuides} from "../../src/components/guides/related-guides";
import {buildToolRelatedLinks, ToolRelatedGuidesView} from "../../src/components/tools/tool-related-guides";

const preservedToolGuides = {
  "loadout-budget": ["wardogs-money-guide", "wardogs-equipment-tools-guide"],
  "logistics-planner": ["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-oil-rig-guide"],
  "progression-route": ["wardogs-progression-wipes-guide", "wardogs-achievements"]
};

describe("recent video, guide and tool return paths", () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each(locales)("returns to each recent analysis exactly once from its matching guide in %s", (locale) => {
    const articles = getRecentVideoArticles(locale);
    expect(articles).toHaveLength(6);
    for (const article of articles) {
      const existing = getGuideTaskData(article.internalGuideSlug, locale)?.videos.filter((video) => video.articleSlug === article.slug) ?? [];
      const supplemental = getGuideRelatedVideoLinks(locale, article.internalGuideSlug).filter((video) => video.slug === article.slug);
      expect(existing.length + supplemental.length, article.slug).toBe(1);
      const html = renderToStaticMarkup(<RelatedGuides guides={[]} locale={locale} title="Related" path={`/guides/${article.internalGuideSlug}`} />);
      if (existing.length) expect(html).not.toContain(`href="/${locale}/videos/${article.slug}"`);
      else {
        expect(html).toContain(`href="/${locale}/videos/${article.slug}"`);
        expect(html).toContain(getVideoUi(locale).readBreakdown);
        expect(html).toContain(renderToStaticMarkup(<span>{article.title}</span>));
      }
    }
    expect(getGuideRelatedVideoLinks(locale, "wardogs-mortar-guide")).toEqual([]);
    expect(getGuideRelatedVideoLinks(locale, "wardogs-factions")).toEqual([]);
  });

  it.each(locales)("keeps original tool guides and returns only to directly related reviewed analyses in %s", async (locale) => {
    const articles = getRecentVideoArticles(locale);
    for (const tool of TOOL_REGISTRY) {
      const model = await buildToolRelatedLinks(tool.id, locale);
      const expectedVideos = articles.filter((article) => article.relatedToolPath === tool.href);
      expect(model.videos.map(({slug}) => slug)).toEqual(expectedVideos.map(({slug}) => slug));
      expect(model.videos.length).toBeLessThanOrEqual(2);
      expect(new Set(model.guides.map(({slug}) => slug)).size).toBe(model.guides.length);
      const baseline = preservedToolGuides[tool.id as keyof typeof preservedToolGuides];
      if (baseline) expect(model.guides.slice(0, baseline.length).map(({slug}) => slug)).toEqual(baseline);
      const html = renderToStaticMarkup(<ToolRelatedGuidesView model={model} locale={locale} />);
      for (const video of expectedVideos) {
        expect(model.guides.some(({slug}) => slug === video.internalGuideSlug), video.slug).toBe(true);
        expect(html).toContain(`href="/${locale}/guides/${video.internalGuideSlug}"`);
        expect(html).toContain(`href="/${locale}/videos/${video.slug}"`);
        expect(html).toContain(renderToStaticMarkup(<span>{video.title}</span>));
      }
      expect(html).not.toContain("candidate-");
    }
  });

  it("keeps measured Japanese/Russian cargo and mortar traffic entries connected to operating guides", async () => {
    for (const locale of ["ja", "ru"] as const) {
      for (const [slug, target] of [["wardogs-cargo-guide", "wardogs-fob-guide"], ["wardogs-mortar-guide", "wardogs-artillery-guide"]]) {
        expect(trafficEvidence.evidence.some(({path, sources}) => path === `/${locale}/guides/${slug}` && sources.includes("gsc"))).toBe(true);
        expect((await getRelatedGuides(locale, slug))[0].slug).toBe(target);
      }
    }
  });

  it("renders guide and video return links correctly beneath the static-export base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    const locale = "ja";
    const guides = await getRelatedGuides(locale, "wardogs-fob-layouts");
    const guideHtml = renderToStaticMarkup(<RelatedGuides guides={guides} locale={locale} title="Related" path="/guides/wardogs-fob-layouts" />);
    expect(guideHtml).toContain('href="/wardogs/ja/guides/wardogs-fob-guide/"');
    expect(guideHtml).toContain('href="/wardogs/ja/videos/wardogs-solo-duo-fob-layout/"');
    const toolHtml = renderToStaticMarkup(<ToolRelatedGuidesView model={await buildToolRelatedLinks("loadout-budget", locale)} locale={locale} />);
    expect(toolHtml).toContain('href="/wardogs/ja/guides/wardogs-best-weapons-loadouts/"');
    expect(toolHtml).toContain('href="/wardogs/ja/videos/wardogs-attachments-tested/"');
    expect(guideHtml + toolHtml).not.toContain('href="/ja/');
  });
});
