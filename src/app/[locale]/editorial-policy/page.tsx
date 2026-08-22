import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {BookOpenCheck, RefreshCw, SearchCheck, ShieldCheck} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {isLocale, locales} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

const methodKeys = ["official", "footage", "status", "updates", "corrections"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "editorial"});
  return buildPageMetadata(locale, "/editorial-policy", t("metaTitle"), t("metaDescription"));
}

export default async function EditorialPolicyPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "editorial"});

  return (
    <main>
      <header className="border-b border-[#2c3631] bg-[#101411] py-14 md:py-20">
        <div className="site-container max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <BookOpenCheck aria-hidden="true" className="size-4" />
            {t("eyebrow")}
          </p>
          <h1 className="display-font mt-5 text-4xl leading-tight text-white sm:text-5xl md:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{t("intro")}</p>
        </div>
      </header>

      <section className="border-b border-[#2c3631] bg-[#151b18] py-10 md:py-14">
        <div className="site-container max-w-4xl">
          <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
            <span className="inline-flex size-12 items-center justify-center bg-[#203429] text-[#79d19c]">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h2 className="display-font text-3xl text-white">{t("teamTitle")}</h2>
              <p className="mt-4 text-base leading-8 text-[#b8c3bd]">{t("teamBody")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container max-w-4xl py-12 md:py-16" aria-labelledby="editorial-method">
        <div className="flex items-center gap-3">
          <SearchCheck aria-hidden="true" className="size-6 text-[#79d19c]" />
          <h2 className="display-font text-3xl text-white" id="editorial-method">{t("methodTitle")}</h2>
        </div>
        <div className="mt-8 border-y border-[#2c3631]">
          {methodKeys.map((key, index) => (
            <section className="grid gap-3 border-b border-[#2c3631] py-7 last:border-b-0 md:grid-cols-[2rem_1fr]" key={key}>
              <span className="font-mono text-sm text-[#d9a93a]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="display-font text-2xl text-white">{t(`${key}Title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-[#aebbb4]">{t(`${key}Body`)}</p>
              </div>
            </section>
          ))}
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-[#8b9992]">
          <RefreshCw aria-hidden="true" className="size-4" />
          {t("updatesBody")}
        </p>
      </section>
    </main>
  );
}
