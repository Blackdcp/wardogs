import {describe, expect, it, vi} from "vitest";
import {installAnalyticsHistoryPrivacy} from "../../src/lib/analytics-history";
import {sanitizeAnalyticsUrl} from "../../src/lib/analytics-page-context";

function historyEvent() {
  return {
    event: "gtm.historyChange-v2",
    "gtm.historyChangeSource": "pushState",
    "gtm.oldUrl": "https://www.wardogswiki.com/en?private=old&utm_source=discord#old-label",
    "gtm.newUrl": "https://www.wardogswiki.com/en/items/weapons?private=new&utm_source=discord#new-label",
    "gtm.oldUrlFragment": "old-label",
    "gtm.newUrlFragment": "new-label",
    "gtm.uniqueEventId": 42,
    "gtm.newHistoryState": {__NA: true, tree: ["private-tree-state"]}
  };
}

describe("Google history URL privacy adapter", () => {
  it("cleans queued history fields without changing the caller's event or history state", () => {
    const event = historyEvent();
    const layer = [event];
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    expect(layer[0]).toEqual({...event,
      "gtm.oldUrl": "https://www.wardogswiki.com/en",
      "gtm.newUrl": "https://www.wardogswiki.com/en/items/weapons?utm_source=discord",
      "gtm.oldUrlFragment": "", "gtm.newUrlFragment": ""
    });
    expect(layer[0]).not.toBe(event);
    expect(layer[0]["gtm.newHistoryState"]).toBe(event["gtm.newHistoryState"]);
    expect(event["gtm.newUrl"]).toContain("private=new");
    expect(event["gtm.newUrlFragment"]).toBe("new-label");
  });

  it("sanitizes before a rebound vendor push reads events, with no recursion or lost event ID", () => {
    const layer: unknown[] = [];
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    const oldPush = layer.push;
    const vendor = vi.fn(function (this: unknown, ...messages: unknown[]) {
      const event = messages[0] as Record<string, unknown>;
      expect(event["gtm.oldUrl"]).toBe("https://www.wardogswiki.com/en");
      const count = Reflect.apply(oldPush, this, messages);
      event["gtm.uniqueEventId"] = 77;
      return count;
    });
    layer.push = vendor;
    expect(layer.push(historyEvent())).toBe(1);
    expect(vendor).toHaveBeenCalledTimes(1);
    expect(layer).toHaveLength(1);
    expect(layer[0]).toMatchObject({event: "gtm.historyChange-v2", "gtm.uniqueEventId": 77});
  });

  it("preserves this, all push arguments and the delegate's return value", () => {
    const layer: unknown[] = [];
    const receiver: unknown[] = [];
    const delegate = vi.fn(function (this: unknown, ...messages: unknown[]) {
      expect(this).toBe(receiver);
      expect(messages).toHaveLength(2);
      return 731;
    });
    layer.push = delegate;
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    expect(layer.push.call(receiver, historyEvent(), {event: "custom"})).toBe(731);
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it("keeps consent/custom messages and clean history objects unchanged and does not double wrap", () => {
    const consent = ["consent", "default", {analytics_storage: "denied"}];
    const custom = {event: "custom", value: "unchanged"};
    const clean = {event: "gtm.historyChange", "gtm.oldUrl": "https://www.wardogswiki.com/en", "gtm.newUrl": "https://www.wardogswiki.com/ja", "gtm.newUrlFragment": ""};
    const layer: unknown[] = [consent, custom, clean];
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    const push = layer.push;
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    expect(layer.push).toBe(push);
    expect(layer.push(consent, custom, clean)).toBe(6);
    expect(layer).toEqual([consent, custom, clean, consent, custom, clean]);
    for (let index = 0; index < 3; index++) expect(layer[index]).toBe(layer[index + 3]);
  });

  it("supports legacy history names and optional eventModel URL fields with the same attribution policy", () => {
    const original = {...historyEvent(), event: "gtm.historyChange", eventModel: {
      page_location: "https://www.wardogswiki.com/ja?utm_source=discord&fitQuery=secret#share",
      page_referrer: "https://source.example/story?utm_source=old&private=value#secret",
      send_to: "G-0GJ404WEYV", other: "retained"
    }};
    const layer: unknown[] = [];
    installAnalyticsHistoryPrivacy(layer, sanitizeAnalyticsUrl);
    layer.push(original);
    expect(layer[0]).toMatchObject({event: "gtm.historyChange", eventModel: {
      page_location: "https://www.wardogswiki.com/ja?utm_source=discord",
      page_referrer: "https://source.example/story", send_to: "G-0GJ404WEYV", other: "retained"
    }});
    expect(original.eventModel.page_location).toContain("fitQuery=secret");
  });
});
