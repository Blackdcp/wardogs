import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";
import {MapTacticalIntel} from "@/components/map/map-tactical-intel";
import {WardogsMapViewer} from "@/components/map/wardogs-map-viewer";
import {isLocale, locales, type Locale} from "@/config/site";
import {interactiveMapPageCopy} from "@/features/maps/interactive-map-page-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const c = interactiveMapPageCopy[locale] ?? interactiveMapPageCopy.en;
  return buildPageMetadata(locale as Locale, "/tools/map", c.title, c.desc);
}

export default async function TacticalMapPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const c = interactiveMapPageCopy[locale] ?? interactiveMapPageCopy.en;
  const t = await getTranslations({locale, namespace: "ads"});

  return (
    <main className="site-container py-8 md:py-12">
      <header className="mb-6 max-w-4xl">
        <span className="rounded bg-sky-950 px-2.5 py-1 font-mono text-xs font-semibold text-sky-400 border border-sky-800 uppercase tracking-wider">
          {c.badge}
        </span>
        <h1 className="display-font mt-3 text-3xl font-black text-white sm:text-4xl md:text-5xl">
          {c.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-300">
          {c.desc}
        </p>
      </header>

      <section aria-label={c.title}>
        <WardogsMapViewer initialMap="bakurani" locale={locale} />
      </section>

      {/* Dwell-Time Monetization: High viewability for players running maps on secondary monitors */}
      <section className="mt-8 pt-6 border-t border-[#2b3530]" data-page-ad-inventory="tools-map">
        <AdsterraDisplayBanner label={t("label")} placement="rectangle" />
        <AdsterraNativeBanner label={t("label")} />
        <AdsterraSmartlink cta={t("smartlinkCta")} description={t("smartlinkDescription")} label={t("sponsored")} />
      </section>

      {/* Second-Monitor Tactical Intel, Ballistics Tables & Theater Guide */}
      <MapTacticalIntel locale={locale} />
    </main>
  );
}
