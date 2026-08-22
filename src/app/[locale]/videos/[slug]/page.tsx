import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, ExternalLink, PlayCircle} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {ButtonLink} from "@/components/ui/button-link";
import {OfficialVideo} from "@/components/mdx/official-video";
import {JsonLd} from "@/components/seo/json-ld";
import {getVideoArticle, videoArticles} from "@/features/videos/video-library";
import {buildVideoArticleJsonLd} from "@/features/videos/video-structured-data";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";
import {buildPageMetadataWithImage} from "@/lib/metadata";
import {getTranslations} from "next-intl/server";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type PageProps = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  return locales.flatMap((locale) => videoArticles.map(({slug}) => ({locale, slug})));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  if (!isLocale(locale)) return {};
  const article = getVideoArticle(slug);
  return article ? buildPageMetadataWithImage(locale, `/videos/${article.slug}`, article.title, article.description, {
    url: videoThumbnailUrl(article.youtubeId),
    width: 1280,
    height: 720,
    alt: `${article.sourceLabel} thumbnail`
  }) : {};
}

export default async function VideoArticlePage({params}: PageProps) {
  const {locale: requestedLocale, slug} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const article = getVideoArticle(slug);
  if (!article) notFound();
  const [adsT, articleT] = await Promise.all([
    getTranslations({locale, namespace: "ads"}),
    getTranslations({locale, namespace: "article"})
  ]);

  return (
    <main>
      <JsonLd data={buildVideoArticleJsonLd(locale, article)} />
      <header className="border-b border-[#2c3631] bg-[#101411] py-12 md:py-16">
        <div className="site-container max-w-4xl">
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href={`/${locale}/videos`}>
            <ArrowLeft aria-hidden="true" size={16} />
            All video guides
          </a>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <PlayCircle aria-hidden="true" className="size-4" />
            {article.kind === "official" ? "Official video breakdown" : "Creator footage breakdown"}
          </p>
          <p className="mt-3 text-xs uppercase text-[#8b9992]">
            Last updated <time dateTime={article.updatedDate}>{article.updatedDate}</time>
          </p>
          <p className="mt-3 text-xs text-[#8b9992]">
            {articleT("byline")} <a className="font-semibold text-[#8bb59d] hover:text-white" href={`/${locale}/editorial-policy`}>{articleT("teamName")}</a>
          </p>
          <h1 className="display-font mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{article.description}</p>
        </div>
      </header>

      <article className="site-container max-w-4xl py-10 md:py-14">
        <OfficialVideo id={article.youtubeId} title={article.sourceLabel} className="my-0 rounded-[8px]" />

        <aside className="my-10 border-l-4 border-[#4d946d] bg-[#142019] p-6">
          <p className="text-xs font-semibold uppercase text-[#68bd8d]">Quick answer</p>
          <p className="mt-3 text-base leading-7 text-white">{article.quickAnswer}</p>
        </aside>

        <AdsterraNativeBanner label={adsT("label")} />
        <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />

        <section className="border-y border-[#2c3631] py-8" aria-labelledby="video-takeaways">
          <h2 className="display-font text-3xl text-white" id="video-takeaways">Key Takeaways</h2>
          <ul className="mt-5 space-y-3">
            {article.takeaways.map((takeaway) => (
              <li className="border-l border-[#4d946d] pl-4 text-sm leading-7 text-[#cbd6d0]" key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </section>

        <div className="guide-prose mt-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <section>
            <h2>How this connects to the main WARDOGS guide</h2>
            <p>This page is a video-specific breakdown. For confirmed gameplay systems, access windows, pricing, and platform status, use the linked core guide instead of treating footage as final documentation.</p>
          </section>
        </div>

        <div className="mt-12 grid gap-px bg-[#2c3631] md:grid-cols-2">
          <a className="bg-[#151b18] p-5 hover:bg-[#1b241f]" href={article.sourceUrl} target="_blank" rel="noreferrer">
            <span className="block text-sm font-semibold text-[#79d19c]">{article.sourceLabel} <ExternalLink aria-hidden="true" className="inline size-4" /></span>
            <span className="mt-2 block text-xs uppercase text-[#8b9992]">{article.kind} source on YouTube</span>
          </a>
          <a className="bg-[#151b18] p-5 hover:bg-[#1b241f]" href={`/${locale}/guides/${article.internalGuideSlug}`}>
            <span className="block text-sm font-semibold text-[#79d19c]">Read the related WARDOGS guide</span>
            <span className="mt-2 block text-xs uppercase text-[#8b9992]">Internal guide: {article.internalGuideSlug}</span>
          </a>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-[#2c3631] pt-8">
          <ButtonLink href="/videos">All video guides</ButtonLink>
          <ButtonLink href={`/guides/${article.internalGuideSlug}`} variant="secondary">Related guide</ButtonLink>
        </div>
      </article>
    </main>
  );
}
