import {HubHeader} from "@/components/ui/hub-header";
import {SectionHeading} from "@/components/ui/section-heading";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {isLocale, locales, type Locale} from "@/config/site";
import {CurrentVideoSourceGrid} from "@/components/videos/current-video-source-grid";
import {VideoCandidateList} from "@/components/videos/video-candidate-list";
import {VideoArticleCard} from "@/components/videos/video-article-card";
import {currentVideoSources, videoArticles} from "@/features/videos/video-library";
import {getLocalizedFeaturedVideoArticles} from "@/features/videos/video-localization";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";
import {getVideoUi} from "@/features/videos/video-ui";
import {buildPageMetadataWithImage} from "@/lib/metadata";
import {getTranslations} from "next-intl/server";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

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
    },
    "WARDOGS videos, WARDOGS gameplay, WARDOGS trailer, video guides, tactical FPS footage, creator videos, WARDOGS highlights"
  );
}

export default async function VideosPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const sortedArticles = getLocalizedFeaturedVideoArticles(locale, videoArticles.length);
  const ui = getVideoUi(locale);
  const adsT = await getTranslations({locale, namespace: "ads"});

  return (
    <main>
      <HubHeader eyebrow={ui.eyebrow} title={ui.hubTitle} description={ui.hubDescription(videoArticles.length)} />
      <VideoCandidateList locale={locale} />
      <section className="border-b border-[#2c3631] bg-[#151b18]">
        <div className="site-container py-12 md:py-16">
          <SectionHeading eyebrow={ui.seasonOneCurrent} title={ui.currentSourcesTitle} description={ui.currentSourcesDescription} />
          <div className="mt-8"><CurrentVideoSourceGrid locale={locale} sources={currentVideoSources} /></div>
        </div>
      </section>
      <section className="site-container py-2" data-page-ad-inventory="videos">
        <AdsterraNativeBanner label={adsT("label")} />
        <AdsterraDisplayBanner label={adsT("label")} placement="rectangle" />
        <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />
      </section>
      <section className="site-container py-12 md:py-16">
        <SectionHeading eyebrow={`${ui.betaWorkflow} / ${ui.historicalReference}`} title={ui.allVideos} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedArticles.map((article, index) => (
            <VideoArticleCard article={article} locale={locale} eager={index === 0} key={article.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
