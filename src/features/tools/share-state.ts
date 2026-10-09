import {inspectToolState, isToolShareWithinLimit, purchaseLinesSchema, readJsonParam, stampToolState, supplyPlanSchema, type PurchaseLine, type SupplyPlan} from "./workflow-state";
import {combatScenarioSchema, type CombatScenario} from "./combat-scenario";

export type HardwareTier = "below" | "minimum" | "recommended" | "unknown";
export type WindowsVersion = "windows-10" | "windows-11" | "unsupported";

export type SystemCheckState = {
  os: WindowsVersion;
  ramGb: number;
  storageGb: number;
  cpuTier: HardwareTier;
  gpuTier: HardwareTier;
};

export type BudgetState = {
  cash: number;
  loadout: number;
  vehicle: number;
  reserve: number;
  once?: number;
  mode?: "total" | "items";
  lines?: PurchaseLine[];
  buildLabel?: string;
};

export type WeaponCompareState = {
  left: string | null;
  right: string | null;
  differences?: boolean;
  scenario?: CombatScenario;
};

export type AmmoMatcherState = {
  weapon: string | null;
  ammo: string | null;
};

export type ProgressionRouteState = {
  role: string;
  currentLevel: number | null;
};

export type LogisticsPlanState = {
  stages: string[];
  supplies?: SupplyPlan;
};

export type ToolSearchParams = Record<string, string | string[] | undefined>;

const hardwareTiers = new Set<HardwareTier>(["below", "minimum", "recommended", "unknown"]);
const windowsVersions = new Set<WindowsVersion>(["windows-10", "windows-11", "unsupported"]);
export const SYSTEM_CHECK_LIMITS = {ramGb: 1_024, storageGb: 100_000} as const;

function parseBoundedInteger(value: string | null, maximum = 1_000_000) {
  if (value === null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 && parsed <= maximum ? parsed : null;
}

function readSingleAllowedParam(params: URLSearchParams, key: string, allowed: ReadonlySet<string>) {
  const values = params.getAll(key);
  if (values.length !== 1 || !allowed.has(values[0])) return null;
  return values[0];
}

function readSingleBoundedIntegerParam(params: URLSearchParams, key: string, maximum: number) {
  const values = params.getAll(key);
  if (values.length !== 1) return null;
  return parseBoundedInteger(values[0], maximum);
}

function readSingleBoundedNumberParam(params: URLSearchParams, key: string, maximum: number) {
  const values = params.getAll(key);
  if (values.length !== 1 || !/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(values[0])) return null;
  const parsed = Number(values[0]);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= maximum ? parsed : null;
}

export function serializeToolSearchParams(searchParams: ToolSearchParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
    else if (value !== undefined) params.set(key, value);
  }
  return params.toString();
}

export function encodeSystemCheckState(state: SystemCheckState) {
  return stampToolState(new URLSearchParams({
    os: state.os,
    ram: String(state.ramGb),
    storage: String(state.storageGb),
    cpu: state.cpuTier,
    gpu: state.gpuTier,
  }));
}

export function decodeSystemCheckState(value: string): SystemCheckState | null {
  if (!isToolShareWithinLimit(value) || inspectToolState(value).status === "unsupported") return null;
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const os = readSingleAllowedParam(params, "os", windowsVersions) as WindowsVersion | null;
  const cpuTier = readSingleAllowedParam(params, "cpu", hardwareTiers) as HardwareTier | null;
  const gpuTier = readSingleAllowedParam(params, "gpu", hardwareTiers) as HardwareTier | null;
  const ramGb = readSingleBoundedNumberParam(params, "ram", SYSTEM_CHECK_LIMITS.ramGb);
  const storageGb = readSingleBoundedNumberParam(params, "storage", SYSTEM_CHECK_LIMITS.storageGb);

  if (!os || !cpuTier || !gpuTier || ramGb === null || storageGb === null) {
    return null;
  }
  return {os, ramGb, storageGb, cpuTier, gpuTier};
}

