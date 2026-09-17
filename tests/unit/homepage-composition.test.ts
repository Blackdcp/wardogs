import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("puts task navigation and visual catalogue before the long-form guide index", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const live = source.indexOf("<LiveBetaBanner");
    const search = source.indexOf("<SiteSearch");
    const actions = source.indexOf("<HomeActionHub");
    const changes = source.indexOf("<CurrentBuildChanges");
    const catalogue = source.indexOf("<CatalogueHomeBand");
    const priorities = source.indexOf("<PriorityGuides");

    expect(live).toBeGreaterThan(-1);
    expect(search).toBeGreaterThan(live);
    expect(actions).toBeGreaterThan(search);
    expect(changes).toBeGreaterThan(actions);
    expect(catalogue).toBeGreaterThan(changes);
    expect(priorities).toBeGreaterThan(catalogue);
  });

  it("starts with the operational status surface instead of the legacy marketing hero", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");

    expect(source).not.toContain("<HomeHero");
    expect(source.indexOf("<LiveBetaBanner")).toBeLessThan(source.indexOf("<SiteSearch"));
  });
});
