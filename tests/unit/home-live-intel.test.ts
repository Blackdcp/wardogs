import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";

import * as intel from "../../src/features/home/home-live-intel";

const candidate = {
  id: "archive", href: "/guides/wardogs-patch-notes", kind: "patch" as const,
  titleKey: "news.timeline.items.patch012.title", verifiedAt: "2026-09-30", build: "0.1.2",
  current: false, sourceClass: "official" as const, sourceUrl: "https://store.steampowered.com/news/app/1867240/view/712287592723252267"
};

describe("home live intel evidence", () => {
  it("sorts explicit current evidence before dated archives and caps the result at three", () => {
    const result = intel.resolveHomeLiveIntel([
      {...candidate, id: "b", href: "/guides/b"},
      {...candidate, id: "current", href: "/guides/current", current: true, verifiedAt: "2026-09-20"},
      {...candidate, id: "a", href: "/guides/a"},
      {...candidate, id: "older", href: "/guides/older", verifiedAt: "2026-09-10"}
    ]);
    expect(result.map((entry) => entry.id)).toEqual(["current", "a", "b"]);
  });

  it("never upgrades a dated Season 1 record to current evidence", () => {
    const result = intel.resolveHomeLiveIntel([{...candidate, build: "Season 1", verifiedAt: "2026-09-09"}]);
    expect(result[0]).toMatchObject({current: false, build: "Season 1", verifiedAt: "2026-09-09"});
  });

  it("rejects absent sources, malformed dates and records without explicit evidence state", () => {
    expect(intel.resolveHomeLiveIntel([
      {...candidate, id: "missing-source", sourceUrl: ""}, {...candidate, id: "missing-date", verifiedAt: ""},
      {...candidate, id: "invalid-date", verifiedAt: "2026-02-30"}, {...candidate, id: "unknown-current", current: undefined},
      {...candidate, id: "invalid-source", sourceUrl: "javascript:alert(1)"}
    ])).toEqual([]);
  });

  it("does not repeat the same guide as multiple dated headlines", () => {
    expect(intel.resolveHomeLiveIntel([candidate, {...candidate, id: "older", verifiedAt: "2026-09-10"}])).toHaveLength(1);
  });

  it.each(locales)("resolves at most three source-backed entries for %s", async (locale) => {
    const entries = await intel.getHomeLiveIntelEntries(locale);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBeLessThanOrEqual(3);
    expect(entries.every((entry) => entry.current === false)).toBe(true);
    expect(entries.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt))).toBe(true);
  });
});
