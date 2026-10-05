import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
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
  const c = interactiveMapPageCopy[locale];
  return buildPageMetadata(locale as Locale, "/tools/map", c.title, c.desc, "WARDOGS interactive map, WARDOGS map tool, mortar calculator, artillery range, FOB placement, control zone map, WARDOGS tactical map");
}

export default async function TacticalMapPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const c = interactiveMapPageCopy[locale];
  const relatedLinks = await buildToolRelatedLinks("map", locale);
  const headerT = await getTranslations({locale, namespace: "nav"});
  const t = await getTranslations({locale, namespace: "ads"});

  return (
    <main className="site-container py-8 md:py-12">
      <ToolPageHeader toolId="map" eyebrow={c.badge} title={c.title} description={c.desc} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]}>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#344039] bg-[#111613] p-4" data-tool-crosslink="artillery">
          <div className="flex min-w-0 items-start gap-3">
            <Crosshair aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8ce2ad]" />
            <span className="text-sm font-semibold leading-6 text-[#edf2ef]">
              {c.calcPrompt}
            </span>
          </div>
          <Link
            href="/tools/artillery-calculator"
            title={c.calcTitle}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-[6px] border border-[#3c5c46] bg-[#16251b] px-3.5 py-2 text-xs font-semibold text-[#d8f4e4] transition-colors hover:border-[#69c78f] hover:bg-[#1b3023] hover:text-white"
          >
            <span>{c.calcCta}</span>
          </Link>
        </div>
      </ToolPageHeader>

      <section aria-label={c.title}>
        <WardogsMapViewer initialMap="bakurani" locale={locale} />
      </section>

      <ToolRelatedGuides model={relatedLinks} locale={locale} />

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
