import {describe, expect, it} from "vitest";
import {compileGuideBody, loadGuideDocument} from "../../src/content/guides";
import {mdxComponents} from "../../src/components/mdx/mdx-components";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;

describe("Linux, Proton and Steam Deck compatibility matrix", () => {
  it("publishes a table-shaped, source-scoped matrix in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-linux-proton");
      const body = guide?.body ?? "";

      expect(body, locale).toContain("{/* compatibility-matrix */}");
      expect(body, locale).toContain("Proton");
      expect(body, locale).toContain("Steam Deck");
      expect((body.match(/\|/g) ?? []).length, locale).toBeGreaterThanOrEqual(20);
      expect(body, locale).toMatch(/2026-09-25/);
    }
  });

  it.each(locales)("publishes an actionable, source-scoped diagnostic flow in %s", async (locale) => {
    const guide = (await loadGuideDocument(locale, "wardogs-linux-proton"))!;
    const flow = guide.body.split("{/* linux-diagnostic-flow */}")[1]?.split(/^## /m)[0];
    expect(flow).toBeTruthy();
    expect(guide.frontmatter.updatedAt).toBe("2026-10-09");
    expect(guide.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://discord.com/channels/1464219389913071646/1551954554579451924/threads/1551967453574332556",
      kind: "community",
      checkedAt: "2026-10-09"
    }));
    expect(flow).toContain("2026-09-25");
    expect(flow).toContain("2026-10-09");
    expect(flow?.match(/^\| /gm)).toHaveLength(6); // Header, separator, four distinct diagnostic stages.
    expect(flow?.match(/^\d\. /gm)).toHaveLength(4);
    for (const term of ["Proton", "SteamOS", "Steam Deck", "GPU", "WD-L020", "Windows", "Playable/Verified"]) expect(flow, term).toContain(term);
    for (const suffix of ["server-status", "known-issues"]) expect(flow).toContain(`](/${locale}/guides/wardogs-${suffix})`);
    expect(flow).not.toMatch(/PROTON_USE|sudo |winetricks|KB5124010/);
    const compiled = await compileGuideBody(guide.body, mdxComponents);
    expect(compiled.content).toBeTruthy();
  });
});
