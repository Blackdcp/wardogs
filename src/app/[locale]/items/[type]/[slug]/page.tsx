import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";
import {ArrowLeft, CalendarDays, ExternalLink} from "lucide-react";
import {isLocale, type Locale} from "@/config/site";
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
import {getTranslations} from "next-intl/server";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {loadGuideDocument} from "@/content/guides";

type PageProps = {params: Promise<{locale: string; type: string; slug: string}>};

export function generateStaticParams() {
  return getIndexableItemPaths();
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, type, slug} = await params;
  if (!isLocale(locale)) return {};
  const item = getItemByTypeAndSlug(type, slug);
  if (!item) return {};
  return buildItemMetadata(locale, getLocalizedItem(item, locale));
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
  const [adsT, relatedGuideDocuments] = await Promise.all([
    getTranslations({locale, namespace: "ads"}),
    Promise.all(item.relatedGuides.map((guideSlug) => loadGuideDocument(locale, guideSlug)))
  ]);
  const ui = getItemUi(locale);
  const quickFacts = item.detailImage
    ? [
      ...(item.observedPrice ? [{label: ui.observedPrice, value: item.observedPrice}] : []),
      ...(item.observedProgressionOrGate ? [{label: item.type === "weapons" ? ui.observedProgression : ui.observedGate, value: item.observedProgressionOrGate}] : []),
      ...(item.observedAmmoOrVehicleClass ? [{label: item.type === "weapons" ? ui.observedAmmo : ui.observedVehicleClass, value: item.observedAmmoOrVehicleClass}] : [])
    ]
    : item.facts.map(({label, value}) => ({label, value}));
  const observedHeading = item.detailImage ? ui.observedAlpha : ui.observedPreRelease;
  const confirmedFacts = item.confirmedFacts ?? item.facts
    .filter((fact) => fact.value !== "Not confirmed")
    .map((fact) => `${fact.label}: ${fact.value}`);
  const unconfirmedFacts = item.unconfirmedFacts ?? item.facts
    .filter((fact) => fact.value === "Not confirmed")
    .map((fact) => `${fact.label} is not confirmed.`);

  return (
    <main>
      <JsonLd data={buildItemArticleJsonLd(locale, item)} />
      <header className="border-b border-[#2c3631] bg-[#101411] py-12 md:py-16">
        <div className="site-container max-w-4xl">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href={`/items/${item.type}`}>
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

        <AdsterraNativeBanner label={adsT("label")} />
        <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />

        <section aria-labelledby="facts-title">
          <h2 className="display-font text-3xl text-white" id="facts-title">{ui.quickFacts}</h2>
          <dl className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div className="bg-[#151b18] p-4" key={fact.label}>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{fact.label}</dt>
                <dd className="mt-2 text-base font-semibold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Evidence summary">
          <div>
            <h2 className="display-font text-3xl text-white">{observedHeading}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {confirmedFacts.map((fact) => <li className="border-l border-[#4d946d] pl-4" key={fact}>{fact}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">{ui.unconfirmedRelease}</h2>
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
                  <Link className="inline-flex min-h-11 items-center text-[#7fd0a1] hover:text-white" href={`/guides/${guideSlug}`}>
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
                  <Link className="inline-flex min-h-11 items-center text-[#7fd0a1] hover:text-white" href={`/items/${related.type}/${related.slug}`}>
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
