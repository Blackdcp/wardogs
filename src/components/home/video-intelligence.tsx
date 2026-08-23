import {ArrowRight, Clapperboard} from "lucide-react";
import type {Locale} from "@/config/site";
import {getLocalizedFeaturedVideoArticles} from "@/features/videos/video-localization";
import {getVideoUi} from "@/features/videos/video-ui";
import {VideoArticleCard} from "@/components/videos/video-article-card";

export function VideoIntelligence({locale}: {locale: Locale}) {
  const articles = getLocalizedFeaturedVideoArticles(locale, 6);
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
              {ui.homeTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">
              {ui.homeDescription}
            </p>
          </div>
          <a href={`/${locale}/videos`} className="inline-flex min-h-11 items-center gap-2 self-start rounded-[6px] border border-[#46534d] px-5 py-2.5 text-sm font-semibold text-[#f2f5f3] hover:border-[#5e7168] hover:bg-[#202723] md:self-auto">
            {ui.allVideos}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <VideoArticleCard article={article} locale={locale} key={article.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
