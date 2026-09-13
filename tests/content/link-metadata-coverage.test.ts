import {readdirSync, readFileSync} from "node:fs";
import {join, relative} from "node:path";
import {describe, expect, it} from "vitest";

const sourceRoot = join(process.cwd(), "src");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(pathname);
    return /\.(?:jsx|tsx)$/.test(entry.name) ? [pathname] : [];
  });
}

describe("link metadata coverage", () => {
  it("gives every directly rendered anchor a descriptive title", () => {
    const missing = sourceFiles(sourceRoot).flatMap((pathname) => {
      const source = readFileSync(pathname, "utf8");
      return [...source.matchAll(/<(?:a|Link)\b[\s\S]*?>/g)]
        .filter(([tag]) => !/\btitle\s*=/.test(tag) && !/<a\s+\{\.\.\.props\}>/.test(tag))
        .map((match) => `${relative(process.cwd(), pathname)}:${source.slice(0, match.index).split("\n").length}`);
    });

    expect(missing).toEqual([]);
  });

  it("routes all guide-body links through the metadata-aware MDX anchor", () => {
    const source = readFileSync(join(sourceRoot, "components", "mdx", "mdx-components.tsx"), "utf8");
    expect(source).toContain("a: MdxLink");
  });
});
