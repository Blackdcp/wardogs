import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getGuideTaskData} from "@/features/guides/guide-task-data";
import {getRecentVideoArticles} from "@/features/videos/recent-video-articles";
import {publicRoutePath} from "@/lib/public-url";

// Historical access searches still land on these pages. Lead readers to the
// current product and roadmap before suggesting another expired test guide.
const currentAccessGuideSlugs: Record<string, readonly string[]> = {
  "wardogs-alpha": ["wardogs-early-access", "wardogs-beta", "wardogs-season-2"],
  "wardogs-alpha-key": ["wardogs-early-access", "wardogs-beta", "wardogs-season-2"],
  "wardogs-beta": ["wardogs-early-access", "wardogs-season-2", "wardogs-server-status"],
  "wardogs-playtest": ["wardogs-early-access", "wardogs-season-2", "wardogs-server-status"]
};

// Keep established operating and troubleshooting guides reachable from adjacent
// localized entry pages instead of allowing manifest order to choose every card.
const operatingTaskGuideSlugs: Record<string, readonly string[]> = {
  "wardogs-artillery-guide": ["wardogs-mortar-guide", "wardogs-map", "wardogs-fob-guide"],
  "wardogs-mortar-guide": ["wardogs-artillery-guide", "wardogs-fob-guide", "wardogs-map"],
  "wardogs-cargo-guide": ["wardogs-fob-guide", "wardogs-equipment-tools-guide", "wardogs-money-guide"],
  "wardogs-fob-guide": ["wardogs-cargo-guide", "wardogs-mortar-guide", "wardogs-fob-layouts"],
  "wardogs-fob-layouts": ["wardogs-fob-guide", "wardogs-cargo-guide", "wardogs-mortar-guide"],
  "wardogs-equipment-tools-guide": ["wardogs-best-weapons-loadouts", "wardogs-ammo-reload-guide", "wardogs-fob-guide"],
  "wardogs-controls": ["wardogs-crash-fix", "wardogs-best-settings", "wardogs-helicopter-guide"],
  "wardogs-crash-fix": ["wardogs-known-issues", "wardogs-best-settings", "wardogs-system-requirements"]
};

// The next task after a seasonal answer is the same in every language. Keep
// dated evergreen pages as destinations instead of manufacturing seasonal URLs.
const seasonalTaskGuideSlugs: Record<string, readonly string[]> = {
  "wardogs-season-2": ["wardogs-progression-wipes-guide", "wardogs-what-to-buy-before-wipe", "wardogs-patch-notes"],
  "wardogs-progression-wipes-guide": ["wardogs-what-to-buy-before-wipe", "wardogs-money-guide", "wardogs-season-2"],
  "wardogs-money-guide": ["wardogs-progression-wipes-guide", "wardogs-what-to-buy-before-wipe", "wardogs-best-weapons-loadouts"],
  "wardogs-what-to-buy-before-wipe": ["wardogs-progression-wipes-guide", "wardogs-money-guide", "wardogs-best-weapons-loadouts"],
  "wardogs-patch-notes": ["wardogs-season-2", "wardogs-server-status", "wardogs-known-issues"],
  "wardogs-server-status": ["wardogs-patch-notes", "wardogs-crash-fix", "wardogs-community-servers-guide"],
  "wardogs-community-servers-guide": ["wardogs-server-status", "wardogs-squad-guide", "wardogs-progression-wipes-guide"],
  "wardogs-known-issues": ["wardogs-crash-fix", "wardogs-server-status", "wardogs-patch-notes"],
  "wardogs-launch-checklist": ["wardogs-beginner-guide", "wardogs-season-2", "wardogs-squad-guide"],
  "wardogs-beginner-guide": ["wardogs-deploy-screen", "wardogs-squad-guide", "wardogs-money-guide"],
  "wardogs-download": ["wardogs-launch-checklist", "wardogs-crash-fix", "wardogs-patch-notes"],
  "wardogs-best-weapons-loadouts": ["wardogs-ammo-reload-guide", "wardogs-armor-damage-ttk-guide", "wardogs-season-2"],
  "wardogs-helicopter-guide": ["wardogs-controls", "wardogs-cargo-guide", "wardogs-fob-guide"],
  "wardogs-roadmap": ["wardogs-season-2", "wardogs-progression-wipes-guide", "wardogs-patch-notes"],
  "wardogs-solo-guide": ["wardogs-low-level-servers", "wardogs-money-guide", "wardogs-squad-guide"],
  "wardogs-report-player": ["wardogs-discord", "wardogs-known-issues", "wardogs-server-status"]
};

export function buildRelatedGuideHref(locale: Locale, slug: string) {
  return publicRoutePath(`/${locale}/guides/${slug}`);
}

// Pages with a task panel already render their source analyses in context.
// Only fill the missing return edge, using the video's explicit guide relation.
export function getGuideRelatedVideoLinks(locale: Locale, slug: string) {
  const existingVideos = getGuideTaskData(slug, locale)?.videos ?? [];
  return getRecentVideoArticles(locale).filter((article) => article.internalGuideSlug === slug
    && !existingVideos.some((source) => source.articleSlug === article.slug));
}

export async function getRelatedGuides(locale: Locale, slug: string, limit = 3) {
  const guides = await listGuideSummaries(locale);
  const current = guides.find((guide) => guide.slug === slug);
  if (!current) return [];

  const prioritySlugs = seasonalTaskGuideSlugs[slug] ?? operatingTaskGuideSlugs[slug]
    ?? currentAccessGuideSlugs[slug] ?? [];
  const prioritized = prioritySlugs
    .map((relatedSlug) => guides.find((guide) => guide.slug === relatedSlug))
    .filter((guide): guide is (typeof guides)[number] => guide !== undefined);
  const sameCategory = guides.filter((guide) => guide.slug !== slug && guide.category === current.category);
  const remaining = guides.filter((guide) => guide.slug !== slug && guide.category !== current.category);
  return [...new Map([...prioritized, ...sameCategory, ...remaining]
    .filter((guide) => guide.slug !== slug)
    .map((guide) => [guide.slug, guide])).values()].slice(0, limit);
}

export async function getItemRelatedGuides(locale: Locale, item: {type: string; slug: string; relatedGuides: readonly string[]}) {
  const guides = await listGuideSummaries(locale);
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const taskSlugs = item.slug === "mortar" || item.slug === "l81-mortar"
    ? ["wardogs-mortar-guide", "wardogs-artillery-guide", "wardogs-map"]
    : item.slug === "sph-2"
    ? ["wardogs-artillery-guide", "wardogs-mortar-guide", "wardogs-map"]
    : item.type === "weapons"
      ? ["wardogs-best-weapons-loadouts", "wardogs-ammo-reload-guide", "wardogs-money-guide"]
      : item.type === "vehicles"
        ? ["wardogs-cargo-guide", "wardogs-fob-guide"]
        : [];
  return [...new Set([...taskSlugs, ...item.relatedGuides])].map((slug) => {
    const guide = bySlug.get(slug);
    if (!guide) throw new Error(`Missing localized item-related guide: ${locale}/${slug}`);
    return guide;
  });
}
