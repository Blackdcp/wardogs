import {describe, expect, it, vi} from "vitest";
import {createToolResultRecorder} from "../../src/lib/analytics-events";

describe("tool result analytics", () => {
  it("queues categorical cash outcomes locally without initializing a production tag", () => {
    const target: {dataLayer?: unknown[]} = {};
    const record = createToolResultRecorder("cash-xp-calculator", "en", target);
    expect(target.dataLayer).toBeUndefined();
    record("cash_positive");
    record("cash_positive");
    record("cash_negative");
    expect(target.dataLayer).toEqual([
      ["event", "tool_start", {tool: "cash-xp-calculator", locale: "en"}],
      ["event", "tool_result", {tool: "cash-xp-calculator", result: "cash_positive", locale: "en"}],
      ["event", "tool_result", {tool: "cash-xp-calculator", result: "cash_negative", locale: "en"}]
    ]);
  });

  it("records incomplete and reserve verdicts once per transition", () => {
    const target = {gtag: vi.fn()};
    const record = createToolResultRecorder("loadout-budget", "ja", target);
    record("incomplete");
    record("incomplete");
    record("reserve_missed");
    record("reserve_met");
    expect(target.gtag.mock.calls.filter((command) => command[1] === "tool_result").map((command) => command[2].result)).toEqual(["incomplete", "reserve_missed", "reserve_met"]);
    expect(target.gtag.mock.calls.filter((command) => command[1] === "tool_start")).toHaveLength(1);
    expect(target.gtag.mock.calls.every((command) => command[2].locale === "ja")).toBe(true);
  });
});
