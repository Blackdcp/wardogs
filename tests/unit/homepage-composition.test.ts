import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("arranges the homepage as value first, sponsored second-screen, then trust and discovery", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const primarySections = [
      "<HomeHero",
      "<LiveBetaBanner",
      "<HomeEditorialBriefing",
      "<HomeActionHub",
      "<StartHere",
      "<CurrentBuildChanges",
      "<PriorityGuides",
      "<BeginnerTips",
      "<VideoIntelligence",
      "<CatalogueHomeBand",
      "<CategoryGrid",
      "<AboutGame",
      "<HomeFaq",
      "<SiteSearch",
      "<FinalCta"
    ].map((component) => source.indexOf(component));

    expect(primarySections.every((position) => position >= 0)).toBe(true);
    expect(primarySections).toEqual([...primarySections].sort((left, right) => left - right));
    expect(source).toContain("sponsoredSlot=");
    expect(source).toContain('data-page-ad-inventory="home"');
    expect(source.indexOf("sponsoredSlot=")).toBeGreaterThan(source.indexOf("<HomeActionHub"));
    expect(source.indexOf("sponsoredSlot=")).toBeLessThan(source.indexOf("<CurrentBuildChanges"));
  });

  it("keeps the branded visual hero before the compact operational status surface", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");

    expect(source).toContain("<HomeHero facts={facts}");
    expect(source).toContain("<LiveBetaBanner compact />");
    expect(source.indexOf("<HomeHero")).toBeLessThan(source.indexOf("<LiveBetaBanner"));
    expect(source.indexOf("<LiveBetaBanner")).toBeLessThan(source.indexOf("<HomeEditorialBriefing"));
    expect(source.indexOf("<HomeEditorialBriefing")).toBeLessThan(source.indexOf("<HomeActionHub"));
    expect(source.indexOf("<HomeActionHub")).toBeLessThan(source.indexOf("<StartHere"));
    expect(source.indexOf("<StartHere")).toBeLessThan(source.indexOf("<SiteSearch"));
    expect(source.indexOf("<HomeFaq")).toBeLessThan(source.indexOf("<SiteSearch"));
    expect(source.indexOf("<SiteSearch")).toBeLessThan(source.indexOf("<FinalCta"));
  });

  it("keeps the visible WARDOGS Wiki brand and hero artwork in the hero component", () => {
    const source = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");

    expect(source).toContain('src={assetPath("/images/wardogs-hero.jpg")}');
    expect(source).toContain("WARDOGS Wiki");
    expect(source).toContain('id="home-hero-title"');
    expect(source).not.toContain("<StatsGrid");
  });
});
