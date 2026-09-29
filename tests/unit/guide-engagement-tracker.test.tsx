import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {GuideEngagementTracker} from "../../src/components/seo/guide-engagement-tracker";

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => (() => void) | void) | undefined,
  refs: [] as {current: unknown}[],
  refIndex: 0
}));

vi.mock("react", () => ({
  useEffect: (effect: () => (() => void) | void) => { hooks.effect = effect; },
  useRef: (initial: unknown) => {
    const index = hooks.refIndex++;
    hooks.refs[index] ??= {current: initial};
    return hooks.refs[index];
  }
}));

describe("guide engagement lifecycle", () => {
  let cleanup: (() => void) | void;
  let page: EventTarget & {
    visibilityState: string;
    documentElement: {scrollHeight: number};
    body: {scrollHeight: number};
  };
  let browser: EventTarget & {scrollY: number; innerHeight: number; gtag: ReturnType<typeof vi.fn>};

  function mount(slug = "wardogs-gameplay") {
    cleanup?.();
    hooks.refIndex = 0;
    GuideEngagementTracker({locale: "en", slug, category: "gameplay"});
    cleanup = hooks.effect?.();
  }

  function visibility(value: "visible" | "hidden") {
    page.visibilityState = value;
    page.dispatchEvent(new Event("visibilitychange"));
  }

  beforeEach(() => {
    vi.useFakeTimers({toFake: ["setTimeout", "clearTimeout", "performance"]});
    hooks.refs = [];
    hooks.refIndex = 0;
    page = Object.assign(new EventTarget(), {
      visibilityState: "visible",
      documentElement: {scrollHeight: 2_000},
      body: {scrollHeight: 2_000}
    });
    browser = Object.assign(new EventTarget(), {
      scrollY: 1_000,
      innerHeight: 800,
      setTimeout,
      clearTimeout,
      gtag: vi.fn()
    });
    vi.stubGlobal("document", page);
    vi.stubGlobal("window", browser);
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("does not qualify a guide opened in a background tab", () => {
    visibility("hidden");
    mount();
    vi.advanceTimersByTime(35 * 60_000);
    expect(browser.gtag).not.toHaveBeenCalled();
    visibility("visible");
    vi.advanceTimersByTime(59_999);
    expect(browser.gtag).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(browser.gtag).toHaveBeenCalledExactlyOnceWith("event", "engaged_guide", {
      guide_slug: "wardogs-gameplay",
      guide_category: "gameplay",
      locale: "en",
      engagement_seconds: 60,
      scroll_percent: 75
    });
  });

  it("pauses the remaining visible time during a long absence", () => {
    mount();
    vi.advanceTimersByTime(20_000);
    visibility("hidden");
    vi.advanceTimersByTime(35 * 60_000);
    expect(browser.gtag).not.toHaveBeenCalled();
    visibility("visible");
    vi.advanceTimersByTime(39_999);
    expect(browser.gtag).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(browser.gtag).toHaveBeenCalledTimes(1);
  });

  it("does not double count time when visibility notifications repeat", () => {
    mount();
    vi.advanceTimersByTime(20_000);
    visibility("visible");
    vi.advanceTimersByTime(20_000);
    visibility("hidden");
    visibility("hidden");
    vi.advanceTimersByTime(120_000);
    visibility("visible");
    vi.advanceTimersByTime(19_999);
    expect(browser.gtag).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(browser.gtag).toHaveBeenCalledTimes(1);
  });

  it("requires time and depth, and never emits on a hidden resize", () => {
    browser.scrollY = 0;
    mount();
    vi.advanceTimersByTime(60_000);
    expect(browser.gtag).not.toHaveBeenCalled();
    visibility("hidden");
    browser.scrollY = 1_000;
    browser.dispatchEvent(new Event("resize"));
    expect(browser.gtag).not.toHaveBeenCalled();
    visibility("visible");
    expect(browser.gtag).toHaveBeenCalledTimes(1);
    browser.dispatchEvent(new Event("scroll"));
    visibility("hidden");
    visibility("visible");
    vi.advanceTimersByTime(60_000);
    expect(browser.gtag).toHaveBeenCalledTimes(1);
  });

  it("cleans up timers and listeners on unmount", () => {
    mount();
    vi.advanceTimersByTime(20_000);
    cleanup?.();
    cleanup = undefined;
    vi.advanceTimersByTime(60_000);
    visibility("hidden");
    visibility("visible");
    browser.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(60_000);
    expect(browser.gtag).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("resets qualification when the same component receives a new guide", () => {
    mount();
    vi.advanceTimersByTime(60_000);
    expect(browser.gtag).toHaveBeenCalledTimes(1);
    mount("wardogs-preload");
    vi.advanceTimersByTime(59_999);
    expect(browser.gtag).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(browser.gtag).toHaveBeenCalledTimes(2);
    expect(browser.gtag).toHaveBeenLastCalledWith("event", "engaged_guide", expect.objectContaining({
      guide_slug: "wardogs-preload"
    }));
  });
});
