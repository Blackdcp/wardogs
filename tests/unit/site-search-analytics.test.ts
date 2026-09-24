import {describe, expect, it} from "vitest";
import {safeSearchTerm} from "../../src/features/search/site-search-analytics";

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
});
