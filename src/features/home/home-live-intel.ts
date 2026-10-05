import type {Locale} from "@/config/site";
import {loadGuideDocument} from "@/content/guides";
import {seasonOneChanges} from "@/features/catalogue/catalogue-evidence-data";
import {NEWS_UPDATES} from "@/features/news/news-data";
import {getServiceUpdates} from "@/features/news/service-updates";

export type HomeLiveIntelEntry = {
  id: string;
  href: string;
  kind: "status" | "patch" | "season" | "change";
  titleKey: string;
  verifiedAt: string;
  build: string;
  current: boolean;
  sourceClass: "official" | "live-client" | "creator-current" | "community-report";
  /** Already-localized title from the existing service-updates evidence model. */
  sourceTitle?: string;
};
export type HomeLiveIntelCandidate = Omit<HomeLiveIntelEntry, "current"> & {current?: boolean; sourceUrl?: string};

function validDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function resolveHomeLiveIntel(candidates: readonly HomeLiveIntelCandidate[]): HomeLiveIntelEntry[] {
  const seen = new Set<string>();
  return [...candidates].filter((entry) => {
    if (typeof entry.current !== "boolean" || !validDate(entry.verifiedAt) || !entry.sourceUrl) return false;
    try {return new URL(entry.sourceUrl).protocol === "https:";} catch {return false;}
  }).sort((a, b) => Number(b.current) - Number(a.current)
    || b.verifiedAt.localeCompare(a.verifiedAt) || a.id.localeCompare(b.id))
    .flatMap((entry) => {
      if (seen.has(entry.href)) return [];
      seen.add(entry.href);
      return [{id: entry.id, href: entry.href, kind: entry.kind, titleKey: entry.titleKey,
        verifiedAt: entry.verifiedAt, build: entry.build, current: entry.current as boolean,
        sourceClass: entry.sourceClass, ...(entry.sourceTitle ? {sourceTitle: entry.sourceTitle} : {})}];
    }).slice(0, 3);
}

export async function getHomeLiveIntelEntries(locale: Locale): Promise<HomeLiveIntelEntry[]> {
  // Confirmed publication is dated evidence, not proof of the player's currently installed build.
  const news = NEWS_UPDATES.filter((update) => ["patch012", "season02", "launchHotfix"].includes(update.titleKey));
  const candidates: HomeLiveIntelCandidate[] = await Promise.all(news.map(async (update) => {
    const guide = await loadGuideDocument(locale, update.guideSlug);
    const source = guide?.frontmatter.sources.filter((entry) => entry.kind === "official")
      .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt))[0];
    return {
      id: `news-${update.titleKey}`, href: `/guides/${update.guideSlug}`,
      kind: update.titleKey === "season02" ? "season" : update.titleKey === "launchHotfix" ? "status" : "patch",
      titleKey: `news.timeline.items.${update.titleKey}.title`,
      verifiedAt: source?.checkedAt ?? "", sourceUrl: source?.url,
      build: update.titleKey === "patch012" ? "0.1.2" : update.titleKey === "season02" ? "Season 2" : "",
      current: false, sourceClass: "official"
    };
  }));
  candidates.push(...getServiceUpdates(locale).filter((update) => update.guideSlug !== "wardogs-player-count").map((update) => ({
    id: `service-${update.titleKey}`, href: `/guides/${update.guideSlug}`, kind: "status" as const,
    titleKey: "home.discovery.actions.serverStatus", sourceTitle: update.title,
    verifiedAt: update.date, sourceUrl: update.sources[0], build: "", current: false, sourceClass: "official" as const
  })));
  candidates.push(...seasonOneChanges.map((change) => ({
    id: `season-one-${change.id}`, href: "/guides/wardogs-patch-notes", kind: "change" as const,
    titleKey: "home.discovery.states.archive", verifiedAt: change.verifiedAt, sourceUrl: change.sourceUrl,
    build: change.effectiveBuild, current: false, sourceClass: "official" as const
  })));
  return resolveHomeLiveIntel(candidates);
}
