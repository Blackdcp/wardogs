import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";

const helperPath = path.join(process.cwd(), "src", "features", "tools", "share-state.ts");

describe("shareable player tools", () => {
  it("publishes both tool entry pages in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn"]) {
      expect(urls.has(`http://localhost:3000/${locale}/tools/system-check`)).toBe(true);
      expect(urls.has(`http://localhost:3000/${locale}/tools/loadout-budget`)).toBe(true);
    }
  });

  it("round-trips a system-check result through a compact URL state", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {decodeSystemCheckState, encodeSystemCheckState, evaluateSystemCheck} = await import("../../src/features/tools/share-state");
    const state = {os: "windows-11", ramGb: 32, storageGb: 84, cpuTier: "recommended", gpuTier: "minimum"} as const;

    const encoded = encodeSystemCheckState(state);
    expect(decodeSystemCheckState(encoded)).toEqual(state);
    expect(evaluateSystemCheck(state)).toEqual({level: "minimum", limiting: ["gpuTier"]});
  });

  it("rejects malformed shared state instead of inventing values", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {decodeSystemCheckState, decodeBudgetState} = await import("../../src/features/tools/share-state");
    expect(decodeSystemCheckState("os=linux&ram=lots")).toBeNull();
    expect(decodeBudgetState("cash=-1&loadout=oops")).toBeNull();
  });

  it("round-trips and calculates a loadout budget without using unverified item prices", async () => {
    expect(existsSync(helperPath), "share-state helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const {calculateBudget, decodeBudgetState, encodeBudgetState} = await import("../../src/features/tools/share-state");
    const state = {cash: 10_000, loadout: 3_200, vehicle: 1_500, reserve: 2_000};

    expect(decodeBudgetState(encodeBudgetState(state))).toEqual(state);
    expect(calculateBudget(state)).toEqual({spent: 4_700, remaining: 5_300, reserveMet: true});
  });

  it("balances long localized tool headings on narrow screens", () => {
    for (const route of ["system-check", "loadout-budget"]) {
      const source = readFileSync(path.join(process.cwd(), "src", "app", "[locale]", "tools", route, "page.tsx"), "utf8");
      expect(source, route).toContain("text-balance");
    }
  });
});
