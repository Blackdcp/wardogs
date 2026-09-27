import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("puts task navigation, catalogue, and featured guides before the compact search and updates", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const primarySections = [
      "<HomeHero",
      "<LiveBetaBanner",
      "<HomeActionHub",
      "<CatalogueHomeBand",
      "<PriorityGuides",
      "<SiteSearch",
      "<CurrentBuildChanges"
    ].map((component) => source.indexOf(component));

    expect(primarySections.every((position) => position >= 0)).toBe(true);
    expect(primarySections).toEqual([...primarySections].sort((left, right) => left - right));
  });

  it("keeps the branded visual hero before the compact operational status surface", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");

    expect(source).toContain("<HomeHero facts={facts} />");
    expect(source).toContain("<LiveBetaBanner compact />");
    expect(source.indexOf("<HomeHero")).toBeLessThan(source.indexOf("<LiveBetaBanner"));
    expect(source.indexOf("<LiveBetaBanner")).toBeLessThan(source.indexOf("<HomeActionHub"));
    expect(source.indexOf("<HomeActionHub")).toBeLessThan(source.indexOf("<SiteSearch"));
  });

  it("keeps the visible WARDOGS Wiki brand and hero artwork in the hero component", () => {
    const source = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");

    expect(source).toContain('src={assetPath("/images/wardogs-hero.jpg")}');
    expect(source).toContain("WARDOGS Wiki");
    expect(source).toContain('id="home-hero-title"');
  });
});
