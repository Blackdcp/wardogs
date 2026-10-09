"use client";

import {useMemo, useState} from "react";
import {ArrowRight, CalendarDays, CheckCircle2, Clock3, ExternalLink, PlayCircle} from "lucide-react";
import type {Locale} from "@/config/site";
import {VideoThumbnailImage} from "@/components/videos/video-thumbnail-image";
import {getCurrentVideoUi} from "@/features/videos/current-video-localization";
import {currentVideoAnchorId, currentVideoTopics, type CurrentVideoSource, type CurrentVideoTopic} from "@/features/videos/video-library";
import {getVideoUi} from "@/features/videos/video-ui";
import {recentVideoCopy} from "@/features/videos/recent-video-copy";
import {recentVideoUi} from "@/features/videos/recent-video-data";
import {publicRoutePath} from "@/lib/public-url";
import {formatLocalizedDate} from "@/lib/localized-date";

type TopicFilter = "all" | CurrentVideoTopic;

function sortByFreshness(sources: readonly CurrentVideoSource[]) {
  return [...sources].sort((left, right) => {
    const publishedCompare = right.publishedDate.localeCompare(left.publishedDate);
    return publishedCompare !== 0 ? publishedCompare : left.youtubeId.localeCompare(right.youtubeId);
  });
}

export function CurrentVideoSourceGrid({locale, sources}: {
  locale: Locale;
  sources: readonly CurrentVideoSource[];
}) {
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>("all");
  const ui = getCurrentVideoUi(locale);
  const videoUi = getVideoUi(locale);
  const availableTopics = useMemo(
    () => currentVideoTopics.filter((topic) => sources.some((source) => source.topic === topic)),
    [sources]
  );
  const visibleSources = useMemo(() => {
    const filtered = selectedTopic === "all" ? sources : sources.filter((source) => source.topic === selectedTopic);
    const sorted = sortByFreshness(filtered);
    return sorted;
  }, [selectedTopic, sources]);

  return (
    <div data-home-video-grid="true">
      <div className="flex flex-wrap gap-2" aria-label={ui.filterLabel} role="group">
        <button
          aria-pressed={selectedTopic === "all"}
          className={`min-h-9 rounded-[4px] border px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${selectedTopic === "all" ? "border-[#69c78f] bg-[#17251d] text-[#d8f4e4]" : "border-[#344039] text-[#aeb9b3] hover:border-[#79d19c] hover:text-white"}`}
          onClick={() => setSelectedTopic("all")}
          type="button"
        >
          {ui.allTopics}
        </button>
        {availableTopics.map((topic) => (
          <button
            aria-pressed={selectedTopic === topic}
            className={`min-h-9 rounded-[4px] border px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${selectedTopic === topic ? "border-[#69c78f] bg-[#17251d] text-[#d8f4e4]" : "border-[#344039] text-[#aeb9b3] hover:border-[#79d19c] hover:text-white"}`}
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            type="button"
          >
            {ui.topics[topic].label}
          </button>
        ))}
      </div>
      <p className="mt-4 max-w-4xl text-sm leading-6 text-[#a8b4ae]">{ui.creatorGuidance}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleSources.map((source, index) => {
          const topic = ui.topics[source.topic];

          return (
            <article className="scroll-mt-24 overflow-hidden rounded-[6px] border border-[#344039] bg-[#111713]" data-current-video-source={source.youtubeId} id={currentVideoAnchorId(source.youtubeId)} key={source.youtubeId}>
              <a className="group block" href={source.articleSlug ? publicRoutePath(`/${locale}/videos/${source.articleSlug}`) : source.sourceUrl} rel={source.articleSlug ? undefined : "noreferrer"} target={source.articleSlug ? undefined : "_blank"} title={`${source.title} - ${source.channel}`}>
                <span className="relative block aspect-video overflow-hidden border-b border-[#2c3631] bg-[#0d100e]">
                  <VideoThumbnailImage alt={`${source.title} video thumbnail`} eager={index === 0} youtubeId={source.youtubeId} />
                  <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex size-9 items-center justify-center rounded-[4px] border border-[#344039] bg-[#111713]/90 text-[#8ce2ad]" aria-hidden="true">
                    <PlayCircle className="size-5" />
                  </span>
                  <span className="absolute right-3 top-3 border border-[#68bd8d]/40 bg-[#111512]/90 px-2 py-1 text-[11px] font-semibold uppercase text-[#79d19c]">
                    {source.articleSlug ? recentVideoUi[locale].current : videoUi.seasonOneCurrent}
                  </span>
                </span>
                <span className="block min-h-[220px] p-4" style={{overflowWrap: "anywhere"}}>
                  <span className="block text-xs font-semibold uppercase text-[#d9a93a]">{topic.label}</span>
                  <span className="mt-2 block text-xs font-semibold uppercase text-[#b8c3bd]">{source.channel}</span>
                  <span className="display-font mt-3 block text-xl leading-tight text-white">{recentVideoCopy[source.youtubeId]?.[locale].title ?? source.title}</span>
                  <span className="mt-3 block text-sm leading-6 text-[#a8b4ae]">{recentVideoCopy[source.youtubeId]?.[locale].answer ?? topic.summary}</span>
                  <span className="mt-4 grid gap-2 text-xs text-[#8b9992] sm:grid-cols-2">
                    <span className="inline-flex min-w-0 items-start gap-1.5"><CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.published} <time dateTime={source.publishedDate}>{formatLocalizedDate(source.publishedDate, locale)}</time></span></span>
                    <span className="inline-flex min-w-0 items-start gap-1.5"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.reviewed} <time dateTime={source.reviewedAt}>{formatLocalizedDate(source.reviewedAt, locale)}</time></span></span>
                    <span className="inline-flex min-w-0 items-start gap-1.5 sm:col-span-2"><Clock3 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{source.durationMinutes} min</span></span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">{source.articleSlug ? videoUi.readBreakdown : "YouTube"}<ExternalLink aria-hidden="true" className="size-4" /></span>
                </span>
              </a>
              <a className="flex min-h-10 items-center justify-between gap-3 border-t border-[#26312c] px-4 py-2.5 text-xs font-semibold uppercase text-[#b8c3bd] hover:bg-[#1b241f] hover:text-white" href={`/${locale}/guides/${source.internalGuideSlug}`} title={ui.viewGuide}>
                <span className="min-w-0" style={{overflowWrap: "anywhere"}}>{ui.viewGuide}</span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
