import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ADSTERRA_ENABLED, BEHAVIORAL_POPUNDER_ENABLED} from "../../src/features/ads/ad-policy";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraDisplayBanner, AdsterraGlobalInventory} from "../../src/components/ads/adsterra-display-banner";
import {AdsterraSmartlink} from "../../src/components/ads/adsterra-smartlink";

describe("Adsterra safety shutdown", () => {
  it("keeps the global switch and popunders disabled", () => {
    expect(ADSTERRA_ENABLED).toBe(false);
    expect(BEHAVIORAL_POPUNDER_ENABLED).toBe(false);
  });

  it("emits no native, display, mobile, rail or Smartlink inventory", () => {
    const html = renderToStaticMarkup(<>
      <AdsterraNativeBanner label="Advertisement" />
      <AdsterraDisplayBanner placement="horizontal" />
      <AdsterraDisplayBanner placement="rectangle" />
      <AdsterraGlobalInventory />
      <AdsterraSmartlink />
    </>);
    expect(html).toBe("");
  });
});
