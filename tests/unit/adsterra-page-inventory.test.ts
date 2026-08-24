import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

const pageFiles = [
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/guides/page.tsx",
  "src/app/[locale]/items/page.tsx",
  "src/app/[locale]/videos/page.tsx"
] as const;

describe("Adsterra page inventory", () => {
  it("monetizes the homepage and every primary index page", async () => {
    for (const file of pageFiles) {
      const source = await readFile(file, "utf8");
      expect(source, file).toContain("AdsterraDisplayBanner");
      expect(source, file).toContain("AdsterraNativeBanner");
      expect(source, file).toContain("AdsterraSmartlink");
    }
  });

  it("adds a rectangle unit to every monetized detail template", async () => {
    for (const file of [
      "src/app/[locale]/guides/[slug]/page.tsx",
      "src/app/[locale]/videos/[slug]/page.tsx",
      "src/app/[locale]/items/[type]/[slug]/page.tsx"
    ]) {
      const source = await readFile(file, "utf8");
      expect(source, file).toContain('<AdsterraDisplayBanner placement="rectangle"');
    }
  });
});
