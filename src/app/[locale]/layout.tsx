import type {ReactNode} from "react";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import "@/app/globals.css";
import {isLocale, locales} from "@/config/site";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const [messages, t] = await Promise.all([
    getMessages({locale}),
    getTranslations({locale, namespace: "common"})
  ]);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className="min-h-screen overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="fixed left-4 top-2 z-[100] -translate-y-20 rounded-[4px] bg-[#69c78f] px-4 py-2 text-sm font-semibold text-[#071009] transition-transform focus:translate-y-0"
          >
            {t("skipToContent")}
          </a>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
              {children}
            </div>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
