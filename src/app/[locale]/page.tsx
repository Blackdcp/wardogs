import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CatalogueHomeBand} from "@/components/catalogue/catalogue-home-band";
import {HomeCommandDeck} from "@/components/home/home-command-deck";
import {HomeProvenDemand} from "@/components/home/home-proven-demand";
import {HomeLiveIntel} from "@/components/home/home-live-intel";
import {HomeToolWorkbench} from "@/components/home/home-tool-workbench";
import {HomeLibrary} from "@/components/home/home-library";
import {HomeSectionAnalytics} from "@/components/seo/home-section-analytics";
import {isLocale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getHomeFacts} from "@/features/home/home-data";
import {buildHomeDiscoveryModel} from "@/features/home/home-discovery-model";
import {getHomeLiveIntelEntries} from "@/features/home/home-live-intel";
import {buildPageMetadata} from "@/lib/metadata";
import {buildHomeJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {AdsterraDisplayBanner, AdsterraSupplementalBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({locale, namespace: "home"});
  return buildPageMetadata(locale, "/", t("metaTitle"), t("metaDescription"), "WARDOGS wiki, WARDOGS database, tactical FPS wiki, WARDOGS guides, WARDOGS weapons, WARDOGS vehicles, WARDOGS map, WARDOGS season 2, WARDOGS server status, Steam early access");
}

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({locale});
  const [guides, liveIntel] = await Promise.all([
    listGuideSummaries(locale),
    getHomeLiveIntelEntries(locale)
  ]);
  const facts = getHomeFacts((key) => t(`home.stats.${key}`));
  const model = buildHomeDiscoveryModel(locale, guides, liveIntel);

  return (
    <main>
      <JsonLd data={buildHomeJsonLd(locale)} />
      <HomeSectionAnalytics locale={locale} />
      <HomeCommandDeck facts={facts} locale={locale} destinations={model.command} />
      <HomeProvenDemand
        locale={locale}
        assets={model.protectedDemand}
        guides={guides}
        sponsoredSlot={
          <div className="space-y-3" data-page-ad-inventory="home">
            <p className="px-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{t("ads.sponsored")}</p>
            <AdsterraNativeBanner label={t("ads.label")} />
          </div>
        }
      />

      <HomeLiveIntel locale={locale} entries={model.liveIntel} />
      <HomeToolWorkbench locale={locale} tools={model.featuredTools} sponsoredSlot={<AdsterraSupplementalBanner label={t("ads.label")} />} />
      <CatalogueHomeBand
        locale={locale}
        sponsoredSlot={
          <div data-page-ad-inventory="home">
            <AdsterraDisplayBanner label={t("ads.label")} placement="rectangle" />
          </div>
        }
      />
      <HomeLibrary locale={locale} destinations={model.library} sponsoredSlot={<AdsterraSmartlink cta={t("ads.smartlinkCta")} description={t("ads.smartlinkDescription")} label={t("ads.sponsored")} />} />
    </main>
  );
}
