import {describe, expect, it} from "vitest";
import {compileGuideBody} from "../../src/content/guides";

describe("MDX policy", () => {
  it.each([
    ["<script>alert(1)</script>", /raw html/i],
    ["<iframe src=\"https://example.com\" />", /component/i],
    ["import X from './x'", /import/i],
    ["![remote](https://example.com/a.jpg)", /remote image/i]
  ])("rejects unsafe source", async (source, message) => {
    await expect(compileGuideBody(source, {})).rejects.toThrow(message);
  });
});
