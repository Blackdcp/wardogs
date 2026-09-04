import {describe, expect, it} from "vitest";
import {compileGuideBody} from "../../src/content/guides";

describe("MDX policy", () => {
  it.each([
    ["<script>alert(1)</script>", /raw html/i],
    ["<iframe src=\"https://example.com\" />", /component/i],
    ["import X from './x'", /import/i],
    ["![remote](https://example.com/a.jpg)", /remote image/i],
    ["![remote](//example.com/a.jpg)", /remote image/i]
  ])("rejects unsafe source", async (source, message) => {
    await expect(compileGuideBody(source, {})).rejects.toThrow(message);
  });

  it("compiles every approved component with the caller map", async () => {
    const names = ["FactGrid", "Notice", "Steps", "ComparisonTable", "OfficialVideo", "SourceNote", "FactionVisuals"];
    const components = Object.fromEntries(names.map((name) => [name, () => null]));
    const source = names.map((name) => `<${name} />`).join("\n");
    await expect(compileGuideBody(source, components)).resolves.toHaveProperty("content");
  });
});
