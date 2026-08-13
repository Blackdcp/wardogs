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
      "20 topics x 4 locales",
      "WARDOGS is a fan-made guide"
    ]) expect(readme).toContain(phrase);
  });
});
