import {describe, expect, it} from "vitest";
import {buildRelatedGuideHref, getRelatedGuides} from "../../src/features/guides/related";
import {localizeMdxInternalLinks} from "../../src/content/guides";

describe("related guides", () => {
  it("connects historical access queries to current guides", async () => {
    const related = await getRelatedGuides("en", "wardogs-alpha", 3);
    expect(related.map(({slug}) => slug)).toEqual([
      "wardogs-early-access",
      "wardogs-beta",
      "wardogs-season-2"
    ]);

    for (const locale of ["en", "ja", "zh-cn"] as const) {
      const betaRelated = await getRelatedGuides(locale, "wardogs-beta", 3);
      expect(betaRelated.map(({slug}) => slug)).toEqual([
        "wardogs-early-access",
        "wardogs-season-2",
        "wardogs-server-status"
      ]);
    }
  });

  it("keeps category neighbors for guides without a current-status priority", async () => {
    const related = await getRelatedGuides("en", "wardogs-early-access", 3);
    expect(related).toHaveLength(3);
    expect(new Set(related.map(({slug}) => slug)).size).toBe(3);
    expect(related.every(({slug}) => slug !== "wardogs-early-access")).toBe(true);
    expect(related[0].category).toBe("release");
  });

  it("builds locale-prefixed URLs for static exported related guide links", () => {
    expect(buildRelatedGuideHref("en", "wardogs-factions")).toBe("/en/guides/wardogs-factions");
    expect(buildRelatedGuideHref("pt-br", "wardogs-early-access")).toBe("/pt-br/guides/wardogs-early-access");
  });

  it("localizes handwritten MDX internal guide links before rendering", () => {
    const body = [
      "- [WARDOGS Factions](/guides/wardogs-factions)",
      "- [Already Localized](/en/guides/wardogs-beta)",
      "- [External](https://example.com/guides/wardogs)"
    ].join("\n");

    expect(localizeMdxInternalLinks(body, "en")).toContain("](/en/guides/wardogs-factions)");
    expect(localizeMdxInternalLinks(body, "en")).toContain("](/en/guides/wardogs-beta)");
    expect(localizeMdxInternalLinks(body, "en")).toContain("](https://example.com/guides/wardogs)");
  });
});
