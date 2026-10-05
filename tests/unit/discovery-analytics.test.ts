import {afterEach, describe, expect, it, vi} from "vitest";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "../../src/lib/analytics-events";
import * as site from "../../src/components/seo/site-analytics";
import {DISCOVERY_TASKS, HOME_SECTIONS} from "../../src/features/discovery/discovery-types";

import * as taxonomy from "../../src/features/analytics/discovery-taxonomy";
import * as sections from "../../src/components/seo/home-section-analytics";
afterEach(() => vi.unstubAllGlobals());

const context = {locale: "ja" as const, pagePath: "/ja/", origin: "https://www.wardogswiki.com", basePath: ""};

describe("discovery click contracts", () => {
  it.each(DISCOVERY_TASKS)("accepts known home task %s", (task) => {
    expect(taxonomy.getHomeTaskClickEvent({homeTask: task, homePlacement: "command"}, "/ja/tools/map", context)?.parameters.task).toBe(task);
  });

  it("preserves historical tasks and placements without changing their meaning", () => {
    for (const task of ["firstMatch", "pcFixes", "faq"]) {
      for (const placement of ["hero", "action-hub", "discovery", "intel", "catalogue", "recovery", "routes", "tools", "collections", "tactical-hub", "editorial-path", "editorial-priority"]) {
        expect(taxonomy.getHomeTaskClickEvent({homeTask: task, homePlacement: placement}, "/ja/guides/wardogs-crash-fix", context)?.parameters).toMatchObject({task, placement});
      }
    }
    for (const placement of HOME_SECTIONS) {
      expect(taxonomy.getHomeTaskClickEvent({homeTask: "map", homePlacement: placement}, "/ja/tools/map", context)?.parameters.placement).toBe(placement);
    }
  });

  it("normalizes basePath, locale, trailing slashes and strips all private query/hash fields", () => {
    expect(taxonomy.getHomeTaskClickEvent({homeTask: "map", homePlacement: "command"},
      "https://www.wardogswiki.com/wardogs/ja/tools/map/?x=123&y=456&query=private&share=config#user-data",
      {...context, pagePath: "/wardogs/ja/", basePath: "/wardogs"})).toEqual({
      name: "home_task_click",
      parameters: {
        task: "map", placement: "command", locale: "ja", page_path: "/ja",
        link_url: "https://www.wardogswiki.com/wardogs/ja/tools/map", target_path: "/tools/map"
      }
    });
  });

  it("rejects unknown tasks, placements, external URLs and home labels on deeper pages", () => {
    expect(taxonomy.getHomeTaskClickEvent({homeTask: "wardogs-cargo-guide", homePlacement: "hero"}, "/ja/guides", context)).toBeNull();
    expect(taxonomy.getHomeTaskClickEvent({homeTask: "map", homePlacement: "unknown"}, "/ja/tools/map", context)).toBeNull();
    expect(taxonomy.getHomeTaskClickEvent({homeTask: "map", homePlacement: "hero"}, "https://other.example/ja/tools/map", context)).toBeNull();
    expect(taxonomy.getHomeTaskClickEvent({homeTask: "map", homePlacement: "hero"}, "/ja/tools/map", {...context, pagePath: "/ja/guides"})).toBeNull();
  });

  it.each([
    ["guides", "/ja/guides"], ["catalogue", "/ja/items"], ["tools", "/ja/tools"]
  ])("emits a hub event for %s with only approved categorical fields", (hub, pagePath) => {
    expect(taxonomy.getDiscoveryClickEvent({
      discoveryHub: hub, discoveryTask: "logistics", discoveryTarget: "/tools/logistics-planner",
      query: "free text", coordinates: "123,456", config: "loadout", share: "sensitive"
    }, "/ja/tools/logistics-planner?config=private#coordinates", {...context, pagePath})).toEqual({
      name: "discovery_click", parameters: {hub, task: "logistics", locale: "ja", page_path: pagePath, target_path: "/tools/logistics-planner"}
    });
  });

  it("rejects forged hub identities, tasks or mismatched advertised destinations", () => {
    const dataset = {discoveryHub: "tools", discoveryTask: "map", discoveryTarget: "/tools/map"};
    expect(taxonomy.getDiscoveryClickEvent(dataset, "/ja/tools/map", context)).toBeNull();
    expect(taxonomy.getDiscoveryClickEvent({...dataset, discoveryHub: "unknown"}, "/ja/tools/map", {...context, pagePath: "/ja/tools"})).toBeNull();
    expect(taxonomy.getDiscoveryClickEvent({...dataset, discoveryTask: "unknown"}, "/ja/tools/map", {...context, pagePath: "/ja/tools"})).toBeNull();
    expect(taxonomy.getDiscoveryClickEvent(dataset, "/ja/tools/system-check", {...context, pagePath: "/ja/tools"})).toBeNull();
  });
});

