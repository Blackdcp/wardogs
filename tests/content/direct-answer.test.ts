import type {Root} from "mdast";
import {readFile} from "node:fs/promises";
import matter from "gray-matter";
import {describe, expect, it} from "vitest";
import {extractDirectAnswer} from "../../src/content/direct-answer";
import {compileLocalizedGuideBody} from "../../src/content/guides";

const paragraph = (value: string) => ({type: "paragraph", children: [{type: "text", value}]});

describe("guide direct answers", () => {
  it("reads the answer immediately after a heading, without selecting the following list", async () => {
    const result = await compileLocalizedGuideBody("## Join a squad\nConfirm the server, faction and squad before checking voice.\n\n1. Check the microphone.\n2. Restart voice.", {}, "en");
    expect(result.directAnswer).toBe("Confirm the server, faction and squad before checking voice.");
  });

  it("keeps readable link labels, punctuation, inline controls and soft line breaks", async () => {
    const result = await compileLocalizedGuideBody("## Answer\n\nUse **the map** and [this guide](/en/guides/wardogs-map \"Map guide\"), then press `Career_90`.\nKeep the crew together &amp; check supplies.", {}, "en");
    expect(result.directAnswer).toBe("Use the map and this guide, then press Career_90. Keep the crew together & check supplies.");
  });

  it("removes paired emphasis left as Japanese text while preserving hashtags and underscores", async () => {
    const result = await compileLocalizedGuideBody("2分以内のWARDOGS動画を対象プラットフォームに**#WARDOGS100Kと@WARDOGS**付きで公開します。Career_90を確認してください。", {}, "ja");
    expect(result.directAnswer).toBe("2分以内のWARDOGS動画を対象プラットフォームに#WARDOGS100Kと@WARDOGS付きで公開します。Career_90を確認してください。");
  });

  it("leaves unpaired stars, underscores and inline code unchanged", () => {
    const tree = {type: "root", children: [{type: "paragraph", children: [
      {type: "text", value: "#tag Career_90 __plain__ **unfinished *single **** "},
      {type: "inlineCode", value: "**literal_code**"}
    ]}]} as Root;
    expect(extractDirectAnswer(tree)).toBe("#tag Career_90 __plain__ **unfinished *single **** **literal_code**");
  });

  it("does not summarize lists, tables, code, block quotes, images or component props", async () => {
    const result = await compileLocalizedGuideBody([
      "## Setup", "1. A list item is not the answer.", "> A quoted claim is not the answer.",
      "```md\nThis code is not an answer.\n```", "| Key | Value |\n| --- | --- |\n| Hidden | Internal |",
      "![An image caption](/image.webp)", '<Notice title="Internal notes">Component-only content</Notice>',
      "Confirm the live build before choosing a route."
    ].join("\n\n"), {Notice: () => null}, "en");
    expect(result.directAnswer).toBe("Confirm the live build before choosing a route.");
  });

  it("skips entire paragraphs containing MDX expressions or JSX instead of leaking their source", () => {
    const tree = {type: "root", children: [
      {type: "mdxjsEsm", value: 'export const secret = "internal"'},
      {type: "paragraph", children: [{type: "text", value: "partial "}, {type: "mdxTextExpression", value: "secret"}]},
      {type: "paragraph", children: [{type: "mdxJsxTextElement", name: "Notice", attributes: [{value: "internal"}], children: [{type: "text", value: "Hidden body"}]}]},
      paragraph("This complete paragraph is safe to present.")
    ]} as unknown as Root;
    expect(extractDirectAnswer(tree)).toBe("This complete paragraph is safe to present.");
  });

  it("returns no answer when there is no prose paragraph", async () => {
    const result = await compileLocalizedGuideBody("## Answer\n\n1. Only a list.\n\n```text\nOnly code.\n```", {}, "en");
    expect(result.directAnswer).toBeNull();
  });

  it("preserves the current gameplay introduction over an older Quick Answer section", async () => {
    const source = await readFile("content/en/guides/wardogs-gameplay.mdx", "utf8");
    const result = await compileLocalizedGuideBody(matter(source).content, {OfficialVideo: () => null}, "en");
    expect(result.directAnswer).toContain("BULKHEAD's live Steam Early Access tactical all-out warfare FPS");
    expect(result.directAnswer).toContain("2016 War Dogs movie");
  });
});
