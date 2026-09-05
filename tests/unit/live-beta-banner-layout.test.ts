import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("LiveBetaBanner layout", () => {
  it("keeps primary status, countdown, and actions separate from secondary details", () => {
    const source = readFileSync(path.resolve("src/components/live-ops/live-beta-banner.tsx"), "utf8");

    expect(source).toContain("data-live-summary-row");
    expect(source).toContain("data-live-detail-row");
    expect(source).toContain("lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.62fr)_auto]");
    expect(source).not.toContain("xl:grid-cols-[1.15fr_0.72fr_1fr_auto]");
    expect(source).not.toContain('t("closedBetaNote")');
  });
});
