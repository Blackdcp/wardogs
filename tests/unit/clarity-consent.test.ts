import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {
  canStartClarity, clarityNeedsDocumentBoundary, CLARITY_CONSENT_KEY, CLARITY_CONSENT_TTL,
  CLARITY_SCRIPT_SRC, makeClarityPreference, parseClarityPreference, readClarityPreference
} from "../../src/features/analytics/clarity-consent";
import {getClarityController} from "../../src/features/analytics/clarity-runtime";

const origin = "https://www.wardogswiki.com";
const now = Date.UTC(2026, 9, 8, 12);

function memoryStore() {
  const values = new Map<string, string>();
  return {getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); }};
}

function browser({href = `${origin}/en`, referrer = "", choice, blocked = false}: {href?: string; referrer?: string; choice?: "allowed" | "denied"; blocked?: boolean} = {}) {
  const local = memoryStore(), session = memoryStore();
  if (choice) local.setItem(CLARITY_CONSENT_KEY, JSON.stringify(makeClarityPreference(choice)));
  const scripts: Array<Record<string, unknown>> = [];
  const queueAtInsert: unknown[] = [];
  const url = new URL(href);
  const location = Object.assign(url, {assign: vi.fn(), replace: vi.fn()});
  const document = Object.assign(new EventTarget(), {
    referrer,
    getElementById: (id: string) => scripts.find((script) => script.id === id) ?? (id === "public-section" ? {} : null),
    createElement: () => ({}),
    head: {appendChild: (script: Record<string, unknown>) => { scripts.push(script); queueAtInsert.push([...(view.clarity?.q ?? [])]); }}
  });
  const nativePush = vi.fn((data: unknown, _unused: string, next?: string | URL | null) => { history.state = data; if (next != null) location.href = new URL(next, location.href).href; });
  const history = {state: null as unknown, pushState: nativePush, replaceState: nativePush};
  const view = Object.assign(new EventTarget(), {
    document, location, history,
    localStorage: local, sessionStorage: session,
    clarity: undefined as undefined | (((...args: unknown[]) => void) & {q?: unknown[][]})
  });
  if (blocked) for (const key of ["localStorage", "sessionStorage"]) Object.defineProperty(view, key, {get: () => { throw new Error("SecurityError"); }});
  return {view: view as unknown as Window, raw: view, scripts, queueAtInsert, local, session, location, nativePush};
}

describe("Clarity privacy and consent policy", () => {
  it("requires explicit consent on exact production hosts and clean URL/referrer context", () => {
    for (const host of ["wardogswiki.com", "www.wardogswiki.com"]) {
      expect(canStartClarity({href: `https://${host}/ja/guides/wardogs-squad-guide`, referrer: "", choice: "allowed"})).toBe(true);
    }
    for (const host of ["localhost", "127.0.0.1", "preview.vercel.app", "www.wardogswiki.com.example", "evilwardogswiki.com"]) {
      expect(canStartClarity({href: `https://${host}/en`, referrer: "", choice: "allowed"})).toBe(false);
    }
    for (const choice of [null, "denied"] as const) expect(canStartClarity({href: `${origin}/en`, referrer: "", choice})).toBe(false);
    for (const suffix of ["?q=private", "#plan=private", "?utm_source=ads", "#unknown"]) {
      expect(canStartClarity({href: `${origin}/en${suffix}`, referrer: "", choice: "allowed"})).toBe(false);
      expect(canStartClarity({href: `${origin}/en`, referrer: `${origin}/en${suffix}`, choice: "allowed"})).toBe(false);
    }
  });

  it("keeps interactive/share tools outside replay across locales but allows hubs and content", () => {
    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]) {
      for (const path of ["tools/map", "tools/artillery-calculator", "tools/ammo-matcher", "tools/logistics-planner", "guides/wardogs-map"]) {
        expect(canStartClarity({href: `${origin}/${locale}/${path}`, referrer: "", choice: "allowed"})).toBe(false);
      }
      for (const path of ["tools", "items", "guides", "guides/wardogs-squad-guide", "videos/wardogs-first-look"]) {
        expect(canStartClarity({href: `${origin}/${locale}/${path}`, referrer: "", choice: "allowed"})).toBe(true);
      }
    }
  });

  it("expires choices at 180 days and rejects malformed, future, altered-duration or old-version records", () => {
    const valid = makeClarityPreference("allowed", now);
    expect(parseClarityPreference(JSON.stringify(valid), now + CLARITY_CONSENT_TTL - 1)).toEqual(valid);
    expect(parseClarityPreference(JSON.stringify(valid), now + CLARITY_CONSENT_TTL)).toBeNull();
    for (const item of [{...valid, version: 0}, {...valid, choice: "yes"}, {...valid, savedAt: now + 1}, {...valid, expiresAt: now + 1}, {...valid, savedAt: "0"}]) {
      expect(parseClarityPreference(JSON.stringify(item), now)).toBeNull();
    }
    expect(parseClarityPreference("{broken", now)).toBeNull();
    expect(readClarityPreference([{getItem: () => { throw new Error("SecurityError"); }, setItem: () => {}}], now)).toBeNull();
  });

  it("preserves normal SPA and public section anchors but isolates share/query transitions", () => {
    const current = `${origin}/en/guides/wardogs-squad-guide`;
    expect(clarityNeedsDocumentBoundary(current, "/ja/guides/wardogs-squad-guide")).toBe(false);
    expect(clarityNeedsDocumentBoundary(current, "#public-section", (id) => id === "public-section")).toBe(false);
    for (const next of ["#plan=private", "#unknown", "#bad%E0", "?q=private", "/en/tools/map", "/en/tools/map#plan=private"]) expect(clarityNeedsDocumentBoundary(current, next)).toBe(true);
    expect(clarityNeedsDocumentBoundary(current, "https://other.example/?query=x")).toBe(false);
    expect(clarityNeedsDocumentBoundary(current, "https://[")).toBe(false);
  });
});

