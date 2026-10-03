import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";
import {ArtilleryCalculator} from "@/components/artillery/artillery-calculator";
import {isLocale, locales, type Locale} from "@/config/site";
import {getArtilleryCopy} from "@/features/artillery/artillery-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const c = getArtilleryCopy(locale);
  return buildPageMetadata(
    locale as Locale,
    "/tools/artillery-calculator",
    c.metaTitle,
    c.metaDescription,
    "WARDOGS artillery calculator, WARDOGS mortar calculator, L81 mortar firing table, SPH-2 mils, azimuth, flight time, 迫击炮密位, 战术火控"
  );
}

export default async function ArtilleryCalculatorPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const t = await getTranslations({locale, namespace: "ads"});

  return (
    <main className="site-container py-8 md:py-12">
      <ArtilleryCalculator locale={locale} />

      {/* Dwell-Time Monetization: Players keeping fire control open during raids */}
      <section className="mt-12 pt-8 border-t border-[#2b3530]" data-page-ad-inventory="tools-artillery">
        <AdsterraDisplayBanner label={t("label")} placement="rectangle" />
        <AdsterraNativeBanner label={t("label")} />
        <AdsterraSmartlink cta={t("smartlinkCta")} description={t("smartlinkDescription")} label={t("sponsored")} />
      </section>
    </main>
  );
}
