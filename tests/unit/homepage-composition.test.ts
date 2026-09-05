import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("homepage composition", () => {
  it("puts task navigation and visual catalogue before the long-form guide index", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/page.tsx"), "utf8");
    const live = source.indexOf("<LiveBetaBanner");
    const actions = source.indexOf("<HomeActionHub");
    const catalogue = source.indexOf("<CatalogueHomeBand");
    const priorities = source.indexOf("<PriorityGuides");

    expect(live).toBeGreaterThan(-1);
    expect(actions).toBeGreaterThan(live);
    expect(catalogue).toBeGreaterThan(actions);
    expect(priorities).toBeGreaterThan(catalogue);
  });
});
