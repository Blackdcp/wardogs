import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {getSiteOrigin} from "@/lib/metadata";

export function getPublicStatus() {
  const origin = getSiteOrigin();

  return {
    schemaVersion: 1,
    dataAsOf: "2026-09-05",
    site: "WARDOGS Wiki",
    game: "WARDOGS",
    currentEvent: {
      id: CURRENT_EVENT.id,
      name: "Closed Beta 02",
      status: CURRENT_EVENT.status,
      startsAt: CURRENT_EVENT.startsAt,
      endsAt: CURRENT_EVENT.endsAt
    },
    earlyAccess: {
      date: CURRENT_EVENT.earlyAccessAt,
      datePrecision: "date",
      exactUnlockTimeConfirmed: false,
      storeUrl: CURRENT_EVENT.storeUrl
    },
    links: {
      home: `${origin}/en`,
      accessGuide: `${origin}/en/guides/${CURRENT_EVENT.accessGuideSlug}`,
      downloadGuide: `${origin}/en/guides/${CURRENT_EVENT.downloadGuideSlug}`,
      knownIssues: `${origin}/en/guides/${CURRENT_EVENT.issuesGuideSlug}`,
      api: `${origin}/api/status.json`,
      widget: `${origin}/embed/status`
    },
    sources: [
      {kind: "official", label: "Official Closed Beta 02 announcement", url: CURRENT_EVENT.officialUrl},
      {kind: "official", label: "Official revised schedule", url: CURRENT_EVENT.scheduleUrl},
      {kind: "official", label: "Official Steam store", url: CURRENT_EVENT.storeUrl}
    ]
  } as const;
}