describe("document-owned Clarity runtime", () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(now); });
  afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

  it("does not load before allow, queues analytics-only consent before one async request and deduplicates mounts", () => {
    const fixture = browser();
    const controller = getClarityController(fixture.view);
    expect(fixture.scripts).toHaveLength(0);
    controller.choose("denied");
    expect(fixture.scripts).toHaveLength(0);
    controller.choose("allowed");
    expect(fixture.scripts).toEqual([{id: "wardogs-microsoft-clarity", async: true, referrerPolicy: "no-referrer", src: CLARITY_SCRIPT_SRC}]);
    expect(fixture.queueAtInsert).toEqual([[["consentv2", {analytics_Storage: "granted", ad_Storage: "denied"}]]]);
    expect(getClarityController(fixture.view)).toBe(controller);
    controller.choose("allowed");
    expect(fixture.scripts).toHaveLength(1);
  });

  it("honors stored consent, revokes with denied plus stop and a real document boundary", () => {
    const fixture = browser({choice: "allowed"});
    const controller = getClarityController(fixture.view);
    expect(fixture.scripts).toHaveLength(1);
    controller.choose("denied");
    expect(fixture.raw.clarity?.q?.slice(-2)).toEqual([["consentv2", {analytics_Storage: "denied", ad_Storage: "denied"}], ["stop"]]);
    expect(fixture.location.replace).toHaveBeenCalledExactlyOnceWith(`${origin}/en`);
    expect(parseClarityPreference(fixture.local.getItem(CLARITY_CONSENT_KEY))?.choice).toBe("denied");
  });

  it("retains a choice for this document when both storage APIs throw", () => {
    const fixture = browser({blocked: true});
    const controller = getClarityController(fixture.view);
    expect(() => controller.choose("allowed")).not.toThrow();
    expect(getClarityController(fixture.view).getChoice()).toBe("allowed");
    expect(fixture.scripts).toHaveLength(1);
    expect(() => controller.choose("denied")).not.toThrow();
    expect(controller.getChoice()).toBe("denied");
  });

  it("does not resurrect a stale Allow after denied writes and removals fail", () => {
    const fixture = browser({choice: "allowed"});
    const controller = getClarityController(fixture.view);
    for (const store of [fixture.local, fixture.session]) {
      store.setItem = () => { throw new Error("QuotaExceededError"); };
      store.removeItem = () => { throw new Error("SecurityError"); };
    }
    controller.choose("denied");
    expect(fixture.location.replace).toHaveBeenCalledTimes(1);
    const reloaded = browser({choice: "allowed"});
    reloaded.raw.history.state = fixture.raw.history.state;
    expect(getClarityController(reloaded.view).getChoice()).toBe("denied");
    expect(reloaded.scripts).toHaveLength(0);
  });

  it("never starts later in an initially private document or on previews even after Allow", () => {
    for (const context of [{href: `${origin}/en?q=private`}, {href: `${origin}/en/tools/map`}, {referrer: `${origin}/en/tools/map#private`}, {href: "https://preview.vercel.app/en"}]) {
      const fixture = browser(context);
      const controller = getClarityController(fixture.view);
      fixture.location.href = `${origin}/en/guides`;
      controller.choose("allowed");
      expect(fixture.scripts).toHaveLength(0);
    }
  });

  it("changes clean routes normally, keeps public anchors, and avoids pushing private URLs into vendor history", () => {
    const fixture = browser({choice: "allowed"});
    getClarityController(fixture.view);
    fixture.view.history.pushState(null, "", "/ja/guides");
    expect(fixture.nativePush).toHaveBeenCalledTimes(1);
    fixture.view.history.pushState(null, "", "#public-section");
    expect(fixture.nativePush).toHaveBeenCalledTimes(2);
    fixture.view.history.replaceState(null, "", "/ja/tools/map#plan=private");
    expect(fixture.nativePush).toHaveBeenCalledTimes(2);
    expect(fixture.location.replace).toHaveBeenCalledWith(`${origin}/ja/tools/map#plan=private`);
    expect(fixture.location.href).toBe(`${origin}/ja/guides#public-section`);
  });

  it("revokes on cross-tab removal instead of restoring stale session consent", () => {
    const fixture = browser({choice: "allowed"});
    const controller = getClarityController(fixture.view);
    fixture.session.setItem(CLARITY_CONSENT_KEY, JSON.stringify(makeClarityPreference("allowed")));
    fixture.raw.dispatchEvent(Object.assign(new Event("storage"), {key: CLARITY_CONSENT_KEY, newValue: null}));
    expect(controller.getChoice()).toBeNull();
    expect(fixture.session.getItem(CLARITY_CONSENT_KEY)).toBeNull();
    expect(fixture.location.replace).toHaveBeenCalledTimes(1);
  });

  it("expires an open document and revalidates a restored back-forward cache document", () => {
    const expiry = browser({choice: "allowed"});
    const controller = getClarityController(expiry.view);
    vi.advanceTimersByTime(CLARITY_CONSENT_TTL);
    expect(controller.getChoice()).toBeNull();
    expect(expiry.location.replace).toHaveBeenCalledTimes(1);
    const restored = browser({choice: "allowed"});
    getClarityController(restored.view);
    restored.raw.dispatchEvent(Object.assign(new Event("pageshow"), {persisted: true}));
    expect(restored.location.replace).toHaveBeenCalledTimes(1);
    restored.raw.dispatchEvent(Object.assign(new Event("pageshow"), {persisted: true}));
    expect(restored.location.replace).toHaveBeenCalledTimes(2);
  });
});
