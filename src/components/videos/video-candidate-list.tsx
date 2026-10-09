"use client";

import type {Locale} from "@/config/site";
import {getRecentCandidateCopy} from "@/features/videos/recent-candidate-copy";
import {recentVideoUi} from "@/features/videos/recent-video-data";
import {useState} from "react";
import {ExternalLink, Play, X} from "lucide-react";
import {candidateWatchUrl, getVideoCandidates} from "@/features/videos/video-candidates";
import {getVideoCandidateCopy} from "@/features/videos/video-candidate-copy";
import {CANDIDATE_EVIDENCE_CHECKED_AT, getVideoCandidateEvidence, videoTimestamp} from "@/features/videos/video-candidate-evidence";
import {publicRoutePath} from "@/lib/public-url";

export function VideoCandidateList({locale}: {locale: Locale}) {
  const [open, setOpen] = useState<string | null>(null);
  const ui = getVideoCandidateCopy(locale);
  return <section className="site-container scroll-mt-24 py-12" id="creator-candidates" aria-labelledby="candidate-title">
    <h2 className="display-font text-3xl text-white" id="candidate-title">{ui.title}</h2>
    <p className="mt-4 max-w-4xl text-sm leading-7 text-[#a8b4ae]">{ui.summary}</p>
    <div className="mt-6 divide-y divide-[#354039]">
      {getVideoCandidates(locale).map((video) => {
        const evidence = getVideoCandidateEvidence(video.youtubeId);
        const recentCopy = getRecentCandidateCopy(locale, video.youtubeId);
        return <article className="scroll-mt-24 py-6" id={`candidate-${video.youtubeId}`} key={video.youtubeId}>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1 basis-72" style={{overflowWrap: "anywhere"}}>
            <p className="text-xs text-[#a8b4ae]">{video.channel} · <span lang={video.language}>{video.language.toUpperCase()}</span> · <time dateTime={video.publishedDate}>{video.publishedDate}</time></p>
            <h3 className="mt-2 text-lg font-semibold leading-7 text-white" lang={video.language}>{video.title}</h3>
          </div>
          <button type="button" className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-[#46534d] px-3 py-2 text-sm text-[#d6dfda] hover:border-[#79d19c]" onClick={() => setOpen(open === video.youtubeId ? null : video.youtubeId)} aria-expanded={open === video.youtubeId} aria-controls={`player-${video.youtubeId}`}>
            {open === video.youtubeId ? <X aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}{open === video.youtubeId ? ui.close : ui.play}
          </button>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-[#d9b96c]">{recentCopy ?? ui.cautions[video.caution]}</p>
        {evidence.caution && <p className="mt-2 max-w-4xl text-sm leading-6 text-[#d9b96c]"><a title={`${video.title}: ${videoTimestamp(evidence.caution.seconds)}`} className="underline underline-offset-4" href={candidateWatchUrl(video.youtubeId, evidence.caution.seconds)} target="_blank" rel="noreferrer">{videoTimestamp(evidence.caution.seconds)}</a> {ui.evidenceCautions[evidence.caution.key]}</p>}
        <div className="mt-3 max-w-4xl space-y-1 text-sm leading-6 text-[#a8b4ae]">
          <p>{ui.reviewed}: <time dateTime={recentCopy ? video.metadataCheckedAt : CANDIDATE_EVIDENCE_CHECKED_AT}>{recentCopy ? video.metadataCheckedAt : CANDIDATE_EVIDENCE_CHECKED_AT}</time> · {evidence.captionReview === "not-reviewed" ? recentVideoUi[locale].metadata : ui.captions[evidence.captionReview]}</p>
          {evidence.footage.length ? <ul className="flex flex-wrap gap-x-5 gap-y-1">{evidence.footage.map(sample => <li key={sample.seconds}>{ui.footage}{sample.scope === "intro" ? ` (${ui.intro})` : ""}: <a title={`${video.title}: ${videoTimestamp(sample.seconds)}`} className="text-[#79d19c] underline underline-offset-4" href={candidateWatchUrl(video.youtubeId, sample.seconds)} target="_blank" rel="noreferrer">{videoTimestamp(sample.seconds)}</a></li>)}</ul> : <p>{ui.noFootage}</p>}
        </div>
        <p className="mt-2 text-xs text-[#a8b4ae]">{ui.metadata}: <time dateTime={video.metadataCheckedAt}>{video.metadataCheckedAt}</time> · {video.chapters.length ? ui.chapters : ui.noChapters}</p>
        {video.chapters.length > 0 && <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#79d19c]">{video.chapters.map(chapter => <li key={chapter.seconds}><a title={`${video.title}: ${chapter.label}`} href={candidateWatchUrl(video.youtubeId, chapter.seconds)} target="_blank" rel="noreferrer">{Math.floor(chapter.seconds / 60)}:{String(chapter.seconds % 60).padStart(2, "0")} {recentCopy ? "" : chapter.label}</a></li>)}</ul>}
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#79d19c]">
          <a className="inline-flex items-center gap-1" title={`${video.title} - ${video.channel}`} href={candidateWatchUrl(video.youtubeId)} target="_blank" rel="noreferrer">{ui.watch}<ExternalLink aria-hidden="true" className="size-3" /></a>
          <a title={`${ui.guide}: ${video.title}`} href={publicRoutePath(`/${locale}/guides/${video.guideSlug}`)}>{ui.guide}</a>
        </div>
        {video.relatedToolPath && <a className="mt-3 inline-block text-sm text-[#79d19c]" title={recentVideoUi[locale].tool} href={publicRoutePath(`/${locale}${video.relatedToolPath}`)}>{recentVideoUi[locale].tool}</a>}
        <div id={`player-${video.youtubeId}`}>
          {open === video.youtubeId && <iframe className="mt-5 aspect-video w-full max-w-4xl border-0" src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`} title={`${video.title} - ${video.channel}`} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
        </div>
      </article>;
      })}
    </div>
  </section>;
}
