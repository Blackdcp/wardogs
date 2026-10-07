import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";

const dayMs = 86400000;
function dateStart(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Invalid UTC date: ${date}`);
  const value = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(value) || new Date(value).toISOString().slice(0, 10) !== date) throw new Error(`Invalid UTC date: ${date}`);
  return value;
}
function number(value, field) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid ${field}`);
  return value;
}

/** Operational comparison only. Shared zones cannot allocate revenue to pages. */
export function buildAdRevenueReport(snapshot, now = Date.now()) {
  if (snapshot.domain !== "wardogswiki.com" || snapshot.currency !== "USD" || snapshot.timezone !== "UTC") {
    throw new Error("Use wardogswiki.com only, USD revenue and UTC reporting dates.");
  }
  if (!Array.isArray(snapshot.daily)) throw new Error("daily rows are required");
  const seen = new Set();
  const excluded = [];
  const daily = snapshot.daily.flatMap((row) => {
    const start = dateStart(row.date);
    if (seen.has(row.date)) throw new Error(`Duplicate date: ${row.date}`);
    seen.add(row.date);
    const impressions = number(row.impressions, "impressions");
    const revenue = number(row.revenue, "revenue");
    if (!Number.isInteger(impressions)) throw new Error("impressions must be an integer");
    if (row.completeUtcDay !== true || start + dayMs > now) {
      excluded.push(row.date);
      return [];
    }
    const denominator = snapshot.sessionsByUtcDate?.[row.date];
    let sessions = null;
    if (denominator) {
      // Do not mix GA's Asia/Shanghai calendar day with the vendor's UTC day.
      if (denominator.windowStart !== new Date(start).toISOString() || denominator.windowEnd !== new Date(start + dayMs).toISOString()
        || denominator.scope !== "all_measured_sessions" || denominator.hostname !== "www.wardogswiki.com") {
        throw new Error(`Unaligned or filtered session denominator for ${row.date}`);
      }
      sessions = number(denominator.sessions, "sessions");
      if (!Number.isInteger(sessions)) throw new Error("sessions must be an integer");
    }
    return [{date: row.date, impressions, revenue, sessions,
      weightedCpm: impressions > 0 ? revenue * 1000 / impressions : null,
      sessionRpm: sessions > 0 ? revenue * 1000 / sessions : null}];
  }).sort((a, b) => a.date.localeCompare(b.date));
  const impressions = daily.reduce((sum, row) => sum + row.impressions, 0);
  const revenue = daily.reduce((sum, row) => sum + row.revenue, 0);
  const sessions = daily.length > 0 && daily.every((row) => row.sessions !== null)
    ? daily.reduce((sum, row) => sum + row.sessions, 0) : null;
  return {
    domain: snapshot.domain, currency: "USD", timezone: "UTC", daily, excludedIncompleteDates: excluded,
    totals: {days: daily.length, impressions, revenue, sessions,
      weightedCpm: impressions ? revenue * 1000 / impressions : null,
      sessionRpm: sessions > 0 ? revenue * 1000 / sessions : null},
    interpretation: {
      revenueAttribution: "site_total_only_shared_zones",
      experimentResult: "not_a_randomized_experiment",
      precision: "CPM is recomputed from supplied revenue; cent-rounded exports have rounding error.",
      sessionRpm: "An operational ratio across two measurement systems, not user-level revenue attribution. Null means no aligned denominator.",
      missingDates: "Absent dates are not fabricated as zero. Compare equal weekday windows separately."
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.argv[2]) throw new Error("Usage: npm run ads:report -- path/to/private-snapshot.json");
    console.log(JSON.stringify(buildAdRevenueReport(JSON.parse(readFileSync(process.argv[2], "utf8"))), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
