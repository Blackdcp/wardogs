import {locales} from "../../src/config/site";

export const contentAuditDate = "2026-10-05";
export const gapStatuses = ["pass", "copy-gap", "fact-gap", "localization-gap", "render-gap", "link-gap", "competitor-workflow-gap"] as const;
export const evidenceFields = ["url", "checkedAt", "kind", "build", "scope", "limitations"] as const;
export const factBoundaries = {
  launchErrors: "WD-L014/WD-L018 fixes remain in progress; WD-L020's KB5124010 fix does not establish a fix for other codes.",
  infrared: "IR vendor removal does not prove confiscation of equipment already owned; planned Season 2 batteries are not a current live mechanic.",
  season: "The October 15 announced date does not establish an exact reset hour or final transition exchange rate.",
  gold: "No fixed Gold conversion rate without current original evidence; manual quotes and automatic season conversion are separate.",
  achievements: "No hidden achievement condition without current original evidence; community suggestions are not confirmed triggers.",
  lowLevel: "Low-Level discovery does not establish a numerical eligibility cap without current original evidence.",
  fireControl: "Internal map/calculator consistency does not establish measured metre scale, live ballistic calibration or measured time of flight.",
  map: "A two-dimensional map is not a 3D map.",
  playerCount: "Aggregate player counts are not personal stat tracking."
} as const;

type Group = "operations" | "progression" | "player-task" | "hub";
function family(id: string, group: Group, answers: readonly string[], relatedPaths: readonly string[], boundaries: readonly (keyof typeof factBoundaries)[] = []) {
  const slug = `wardogs-${id}`;
  return {slug, group, requiredAnswers: answers, relatedPaths, boundaries, evidenceFields,
    localePaths: Object.fromEntries(locales.map((locale) => [locale, `/${locale}/guides/${slug}`]))};
}

export const priorityGuideFamilies = [
  family("crash-fix", "operations", ["Identify exact error and failure stage", "Separate local startup from service failure"], ["/tools/system-check"], ["launchErrors"]),
  family("known-issues", "operations", ["Separate acknowledged, reported and resolved issues", "Route to the correct diagnostic branch"], ["/tools/system-check"], ["launchErrors", "infrared"]),
  family("patch-notes", "operations", ["Latest numbered patch versus later hotfix", "Find primary dated notes"], ["/guides/wardogs-server-status"], ["launchErrors", "infrared", "season"]),
  family("server-status", "operations", ["Notice versus live telemetry", "Distinguish maintenance, queue and local failures"], ["/guides/wardogs-crash-fix"], ["launchErrors"]),
  family("community-servers-guide", "operations", ["Choose mode, region and server", "Read current eligibility and listing rules"], ["/guides/wardogs-infantry-mode"], ["lowLevel"]),
  family("controls", "operations", ["Verify current bindings", "Separate controller, zoom and input conflicts"], ["/tools/ammo-matcher"]),
  family("equipment-tools-guide", "operations", ["Choose the tool for the job", "Check current vendor and build constraints"], ["/tools/loadout-budget", "/items/equipment"], ["infrared"]),
  family("season-2", "progression", ["Announced date and unconfirmed hour", "Separate confirmed plans from live changes"], ["/tools/progression-route"], ["season", "infrared"]),
  family("progression-wipes-guide", "progression", ["Reset and retained matrix", "Plan purchases with transition uncertainty"], ["/tools/progression-route"], ["season", "gold"]),
  family("money-guide", "progression", ["Net income after replacement costs", "Read manual exchange quote and preserve a reserve"], ["/tools/loadout-budget"], ["gold"]),
  family("achievements", "progression", ["Use Steam's current achievement descriptions", "Keep hidden triggers unconfirmed"], ["/tools/progression-route"], ["achievements"]),
  family("beginner-guide", "player-task", ["Affordable complete first kit", "Spawn, move and contribute with a squad"], ["/tools/loadout-budget"]),
  family("squad-guide", "player-task", ["Join the same server and team", "Resolve invite, squad and regroup failures"], ["/tools/map"]),
  family("towers-guide", "player-task", ["Capture and assess objective value", "Coordinate approach and defense"], ["/tools/map"]),
  family("cargo-guide", "player-task", ["Transport and transfer the correct resource", "Verify usable FOB stock after unloading"], ["/tools/logistics-planner"]),
  family("best-weapons-loadouts", "player-task", ["Choose role and budget", "Check compatibility and evidence before buying"], ["/tools/weapon-compare", "/items/weapons"]),
  family("helicopter-guide", "player-task", ["Verify controls before carrying passengers", "Plan landing, transport and loss limits"], ["/items/helicopters"]),
  family("best-settings", "player-task", ["Record a reproducible baseline", "Change one variable and retest"], ["/tools/system-check"]),
  family("mortar-guide", "player-task", ["Range, azimuth, observation and correction", "Maintain supplies and protect friendlies"], ["/tools/map", "/tools/artillery-calculator"], ["fireControl"]),
  family("artillery-guide", "player-task", ["Coordinate crew, supplies and fire solution", "Observe and correct instead of trusting a permanent table"], ["/tools/artillery-calculator"], ["fireControl"]),
  family("map", "player-task", ["Read landmarks and plan route", "Measurement and calibration limits"], ["/tools/map"], ["fireControl", "map"]),
  family("fob-guide", "player-task", ["Validate placement and supply access", "Confirm the first usable delivery"], ["/tools/logistics-planner"]),
  family("ammo-reload-guide", "player-task", ["Reload, refill magazines and change ammo", "Verify current weapon-magazine-ammunition compatibility"], ["/tools/ammo-matcher"]),
  family("oil-rig-guide", "player-task", ["Coordinate resource collection and return", "Avoid unsupported payout or route guarantees"], ["/tools/logistics-planner"])
] as const;
export const infantryHub = family("infantry-mode", "hub", ["Find the mode in Deploy", "Continue map to fire-control workflow"], ["/tools/map", "/tools/artillery-calculator"], ["infrared", "lowLevel", "fireControl"]);
export const auditedGuideFamilies = [...priorityGuideFamilies, infantryHub];
