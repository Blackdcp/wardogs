import {HubHeader} from "@/components/ui/hub-header";
import {SectionHeading} from "@/components/ui/section-heading";
import type {Metadata} from "next";
import {Fragment} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, siteLocales, type Locale} from "@/config/site";
import {GuideRouteGrid} from "@/components/guides/guide-route-grid";
import {resolveGuideRoutes} from "@/features/guides/guide-routes";
import {GuideGrid} from "@/components/guides/guide-grid";
import {VideoGuideStrip} from "@/components/guides/video-guide-strip";
import {getGuideHubCopy, groupGuideCollections} from "@/features/guides/guide-collections";
import {buildGuideIndex} from "@/features/guides/guide-index";
import type {GuideCategory} from "@/content/manifest";
import {buildPageMetadata} from "@/lib/metadata";
import {buildGuideIndexJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return siteLocales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const [t, guides] = await Promise.all([
    getTranslations({locale, namespace: "guides"}),
    buildGuideIndex(locale)
  ]);
  return buildPageMetadata(locale, "/guides", t("metaTitle"), t("description", {count: guides.length}), "WARDOGS guides, WARDOGS tips, WARDOGS beginner guide, WARDOGS how to play, WARDOGS tutorial, tactical FPS guide, WARDOGS wiki, WARDOGS walkthrough");
}

export default async function GuidesPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  setRequestLocale(locale);
  const [t, categories, adsT, guides] = await Promise.all([
    getTranslations({locale, namespace: "guides"}),
    getTranslations({locale, namespace: "categories"}),
    getTranslations({locale, namespace: "ads"}),
    buildGuideIndex(locale)
  ]);
  const collections = groupGuideCollections(guides);
  const routes = resolveGuideRoutes(guides, locale);
  const routeT = await getTranslations({locale});
  const hubCopy = getGuideHubCopy(locale);
  const categoryLabels = Object.fromEntries(
    (["access", "release", "store", "platform", "video", "community", "developer", "guide"] as GuideCategory[])
      .map((category) => [category, categories(category)])
  ) as Record<GuideCategory, string>;

  return (
    <main>
      <JsonLd data={buildGuideIndexJsonLd(locale, guides)} />
      <HubHeader eyebrow={t("count", {count: guides.length})} title={t("title")} description={t("description", {count: guides.length})} />
      <GuideRouteGrid routes={routes} t={routeT} />
      <section className="site-container py-10 md:py-12">
        <nav aria-label={hubCopy.title} className="mb-8 flex flex-wrap gap-2">
          {collections.map((collection) => (
            <a className="rounded border border-[#344039] px-4 py-2 text-sm text-[#d7ded9] hover:border-[#79d19c] hover:text-[#79d19c]" href={`#collection-${collection.key}`} key={collection.key} title={hubCopy.collections[collection.key]}>
              {hubCopy.collections[collection.key]} ({collection.guides.length})
            </a>
          ))}
        </nav>
        <div data-page-ad-inventory="guides">
          <AdsterraNativeBanner label={adsT("label")} />
          <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />
        </div>
      </section>
      <VideoGuideStrip locale={locale} />
      <div className="site-container space-y-10 py-10 md:py-12">
        {collections.map((collection, index) => (
          <Fragment key={collection.key}>
            <section className="scroll-mt-24" id={`collection-${collection.key}`} aria-labelledby={`collection-${collection.key}-title`}>
              <SectionHeading id={`collection-${collection.key}-title`} title={`${hubCopy.collections[collection.key]} (${collection.guides.length})`} />
              <GuideGrid guides={collection.guides} readLabel={t("read")} categoryLabels={categoryLabels} />
            </section>
            {index === 0 ? <div data-page-ad-inventory="guides"><AdsterraDisplayBanner label={adsT("label")} placement="rectangle" /></div> : null}
          </Fragment>
        ))}
      </div>
    </main>
  );
}
