import {describe, expect, it} from "vitest";
import {mdxComponents} from "../../src/components/mdx/mdx-components";

describe("MDX components", () => {
  it("exports only the approved custom components", () => {
    expect(Object.keys(mdxComponents).sort()).toEqual([
      "ComparisonTable",
      "FactGrid",
      "FactionVisuals",
      "Notice",
      "OfficialScreenshot",
      "OfficialVideo",
      "SourceNote",
      "Steps",
      "a",
      "table"
    ]);
  });
});
