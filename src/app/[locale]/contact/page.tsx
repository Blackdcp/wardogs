import type {Metadata} from "next";
import {ExternalLink, MessageSquareWarning, MessagesSquare} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, locales, officialLinks} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

const repositoryIssues = "https://github.com/Blackdcp/wardogs/issues";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "contactPage"});
  return buildPageMetadata(locale, "/contact", t("metaTitle"), t("metaDescription"));
}

export default async function ContactPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "contactPage"});

  return (
    <main>
      <header className="border-b border-[#2c3631] bg-[#101411] py-14 md:py-20">
        <div className="site-container max-w-4xl">
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("eyebrow")}</p>
          <h1 className="display-font mt-5 text-4xl leading-tight text-white sm:text-5xl md:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{t("intro")}</p>
        </div>
      </header>

      <section className="site-container grid max-w-4xl gap-8 py-12 md:grid-cols-2 md:py-16">
        <article className="border border-[#35413b] bg-[#151b18] p-7">
          <MessageSquareWarning aria-hidden="true" className="size-6 text-[#79d19c]" />
          <h2 className="display-font mt-5 text-2xl text-white">{t("correctionsTitle")}</h2>
          <p className="mt-4 text-sm leading-7 text-[#aebbb4]">{t("correctionsBody")}</p>
          <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-[#9ae3b7]" href={repositoryIssues} target="_blank" rel="noreferrer">
            {t("correctionsCta")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </article>

        <article className="border border-[#35413b] bg-[#151b18] p-7">
          <MessagesSquare aria-hidden="true" className="size-6 text-[#d9a93a]" />
          <h2 className="display-font mt-5 text-2xl text-white">{t("gameSupportTitle")}</h2>
          <p className="mt-4 text-sm leading-7 text-[#aebbb4]">{t("gameSupportBody")}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
            <a className="inline-flex items-center gap-2 text-[#79d19c] hover:text-[#9ae3b7]" href={officialLinks.steam} target="_blank" rel="noreferrer">
              Steam <ExternalLink aria-hidden="true" className="size-4" />
            </a>
            <a className="inline-flex items-center gap-2 text-[#79d19c] hover:text-[#9ae3b7]" href={officialLinks.discord} target="_blank" rel="noreferrer">
              Discord <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
