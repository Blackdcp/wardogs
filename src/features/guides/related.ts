import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";

export function buildRelatedGuideHref(locale: Locale, slug: string) {
  return `/${locale}/guides/${slug}`;
}

export async function getRelatedGuides(locale: Locale, slug: string, limit = 3) {
  const guides = await listGuideSummaries(locale);
  const current = guides.find((guide) => guide.slug === slug);
  if (!current) return [];

  const sameCategory = guides.filter((guide) => guide.slug !== slug && guide.category === current.category);
  const remaining = guides.filter((guide) => guide.slug !== slug && guide.category !== current.category);
  return [...sameCategory, ...remaining].slice(0, limit);
}
