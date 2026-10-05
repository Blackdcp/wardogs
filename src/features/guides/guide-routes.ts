import type {GuideSummary} from "@/content/guides";
import type {Locale} from "@/config/site";
import {getToolDefinition, type ToolDefinition, type ToolId} from "@/features/tools/tool-registry";

export type GuideRouteKey = "new-player" | "combat-operations" | "logistics-live";
export type GuideRouteDefinition = {
  key: GuideRouteKey;
  titleKey: string;
  descriptionKey: string;
  guideSlugs: readonly string[];
  toolIds: readonly ToolId[];
};
export const GUIDE_ROUTES = [
  {key: "new-player", titleKey: "guides.routes.new-player.title", descriptionKey: "guides.routes.new-player.description", guideSlugs: ["wardogs-beginner-guide", "wardogs-squad-guide", "wardogs-money-guide", "wardogs-progression-wipes-guide", "wardogs-crash-fix"], toolIds: ["loadout-budget", "cash-xp-calculator", "progression-route", "system-check"]},
  {key: "combat-operations", titleKey: "guides.routes.combat-operations.title", descriptionKey: "guides.routes.combat-operations.description", guideSlugs: ["wardogs-best-weapons-loadouts", "wardogs-ammo-reload-guide", "wardogs-best-settings", "wardogs-helicopter-guide", "wardogs-towers-guide", "wardogs-map", "wardogs-infantry-mode", "wardogs-mortar-guide", "wardogs-artillery-guide"], toolIds: ["weapon-compare", "ammo-matcher", "map", "artillery-calculator"]},
  {key: "logistics-live", titleKey: "guides.routes.logistics-live.title", descriptionKey: "guides.routes.logistics-live.description", guideSlugs: ["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-oil-rig-guide", "wardogs-equipment-tools-guide", "wardogs-season-2", "wardogs-patch-notes", "wardogs-server-status"], toolIds: ["logistics-planner", "progression-route"]}
] as const satisfies readonly GuideRouteDefinition[];

export type ResolvedGuideRoute<T = GuideSummary> = GuideRouteDefinition & {
  guides: {guide: T; href: string}[];
  tools: {tool: ToolDefinition; href: string}[];
};

export function resolveGuideRoutes<T extends Pick<GuideSummary, "slug">>(guides: readonly T[], locale: Locale): ResolvedGuideRoute<T>[] {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  return GUIDE_ROUTES.map((route) => ({
    ...route,
    guides: route.guideSlugs.map((slug) => {
      const guide = bySlug.get(slug);
      if (!guide) throw new Error(`Missing configured guide route content: ${route.key}/${slug}`);
      return {guide, href: `/${locale}/guides/${slug}`};
    }),
    tools: route.toolIds.map((id) => {
      const tool = getToolDefinition(id);
      if (!tool) throw new Error(`Missing configured route tool: ${route.key}/${id}`);
      return {tool, href: `/${locale}${tool.href}`};
    })
  }));
}
