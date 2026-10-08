import {describe, expect, it, vi} from "vitest";
import {mountUniqueBanner, visitAdPage} from "../../src/features/ads/ad-inventory";
import type {AdStatus} from "../../src/features/ads/adsterra-banner";

// Exercise request-start and cancellation boundaries, rather than counting JSX.
function harness() {
  const document = {} as Document;
  const requests: string[] = [];
  const pending = new Map<string, (status: AdStatus) => void>();
  const cleanup = vi.fn();
  const mount = (name: string, starts = true, key = "rail160", path = "/en/tools/map") => {
    const suppressed = vi.fn();
    const stop = mountUniqueBanner(document, path, key, (report) => {
      pending.set(name, report);
      if (starts) { requests.push(name); report("request_started"); }
      return cleanup;
    }, suppressed);
    return {stop, suppressed};
  };
  return {document, requests, pending, cleanup, mount};
}

describe("display zone request ownership", () => {
  it("allows independent codes but never repeats one code on breakpoint round trips", () => {
    const h = harness();
    const tool = h.mount("tool");
    const duplicate = h.mount("simultaneous");
    expect(duplicate.suppressed).toHaveBeenLastCalledWith(true);
    tool.stop();
    const global = h.mount("global");
    global.stop();
    h.mount("tool-again");
    h.mount("rectangle", true, "rectangle300");
    expect(h.requests).toEqual(["tool", "rectangle"]);
  });

  it("hands off a canceled queued slot only if its vendor request has not started", () => {
    const h = harness();
    const first = h.mount("queued", false);
    const replacement = h.mount("replacement");
    expect(h.requests).toEqual([]);
    expect(replacement.suppressed).toHaveBeenLastCalledWith(true);
    first.stop();
    expect(replacement.suppressed).toHaveBeenLastCalledWith(false);
    expect(h.requests).toEqual(["replacement"]);
    replacement.stop();
    expect(h.cleanup).toHaveBeenCalledTimes(2);
  });

  it("removes canceled waiters and freezes ownership when a queued request starts", () => {
    const h = harness();
    const first = h.mount("queued", false);
    const canceled = h.mount("canceled");
    canceled.stop();
    const blocked = h.mount("blocked");
    h.pending.get("queued")!("request_started");
    expect(blocked.suppressed).toHaveBeenLastCalledWith(true);
    first.stop();
    expect(h.pending.has("canceled")).toBe(false);
    expect(h.pending.has("blocked")).toBe(false);
  });

  it("starts a new visit after navigation, including returning to a previous pathname", () => {
    const h = harness();
    h.mount("first").stop();
    visitAdPage(h.document, "/en/guides");
    h.mount("second", true, "rail160", "/en/guides").stop();
    h.mount("returned");
    expect(h.requests).toEqual(["first", "second", "returned"]);
  });
});
