import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("puts player tasks and tools before the catalogue and search", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const sections = ["<HomeHero", "<LiveBetaBanner", "<HomeActionHub", "<HomeGuideHub", "<CatalogueHomeBand", "<SiteSearch"].map((component) => source.indexOf(component));
    expect(sections.every((position) => position >= 0)).toBe(true);
    expect(sections).toEqual([...sections].sort((a, b) => a - b));
    expect(source).toContain('data-page-ad-inventory="home"');
    expect(source).toContain("sponsoredSlot=");
    for (const duplicate of ["<HomeEditorialBriefing", "<StartHere", "<CurrentBuildChanges", "<PriorityGuides", "<HomeDiscoveryCompact"]) expect(source).not.toContain(duplicate);
  });

  it("keeps the visible WARDOGS Wiki brand and hero artwork", () => {
    const source = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");
    expect(source).toContain('src={assetPath("/images/wardogs-hero.jpg")}');
    expect(source).toContain("WARDOGS Wiki");
    expect(source).toContain('id="home-hero-title"');
  });
});
