import {describe, expect, it} from "vitest";
import {buildRelatedGuideHref, getRelatedGuides} from "../../src/features/guides/related";
import {localizeMdxInternalLinks} from "../../src/content/guides";

describe("related guides", () => {
  it("selects category neighbors without returning the current guide", async () => {
    const related = await getRelatedGuides("en", "wardogs-alpha", 3);
    expect(related.map(({slug}) => slug)).toEqual([
      "wardogs-playtest",
      "wardogs-beta",
      "wardogs-alpha-key"
    ]);
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
