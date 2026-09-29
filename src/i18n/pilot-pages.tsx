import type {ReactNode} from "react";
import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowUpRight, BookOpen, Languages} from "lucide-react";
import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {visit} from "unist-util-visit";
import type {Root} from "mdast";
import {siteLocales, type PilotLocale} from "@/config/site";
import {remarkWardogsMdxPolicy} from "@/content/mdx-policy";
import {mdxComponents} from "@/components/mdx/mdx-components";
import {JsonLd} from "@/components/seo/json-ld";
import {getGuideDiscoveryImage, getGuideDiscoveryImageSrc} from "@/features/guides/guide-discovery-images";
import {assetPath} from "@/lib/assets";
import {publicAssetUrl, publicRoutePath, publicRouteUrl} from "@/lib/public-url";
import zhTw from "../../messages/zh-tw.json";
import pl from "../../messages/pl.json";
import {buildGuideIndexAlternates, hasGuideTranslation, listPilotGuides, loadPilotGuide} from "./pilot-guides";
import {siteLanguageTags, siteLocaleLabels} from "./pilot-locales";

export const pilotMessages = {"zh-tw": zhTw, pl};

function remarkPilotPublicLinks() {
  return (tree: Root) => {
    visit(tree, "link", (node) => {
      if (node.url.startsWith("/") && !node.url.startsWith("//")) node.url = publicRoutePath(node.url);
    });
  };
}

export async function compilePilotGuideBody(body: string) {
  return compileMDX({
    source: body,
    components: mdxComponents,
    options: {blockJS: true, blockDangerousJS: true, mdxOptions: {remarkPlugins: [remarkGfm, remarkWardogsMdxPolicy, remarkPilotPublicLinks]}}
  });
}

export function buildPilotIndexMetadata(locale: PilotLocale): Metadata {
  const {title, description} = pilotMessages[locale].pilot;
  return {title, description, alternates: buildGuideIndexAlternates(locale), robots: {index: true, follow: true}};
}

