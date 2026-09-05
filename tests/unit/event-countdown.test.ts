import {describe, expect, it} from "vitest";
import {getEventCountdown} from "../../src/features/live-ops/event-countdown";

const schedule = {
  startsAt: "2026-09-03T19:00:00Z",
  endsAt: "2026-09-06T08:00:00Z",
  earlyAccessDate: "2026-09-10"
};

describe("getEventCountdown", () => {
  it("counts down to the confirmed test start before the window opens", () => {
    expect(getEventCountdown(Date.parse("2026-09-03T18:00:00Z"), schedule)).toEqual({
      phase: "starts",
      remainingMs: 3_600_000,
      parts: {days: 0, hours: 1, minutes: 0, seconds: 0}
    });
  });

  it("counts down to the confirmed test end while Beta 02 is active", () => {
    expect(getEventCountdown(Date.parse("2026-09-05T06:57:58Z"), schedule)).toEqual({
      phase: "ends",
      remainingMs: 90_122_000,
      parts: {days: 1, hours: 1, minutes: 2, seconds: 2}
    });
  });

  it("shows the date-only Early Access phase without inventing an unlock time", () => {
    expect(getEventCountdown(Date.parse("2026-09-07T12:00:00Z"), schedule)).toEqual({
      phase: "early-access",
      date: "2026-09-10"
    });
  });

  it("stops claiming a countdown after the scheduled Early Access date", () => {
    expect(getEventCountdown(Date.parse("2026-09-10T00:00:00Z"), schedule)).toEqual({
      phase: "schedule-reached",
      date: "2026-09-10"
    });
  });
});
