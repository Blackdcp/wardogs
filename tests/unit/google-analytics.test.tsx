import {createContext, runInContext} from "node:vm";
import {describe, expect, it, vi} from "vitest";
import {
  GOOGLE_TAG_ID,
  googleAnalyticsConfigScript,
  googleAnalyticsScriptSrc
} from "../../src/components/seo/google-analytics";
import * as googleAnalytics from "../../src/components/seo/google-analytics";
import {siteLocales} from "../../src/config/site";
import {notifyAnalyticsPageView, normalizeAnalyticsPathname} from "../../src/lib/analytics-events";
import {sanitizeAnalyticsUrl} from "../../src/lib/analytics-page-context";

function analyticsSandbox(hostname: string, pending: unknown[] = [], search = "") {
  const scripts: Record<string, unknown>[] = [];
  const listeners = new Map<string, (() => void)[]>();
  const sandbox: Record<string, unknown> = {
    URL,
    location: new URL(`https://${hostname}/en${search}`),
    dataLayer: [...pending],
    addEventListener: (name: string, listener: () => void) => listeners.set(name, [...(listeners.get(name) ?? []), listener]),
    document: {
      referrer: "",
      getElementById: (id: string) => scripts.find((script) => script.id === id),
      createElement: () => ({}),
      head: {appendChild: (script: Record<string, unknown>) => scripts.push(script)}
    }
  };
  sandbox.history = {
    pushState: (_data: unknown, _unused: string, url?: string | URL) => { if (url != null) sandbox.location = new URL(url, String(sandbox.location)); },
    replaceState: (_data: unknown, _unused: string, url?: string | URL) => { if (url != null) sandbox.location = new URL(url, String(sandbox.location)); },
  };
  sandbox.window = sandbox;
  return {sandbox, scripts, listeners, context: createContext(sandbox)};
}