// The shared root layout owns html/body, analytics and ads. This shell only owns pilot navigation.
export function PilotLocaleShell({locale, children}: {locale: PilotLocale; children: ReactNode}) {
  const {pilot: t, common} = pilotMessages[locale];
  return <div className="flex min-h-screen min-w-0 flex-col">
    <a className="sr-only focus:not-sr-only focus:p-4" href="#pilot-main" title={common.skipToContent}>{common.skipToContent}</a>
    <header className="border-b border-[#2c3631] bg-[#101411]">
      <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4">
        <div>
          <a className="text-xl font-bold text-white" href={publicRoutePath(`/${locale}/guides`)} title={t.title}>WARDOGS Wiki</a>
          <p className="mt-1 text-xs leading-5 text-[#a8b4ae]">{common.fanMade}</p>
        </div>
        <nav aria-label={common.language} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#b8c3bd]">
          <a className="inline-flex min-h-11 items-center gap-2 hover:text-white" href={publicRoutePath(`/${locale}/guides`)} title={t.allGuides}><BookOpen aria-hidden size={16} />{t.allGuides}</a>
          <a className="inline-flex min-h-11 items-center gap-2 hover:text-white" href={publicRoutePath("/en")} title={t.english} lang="en">{t.english}<ArrowUpRight aria-hidden size={16} /></a>
        </nav>
      </div>
    </header>
    <div id="pilot-main" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">{children}</div>
    <footer className="border-t border-[#2c3631] py-8 text-sm leading-6 text-[#a8b4ae]">
      <div className="site-container max-w-4xl space-y-3">
        <p>{t.independent}</p>
        <p>{t.review}</p>
        <nav aria-label={t.sitePolicies}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[#2c3631] pt-3">
            {[["about", t.about], ["contact", t.contact], ["editorial-policy", t.editorialPolicy], ["privacy", t.privacy], ["terms", t.terms]].map(([pathname, label]) =>
              <li key={pathname}><a className="inline-flex min-h-11 items-center text-[#8bb59d] hover:text-white" href={publicRoutePath(`/en/${pathname}`)} hrefLang="en" title={label}>{label}</a></li>)}
          </ul>
        </nav>
      </div>
    </footer>
  </div>;
}

function PilotLanguageLinks({locale, slug}: {locale: PilotLocale; slug?: string}) {
  const available = slug ? siteLocales.filter((language) => hasGuideTranslation(language, slug)) : siteLocales;
  return <nav aria-label={pilotMessages[locale].pilot.otherLanguage} className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#2c3631] py-3 text-sm">
    <Languages aria-hidden size={16} className="text-[#a8b4ae]" />
    {available.map((language) => <a
      key={language} lang={siteLanguageTags[language]} hrefLang={siteLanguageTags[language]}
      title={`${pilotMessages[locale].pilot.language}: ${siteLocaleLabels[language]}`}
      aria-current={language === locale ? "page" : undefined}
      className={language === locale ? "min-h-11 content-center font-semibold text-white" : "min-h-11 content-center text-[#8bb59d] hover:text-white"}
      href={publicRoutePath(`/${language}/guides${slug ? `/${slug}` : ""}`)}
    >{siteLocaleLabels[language]}</a>)}
  </nav>;
}

export async function PilotGuideIndex({locale}: {locale: PilotLocale}) {
  const guides = await listPilotGuides(locale);
  const t = pilotMessages[locale].pilot;
  return <main className="site-container max-w-4xl py-10 md:py-14">
    <JsonLd data={{"@context": "https://schema.org", "@type": "CollectionPage", name: t.title,
      url: publicRouteUrl(`/${locale}/guides`), inLanguage: siteLanguageTags[locale],
      mainEntity: {"@type": "ItemList", itemListElement: guides.map(({frontmatter}, index) => ({
        "@type": "ListItem", position: index + 1, name: frontmatter.title,
        url: publicRouteUrl(`/${locale}/guides/${frontmatter.slug}`)
      }))}}} />
    <p className="mb-3 text-sm text-[#8bb59d]">{pilotMessages[locale].common.fanMade}</p>
    <h1 className="break-words text-3xl font-bold leading-tight text-white md:text-4xl">{t.title}</h1>
    <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8c3bd]">{t.description}</p>
    <div className="mt-7"><PilotLanguageLinks locale={locale} /></div>
    <div className="divide-y divide-[#2c3631]">
      {guides.map(({frontmatter}) => <article key={frontmatter.slug} className="py-7">
        <h2 className="text-xl font-semibold leading-8 text-white"><a className="hover:text-[#8bb59d]" href={publicRoutePath(`/${locale}/guides/${frontmatter.slug}`)} title={frontmatter.title}>{frontmatter.title}</a></h2>
        <p className="mt-3 text-sm leading-7 text-[#b8c3bd]">{frontmatter.description}</p>
        <a className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" title={frontmatter.title} href={publicRoutePath(`/${locale}/guides/${frontmatter.slug}`)}>{t.read}<ArrowUpRight aria-hidden size={16} /></a>
      </article>)}
    </div>
    <PilotToolLinks locale={locale} />
  </main>;
}

function PilotToolLinks({locale}: {locale: PilotLocale}) {
  const t = pilotMessages[locale].pilot;
  return <section className="mt-10 border-t border-[#2c3631] pt-6">
    <h2 className="text-lg font-semibold text-white">{t.tools}</h2>
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8bb59d]">
      {[["loadout-budget", t.budget], ["logistics-planner", t.logistics], ["map", t.map]].map(([path, label]) =>
        <li key={path}><a className="inline-flex min-h-11 items-center gap-2 hover:text-white" href={publicRoutePath(`/en/tools/${path}`)} title={label}>{label}<ArrowUpRight aria-hidden size={14} /></a></li>)}
    </ul>
  </section>;
}

