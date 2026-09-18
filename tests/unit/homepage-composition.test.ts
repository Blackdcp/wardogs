import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("puts task navigation and visual catalogue before the long-form guide index", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const hero = source.indexOf("<HomeHero");
    const live = source.indexOf("<LiveBetaBanner");
    const search = source.indexOf("<SiteSearch");
    const actions = source.indexOf("<HomeActionHub");
    const changes = source.indexOf("<CurrentBuildChanges");
    const catalogue = source.indexOf("<CatalogueHomeBand");
    const priorities = source.indexOf("<PriorityGuides");

    expect(hero).toBeGreaterThan(-1);
    expect(live).toBeGreaterThan(hero);
    expect(search).toBeGreaterThan(live);
    expect(actions).toBeGreaterThan(search);
    expect(changes).toBeGreaterThan(actions);
    expect(catalogue).toBeGreaterThan(changes);
    expect(priorities).toBeGreaterThan(catalogue);
  });

  it("keeps the branded visual hero before the compact operational status surface", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");

    expect(source).toContain("<HomeHero facts={facts} />");
    expect(source).toContain("<LiveBetaBanner compact />");
    expect(source.indexOf("<HomeHero")).toBeLessThan(source.indexOf("<LiveBetaBanner"));
    expect(source.indexOf("<LiveBetaBanner")).toBeLessThan(source.indexOf("<SiteSearch"));
  });

  it("keeps the visible WARDOGS Wiki brand and hero artwork in the hero component", () => {
    const source = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");

    expect(source).toContain('src={assetPath("/images/wardogs-hero.jpg")}');
    expect(source).toContain("WARDOGS Wiki");
    expect(source).toContain('id="home-hero-title"');
  });
});