describe("Google Analytics", () => {
  it("keeps page-view notification safe outside the browser", () => {
    expect(() => notifyAnalyticsPageView()).not.toThrow();
    expect(normalizeAnalyticsPathname("/wardogs/ja/tools/map/?x=123&y=456#share", "/wardogs")).toBe("/ja/tools/map");
  });
  it.each(siteLocales)("tracks catalogue details for %s with and without a base path", (locale) => {
    for (const basePath of ["", "/wardogs"]) {
      const href = `https://www.wardogswiki.com${basePath}/${locale}/items/weapons/ak74/`;
      expect(googleAnalytics.getTrackedLinkEvent(href, "https://www.wardogswiki.com", {basePath})).toEqual({
        name: "catalogue_item_open",
        parameters: {item_slug: "ak74", item_type: "weapons", link_url: href}
      });
    }
  });

  it("does not track unsupported locales, list routes or external catalogue lookalikes", () => {
    for (const href of [
      "/xx/items/weapons/ak74",
      "/en/items/weapons",
      "/en/items/weapons/ak74/extra",
      "/enough/items/weapons/ak74",
      "https://external.example/en/items/weapons/ak74"
    ]) {
      expect(googleAnalytics.getTrackedLinkEvent(href, "https://www.wardogswiki.com")).toBeNull();
    }
  });

  it("uses the installable Google tag ID for the loader and config script", () => {
    expect(GOOGLE_TAG_ID).toBe("G-0GJ404WEYV");

    expect(googleAnalyticsScriptSrc()).toBe("https://www.googletagmanager.com/gtag/js?id=G-0GJ404WEYV");
    expect(googleAnalyticsConfigScript()).toContain("gtag('config', 'G-0GJ404WEYV')");
  });

  it("preserves queued consent and events with sanitized URL context and automatic page views", () => {
    const pending = [
      ["consent", "default", {analytics_storage: "denied"}],
      ["event", "catalogue_filter", {filter_value: "assault-rifle"}]
    ];
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com", pending);
    runInContext(googleAnalyticsConfigScript(), context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands[0]).toEqual(pending[0]);
    expect(commands[2]).toEqual(["config", GOOGLE_TAG_ID, {page_location: "https://www.wardogswiki.com/en", page_referrer: ""}]);
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "js", "config", "event"]);
    expect(commands.at(-1)).toEqual(["event", "catalogue_filter", {filter_value: "assault-rifle", page_location: "https://www.wardogswiki.com/en", page_referrer: ""}]);
    expect(commands.filter((entry) => entry[1] === "page_view")).toEqual([]);
    expect(Object.prototype.toString.call((sandbox.dataLayer as unknown[]).at(-1))).toBe("[object Arguments]");
  });

  it("initializes before early events without moving an event across a consent change", () => {
    const denied = ["consent", "default", {analytics_storage: "denied"}];
    const granted = ["consent", "update", {analytics_storage: "granted"}];
    const defaults = ["set", {currency: "USD"}];
    const {sandbox, context, scripts} = analyticsSandbox("www.wardogswiki.com", [
      denied, defaults,
      ["event", "ad_status", {status: "queued", placement: "native"}],
      granted,
      ["event", "ad_status", {status: "script_loaded", placement: "native"}]
    ], "?utm_source=discord&private=example#hidden");
    (sandbox.document as {referrer: string}).referrer = "https://source.example/story?private=example#hidden";
    const originalLayer = sandbox.dataLayer;
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext(googleAnalyticsConfigScript(), context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(sandbox.dataLayer).toBe(originalLayer);
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "set", "js", "config", "event", "consent", "event"]);
    expect(commands[0]).toEqual(denied);
    expect(commands[1]).toEqual(defaults);
    expect(commands[5]).toEqual(granted);
    expect(commands[4][2]).toMatchObject({status: "queued"});
    expect(commands[6][2]).toMatchObject({status: "script_loaded"});
    for (const entry of commands.filter((entry) => entry[0] === "config" || entry[0] === "event")) {
      expect(entry[2]).toMatchObject({page_location: "https://www.wardogswiki.com/en?utm_source=discord", page_referrer: "https://source.example/story"});
    }
    expect(scripts).toHaveLength(1);
    expect(commands.filter((entry) => entry[0] === "config")).toHaveLength(1);
  });

  it("retains argument-style early commands and their event order", () => {
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com");
    runInContext("window.gtag = function () { window.dataLayer.push(arguments); }; gtag('consent', 'default', {analytics_storage: 'denied'}); gtag('event', 'ad_status', {status:'queued'}); gtag('event', 'tool_start', {tool:'map'});", context);
    runInContext(googleAnalyticsConfigScript(), context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "js", "config", "event", "event"]);
    expect(commands.filter((entry) => entry[0] === "event").map((entry) => entry[1])).toEqual(["ad_status", "tool_start"]);
    expect((sandbox.dataLayer as ArrayLike<unknown>[]).filter((entry) => entry[0] === "event").every((entry) => Object.prototype.toString.call(entry) === "[object Arguments]")).toBe(true);
  });

  it("defaults only Google advertising uses to denied before initialization and queued events", () => {
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com", [["event", "ad_status", {status: "queued"}]]);
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext(googleAnalyticsConfigScript(), context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "js", "config", "event"]);
    expect(commands[0]).toEqual(["consent", "default", {ad_user_data: "denied", ad_personalization: "denied"}]);
    expect(Object.prototype.toString.call((sandbox.dataLayer as unknown[])[0])).toBe("[object Arguments]");
    expect(JSON.stringify(commands[0])).not.toMatch(/analytics_storage|ad_storage|granted/);
    runInContext("gtag('consent', 'update', {ad_user_data:'granted', ad_personalization:'granted'})", context);
    expect(Array.from((sandbox.dataLayer as ArrayLike<unknown>[]).at(-1)!)).toEqual([
      "consent", "update", {ad_user_data: "granted", ad_personalization: "granted"}
    ]);
  });

  it.each([
    ["default", {ad_user_data: "granted", ad_personalization: "granted"}],
    ["default", {analytics_storage: "denied", region: ["DE", "FR"]}],
    ["default", {ad_user_data: "denied"}],
    ["update", {ad_user_data: "granted"}]
  ])("does not supplement or override an existing %s consent chain", (kind, choice) => {
    const consent = ["consent", kind, choice];
    const before = ["event", "tool_start", {tool: "map"}];
    const after = ["event", "tool_action", {action: "open"}];
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com", [before, consent, after]);
    runInContext(googleAnalyticsConfigScript(), context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.map((entry) => entry[0])).toEqual(["js", "config", "event", "consent", "event"]);
    expect(commands.filter((entry) => entry[0] === "consent")).toEqual([consent]);
    expect(commands[2][1]).toBe("tool_start");
    expect(commands[4][1]).toBe("tool_action");
  });

  it.each(["localhost", "127.0.0.1", "wardogs.pages.dev", "preview.wardogswiki.com", "wardogswiki.com.evil.example"])("does not configure or load production Analytics on %s", (hostname) => {
    const {sandbox, scripts, context} = analyticsSandbox(hostname);
    runInContext(googleAnalyticsConfigScript(), context);
    expect(sandbox.dataLayer).toEqual([]);
    expect(scripts).toEqual([]);
  });

  it.each(["wardogswiki.com", "www.wardogswiki.com"])("configures and loads Analytics once on %s", (hostname) => {
    const {sandbox, scripts, context} = analyticsSandbox(hostname);
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext(googleAnalyticsConfigScript(), context);
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toMatchObject({src: "https://www.googletagmanager.com/gtag/js?id=G-0GJ404WEYV", async: true});
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "js", "config"]);
    expect(commands.at(-1)).toEqual(["config", "G-0GJ404WEYV", {page_location: `https://${hostname}/en`, page_referrer: ""}]);
  });

  it("strips user state before initial config, queued and subsequent events, retaining bounded attribution", () => {
    const search = "?fitQuery=private%40example.test&cash=9283&wd_share=equipment-compatibility&utm_source=discord&utm_medium=community#custom-label";
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com", [["event", "engaged_tool", {tool: "equipment-compatibility"}]], search);
    (sandbox.document as {referrer: string}).referrer = "https://source.example/story?email=private%40example.test#secret";
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext("gtag('event', 'tool_action', {action: 'share', page_location: window.location.href})", context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    for (const command of commands.filter((entry) => entry[0] === "config" || entry[0] === "event")) {
      expect(command[2]).toMatchObject({page_location: "https://www.wardogswiki.com/en?utm_source=discord&utm_medium=community", page_referrer: "https://source.example/story"});
    }
    expect(JSON.stringify(commands)).not.toMatch(/private|fitQuery|cash|wd_share|custom-label|secret|9283/);
    expect(String(sandbox.location)).toContain("fitQuery=");
    expect(JSON.stringify(commands)).not.toMatch(/send_page_view|session_id|session_number/);
  });

  it("updates context before history observers without adding manual page views or changing history", () => {
    const {sandbox, context, listeners} = analyticsSandbox("www.wardogswiki.com");
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext("history.pushState(null, '', '/ja/tools/ammo-matcher?fitQuery=private%40example.test&utm_source=moddb'); history.replaceState(null, '', '/ja/tools/ammo-matcher?fitQuery=changed')", context);
    runInContext("gtag('event', 'engaged_tool', {tool: 'equipment-compatibility'})", context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.filter((entry) => entry[0] === "config")).toEqual([
      ["config", GOOGLE_TAG_ID, {page_location: "https://www.wardogswiki.com/en", page_referrer: ""}],
      ["config", GOOGLE_TAG_ID, {update: true, page_location: "https://www.wardogswiki.com/ja/tools/ammo-matcher?utm_source=moddb", page_referrer: "https://www.wardogswiki.com/en"}],
      ["config", GOOGLE_TAG_ID, {update: true, page_location: "https://www.wardogswiki.com/ja/tools/ammo-matcher", page_referrer: "https://www.wardogswiki.com/en"}],
    ]);
    expect(commands.some((entry) => entry[1] === "page_view")).toBe(false);
    expect(String(sandbox.location)).toContain("fitQuery=changed");
    sandbox.location = new URL("https://www.wardogswiki.com/en?query=private#secret");
    listeners.get("popstate")?.forEach((listener) => listener());
    const last = Array.from((sandbox.dataLayer as ArrayLike<unknown>[]).at(-1)!);
    expect(last[2]).toEqual({update: true, page_location: "https://www.wardogswiki.com/en", page_referrer: "https://www.wardogswiki.com/ja/tools/ammo-matcher"});
  });

  it("installs history cleaning before the tag and keeps real share URLs intact across repeated bootstraps", () => {
    const pending = {event: "gtm.historyChange-v2", "gtm.oldUrl": "https://source.example/?secret=old", "gtm.newUrl": "https://www.wardogswiki.com/en?secret=new#label"};
    const {sandbox, scripts, context} = analyticsSandbox("www.wardogswiki.com", [pending], "?private=share#label");
    runInContext(googleAnalyticsConfigScript(), context);
    runInContext("var prior = dataLayer.push; dataLayer.push = function () { return prior.apply(this, arguments); }; history.pushState({__NA:true}, '', '/ja?private=share#label'); dataLayer.push({event:'gtm.historyChange-v2', 'gtm.oldUrl':'https://www.wardogswiki.com/en?private=share#label', 'gtm.newUrl':window.location.href, 'gtm.newUrlFragment':'label'})", context);
    runInContext(googleAnalyticsConfigScript(), context);
    const layer = sandbox.dataLayer as unknown[];
    expect(layer[0]).toEqual({event: "gtm.historyChange-v2", "gtm.oldUrl": "https://source.example/", "gtm.newUrl": "https://www.wardogswiki.com/en"});
    expect(layer.at(-1)).toEqual({event: "gtm.historyChange-v2", "gtm.oldUrl": "https://www.wardogswiki.com/en", "gtm.newUrl": "https://www.wardogswiki.com/ja", "gtm.newUrlFragment": ""});
    expect(String(sandbox.location)).toBe("https://www.wardogswiki.com/ja?private=share#label");
    expect(scripts).toHaveLength(1);
  });

  it("rejects duplicate, oversized and PII-like attribution while keeping valid campaign and click IDs", () => {
    expect(sanitizeAnalyticsUrl("https://example.test/en?utm_source=discord&utm_campaign=tools-oct-08&gclid=Ab_123-xy&fitQuery=private#label"))
      .toBe("https://example.test/en?utm_source=discord&utm_campaign=tools-oct-08&gclid=Ab_123-xy");
    for (const query of ["utm_source=person%40example.test", "utm_source=one&utm_source=two", "utm_term=free+text", `gclid=${"x".repeat(201)}`, "utm_campaign=%2570rivate%2540example.test"]) {
      expect(sanitizeAnalyticsUrl(`https://example.test/en?${query}`)).toBe("https://example.test/en");
    }
    expect(sanitizeAnalyticsUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeAnalyticsUrl("not a URL")).toBe("");
  });

  it("leaves page context unchanged when a history URL cannot be parsed", () => {
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com");
    runInContext(googleAnalyticsConfigScript(), context);
    const count = (sandbox.dataLayer as unknown[]).length;
    expect(() => runInContext("history.pushState(null, '', 'https://[')", context)).toThrow();
    expect((sandbox.dataLayer as unknown[]).length).toBe(count);
    expect(String(sandbox.location)).toBe("https://www.wardogswiki.com/en");
  });

  it("preserves the native history error and rolls back context without a fictional referrer", () => {
    const {sandbox, context} = analyticsSandbox("www.wardogswiki.com", [], "?fitQuery=private");
    (sandbox.document as {referrer: string}).referrer = "https://source.example/story?name=private";
    (sandbox.history as {pushState: () => void}).pushState = () => { throw new Error("DataCloneError"); };
    runInContext(googleAnalyticsConfigScript(), context);
    expect(() => runInContext("history.pushState({}, '', '/ja?fitQuery=private')", context)).toThrow("DataCloneError");
    runInContext("gtag('event', 'engaged_tool', {tool: 'ammo-matcher'})", context);
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.at(-1)?.[2]).toMatchObject({page_location: "https://www.wardogswiki.com/en", page_referrer: "https://source.example/story"});
    const before = commands.length;
    expect(() => runInContext("history.pushState(null, '', 'https://other.example/private')", context)).toThrow("DataCloneError");
    expect((sandbox.dataLayer as unknown[]).length).toBe(before);
    expect(commands.some((entry) => entry[1] === "page_view")).toBe(false);
  });

  it("forwards a custom event once when gtag is available, without a second queued copy", () => {
    const target = {gtag: vi.fn(), dataLayer: []};
    googleAnalytics.trackAnalyticsEvent("catalogue_filter", {filter_value: "assault-rifle"}, target);
    expect(target.gtag).toHaveBeenCalledExactlyOnceWith("event", "catalogue_filter", {
      filter_value: "assault-rifle"
    });
    expect(target.dataLayer).toEqual([]);
  });

  it("builds stable custom event commands and scroll-depth checks", () => {
    const analytics = googleAnalytics as typeof googleAnalytics & {
      createAnalyticsEventCommand?: (name: string, parameters: Record<string, string>) => unknown;
      hasReachedScrollDepth?: (scrollY: number, viewportHeight: number, documentHeight: number, threshold: number) => boolean;
      trackAnalyticsEvent?: (name: string, parameters: Record<string, string>, target: {dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void}) => void;
      getTrackedLinkEvent?: (
        href: string,
        currentOrigin: string,
        options?: {basePath?: string; officialDestination?: string}
      ) => {name: string; parameters: Record<string, string>} | null;
    };

    expect(analytics.createAnalyticsEventCommand).toBeTypeOf("function");
    expect(analytics.createAnalyticsEventCommand?.("video_start", {video_id: "abc"})).toEqual([
      "event",
      "video_start",
      {video_id: "abc"}
    ]);
    expect(analytics.hasReachedScrollDepth?.(500, 500, 1_300, 0.75)).toBe(true);
    expect(analytics.hasReachedScrollDepth?.(100, 500, 1_300, 0.75)).toBe(false);

    const target: {dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void} = {};
    analytics.trackAnalyticsEvent?.("language_switch", {to_locale: "ru"}, target);
    expect(target.dataLayer).toEqual([["event", "language_switch", {to_locale: "ru"}]]);

    expect(analytics.getTrackedLinkEvent?.(
      "https://store.steampowered.com/app/1867240/WARDOGS/",
      "https://www.wardogswiki.com"
    )).toEqual({
      name: "official_outbound_click",
      parameters: {destination: "steam", link_url: "https://store.steampowered.com/app/1867240/WARDOGS/"}
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://www.wardogswiki.com/en/items/weapons/m4",
      "https://www.wardogswiki.com"
    )).toEqual({
      name: "catalogue_item_open",
      parameters: {item_slug: "m4", item_type: "weapons", link_url: "https://www.wardogswiki.com/en/items/weapons/m4"}
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://www.wardogswiki.com/zh-cn/items/weapons/m4",
      "https://www.wardogswiki.com"
    )).toEqual({
      name: "catalogue_item_open",
      parameters: {item_slug: "m4", item_type: "weapons", link_url: "https://www.wardogswiki.com/zh-cn/items/weapons/m4"}
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://steamcommunity.com/app/1867240/announcements/",
      "https://www.wardogswiki.com"
    )).toEqual({
      name: "official_outbound_click",
      parameters: {
        destination: "steam_community",
        link_url: "https://steamcommunity.com/app/1867240/announcements/"
      }
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://www.wardogswiki.com/wardogs/en/items/weapons/ak74/",
      "https://www.wardogswiki.com",
      {basePath: "/wardogs"}
    )).toEqual({
      name: "catalogue_item_open",
      parameters: {
        item_slug: "ak74",
        item_type: "weapons",
        link_url: "https://www.wardogswiki.com/wardogs/en/items/weapons/ak74/"
      }
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://official.example.com/wardogs-update",
      "https://www.wardogswiki.com",
      {officialDestination: "official_source"}
    )).toEqual({
      name: "official_outbound_click",
      parameters: {
        destination: "official_source",
        link_url: "https://official.example.com/wardogs-update"
      }
    });
    expect(analytics.getTrackedLinkEvent?.(
      "https://arkgleamfox.com/example",
      "https://www.wardogswiki.com"
    )).toBeNull();
  });
});
