import {describe, expect, it} from "vitest";
import {buildAdRevenueReport} from "../../scripts/report-ad-monetization.mjs";

const now = Date.parse("2026-10-08T00:00:00Z");
const snapshot = () => ({domain: "wardogswiki.com", currency: "USD", timezone: "UTC", daily: [
  {date: "2026-10-06", impressions: 1000, revenue: 1, completeUtcDay: true},
  {date: "2026-10-07", impressions: 3000, revenue: 1.5, completeUtcDay: true}
]});

describe("ad revenue accounting boundaries", () => {
  it("weights CPM by impressions and leaves missing session revenue unavailable", () => {
    const result = buildAdRevenueReport(snapshot(), now);
    expect(result.totals.weightedCpm).toBe(.625);
    expect(result.totals.sessionRpm).toBeNull();
    expect(result.interpretation.revenueAttribution).toBe("site_total_only_shared_zones");
  });
  it("excludes current UTC dates and rows explicitly marked incomplete", () => {
    const data = snapshot();
    data.daily[0].completeUtcDay = false;
    expect(buildAdRevenueReport(data, Date.parse("2026-10-07T18:00:00Z")).daily).toEqual([]);
  });
  it("accepts only exact UTC windows and all measured session denominators", () => {
    const data = {...snapshot(), sessionsByUtcDate: {
      "2026-10-06": {windowStart: "2026-10-06T00:00:00.000Z", windowEnd: "2026-10-07T00:00:00.000Z", scope: "all_measured_sessions", hostname: "www.wardogswiki.com", sessions: 500}
    }};
    expect(buildAdRevenueReport(data, now).daily[0].sessionRpm).toBe(2);
    expect(buildAdRevenueReport(data, now).totals.sessionRpm).toBeNull();
    data.sessionsByUtcDate["2026-10-06"].windowStart = "2026-10-05T16:00:00.000Z";
    expect(() => buildAdRevenueReport(data, now)).toThrow("Unaligned");
  });
  it.each(["domain", "currency", "timezone"])("rejects a mismatched %s", (field) => {
    expect(() => buildAdRevenueReport({...snapshot(), [field]: "wrong"}, now)).toThrow("wardogswiki.com");
  });
  it("rejects duplicate dates, negative amounts and invalid dates", () => {
    const data = snapshot();
    data.daily.push(data.daily[0]);
    expect(() => buildAdRevenueReport(data, now)).toThrow("Duplicate");
    data.daily.pop(); data.daily[0].revenue = -1;
    expect(() => buildAdRevenueReport(data, now)).toThrow("revenue");
    data.daily[0].date = "2026-02-30";
    expect(() => buildAdRevenueReport(data, now)).toThrow("Invalid UTC date");
  });
});