function browserBoundary(pagePath = "/ja") {
  const documentListeners = new Map<string, EventListener>();
  const windowListeners = new Map<string, Set<EventListener>>();
  class LinkElement {
    constructor(public dataset: Record<string, string>, public href: string | undefined = "https://www.wardogswiki.com/ja/tools/map") {}
    textContent = "private text";
    closest() {return this;}
  }
  const windowTarget = {
    gtag: vi.fn(),
    innerHeight: 844,
    location: {pathname: pagePath, origin: context.origin, href: `${context.origin}${pagePath}`},
    addEventListener(name: string, listener: EventListener) {
      const listeners = windowListeners.get(name) ?? new Set();
      listeners.add(listener); windowListeners.set(name, listeners);
    },
    removeEventListener(name: string, listener: EventListener) {windowListeners.get(name)?.delete(listener);},
    dispatchEvent(event: Event) {
      for (const listener of windowListeners.get(event.type) ?? []) listener(event);
      return true;
    }
  };
  const documentTarget = {
    addEventListener(name: string, listener: EventListener) {documentListeners.set(name, listener);},
    removeEventListener(name: string, listener: EventListener) {if (documentListeners.get(name) === listener) documentListeners.delete(name);},
    querySelectorAll: () => [] as unknown[]
  };
  vi.stubGlobal("Element", LinkElement);
  vi.stubGlobal("window", windowTarget);
  vi.stubGlobal("document", documentTarget);
  return {windowTarget, documentTarget, LinkElement, documentListeners, windowListeners};
}

describe("delegated site analytics", () => {
  it("records the command search button once using its explicit canonical target", () => {
    const browser = browserBoundary();
    const cleanup = site.installSiteAnalytics("ja");
    const button = new browser.LinkElement({homeTask: "search", homePlacement: "command", homeTarget: "/ja"});
    button.href = undefined;
    browser.documentListeners.get("click")?.({target: button} as unknown as Event);
    expect(browser.windowTarget.gtag.mock.calls).toEqual([
      ["event", "home_task_click", {task: "search", placement: "command", locale: "ja", page_path: "/ja", target_path: "/", link_url: "https://www.wardogswiki.com/ja"}]
    ]);
    cleanup();
  });
  it("uses only the canonical event for a new task without historical analytics", () => {
    const browser = browserBoundary();
    const cleanup = site.installSiteAnalytics("ja");
    const link = new browser.LinkElement({homeTask: "squad", homePlacement: "proven-demand"}, "https://www.wardogswiki.com/ja/guides/wardogs-squad-guide");
    browser.documentListeners.get("click")?.({target: link} as unknown as Event);
    expect(browser.windowTarget.gtag.mock.calls.map((call) => call[1])).toEqual(["home_task_click"]);
    cleanup();
  });
  it("emits one canonical home click and one explicitly marked historical event", () => {
    const browser = browserBoundary();
    const cleanup = site.installSiteAnalytics("ja");
    const link = new browser.LinkElement({homeTask: "map", homePlacement: "hero"});
    browser.documentListeners.get("click")?.({target: link} as unknown as Event);
    expect(browser.windowTarget.gtag.mock.calls).toEqual([
      ["event", "home_task_click", {task: "map", placement: "hero", locale: "ja", page_path: "/ja", target_path: "/tools/map", link_url: "https://www.wardogswiki.com/ja/tools/map"}],
      ["event", "home_task_click_map", {task: "map", placement: "hero", locale: "ja", page_path: "/ja", target_path: "/tools/map", link_url: "https://www.wardogswiki.com/ja/tools/map", legacy_compat: true}]
    ]);
    cleanup();
    expect(browser.documentListeners.has("click")).toBe(false);
  });

  it("keeps a hub click out of home events even if stale home attributes remain", () => {
    const browser = browserBoundary("/ja/tools");
    const cleanup = site.installSiteAnalytics("ja");
    const link = new browser.LinkElement({homeTask: "map", homePlacement: "hero", discoveryHub: "tools", discoveryTask: "map", discoveryTarget: "/tools/map"});
    browser.documentListeners.get("click")?.({target: link} as unknown as Event);
    expect(browser.windowTarget.gtag.mock.calls).toEqual([
      ["event", "discovery_click", {hub: "tools", task: "map", locale: "ja", page_path: "/ja/tools", target_path: "/tools/map"}]
    ]);
    cleanup();
  });
});

