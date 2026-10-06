import {afterEach, describe, expect, it, vi} from "vitest";
import * as banners from "../../src/features/ads/adsterra-banner";
import * as native from "../../src/features/ads/adsterra-native";

// Only browser boundaries are doubled: production sizing, queueing, lifecycle and
// analytics remain real. No scripts are fetched or evaluated by this fixture.
class ElementBoundary extends EventTarget {
  ownerDocument: DocumentBoundary;
  parentNode: ElementBoundary | null = null;
  children: ElementBoundary[] = [];
  src = "";
  type = "";
  async = false;
  dataset: Record<string, string> = {};
  clientWidth = 736;
  complete = false;
  naturalWidth = 0;
  width = 300;
  height = 250;
  private html = "";
  constructor(readonly tagName: string, document: DocumentBoundary) {
    super();
    this.ownerDocument = document;
  }
  get innerHTML() {return this.html;}
  set innerHTML(value: string) {
    this.html = value;
    this.children.forEach((child) => {child.parentNode = null;});
    this.children = [];
  }
  appendChild(child: ElementBoundary) {child.parentNode = this; this.children.push(child); return child;}
  insertBefore(child: ElementBoundary, reference: ElementBoundary) {
    child.parentNode = this;
    this.children.splice(this.children.indexOf(reference), 0, child);
    return child;
  }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }
  getAttribute(name: string) {return name === "src" ? this.src || null : null;}
  getBoundingClientRect() {return {width: this.width, height: this.height};}
  querySelector(selector: string) {
    return this.children.find((child) => selector.includes("script") && child.tagName === "SCRIPT") ?? null;
  }
  querySelectorAll() {
    return this.children.filter((child) => ["IFRAME", "IMG", "VIDEO"].includes(child.tagName));
  }
}

class ObserverBoundary {
  static instances: ObserverBoundary[] = [];
  observed = new Set<ElementBoundary>();
  disconnected = false;
  constructor(readonly callback: (entries: unknown[]) => void) {ObserverBoundary.instances.push(this);}
  observe(element: ElementBoundary) {this.observed.add(element);}
  unobserve(element: ElementBoundary) {this.observed.delete(element);}
  disconnect() {this.disconnected = true; this.observed.clear();}
  emit(entries: unknown[] = []) {this.callback(entries);}
}

class DocumentBoundary extends EventTarget {
  hidden = false;
  defaultView = {
    location: {hostname: "wardogswiki.com"},
    dataLayer: [] as unknown[],
    atOptions: undefined as unknown,
    getComputedStyle: () => ({paddingLeft: "16px", paddingRight: "16px"}),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  };
  createElement(tag: string) {return new ElementBoundary(tag.toUpperCase(), this);}
}

function fixture() {
  ObserverBoundary.instances = [];
  const document = new DocumentBoundary();
  vi.stubGlobal("window", document.defaultView);
  vi.stubGlobal("ResizeObserver", ObserverBoundary);
  vi.stubGlobal("IntersectionObserver", ObserverBoundary);
  vi.stubGlobal("MutationObserver", ObserverBoundary);
  const slot = document.createElement("div");
  return {document, slot, element: slot as unknown as HTMLElement};
}

afterEach(() => {vi.unstubAllGlobals();});

describe("Adsterra container sizing", () => {
  it("measures content width, responds to container changes, and stops after cleanup", () => {
    const {element, slot} = fixture();
    const measured: number[] = [];
    expect(banners.observeAdContainerWidth).toBeTypeOf("function");
    const stop = banners.observeAdContainerWidth(element, (width) => {measured.push(width);});
    expect(measured).toEqual([704]);
    const observer = ObserverBoundary.instances[0];
    observer.emit([{target: slot, contentRect: {width: 436}}]);
    observer.emit([{target: slot, contentRect: {width: 728}}]);
    expect(measured).toEqual([704, 436, 728]);
    stop();
    observer.emit([{target: slot, contentRect: {width: 900}}]);
    expect(measured).toEqual([704, 436, 728]);
    expect(observer.disconnected).toBe(true);
  });

  it("refuses a 300px rectangle in a 288px container", () => {
    expect(banners.selectAdsterraDisplayUnit).toBeTypeOf("function");
    expect(banners.selectAdsterraDisplayUnit("rectangle", 288)).toBeNull();
    expect(banners.selectAdsterraDisplayUnit("rectangle", 300)?.width).toBe(300);
    expect(banners.selectAdsterraDisplayUnit("horizontal", 436)).toBeNull();
    expect(banners.selectAdsterraDisplayUnit("horizontal", 704)?.width).toBe(468);
    expect(banners.selectAdsterraDisplayUnit("horizontal", Number.NaN)).toBeNull();
  });

  it("falls back to measured resize updates when ResizeObserver is unavailable", () => {
    const {document, element, slot} = fixture();
    vi.stubGlobal("ResizeObserver", undefined);
    const widths: number[] = [];
    const stop = banners.observeAdContainerWidth(element, (width) => {widths.push(width);});
    const resize = document.defaultView.addEventListener.mock.calls[0][1] as () => void;
    slot.clientWidth = 500;
    resize();
    expect(widths).toEqual([704, 468]);
    stop();
    expect(document.defaultView.removeEventListener.mock.calls[0]).toEqual(["resize", resize]);
    resize();
    expect(widths).toEqual([704, 468]);
  });
});

