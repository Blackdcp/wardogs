import {ArrowRight, CalendarDays, CheckCircle2, ExternalLink, PlayCircle} from "lucide-react";
import type {Locale} from "@/config/site";
import {VideoThumbnailImage} from "@/components/videos/video-thumbnail-image";
import {currentVideoAnchorId, type CurrentVideoSource} from "@/features/videos/video-library";
import {getContextualVideoUi} from "@/features/videos/video-localization";
import {formatLocalizedDate} from "@/lib/localized-date";

export function ContextualVideoEvidence({locale, sources}: {locale: Locale; sources: readonly CurrentVideoSource[]}) {
  if (sources.length === 0) return null;
  const ui = getContextualVideoUi(locale);

  return (
    <section className="mt-10 border-t border-[#354039] pt-8" data-contextual-video-evidence="true" aria-labelledby="contextual-video-evidence-title">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
        <PlayCircle aria-hidden="true" className="size-4" />
        {ui.eyebrow}
      </p>
      <h3 className="display-font mt-2 text-2xl text-white md:text-3xl" id="contextual-video-evidence-title">{ui.title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a8b4ae]">{ui.description}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {sources.map((source, index) => (
          <article className="min-w-0 overflow-hidden border border-[#354039] bg-[#111512]" key={source.youtubeId}>
            <a className="group block" href={source.sourceUrl} rel="noreferrer" target="_blank" title={`${source.title} - ${source.channel}`}>
              <span className="relative block aspect-video overflow-hidden border-b border-[#2c3631] bg-[#0d100e]">
                <VideoThumbnailImage alt={`${source.title} ${ui.thumbnail}`} eager={index === 0} youtubeId={source.youtubeId} />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-[#68bd8d]/40 bg-[#111512]/90 px-2 py-1 text-[11px] font-semibold uppercase text-[#79d19c]">
                  <CheckCircle2 aria-hidden="true" className="size-3" />
                  {ui.buildLabel}
                </span>
              </span>
              <span className="block min-w-0 p-4" style={{overflowWrap: "anywhere"}}>
                <span className="block text-xs font-semibold uppercase text-[#d9a93a]">{source.channel}</span>
                <span className="mt-2 block text-base font-semibold leading-6 text-white">{source.title}</span>
                <span className="mt-4 grid gap-2 text-xs text-[#8b9992] sm:grid-cols-2">
                  <span className="inline-flex min-w-0 items-start gap-1.5"><CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.published} <time dateTime={source.publishedDate}>{formatLocalizedDate(source.publishedDate, locale)}</time></span></span>
                  <span className="inline-flex min-w-0 items-start gap-1.5"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /><span>{ui.reviewed} <time dateTime={source.reviewedAt}>{formatLocalizedDate(source.reviewedAt, locale)}</time></span></span>
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">{ui.youtubeSource}<ExternalLink aria-hidden="true" className="size-4" /></span>
              </span>
            </a>
            <a className="flex min-h-11 items-center justify-between gap-3 border-t border-[#2c3631] px-4 py-3 text-xs font-semibold uppercase text-[#b8c3bd] hover:bg-[#1b241f] hover:text-white" href={`/${locale}/videos#${currentVideoAnchorId(source.youtubeId)}`} title={ui.videoHub}>
              <span className="min-w-0" style={{overflowWrap: "anywhere"}}>{ui.videoHub}</span>
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
