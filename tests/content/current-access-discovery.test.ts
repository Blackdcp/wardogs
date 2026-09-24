import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

describe("current access discovery from historical search landings", () => {
  it.each(["wardogs-beta", "wardogs-playtest"])("answers the expired %s intent before linking to current guides", async (slug) => {
    const guide = await loadGuideDocument("en", slug);
    const quickAnswer = guide?.body.split(/## Quick Answer\r?\n/)[1]?.split(/\r?\n## /)[0] ?? "";

    expect(guide?.frontmatter.updatedAt).toBe("2026-09-24");
    expect(quickAnswer).toMatch(/(?:not live|window is closed)/i);
    expect(quickAnswer).toContain("September 6");
    expect(guide?.body).toContain("](/en/guides/wardogs-early-access)");
    expect(guide?.body).toContain("](/en/guides/wardogs-season-2)");
  });
});
