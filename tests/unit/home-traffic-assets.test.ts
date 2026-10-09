import {describe, expect, expectTypeOf, it} from "vitest";
import {listGuideSummaries} from "../../src/content/guides";
import {locales, type Locale} from "../../src/config/site";
import type {DiscoveryTask, HomeSection} from "../../src/features/discovery/discovery-types";
import * as traffic from "../../src/features/home/home-traffic-assets";
import * as discovery from "../../src/features/discovery/discovery-types";

const baseline: Record<Locale, readonly string[]> = {
  en: ["infantry-mode", "community-servers-guide", "crash-fix", "season-2", "mortar-guide", "artillery-guide"],
  ja: ["infantry-mode", "squad-guide", "mortar-guide", "towers-guide", "best-weapons-loadouts", "cargo-guide"],
  ru: ["infantry-mode", "crash-fix", "mortar-guide", "best-settings", "progression-wipes-guide", "squad-guide"],
  de: ["infantry-mode", "best-weapons-loadouts", "best-settings", "progression-wipes-guide", "crash-fix", "season-2"],
  "zh-cn": ["infantry-mode", "map", "mortar-guide", "equipment-tools-guide", "crash-fix", "season-2"],
  "zh-tw": ["infantry-mode", "map", "mortar-guide", "equipment-tools-guide", "crash-fix", "season-2"],
  "pt-br": ["infantry-mode", "beginner-guide", "squad-guide", "money-guide", "best-settings", "mortar-guide"],
  pl: ["infantry-mode", "progression-wipes-guide", "crash-fix", "ammo-reload-guide", "community-servers-guide", "season-2"]
};

describe("traffic-protected home demand", () => {
  it("restores localized demand as compact handoffs without consuming protected cards", () => {
    expect(traffic.getHomeDemandHandoffs("ja")).toEqual([{href: "/guides/wardogs-progression-wipes-guide", task: "progression"}]);
    for (const locale of ["ru", "de", "zh-tw"] as const) {
      expect(traffic.getHomeDemandHandoffs(locale)).toEqual([{href: "/gold-market", task: "money"}]);
    }
    for (const locale of locales) {
      expect(traffic.getHomeDemandHandoffs(locale).length).toBeLessThanOrEqual(1);
      expect(traffic.LOCALIZED_PRIORITY_SLUGS[locale]).toHaveLength(6);
    }
  });
  it.each(locales)("keeps the frozen six guide destinations for %s", async (locale) => {
    const summaries = await listGuideSummaries(locale);
    const assets = traffic.getHomeProtectedDemand(summaries, locale);
    const hrefs = baseline[locale].map((slug) => `/guides/wardogs-${slug}`);

    expect(assets.map((asset) => asset.href)).toEqual(hrefs);
    expect(assets).toHaveLength(6);
    expect(new Set(assets.map((asset) => asset.href)).size).toBe(6);
    for (const asset of assets) {
      expect(summaries.some((guide) => asset.href === `/guides/${guide.slug}`)).toBe(true);
      expect(asset.kind).toBe("guide");
      expect(asset.tier).toBe("protected");
      expect(asset.locales === "all" || asset.locales.includes(locale)).toBe(true);
      expect(discovery.isDiscoveryTask(asset.task)).toBe(true);
      expect(asset.labelKey).not.toBe("");
      expect(asset.evidenceKeys).toContain(`spec-baseline:home-priority:${locale}`);
      expect(Object.keys(asset).sort()).toEqual(["evidenceKeys", "href", "id", "kind", "labelKey", "locales", "task", "tier"]);
    }
    // /items belongs to the database model and must never consume one of these six slots.
    expect(assets.some((asset) => asset.href === "/items")).toBe(false);
  });

  it("only fills a missing local priority with an available global fallback", async () => {
    const guides = await listGuideSummaries("ja");
    const sparse = guides.filter((guide) => guide.slug !== "wardogs-squad-guide");
    expect(traffic.getHomeProtectedDemand(sparse, "ja").map((asset) => asset.href)).toEqual([
      "/guides/wardogs-infantry-mode", "/guides/wardogs-mortar-guide", "/guides/wardogs-towers-guide",
      "/guides/wardogs-best-weapons-loadouts", "/guides/wardogs-cargo-guide", "/guides/wardogs-season-2"
    ]);
    expect(traffic.getHomeProtectedDemand(sparse, "ja").at(-1)?.evidenceKeys).toContain("spec-baseline:home-priority:global");
  });

  it("deduplicates repeated summaries and never invents a missing guide", () => {
    const guides = [{slug: "wardogs-cargo-guide", updatedAt: "2026-10-01"}];
    expect(traffic.getHomeProtectedDemand([...guides, ...guides], "ja").map((asset) => asset.href)).toEqual([
      "/guides/wardogs-cargo-guide"
    ]);
    expect(traffic.getHomeProtectedDemand([], "ja")).toEqual([]);
  });

  it("preserves the global fallback for an omitted or unsupported locale", () => {
    const guides = ["wardogs-season-2", "wardogs-beginner-guide", "wardogs-infantry-mode"].map((slug) => ({slug}));
    const hrefs = ["/guides/wardogs-infantry-mode", "/guides/wardogs-season-2", "/guides/wardogs-beginner-guide"];
    expect(traffic.getHomeProtectedDemand(guides).map((asset) => asset.href)).toEqual(hrefs);
    expect(traffic.getHomeProtectedDemand(guides, "unknown").map((asset) => asset.href)).toEqual(hrefs);
  });
});

describe("discovery taxonomy", () => {
  it("accepts exactly the six stable home sections", () => {
    expect(discovery.HOME_SECTIONS).toEqual(["command", "proven-demand", "live-intel", "workbench", "database", "library"]);
    for (const value of discovery.HOME_SECTIONS) expect(discovery.isHomeSection(value)).toBe(true);
    for (const value of ["hero", "guide-hub", "", undefined, 1]) expect(discovery.isHomeSection(value)).toBe(false);
    expectTypeOf<HomeSection>().toEqualTypeOf<"command" | "proven-demand" | "live-intel" | "workbench" | "database" | "library">();
  });

  it("keeps existing analytics task names and rejects arbitrary slugs", () => {
    const tasks = ["search", "map", "calculator", "weapons", "vehicles", "status", "catalogue", "guides", "tools", "videos", "news", "cargo", "squad", "towers", "progression", "mortar", "fob", "controls", "helicopter", "settings", "pcFixes", "season2", "patchNotes", "money", "firstMatch", "loadout", "logistics", "systemCheck", "faq", "about"];
    expect(discovery.DISCOVERY_TASKS).toEqual(tasks);
    for (const task of tasks) expect(discovery.isDiscoveryTask(task)).toBe(true);
    for (const task of ["wardogs-cargo-guide", "pc-fixes", "first-match", "unknown", "", undefined, 1]) {
      expect(discovery.isDiscoveryTask(task)).toBe(false);
    }
    expectTypeOf<"firstMatch" | "pcFixes" | "faq">().toExtend<DiscoveryTask>();
    // @ts-expect-error A dynamic guide slug is not an analytics task.
    const invalidTask: DiscoveryTask = "wardogs-cargo-guide";
    expect(discovery.isDiscoveryTask(invalidTask)).toBe(false);
  });
});
