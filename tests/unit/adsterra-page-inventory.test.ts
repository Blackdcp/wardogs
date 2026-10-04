import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";
import {isLocalizedHomepage} from "../../src/components/ads/global-top-ad";

const pageFiles = [
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/guides/page.tsx",
  "src/app/[locale]/items/page.tsx",
  "src/app/[locale]/items/[type]/page.tsx",
  "src/app/[locale]/videos/page.tsx"
] as const;

describe("Adsterra page inventory", () => {
  it("monetizes the homepage and every primary index page", async () => {
    for (const file of pageFiles) {
      const source = await readFile(file, "utf8");
      expect(source, file).toContain("AdsterraDisplayBanner");
      expect(source, file).toContain("AdsterraNativeBanner");
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

  it("loads behavioral, sticky, rail, top, and bottom inventory from every localized layout", async () => {
    const source = await readFile("src/app/[locale]/layout.tsx", "utf8");
    expect(source).toContain("AdsterraBehavioralAds");
    expect(source).toContain("AdsterraGlobalInventory");
    expect(source).toContain("GlobalTopAd");
    expect(source).toContain('data-global-ad-position="bottom"');
  });
});



  it("identifies locale home paths so the top banner stays off the homepage", () => {
    expect(isLocalizedHomepage("/en")).toBe(true);
    expect(isLocalizedHomepage("/en/")).toBe(true);
    expect(isLocalizedHomepage("/zh-cn")).toBe(true);
    expect(isLocalizedHomepage("/")).toBe(true);
    expect(isLocalizedHomepage("/en/guides")).toBe(false);
    expect(isLocalizedHomepage("/tools/map")).toBe(false);
  });

  it("keeps the global top banner off localized homepages", async () => {
    const source = await readFile("src/components/ads/global-top-ad.tsx", "utf8");
    expect(source).toContain('data-global-ad-position="top"');
    expect(source).toContain("isLocalizedHomepage");
    expect(source).toContain("return null");
  });