describe("Adsterra display loader configuration", () => {
  it("keeps each initial loader paired with its configuration until load completes", () => {
    const {document, element, slot} = fixture();
    const second = document.createElement("div");
    const statuses: string[] = [];
    expect(banners.mountAdsterraBanner).toBeTypeOf("function");
    const stopFirst = banners.mountAdsterraBanner(element, banners.ADSTERRA_BANNER_UNITS.rectangle300, (status) => {statuses.push(status);});
    const stopSecond = banners.mountAdsterraBanner(second as unknown as HTMLElement, banners.ADSTERRA_BANNER_UNITS.horizontal468);
    expect(slot.children.map((child) => child.src)).toEqual(["https://bauval.org/22/3342dc928824e6ed5c01555e7f9e9e0f"]);
    expect(document.defaultView.atOptions).toMatchObject({key: "3342dc928824e6ed5c01555e7f9e9e0f", width: 300});
    expect(second.children).toHaveLength(0);
    slot.children[0].dispatchEvent(new Event("load"));
    expect(statuses).toEqual(["request_started", "script_loaded"]);
    expect(second.children.map((child) => child.src)).toEqual(["https://bauval.org/22/c6d1a3e01dc90e01385598a3c84dcaea"]);
    expect(document.defaultView.atOptions).toMatchObject({key: "c6d1a3e01dc90e01385598a3c84dcaea", width: 468});
    second.children[0].dispatchEvent(new Event("load"));
    stopFirst(); stopSecond();
  });

  it("skips canceled queued slots and starts the next slot after an error", () => {
    const {document, element, slot} = fixture();
    const second = document.createElement("div");
    const third = document.createElement("div");
    const statuses: string[] = [];
    expect(banners.mountAdsterraBanner).toBeTypeOf("function");
    const stopFirst = banners.mountAdsterraBanner(element, banners.ADSTERRA_BANNER_UNITS.rectangle300, (status) => {statuses.push(status);});
    const stopSecond = banners.mountAdsterraBanner(second as unknown as HTMLElement, banners.ADSTERRA_BANNER_UNITS.horizontal468);
    const stopThird = banners.mountAdsterraBanner(third as unknown as HTMLElement, banners.ADSTERRA_BANNER_UNITS.rail300);
    stopSecond();
    slot.children[0].dispatchEvent(new Event("error"));
    expect(statuses).toEqual(["request_started", "script_error"]);
    expect(second.children).toHaveLength(0);
    expect(document.defaultView.atOptions).toMatchObject({key: "f6fc5667adc4cb97634312e962c199c5", width: 160});
    expect(third.children).toHaveLength(1);
    third.children[0].dispatchEvent(new Event("load"));
    stopFirst(); stopThird();
  });

  it("does not release the configuration lease when an in-flight slot is canceled", () => {
    const {document, element, slot} = fixture();
    const second = document.createElement("div");
    const statuses: string[] = [];
    expect(banners.mountAdsterraBanner).toBeTypeOf("function");
    const stopFirst = banners.mountAdsterraBanner(element, banners.ADSTERRA_BANNER_UNITS.rectangle300, (status) => {statuses.push(status);});
    const script = slot.children[0];
    const stopSecond = banners.mountAdsterraBanner(second as unknown as HTMLElement, banners.ADSTERRA_BANNER_UNITS.horizontal468);
    stopFirst();
    expect(slot.children).toHaveLength(0);
    expect(second.children).toHaveLength(0);
    script.dispatchEvent(new Event("load"));
    expect(statuses).toEqual(["request_started"]);
    expect(document.defaultView.atOptions).toMatchObject({key: "c6d1a3e01dc90e01385598a3c84dcaea", width: 468});
    second.children[0].dispatchEvent(new Event("error"));
    stopSecond();
  });

  it.each(["localhost", "preview.pages.dev", "wardogswiki.com.example.com"])("does not load display or native scripts on %s", (hostname) => {
    const {document, element, slot} = fixture();
    document.defaultView.location.hostname = hostname;
    const parent = document.createElement("section");
    parent.appendChild(slot);
    expect(banners.mountAdsterraBanner).toBeTypeOf("function");
    expect(native.mountAdsterraNative).toBeTypeOf("function");
    const stopDisplay = banners.mountAdsterraBanner(element, banners.ADSTERRA_BANNER_UNITS.rectangle300);
    const stopNative = native.mountAdsterraNative(element);
    expect(slot.children).toHaveLength(0);
    expect(parent.children).toEqual([slot]);
    stopDisplay(); stopNative();
  });
});

