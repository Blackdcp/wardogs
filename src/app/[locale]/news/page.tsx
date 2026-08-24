import type {Metadata} from "next";
import {CalendarDays, CheckCircle2, HelpCircle, Newspaper} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, locales, type Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {NEWS_CHECKLIST_SLUGS, NEWS_UPDATES} from "@/features/news/news-data";
import {Link} from "@/i18n/navigation";
import {buildPageMetadata} from "@/lib/metadata";
import {formatLocalizedDate} from "@/lib/localized-date";

type PageProps = {params: Promise<{locale: string}>};

const statusTone = {
  Confirmed: "border-[#4d946d] bg-[#1f3a2b] text-[#bce9cc]",
  "Not confirmed": "border-[#8e4545] bg-[#3e2424] text-[#ffd4d4]"
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "news"});
  return buildPageMetadata(locale, "/news", t("metaTitle"), t("metaDescription"));
}

export default async function NewsPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  setRequestLocale(locale);
  const [t, guides] = await Promise.all([
    getTranslations({locale, namespace: "news"}),
    listGuideSummaries(locale)
  ]);
  const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const checklistGuides = NEWS_CHECKLIST_SLUGS.map((slug) => guideBySlug.get(slug)).filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

  return (
    <main>
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#68bd8d]">
            <Newspaper aria-hidden="true" className="size-4" />
            {t("eyebrow")}
          </p>
          <h1 className="display-font mt-4 max-w-5xl text-5xl leading-none text-white md:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">{t("description")}</p>
        </div>
      </section>

      <section className="border-b border-[#2c3631] bg-[#0d0f0e] py-14 md:py-18">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div>
            <div className="flex items-center gap-3">
              <CalendarDays aria-hidden="true" className="size-5 text-[#d9a93a]" />
              <h2 className="display-font text-3xl text-white">{t("timeline.title")}</h2>
            </div>
            <ol className="mt-7 border-l border-[#344039]">
              {NEWS_UPDATES.map((item) => (
                <li key={`${item.date}-${item.titleKey}`} className="relative pb-8 pl-6 last:pb-0">
                  <span className="absolute -left-1.5 top-1.5 size-3 rounded-full bg-[#69c78f]" />
                  <div className="flex flex-wrap items-center gap-3">
                    <time className="font-mono text-xs uppercase text-[#9fa9a4]">{formatLocalizedDate(item.date, locale)}</time>
                    <span className={`inline-flex rounded-[4px] border px-2 py-1 text-[11px] font-semibold uppercase ${statusTone[item.status]}`}>
                      {t(`timeline.status.${item.status}`)}
                    </span>
                  </div>
                  <h3 className="display-font mt-3 text-2xl text-[#f2f5f3]">{t(`timeline.items.${item.titleKey}.title`)}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#a8b4ae]">{t(`timeline.items.${item.titleKey}.description`)}</p>
                  <Link href={`/guides/${item.guideSlug}`} className="mt-3 inline-flex text-sm font-semibold text-[#79d19c] hover:text-[#a0e0ba]">
                    {t("timeline.readMore")}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <aside className="border-t border-[#344039] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden="true" className="size-5 text-[#69c78f]" />
              <h2 className="display-font text-3xl text-white">{t("checklist.title")}</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae]">{t("checklist.description")}</p>
            <ul className="mt-6 space-y-3">
              {checklistGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/guides/${guide.slug}`} className="group block border-b border-[#2c3631] pb-3">
                    <span className="block text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">{guide.title}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[#728078]">{formatLocalizedDate(guide.updatedAt, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-[#111512] py-14 md:py-18">
        <div className="site-container">
          <div className="flex items-center gap-3">
            <HelpCircle aria-hidden="true" className="size-5 text-[#79a9d1]" />
            <h2 className="display-font text-3xl text-white">{t("rules.title")}</h2>
          </div>
          <div className="mt-7 grid gap-px bg-[#2c3631] md:grid-cols-3">
            {(["official", "rumor", "refresh"] as const).map((key) => (
              <div key={key} className="bg-[#171d1a] p-5">
                <h3 className="display-font text-xl text-white">{t(`rules.items.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-[#a8b4ae]">{t(`rules.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
