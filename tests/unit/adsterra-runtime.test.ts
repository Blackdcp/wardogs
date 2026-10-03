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

class DocumentBoundary {
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
    expect(slot.children.map((child) => child.src)).toEqual(["https://arkgleamfox.com/3342dc928824e6ed5c01555e7f9e9e0f/invoke.js"]);
    expect(document.defaultView.atOptions).toMatchObject({key: "3342dc928824e6ed5c01555e7f9e9e0f", width: 300});
    expect(second.children).toHaveLength(0);
    slot.children[0].dispatchEvent(new Event("load"));
    expect(statuses).toEqual(["script_loaded"]);
    expect(second.children.map((child) => child.src)).toEqual(["https://arkgleamfox.com/c6d1a3e01dc90e01385598a3c84dcaea/invoke.js"]);
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
    expect(statuses).toEqual(["script_error"]);
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
    expect(statuses).toEqual([]);
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
    expect(script.src).toBe("https://arkgleamfox.com/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js");
    script.dispatchEvent(new Event(event));
    expect(statuses).toEqual([event === "load" ? "script_loaded" : "script_error"]);
    slot.appendChild(document.createElement("iframe"));
    stop();
    expect(parent.children).toEqual([slot]);
    expect(slot.children).toHaveLength(0);
    script.dispatchEvent(new Event(event));
    expect(statuses).toHaveLength(1);
  });
});

describe("Adsterra observable status", () => {
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
