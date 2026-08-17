import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, type Locale} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "privacy"});
  return buildPageMetadata(locale, "/privacy", t("title"), t("intro"));
}

export default async function PrivacyPage({params}: Props) {
  const {locale: requested} = await params;
  if (!isLocale(requested)) notFound();
  const locale: Locale = requested;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "privacy"});
  return <main className="site-container max-w-4xl py-16 md:py-24"><h1 className="display-font text-5xl text-white">{t("title")}</h1><p className="mt-8 text-xl text-[#c4cec9]">{t("intro")}</p><p className="mt-6 leading-8 text-[#a8b4ae]">{t("content")}</p><p className="mt-6 leading-8 text-[#a8b4ae]">{t("advertising")}</p></main>;
}
