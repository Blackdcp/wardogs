import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import matter from "gray-matter";
import {describe, expect, it} from "vitest";
import {compileLocalizedGuideBody} from "../../src/content/guides";
import type {Locale} from "../../src/config/site";

const baseline: Record<string, string> = {
  "content/en/guides/wardogs-progression-wipes-guide.mdx": "3465e44127c2ad1a3e992048433ae81843cc44deec7cd86d7899b6d7d02c93f1",
  "content/en/guides/wardogs-season-2.mdx": "e92f893abcdf4d8914081bf5276d6669cf229a0d9ee6927bf1042a188fe3fe1a",
  "content/ru/guides/wardogs-progression-wipes-guide.mdx": "b870136dade3f616f7bca13775fb4878f7e1d9f4cabdad9005774740f2258260",
  "content/ru/guides/wardogs-season-2.mdx": "57507699a044f555c54b107eb95a60b6e53d791f3b2be2b1b459afc703ef1c2a",
  "content/de/guides/wardogs-progression-wipes-guide.mdx": "d676b18d778a9028a9b5512c796dfe666de43ea16de2efa692d9300858aeb02e",
  "content/de/guides/wardogs-season-2.mdx": "211b61afe5a731cb478332e84dddcc43ac3546ba52c6e6b6770d9d6c4b1dc5dd",
  "content/pt-br/guides/wardogs-progression-wipes-guide.mdx": "6da5c944db88e3ec5d69004e10e38344e7d679a95344f67b77b3eb0f66981a42",
  "content/pt-br/guides/wardogs-season-2.mdx": "a9d5acb81826b5b6f4c61681523f3eaa9702883e420aa9d956622a8c4a3c331e",
  "content/ja/guides/wardogs-progression-wipes-guide.mdx": "dcaddbebeab7dbc6d16deaf61ccb9093e5fbcb4f677d9706423a9ff75271d7b9",
  "content/ja/guides/wardogs-season-2.mdx": "13f8a4d3aa360223f86c2dd3b99252c5ee8e5bc738e4597f6126736e0b1e32df",
  "content/zh-cn/guides/wardogs-progression-wipes-guide.mdx": "b28e39faf675a781c6a7423482b9b0cc8d7c3c07072b13031dcfec88384c3a96",
  "content/zh-cn/guides/wardogs-season-2.mdx": "ee864ce0392cbb653e19e6268b6e5bbddb8eaf3413d2250c4366ee7a56b1808b",
  "content/zh-tw/guides/wardogs-progression-wipes-guide.mdx": "028455f6d53958eaef8cd2059e5a91199eab37a4df5ad5114c65a5176203c7bb",
  "content/zh-tw/guides/wardogs-season-2.mdx": "4db00700343328cca4d6ce11cbdbf906f9835feb94094db6d0fe26082c366a12",
  "content/pl/guides/wardogs-progression-wipes-guide.mdx": "40b0dfa340df4efcbf77727c7d445bb53efcc946db1982dbc4810f0bafa42e0d",
  "content/pl/guides/wardogs-season-2.mdx": "fe70ac2408dd6ae09a5c6f67fdc818b2e21253dda931996ff038a9ffb4ab4219"
};

describe("progression and season comparison content boundaries", () => {
  it.each(Object.entries(baseline))("preserves TDK, slug and individual source dates: %s", async (file, expected) => {
    const {data, content} = matter(await readFile(file, "utf8"));
    const {title, description, keyword, slug, sources} = data;
    const digest = createHash("sha256").update(JSON.stringify({title, description, keyword, slug, sources})).digest("hex");
    expect(digest).toBe(expected);
    expect(data.updatedAt).toBe("2026-09-30");
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
