import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {ADSTERRA_BANNER_SANDBOX, ADSTERRA_FRAME_VERSION} from "../../src/features/ads/adsterra-banner";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SCRIPT_SRC,
  ADSTERRA_NATIVE_ZONE_ID,
  ADSTERRA_NATIVE_SIZE_MESSAGE,
  buildAdsterraNativeDocument,
  getAdsterraNativeFrameHeight
} from "../../src/features/ads/adsterra-native";

describe("Adsterra native banner", () => {
  it("uses the current approved native code inside its isolated document", () => {
    expect(ADSTERRA_NATIVE_ZONE_ID).toBe("481d6501bcd0c27b98bc3c4776a26f6e");
    expect(ADSTERRA_NATIVE_CONTAINER_ID).toBe(`container-${ADSTERRA_NATIVE_ZONE_ID}`);
    expect(ADSTERRA_NATIVE_SCRIPT_SRC).toBe(`https://arkgleamfox.com/${ADSTERRA_NATIVE_ZONE_ID}/invoke.js`);
    const html = buildAdsterraNativeDocument();
    expect(html).toContain(`id="${ADSTERRA_NATIVE_CONTAINER_ID}"`);
    expect(html).toContain(`async="async" data-cfasync="false" src="${ADSTERRA_NATIVE_SCRIPT_SRC}"`);
    expect(html).toContain("ResizeObserver");
    expect(html).toContain("navigator.userActivation?.isActive");
    expect(html).not.toMatch(/(?:top|parent)\.location/);
  });

  it("does not load the ad script in the main document", () => {
    const html = renderToStaticMarkup(React.createElement(AdsterraNativeBanner, {label: "Advertisement"}));
    expect(html).toContain(`src="https://wardogswiki.com/api/ad-frame/${ADSTERRA_NATIVE_ZONE_ID}?v=${ADSTERRA_FRAME_VERSION}"`);
    expect(html).toContain(`sandbox="${ADSTERRA_BANNER_SANDBOX}"`);
    expect(html).not.toContain("<script");
  });

  it("accepts layout only from the actual isolated frame and bounds its size", () => {
    const frame = {} as Window;
    const data = {type: ADSTERRA_NATIVE_SIZE_MESSAGE, zone: ADSTERRA_NATIVE_ZONE_ID, filled: true, height: 247.3};
    const event = {origin: "https://wardogswiki.com", source: frame, data};
    expect(getAdsterraNativeFrameHeight(event, event.origin, frame)).toBe(248);
    expect(getAdsterraNativeFrameHeight({...event, origin: "https://example.com"}, event.origin, frame)).toBeNull();
    expect(getAdsterraNativeFrameHeight({...event, source: {} as Window}, event.origin, frame)).toBeNull();
    expect(getAdsterraNativeFrameHeight(event, event.origin, null)).toBeNull();
    for (const invalid of [null, {type: "navigate", url: "sms:123"}, {...data, zone: "arbitrary"}, {...data, filled: false}, {...data, height: Infinity}, {...data, height: -1}]) {
      expect(getAdsterraNativeFrameHeight({...event, data: invalid}, event.origin, frame)).toBeNull();
    }
    expect(getAdsterraNativeFrameHeight({...event, data: {...data, height: 1}}, event.origin, frame)).toBe(90);
    expect(getAdsterraNativeFrameHeight({...event, data: {...data, height: 1249}}, event.origin, frame)).toBe(1249);
    expect(getAdsterraNativeFrameHeight({...event, data: {...data, height: 999999}}, event.origin, frame)).toBe(1800);
  });
});
