export const goldBudgetFields = ["target", "owned", "cash", "reserve", "offerGold", "offerCash"] as const;
export type GoldBudgetField = typeof goldBudgetFields[number];
export type GoldBudgetInput = Record<GoldBudgetField, string>;
export type GoldBudgetResult = {status: "incomplete" | "invalid"} | {status: "owned" | "shortOffer" | "unaffordable" | "reserveRisk" | "fits"; missing: number; remainingCash: number; reserveGap: number; uncoveredGold: number};

// Evaluate one actual offer, never extrapolate a changing exchange rate.
export function calculateGoldBudget(input: GoldBudgetInput): GoldBudgetResult {
  const values = goldBudgetFields.map(key => input[key].trim());
  if (values.some(value => value === "")) return {status: "incomplete"} as const;
  const numbers = values.map(Number);
  if (numbers.some(value => !Number.isFinite(value) || value < 0 || value > 1e12)) return {status: "invalid"} as const;
  // Use hundredths so an exact reserve such as 1 - 0.8 = 0.2 is never
  // classified as a shortage because of binary floating-point arithmetic.
  const scaled = numbers.map(value => value * 100);
  if (scaled.some(value => Math.abs(value - Math.round(value)) > Number.EPSILON * Math.max(1, value))) return {status: "invalid"} as const;
  const [target, owned, cash, reserve, offerGold, offerCash] = scaled.map(Math.round);
  const missing = Math.max(0, target - owned);
  const enough = missing === 0;
  const remainingCash = cash - (enough ? 0 : offerCash);
  const reserveGap = Math.max(0, reserve - remainingCash);
  const uncoveredGold = Math.max(0, missing - offerGold);
  const status = enough ? "owned" : uncoveredGold > 0 ? "shortOffer" : remainingCash < 0 ? "unaffordable" : reserveGap > 0 ? "reserveRisk" : "fits";
  return {status, missing: missing / 100, remainingCash: remainingCash / 100, reserveGap: reserveGap / 100, uncoveredGold: uncoveredGold / 100} as const;
}
