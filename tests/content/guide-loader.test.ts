import path from "node:path";
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, loadGuideDocument} from "../../src/content/guides";

const root = path.resolve("tests/fixtures");

describe("guide loader", () => {
  it("loads a matching MDX document", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay", root);
    expect(guide?.frontmatter.order).toBe(19);
    expect(guide?.body).toContain("## Match objective");
  });

  it("reports the exact missing matrix entries", async () => {
    await expect(assertCompleteContentMatrix(["en"], root)).rejects.toThrow(/19 missing/i);
  });
});
