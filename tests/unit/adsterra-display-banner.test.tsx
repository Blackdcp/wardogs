import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

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

  it("renders inline ads and restores dismissible mobile and desktop inventory", async () => {
    const {AdsterraDisplayBanner, AdsterraGlobalInventory} = await import("../../src/components/ads/adsterra-display-banner");
    const inline = renderToStaticMarkup(React.createElement(AdsterraDisplayBanner, {placement: "rectangle"}));
    const global = renderToStaticMarkup(React.createElement(AdsterraGlobalInventory));

    expect(inline).toContain('data-ad-placement="rectangle"');
    expect(inline).toContain('data-ad-unit="3342dc928824e6ed5c01555e7f9e9e0f"');
    expect(inline).not.toContain("<iframe");
    expect(global).toContain('data-ad-placement="left-rail"');
    expect(global).toContain("mobile-sticky");
    expect(global).toContain("right-rail");
  });

  it("creates valid configuration options and code for ad units", async () => {
    const {
      buildAdsterraBannerOptions,
      buildAdsterraBannerConfigCode,
      ADSTERRA_BANNER_UNITS
    } = await import("../../src/features/ads/adsterra-banner");

    const options = buildAdsterraBannerOptions(ADSTERRA_BANNER_UNITS.rectangle300);
    expect(options).toEqual({
      key: "3342dc928824e6ed5c01555e7f9e9e0f",
      format: "iframe",
      height: 250,
      width: 300,
      params: {}
    });

    const code = buildAdsterraBannerConfigCode(ADSTERRA_BANNER_UNITS.rectangle300);
    expect(code).toContain('atOptions = {"key":"3342dc928824e6ed5c01555e7f9e9e0f"');
    expect(code).toContain('"format":"iframe"');
  });
});
