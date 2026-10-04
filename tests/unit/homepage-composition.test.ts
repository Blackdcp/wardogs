import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("keeps the homepage short enough to scan while preserving the guide-site journey", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const primarySections = [
      "<HomeHero",
      "<LiveBetaBanner",
      "<HomeEditorialBriefing",
      "<StartHere",
      "<CurrentBuildChanges",
      "<PriorityGuides",
      "<CatalogueHomeBand",
      "<HomeDiscoveryCompact",
      "<SiteSearch"
    ].map((component) => source.indexOf(component));

    expect(primarySections.every((position) => position >= 0)).toBe(true);
    expect(primarySections).toEqual([...primarySections].sort((left, right) => left - right));
    expect(source).toContain("sponsoredSlot=");
    expect(source).toContain('data-page-ad-inventory="home"');
    expect(source.indexOf("sponsoredSlot=")).toBeGreaterThan(source.indexOf("<HomeEditorialBriefing"));
    expect(source.indexOf("sponsoredSlot=")).toBeLessThan(source.indexOf("<StartHere"));

    for (const removedHomeBlock of [
      "<HomeActionHub",
      "<BeginnerTips",
      "<VideoIntelligence",
      "<CategoryGrid",
      "<AboutGame",
      "<HomeFaq",
      "<FinalCta"
    ]) {
      expect(source).not.toContain(removedHomeBlock);
    }
    expect(source).toContain("<HomeDiscoveryCompact guideCount={guides.length} locale={locale} />");
  });

  it("keeps the branded hero before a compact editorial desk and then the remaining homepage sections", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");

    expect(source).toContain("<HomeHero facts={facts}");
    expect(source).toContain("<LiveBetaBanner compact />");
    expect(source.indexOf("<HomeHero")).toBeLessThan(source.indexOf("<LiveBetaBanner"));
    expect(source.indexOf("<LiveBetaBanner")).toBeLessThan(source.indexOf("<HomeEditorialBriefing"));
    expect(source.indexOf("<HomeEditorialBriefing")).toBeLessThan(source.indexOf("<StartHere"));
    expect(source.indexOf("<StartHere")).toBeLessThan(source.indexOf("<CurrentBuildChanges"));
    expect(source.indexOf("<CurrentBuildChanges")).toBeLessThan(source.indexOf("<PriorityGuides"));
    expect(source.indexOf("<PriorityGuides")).toBeLessThan(source.indexOf("<CatalogueHomeBand"));
    expect(source.indexOf("<CatalogueHomeBand")).toBeLessThan(source.indexOf("<HomeDiscoveryCompact"));
    expect(source.indexOf("<HomeDiscoveryCompact")).toBeLessThan(source.indexOf("<SiteSearch"));
  });

  it("keeps the visible WARDOGS Wiki brand and hero artwork in the hero component", () => {
    const source = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");

    expect(source).toContain('src={assetPath("/images/wardogs-hero.jpg")}');
    expect(source).toContain("WARDOGS Wiki");
    expect(source).toContain('id="home-hero-title"');
    expect(source).not.toContain("<StatsGrid");
  });
});