describe("home section exposure", () => {
  function observerBoundary() {
    const browser = browserBoundary();
    const sentinels = [
      {dataset: {homeSectionSentinel: "command"}}, {dataset: {homeSectionSentinel: "proven-demand"}},
      {dataset: {homeSectionSentinel: "invalid"}}, {dataset: {homeSectionSentinel: "library"}}
    ];
    browser.documentTarget.querySelectorAll = () => sentinels;
    const observers: Observer[] = [];
    class Observer {
      observed: unknown[] = [];
      disconnected = false;
      constructor(public callback: IntersectionObserverCallback, public options: IntersectionObserverInit) {observers.push(this);}
      observe(target: unknown) {this.observed.push(target);}
      disconnect() {this.disconnected = true;}
      enter(index: number, isIntersecting = true) {
        this.callback([{target: sentinels[index], isIntersecting} as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }
    vi.stubGlobal("IntersectionObserver", Observer);
    return {...browser, observers, sentinels};
  }

  it("observes only valid top sentinels in the middle half and records each once per page view", () => {
    const browser = observerBoundary();
    const cleanup = sections.installHomeSectionAnalytics("ja");
    const observer = browser.observers[0];
    // Vertical percentage rootMargins resolve against width; pixels preserve viewport-height quarters.
    expect(observer.options).toEqual({rootMargin: "-211px 0px -211px 0px", threshold: 0});
    expect(observer.observed).toEqual([browser.sentinels[0], browser.sentinels[1], browser.sentinels[3]]);
    observer.enter(0, false);
    observer.enter(0);
    observer.enter(0);
    observer.enter(1);
    observer.enter(2);
    expect(browser.windowTarget.gtag.mock.calls).toEqual([
      ["event", "home_section_view", {section: "command", locale: "ja", page_path: "/ja"}],
      ["event", "home_section_view", {section: "proven-demand", locale: "ja", page_path: "/ja"}]
    ]);
    cleanup();
    expect(observer.disconnected).toBe(true);
    observer.enter(3);
    expect(browser.windowTarget.gtag.mock.calls).toHaveLength(2);
  });

  it("recalculates the middle region on viewport resize without resetting page-view deduplication", () => {
    const browser = observerBoundary();
    const cleanup = sections.installHomeSectionAnalytics("ja");
    browser.observers[0].enter(0);
    browser.windowTarget.innerHeight = 1080;
    browser.windowTarget.dispatchEvent(new Event("resize"));
    expect(browser.observers.at(-1)?.options.rootMargin).toBe("-270px 0px -270px 0px");
    browser.observers.at(-1)?.enter(0);
    expect(browser.windowTarget.gtag.mock.calls).toHaveLength(1);
    cleanup();
  });

  it("resets once on bfcache pageshow and removes lifecycle listeners on cleanup", () => {
    const browser = observerBoundary();
    const cleanupSite = site.installSiteAnalytics("ja");
    const cleanupSections = sections.installHomeSectionAnalytics("ja");
    browser.observers[0].enter(0);
    browser.windowTarget.location.href = `${context.origin}/ja?view=restored`;
    const restored = new Event("pageshow");
    Object.assign(restored, {persisted: true});
    browser.windowTarget.dispatchEvent(restored);
    expect(browser.observers).toHaveLength(2);
    browser.observers.at(-1)?.enter(0);
    expect(browser.windowTarget.gtag.mock.calls).toHaveLength(2);
    cleanupSite(); cleanupSections();
    expect([...browser.windowListeners.values()].every((listeners) => listeners.size === 0)).toBe(true);
  });

  it("resets exposure deduplication on an actual new page_view, including same-path views", () => {
    const browser = observerBoundary();
    const cleanup = sections.installHomeSectionAnalytics("ja");
    browser.observers[0].enter(0);
    trackAnalyticsEvent("page_view", {page_path: "/ja?query=private#user-data"});
    browser.observers.at(-1)?.enter(0);
    expect(browser.windowTarget.gtag.mock.calls.filter((call) => call[1] === "home_section_view")).toEqual([
      ["event", "home_section_view", {section: "command", locale: "ja", page_path: "/ja"}],
      ["event", "home_section_view", {section: "command", locale: "ja", page_path: "/ja"}]
    ]);
    cleanup();
  });

  it("resets after a back/forward restoration while keeping duplicate location notifications coalesced", () => {
    const browser = observerBoundary();
    const cleanupSite = site.installSiteAnalytics("ja");
    const cleanupSections = sections.installHomeSectionAnalytics("ja");
    browser.observers[0].enter(0);
    browser.windowTarget.location.href = `${context.origin}/ja?view=2`;
    browser.windowTarget.dispatchEvent(new Event("popstate"));
    browser.observers.at(-1)?.enter(0);
    browser.windowTarget.dispatchEvent(new Event("popstate"));
    browser.observers.at(-1)?.enter(0);
    expect(browser.windowTarget.gtag.mock.calls.filter((call) => call[1] === "home_section_view")).toHaveLength(2);
    cleanupSite(); cleanupSections();
  });

  it("quietly degrades when IntersectionObserver is unavailable", () => {
    const browser = browserBoundary();
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(() => sections.installHomeSectionAnalytics("ja")()).not.toThrow();
    expect(browser.windowTarget.gtag).not.toHaveBeenCalled();
  });
});

it("registers stable discovery and exposure event names", () => {
  expect(ANALYTICS_EVENTS).toMatchObject({discoveryClick: "discovery_click", homeSectionView: "home_section_view"});
});
