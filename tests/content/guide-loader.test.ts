import {mkdtemp, mkdir, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
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
    await expect(assertCompleteContentMatrix(["en"], root)).rejects.toThrow(/19 missing: en[\\/]guides[\\/]wardogs-playtest\.mdx/i);
  });

  it("does not count MDX-named directories as files and reports extras", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "wardogs-content-"));
    const guideDirectory = path.join(temporaryRoot, "en", "guides");
    try {
      await mkdir(path.join(guideDirectory, "wardogs-gameplay.mdx"), {recursive: true});
      await writeFile(path.join(guideDirectory, "unlisted.mdx"), "extra", "utf8");
      await expect(assertCompleteContentMatrix(["en"], temporaryRoot)).rejects.toThrow(/20 missing:[\s\S]*1 extra: en[\\/]guides[\\/]unlisted\.mdx/i);
    } finally {
      await rm(temporaryRoot, {recursive: true, force: true});
    }
  });
});
