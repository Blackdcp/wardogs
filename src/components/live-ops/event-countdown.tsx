"use client";

import {useEffect, useState} from "react";
import {getEventCountdown, type EventCountdownSchedule, type EventCountdownState} from "@/features/live-ops/event-countdown";

export type EventCountdownLabels = {
  starts: string;
  ends: string;
  earlyAccess: string;
  reached: string;
  checking: string;
  scheduleOnly: string;
  exactTimeUnconfirmed: string;
  dateValue: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type EventCountdownViewProps = {
  labels: EventCountdownLabels;
  state: EventCountdownState | null;
};

const partOrder = ["days", "hours", "minutes", "seconds"] as const;

export function EventCountdownView({labels, state}: EventCountdownViewProps) {
  if (!state) {
    return (
      <div aria-live="polite" className="min-h-[116px] border-y border-[#31543f] py-4" data-event-countdown>
        <p className="text-xs font-semibold uppercase text-[#8ba99a]">{labels.checking}</p>
        <p className="mt-3 text-sm text-[#dce7df]">{labels.scheduleOnly}</p>
      </div>
    );
  }

  if ("date" in state) {
    return (
      <div aria-live="polite" className="min-h-[116px] border-y border-[#31543f] py-4" data-event-countdown data-event-phase={state.phase}>
        <p className="text-xs font-semibold uppercase text-[#91b29f]">
          {state.phase === "early-access" ? labels.earlyAccess : labels.reached}
        </p>
        <p className="display-font mt-2 text-3xl leading-none text-white">
          <time dateTime={state.date}>{labels.dateValue}</time>
        </p>
        <p className="mt-3 text-xs leading-5 text-[#d6c47f]">{labels.exactTimeUnconfirmed}</p>
      </div>
    );
  }

  const parts = state.parts;

  return (
    <div aria-live="polite" className="min-h-[116px] border-y border-[#31543f] py-4" data-event-countdown data-event-phase={state.phase}>
      <p className="text-xs font-semibold uppercase text-[#91b29f]">
        {state.phase === "starts" ? labels.starts : labels.ends}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 font-mono tabular-nums">
        {partOrder.map((part) => (
          <span className="min-w-0 border-l border-[#31543f] pl-2 first:border-l-0 first:pl-0" data-countdown-part={part} key={part}>
            <span className="block text-xl font-semibold leading-none text-white sm:text-2xl">{String(parts[part]).padStart(2, "0")}</span>
            <span className="mt-1 block text-[10px] uppercase text-[#8ba99a]">{labels[part]}</span>
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-4 text-[#8ba99a]">{labels.scheduleOnly}</p>
    </div>
  );
}

export function EventCountdown({labels, schedule}: {labels: EventCountdownLabels; schedule: EventCountdownSchedule}) {
  const [state, setState] = useState<EventCountdownState | null>(null);
  const {earlyAccessDate, endsAt, startsAt} = schedule;

  useEffect(() => {
    const currentSchedule = {earlyAccessDate, endsAt, startsAt};
    const update = () => setState(getEventCountdown(Date.now(), currentSchedule));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [earlyAccessDate, endsAt, startsAt]);

  return <EventCountdownView labels={labels} state={state} />;
}
