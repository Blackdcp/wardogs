import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {isLocale, locales} from "@/config/site";
import {CatalogueHub} from "@/components/catalogue/catalogue-hub";
import {JsonLd} from "@/components/seo/json-ld";
import {buildItemHubMetadata} from "@/lib/item-metadata";
import {buildItemIndexJsonLd} from "@/lib/item-structured-data";
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
  return buildItemHubMetadata(locale);
}
export default async function ItemsPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const adsT = await getTranslations({locale, namespace: "ads"});
  return (
    <main>
      <JsonLd data={buildItemIndexJsonLd(locale)} />
      <CatalogueHub locale={locale}>
        <section className="site-container py-2" data-page-ad-inventory="items">
          <AdsterraDisplayBanner label={adsT("label")} placement="rectangle" />
          <AdsterraNativeBanner label={adsT("label")} />
          <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />
        </section>
      </CatalogueHub>
    </main>
  );
}
