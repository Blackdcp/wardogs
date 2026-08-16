import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Clapperboard} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {VideoArticleCard} from "@/components/videos/video-article-card";
import {videoArticles} from "@/features/videos/video-library";
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
    "Standalone WARDOGS video guides for first looks, alpha footage, mortars, sniping, gameplay impressions, and official Early Access context."
  );
}

export default async function VideosPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;

  return (
    <main>
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <Clapperboard aria-hidden="true" className="size-4" />
            WARDOGS Video Intelligence
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">Standalone YouTube Breakdowns</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">
            Every collected WARDOGS YouTube source has its own article. Use these pages to understand footage-based gameplay, alpha caveats, mortars, sniping, squad movement, and buying questions.
          </p>
        </div>
      </section>
      <section className="site-container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {videoArticles.map((article) => (
            <VideoArticleCard article={article} locale={locale} key={article.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
