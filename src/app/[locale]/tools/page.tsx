import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ToolHub} from "@/components/tools/tool-hub";
import {isLocale, locales} from "@/config/site";
import {buildGuideIndex} from "@/features/guides/guide-index";
import {JsonLd} from "@/components/seo/json-ld";
import {buildPageMetadata} from "@/lib/metadata";
import {buildToolIndexJsonLd} from "@/lib/structured-data";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "toolsHub"});
  return buildPageMetadata(locale, "/tools", t("metaTitle"), t("metaDescription"), "WARDOGS tools, WARDOGS map, WARDOGS artillery calculator, WARDOGS weapon compare, WARDOGS cash XP calculator");
}

export default async function ToolsPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const [t, guides] = await Promise.all([getTranslations({locale}), buildGuideIndex(locale)]);
  return (
    <>
      <JsonLd data={buildToolIndexJsonLd(locale, t)} />
      <ToolHub locale={locale} guides={guides} t={t} />
    </>
  );
}
