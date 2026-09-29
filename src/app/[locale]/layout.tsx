import type {ReactNode} from "react";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import "@/app/globals.css";
import {isPilotLocale, isSiteLocale, siteLocales} from "@/config/site";
import {PilotLocaleShell, pilotMessages} from "@/i18n/pilot-pages";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {GoogleAnalytics} from "@/components/seo/google-analytics";
import {SiteAnalytics} from "@/components/seo/site-analytics";
import {AdsterraBehavioralAds} from "@/components/ads/adsterra-behavioral-ads";
import {AdsterraDisplayBanner, AdsterraGlobalInventory} from "@/components/ads/adsterra-display-banner";
import {buildSiteMetadata} from "@/lib/metadata";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export const metadata = buildSiteMetadata();

export function generateStaticParams() {
  return siteLocales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = await params;
  if (!isSiteLocale(locale)) notFound();

  setRequestLocale(locale);
  if (isPilotLocale(locale)) {
    const messages = pilotMessages[locale];
    const adLabel = messages.ads.label;
    return <html lang={locale} data-scroll-behavior="smooth">
      <body className="min-h-screen overflow-x-hidden">
        <GoogleAnalytics />
        <AdsterraBehavioralAds />
        <AdsterraGlobalInventory label={adLabel} locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="pb-[74px] min-[468px]:pb-0">
            <PilotLocaleShell locale={locale}>
              <div className="site-container py-1" data-global-ad-position="top"><AdsterraDisplayBanner label={adLabel} placement="horizontal" /></div>
              {children}
              <div className="site-container py-1" data-global-ad-position="bottom"><AdsterraDisplayBanner label={adLabel} placement="horizontal" /></div>
            </PilotLocaleShell>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>;
  }
  const [messages, t, adsT] = await Promise.all([
    getMessages({locale}),
    getTranslations({locale, namespace: "common"}),
    getTranslations({locale, namespace: "ads"})
  ]);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className="min-h-screen overflow-x-hidden">
        <GoogleAnalytics />
        <SiteAnalytics locale={locale} />
        <AdsterraBehavioralAds />
        <AdsterraGlobalInventory label={adsT("label")} locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            title={t("skipToContent")}
            className="fixed left-4 top-2 z-[100] -translate-y-20 rounded-[4px] bg-[#69c78f] px-4 py-2 text-sm font-semibold text-[#071009] transition-transform focus:translate-y-0"
          >
            {t("skipToContent")}
          </a>
          <div className="flex min-h-screen flex-col pb-[74px] min-[468px]:pb-0">
            <SiteHeader />
            <div className="site-container py-1" data-global-ad-position="top">
              <AdsterraDisplayBanner label={adsT("label")} placement="horizontal" />
            </div>
            <div id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
              {children}
            </div>
            <div className="site-container py-1" data-global-ad-position="bottom">
              <AdsterraDisplayBanner label={adsT("label")} placement="horizontal" />
            </div>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