describe("Adsterra native loader lifecycle", () => {
  it.each(["load", "error"])("reports %s and removes listeners and injected content on cleanup", (event) => {
    const {document, element, slot} = fixture();
    const parent = document.createElement("section");
    parent.appendChild(slot);
    const statuses: string[] = [];
    const stop = native.mountAdsterraNative(element, (status) => {statuses.push(status);});
    const script = parent.children[0];
    expect(script.src).toBe("https://bauval.org/21/481d6501bcd0c27b98bc3c4776a26f6e");
    script.dispatchEvent(new Event(event));
    expect(statuses).toEqual(["request_started", event === "load" ? "script_loaded" : "script_error"]);
    slot.appendChild(document.createElement("iframe"));
    stop();
    expect(parent.children).toEqual([slot]);
    expect(slot.children).toHaveLength(0);
    script.dispatchEvent(new Event(event));
    expect(statuses).toHaveLength(2);
  });
});

describe("Adsterra observable status", () => {
  afterEach(() => {vi.useRealTimers();});

  const statuses = (document: DocumentBoundary) => document.defaultView.dataLayer.map((command) => (command as [string, string, {status: string}])[2].status);
  const setHidden = (document: DocumentBoundary, hidden: boolean) => {
    document.hidden = hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  };

  it("exposes the latest observed status without letting analytics errors interrupt observation", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    Object.assign(document.defaultView, {gtag: () => {throw new Error("analytics unavailable");}});
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    expect(() => observation.report("script_loaded")).not.toThrow();
    expect(slot.dataset.adStatus).toBe("script_loaded");
    vi.advanceTimersByTime(15_000);
    expect(slot.dataset.adStatus).toBe("creative_missing");
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    expect(() => ObserverBoundary.instances[1].emit()).not.toThrow();
    expect(slot.dataset.adStatus).toBe("creative_present");
    ObserverBoundary.instances[0].emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(1_000);
    expect(slot.dataset.adStatus).toBe("creative_viewable");
    observation.cleanup();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not combine viewability time across replacement creatives", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const first = document.createElement("iframe");
    first.src = "https://creative.example/first";
    slot.appendChild(first);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    const mutations = ObserverBoundary.instances[1];
    intersection.emit([{target: first, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(600);
    first.remove();
    const second = document.createElement("iframe");
    second.src = "https://creative.example/second";
    slot.appendChild(second);
    mutations.emit();
    intersection.emit([{target: second, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(999);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible"]);
    vi.advanceTimersByTime(1);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible", "creative_viewable"]);
    observation.cleanup();
  });

  it("restarts viewability when the same iframe changes source", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/first";
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(600);
    creative.src = "https://creative.example/second";
    ObserverBoundary.instances[1].emit();
    // Re-observing the same element delivers an initial intersection for B.
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(400);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible"]);
    vi.advanceTimersByTime(599);
    expect(statuses(document)).not.toContain("creative_viewable");
    vi.advanceTimersByTime(1);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible", "creative_viewable"]);
    observation.cleanup();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cleans resize observation and dwell timers after a source replacement becomes zero-size", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/first";
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    const resize = ObserverBoundary.instances[2];
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(600);
    creative.src = "https://creative.example/second";
    ObserverBoundary.instances[1].emit();
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(300);
    creative.width = 0;
    resize.emit([{target: creative, contentRect: {width: 0, height: 250}}]);
    expect(vi.getTimerCount()).toBe(0);
    creative.width = 300;
    resize.emit([{target: creative, contentRect: {width: 300, height: 250}}]);
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(600);
    expect(statuses(document)).not.toContain("creative_viewable");
    observation.cleanup();
    creative.src = "https://creative.example/third";
    resize.emit([{target: creative, contentRect: {width: 300, height: 250}}]);
    creative.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(2_000);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible"]);
    expect(vi.getTimerCount()).toBe(0);
    expect(resize.observed.size).toBe(0);
    expect(resize.disconnected).toBe(true);
  });

  it("reports missing creative evidence only after 15 foreground seconds after script load", () => {
    vi.useFakeTimers();
    const {document, element} = fixture();
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    observation.report("request_started");
    vi.advanceTimersByTime(20_000);
    expect(statuses(document)).toEqual(["request_started"]);
    observation.report("script_loaded");
    vi.advanceTimersByTime(10_000);
    setHidden(document, true);
    vi.advanceTimersByTime(30_000);
    expect(statuses(document)).toEqual(["request_started", "script_loaded"]);
    setHidden(document, false);
    vi.advanceTimersByTime(4_999);
    expect(statuses(document)).toEqual(["request_started", "script_loaded"]);
    vi.advanceTimersByTime(1);
    vi.advanceTimersByTime(60_000);
    expect(statuses(document)).toEqual(["request_started", "script_loaded", "creative_missing"]);
    observation.cleanup();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels the missing diagnostic when a creative appears", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const observation = banners.observeAdSlot(element, "native", "native");
    observation.report("script_loaded");
    vi.advanceTimersByTime(14_999);
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    ObserverBoundary.instances[1].emit();
    vi.advanceTimersByTime(60_000);
    expect(statuses(document)).toEqual(["script_loaded", "creative_present"]);
    expect(vi.getTimerCount()).toBe(0);
    observation.cleanup();
  });

  it("cancels the missing diagnostic and visibility listener on cleanup", () => {
    vi.useFakeTimers();
    const {document, element} = fixture();
    const removeListener = vi.spyOn(document, "removeEventListener");
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    observation.report("script_loaded");
    observation.cleanup();
    setHidden(document, true);
    setHidden(document, false);
    vi.advanceTimersByTime(60_000);
    expect(statuses(document)).toEqual(["script_loaded"]);
    expect(vi.getTimerCount()).toBe(0);
    expect(removeListener).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });

  it("adds normalized route, unit and bounded release attribution to each status", () => {
    const {document, element} = fixture();
    const observation = banners.observeAdSlot(element, "rectangle", "display", {
      ad_unit: "3342dc928824e6ed5c01555e7f9e9e0f",
      page_path: "/en/tools/loadout-budget/?build=private#draft",
      page_type: "tool",
      config_version: "ads-2026-10-06"
    });
    observation.report("request_started");
    expect(document.defaultView.dataLayer).toEqual([
      ["event", "ad_status", {
        placement: "rectangle", format: "display", status: "request_started",
        ad_unit: "3342dc928824e6ed5c01555e7f9e9e0f", page_path: "/en/tools/loadout-budget", page_type: "tool", config_version: "ads-2026-10-06"
      }]
    ]);
    observation.cleanup();
    const bounded = banners.observeAdSlot(element, "rectangle", "display", {
      ad_unit: "a".repeat(100), page_type: "tool?private=value", config_version: ""
    });
    bounded.report("script_error");
    expect((document.defaultView.dataLayer[1] as unknown[])[2]).toEqual({
      placement: "rectangle", format: "display", status: "script_error", ad_unit: "a".repeat(64)
    });
    bounded.cleanup();
  });

  it("recognizes a zero-size creative after it expands without a DOM mutation", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    creative.width = 0;
    creative.height = 0;
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    observation.report("script_loaded");
    expect(statuses(document)).toEqual(["script_loaded"]);
    creative.width = 300;
    creative.height = 250;
    // A resize notification, without a load event or mutation, is the only signal.
    ObserverBoundary.instances[2]?.emit([{target: creative, contentRect: {width: 300, height: 250}}]);
    vi.advanceTimersByTime(15_000);
    expect(statuses(document)).toEqual(["script_loaded", "creative_present"]);
    observation.cleanup();
  });

  it("requires the same creative to stay at least half visible for one continuous foreground second", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.49}]);
    vi.advanceTimersByTime(2_000);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible"]);
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.5}]);
    vi.advanceTimersByTime(999);
    expect(statuses(document)).not.toContain("creative_viewable");
    vi.advanceTimersByTime(1);
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    vi.advanceTimersByTime(2_000);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible", "creative_viewable"]);
    observation.cleanup();
  });

  it("resets viewability duration when the creative leaves the viewport or the tab is hidden", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.75}]);
    vi.advanceTimersByTime(600);
    intersection.emit([{target: creative, isIntersecting: false, intersectionRatio: 0}]);
    vi.advanceTimersByTime(500);
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.75}]);
    vi.advanceTimersByTime(600);
    expect(statuses(document)).not.toContain("creative_viewable");
    setHidden(document, true);
    vi.advanceTimersByTime(20_000);
    expect(statuses(document)).not.toContain("creative_viewable");
    setHidden(document, false);
    vi.advanceTimersByTime(999);
    expect(statuses(document)).not.toContain("creative_viewable");
    vi.advanceTimersByTime(1);
    expect(statuses(document)).toEqual(["creative_present", "creative_visible", "creative_viewable"]);
    observation.cleanup();
  });

  it("does not record visibility in a hidden document or complete viewability after cleanup", () => {
    vi.useFakeTimers();
    const {document, element, slot} = fixture();
    document.hidden = true;
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    intersection.emit([
      {target: slot, isIntersecting: true, intersectionRatio: 1},
      {target: creative, isIntersecting: true, intersectionRatio: 1}
    ]);
    vi.advanceTimersByTime(20_000);
    expect(statuses(document)).toEqual(["creative_present"]);
    setHidden(document, false);
    vi.advanceTimersByTime(500);
    observation.cleanup();
    vi.advanceTimersByTime(20_000);
    expect(statuses(document)).toEqual(["creative_present", "slot_visible", "creative_visible"]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not record creative visibility after its frame becomes empty", () => {
    const {document, element, slot} = fixture();
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const creative = document.createElement("iframe");
    creative.src = "https://creative.example/ad";
    slot.appendChild(creative);
    ObserverBoundary.instances[1].emit();
    creative.src = "about:blank";
    ObserverBoundary.instances[1].emit();
    ObserverBoundary.instances[0].emit([{target: creative, isIntersecting: true, intersectionRatio: 1}]);
    expect(document.defaultView.dataLayer).toEqual([
      ["event", "ad_status", {placement: "rectangle", format: "display", status: "creative_present"}]
    ]);
    observation.cleanup();
  });

  it("keeps empty loader/slot success distinct from creative presence and visibility", () => {
    const {document, element, slot} = fixture();
    expect(banners.observeAdSlot).toBeTypeOf("function");
    const observation = banners.observeAdSlot(element, "rectangle", "display");
    const intersection = ObserverBoundary.instances[0];
    const mutations = ObserverBoundary.instances[1];
    intersection.emit([{target: slot, isIntersecting: true, intersectionRatio: 1}]);
    observation.report("script_loaded");
    expect(document.defaultView.dataLayer).toEqual([
      ["event", "ad_status", {placement: "rectangle", format: "display", status: "slot_visible"}],
      ["event", "ad_status", {placement: "rectangle", format: "display", status: "script_loaded"}]
    ]);
    const creative = document.createElement("iframe");
    creative.src = "about:blank";
    slot.appendChild(creative);
    mutations.emit();
    expect(document.defaultView.dataLayer).toHaveLength(2);
    const trackingPixel = document.createElement("img");
    trackingPixel.src = "https://creative.example/pixel";
    trackingPixel.complete = true;
    trackingPixel.naturalWidth = 1;
    trackingPixel.width = 1;
    trackingPixel.height = 1;
    slot.appendChild(trackingPixel);
    mutations.emit();
    expect(document.defaultView.dataLayer).toHaveLength(2);
    creative.src = "https://creative.example/ad";
    mutations.emit();
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.5}]);
    mutations.emit();
    intersection.emit([{target: creative, isIntersecting: true, intersectionRatio: 0.5}]);
    expect(document.defaultView.dataLayer.slice(2)).toEqual([
      ["event", "ad_status", {placement: "rectangle", format: "display", status: "creative_present"}],
      ["event", "ad_status", {placement: "rectangle", format: "display", status: "creative_visible"}]
    ]);
    observation.cleanup();
    observation.report("script_error");
    intersection.emit([{target: slot, isIntersecting: true, intersectionRatio: 1}]);
    expect(document.defaultView.dataLayer).toHaveLength(4);
    expect(ObserverBoundary.instances.every((observer) => observer.disconnected)).toBe(true);
  });

  it("waits for a loaded native image before recording creative DOM evidence", () => {
    const {document, element, slot} = fixture();
    expect(banners.observeAdSlot).toBeTypeOf("function");
    const observation = banners.observeAdSlot(element, "native", "native");
    const image = document.createElement("img");
    image.src = "https://creative.example/ad.png";
    slot.appendChild(image);
    ObserverBoundary.instances[1].emit();
    expect(document.defaultView.dataLayer).toEqual([]);
    image.complete = true;
    image.naturalWidth = 300;
    image.dispatchEvent(new Event("load"));
    expect(document.defaultView.dataLayer).toEqual([
      ["event", "ad_status", {placement: "native", format: "native", status: "creative_present"}]
    ]);
    observation.cleanup();
  });
});
