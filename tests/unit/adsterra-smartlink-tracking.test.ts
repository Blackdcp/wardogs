import {afterEach, describe, expect, it, vi} from "vitest";
import {observeSmartlink} from "../../src/features/ads/smartlink-tracking";
import {AD_REPORTING_VERSION} from "../../src/features/ads/ad-reporting";

// Only browser event/intersection boundaries are doubled. Attribution and the
// emitted analytics commands use the real production code; no vendor is fetched.
class EventBoundary {
  listeners = new Map<string, Set<(event: unknown) => void>>();
  addEventListener(type: string, callback: (event: unknown) => void) {
    const callbacks = this.listeners.get(type) ?? new Set();
    callbacks.add(callback);
    this.listeners.set(type, callbacks);
  }
  removeEventListener(type: string, callback: (event: unknown) => void) {this.listeners.get(type)?.delete(callback);}
  emit(type: string, event: Record<string, unknown> = {}) {
    for (const callback of this.listeners.get(type) ?? []) callback({type, ...event});
  }
}

class IntersectionBoundary {
  static current: IntersectionBoundary;
  disconnected = false;
  constructor(readonly callback: (entries: unknown[]) => void) {IntersectionBoundary.current = this;}
  observe() {}
  disconnect() {this.disconnected = true;}
  emit(target: unknown, ratio: number) {this.callback([{target, isIntersecting: ratio > 0, intersectionRatio: ratio}]);}
}

function fixture(hostname = "wardogswiki.com") {
  const document = Object.assign(new EventBoundary(), {
    hidden: false,
    documentElement: {lang: "ja"},
    defaultView: {location: {hostname}, dataLayer: [] as unknown[]}
  });
  const link = Object.assign(new EventBoundary(), {ownerDocument: document});
  vi.stubGlobal("IntersectionObserver", IntersectionBoundary);
  return {document, link, element: link as unknown as HTMLAnchorElement};
}

afterEach(() => {vi.unstubAllGlobals();});

describe("Smartlink interactions", () => {
  it("records one foreground exposure after half of the CTA is visible, with bounded route attribution", () => {
    const {document, link, element} = fixture();
    const stop = observeSmartlink(element, "/ja/tools/map/?share=private#coordinates");
    IntersectionBoundary.current.emit(link, 0.49);
    expect(document.defaultView.dataLayer).toEqual([]);
    document.hidden = true;
    IntersectionBoundary.current.emit(link, 0.5);
    expect(document.defaultView.dataLayer).toEqual([]);
    document.hidden = false;
    document.emit("visibilitychange");
    IntersectionBoundary.current.emit(link, 1);
    document.emit("visibilitychange");
    expect(document.defaultView.dataLayer).toEqual([
      ["event", "ad_exposure", {
        ad_unit: "smartlink-1", page_path: "/ja/tools/map", page_type: "map_tool",
        config_version: AD_REPORTING_VERSION, section: "map_tool:smartlink",
        format: "smartlink", placement: "smartlink", locale: "ja"
      }]
    ]);
    stop();
  });

  it("records only trusted primary, keyboard and middle activations without changing navigation", () => {
    const {document, link, element} = fixture();
    const stop = observeSmartlink(element, "/ja/guides");
    const cancel = vi.fn();
    link.emit("click", {isTrusted: false, button: 0, preventDefault: cancel});
    link.emit("click", {isTrusted: true, button: 0, defaultPrevented: true, preventDefault: cancel});
    link.emit("auxclick", {isTrusted: true, button: 2, preventDefault: cancel});
    expect(document.defaultView.dataLayer).toEqual([]);
    link.emit("click", {isTrusted: true, button: 0, detail: 1, preventDefault: cancel});
    link.emit("click", {isTrusted: true, button: 0, detail: 0, preventDefault: cancel});
    link.emit("auxclick", {isTrusted: true, button: 1, preventDefault: cancel});
    expect(document.defaultView.dataLayer).toEqual(Array.from({length: 3}, () => ["event", "ad_click", {
      ad_unit: "smartlink-1", page_path: "/ja/guides", page_type: "guide_hub",
      config_version: AD_REPORTING_VERSION, section: "guide_hub:smartlink",
      format: "smartlink", placement: "smartlink", locale: "ja"
    }]));
    expect(cancel).not.toHaveBeenCalled();
    stop();
  });

  it("stops observers and click listeners on cleanup, and attributes the next route separately", () => {
    const {document, link, element} = fixture();
    const stop = observeSmartlink(element, "/ja/guides");
    const firstObserver = IntersectionBoundary.current;
    firstObserver.emit(link, 1);
    stop();
    firstObserver.emit(link, 1);
    document.emit("visibilitychange");
    link.emit("click", {isTrusted: true, button: 0});
    expect(document.defaultView.dataLayer).toHaveLength(1);
    expect(firstObserver.disconnected).toBe(true);
    const stopNext = observeSmartlink(element, "/ja/items");
    IntersectionBoundary.current.emit(link, 1);
    expect(document.defaultView.dataLayer[1]).toEqual(["event", "ad_exposure", {
      ad_unit: "smartlink-1", page_path: "/ja/items", page_type: "catalogue_hub",
      config_version: AD_REPORTING_VERSION, section: "catalogue_hub:smartlink",
      format: "smartlink", placement: "smartlink", locale: "ja"
    }]);
    stopNext();
    const stopBack = observeSmartlink(element, "/ja/guides?back=private");
    IntersectionBoundary.current.emit(link, 1);
    IntersectionBoundary.current.emit(link, 1);
    expect(document.defaultView.dataLayer).toHaveLength(3);
    expect(document.defaultView.dataLayer[2]).toEqual(document.defaultView.dataLayer[0]);
    stopBack();
  });

  it.each(["localhost", "preview.pages.dev", "wardogswiki.com.example.com"])("suppresses ad telemetry on %s", (hostname) => {
    const {document, link, element} = fixture(hostname);
    const stop = observeSmartlink(element, "/ja/guides");
    link.emit("click", {isTrusted: true, button: 0});
    document.emit("visibilitychange");
    expect(document.defaultView.dataLayer).toEqual([]);
    stop();
  });

  it("normalizes HTML language casing and rejects private data in placement labels", () => {
    const {document, link, element} = fixture();
    document.documentElement.lang = "zh-CN";
    const stop = observeSmartlink(element, "/zh-cn/guides?email=private@example.com", "?email=private@example.com");
    link.emit("click", {isTrusted: true, button: 0});
    expect(document.defaultView.dataLayer).toEqual([["event", "ad_click", {
      ad_unit: "smartlink-1", page_path: "/zh-cn/guides", page_type: "guide_hub",
      config_version: AD_REPORTING_VERSION, section: "guide_hub:smartlink",
      format: "smartlink", placement: "smartlink", locale: "zh-cn"
    }]]);
    stop();
  });

  it("keeps clicks available without intersection support and isolates analytics failures", () => {
    const {document, link, element} = fixture();
    vi.stubGlobal("IntersectionObserver", undefined);
    Object.assign(document.defaultView, {gtag: () => {throw new Error("Analytics blocked");}});
    const stop = observeSmartlink(element, "/ja/guides", "?private=visitor");
    expect(() => link.emit("click", {isTrusted: true, button: 0})).not.toThrow();
    expect(document.defaultView.dataLayer).toEqual([]);
    stop();
  });
});
