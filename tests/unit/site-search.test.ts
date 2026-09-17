import {readFileSync} from "node:fs";
import path from "node:path";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {SiteSearch} from "../../src/components/home/site-search";
import {locales} from "../../src/config/site";
import {listGuideSummaries} from "../../src/content/guides";
import {itemLibrary} from "../../src/features/items/item-library";
import {buildNavigation} from "../../src/features/navigation/navigation-data";
import {
  buildSiteSearchIndex,
  getNextSearchSelection,
  getSearchKeyboardAction,
  getSiteSearchCounts,
  searchSiteIndex,
  type SiteSearchEntry
} from "../../src/features/search/site-search-index";
import {currentVideoSources} from "../../src/features/videos/video-library";

const fixture = (overrides: Partial<SiteSearchEntry>): SiteSearchEntry => ({
  id: "guide:fixture",
  type: "guide",
  title: "Fixture",
  aliases: [],
  summary: "Fixture summary",
  taskIntent: [],
  category: "Guide",
  href: "/guides/fixture",
  ...overrides
});

describe("site search index", () => {
  it("indexes guides, indexable item routes, current videos, and navigation-owned tools", async () => {
    const index = await buildSiteSearchIndex("en");
    const counts = getSiteSearchCounts(index);
    const guides = await listGuideSummaries("en");
    const indexableItems = itemLibrary.filter((item) => item.indexable && item.indexLocales.includes("en"));
    const toolHrefs = new Set(
      buildNavigation((key) => key)
        .flatMap((group) => group.items)
        .filter((item) => item.searchType === "tool")
        .map((item) => item.href)
    );

    expect(new Set(index.map((entry) => entry.type))).toEqual(new Set(["guide", "item", "video", "tool"]));
    expect(counts).toEqual({
      guides: guides.length,
      items: indexableItems.length,
      videos: currentVideoSources.length,
      tools: toolHrefs.size
    });
    expect(new Set(index.filter((entry) => entry.type === "tool").map((entry) => entry.href))).toEqual(toolHrefs);
  });

  it("never exposes a generic or gated item detail route", async () => {
    const index = await buildSiteSearchIndex("en");
    const gated = itemLibrary.find((item) => !item.indexable);

    expect(gated).toBeDefined();
    expect(index.some((entry) => entry.href === `/items/${gated!.type}/${gated!.slug}`)).toBe(false);
    expect(index.filter((entry) => entry.type === "item").every((entry) => /^\/items\/[^/]+\/[^/]+$/.test(entry.href))).toBe(true);
  });

  it("ranks exact aliases before prefixes and broad token matches", () => {
    const index: SiteSearchEntry[] = [
      fixture({id: "guide:tokens", title: "Protect your squad cash", summary: "A practical money guide"}),
      fixture({id: "guide:prefix", title: "Money guide for support players"}),
      fixture({id: "guide:alias", title: "Persistent cash workflow", aliases: ["money guide"]})
    ];

    expect(searchSiteIndex(index, "  MONEY   guide  ").map((entry) => entry.id)).toEqual([
      "guide:alias",
      "guide:prefix",
      "guide:tokens"
    ]);
  });

  it("keeps keyboard selection deterministic at every boundary", () => {
    expect(getNextSearchSelection(-1, "ArrowDown", 3)).toBe(0);
    expect(getNextSearchSelection(2, "ArrowDown", 3)).toBe(0);
    expect(getNextSearchSelection(-1, "ArrowUp", 3)).toBe(2);
    expect(getNextSearchSelection(0, "ArrowUp", 3)).toBe(2);
    expect(getNextSearchSelection(1, "Home", 3)).toBe(0);
    expect(getNextSearchSelection(1, "End", 3)).toBe(2);
    expect(getNextSearchSelection(0, "ArrowDown", 0)).toBe(-1);

    const result = fixture({id: "guide:open-me", href: "/guides/open-me"});
    expect(getSearchKeyboardAction("Escape", 0, [result])).toEqual({type: "clear"});
    expect(getSearchKeyboardAction("Enter", 0, [result])).toEqual({type: "open", href: "/guides/open-me"});
    expect(getSearchKeyboardAction("Enter", -1, [result])).toEqual({type: "none"});
    expect(getSearchKeyboardAction("ArrowDown", -1, [result])).toEqual({type: "select", index: 0});
  });

  it("renders a labelled combobox and a stable result region", () => {
    const html = renderToStaticMarkup(
      React.createElement(SiteSearch, {
        copy: {
          eyebrow: "Search the field reference",
          title: "Find the next answer",
          description: "Search every maintained surface.",
          label: "Search WARDOGS Wiki",
          placeholder: "Search guides, items, videos, and tools",
          prompt: "Type a task, item, or question.",
          empty: "No maintained result found.",
          resultCount: "{count} results",
          openResult: "Open result",
          types: {guide: "Guide", item: "Item", video: "Video", tool: "Tool", map: "Map"},
          counts: {guides: "Guides", items: "Items", videos: "Current videos", tools: "Tools"}
        },
        counts: {guides: 47, items: 12, videos: 8, tools: 2},
        index: [],
        locale: "en"
      })
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-controls="site-search-results"');
    expect(html).toContain('data-site-search-results="stable"');
    expect(html).toContain("h-[308px] overflow-y-auto");
    expect(html).toContain("Search guides, items, videos, and tools");
  });

  it("provides complete localized search, action, build-change, and metadata copy", () => {
    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(path.resolve("messages", `${locale}.json`), "utf8"));
      expect(messages.home.metaTitle, locale).toEqual(expect.any(String));
      expect(messages.home.metaDescription, locale).toEqual(expect.any(String));
      expect(Object.keys(messages.home.actions).sort(), locale).toEqual([
        "controls", "description", "eyebrow", "firstMatch", "logistics", "money", "pcFixes", "progression", "title", "vehicles", "weapons"
      ]);
      expect(messages.home.search.types, locale).toEqual(expect.objectContaining({guide: expect.any(String), item: expect.any(String), video: expect.any(String), tool: expect.any(String), map: expect.any(String)}));
      expect(messages.home.search.counts, locale).toEqual(expect.objectContaining({guides: expect.any(String), items: expect.any(String), videos: expect.any(String), tools: expect.any(String)}));
      expect(Object.keys(messages.home.buildChanges.entries).sort(), locale).toEqual([
        "artilleryTank", "deagle", "duneBuggy", "fobVendor", "largeHammer", "ural"
      ]);
    }
  });
});
