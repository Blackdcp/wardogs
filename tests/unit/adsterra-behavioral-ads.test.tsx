import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

describe("Adsterra behavioral ads", () => {
  it("limits behavioral ads to guide, video, and item detail pages", async () => {
    const {isBehavioralAdPath} = await import("../../src/features/ads/ad-policy");

    expect(isBehavioralAdPath("/en/guides/wardogs-gameplay")).toBe(true);
    expect(isBehavioralAdPath("/de/videos/wardogs-first-look")).toBe(true);
    expect(isBehavioralAdPath("/pt-br/items/weapons/amp-9")).toBe(true);
    expect(isBehavioralAdPath("/en")).toBe(false);
    expect(isBehavioralAdPath("/en/guides")).toBe(false);
    expect(isBehavioralAdPath("/en/items/weapons")).toBe(false);
    expect(isBehavioralAdPath("/en/privacy")).toBe(false);
  });

  it("enforces a 24-hour popunder cooldown", async () => {
    const {POPUNDER_COOLDOWN_MS, canLoadPopunder} = await import("../../src/features/ads/ad-policy");
    const now = Date.UTC(2026, 7, 18, 12);

    expect(POPUNDER_COOLDOWN_MS).toBe(24 * 60 * 60 * 1000);
    expect(canLoadPopunder(null, now)).toBe(true);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS + 1), now)).toBe(false);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS), now)).toBe(true);
    expect(canLoadPopunder("not-a-timestamp", now)).toBe(true);
  });

  it("exposes the supplied social-bar and popunder scripts", async () => {
    const ads = await import("../../src/features/ads/ad-policy");

    expect(ads.ADSTERRA_SOCIAL_BAR_SCRIPT_SRC).toBe(
      "https://arkgleamfox.com/ff/48/ce/ff48ce7ab0b6833443b9f5bb64ec5e3c.js"
    );
    expect(ads.ADSTERRA_POPUNDER_SCRIPT_SRC).toBe(
      "https://arkgleamfox.com/9c/cb/05/9ccb058d9d56da7b7f2e39d95a819b02.js"
    );
  });

  it("renders the smartlink as a clearly labeled sponsored link", async () => {
    const {AdsterraSmartlink} = await import("../../src/components/ads/adsterra-smartlink");
    const html = renderToStaticMarkup(React.createElement(AdsterraSmartlink));

    expect(html).toContain("Sponsored");
    expect(html).toContain("https://arkgleamfox.com/sfg4tmdn?key=88f0d659df423718bd107ca16b5284cd");
    expect(html).toContain('rel="nofollow noopener noreferrer sponsored"');
    expect(html).toContain('target="_blank"');
  });
});
