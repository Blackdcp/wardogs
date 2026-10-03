import type {Metadata} from "next";
import {BookOpenCheck, ExternalLink, ShieldCheck, Users} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, locales} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "aboutPage"});
  return buildPageMetadata(locale, "/about", t("metaTitle"), t("metaDescription"), "WARDOGS wiki, about WARDOGS wiki, WARDOGS community, independent game wiki, WARDOGS editorial team, game database");
}

export default async function AboutPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "aboutPage"});
  const caseStudyHref = locale === "zh-cn"
    ? "https://www.tsalon.tech/articles/wardogs-wiki-verifiable-content-engineering/"
    : "https://www.tsalon.tech/en/articles/wardogs-wiki-verifiable-content-engineering/";
  const sections = [
    {icon: Users, title: t("identityTitle"), body: t("identityBody")},
    {icon: BookOpenCheck, title: t("methodTitle"), body: t("methodBody")},
    {icon: ShieldCheck, title: t("independenceTitle"), body: t("independenceBody")}
  ];

  return (
    <main>
      <header className="border-b border-[#2c3631] bg-[#101411] py-14 md:py-20">
        <div className="site-container max-w-4xl">
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("eyebrow")}</p>
          <h1 className="display-font mt-5 text-4xl leading-tight text-white sm:text-5xl md:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{t("intro")}</p>
        </div>
      </header>

      <section className="site-container max-w-4xl py-12 md:py-16">
        <div className="divide-y divide-[#2c3631] border-y border-[#2c3631]">
          {sections.map(({icon: Icon, title, body}) => (
            <section className="grid gap-4 py-8 md:grid-cols-[3rem_1fr]" key={title}>
              <span className="inline-flex size-11 items-center justify-center bg-[#203429] text-[#79d19c]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="display-font text-2xl text-white">{title}</h2>
                <p className="mt-3 text-base leading-8 text-[#aebbb4]">{body}</p>
              </div>
            </section>
          ))}
        </div>
        <section className="mt-10 border border-[#31543f] bg-[#142019] p-6 md:p-8" aria-labelledby="engineering-case-study">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79d19c]">T Salon</p>
          <h2 className="display-font mt-3 text-2xl text-white" id="engineering-case-study">{t("caseStudyTitle")}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aebbb4]">{t("caseStudyBody")}</p>
          <a className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d9a93a] underline decoration-[#d9a93a]/40 underline-offset-4 hover:text-[#f0c45f]" href={caseStudyHref} title={t("caseStudyCta")}>
            {t("caseStudyCta")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </section>
      </section>
    </main>
  );
}
