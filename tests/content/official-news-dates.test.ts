import {describe, expect, it} from "vitest";
import {NEWS_UPDATES} from "../../src/features/news/news-data";

describe("official news timeline", () => {
  it("uses the announcement dates published by BULKHEAD", () => {
    const dates = Object.fromEntries(NEWS_UPDATES.map(({titleKey, date}) => [titleKey, date]));

    expect(dates.season02).toBe("2026-09-22");
    expect(dates.patch011).toBe("2026-09-12");
    expect(dates.preload).toBe("2026-09-09");
    expect(dates.steamPreorder).toBe("2026-08-11");
  });

  it("displays announcements newest first", () => {
    const dates = NEWS_UPDATES.map(({date}) => date);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
  });
});
