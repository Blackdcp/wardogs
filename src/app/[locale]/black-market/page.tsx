import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MarketGuide, getMarketCopy} from "@/components/markets/market-guide";
import {isLocale, locales} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const {title, description} = getMarketCopy(locale, "black");
  return buildPageMetadata(locale, "/black-market", title, description);
}

export default async function BlackMarketPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  return <MarketGuide locale={locale} kind="black" />;
}
