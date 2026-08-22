import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Clapperboard} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {VideoArticleCard} from "@/components/videos/video-article-card";
import {getFeaturedVideoArticles, videoArticles} from "@/features/videos/video-library";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata(
    locale,
    "/videos",
    "WARDOGS Videos - YouTube Gameplay Breakdowns",
    "Standalone WARDOGS video guides for beginner tips, settings, money, helicopters, FOBs, weapons, vehicles, objectives, gameplay, and Early Access context."
  );
}

export default async function VideosPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const sortedArticles = getFeaturedVideoArticles(videoArticles.length);

  return (
    <main>
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <Clapperboard aria-hidden="true" className="size-4" />
            WARDOGS Video Intelligence
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">WARDOGS YouTube Guides</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">
            {videoArticles.length} independently written breakdowns turn useful creator and official footage into practical guides for first matches, money, settings, objectives, helicopters, FOBs, weapons, vehicles, and buying decisions.
          </p>
        </div>
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
