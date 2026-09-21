import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowRight, CalendarDays, ExternalLink, GitCompareArrows, PackageSearch} from "lucide-react";
import {EvidencePanel} from "@/components/catalogue/evidence-panel";
import {ItemChangeHistory} from "@/components/catalogue/item-change-history";
import {isLocale, type Locale} from "@/config/site";
import {getCatalogueFreshness} from "@/features/catalogue/catalogue-evidence";
import {
  getIndexableItemPaths,
  getItemByTypeAndSlug,
  getItemType,
  getRelatedItems,
  type WardogsItem
} from "@/features/items/item-library";
import {isItemDetailRouteAvailable} from "@/features/items/item-route-availability";
import {Link} from "@/i18n/navigation";
import {buildItemMetadata} from "@/lib/item-metadata";
import {buildItemArticleJsonLd} from "@/lib/item-structured-data";
import {assetPath} from "@/lib/assets";
import {JsonLd} from "@/components/seo/json-ld";
import {StatusBadge} from "@/components/ui/status-badge";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {loadGuideDocument} from "@/content/guides";
import {getTranslations} from "next-intl/server";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";

type PageProps = {params: Promise<{locale: string; type: string; slug: string}>};

export function generateStaticParams() {
  return getIndexableItemPaths();
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, type, slug} = await params;
  if (!isLocale(locale)) return {};
  const item = getItemByTypeAndSlug(type, slug);
  if (!item) return {};
  return buildItemMetadata(locale, item);
}

function statusTone(item: WardogsItem): "accent" | "warning" | "muted" {
  if (item.status === "official" || item.status === "verified-in-game") return "accent";
  if (item.status === "community-report") return "muted";
  return "warning";
}

