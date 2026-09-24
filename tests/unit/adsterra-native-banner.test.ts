import {describe, expect, it, vi} from "vitest";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SCRIPT_SRC,
  ADSTERRA_NATIVE_ZONE_ID,
  configureAdsterraScript
} from "../../src/components/ads/adsterra-native-banner";

describe("Adsterra native banner", () => {
  it("configures the approved native banner script", () => {
    const attributes = new Map<string, string>();
    const script = {
      async: false,
      src: "",
      setAttribute: vi.fn((name: string, value: string) => attributes.set(name, value))
    } as unknown as HTMLScriptElement;

    configureAdsterraScript(script);

    expect(ADSTERRA_NATIVE_ZONE_ID).toBe("481d6501bcd0c27b98bc3c4776a26f6e");
    expect(ADSTERRA_NATIVE_CONTAINER_ID).toBe(`container-${ADSTERRA_NATIVE_ZONE_ID}`);
    expect(script.async).toBe(true);
    expect(attributes.get("data-cfasync")).toBe("false");
    expect(script.src).toBe(ADSTERRA_NATIVE_SCRIPT_SRC);
    expect(ADSTERRA_NATIVE_SCRIPT_SRC).toBe(
      "https://pl30888081.effectivecpmnetwork.com/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js"
    );
  });
});
