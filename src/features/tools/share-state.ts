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
};

export type WeaponCompareState = {
  left: string | null;
  right: string | null;
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
};

export type ToolSearchParams = Record<string, string | string[] | undefined>;

const hardwareTiers = new Set<HardwareTier>(["below", "minimum", "recommended", "unknown"]);
const windowsVersions = new Set<WindowsVersion>(["windows-10", "windows-11", "unsupported"]);

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

export function serializeToolSearchParams(searchParams: ToolSearchParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
    else if (value !== undefined) params.set(key, value);
  }
  return params.toString();
}

export function encodeSystemCheckState(state: SystemCheckState) {
  return new URLSearchParams({
    os: state.os,
    ram: String(state.ramGb),
    storage: String(state.storageGb),
    cpu: state.cpuTier,
    gpu: state.gpuTier,
  }).toString();
}

export function decodeSystemCheckState(value: string): SystemCheckState | null {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const os = params.get("os") as WindowsVersion;
  const cpuTier = params.get("cpu") as HardwareTier;
  const gpuTier = params.get("gpu") as HardwareTier;
  const ramGb = parseBoundedInteger(params.get("ram"), 1_024);
  const storageGb = parseBoundedInteger(params.get("storage"), 100_000);

  if (!windowsVersions.has(os) || !hardwareTiers.has(cpuTier) || !hardwareTiers.has(gpuTier) || ramGb === null || storageGb === null) {
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

export function encodeBudgetState(state: BudgetState) {
  return new URLSearchParams({
    cash: String(state.cash),
    loadout: String(state.loadout),
    vehicle: String(state.vehicle),
    reserve: String(state.reserve),
  }).toString();
}

export function decodeBudgetState(value: string): BudgetState | null {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const cash = parseBoundedInteger(params.get("cash"));
  const loadout = parseBoundedInteger(params.get("loadout"));
  const vehicle = parseBoundedInteger(params.get("vehicle"));
  const reserve = parseBoundedInteger(params.get("reserve"));
  if (cash === null || loadout === null || vehicle === null || reserve === null) return null;
  return {cash, loadout, vehicle, reserve};
}

export function calculateBudget(state: BudgetState) {
  const spent = state.loadout + state.vehicle;
  const remaining = state.cash - spent;
  return {spent, remaining, reserveMet: remaining >= state.reserve};
}

export function encodeWeaponCompareState(state: WeaponCompareState) {
  const params = new URLSearchParams();
  if (state.left) params.set("left", state.left);
  if (state.right) params.set("right", state.right);
  return params.toString();
}

export function decodeWeaponCompareState(value: string, allowedSlugs: readonly string[]): WeaponCompareState {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const allowed = new Set(allowedSlugs);
  const requestedLeft = readSingleAllowedParam(params, "left", allowed);
  const requestedRight = readSingleAllowedParam(params, "right", allowed);
  const left = requestedLeft ?? allowedSlugs[0] ?? null;
  const right = requestedRight && requestedRight !== left
    ? requestedRight
    : allowedSlugs.find((slug) => slug !== left) ?? null;

  return {left, right};
}

export function encodeAmmoMatcherState(state: AmmoMatcherState) {
  const params = new URLSearchParams();
  if (state.weapon) params.set("weapon", state.weapon);
  if (state.ammo) params.set("ammo", state.ammo);
  return params.toString();
}

export function decodeAmmoMatcherState(
  value: string,
  allowedWeaponSlugs: readonly string[],
  allowedAmmoSlugs: readonly string[],
): AmmoMatcherState {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  return {
    weapon: readSingleAllowedParam(params, "weapon", new Set(allowedWeaponSlugs)),
    ammo: readSingleAllowedParam(params, "ammo", new Set(allowedAmmoSlugs)),
  };
}

export function encodeProgressionRouteState(state: ProgressionRouteState) {
  const params = new URLSearchParams({pr_role: state.role});
  if (state.currentLevel !== null) params.set("pr_level", String(state.currentLevel));
  return params.toString();
}

export function decodeProgressionRouteState(
  value: string,
  allowedRoles: readonly string[],
): ProgressionRouteState {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const role = readSingleAllowedParam(params, "pr_role", new Set(allowedRoles)) ?? allowedRoles[0] ?? "";
  return {
    role,
    currentLevel: readSingleBoundedIntegerParam(params, "pr_level", 999),
  };
}

export function encodeLogisticsPlanState(state: LogisticsPlanState) {
  return new URLSearchParams({lp_stages: state.stages.length > 0 ? state.stages.join(",") : "none"}).toString();
}

export function decodeLogisticsPlanState(
  value: string,
  allowedStages: readonly string[],
): LogisticsPlanState {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  const values = params.getAll("lp_stages");
  if (values.length === 0) return {stages: [...allowedStages]};
  if (values.length !== 1) return {stages: [...allowedStages]};
  if (values[0] === "none") return {stages: []};

  const stages = values[0].split(",").filter(Boolean);
  const allowed = new Set(allowedStages);
  if (
    stages.length === 0
    || new Set(stages).size !== stages.length
    || stages.some((stage) => !allowed.has(stage))
  ) {
    return {stages: [...allowedStages]};
  }
  return {stages};
}
