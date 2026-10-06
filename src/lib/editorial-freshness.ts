import {readFileSync} from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {guideManifest} from "@/content/manifest";
import type {Locale} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {itemHubPreviewSlugs} from "@/features/items/item-hub-data";
import {getFeaturedItems, itemLibrary, itemTypes} from "@/features/items/item-library";
import {getItemLatestVerifiedAt} from "@/features/items/item-freshness";
import {operationsAtlasRecords} from "@/features/maps/operations-atlas";
import {NEWS_CHECKLIST_SLUGS, NEWS_UPDATES} from "@/features/news/news-data";
import {getServiceUpdates} from "@/features/news/service-updates";
import {videoArticles} from "@/features/videos/video-library";
import {videoCandidates} from "@/features/videos/video-candidates";
import {HOME_UPDATED_AT} from "@/features/home/home-data";

export function latestDate(dates: string[]) {
  return dates.reduce((latest, candidate) =>
    Date.parse(candidate) > Date.parse(latest) ? candidate : latest, "2026-08-16");
}

export function itemHubDate(type?: string) {
  if (!type) {
    const previewDates = (["weapons", "vehicles"] as const).flatMap((previewType) =>
      getCatalogueRecords(previewType)
        .filter(({slug}) => itemHubPreviewSlugs[previewType].some((previewSlug) => previewSlug === slug))
        .flatMap((record) => [record.evidence.verifiedAt, ...record.changeHistory.map(({verifiedAt}) => verifiedAt)])
    );
    const guideDates = itemTypes.map(({id}) => getCatalogGuide(id)?.lastReviewedAt ?? "2026-08-16");
    return latestDate([...getFeaturedItems(6).map(getItemLatestVerifiedAt), ...previewDates, ...guideDates]);
  }
  if (type === "loadouts") return getCatalogGuide("loadouts")?.lastReviewedAt ?? "2026-08-16";
  const items = itemLibrary.filter((item) => item.type === type);
  const types = itemTypes.filter(({id}) => id === type);
  const catalogueDates = types.flatMap(({id}) => id === "loadouts" ? [] : getCatalogueRecords(id).flatMap((record) => [
    record.evidence.verifiedAt,
    ...record.changeHistory.map(({verifiedAt}) => verifiedAt)
  ]));
  return latestDate([...items.map(getItemLatestVerifiedAt), ...catalogueDates, getCatalogGuide(type)?.lastReviewedAt ?? "2026-08-16"]);
}

export function resolveMapHubLastModified(catalogueDates: string[], guideDates: string[]) {
  return new Date(`${latestDate([...catalogueDates, ...guideDates])}T00:00:00.000Z`);
}

export function mapHubDate(locale: string) {
  const catalogueDates = getCatalogueRecords("maps").flatMap((record) => [
    record.evidence.verifiedAt,
    ...record.changeHistory.map(({verifiedAt}) => verifiedAt)
  ]);
  const guideDates = operationsAtlasRecords.map(({guideSlug}) => resolveGuideUpdatedAt(locale, guideSlug));
  return resolveMapHubLastModified(catalogueDates, guideDates);
}

type EditorialHubSources = {
  guides: string[];
  news: string[];
  videos: string[];
  items: string[];
  maps: string[];
};

export function resolveEditorialHubLastModified(pathname: "" | "/guides" | "/news", sources: EditorialHubSources) {
  const dates = pathname === "/guides"
    ? [...sources.guides, ...sources.videos]
    : pathname === "/news"
      ? sources.news
      : Object.values(sources).flat();
  return new Date(`${latestDate(dates)}T00:00:00.000Z`);
}

export function editorialHubSources(locale: Locale): EditorialHubSources {
  return {
    guides: guideManifest.map(({slug}) => resolveGuideUpdatedAt(locale, slug)),
    news: [
      ...NEWS_UPDATES.map(({date}) => date),
      ...getServiceUpdates(locale).map(({date}) => date),
      ...NEWS_CHECKLIST_SLUGS.map((slug) => resolveGuideUpdatedAt(locale, slug))
    ],
    videos: [...videoArticles.map(({updatedDate}) => updatedDate), ...videoCandidates.map(({metadataCheckedAt}) => metadataCheckedAt)],
    items: [itemHubDate()],
    maps: [mapHubDate(locale).toISOString().slice(0, 10)]
  };
}

export function resolveGuideUpdatedAt(locale: string, slug: string) {
  const source = readFileSync(path.join(process.cwd(), "content", locale, "guides", `${slug}.mdx`), "utf8");
  const {updatedAt} = matter(source).data as {updatedAt: string};
  return updatedAt;
}

// The homepage changes when its editorial content or a linked content source changes.
// JSON-LD and the sitemap must use the same locale-specific evidence date.
export function getHomeLastModified(locale: Locale) {
  const editorialDate = resolveEditorialHubLastModified("", editorialHubSources(locale));
  return new Date(Math.max(editorialDate.getTime(), Date.parse(HOME_UPDATED_AT)));
}
