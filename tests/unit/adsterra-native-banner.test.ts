import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

type ContentNode = {
  childNodes?: Iterable<ContentNode>;
  getAttribute?: (name: string) => string | null;
  nodeType: number;
  tagName?: string;
  textContent?: string | null;
};

const text = (textContent: string): ContentNode => ({nodeType: 3, textContent});
const comment = (textContent: string): ContentNode => ({nodeType: 8, textContent});
const element = (
  tagName: string,
  attributes: Record<string, string> = {},
  childNodes: ContentNode[] = []
): ContentNode => ({
  childNodes,
  getAttribute: (name) => attributes[name] ?? null,
  nodeType: 1,
  tagName
});

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
    expect(html).toContain('data-state="loading"');
    expect(html).toContain('data-ad-shell="native-content"');
    expect(html).toContain("aspect-[4/1]");
    expect(html).toContain("WARDOGS Wiki recommendation");
    expect(html).toContain("Explore the WARDOGS Catalogue");
    expect(html).toContain(
      "Compare weapons, vehicles, ammo, attachments, gear, and loadout planning."
    );
    expect(html).toContain('href="/en/items"');
    expect(html).not.toContain('href="/items"');
  });

  it("recognizes only meaningful native creative content", async () => {
    const adModule = await import("../../src/components/ads/adsterra-native-banner");
    const hasMeaningfulContent = (adModule as unknown as {
      hasMeaningfulAdsterraContent(nodes: Iterable<ContentNode>): boolean;
    }).hasMeaningfulAdsterraContent;

    expect(hasMeaningfulContent([comment("placeholder"), text("  "), element("div")])).toBe(false);
    expect(hasMeaningfulContent([element("div", {}, [comment("later"), text("\n")])])).toBe(false);
    expect(hasMeaningfulContent([element("script", {}, [text("bootstrap native creative")])])).toBe(false);
    expect(hasMeaningfulContent([element("a", {href: "https://ad.example/empty"})])).toBe(false);
    expect(hasMeaningfulContent([element("div", {}, [element("a", {href: "https://ad.example/nested-empty"})])])).toBe(false);
    expect(hasMeaningfulContent([element("a", {href: "https://ad.example/text"}, [text("Native creative")])])).toBe(true);
    expect(hasMeaningfulContent([element("a", {href: "https://ad.example/image"}, [element("img", {src: "https://ad.example/creative.jpg"})])])).toBe(true);
    expect(hasMeaningfulContent([element("iframe", {src: "https://ad.example/frame"})])).toBe(true);
    expect(hasMeaningfulContent([element("img", {src: "https://ad.example/creative.jpg"})])).toBe(true);
    expect(hasMeaningfulContent([element("video", {src: "https://ad.example/creative.mp4"})])).toBe(true);
    expect(hasMeaningfulContent([element("source", {src: "https://ad.example/creative.webm"})])).toBe(true);
    expect(hasMeaningfulContent([element("div", {}, [text("Native creative")])])).toBe(true);
  });

  it("keeps a fallback terminal after timeout, error, or late fill", async () => {
    const adModule = await import("../../src/components/ads/adsterra-native-banner");
    const transition = (adModule as unknown as {
      transitionAdsterraNativeState(
        state: "loading" | "filled" | "fallback",
        event: "meaningful-fill" | "timeout" | "error"
      ): "loading" | "filled" | "fallback";
    }).transitionAdsterraNativeState;

    expect(transition("loading", "meaningful-fill")).toBe("filled");
    expect(transition("loading", "timeout")).toBe("fallback");
    expect(transition("loading", "error")).toBe("fallback");
    expect(transition("fallback", "meaningful-fill")).toBe("fallback");
  });
});
