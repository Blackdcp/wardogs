import deMessages from "../../../messages/de.json";
import enMessages from "../../../messages/en.json";
import jaMessages from "../../../messages/ja.json";
import ptBrMessages from "../../../messages/pt-br.json";
import ruMessages from "../../../messages/ru.json";
import zhCnMessages from "../../../messages/zh-cn.json";
import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getGuideTaskData} from "@/features/guides/guide-task-data";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {itemLibrary, itemTypes} from "@/features/items/item-library";
import {getSearchNavigationItems} from "@/features/navigation/navigation-data";
import {currentVideoAnchorId, currentVideoSources} from "@/features/videos/video-library";
import type {SiteSearchEntry as SearchEntry} from "./site-search-runtime";
export {
  getNextSearchSelection,
  getSearchKeyboardAction,
  getSiteSearchCounts,
  normalizeSearchText,
  searchSiteIndex
} from "./site-search-runtime";
export type {
  SearchKeyboardAction,
  SearchNavigationKey,
  SiteSearchCounts,
  SiteSearchEntry,
  SiteSearchType
} from "./site-search-runtime";

type MessageTree = {[key: string]: string | MessageTree};

const messageCatalogues = {
  en: enMessages,
  de: deMessages,
  ru: ruMessages,
  "pt-br": ptBrMessages,
  ja: jaMessages,
  "zh-cn": zhCnMessages
} as const satisfies Record<Locale, object>;

function getMessage(locale: Locale, key: string): string {
  let value: string | MessageTree = messageCatalogues[locale] as MessageTree;
  for (const segment of key.split(".")) {
    if (typeof value === "string" || !(segment in value)) return key;
    value = value[segment];
  }
  return typeof value === "string" ? value : key;
}

export async function buildSiteSearchIndex(locale: Locale): Promise<SearchEntry[]> {
  const guides = await listGuideSummaries(locale);
  const guideEntries: SearchEntry[] = guides.map((guide) => {
    const task = getGuideTaskData(guide.slug, locale);
    return {
      id: `guide:${guide.slug}`,
      type: "guide",
      title: guide.title,
      aliases: [guide.keyword, guide.slug.replaceAll("-", " "), ...guide.badges.map((badge) => badge.label)],
      summary: guide.description,
      taskIntent: task ? [task.title, task.directAnswer, ...task.steps] : [],
      category: getMessage(locale, `categories.${guide.category}`),
      href: `/guides/${guide.slug}`
    };
  });

  const itemEntries: SearchEntry[] = itemLibrary
    .filter((item) => item.indexable && item.indexLocales.includes(locale))
    .map((item) => {
      const localized = getLocalizedItem(item, locale);
      const type = itemTypes.find((candidate) => candidate.id === item.type);
      return {
        id: `item:${item.type}/${item.slug}`,
        type: "item",
        title: localized.name,
        aliases: [item.slug.replaceAll("-", " "), localized.subtype, localized.observedAmmoOrVehicleClass ?? ""],
        summary: localized.summary,
        taskIntent: [localized.role, ...localized.strengths],
        category: type ? getLocalizedItemType(type, locale).label : item.type,
        href: `/items/${item.type}/${item.slug}`
      };
    });

  const videoEntries: SearchEntry[] = currentVideoSources.map((video) => {
    const task = getGuideTaskData(video.internalGuideSlug, locale);
    return {
      id: `video:${video.youtubeId}`,
      type: "video",
      title: video.title,
      aliases: [video.channel, video.topic, video.internalGuideSlug.replaceAll("-", " ")],
      summary: `${video.channel}. ${getMessage(locale, "home.search.videoSummary")}`,
      taskIntent: task ? [task.title, task.directAnswer] : [],
      category: getMessage(locale, "home.search.videoCategory"),
      href: `/videos#${currentVideoAnchorId(video.youtubeId)}`
    };
  });

  const translate = (key: string) => getMessage(locale, key);
  const navigationEntries: SearchEntry[] = getSearchNavigationItems(translate).map((item) => ({
    id: `${item.searchType}:${item.href.replace(/^\/+/, "").replaceAll("/", ":")}`,
    type: item.searchType,
    title: item.label,
    aliases: [item.href.split("/").filter(Boolean).join(" ").replaceAll("-", " ")],
    summary: getMessage(locale, item.searchType === "map" ? "home.search.mapSummary" : "home.search.toolSummary"),
    taskIntent: [item.label],
    category: item.category,
    href: item.href
  }));

  return [...guideEntries, ...itemEntries, ...videoEntries, ...navigationEntries];
}
