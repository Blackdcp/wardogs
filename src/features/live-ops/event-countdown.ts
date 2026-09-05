export type EventCountdownSchedule = {
  startsAt: string;
  endsAt: string;
  earlyAccessDate: string;
};

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type EventCountdownState =
  | {phase: "starts" | "ends"; remainingMs: number; parts: CountdownParts}
  | {phase: "early-access" | "schedule-reached"; date: string};

function splitDuration(remainingMs: number): CountdownParts {
  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60
  };
}

export function getEventCountdown(nowMs: number, schedule: EventCountdownSchedule): EventCountdownState {
  const startsAt = Date.parse(schedule.startsAt);
  const endsAt = Date.parse(schedule.endsAt);
  const earlyAccessDate = Date.parse(`${schedule.earlyAccessDate}T00:00:00Z`);

  if (nowMs < startsAt) {
    const remainingMs = startsAt - nowMs;
    return {phase: "starts", remainingMs, parts: splitDuration(remainingMs)};
  }

  if (nowMs < endsAt) {
    const remainingMs = endsAt - nowMs;
    return {phase: "ends", remainingMs, parts: splitDuration(remainingMs)};
  }

  if (nowMs < earlyAccessDate) {
    return {phase: "early-access", date: schedule.earlyAccessDate};
  }

  return {phase: "schedule-reached", date: schedule.earlyAccessDate};
}
