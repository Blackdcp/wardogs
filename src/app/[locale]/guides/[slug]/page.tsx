import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ArrowLeft, CalendarDays, ExternalLink} from "lucide-react";
import {isLocale, locales, officialLinks, type Locale} from "@/config/site";
import {guideManifest} from "@/content/manifest";
import {compileLocalizedGuideBody, loadGuideDocument} from "@/content/guides";
import {mdxComponents} from "@/components/mdx/mdx-components";
import {SourceList} from "@/components/guides/source-list";
import {RelatedGuides} from "@/components/guides/related-guides";
import {FaqList} from "@/components/ui/faq-list";
import {ButtonLink} from "@/components/ui/button-link";
import {StatusBadge} from "@/components/ui/status-badge";
import {Link} from "@/i18n/navigation";
import {getRelatedGuides} from "@/features/guides/related";
import {getGuideDiscoveryImage} from "@/features/guides/guide-discovery-images";
import {buildArticleMetadata} from "@/lib/metadata";
import {buildArticleJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type PageProps = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  return locales.flatMap((locale) => guideManifest.map(({slug}) => ({locale, slug})));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  if (!isLocale(locale)) return {};
  const guide = await loadGuideDocument(locale, slug);
  return guide ? buildArticleMetadata(locale, guide) : {};
}

function plainDirectAnswer(body: string) {
  const firstParagraph = body
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .find((block) => block && !/^#{1,6}\s/.test(block));

  return (firstParagraph ?? "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .trim();
}

export default async function GuideArticlePage({params}: PageProps) {
  const {locale: requestedLocale, slug} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const guide = await loadGuideDocument(locale, slug);
  if (!guide) notFound();
  const discoveryImage = getGuideDiscoveryImage(slug);
  setRequestLocale(locale);
  const [t, categoryT, adsT, related, compiled] = await Promise.all([
    getTranslations({locale, namespace: "article"}),
    getTranslations({locale, namespace: "categories"}),
    getTranslations({locale, namespace: "ads"}),
    getRelatedGuides(locale, slug),
    compileLocalizedGuideBody(guide.body, mdxComponents, locale)
  ]);

  return (
    <main>
      <JsonLd data={buildArticleJsonLd(locale, guide)} />
      <header className="border-b border-[#2c3631] bg-[#101411] py-12 md:py-16">
        <div className="site-container max-w-4xl">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href="/guides">
            <ArrowLeft aria-hidden="true" size={16} />{t("back")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge>{categoryT(guide.frontmatter.category)}</StatusBadge>
            <span className="inline-flex items-center gap-2 text-xs text-[#8b9992]"><CalendarDays aria-hidden="true" size={14} />{t("lastChecked")} {guide.frontmatter.updatedAt}</span>
          </div>
          <p className="mt-3 text-xs text-[#8b9992]">
            {t("byline")} <Link className="font-semibold text-[#8bb59d] hover:text-white" href="/editorial-policy">{t("teamName")}</Link>
          </p>
          <h1 className="display-font mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">{guide.frontmatter.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{guide.frontmatter.description}</p>
        </div>
      </header>

      <article className="site-container max-w-4xl py-10 md:py-14">
        {discoveryImage ? (
          <figure className="mb-10 overflow-hidden border border-[#2c3631] bg-[#101411]">
            <Image
              alt={discoveryImage.alt}
              className="aspect-video w-full object-cover"
              height={discoveryImage.height}
              loading="eager"
              sizes="(min-width: 896px) 896px, 100vw"
              src={discoveryImage.url}
              unoptimized
              width={discoveryImage.width}
            />
            <figcaption className="border-t border-[#2c3631] px-4 py-3 text-xs text-[#8b9992]">
              {t("imageSource")}: <a className="inline-flex items-center gap-1 text-[#8bb59d] hover:text-white" href={discoveryImage.creditUrl} rel="noreferrer" target="_blank">{discoveryImage.creditLabel}<ExternalLink aria-hidden="true" className="size-3" /></a>
            </figcaption>
          </figure>
        ) : null}
        <aside className="mb-10 border-l-4 border-[#4d946d] bg-[#142019] p-6">
          <p className="text-xs font-semibold uppercase text-[#68bd8d]">{t("directAnswer")}</p>
          <p className="mt-3 text-base leading-7 text-white">{plainDirectAnswer(guide.body)}</p>
        </aside>
        <AdsterraNativeBanner label={adsT("label")} />
        <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />
        <div className="guide-prose">{compiled.content}</div>
        <SourceList sources={guide.frontmatter.sources} title={t("sources")} checkedLabel={t("lastChecked")} />
        <section className="mt-14" aria-labelledby="faq-title">
          <h2 className="display-font text-3xl text-white" id="faq-title">{t("faq")}</h2>
          <FaqList items={guide.frontmatter.faq} />
        </section>
        <div className="mt-14 flex flex-wrap gap-3 border-t border-[#2c3631] pt-8">
          <ButtonLink href="/guides">{t("back")}</ButtonLink>
          <ButtonLink external href={officialLinks.steam} variant="secondary">Steam</ButtonLink>
        </div>
      </article>
      <div className="border-t border-[#2c3631] bg-[#111512]">
        <RelatedGuides guides={related} locale={locale} title={t("related")} />
      </div>
    </main>
  );
}
