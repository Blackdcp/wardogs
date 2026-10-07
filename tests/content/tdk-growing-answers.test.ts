import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";

describe("answers for growing English search destinations", () => {
  it("puts the seasonal policy and complete asset checklist before historical progression notes", async () => {
    const guide = await loadGuideDocument("en", "wardogs-progression-wipes-guide");
    expect(guide).not.toBeNull();
    const body = guide!.body;
    const assetSection = body.indexOf("## Asset-by-asset wipe checklist");
    expect(body.indexOf("## The official seasonal reset policy")).toBeLessThan(assetSection);
    expect(assetSection).toBeGreaterThan(0);
    expect(assetSection).toBeLessThan(body.indexOf("## Season 1 unlock quick reference"));
    expect(assetSection).toBeLessThan(body.indexOf("Current build checkpoint"));
    for (const asset of ["Cash", "Career and role XP", "Gold Bars", "Cosmetics", "Paid unlock fees", "Steam achievements"]) {
      expect(body.split("\n").filter((line) => line.startsWith(`| ${asset} |`))).toHaveLength(1);
    }
    const answer = getGuideTaskData("wardogs-progression-wipes-guide", "en")!.directAnswer;
    expect(answer).toContain("resets cash and XP");
    expect(answer).toContain("preserves Gold Bars and cosmetics");
    expect(answer).toContain("does not specify the reset hour");
    expect(body).toContain("Historical Beta-to-Early-Access context");
  });

  it("answers the achievement count and lists all goals before troubleshooting", async () => {
    const guide = await loadGuideDocument("en", "wardogs-achievements");
    expect(guide).not.toBeNull();
    const body = guide!.body;
    expect(body.trimStart()).toMatch(/^## Quick Answer/);
    const goals = body.indexOf("## All 10 Achievements");
    expect(goals).toBeGreaterThan(0);
    expect(goals).toBeLessThan(body.indexOf("## When an achievement does not trigger"));
    expect(body).toContain("without a description");
    expect(body).toContain("$100,000 net profit");
    expect(body).toContain("/en/tools/loadout-budget");
    expect(body).toContain("/en/guides/wardogs-money-guide");
  });
});
