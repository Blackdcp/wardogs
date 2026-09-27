import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {compileGuideBody, loadGuideDocument} from "../../src/content/guides";

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

  it("renders real guide Markdown tables as scrollable semantic tables", async () => {
    for (const [locale, slug] of [["en", "wardogs-patch-notes"], ["ja", "wardogs-system-requirements"]] as const) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide).not.toBeNull();
      const compiled = await compileGuideBody(guide!.body, mdxComponents);
      const html = renderToStaticMarkup(compiled.content);

      expect(html, locale).toContain('class="guide-table-scroll"');
      expect(html, locale).toContain('role="region"');
      expect(html, locale).toContain("<table>");
      expect(html, locale).toContain("<thead>");
      expect(html, locale).not.toContain("| ---");
    }
  });
});
