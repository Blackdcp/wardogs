import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowRight, CalendarDays, Clapperboard, Clock3, ExternalLink, PlayCircle} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {VideoArticleCard} from "@/components/videos/video-article-card";
import {VideoThumbnailImage} from "@/components/videos/video-thumbnail-image";
import {currentVideoSources, videoArticles} from "@/features/videos/video-library";
import {getLocalizedFeaturedVideoArticles} from "@/features/videos/video-localization";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";
import {getVideoUi} from "@/features/videos/video-ui";
import {buildPageMetadataWithImage} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const featured = getLocalizedFeaturedVideoArticles(locale, 1)[0];
  const ui = getVideoUi(locale);
  return buildPageMetadataWithImage(
    locale,
    "/videos",
    ui.metaTitle,
    ui.metaDescription,
    {
      url: videoThumbnailUrl(featured.youtubeId),
      width: 1280,
      height: 720,
      alt: `${featured.sourceLabel} ${ui.thumbnail}`
    }
  );
}

export default async function VideosPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const sortedArticles = getLocalizedFeaturedVideoArticles(locale, videoArticles.length);
  const ui = getVideoUi(locale);

  return (
    <main>
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <Clapperboard aria-hidden="true" className="size-4" />
            {ui.eyebrow}
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">{ui.hubTitle}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">
            {ui.hubDescription(videoArticles.length)}
          </p>
        </div>
      </section>
      <section className="border-b border-[#2c3631] bg-[#151b18]">
        <div className="site-container py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase text-[#68bd8d]">{ui.seasonOneCurrent}</p>
            <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">{ui.currentSourcesTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] md:text-base">{ui.currentSourcesDescription}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {currentVideoSources.map((source, index) => (
              <article className="overflow-hidden border border-[#354039] bg-[#111512]" key={source.youtubeId}>
                <a
                  className="group block"
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`${source.title} - ${source.channel}`}
                >
                  <span className="relative block aspect-video overflow-hidden border-b border-[#2c3631] bg-[#0d100e]">
                    <VideoThumbnailImage
                      alt={`${source.title} ${ui.thumbnail}`}
                      eager={index === 0}
                      youtubeId={source.youtubeId}
                    />
                    <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                    <span className="absolute bottom-3 left-3 inline-flex size-10 items-center justify-center bg-[#d9a93a] text-[#111512]" aria-hidden="true">
                      <PlayCircle className="size-5" />
                    </span>
                    <span className="absolute right-3 top-3 border border-[#68bd8d]/40 bg-[#111512]/90 px-2 py-1 text-[11px] font-semibold uppercase text-[#79d19c]">
                      {ui.seasonOneCurrent}
                    </span>
                  </span>
                  <span className="block p-5">
                    <span className="block text-xs font-semibold uppercase text-[#d9a93a]">{source.channel}</span>
                    <span className="display-font mt-3 block text-2xl leading-tight text-white">{source.title}</span>
                    <span className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#8b9992]">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3.5" />{source.publishedDate}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-3.5" />{source.durationMinutes} min</span>
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">
                      {ui.youtubeSource}
                      <ExternalLink aria-hidden="true" className="size-4" />
                    </span>
                  </span>
                </a>
                <a
                  className="flex items-center justify-between border-t border-[#2c3631] px-5 py-3 text-xs font-semibold uppercase text-[#b8c3bd] hover:bg-[#1b241f] hover:text-white"
                  href={`/${locale}/guides/${source.internalGuideSlug}`}
                  title={ui.relatedGuide}
                >
                  {ui.relatedGuide}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="site-container py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{ui.betaWorkflow} / {ui.historicalReference}</p>
          <h2 className="display-font mt-3 text-4xl text-white">{ui.allVideos}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedArticles.map((article, index) => (
            <VideoArticleCard article={article} locale={locale} eager={index === 0} key={article.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
