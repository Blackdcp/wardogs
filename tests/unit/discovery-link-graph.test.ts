import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {guideManifest} from "../../src/content/manifest";
import {GuideTaskPanel} from "../../src/components/guides/guide-task-panel";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {getRelatedGuides} from "../../src/features/guides/related";
import {isItemDetailRouteAvailable, resolveItemRouteTarget} from "../../src/features/items/item-route-availability";
import {TOOL_REGISTRY} from "../../src/features/tools/tool-registry";

const families = [
  {id: "weapons-ammo", guide: "wardogs-best-weapons-loadouts", tool: "weapon-compare", catalogue: "/items/weapons"},
  {id: "money-loadout", guide: "wardogs-money-guide", tool: "loadout-budget", catalogue: "/items/loadouts"},
  {id: "cargo-fob-oil-rig", guide: "wardogs-cargo-guide", tool: "logistics-planner", catalogue: "/items/vehicles"},
  {id: "season-progression", guide: "wardogs-progression-wipes-guide", tool: "progression-route"},
  {id: "map-mortar-artillery", guide: "wardogs-artillery-guide", tool: "artillery-calculator", catalogue: "/items/mechanics"},
  {id: "settings-crash", guide: "wardogs-crash-fix", tool: "system-check"}
] as const;

describe("discovery task link graph", () => {
  it.each(locales)("provides meaningful guide→tool/catalogue and tool→guide return edges for all six families in %s", async (locale) => {
    const modulePath = "../../src/components/tools/tool-related-guides";
    const relatedModule = await import(modulePath).catch(() => undefined);
    expect(relatedModule, "Tool continuation component must exist").toBeDefined();
    for (const family of families) {
      const data = getGuideTaskData(family.guide, locale);
      expect(data, family.id).toBeDefined();
      expect(data!.relatedTools?.some((link: {href: string}) => link.href === `/tools/${family.tool}`), family.id).toBe(true);
      if ("catalogue" in family) expect(data!.relatedCatalogue?.some((link: {href: string}) => link.href === family.catalogue), family.id).toBe(true);
      const links = await relatedModule!.buildToolRelatedLinks(family.tool, locale);
      expect(links.guides.some((guide: {slug: string}) => guide.slug === family.guide), family.id).toBe(true);
      const html = renderToStaticMarkup(React.createElement(relatedModule!.ToolRelatedGuidesView, {model: links, locale}));
      expect(html.includes(`href="/${locale}/guides/${family.guide}"`), family.id).toBe(true);
      for (const guide of links.guides) expect(guideManifest.some((entry) => entry.slug === guide.slug)).toBe(true);
      for (const link of links.catalogue) {
        const target = resolveItemRouteTarget(locale, link.href);
        if (/^\/items\/[^/]+\/[^/]+$/.test(target.pathname)) expect(isItemDetailRouteAvailable(target.locale, target.pathname)).toBe(true);
      }
    }
  });
  it("adds artillery to the approved task mappings without giving PC fixes unrelated catalogue links", () => {
    expect(getGuideTaskData("wardogs-artillery-guide", "en")?.relatedTool?.href).toBe("/tools/artillery-calculator");
    expect(getGuideTaskData("wardogs-crash-fix", "en")?.relatedCatalogue).toEqual([]);
    expect(getGuideTaskData("wardogs-best-settings", "en")?.relatedCatalogue).toEqual([]);
  });
  it("returns from published item records to local task guides and keeps historical access links intact", async () => {
    const relatedPath = "../../src/features/guides/related";
    const relatedModule = await import(relatedPath);
    expect(relatedModule.getItemRelatedGuides, "Item task return resolver must exist").toBeTypeOf("function");
    for (const locale of locales) {
      const weapon = await relatedModule.getItemRelatedGuides(locale, {type: "weapons", slug: "amp-9", relatedGuides: ["wardogs-gameplay"]});
      expect(weapon.some((guide: {slug: string}) => guide.slug === "wardogs-best-weapons-loadouts")).toBe(true);
      const artillery = await relatedModule.getItemRelatedGuides(locale, {type: "vehicles", slug: "sph-2", relatedGuides: []});
      expect(artillery.some((guide: {slug: string}) => guide.slug === "wardogs-artillery-guide")).toBe(true);
      const logistics = await relatedModule.getItemRelatedGuides(locale, {type: "vehicles", slug: "bobcat", relatedGuides: []});
      expect(logistics.some((guide: {slug: string}) => guide.slug === "wardogs-cargo-guide")).toBe(true);
    }
    expect((await getRelatedGuides("en", "wardogs-alpha", 3)).map(({slug}) => slug)).toEqual(["wardogs-early-access", "wardogs-beta", "wardogs-season-2"]);
  });
  it("renders every registry tool's own guide context and rejects unknown tool IDs", async () => {
    const modulePath = "../../src/components/tools/tool-related-guides";
    const relatedModule = await import(modulePath).catch(() => undefined);
    expect(relatedModule, "Tool continuation component must exist").toBeDefined();
    for (const tool of TOOL_REGISTRY) {
      const model = await relatedModule!.buildToolRelatedLinks(tool.id, "en");
      expect(model.guides.map((guide: {slug: string}) => guide.slug)).toEqual(tool.relatedGuideSlugs);
    }
    await expect(relatedModule!.buildToolRelatedLinks("unknown", "en")).rejects.toThrow("unknown");
  });
});


describe("rendered guide task continuations", () => {
  it.each(locales)("renders all configured tool and category edges in %s", (locale) => {
    for (const family of families) {
      const data = getGuideTaskData(family.guide, locale)!;
      const html = renderToStaticMarkup(React.createElement(GuideTaskPanel, {data, locale}));
      for (const link of data.relatedTools) expect(html.includes(`href="/${locale}${link.href}"`), family.id).toBe(true);
      for (const link of data.relatedCatalogue) expect(html.includes(`href="/${link.locale}${link.href}"`), family.id).toBe(true);
    }
  });
});
