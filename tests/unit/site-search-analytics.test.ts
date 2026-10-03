import {afterEach, describe, expect, it, vi} from "vitest";
import {createSiteSearchRecorder, safeSearchTerm} from "../../src/features/search/site-search-analytics";

afterEach(() => vi.unstubAllGlobals());

describe("site search analytics privacy", () => {
  it("keeps useful site queries and normalizes whitespace", () => {
    expect(safeSearchTerm("  SPH-2   unlock  ")).toBe("SPH-2 unlock");
    expect(safeSearchTerm(" Havoc ")).toBe("Havoc");
  });

  it.each([
    "a",
    "user@example.com",
    "https://example.com",
    "www.example.com",
    "+1 (555) 123-4567",
    "1234567890",
    "x".repeat(81)
  ])("does not record likely personal or oversized input: %s", (query) => {
    expect(safeSearchTerm(query)).toBeNull();
  });

  it("records an abandoned empty-result query once across blur, close and Enter", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {gtag});
    const record = createSiteSearchRecorder("en", "home");
    record("  SPH-2 unknown  ", 0);
    record("SPH-2 unknown", 0);
    record("SPH-2 unknown", 0);
    expect(gtag.mock.calls).toEqual([
      ["event", "search", {search_term: "SPH-2 unknown", result_count: 0, locale: "en", search_source: "home"}],
      ["event", "site_search_no_results", {search_term: "SPH-2 unknown", result_count: 0, locale: "en", search_source: "home"}]
    ]);
  });

  it("keeps new searches and changed results observable while excluding sensitive input", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {gtag});
    const record = createSiteSearchRecorder("ja", "header");
    record("user@example.com", 0);
    record("Havoc", 0);
    record("Havoc", 2);
    record("SPH-2", 1);
    record("Havoc", 2);
    expect(gtag.mock.calls.filter((call) => call[1] === "search")).toHaveLength(4);
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("user@example.com");
  });
});
