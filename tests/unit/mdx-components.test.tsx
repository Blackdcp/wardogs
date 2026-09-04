import {describe, expect, it} from "vitest";
import {mdxComponents} from "../../src/components/mdx/mdx-components";

describe("MDX components", () => {
  it("exports only the seven approved custom components", () => {
    expect(Object.keys(mdxComponents).sort()).toEqual([
      "ComparisonTable",
      "FactGrid",
      "FactionVisuals",
      "Notice",
      "OfficialVideo",
      "SourceNote",
      "Steps"
    ]);
  });
});
