import {describe, expect, it} from "vitest";
import {calculateGoldBudget, type GoldBudgetInput} from "../../src/features/markets/gold-budget";
const input: GoldBudgetInput = {target: "30", owned: "21", cash: "1000000", reserve: "200000", offerGold: "9", offerCash: "750000"};
describe("one-off Gold offer budget", () => {
  it("preserves the reserve without extrapolating a market rate", () => {
    expect(calculateGoldBudget(input)).toEqual({status: "fits", missing: 9, remainingCash: 250000, reserveGap: 0, uncoveredGold: 0});
    expect(calculateGoldBudget({...input, offerGold: "3"})).toMatchObject({status: "shortOffer", uncoveredGold: 6, remainingCash: 250000});
  });
  it("distinguishes payable offers from protected playing cash", () => {
    expect(calculateGoldBudget({...input, offerCash: "900000"})).toMatchObject({status: "reserveRisk", reserveGap: 100000});
    expect(calculateGoldBudget({...input, offerCash: "1100000"})).toMatchObject({status: "unaffordable", remainingCash: -100000});
  });
  it("never charges an unnecessary exchange when the target is owned", () => {
    expect(calculateGoldBudget({...input, owned: "35"})).toMatchObject({status: "owned", missing: 0, remainingCash: 1000000});
  });
  it("treats exact decimal cash and Gold boundaries as sufficient", () => {
    expect(calculateGoldBudget({target: "0.8", owned: "0.7", cash: "1", reserve: "0.2", offerGold: "0.1", offerCash: "0.8"})).toEqual({status: "fits", missing: 0.1, remainingCash: 0.2, reserveGap: 0, uncoveredGold: 0});
    expect(calculateGoldBudget({...input, offerCash: "900000.01"})).toMatchObject({status: "reserveRisk", reserveGap: 100000.01});
    expect(calculateGoldBudget({...input, cash: "0.001"})).toEqual({status: "invalid"});
  });
  it("keeps absent and invalid inputs distinct from zero", () => {
    expect(calculateGoldBudget({...input, cash: ""})).toEqual({status: "incomplete"});
    for (const value of ["-1", "Infinity", "NaN", "1000000000001"]) expect(calculateGoldBudget({...input, cash: value})).toEqual({status: "invalid"});
    expect(calculateGoldBudget({...input, cash: "0"})).toMatchObject({status: "unaffordable"});
  });
});
