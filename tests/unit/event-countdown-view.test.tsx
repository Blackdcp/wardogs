import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {EventCountdownView, type EventCountdownLabels} from "../../src/components/live-ops/event-countdown";

const labels: EventCountdownLabels = {
  starts: "Starts in",
  ends: "Beta ends in",
  earlyAccess: "Early Access",
  reached: "Scheduled date reached",
  checking: "Checking schedule",
  scheduleOnly: "Schedule-based, not live server telemetry.",
  exactTimeUnconfirmed: "Exact unlock time is not confirmed.",
  dateValue: "Sep 10, 2026",
  days: "D",
  hours: "H",
  minutes: "M",
  seconds: "S"
};

describe("EventCountdownView", () => {
  it("renders a compact four-part timer for the confirmed beta window", () => {
    const html = renderToStaticMarkup(
      <EventCountdownView
        labels={labels}
        state={{phase: "ends", remainingMs: 90_122_000, parts: {days: 1, hours: 1, minutes: 2, seconds: 2}}}
      />
    );

    expect(html).toContain("Beta ends in");
    expect(html.match(/data-countdown-part=/g)).toHaveLength(4);
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain("Schedule-based, not live server telemetry.");
  });

  it("renders a date-only handoff after beta without a fabricated launch hour", () => {
    const html = renderToStaticMarkup(
      <EventCountdownView labels={labels} state={{phase: "early-access", date: "2026-09-10"}} />
    );

    expect(html).toContain("Early Access");
    expect(html).toContain('<time dateTime="2026-09-10">Sep 10, 2026</time>');
    expect(html).toContain("Exact unlock time is not confirmed.");
    expect(html).not.toContain("00:00");
  });
});
