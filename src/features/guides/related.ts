import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";

// Historical access searches still land on these pages. Lead readers to the
// current product and roadmap before suggesting another expired test guide.
const currentAccessGuideSlugs: Record<string, readonly string[]> = {
  "wardogs-alpha": ["wardogs-early-access", "wardogs-beta", "wardogs-season-2"],
  "wardogs-alpha-key": ["wardogs-early-access", "wardogs-beta", "wardogs-season-2"],
  "wardogs-beta": ["wardogs-early-access", "wardogs-season-2", "wardogs-server-status"],
  "wardogs-playtest": ["wardogs-early-access", "wardogs-season-2", "wardogs-server-status"]
};

export function buildRelatedGuideHref(locale: Locale, slug: string) {
  return `/${locale}/guides/${slug}`;
}

export async function getRelatedGuides(locale: Locale, slug: string, limit = 3) {
  const guides = await listGuideSummaries(locale);
  const current = guides.find((guide) => guide.slug === slug);
  if (!current) return [];

  const prioritized = (currentAccessGuideSlugs[slug] ?? [])
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
  const taskSlugs = item.slug === "sph-2" || item.slug === "mortar" || item.slug === "l81-mortar"
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