export async function PilotGuideArticle({locale, slug}: {locale: PilotLocale; slug: string}) {
  const guide = await loadPilotGuide(locale, slug);
  if (!guide) notFound();
  const t = pilotMessages[locale].pilot;
  const {frontmatter, body} = guide;
  const compiled = await compilePilotGuideBody(body);
  const related = (await listPilotGuides(locale)).filter((entry) => entry.frontmatter.slug !== slug);
  const image = getGuideDiscoveryImage(slug);
  const imageUrl = image ? getGuideDiscoveryImageSrc(image) : assetPath("/images/wardogs-hero.jpg");
  return <main className="site-container max-w-4xl py-8 md:py-12">
    <JsonLd data={{"@context": "https://schema.org", "@type": "Article", headline: frontmatter.title,
      description: frontmatter.description, inLanguage: siteLanguageTags[locale],
      mainEntityOfPage: publicRouteUrl(`/${locale}/guides/${slug}`), dateModified: frontmatter.updatedAt,
      author: {"@type": "Organization", name: t.team}, image: publicAssetUrl(image?.url ?? "/images/wardogs-hero.jpg")}} />
    <a className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href={publicRoutePath(`/${locale}/guides`)} title={t.allGuides}><ArrowLeft aria-hidden size={16} />{t.allGuides}</a>
    <header className="py-5 md:py-8">
      <p className="mb-3 text-sm text-[#8bb59d]">{pilotMessages[locale].common.fanMade}</p>
      <h1 className="break-words text-3xl font-bold leading-tight text-white md:text-4xl">{frontmatter.title}</h1>
      <p className="mt-5 text-base leading-8 text-[#b8c3bd]">{frontmatter.description}</p>
      <p className="mt-4 text-sm text-[#a8b4ae]">{t.updated}: <time dateTime={frontmatter.updatedAt}>{frontmatter.updatedAt}</time> · {t.team}</p>
    </header>
    <PilotLanguageLinks locale={locale} slug={slug} />
    <figure className="my-8">
      <Image className="aspect-video w-full object-cover" src={imageUrl} alt={t.image} width={1280} height={720} sizes="(min-width: 896px) 896px, 100vw" loading="eager" unoptimized />
      <figcaption className="mt-2 text-xs text-[#a8b4ae]">{t.imageCredit}: <a className="text-[#8bb59d]" href={image?.creditUrl ?? "https://www.team17.com/press-and-creator-hub"} title={`${t.imageCredit}: ${image?.creditLabel ?? "Team17 WARDOGS Press Kit"}`} target="_blank" rel="noreferrer">{image?.creditLabel ?? "Team17 WARDOGS Press Kit"}</a></figcaption>
    </figure>
    <article className="guide-prose">{compiled.content}</article>
    <section className="mt-10 border-t border-[#2c3631] pt-6" aria-labelledby="pilot-faq">
      <h2 id="pilot-faq" className="text-2xl font-semibold text-white">{t.faq}</h2>
      <dl className="mt-5 space-y-5">{frontmatter.faq.map(({question, answer}) => <div key={question}>
        <dt className="font-semibold leading-7 text-white">{question}</dt><dd className="mt-2 leading-7 text-[#b8c3bd]">{answer}</dd>
      </div>)}</dl>
    </section>
    <section className="mt-10 border-t border-[#2c3631] pt-6" aria-labelledby="pilot-sources">
      <h2 id="pilot-sources" className="text-2xl font-semibold text-white">{t.sources}</h2>
      <ul className="mt-4 space-y-4 text-sm">{frontmatter.sources.map((source) => <li key={source.url}>
        <a className="text-[#8bb59d] hover:text-white" href={source.url} title={source.label} target="_blank" rel="noreferrer">{source.label}</a>
        <p className="mt-1 text-[#a8b4ae]">{t.checked}: <time dateTime={source.checkedAt}>{source.checkedAt}</time></p>
      </li>)}</ul>
    </section>
    <section className="mt-10 border-t border-[#2c3631] pt-6" aria-labelledby="pilot-related">
      <h2 id="pilot-related" className="text-2xl font-semibold text-white">{t.related}</h2>
      <ul className="mt-4 space-y-3">{related.map(({frontmatter: entry}) => <li key={entry.slug}><a className="text-[#8bb59d] hover:text-white" href={publicRoutePath(`/${locale}/guides/${entry.slug}`)} title={entry.title}>{entry.title}</a></li>)}</ul>
    </section>
    <PilotToolLinks locale={locale} />
  </main>;
}
