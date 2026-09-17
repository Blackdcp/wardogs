import {ArrowRight, Clapperboard} from "lucide-react";
import type {Locale} from "@/config/site";
import {CurrentVideoSourceGrid} from "@/components/videos/current-video-source-grid";
import {currentVideoSources} from "@/features/videos/video-library";
import {getVideoUi} from "@/features/videos/video-ui";

export function VideoIntelligence({locale}: {locale: Locale}) {
  const ui = getVideoUi(locale);

  return (
    <section aria-labelledby="video-intelligence-title" className="border-b border-[#26312c] bg-[#0d0f0e] py-16 sm:py-20">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
              <Clapperboard aria-hidden="true" className="size-4" />
              {ui.homeEyebrow}
            </p>
            <h2 id="video-intelligence-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
              {ui.currentSourcesTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">
              {ui.currentSourcesDescription}
            </p>
          </div>
          <a href={`/${locale}/videos`} className="inline-flex min-h-11 items-center gap-2 self-start rounded-[6px] border border-[#46534d] px-5 py-2.5 text-sm font-semibold text-[#f2f5f3] hover:border-[#5e7168] hover:bg-[#202723] md:self-auto" title={ui.allVideos}>
            {ui.allVideos}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="mt-10"><CurrentVideoSourceGrid limit={6} locale={locale} sources={currentVideoSources} /></div>
      </div>
    </section>
  );
}
