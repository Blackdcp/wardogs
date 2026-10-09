import {afterEach, describe, expect, it, vi} from "vitest";
import {buildRelatedGuideHref, getItemRelatedGuides, getRelatedGuides} from "../../src/features/guides/related";
import {getItemBySlug} from "../../src/features/items/item-library";
import {localizeMdxInternalLinks} from "../../src/content/guides";
import {locales} from "../../src/config/site";

describe("related guides", () => {
  afterEach(() => vi.unstubAllEnvs());
  it.each(locales)("continues the season, wipe and issue tasks in %s", async (locale) => {
    for (const [slug, expected] of [
      ["wardogs-season-2", ["wardogs-progression-wipes-guide", "wardogs-what-to-buy-before-wipe", "wardogs-patch-notes"]],
      ["wardogs-progression-wipes-guide", ["wardogs-what-to-buy-before-wipe", "wardogs-money-guide", "wardogs-season-2"]],
      ["wardogs-patch-notes", ["wardogs-season-2", "wardogs-server-status", "wardogs-known-issues"]],
      ["wardogs-community-servers-guide", ["wardogs-server-status", "wardogs-squad-guide", "wardogs-progression-wipes-guide"]]
    ] as const) {
      expect((await getRelatedGuides(locale, slug)).map(({slug}) => slug)).toEqual(expected);
    }
  });
  const operatingTasks = [
    ["wardogs-artillery-guide", "wardogs-mortar-guide"],
    ["wardogs-mortar-guide", "wardogs-artillery-guide"],
    ["wardogs-cargo-guide", "wardogs-fob-guide"],
    ["wardogs-fob-guide", "wardogs-cargo-guide"],
    ["wardogs-fob-layouts", "wardogs-fob-guide"],
    ["wardogs-equipment-tools-guide", "wardogs-best-weapons-loadouts"],
    ["wardogs-controls", "wardogs-crash-fix"],
    ["wardogs-crash-fix", "wardogs-known-issues"]
  ];
  it.each(locales)("keeps operating continuations before category fallbacks in %s", async (locale) => {
    for (const [slug, continuation] of operatingTasks) {
      const related = await getRelatedGuides(locale, slug, 3);
      expect(related[0]?.slug, slug).toBe(continuation);
      expect(related).toHaveLength(3);
      expect(new Set(related.map(({slug}) => slug)).size).toBe(3);
      expect(related.some((guide) => guide.slug === slug)).toBe(false);
    }
  });

  it.each([
    ["mortar", "wardogs-mortar-guide"],
    ["l81-mortar", "wardogs-mortar-guide"],
    ["sph-2", "wardogs-artillery-guide"]
  ])("leads the English %s item to its own operating guide", async (slug, continuation) => {
    const item = getItemBySlug(slug)!;
    expect(item).toBeDefined();
    const related = await getItemRelatedGuides("en", item);
    expect(related[0]?.slug).toBe(continuation);
    expect(related.map(({slug}) => slug)).toEqual(expect.arrayContaining([
      "wardogs-mortar-guide", "wardogs-artillery-guide", "wardogs-map"
    ]));
  });

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

  it("preserves the base path and directory route for an auxiliary static export", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    expect(buildRelatedGuideHref("ja", "wardogs-mortar-guide")).toBe("/wardogs/ja/guides/wardogs-mortar-guide/");
  });

  it.each(locales)("leads mortar items to the matching operating guide in %s", async (locale) => {
    for (const slug of ["mortar", "l81-mortar"]) {
      const related = await getItemRelatedGuides(locale, getItemBySlug(slug)!);
      expect(related[0].slug).toBe("wardogs-mortar-guide");
      expect(new Set(related.map(({slug}) => slug)).size).toBe(related.length);
    }
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
