import {ArrowRight, Clapperboard} from "lucide-react";
import type {Locale} from "@/config/site";
import {getFeaturedVideoArticles} from "@/features/videos/video-library";
import {VideoArticleCard} from "@/components/videos/video-article-card";

export function VideoIntelligence({locale}: {locale: Locale}) {
  const articles = getFeaturedVideoArticles(6);

  return (
    <section aria-labelledby="video-intelligence-title" className="border-b border-[#26312c] bg-[#0d0f0e] py-16 sm:py-20">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
              <Clapperboard aria-hidden="true" className="size-4" />
              Video Intelligence
            </p>
            <h2 id="video-intelligence-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
              YouTube Footage Turned Into Standalone WARDOGS Guides
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">
              Each collected WARDOGS video now has its own indexable breakdown page, so first-look footage, mortars, sniping, alpha impressions, and buyer-intent videos are easy to find.
            </p>
          </div>
          <a href={`/${locale}/videos`} className="inline-flex min-h-11 items-center gap-2 self-start rounded-[6px] border border-[#46534d] px-5 py-2.5 text-sm font-semibold text-[#f2f5f3] hover:border-[#5e7168] hover:bg-[#202723] md:self-auto">
            View all video guides
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