export function evaluateSystemCheck(state: SystemCheckState): {level: "below" | "review" | "minimum" | "recommended"; limiting: string[]} {
  const limiting: string[] = [];
  if (state.os === "unsupported") limiting.push("os");
  if (state.ramGb < 16) limiting.push("ramGb");
  if (state.storageGb < 50) limiting.push("storageGb");
  if (state.cpuTier === "below") limiting.push("cpuTier");
  if (state.gpuTier === "below") limiting.push("gpuTier");
  if (limiting.length > 0) return {level: "below", limiting};

  if (state.cpuTier === "unknown" || state.gpuTier === "unknown") {
    return {level: "review", limiting: [
      ...(state.cpuTier === "unknown" ? ["cpuTier"] : []),
      ...(state.gpuTier === "unknown" ? ["gpuTier"] : []),
    ]};
  }

  if (state.os === "windows-11" && state.cpuTier === "recommended" && state.gpuTier === "recommended") {
    return {level: "recommended", limiting: []};
  }

  if (state.os !== "windows-11") limiting.push("os");
  if (state.cpuTier !== "recommended") limiting.push("cpuTier");
  if (state.gpuTier !== "recommended") limiting.push("gpuTier");
  return {level: "minimum", limiting};
}

export function encodeBudgetState(state: BudgetState, dataVersion?: string) {
  const params = new URLSearchParams({
    cash: String(state.cash),
    loadout: String(state.loadout),
    vehicle: String(state.vehicle),
    reserve: String(state.reserve),
  });
  if (state.once !== undefined) params.set("once", String(state.once));
  if (state.mode) params.set("mode", state.mode);
  if (state.lines) params.set("lines", JSON.stringify(state.lines));
  if (state.buildLabel !== undefined) params.set("build", state.buildLabel);
  return stampToolState(params, dataVersion);
}

export function decodeBudgetState(value: string): BudgetState | null {
  if (!isToolShareWithinLimit(value) || inspectToolState(value).status === "unsupported") return null;
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const cash = readMoneyParam(params, "cash");
  const loadout = readMoneyParam(params, "loadout");
  const vehicle = readMoneyParam(params, "vehicle");
  const reserve = readMoneyParam(params, "reserve");
  if (cash === null || loadout === null || vehicle === null || reserve === null) return null;
  const state: BudgetState = {cash, loadout, vehicle, reserve};
  if (params.has("build")) {
    const build = params.getAll("build");
    if (build.length !== 1 || build[0].length > 80) return null;
    state.buildLabel = build[0];
  }
  if (params.has("once")) {
    const once = readMoneyParam(params, "once");
    if (once === null) return null;
    state.once = once;
  }
  if (params.has("mode")) {
    const mode = readSingleAllowedParam(params, "mode", new Set(["items", "total"]));
    if (!mode) return null;
    state.mode = mode as "items" | "total";
  }
  if (params.has("lines")) {
    const lines = readJsonParam(params, "lines", purchaseLinesSchema);
    if (!lines) return null;
    state.lines = lines;
  }
  if (state.mode === "items" && !state.lines) return null;
  return state;
}

function readMoneyParam(params: URLSearchParams, key: string) {
  const values = params.getAll(key);
  if (values.length !== 1 || !/^\d+(\.\d{1,2})?$/.test(values[0])) return null;
  const value = Number(values[0]);
  return Number.isFinite(value) && value <= 1_000_000 ? value : null;
}

export function calculateBudget(state: BudgetState) {
  const spent = state.loadout + state.vehicle;
  const remaining = state.cash - spent;
  return {spent, remaining, reserveMet: remaining >= state.reserve};
}

export function encodeWeaponCompareState(state: WeaponCompareState, dataVersion?: string) {
  const params = new URLSearchParams();
  if (state.left) params.set("left", state.left);
  if (state.right) params.set("right", state.right);
  if (state.differences !== undefined) params.set("differences", state.differences ? "1" : "0");
  if (state.scenario) params.set("scenario", JSON.stringify(state.scenario));
  return stampToolState(params, dataVersion);
}

