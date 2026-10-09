import deMessages from "../../../messages/de.json";
import enMessages from "../../../messages/en.json";
import jaMessages from "../../../messages/ja.json";
import ptBrMessages from "../../../messages/pt-br.json";
import ruMessages from "../../../messages/ru.json";
import zhCnMessages from "../../../messages/zh-cn.json";
import zhTwMessages from "../../../messages/zh-tw.json";
import plMessages from "../../../messages/pl.json";
import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getGuideTaskData} from "@/features/guides/guide-task-data";
import {getGuideIntentKeywords} from "@/features/guides/guide-search-intents";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {itemLibrary, itemTypes} from "@/features/items/item-library";
import {buildNavigation, getSearchNavigationItems} from "@/features/navigation/navigation-data";
import {TOOL_REGISTRY} from "@/features/tools/tool-registry";
import {currentVideoAnchorId, currentVideoSources, videoArticles} from "@/features/videos/video-library";
import {getLocalizedVideoArticles} from "@/features/videos/video-localization";
import {videoCandidates} from "@/features/videos/video-candidates";
import {getRecentCandidateCopy} from "@/features/videos/recent-candidate-copy";
import {getCreatorAttachmentRecords} from "@/features/tools/attachment-recipes";
import {getAttachmentRecipeCopy} from "@/features/tools/attachment-recipe-copy";
import {getDiscoverySearchAliases, getSearchCandidateSummary} from "./search-discovery-copy";
import type {SiteSearchEntry as SearchEntry} from "./site-search-runtime";
import {normalizeSearchText} from "./site-search-runtime";
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
  "zh-cn": zhCnMessages,
  "zh-tw": zhTwMessages,
  pl: plMessages
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
  const mortarToolAliases = new Set(getDiscoverySearchAliases(locale, "/tools/artillery-calculator").map(normalizeSearchText));
  const guideEntries: SearchEntry[] = guides.map((guide) => {
    const task = getGuideTaskData(guide.slug, locale, guide.directAnswer);
    // Explicit calculator searches belong to the executable tool. The guide still
    // retains its title, range/mils aliases and complete how-to answer in the index.
    const guideIntentAliases = getGuideIntentKeywords(locale, guide.slug).filter((term) => guide.slug !== "wardogs-mortar-guide" || !mortarToolAliases.has(normalizeSearchText(term)));
    return {
      id: `guide:${guide.slug}`,
      type: "guide",
      title: guide.title,
      aliases: [guide.keyword, guide.slug.replaceAll("-", " "), guide.title.replace(/^WARDOGS\s*/i, "").split(/[:：]/)[0], ...guide.badges.map((badge) => badge.label), ...guideIntentAliases, ...getDiscoverySearchAliases(locale, `/guides/${guide.slug}`)],
      summary: guide.description,
      taskIntent: [...(guide.directAnswer ? [guide.directAnswer] : []), ...(task ? [task.title, task.directAnswer, ...task.steps] : [])],
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

  const reviewedVideoEntries: SearchEntry[] = getLocalizedVideoArticles(locale).map((video) => ({
    id: `video:${video.youtubeId}`, type: "video", title: video.title,
    aliases: [video.sourceLabel, video.slug.replaceAll("-", " "), videoArticles.find(({youtubeId}) => youtubeId === video.youtubeId)?.title ?? ""], summary: video.description,
    taskIntent: [video.quickAnswer, ...video.takeaways, ...video.sections.map(({heading}) => heading)],
    category: getMessage(locale, "home.search.videoCategory"), href: `/videos/${video.slug}`
  }));
  const currentVideoEntries: SearchEntry[] = currentVideoSources.map((video) => ({
      id: `video:${video.youtubeId}`,
      type: "video",
      title: video.title,
      aliases: [video.channel, video.topic, video.internalGuideSlug.replaceAll("-", " ")],
      summary: `${video.channel}. ${getMessage(locale, "home.search.videoSummary")}`,
      taskIntent: [],
      category: getMessage(locale, "home.search.videoCategory"),
      href: `/videos#${currentVideoAnchorId(video.youtubeId)}`
  }));
  const candidateVideoEntries: SearchEntry[] = videoCandidates.map((video) => ({
    id: `video:${video.youtubeId}`, type: "video", title: video.title,
    aliases: [video.channel], summary: [video.channel, getSearchCandidateSummary(locale), getRecentCandidateCopy(locale, video.youtubeId)].filter(Boolean).join(" "),
    taskIntent: video.chapters.map(({label}) => label), category: getMessage(locale, "home.search.videoCategory"),
    href: `/videos#candidate-${video.youtubeId}`
  }));
  // Prefer the maintained watch page; do not show the same video as three results.
  const seenVideos = new Set<string>();
  const videoEntries = [...reviewedVideoEntries, ...currentVideoEntries, ...candidateVideoEntries].filter(({id}) => {
    if (seenVideos.has(id)) return false;
    seenVideos.add(id); return true;
  });

  const translate = (key: string) => getMessage(locale, key);
  const hubs: SearchEntry[] = [
    ...buildNavigation(translate).flatMap((group) => group.items.filter(({searchType}) => searchType === "item").map((item): SearchEntry => ({
      id: `item:hub:${item.href}`, type: "item", title: item.label,
      aliases: [item.href.replaceAll("/", " ").replaceAll("-", " ").trim(), ...getDiscoverySearchAliases(locale, item.href)],
      summary: `${group.label} · ${item.label}`, taskIntent: [], category: group.label, href: item.href
    }))),
    ...([{href: "/guides", key: "nav.allGuides", type: "guide"}, {href: "/news", key: "nav.news", type: "guide"}, {href: "/videos", key: "nav.videos", type: "video"}] as const).map(({href, key, type}): SearchEntry => ({
      id: `${type}:hub:${href}`, type, title: translate(key), aliases: [href.slice(1)], summary: translate(key), taskIntent: [], category: translate(key), href
    }))
  ];
  const navigationEntries: SearchEntry[] = getSearchNavigationItems(translate).map((item) => ({
    id: `${item.searchType}:${item.href.replace(/^\/+/, "").replaceAll("/", ":")}`,
    type: item.searchType,
    title: item.label,
    aliases: [item.href.split("/").filter(Boolean).join(" ").replaceAll("-", " "), ...getDiscoverySearchAliases(locale, item.href), ...(item.href === "/tools/loadout-budget" ? [getAttachmentRecipeCopy(locale).title, ...getCreatorAttachmentRecords(locale).map(({name}) => name.split(" · ")[0])] : [])],
    summary: getMessage(locale, TOOL_REGISTRY.find((tool) => tool.href === item.href)?.descriptionKey ?? (item.href === "/tools" ? "toolsHub.description" : item.searchType === "map" ? "home.search.mapSummary" : "home.search.toolSummary")),
    taskIntent: [item.label],
    category: item.category,
    href: item.href
  }));

  return [...guideEntries, ...itemEntries, ...videoEntries, ...navigationEntries, ...hubs];
}
