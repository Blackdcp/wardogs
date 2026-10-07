import {afterEach, describe, expect, it, vi} from "vitest";
import {AD_LOAD_AHEAD_PX, afterForegroundTime, whenAdNearViewport} from "../../src/features/ads/ad-loading";

class DocumentBoundary extends EventTarget {
  hidden = false;
  defaultView = {innerHeight: 800};
}

class IntersectionBoundary {
  static instances: IntersectionBoundary[] = [];
  disconnected = false;
  constructor(readonly callback: (entries: unknown[]) => void, readonly options: IntersectionObserverInit) {IntersectionBoundary.instances.push(this);}
  observe() {}
  disconnect() {this.disconnected = true;}
  emit(target: unknown, near: boolean) {this.callback([{target, isIntersecting: near}]);}
}

function fixture(top = 2_000) {
  const document = new DocumentBoundary();
  const element = {ownerDocument: document, getBoundingClientRect: () => ({top, bottom: top + 250, width: 300, height: 250})} as unknown as HTMLElement;
  IntersectionBoundary.instances = [];
  vi.stubGlobal("IntersectionObserver", IntersectionBoundary);
  return {document, element};
}

afterEach(() => {vi.unstubAllGlobals(); vi.useRealTimers();});

describe("ad loading eligibility", () => {
  it("starts first-screen inventory immediately, only once, and cleans up the existing request", () => {
    const {element} = fixture(100);
    const stopRequest = vi.fn();
    const start = vi.fn(() => stopRequest);
    const stop = whenAdNearViewport(element, start);
    expect(start).toHaveBeenCalledTimes(1);
    const observer = IntersectionBoundary.instances[0];
    expect(observer.options.rootMargin).toBe(`${AD_LOAD_AHEAD_PX}px 0px`);
    expect(observer.disconnected).toBe(true);
    observer.emit(element, false);
    observer.emit(element, true);
    expect(start).toHaveBeenCalledTimes(1);
    stop();
    expect(stopRequest).toHaveBeenCalledTimes(1);
  });

  it("does not request deep-page inventory until it approaches the viewport", () => {
    const {element} = fixture();
    const start = vi.fn(() => vi.fn());
    const stop = whenAdNearViewport(element, start);
    expect(start).not.toHaveBeenCalled();
    const observer = IntersectionBoundary.instances[0];
    observer.emit(element, false);
    expect(start).not.toHaveBeenCalled();
    observer.emit(element, true);
    expect(start).toHaveBeenCalledTimes(1);
    stop();
  });

  it("waits for foreground eligibility and cancels an unseen slot without a request", () => {
    const {document, element} = fixture();
    document.hidden = true;
    const start = vi.fn(() => vi.fn());
    const stop = whenAdNearViewport(element, start);
    IntersectionBoundary.instances[0].emit(element, true);
    expect(start).not.toHaveBeenCalled();
    document.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(start).toHaveBeenCalledTimes(1);
    stop();

    const next = fixture();
    const neverStart = vi.fn(() => vi.fn());
    const cancel = whenAdNearViewport(next.element, neverStart);
    cancel();
    IntersectionBoundary.instances[0].emit(next.element, true);
    expect(neverStart).not.toHaveBeenCalled();
  });

  it("falls back to one foreground request when IntersectionObserver is unavailable", () => {
    const {document, element} = fixture();
    vi.stubGlobal("IntersectionObserver", undefined);
    document.hidden = true;
    const start = vi.fn(() => vi.fn());
    const stop = whenAdNearViewport(element, start);
    expect(start).not.toHaveBeenCalled();
    document.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(start).toHaveBeenCalledTimes(1);
    stop();
  });
});

describe("foreground-only diagnostics", () => {
  it("excludes background time and fires only once", () => {
    vi.useFakeTimers();
    const document = new DocumentBoundary();
    const callback = vi.fn();
    const stop = afterForegroundTime(document as unknown as Document, 15_000, callback);
    vi.advanceTimersByTime(5_000);
    document.hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(60_000);
    expect(callback).not.toHaveBeenCalled();
    document.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(9_999);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(30_000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    stop();
  });

  it("removes its timer and listener on cancellation", () => {
    vi.useFakeTimers();
    const document = new DocumentBoundary();
    const remove = vi.spyOn(document, "removeEventListener");
    const callback = vi.fn();
    const stop = afterForegroundTime(document as unknown as Document, 15_000, callback);
    stop();
    vi.advanceTimersByTime(30_000);
    expect(callback).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(remove).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });
});
