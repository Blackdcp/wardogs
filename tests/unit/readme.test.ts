import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

describe("project handoff", () => {
  it("documents setup, content rules, verification, and deployment origin", async () => {
    const readme = await readFile("README.md", "utf8");
    for (const phrase of [
      "NEXT_PUBLIC_SITE_URL",
      "npm.cmd run content:validate",
      "npm.cmd run links:check",
      "npm.cmd run test:e2e",
      "33 topics x 5 locales",
      "WARDOGS is a fan-made guide"
    ]) expect(readme).toContain(phrase);
  });

  it("pins Release 1 deployment to the complete Task 8 boundary", async () => {
    const plan = await readFile("docs/superpowers/plans/2026-08-17-wardogs-catalogue-upgrade.md", "utf8");

    expect(plan).toContain("ebb312d301347af7cac7fa4eafb414fd1ca7a5c1");
    expect(plan).not.toContain('git log --grep="feat: complete catalogue architecture rollout"');
  });
});
