import {afterEach, describe, expect, it, vi} from "vitest";
import {createSiteSearchRecorder, recordSiteSearchResult, safeSearchTerm} from "../../src/features/search/site-search-analytics";

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

  it("records an opened result with its catalogue identity but no query text", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {gtag});
    recordSiteSearchResult("my arbitrary free text", {
      id: "tool:map", type: "tool", title: "Map", aliases: [], summary: "",
      taskIntent: [], category: "tools", href: "/en/tools/map"
    }, "en", "header");
    expect(gtag.mock.calls).toEqual([
      ["event", "site_search_result_open", {result_type: "tool", result_id: "tool:map", locale: "en", search_source: "header"}]
    ]);
  });

  it("records an abandoned empty-result query once across blur, close and Enter", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {gtag});
    const record = createSiteSearchRecorder("en", "home");
    record("  SPH-2 unknown  ", 0);
    record("SPH-2 unknown", 0);
    record("SPH-2 unknown", 0);
    expect(gtag.mock.calls).toEqual([
      ["event", "search", {result_count: 0, locale: "en", search_source: "home"}],
      ["event", "site_search_no_results", {result_count: 0, locale: "en", search_source: "home"}]
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
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("Havoc");
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("SPH-2");
  });
});
