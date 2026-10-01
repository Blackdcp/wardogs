export function parseVideoStartTime(value: string | null): number {
  if (value === null || !/^\d+$/.test(value)) return 0;
  const seconds = Number(value);
  return Number.isSafeInteger(seconds) && seconds >= 0 && seconds < 86400 ? seconds : 0;
}
