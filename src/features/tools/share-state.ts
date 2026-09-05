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

const hardwareTiers = new Set<HardwareTier>(["below", "minimum", "recommended", "unknown"]);
const windowsVersions = new Set<WindowsVersion>(["windows-10", "windows-11", "unsupported"]);

function parseBoundedInteger(value: string | null, maximum = 1_000_000) {
  if (value === null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 && parsed <= maximum ? parsed : null;
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
