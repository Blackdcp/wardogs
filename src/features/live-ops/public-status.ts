import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {getSiteOrigin} from "@/lib/metadata";

export function getPublicStatus() {
  const origin = getSiteOrigin();

  return {
    schemaVersion: 1,
    dataAsOf: "2026-09-09",
    site: "WARDOGS Wiki",
    game: "WARDOGS",
    currentEvent: {
      id: CURRENT_EVENT.id,
      name: "Closed Beta 02",
      status: CURRENT_EVENT.status,
      startsAt: CURRENT_EVENT.startsAt,
      openedToAllAt: CURRENT_EVENT.openedToAllAt,
      endsAt: CURRENT_EVENT.endsAt
    },
    earlyAccess: {
      date: CURRENT_EVENT.earlyAccessAt,
      datePrecision: "date",
      exactUnlockTimeConfirmed: false,
      preloadConfirmed: false,
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
      {kind: "official", label: "Official Steam store and Early Access date", url: CURRENT_EVENT.storeUrl},
      {kind: "official", label: "Historical Closed Beta 02 announcement", url: CURRENT_EVENT.officialUrl},
      {kind: "official", label: "Historical September 5 Open Beta notice", url: CURRENT_EVENT.openBetaUrl},
      {kind: "official", label: "Historical revised Beta 02 schedule", url: CURRENT_EVENT.scheduleUrl}
    ]
  } as const;
}
