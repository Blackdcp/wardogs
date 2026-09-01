import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

describe("guide responsive typography", () => {
  it("wraps whole words before splitting long tokens on narrow screens", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "[locale]", "guides", "[slug]", "page.tsx"),
      "utf8",
    );

    expect(source).toContain('overflowWrap: "break-word", wordBreak: "normal"');
    expect(source).not.toContain('wordBreak: "break-all"');
  });
});
