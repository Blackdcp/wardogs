import {createContext, runInContext} from "node:vm";
import {describe, expect, it, vi} from "vitest";
import {
  GOOGLE_TAG_ID,
  googleAnalyticsConfigScript,
  googleAnalyticsScriptSrc
} from "../../src/components/seo/google-analytics";
import * as googleAnalytics from "../../src/components/seo/google-analytics";
import {siteLocales} from "../../src/config/site";

describe("Google Analytics", () => {
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

  it("preserves queued consent and events without overriding page or session fields", () => {
    const pending = [
      ["consent", "default", {analytics_storage: "denied"}],
      ["event", "catalogue_filter", {filter_value: "assault-rifle"}]
    ];
    const sandbox = {dataLayer: [...pending]} as Record<string, unknown>;
    sandbox.window = sandbox;
    runInContext(googleAnalyticsConfigScript(), createContext(sandbox));
    const commands = (sandbox.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.slice(0, 2)).toEqual(pending);
    expect(commands.map((entry) => entry[0])).toEqual(["consent", "event", "js", "config"]);
    expect(commands.at(-1)).toEqual(["config", GOOGLE_TAG_ID]);
    expect(commands.filter((entry) => entry[1] === "page_view")).toEqual([]);
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
