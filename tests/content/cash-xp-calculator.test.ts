import {describe, expect, it} from "vitest";
import {calculateCashXpPlan, normalizeCashXpPlan} from "../../src/features/tools/cash-xp-calculator";

describe("cash and XP calculator", () => {
  it("estimates gross rewards, net cash and target gaps from observed values", () => {
    const result = calculateCashXpPlan({
      count: 5,
      cashPerAction: 120,
      xpPerAction: 80,
      cashMultiplier: 1.5,
      xpMultiplier: 1.25,
      repeatEfficiency: 80,
      kitCost: 300,
      vehicleCost: 100,
      targetCash: 1000,
      targetXp: 600,
    });

    expect(result.grossCash).toBe(720);
    expect(result.grossXp).toBe(400);
    expect(result.cost).toBe(400);
    expect(result.netCash).toBe(320);
    expect(result.cashGap).toBe(680);
    expect(result.xpGap).toBe(200);
    expect(result.breakEvenActions).toBe(3);
  });

  it("bounds hostile shared values before calculation", () => {
    const normalized = normalizeCashXpPlan({
      count: 999999,
      cashPerAction: -10,
      xpPerAction: Number.NaN,
      cashMultiplier: 99,
      xpMultiplier: 0,
      repeatEfficiency: 200,
      kitCost: 1_000_000_000,
      vehicleCost: -5,
      targetCash: -1,
      targetXp: 1_000_000_000,
    });

    expect(normalized).toEqual({
      count: 1000,
      cashPerAction: 0,
      xpPerAction: 0,
      cashMultiplier: 3,
      xpMultiplier: 0.1,
      repeatEfficiency: 100,
      kitCost: 1000000,
      vehicleCost: 0,
      targetCash: 0,
      targetXp: 1000000,
    });
  });
});
