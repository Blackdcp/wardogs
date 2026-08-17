import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

describe("AdsterraNativeBanner", () => {
  it("renders the required container and configures the supplied native-banner script", async () => {
    const adModule = await import("../../src/components/ads/adsterra-native-banner").catch(() => null);

    expect(adModule).not.toBeNull();
    if (!adModule) return;

    const attributes = new Map<string, string>();
    const script = {
      async: false,
      src: "",
      setAttribute(name: string, value: string) {
        attributes.set(name, value);
      }
    } as unknown as HTMLScriptElement;

    adModule.configureAdsterraScript(script);

    expect(script.async).toBe(true);
    expect(script.src).toBe(
      "https://pl30888081.effectivecpmnetwork.com/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js"
    );
    expect(attributes.get("data-cfasync")).toBe("false");

    const html = renderToStaticMarkup(
      React.createElement(adModule.AdsterraNativeBanner, {label: "Advertisement"})
    );

    expect(html).toContain("Advertisement");
    expect(html).toContain('id="container-481d6501bcd0c27b98bc3c4776a26f6e"');
  });
});
