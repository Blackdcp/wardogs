import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {getSiteOrigin} from "@/lib/metadata";

export function getPublicStatus() {
  const origin = getSiteOrigin();

  return {
    schemaVersion: 2,
    dataAsOf: CURRENT_EVENT.dataAsOf,
    site: "WARDOGS Wiki",
    game: "WARDOGS",
    currentEvent: {
      id: CURRENT_EVENT.id,
      name: `Early Access - Patch ${CURRENT_EVENT.latestPatchVersion}`,
      status: CURRENT_EVENT.status,
      phase: CURRENT_EVENT.phase,
      launchedOn: CURRENT_EVENT.earlyAccessAt
    },
    earlyAccess: {
      date: CURRENT_EVENT.earlyAccessAt,
      datePrecision: "date",
      status: "live",
      launched: true,
      storeUrl: CURRENT_EVENT.storeUrl
    },
    nextSeason: {
      name: "Season 02",
      date: CURRENT_EVENT.nextSeasonDate,
      datePrecision: "date",
      exactTimeConfirmed: false,
      status: "announced",
      officialUrl: CURRENT_EVENT.nextSeasonUrl
    },
    maintenance: {
      status: "window-passed",
      patchVersion: CURRENT_EVENT.latestPatchVersion,
      startsAt: CURRENT_EVENT.maintenanceStartsAt,
      expectedDurationMinutes: CURRENT_EVENT.maintenanceDurationMinutes,
      scope: [
        "wd-l020-windows-11-crash-fix",
        "cash-and-xp-exploit-fixes",
        "deploy-server-browser-and-official-filters",
        "community-server-security",
        "server-stability-and-gameplay-fixes"
      ],
      officialUrl: CURRENT_EVENT.latestOfficialUrl
    },
    historicalEvents: [
      {
        id: "closed-beta-02",
        name: "Closed Beta 02",
        status: "ended",
        startsAt: CURRENT_EVENT.startsAt,
        openedToAllAt: CURRENT_EVENT.openedToAllAt,
        endsAt: CURRENT_EVENT.endsAt
      }
    ],
    links: {
      home: `${origin}/en`,
      accessGuide: `${origin}/en/guides/${CURRENT_EVENT.accessGuideSlug}`,
      downloadGuide: `${origin}/en/guides/${CURRENT_EVENT.downloadGuideSlug}`,
      knownIssues: `${origin}/en/guides/${CURRENT_EVENT.issuesGuideSlug}`,
      serverStatus: `${origin}/en/guides/${CURRENT_EVENT.statusGuideSlug}`,
      patchNotes: `${origin}/en/guides/${CURRENT_EVENT.patchNotesGuideSlug}`,
      nextSeason: `${origin}/en/guides/${CURRENT_EVENT.nextSeasonGuideSlug}`,
      api: `${origin}/api/status.json`,
      widget: `${origin}/embed/status`
    },
    sources: [
      {kind: "official", label: `Patch ${CURRENT_EVENT.latestPatchVersion} and the published maintenance window`, url: CURRENT_EVENT.latestOfficialUrl},
      {kind: "official", label: "Season 02 announced for October 15", url: CURRENT_EVENT.nextSeasonUrl},
      {kind: "official", label: "Steam Early Access store", url: CURRENT_EVENT.storeUrl},
      {kind: "official", label: "Pre-Load Live and Season 1 changelog", url: CURRENT_EVENT.seasonOnePatchUrl},
      {kind: "official", label: "Launch Stability Hotfix #1", url: CURRENT_EVENT.launchHotfixUrl},
      {kind: "official", label: "Historical Closed Beta 02 announcement", url: CURRENT_EVENT.officialUrl},
      {kind: "official", label: "Historical September 5 Open Beta notice", url: CURRENT_EVENT.openBetaUrl},
      {kind: "official", label: "Historical revised Beta 02 schedule", url: CURRENT_EVENT.scheduleUrl}
    ]
  } as const;
}
