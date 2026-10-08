import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {
  ADSTERRA_ENABLED,
  ADSTERRA_NATIVE_ENABLED,
  ADSTERRA_MOBILE_STICKY_ENABLED,
  BEHAVIORAL_POPUNDER_ENABLED,
  ADSTERRA_POPUNDER_VERIFIED,
  ADSTERRA_SOCIAL_BAR_ENABLED,
  ADSTERRA_SOCIAL_BAR_VERIFIED
} from "../../src/features/ads/ad-policy";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraDisplayBanner, AdsterraGlobalInventory} from "../../src/components/ads/adsterra-display-banner";
import {AdsterraSmartlink} from "../../src/components/ads/adsterra-smartlink";
import {ADSTERRA_NATIVE_CONTAINER_ID} from "../../src/features/ads/adsterra-native";

vi.mock("next/navigation", () => ({usePathname: () => "/en/guides/wardogs-gameplay"}));

describe("Adsterra standard native and display policy", () => {
  it("retains native and display monetization while requiring supplier verification for behavioral formats", () => {
    expect(ADSTERRA_ENABLED).toBe(true);
    expect(ADSTERRA_NATIVE_ENABLED).toBe(true);
    expect(ADSTERRA_MOBILE_STICKY_ENABLED).toBe(true);
    expect(BEHAVIORAL_POPUNDER_ENABLED && ADSTERRA_POPUNDER_VERIFIED).toBe(false);
    expect(ADSTERRA_SOCIAL_BAR_ENABLED && ADSTERRA_SOCIAL_BAR_VERIFIED).toBe(false);
  });

  it("emits standard container inventory without nested custom iframe wrappers", () => {
    const html = renderToStaticMarkup(
      <>
        <AdsterraNativeBanner label="Advertisement" />
        <AdsterraDisplayBanner placement="horizontal" />
        <AdsterraDisplayBanner placement="rectangle" />
        <AdsterraGlobalInventory />
        <AdsterraSmartlink />
      </>
    );
    expect(html).toContain(`id="${ADSTERRA_NATIVE_CONTAINER_ID}"`);
    expect(html).toContain('data-ad-slot="adsterra-native"');
    expect(html).not.toContain("<iframe");
    expect(html).toContain("mobile-sticky");
    expect(html).toContain("Sponsored link");
    expect(html.match(/data-ad-unit="smartlink-1"/g)).toHaveLength(1);
    expect(html).not.toContain('data-ad-unit="smartlink-2"');
  });
});
