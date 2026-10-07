import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import matter from "gray-matter";
import {describe, expect, it} from "vitest";
import {compileLocalizedGuideBody} from "../../src/content/guides";
import type {Locale} from "../../src/config/site";

const baseline: Record<string, string> = {
  "content/en/guides/wardogs-progression-wipes-guide.mdx": "42e012b5cda33ed1ee30288d470f9c946db0e6f5e17ea72b0fe842c635f9d7d8",
  "content/en/guides/wardogs-season-2.mdx": "98b74d7b7f3f37e7cf211cda5343050f0e8c9ea777681195505b6e53a91bef16",
  "content/ru/guides/wardogs-progression-wipes-guide.mdx": "4f1c7c49f1b8db80f404b80089e4cf69d7095c0085fc2c0d799200a183d0629f",
  "content/ru/guides/wardogs-season-2.mdx": "867c7ed06dbe35415f795205e9d6ded4c0f9e1dcca7c8a7e3b337417dc589938",
  "content/de/guides/wardogs-progression-wipes-guide.mdx": "baabfef91cfbdfe75ee36181b06eec9472062344fbde541b7d152c687fa96165",
  "content/de/guides/wardogs-season-2.mdx": "a0833e45c4bfb7dccf959f35f38d49045d3f57c845cef64b61941dd61781490f",
  "content/pt-br/guides/wardogs-progression-wipes-guide.mdx": "a10247a2286c607ed720acc71d88f8bab5c3b5612918981c1fff799d93795c79",
  "content/pt-br/guides/wardogs-season-2.mdx": "0968acd4fdf3f98115050b75fcb83a0d5e68a1da14c440e3c10ef6205de79384",
  "content/ja/guides/wardogs-progression-wipes-guide.mdx": "389ac934058b2e5ad1c0a1dd08a3505f3225f7093e2cfdbdf98d70b1ea89f5b8",
  "content/ja/guides/wardogs-season-2.mdx": "85720b2dbd7ebb4f09a1a27bb69c695bd8f600d6e54afe5f56db8770af74b3c0",
  "content/zh-cn/guides/wardogs-progression-wipes-guide.mdx": "185adb694e86ec8a655afabcb46f2841e4ee536e2dfc06df156409e2f8be61e7",
  "content/zh-cn/guides/wardogs-season-2.mdx": "b879b89be11dbf0399b8de87769362ea74eab06dcfa62598b3943610c7564245",
  "content/zh-tw/guides/wardogs-progression-wipes-guide.mdx": "3c0ba944a11aac75a4aa75eec864ff0beb0b81b1893d12ded32f3592bb118dc7",
  "content/zh-tw/guides/wardogs-season-2.mdx": "ac91d7d527caf9f9bd996205bddd1df299a3982fd8d84ade9fc39643e1531675",
  "content/pl/guides/wardogs-progression-wipes-guide.mdx": "17140bbfa0232e00903df1d5ca50c219a2a9995e9bf11fc7e908f897b3648537",
  "content/pl/guides/wardogs-season-2.mdx": "84e084164eff9c7ec0590026bfcb453f01e18628d123d3f8c4a66bfdd28ca7c1"
};

describe("progression and season comparison content boundaries", () => {
  it.each(Object.entries(baseline))("validates reviewed TDK, slug and individual source dates: %s", async (file, expected) => {
    const {data, content} = matter(await readFile(file, "utf8"));
    const {title, description, keyword, slug, sources} = data;
    const digest = createHash("sha256").update(JSON.stringify({title, description, keyword, slug, sources})).digest("hex");
    expect(digest).toBe(expected);
    const refreshedAnswer = /^content\/(en|ja)\/guides\/wardogs-progression-wipes-guide\.mdx$/.test(file);
    expect(data.updatedAt).toBe(refreshedAnswer ? "2026-10-07" : "2026-10-03");
    const sections = [...content.matchAll(/^## .+$/gm)];
    const footer = content.slice(sections.at(-2)!.index, sections.at(-1)!.index);
    for (const source of sources) {
      expect(footer).toContain(`](${source.url}) | ${source.checkedAt} |`);
    }
    expect(footer).toContain("2026-09-30");
    const locale = file.split("/")[1] as Locale;
    expect(content).toContain(`](/${locale}/tools/progression-route)`);
    expect(content).not.toMatch(/complete (?:all )?231|全部.?231|全.?231.*(?:解锁|解鎖)/i);
    await expect(compileLocalizedGuideBody(content, {}, locale)).resolves.toHaveProperty("content");
  });
});
