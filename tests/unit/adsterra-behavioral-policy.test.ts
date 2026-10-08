import {describe, expect, it} from "vitest";
import {BEHAVIORAL_COHORT_KEY, BEHAVIORAL_VISITS_KEY, SOCIAL_BAR_LOAD_KEY, behavioralEligibility, behavioralNavigationTarget, canAttemptBehavioralLoad, claimBehavioralLoad, getBehavioralVariant, recordBehavioralContentVisit, variantForBucket} from "../../src/features/ads/behavioral-ad-policy";

function store(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => {values.set(key, value);}};
}
const engaged = {
  production: true, pathname: "/en/guides/wardogs-gameplay", variant: "social-bar" as const,
  enabled: true, verified: true, contentVisits: 2, viewportWidth: 1440,
  foregroundMs: 30_000, scrollDepth: 0.5, pageHidden: false, modalOpen: false, protectedTool: false
};

describe("behavioral ad eligibility and persistent assignment", () => {
  it("allocates exact 10/5/85 percent cohorts and retains the first assignment", () => {
    const counts = {"social-bar": 0, popunder: 0, control: 0};
    for (let bucket = 0; bucket < 10_000; bucket++) counts[variantForBucket(bucket)]++;
    expect(counts).toEqual({"social-bar": 1000, popunder: 500, control: 8500});
    const storage = store();
    expect(getBehavioralVariant(storage, () => 0.12)).toBe("popunder");
    expect(getBehavioralVariant(storage, () => 0.01)).toBe("popunder");
    expect(storage.getItem(BEHAVIORAL_COHORT_KEY)).toBe("1200");
  });

  it("fails closed for inaccessible, unwritable, or corrupt persistent assignment", () => {
    expect(getBehavioralVariant(null, () => 0)).toBeNull();
    expect(getBehavioralVariant({getItem: () => null, setItem: () => {}}, () => 0)).toBeNull();
    expect(getBehavioralVariant({getItem: () => {throw Error("unavailable");}, setItem: () => {}}, () => 0)).toBeNull();
    for (const value of ["-1", "10000", "1.5", "null", "01", ""]) expect(getBehavioralVariant(store({[BEHAVIORAL_COHORT_KEY]: value}), () => 0)).toBeNull();
    for (const value of [NaN, Infinity, -1, 1]) expect(getBehavioralVariant(store(), () => value)).toBeNull();
  });

  it("requires a second distinct content page, not a refresh or hub navigation", () => {
    const storage = store();
    expect(recordBehavioralContentVisit(storage, "/en/guides/wardogs-gameplay")).toBe(1);
    expect(recordBehavioralContentVisit(storage, "/en/guides/wardogs-gameplay/")).toBe(1);
    expect(recordBehavioralContentVisit(storage, "/en/tools/map")).toBeNull();
    expect(recordBehavioralContentVisit(storage, "/en/items/weapons/amp-9")).toBe(2);
    expect(recordBehavioralContentVisit(storage, "/en/videos/wardogs-first-look")).toBe(2);
    expect(JSON.parse(storage.getItem(BEHAVIORAL_VISITS_KEY)!)).toHaveLength(2);
    for (const value of ["{}", "not-json", '["/en/tools/map"]', "[1]", '["/en/guides/a","/en/guides/b","/en/guides/c"]']) expect(recordBehavioralContentVisit(store({[BEHAVIORAL_VISITS_KEY]: value}), engaged.pathname)).toBeNull();
  });

  it("requires every independent serving gate", () => {
    expect(behavioralEligibility(engaged)).toBeNull();
    for (const change of [
      {production: false}, {pathname: "/en/tools/map"}, {enabled: false}, {verified: false},
      {variant: "control" as const}, {variant: null}, {contentVisits: null}, {contentVisits: 1},
      {viewportWidth: 1023}, {protectedTool: true}, {foregroundMs: 29_999},
      {scrollDepth: 0.499}, {pageHidden: true}, {modalOpen: true}, {scrollDepth: NaN}, {foregroundMs: Infinity}
    ]) expect(behavioralEligibility({...engaged, ...change})).not.toBeNull();
  });

  it("claims one 24-hour script-load lease without treating it as an impression", () => {
    const storage = store();
    const now = Date.UTC(2026, 9, 8, 12);
    expect(claimBehavioralLoad(storage, SOCIAL_BAR_LOAD_KEY, now)).toBe(true);
    expect(claimBehavioralLoad(storage, SOCIAL_BAR_LOAD_KEY, now + 1)).toBe(false);
    expect(claimBehavioralLoad(storage, SOCIAL_BAR_LOAD_KEY, now + 86_399_999)).toBe(false);
    expect(claimBehavioralLoad(storage, SOCIAL_BAR_LOAD_KEY, now + 86_400_000)).toBe(true);
    expect(claimBehavioralLoad(null, SOCIAL_BAR_LOAD_KEY, now)).toBe(false);
    expect(claimBehavioralLoad({getItem: () => null, setItem: () => {}}, SOCIAL_BAR_LOAD_KEY, now)).toBe(false);
    for (const value of ["", "0", "-1", "bad", "1.5", String(now + 1)]) expect(canAttemptBehavioralLoad(value, now)).toBe(false);
    expect(canAttemptBehavioralLoad(null, NaN)).toBe(false);
  });

  it("isolates real same-origin path changes while preserving anchors and external links", () => {
    const current = "https://www.wardogswiki.com/en/guides/wardogs-gameplay";
    expect(behavioralNavigationTarget(current, "/en/tools/map")).toBe("https://www.wardogswiki.com/en/tools/map");
    expect(behavioralNavigationTarget(current, "/ja/guides/wardogs-gameplay")).toBe("https://www.wardogswiki.com/ja/guides/wardogs-gameplay");
    for (const target of ["#crew", "?search=weapons", current, "https://store.steampowered.com/app/", "mailto:test@example.com", null, undefined]) expect(behavioralNavigationTarget(current, target)).toBeNull();
  });
});
