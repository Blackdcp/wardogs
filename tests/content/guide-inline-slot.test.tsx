import {renderToStaticMarkup} from "react-dom/server";
import type {Root} from "mdast";
import {describe, expect, it} from "vitest";
import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {locales} from "../../src/config/site";
import {guideManifest} from "../../src/content/manifest";
import {GUIDE_INLINE_SLOT, GUIDE_SUPPLEMENTAL_SLOT, findGuideInlineSlotBoundary, remarkGuideInlineSlot} from "../../src/content/guide-inline-slot";
import {remarkWardogsMdxPolicy} from "../../src/content/mdx-policy";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";

const slot = <aside data-test-inline-ad="true">Advertisement</aside>;
const source = `Intro with [existing link](/en/guides/wardogs-gameplay).

## First practical section

1. Keep the full first step.
2. Keep the full second step.

### Nested detail

Do not split this subheading from its section.

## Second practical section

| Weapon | Range |
| --- | --- |
| L81 | 300m |

## Third practical section

Everything after the ad remains here.
`;

describe("reserved guide inline ad slot", () => {
  it("adds nothing by default and preserves byte-identical rendered content around one optional slot", async () => {
    const baseline = await compileLocalizedGuideBody(source, {}, "en");
    const inserted = await compileLocalizedGuideBody(source, {}, "en", {inlineAd: slot});
    const baseHtml = renderToStaticMarkup(baseline.content);
    const html = renderToStaticMarkup(inserted.content);
    const slotHtml = renderToStaticMarkup(slot);
    expect(baseHtml).not.toContain("data-test-inline-ad");
    expect(html.split(slotHtml)).toHaveLength(2);
    expect(html.replace(`${slotHtml}\n`, "")).toBe(baseHtml);
    expect(html.indexOf("</table>")).toBeLessThan(html.indexOf(slotHtml));
    expect(html.indexOf(slotHtml)).toBeLessThan(html.indexOf("<h2>Third practical section"));
    expect(inserted.directAnswer).toBe(baseline.directAnswer);
  });

  it("falls back after one complete section, or after the complete body when no safe boundary exists", async () => {
    for (const [body, before] of [
      ["## One\n\nFirst body.\n\n## Two\n\nLast body.", "<h2>Two"],
      ["A body with no heading.\n\n- First\n- Second", ""]
    ]) {
      const compiled = await compileLocalizedGuideBody(body, {}, "en", {inlineAd: slot});
      const html = renderToStaticMarkup(compiled.content);
      const slotHtml = renderToStaticMarkup(slot);
      expect(html.split(slotHtml)).toHaveLength(2);
      if (before) expect(html.indexOf(slotHtml)).toBeLessThan(html.indexOf(before));
      else expect(html.trimEnd().endsWith(slotHtml)).toBe(true);
    }
  });

  it.each([false, true])("rejects author-supplied reserved tags even with insertion enabled=%s", async (enabled) => {
    await expect(compileLocalizedGuideBody(`<${GUIDE_INLINE_SLOT} />`, {}, "en", enabled ? {inlineAd: slot} : undefined)).rejects.toThrow(/not allowed/);
  });

  it("requires six H2 sections with body and preserves two complete sections between ads", async () => {
    const secondary = <aside data-test-secondary-ad="true">Supplemental</aside>;
    const makeBody = (count: number) => Array.from({length: count}, (_, i) => `## Section ${i + 1}\n\nComplete paragraph ${i + 1}.\n\n- Atomic list ${i + 1}`).join("\n\n");
    for (const count of [3, 5, 6, 9]) {
      const body = makeBody(count);
      const baseline = await compileLocalizedGuideBody(body, {}, "en");
      const compiled = await compileLocalizedGuideBody(body, {}, "en", {inlineAd: slot, supplementalAd: secondary});
      const html = renderToStaticMarkup(compiled.content);
      const primaryHtml = renderToStaticMarkup(slot);
      const secondaryHtml = renderToStaticMarkup(secondary);
      expect(html.split(primaryHtml)).toHaveLength(2);
      expect(html.split(secondaryHtml)).toHaveLength(count >= 6 ? 2 : 1);
      expect(html.replace(`${primaryHtml}\n`, "").replace(`${secondaryHtml}\n`, "")).toBe(renderToStaticMarkup(baseline.content));
      if (count >= 6) {
        const between = html.slice(html.indexOf(primaryHtml) + primaryHtml.length, html.indexOf(secondaryHtml));
        expect(between.match(/<h2>/g)).toHaveLength(2);
        expect(between).toContain("Complete paragraph 4.");
        expect(html.indexOf(secondaryHtml)).toBeLessThan(html.indexOf("<h2>Section 5"));
      }
    }
    const emptyHeadings = makeBody(5) + "\n\n## Empty six\n\n## Empty seven";
    const compiled = await compileLocalizedGuideBody(emptyHeadings, {}, "en", {inlineAd: slot, supplementalAd: secondary});
    expect(renderToStaticMarkup(compiled.content)).not.toContain("data-test-secondary-ad");
    await expect(compileLocalizedGuideBody(`<${GUIDE_SUPPLEMENTAL_SLOT} />`, {}, "en", {inlineAd: slot, supplementalAd: secondary})).rejects.toThrow(/not allowed/);
  });

  it.each(locales)("preserves every original AST node and inserts once before the end of every long %s guide", async (locale) => {
    for (const {slug} of guideManifest) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide, `${locale}/${slug}`).not.toBeNull();
      const body = prepareGuideBodyForTaskPanel(guide!.body, locale, Boolean(getGuideTaskData(slug, locale)));
      let checked = false;
      function assertInsertion() {
        return (tree: Root) => {
          const original = structuredClone(tree.children);
          const boundary = findGuideInlineSlotBoundary(tree);
          remarkGuideInlineSlot()(tree);
          const inserted = tree.children.filter((node) => "name" in node && node.name === GUIDE_INLINE_SLOT);
          expect(inserted, `${locale}/${slug}`).toHaveLength(1);
          tree.children.splice(boundary, 1);
          // Complete nodes include all heading text/IDs, nested lists, tables, links,
          // JSX attributes and source positions. No content is rewritten or dropped.
          expect(tree.children, `${locale}/${slug}`).toEqual(original);
          const h2Count = original.filter((node) => node.type === "heading" && node.depth === 2).length;
          if (h2Count >= 3) expect(boundary, `${locale}/${slug}`).toBeLessThan(original.length);
          checked = true;
        };
      }
      await compileMDX({source: body, options: {blockJS: true, blockDangerousJS: true, mdxOptions: {remarkPlugins: [remarkGfm, remarkWardogsMdxPolicy, assertInsertion]}}, components: Object.fromEntries(["FactGrid", "Notice", "Steps", "ComparisonTable", "OfficialVideo", "OfficialScreenshot", "SourceNote", "FactionVisuals"].map((name) => [name, () => null]))});
      expect(checked).toBe(true);
    }
  }, 60_000);
});
