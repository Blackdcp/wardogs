import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Clapperboard} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {VideoArticleCard} from "@/components/videos/video-article-card";
import {videoArticles} from "@/features/videos/video-library";
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
      <section className="site-container py-2">
      </section>
      <section className="site-container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedArticles.map((article, index) => (
            <VideoArticleCard article={article} locale={locale} eager={index === 0} key={article.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
