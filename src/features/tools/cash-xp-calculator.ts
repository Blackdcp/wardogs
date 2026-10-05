export type CashXpPlan = {
  count: number;
  cashPerAction: number;
  xpPerAction: number;
  cashMultiplier: number;
  xpMultiplier: number;
  repeatEfficiency: number;
  kitCost: number;
  vehicleCost: number;
  targetCash: number;
  targetXp: number;
};

export type CashXpResult = {
  grossCash: number;
  grossXp: number;
  cost: number;
  netCash: number;
  cashGap: number;
  xpGap: number;
  breakEvenActions: number | null;
};

export const defaultCashXpPlan: CashXpPlan = {
  count: 10,
  cashPerAction: 100,
  xpPerAction: 75,
  cashMultiplier: 1,
  xpMultiplier: 1,
  repeatEfficiency: 100,
  kitCost: 0,
  vehicleCost: 0,
  targetCash: 0,
  targetXp: 0,
};

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function whole(value: number) {
  return Math.round(value);
}

export function normalizeCashXpPlan(input: Partial<CashXpPlan>): CashXpPlan {
  return {
    count: whole(clamp(input.count ?? defaultCashXpPlan.count, 1, 1000)),
    cashPerAction: money(clamp(input.cashPerAction ?? defaultCashXpPlan.cashPerAction, 0, 1_000_000)),
    xpPerAction: money(clamp(input.xpPerAction ?? defaultCashXpPlan.xpPerAction, 0, 1_000_000)),
    cashMultiplier: money(clamp(input.cashMultiplier ?? defaultCashXpPlan.cashMultiplier, 0.1, 3)),
    xpMultiplier: money(clamp(input.xpMultiplier ?? defaultCashXpPlan.xpMultiplier, 0.1, 3)),
    repeatEfficiency: whole(clamp(input.repeatEfficiency ?? defaultCashXpPlan.repeatEfficiency, 1, 100)),
    kitCost: money(clamp(input.kitCost ?? defaultCashXpPlan.kitCost, 0, 1_000_000)),
    vehicleCost: money(clamp(input.vehicleCost ?? defaultCashXpPlan.vehicleCost, 0, 1_000_000)),
    targetCash: money(clamp(input.targetCash ?? defaultCashXpPlan.targetCash, 0, 1_000_000)),
    targetXp: money(clamp(input.targetXp ?? defaultCashXpPlan.targetXp, 0, 1_000_000)),
  };
}

export function calculateCashXpPlan(input: CashXpPlan): CashXpResult {
  const plan = normalizeCashXpPlan(input);
  const efficiency = plan.repeatEfficiency / 100;
  const grossCash = money(plan.count * plan.cashPerAction * plan.cashMultiplier * efficiency);
  const grossXp = money(plan.count * plan.xpPerAction * plan.xpMultiplier * efficiency);
  const cost = money(plan.kitCost + plan.vehicleCost);
  const netCash = money(grossCash - cost);
  const cashGap = money(Math.max(0, plan.targetCash - netCash));
  const xpGap = money(Math.max(0, plan.targetXp - grossXp));
  const cashPerEffectiveAction = plan.cashPerAction * plan.cashMultiplier * efficiency;
  const breakEvenActions = cashPerEffectiveAction <= 0 ? null : Math.ceil(cost / cashPerEffectiveAction);
  return {grossCash, grossXp, cost, netCash, cashGap, xpGap, breakEvenActions};
}

export function encodeCashXpPlan(plan: CashXpPlan) {
  const normalized = normalizeCashXpPlan(plan);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(normalized)) params.set(key, String(value));
  return params.toString();
}

export function decodeCashXpPlan(search: string): CashXpPlan {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const parsed: Partial<CashXpPlan> = {};
  for (const key of Object.keys(defaultCashXpPlan) as Array<keyof CashXpPlan>) {
    const values = params.getAll(key);
    if (values.length === 1) parsed[key] = Number(values[0]);
  }
  return normalizeCashXpPlan(parsed);
}
