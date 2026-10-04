import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("recent tool page design", () => {
  it("keeps the map page inside the site visual system", () => {
    const source = readFileSync(path.resolve("src/app/[locale]/tools/map/page.tsx"), "utf8");

    expect(source).toContain('data-tool-page-hero="map"');
    expect(source).toContain('data-tool-crosslink="artillery"');
    expect(source).not.toContain("bg-sky-950");
    expect(source).not.toContain("text-sky-400");
    expect(source).not.toContain("shadow");
  });

  it("keeps the artillery calculator from drifting into a separate HUD skin", () => {
    const source = readFileSync(path.resolve("src/components/artillery/artillery-calculator.tsx"), "utf8");

    expect(source).toContain('data-tool-calculator-shell="artillery"');
    expect(source).toContain('data-fire-solution-panel="true"');
    expect(source).not.toContain("shadow-[0_0_30px");
    expect(source).not.toContain("border-2 border-[#3c634c]");
    expect(source).not.toContain("bg-gradient-to-r from-[#0d1611]");
  });
});
