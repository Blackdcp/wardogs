import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED, ADSTERRA_MOBILE_STICKY_ENABLED, BEHAVIORAL_POPUNDER_ENABLED} from "../../src/features/ads/ad-policy";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraDisplayBanner, AdsterraGlobalInventory} from "../../src/components/ads/adsterra-display-banner";
import {AdsterraSmartlink} from "../../src/components/ads/adsterra-smartlink";

describe("Adsterra isolated display policy", () => {
  it("retains display monetization while disabling redirect-risk formats", () => {
    expect(ADSTERRA_ENABLED).toBe(true);
    expect(ADSTERRA_NATIVE_ENABLED).toBe(false);
    expect(ADSTERRA_MOBILE_STICKY_ENABLED).toBe(false);
    expect(BEHAVIORAL_POPUNDER_ENABLED).toBe(false);
  });

  it("emits only sandboxed display inventory without top-document ad scripts", () => {
    const html = renderToStaticMarkup(<>
      <AdsterraNativeBanner label="Advertisement" />
      <AdsterraDisplayBanner placement="horizontal" />
      <AdsterraDisplayBanner placement="rectangle" />
      <AdsterraGlobalInventory />
      <AdsterraSmartlink />
    </>);
    expect(html).toContain('sandbox="allow-scripts allow-same-origin"');
    expect(html).toContain('src="https://wardogswiki.com/api/ad-frame/');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("adsterra-native");
    expect(html).not.toContain("mobile-sticky");
    expect(html).not.toContain("Sponsored links");
    expect(html).not.toMatch(/allow-(?:popups|top-navigation|forms|downloads)/);
  });
});