export function decodeWeaponCompareState(value: string, allowedSlugs: readonly string[]): WeaponCompareState {
  if (!isToolShareWithinLimit(value) || inspectToolState(value).status === "unsupported") return {left: allowedSlugs[0] ?? null, right: allowedSlugs[1] ?? null};
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const allowed = new Set(allowedSlugs);
  const requestedLeft = readSingleAllowedParam(params, "left", allowed);
  const requestedRight = readSingleAllowedParam(params, "right", allowed);
  const left = requestedLeft ?? allowedSlugs[0] ?? null;
  const right = requestedRight && requestedRight !== left
    ? requestedRight
    : allowedSlugs.find((slug) => slug !== left) ?? null;

  const scenario = readJsonParam(params, "scenario", combatScenarioSchema);
  return {left, right, ...(params.getAll("differences").length === 1 && ["0", "1"].includes(params.get("differences") ?? "") ? {differences: params.get("differences") === "1"} : {}), ...(scenario && requestedLeft === left && requestedRight === right ? {scenario} : {})};
}

export function encodeAmmoMatcherState(state: AmmoMatcherState, dataVersion?: string) {
  const params = new URLSearchParams();
  if (state.weapon) params.set("weapon", state.weapon);
  if (state.ammo) params.set("ammo", state.ammo);
  return stampToolState(params, dataVersion);
}

export function decodeAmmoMatcherState(
  value: string,
  allowedWeaponSlugs: readonly string[],
  allowedAmmoSlugs: readonly string[],
): AmmoMatcherState {
  if (inspectToolState(value).status === "unsupported") return {weapon: null, ammo: null};
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  return {
    weapon: readSingleAllowedParam(params, "weapon", new Set(allowedWeaponSlugs)),
    ammo: readSingleAllowedParam(params, "ammo", new Set(allowedAmmoSlugs)),
  };
}

export function encodeProgressionRouteState(state: ProgressionRouteState, dataVersion?: string) {
  const params = new URLSearchParams({pr_role: state.role});
  if (state.currentLevel !== null) params.set("pr_level", String(state.currentLevel));
  return stampToolState(params, dataVersion);
}

export function decodeProgressionRouteState(
  value: string,
  allowedRoles: readonly string[],
): ProgressionRouteState {
  if (inspectToolState(value).status === "unsupported") return {role: allowedRoles[0] ?? "", currentLevel: null};
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const role = readSingleAllowedParam(params, "pr_role", new Set(allowedRoles)) ?? allowedRoles[0] ?? "";
  return {
    role,
    currentLevel: readSingleBoundedIntegerParam(params, "pr_level", 999),
  };
}

export function encodeLogisticsPlanState(state: LogisticsPlanState, dataVersion?: string) {
  const params = new URLSearchParams({lp_stages: state.stages.length > 0 ? state.stages.join(",") : "none"});
  if (state.supplies) params.set("lp_supplies", JSON.stringify(state.supplies));
  return stampToolState(params, dataVersion);
}

export function decodeLogisticsPlanState(
  value: string,
  allowedStages: readonly string[],
): LogisticsPlanState {
  if (!isToolShareWithinLimit(value) || inspectToolState(value).status === "unsupported") return {stages: [...allowedStages]};
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const supplies = readJsonParam(params, "lp_supplies", supplyPlanSchema);
  const extra = supplies ? {supplies} : {};
  const values = params.getAll("lp_stages");
  if (values.length === 0) return {stages: [...allowedStages], ...extra};
  if (values.length !== 1) return {stages: [...allowedStages], ...extra};
  if (values[0] === "none") return {stages: [], ...extra};

  const stages = values[0].split(",").filter(Boolean);
  const allowed = new Set(allowedStages);
  if (
    stages.length === 0
    || new Set(stages).size !== stages.length
    || stages.some((stage) => !allowed.has(stage))
  ) {
    return {stages: [...allowedStages]};
  }
  return {stages, ...extra};
}
