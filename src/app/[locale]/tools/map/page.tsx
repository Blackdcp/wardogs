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

import {Link} from "@/i18n/navigation";
import {Crosshair} from "lucide-react";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const c = interactiveMapPageCopy[locale] ?? interactiveMapPageCopy.en;
  return buildPageMetadata(locale as Locale, "/tools/map", c.title, c.desc, "WARDOGS interactive map, WARDOGS map tool, mortar calculator, artillery range, FOB placement, control zone map, WARDOGS tactical map");
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

        {/* Tactical Cross-Tool Callout: Quick Jump to Artillery Calculator */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#3b5946] bg-[#122119] p-3">
          <div className="flex items-center gap-2">
            <Crosshair className="size-5 text-[#8ce2ad]" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {c.calcPrompt}
            </span>
          </div>
          <Link
            href="/tools/artillery-calculator"
            title={c.calcTitle}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#254533] px-3 py-1.5 text-xs font-bold text-[#8ce2ad] hover:bg-[#346247] hover:text-white transition-all shadow"
          >
            <span>{c.calcCta}</span>
          </Link>
        </div>
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
