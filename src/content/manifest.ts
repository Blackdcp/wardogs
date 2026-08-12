import keywords from "../../keywords.json";

export type GuideCategory = "access" | "release" | "store" | "platform" | "video" | "community" | "developer" | "guide";
export type GuideManifestEntry = {category: GuideCategory; keyword: string; slug: string; order: number};

const categories = new Set<GuideCategory>(["access", "release", "store", "platform", "video", "community", "developer", "guide"]);

function keywordToSlug(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/\s+/g, "-");
}

export const guideManifest: readonly GuideManifestEntry[] = keywords.categories.flatMap((group) => {
  if (!categories.has(group.category as GuideCategory)) {
    throw new Error(`Unknown guide category: ${group.category}`);
  }
  return group.keywords.map((keyword) => ({
    category: group.category as GuideCategory,
    keyword,
    slug: keywordToSlug(keyword)
  }));
}).map((entry, index) => ({...entry, order: index + 1}));

export function getManifestEntry(slug: string): GuideManifestEntry | undefined {
  return guideManifest.find((entry) => entry.slug === slug);
}
