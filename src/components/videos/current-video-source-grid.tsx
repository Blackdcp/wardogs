"use client";

import {useMemo, useState} from "react";
import {ArrowRight, CalendarDays, CheckCircle2, Clock3, ExternalLink, PlayCircle} from "lucide-react";
import type {Locale} from "@/config/site";
import {VideoThumbnailImage} from "@/components/videos/video-thumbnail-image";
import {getCurrentVideoUi} from "@/features/videos/current-video-localization";
import {currentVideoAnchorId, currentVideoTopics, type CurrentVideoSource, type CurrentVideoTopic} from "@/features/videos/video-library";
import {getVideoUi} from "@/features/videos/video-ui";
import {formatLocalizedDate} from "@/lib/localized-date";

type TopicFilter = "all" | CurrentVideoTopic;

function sortByFreshness(sources: readonly CurrentVideoSource[]) {
  return [...sources].sort((left, right) => {
    const publishedCompare = right.publishedDate.localeCompare(left.publishedDate);
    return publishedCompare !== 0 ? publishedCompare : left.youtubeId.localeCompare(right.youtubeId);
  });
}

export function CurrentVideoSourceGrid({locale, sources, limit}: {
  locale: Locale;
  sources: readonly CurrentVideoSource[];
  limit?: number;
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
    return selectedTopic === "all" && limit !== undefined ? sorted.slice(0, limit) : sorted;
  }, [limit, selectedTopic, sources]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label={ui.filterLabel} role="group">
        <button
          aria-pressed={selectedTopic === "all"}
          className={`min-h-10 border px-3 py-2 text-xs font-semibold uppercase transition-colors ${selectedTopic === "all" ? "border-[#d9a93a] bg-[#d9a93a] text-[#111512]" : "border-[#46534d] text-[#d6dfda] hover:border-[#79d19c] hover:text-white"}`}
          onClick={() => setSelectedTopic("all")}
          type="button"
        >
          {ui.allTopics}
        </button>
        {availableTopics.map((topic) => (
          <button
            aria-pressed={selectedTopic === topic}
            className={`min-h-10 border px-3 py-2 text-xs font-semibold uppercase transition-colors ${selectedTopic === topic ? "border-[#d9a93a] bg-[#d9a93a] text-[#111512]" : "border-[#46534d] text-[#d6dfda] hover:border-[#79d19c] hover:text-white"}`}
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
            <article className="scroll-mt-24 overflow-hidden border border-[#354039] bg-[#111512]" data-current-video-source={source.youtubeId} id={currentVideoAnchorId(source.youtubeId)} key={source.youtubeId}>
              <a className="group block" href={source.sourceUrl} rel="noreferrer" target="_blank" title={`${source.title} - ${source.channel}`}>
                <span className="relative block aspect-video overflow-hidden border-b border-[#2c3631] bg-[#0d100e]">
                  <VideoThumbnailImage alt={`${source.title} video thumbnail`} eager={index === 0} youtubeId={source.youtubeId} />
                  <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex size-10 items-center justify-center bg-[#d9a93a] text-[#111512]" aria-hidden="true">
                    <PlayCircle className="size-5" />
                  </span>
                  <span className="absolute right-3 top-3 border border-[#68bd8d]/40 bg-[#111512]/90 px-2 py-1 text-[11px] font-semibold uppercase text-[#79d19c]">
                    {videoUi.seasonOneCurrent}
                  </span>
                </span>
                <span className="block min-h-64 p-5" style={{overflowWrap: "anywhere"}}>
                  <span className="block text-xs font-semibold uppercase text-[#d9a93a]">{topic.label}</span>
                  <span className="mt-2 block text-xs font-semibold uppercase text-[#b8c3bd]">{source.channel}</span>
                  <span className="display-font mt-3 block text-2xl leading-tight text-white">{source.title}</span>
                  <span className="mt-3 block text-sm leading-6 text-[#a8b4ae]">{topic.summary}</span>
                  <span className="mt-4 grid gap-2 text-xs text-[#8b9992] sm:grid-cols-2">
                    <span className="inline-flex min-w-0 items-start gap-1.5"><CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.published} <time dateTime={source.publishedDate}>{formatLocalizedDate(source.publishedDate, locale)}</time></span></span>
                    <span className="inline-flex min-w-0 items-start gap-1.5"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.reviewed} <time dateTime={source.reviewedAt}>{formatLocalizedDate(source.reviewedAt, locale)}</time></span></span>
                    <span className="inline-flex min-w-0 items-start gap-1.5 sm:col-span-2"><Clock3 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{source.durationMinutes} min</span></span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">YouTube<ExternalLink aria-hidden="true" className="size-4" /></span>
                </span>
              </a>
              <a className="flex min-h-11 items-center justify-between gap-3 border-t border-[#2c3631] px-5 py-3 text-xs font-semibold uppercase text-[#b8c3bd] hover:bg-[#1b241f] hover:text-white" href={`/${locale}/guides/${source.internalGuideSlug}`} title={ui.viewGuide}>
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