export default async function ItemDetailPage({params}: PageProps) {
  const {locale: requestedLocale, type, slug} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const baseItem = getItemByTypeAndSlug(type, slug);
  const pathname = `/items/${type}/${slug}`;
  if (!baseItem || !isItemDetailRouteAvailable(locale, pathname)) notFound();
  const item = getLocalizedItem(baseItem, locale);
  const baseItemType = getItemType(item.type);
  const itemType = baseItemType ? getLocalizedItemType(baseItemType, locale) : undefined;
  const relatedItems = getRelatedItems(baseItem, locale).map((related) => getLocalizedItem(related, locale));
  const relatedGuideDocuments = await Promise.all(
    item.relatedGuides.map((guideSlug) => loadGuideDocument(locale, guideSlug))
  );
  const ui = getItemUi(locale);
  const quickFacts = item.facts.map(({label, value}) => ({label, value}));
  const freshness = getCatalogueFreshness({dataAsOf: baseItem.build, evidence: baseItem.evidence});
  const factsHeading = freshness === "historical" ? ui.historicalSnapshot : ui[freshness];
  const confirmedFacts = item.confirmedFacts ?? item.facts
    .filter((fact) => fact.value !== "Not confirmed")
    .map((fact) => `${fact.label}: ${fact.value}`);
  const unconfirmedFacts = item.unconfirmedFacts ?? item.facts
    .filter((fact) => fact.value === "Not confirmed")
    .map((fact) => `${fact.label} is not confirmed.`);
  const hasObservedAmmunition = baseItem.type === "weapons" && baseItem.facts.some((fact) =>
    fact.label === "Ammunition" && !/Not captured|Not confirmed/.test(fact.value)
  );
  const articleT = await getTranslations({locale, namespace: "article"});

  return (
    <main>
      <JsonLd data={buildItemArticleJsonLd(locale, item)} />
      <header className="border-b border-[#2c3631] bg-[#101411] py-12 md:py-16">
        <div className="site-container max-w-4xl">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href={`/items/${item.type}`} title={`WARDOGS ${itemType?.label ?? ui.itemsFallback}`}>
            <ArrowLeft aria-hidden="true" size={16} />WARDOGS {itemType?.label ?? ui.itemsFallback}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge tone={statusTone(item)}>{item.statusLabel}</StatusBadge>
            <span className="inline-flex items-center gap-2 text-xs text-[#8b9992]">
              <CalendarDays aria-hidden="true" size={14} />{item.build}
            </span>
          </div>
          <h1 className="display-font mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">WARDOGS {item.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{item.description}</p>
          {item.detailImage && item.detailImageAlt ? (
            <figure className="mt-8 border border-[#2c3631] bg-[#151b18] p-2">
              <Image
                alt={item.detailImageAlt}
                className="aspect-video w-full object-contain"
                height={720}
                priority
                src={assetPath(item.detailImage)}
                width={1280}
              />
            </figure>
          ) : null}
        </div>
      </header>

      <article className="site-container max-w-4xl py-10 md:py-14">
        <aside className="mb-10 border-l-4 border-[#4d946d] bg-[#142019] p-6">
          <p className="text-xs font-semibold uppercase text-[#68bd8d]">{ui.quickAnswer}</p>
          <p className="mt-3 text-base leading-7 text-white">{item.summary}</p>
        </aside>

        <AdsterraNativeBanner label={articleT("advertisement")} />

        <EvidencePanel
          dataAsOf={baseItem.build}
          evidence={baseItem.evidence}
          locale={locale}
          sourceUrl={baseItem.evidence.sourceUrl}
        />

        <ItemChangeHistory changes={baseItem.changeHistory} locale={locale} />

        <section className="mt-12" aria-labelledby="facts-title" data-fact-freshness={freshness}>
          <p className="text-xs font-semibold uppercase text-[#d9b455]">{baseItem.evidence.build}</p>
          <h2 className="display-font mt-2 text-3xl text-white" id="facts-title">{factsHeading}</h2>
          <dl className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div className="bg-[#151b18] p-4" key={fact.label}>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{fact.label}</dt>
                <dd className="mt-2 text-base font-semibold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {baseItem.indexable && baseItem.type === "weapons" ? (
          <nav className="mt-10 border-y border-[#2c3631] py-6" aria-label={ui.itemActions}>
            <h2 className="text-sm font-semibold uppercase text-[#9ba9a2]">{ui.itemActions}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-[#4d946d] bg-[#193124] px-4 py-2 font-semibold text-[#d8f4e4] hover:bg-[#244332]"
                href={`/tools/weapon-compare?left=${encodeURIComponent(baseItem.slug)}`}
                title={ui.compare}
              >
                <GitCompareArrows aria-hidden="true" size={17} />{ui.compare}<ArrowRight aria-hidden="true" size={15} />
              </Link>
              {hasObservedAmmunition ? (
                <Link
                  className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-[#46534d] px-4 py-2 font-semibold text-[#d6ded9] hover:border-[#6c8176] hover:text-white"
                  href={`/tools/ammo-matcher?weapon=${encodeURIComponent(baseItem.slug)}`}
                  title={ui.ammoMatcher}
                >
                  <PackageSearch aria-hidden="true" size={17} />{ui.ammoMatcher}<ArrowRight aria-hidden="true" size={15} />
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}

        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label={ui.evidenceTitle}>
          <div>
            <h2 className="display-font text-3xl text-white">{ui.confirmedFacts}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {confirmedFacts.map((fact) => <li className="border-l border-[#4d946d] pl-4" key={fact}>{fact}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">{ui.unknownFacts}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {unconfirmedFacts.map((fact) => <li className="border-l border-[#927328] pl-4" key={fact}>{fact}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="role-title">
          <h2 className="display-font text-3xl text-white" id="role-title">{ui.howToUse}</h2>
          <p className="mt-4 text-base leading-7 text-[#c5d0ca]">{item.role}</p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="display-font text-3xl text-white">{ui.strengths}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {item.strengths.map((strength) => <li className="border-l border-[#4d946d] pl-4" key={strength}>{strength}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">{ui.cautions}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {item.cautions.map((caution) => <li className="border-l border-[#927328] pl-4" key={caution}>{caution}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-14 border-t border-[#2c3631] pt-9" aria-labelledby="sources-title">
          <h2 className="display-font text-3xl text-white" id="sources-title">{ui.sources}</h2>
          <ul className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
            {item.sources.map((source) => (
              <li className="bg-[#151b18] p-4" key={`${source.url}-${source.label}`}>
                <a
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white"
                  data-analytics-destination={source.kind === "official" ? "official_source" : undefined}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  title={source.label}
                >
                  {source.label}<ExternalLink aria-hidden="true" size={15} />
                </a>
                <p className="mt-1 text-xs uppercase text-[#7f8e87]">{source.kind} - {ui.lastChecked} {source.lastChecked}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-6 border-t border-[#2c3631] pt-9 md:grid-cols-2">
          <div>
            <h2 className="display-font text-3xl text-white">{ui.relatedGuides}</h2>
            <ul className="mt-4 space-y-2">
              {item.relatedGuides.map((guideSlug, index) => (
                <li key={guideSlug}>
                  <Link className="inline-flex min-h-11 items-center text-[#7fd0a1] hover:text-white" href={`/guides/${guideSlug}`} title={relatedGuideDocuments[index]?.frontmatter.title ?? guideSlug.replace(/-/g, " ")}>
                    {relatedGuideDocuments[index]?.frontmatter.title ?? guideSlug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">{ui.relatedItems}</h2>
            <ul className="mt-4 space-y-2">
              {relatedItems.map((related) => (
                <li key={related.slug}>
                  <Link className="inline-flex min-h-11 items-center text-[#7fd0a1] hover:text-white" href={`/items/${related.type}/${related.slug}`} title={`WARDOGS ${related.name}`}>
                    WARDOGS {related.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
