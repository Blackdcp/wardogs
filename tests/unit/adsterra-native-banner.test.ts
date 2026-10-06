import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SCRIPT_SRC,
  ADSTERRA_NATIVE_ZONE_ID,
  configureAdsterraNativeScript
} from "../../src/features/ads/adsterra-native";

describe("Adsterra native banner", () => {
  it("uses the current approved native code configuration", () => {
    expect(ADSTERRA_NATIVE_ZONE_ID).toBe("481d6501bcd0c27b98bc3c4776a26f6e");
    expect(ADSTERRA_NATIVE_CONTAINER_ID).toBe(`container-${ADSTERRA_NATIVE_ZONE_ID}`);
    expect(ADSTERRA_NATIVE_SCRIPT_SRC).toBe(`https://bauval.org/21/${ADSTERRA_NATIVE_ZONE_ID}`);
    const script = {async: false, dataset: {} as Record<string, string>, src: ""} as HTMLScriptElement;
    configureAdsterraNativeScript(script);
    expect(script.async).toBe(true);
    expect(script.dataset.cfasync).toBe("false");
    expect(script.src).toBe(ADSTERRA_NATIVE_SCRIPT_SRC);
  });

  it("renders the approved native container element directly without custom iframes", () => {
    const html = renderToStaticMarkup(React.createElement(AdsterraNativeBanner, {label: "Advertisement"}));
    expect(html).toContain(`id="${ADSTERRA_NATIVE_CONTAINER_ID}"`);
    expect(html).toContain('data-ad-slot="adsterra-native"');
    expect(html).not.toContain("<iframe");
  });
});
