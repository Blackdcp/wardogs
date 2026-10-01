import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ADSTERRA_BANNER_SANDBOX, buildAdsterraClickGuard} from "../../src/features/ads/adsterra-banner";

describe("Adsterra display banner inventory", () => {
  it("registers every supplied banner zone", async () => {
    const ads = await import("../../src/components/ads/adsterra-display-banner");

    expect(ads.ADSTERRA_BANNER_UNITS).toEqual({
      horizontal468: expect.objectContaining({key: "c6d1a3e01dc90e01385598a3c84dcaea", width: 468, height: 60}),
      rectangle300: expect.objectContaining({key: "3342dc928824e6ed5c01555e7f9e9e0f", width: 300, height: 250}),
      rail300: expect.objectContaining({key: "f6fc5667adc4cb97634312e962c199c5", width: 160, height: 300}),
      rail600: expect.objectContaining({key: "b2a91c3759bccd2386763c1c71b7d7ad", width: 160, height: 600}),
      mobile320: expect.objectContaining({key: "174695845dde18793bf09d3361f8af30", width: 320, height: 50}),
      leaderboard728: expect.objectContaining({key: "035c3a3eb2cdc2bcb65b641e981d4874", width: 728, height: 90})
    });
  });

  it("selects the restored horizontal inventory by viewport", async () => {
    const {ADSTERRA_BANNER_UNITS, selectHorizontalBannerUnit} = await import("../../src/components/ads/adsterra-display-banner");

    expect(selectHorizontalBannerUnit(467)).toBeNull();
    expect(selectHorizontalBannerUnit(468)).toBe(ADSTERRA_BANNER_UNITS.horizontal468);
    expect(selectHorizontalBannerUnit(727)).toBe(ADSTERRA_BANNER_UNITS.horizontal468);
    expect(selectHorizontalBannerUnit(728)).toBe(ADSTERRA_BANNER_UNITS.leaderboard728);
    expect(selectHorizontalBannerUnit(1600)).toBe(ADSTERRA_BANNER_UNITS.leaderboard728);
  });

  it("isolates inline ads and restores dismissible mobile and desktop inventory", async () => {
    const {AdsterraDisplayBanner, AdsterraGlobalInventory} = await import("../../src/components/ads/adsterra-display-banner");
    const inline = renderToStaticMarkup(React.createElement(AdsterraDisplayBanner, {placement: "rectangle"}));
    const global = renderToStaticMarkup(React.createElement(AdsterraGlobalInventory));

    expect(inline).toContain(`sandbox="${ADSTERRA_BANNER_SANDBOX}"`);
    expect(inline).toContain('src="https://wardogswiki.com/api/ad-frame/');
    expect(inline).not.toContain("<script");
    expect(inline).not.toMatch(/allow-(?:top-navigation|forms|downloads)/);
    expect(global).toContain('data-ad-placement="left-rail"');
    expect(global).toContain("mobile-sticky");
    expect(global).toContain("right-rail");
  });

  it("escapes script and attribute boundaries in the iframe document", async () => {
    const {buildAdsterraBannerDocument} = await import("../../src/components/ads/adsterra-display-banner");
    const document = buildAdsterraBannerDocument({key: "</script>", src: 'https://example.com/"<script>', width: 300, height: 250});
    expect(document).toContain('"key":"\\u003c/script>"');
    expect(document).toContain("&quot;&lt;script&gt;");
    expect(document).not.toContain('src="https://example.com/"<script>');
  });

  it("allows advertiser tabs but gates direct scripted opens and non-web links", () => {
    expect(ADSTERRA_BANNER_SANDBOX.split(" ")).toContain("allow-popups");
    expect(ADSTERRA_BANNER_SANDBOX.split(" ")).toContain("allow-popups-to-escape-sandbox");
    const guard = buildAdsterraClickGuard();
    expect(guard).toContain("navigator.userActivation?.isActive");
    expect(guard).toContain('"http:", "https:"');
    expect(guard).toContain("!event.isTrusted");
  });
});
