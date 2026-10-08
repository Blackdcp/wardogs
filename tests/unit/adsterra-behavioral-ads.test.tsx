import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";

vi.mock("next/navigation", () => ({usePathname: () => "/en/guides/wardogs-gameplay"}));

describe("Adsterra behavioral ads", () => {
  afterEach(() => {vi.unstubAllEnvs(); vi.resetModules();});

  it.each([undefined, "false", "1", "true"])("blocks unverified formats regardless of the legacy environment flag: %s", async (value) => {
    vi.stubEnv("NEXT_PUBLIC_WARDOGS_ENABLE_POPUNDER", value);
    vi.resetModules();
    const ads = await import("../../src/features/ads/ad-policy");
    expect(ads.ADSTERRA_ENABLED).toBe(true);
    expect(ads.BEHAVIORAL_POPUNDER_ENABLED && ads.ADSTERRA_POPUNDER_VERIFIED).toBe(false);
    expect(ads.ADSTERRA_SOCIAL_BAR_ENABLED && ads.ADSTERRA_SOCIAL_BAR_VERIFIED).toBe(false);
  });

  it.each(["en", "de", "pt-br", "ru", "ja", "zh-cn", "zh-tw", "pl"])("only permits content details in %s", async (locale) => {
    const {isBehavioralAdPath} = await import("../../src/features/ads/ad-policy");
    for (const path of ["guides/wardogs-gameplay", "videos/wardogs-first-look", "items/weapons/amp-9"]) {
      expect(isBehavioralAdPath(`/${locale}/${path}`)).toBe(true);
      expect(isBehavioralAdPath(`/${locale}/${path}/`)).toBe(true);
    }
    for (const path of ["", "/guides", "/videos", "/items", "/items/weapons", "/tools/map", "/tools/mortar-calculator", "/privacy", "/ads"]) {
      expect(isBehavioralAdPath(`/${locale}${path}`)).toBe(false);
    }
    expect(isBehavioralAdPath("/fr/guides/wardogs-gameplay")).toBe(false);
    expect(isBehavioralAdPath("/guides/wardogs-gameplay")).toBe(false);
  });

  it("enforces a 24-hour script-load lease and blocks malformed timestamps", async () => {
    const {POPUNDER_COOLDOWN_MS, canLoadPopunder} = await import("../../src/features/ads/ad-policy");
    const now = Date.UTC(2026, 9, 8, 12);
    expect(POPUNDER_COOLDOWN_MS).toBe(24 * 60 * 60 * 1000);
    expect(canLoadPopunder(null, now)).toBe(true);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS + 1), now)).toBe(false);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS), now)).toBe(true);
    for (const value of ["not-a-timestamp", "", "NaN", "0", "-1", "1.5", String(now + 1), "9007199254740992"]) {
      expect(canLoadPopunder(value, now)).toBe(false);
    }
  });

  it("preserves existing zones with the current dashboard script URLs", async () => {
    const ads = await import("../../src/features/ads/ad-policy");
    expect(ads.ADSTERRA_SOCIAL_BAR_SCRIPT_SRC).toBe("https://bauval.org/14/ff48ce7ab0b6833443b9f5bb64ec5e3c");
    expect(ads.ADSTERRA_POPUNDER_SCRIPT_SRC).toBe("https://abscloud.org/1/9ccb058d9d56da7b7f2e39d95a819b02");
    expect(ads.ADSTERRA_SMARTLINK_URLS[0]).toEqual({id: "smartlink-1", url: "https://araplhn.org/4/88f0d659df423718bd107ca16b5284cd"});
    expect(ads.getSocialBarScriptForPath("/en/guides/wardogs-gameplay")).toBeNull();
    expect(ads.getSocialBarScriptForPath("/ja/items/vehicles/stingray")).toBeNull();
  });

  it("renders only a blocked SSR marker, never a behavioral script", async () => {
    const {AdsterraBehavioralAds} = await import("../../src/components/ads/adsterra-behavioral-ads");
    const html = renderToStaticMarkup(React.createElement(AdsterraBehavioralAds));
    expect(html).toContain('data-behavioral-ad-state="blocked"');
    expect(html).not.toContain("<script");
  });

  it("renders one explicit sponsored link that opens in a separate tab", async () => {
    const {AdsterraSmartlink} = await import("../../src/components/ads/adsterra-smartlink");
    const html = renderToStaticMarkup(React.createElement(AdsterraSmartlink));
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="nofollow noopener noreferrer sponsored"');
    expect(html).toContain("https://araplhn.org/4/88f0d659df423718bd107ca16b5284cd");
  });
});
