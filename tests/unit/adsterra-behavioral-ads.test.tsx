import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

describe("Adsterra behavioral ads", () => {
  it("runs behavioral ads across every localized public page", async () => {
    const {isBehavioralAdPath} = await import("../../src/features/ads/ad-policy");

    expect(isBehavioralAdPath("/en/guides/wardogs-gameplay")).toBe(true);
    expect(isBehavioralAdPath("/de/videos/wardogs-first-look")).toBe(true);
    expect(isBehavioralAdPath("/pt-br/items/weapons/amp-9")).toBe(true);
    expect(isBehavioralAdPath("/en")).toBe(true);
    expect(isBehavioralAdPath("/en/guides")).toBe(true);
    expect(isBehavioralAdPath("/ja/videos")).toBe(true);
    expect(isBehavioralAdPath("/zh-cn/privacy")).toBe(true);
    expect(isBehavioralAdPath("/privacy")).toBe(false);
  });

  it("enforces a six-hour popunder cooldown", async () => {
    const {POPUNDER_COOLDOWN_MS, canLoadPopunder} = await import("../../src/features/ads/ad-policy");
    const now = Date.UTC(2026, 8, 24, 12);

    expect(POPUNDER_COOLDOWN_MS).toBe(6 * 60 * 60 * 1000);
    expect(canLoadPopunder(null, now)).toBe(true);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS + 1), now)).toBe(false);
    expect(canLoadPopunder(String(now - POPUNDER_COOLDOWN_MS), now)).toBe(true);
    expect(canLoadPopunder("not-a-timestamp", now)).toBe(true);
  });

  it("exposes the supplied social-bar, popunder, and both current smartlinks", async () => {
    const ads = await import("../../src/features/ads/ad-policy");

    expect(ads.ADSTERRA_SOCIAL_BAR_SCRIPT_SRC).toBe(
      "https://arkgleamfox.com/ff/48/ce/ff48ce7ab0b6833443b9f5bb64ec5e3c.js"
    );
    expect(ads.ADSTERRA_POPUNDER_SCRIPT_SRC).toBe(
      "https://arkgleamfox.com/9c/cb/05/9ccb058d9d56da7b7f2e39d95a819b02.js"
    );
    expect(ads.ADSTERRA_SMARTLINK_URLS).toEqual([
      {id: "smartlink-2", url: "https://arkgleamfox.com/jvxhi4z3ts?key=678e9aeab41077b9e6a3e5626292c434"},
      {id: "smartlink-1", url: "https://arkgleamfox.com/j7way0p0?key=a9590c5cd64a0d11f4aa2ecf617130bc"}
    ]);
  });

  it("renders both smartlinks as clearly labeled sponsored links", async () => {
    const {AdsterraSmartlink} = await import("../../src/components/ads/adsterra-smartlink");
    const html = renderToStaticMarkup(React.createElement(AdsterraSmartlink));

    expect(html).toContain("Sponsored");
    expect(html).toContain("https://arkgleamfox.com/jvxhi4z3ts?key=678e9aeab41077b9e6a3e5626292c434");
    expect(html).toContain("https://arkgleamfox.com/j7way0p0?key=a9590c5cd64a0d11f4aa2ecf617130bc");
    expect(html.match(/rel="nofollow noopener noreferrer sponsored"/g)).toHaveLength(2);
    expect(html.match(/target="_blank"/g)).toHaveLength(2);
  });
});
