import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";
import {isLocalizedHomepage} from "../../src/components/ads/global-top-ad";
import {ADSTERRA_BANNER_UNITS} from "../../src/features/ads/adsterra-banner";
import {ADSTERRA_NATIVE_ZONE_ID} from "../../src/features/ads/adsterra-native";
import {
  ADSTERRA_MOBILE_STICKY_ENABLED,
  ADSTERRA_NATIVE_ENABLED,
  ADSTERRA_SMARTLINK_ENABLED,
  ADSTERRA_SOCIAL_BAR_ENABLED,
  ADSTERRA_SOCIAL_BAR_VERIFIED,
  ADSTERRA_POPUNDER_VERIFIED,
  getSocialBarScriptForPath,
  BEHAVIORAL_POPUNDER_ENABLED
} from "../../src/features/ads/ad-policy";
import {
  AD_INVENTORY_CONTRACT,
  DISABLED_AD_FORMATS,
  INVENTORY_PAGE_TEMPLATES,
  INVENTORY_VIEWPORTS
} from "../fixtures/ad-inventory-contract";

const pageFiles = [
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/guides/page.tsx",
  "src/app/[locale]/items/page.tsx",
  "src/app/[locale]/items/[type]/page.tsx",
  "src/app/[locale]/videos/page.tsx",
  "src/app/[locale]/maps/page.tsx",
  "src/app/[locale]/tools/map/page.tsx",
  "src/app/[locale]/tools/artillery-calculator/page.tsx",
  "src/app/[locale]/guides/[slug]/page.tsx",
  "src/app/[locale]/videos/[slug]/page.tsx",
  "src/app/[locale]/items/[type]/[slug]/page.tsx"
] as const;

describe("Adsterra page inventory", () => {
  it("freezes the page-template and viewport inventory multiset", () => {
    const tuples = AD_INVENTORY_CONTRACT.map((slot) => [
      slot.pageTemplate,
      slot.viewport,
      slot.placement,
      slot.format,
      slot.zone,
      slot.count
    ].join("|"));

    expect(new Set(tuples).size).toBe(tuples.length);
    expect(new Set(AD_INVENTORY_CONTRACT.map(({pageTemplate}) => pageTemplate))).toEqual(new Set(INVENTORY_PAGE_TEMPLATES));
    expect(new Set(AD_INVENTORY_CONTRACT.map(({viewport}) => viewport))).toEqual(new Set(INVENTORY_VIEWPORTS));
    expect(AD_INVENTORY_CONTRACT.every(({count}) => count === 1)).toBe(true);
    expect(DISABLED_AD_FORMATS).toEqual(["popunder", "social-bar"]);
    expect(new Set(AD_INVENTORY_CONTRACT.map(({zone}) => zone))).toEqual(new Set([
      ADSTERRA_NATIVE_ZONE_ID,
      ...Object.values(ADSTERRA_BANNER_UNITS).map(({key}) => key)
    ]));
    expect(ADSTERRA_NATIVE_ENABLED).toBe(true);
    expect(ADSTERRA_MOBILE_STICKY_ENABLED).toBe(true);
    expect(ADSTERRA_SMARTLINK_ENABLED).toBe(true);
    expect(ADSTERRA_SOCIAL_BAR_ENABLED && ADSTERRA_SOCIAL_BAR_VERIFIED).toBe(false);
    expect(ADSTERRA_SOCIAL_BAR_VERIFIED).toBe(false);
    expect(getSocialBarScriptForPath("/en/guides/wardogs-artillery-guide")).toBeNull();
    expect(BEHAVIORAL_POPUNDER_ENABLED && ADSTERRA_POPUNDER_VERIFIED).toBe(false);
    expect(ADSTERRA_POPUNDER_VERIFIED).toBe(false);
  });

  it("keeps one rectangle and one native slot on every monetized template", () => {
    for (const pageTemplate of INVENTORY_PAGE_TEMPLATES) {
      for (const viewport of INVENTORY_VIEWPORTS) {
        const slots = AD_INVENTORY_CONTRACT.filter((slot) =>
          slot.pageTemplate === pageTemplate && slot.viewport === viewport
        );
        expect(slots.filter(({placement, format}) => placement === "inline-primary" && format === "display"), `${pageTemplate}/${viewport}/rectangle`).toHaveLength(1);
        expect(slots.filter(({placement, format}) => placement === "inline-primary" && format === "native"), `${pageTemplate}/${viewport}/native`).toHaveLength(1);
      }
    }
  });

  it("preserves mobile sticky, desktop top, and wide rail inventory without adding a home top banner", () => {
    const slots = (pageTemplate: string, viewport: string) => AD_INVENTORY_CONTRACT.filter((slot) =>
      slot.pageTemplate === pageTemplate && slot.viewport === viewport
    );

    for (const pageTemplate of INVENTORY_PAGE_TEMPLATES) {
      expect(slots(pageTemplate, "mobile").filter(({placement}) => placement === "mobile-sticky")).toHaveLength(1);
      expect(slots(pageTemplate, "wide").filter(({placement}) => placement === "left-rail")).toHaveLength(1);
      expect(slots(pageTemplate, "wide").filter(({placement}) => placement === "right-rail")).toHaveLength(1);
    }
    expect(slots("home", "desktop").some(({placement}) => placement === "global-top")).toBe(false);
    expect(slots("home", "wide").some(({placement}) => placement === "global-top")).toBe(false);
    expect(slots("guide-detail", "desktop").filter(({placement}) => placement === "global-top")).toHaveLength(1);
    expect(AD_INVENTORY_CONTRACT.filter(({pageTemplate, placement}) =>
      pageTemplate === "home" && placement === "inline-primary"
    ).every(({section, format}) => section === (format === "native" ? "proven-demand" : "database"))).toBe(true);
  });

  it("never reuses a display code in a page/viewport, and never adds a mobile rectangle", () => {
    for (const pageTemplate of INVENTORY_PAGE_TEMPLATES) for (const viewport of INVENTORY_VIEWPORTS) {
      const slots = AD_INVENTORY_CONTRACT.filter((slot) => slot.pageTemplate === pageTemplate && slot.viewport === viewport && slot.format === "display");
      expect(new Set(slots.map(({zone}) => zone)).size, `${pageTemplate}/${viewport}`).toBe(slots.length);
      if (viewport === "mobile" || viewport === "tablet") expect(slots.some(({placement}) => placement === "inline-supplemental" || placement === "tool-rail")).toBe(false);
    }
  });

  it("monetizes the homepage and every primary index page", async () => {
    for (const file of pageFiles) {
      const source = await readFile(file, "utf8");
      expect(source, file).toContain("AdsterraDisplayBanner");
      expect(source, file).toContain("AdsterraNativeBanner");
      expect(source.match(/<AdsterraSmartlink\b/g), file).toHaveLength(1);
      expect(source, file).toContain("<AdsterraSupplementalBanner");
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
