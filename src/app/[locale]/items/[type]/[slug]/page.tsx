import type {Metadata} from "next";
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
import {Link} from "@/i18n/navigation";
import {buildPageMetadata} from "@/lib/metadata";
import {buildItemArticleJsonLd} from "@/lib/item-structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {StatusBadge} from "@/components/ui/status-badge";

type PageProps = {params: Promise<{locale: string; type: string; slug: string}>};

export function generateStaticParams() {
  return getIndexableItemPaths();
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, type, slug} = await params;
  if (!isLocale(locale)) return {};
  const item = getItemByTypeAndSlug(type, slug);
  if (!item || !item.indexLocales.includes(locale as Extract<Locale, "en" | "ru">)) return {};
  return buildPageMetadata(
    locale,
    `/items/${item.type}/${item.slug}`,
    `WARDOGS ${item.name} - Item Guide & Evidence`,
    `${item.summary} Includes source notes, evidence labels, role advice, strengths, counters, and pre-release caveats.`
  );
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
  const item = getItemByTypeAndSlug(type, slug);
  if (!item || !item.indexLocales.includes(locale as Extract<Locale, "en" | "ru">)) notFound();
  const itemType = getItemType(item.type);
  const relatedItems = getRelatedItems(item);

  return (
    <main>
      <JsonLd data={buildItemArticleJsonLd(locale, item)} />
      <header className="border-b border-[#2c3631] bg-[#101411] py-12 md:py-16">
        <div className="site-container max-w-4xl">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href={`/items/${item.type}`}>
            <ArrowLeft aria-hidden="true" size={16} />WARDOGS {itemType?.label ?? "Items"}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge tone={statusTone(item)}>{item.statusLabel}</StatusBadge>
            <span className="inline-flex items-center gap-2 text-xs text-[#8b9992]">
              <CalendarDays aria-hidden="true" size={14} />{item.build}
            </span>
          </div>
          <h1 className="display-font mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">WARDOGS {item.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c3bd]">{item.description}</p>
        </div>
      </header>

      <article className="site-container max-w-4xl py-10 md:py-14">
        <aside className="mb-10 border-l-4 border-[#4d946d] bg-[#142019] p-6">
          <p className="text-xs font-semibold uppercase text-[#68bd8d]">Quick answer</p>
          <p className="mt-3 text-base leading-7 text-white">{item.summary}</p>
        </aside>

        <section aria-labelledby="facts-title">
          <h2 className="display-font text-3xl text-white" id="facts-title">Item Facts</h2>
          <dl className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
            {item.facts.map((fact) => (
              <div className="bg-[#151b18] p-4" key={fact.label}>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{fact.label}</dt>
                <dd className="mt-2 text-base font-semibold text-white">{fact.value}</dd>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {fact.evidence.map((evidence) => (
                    <span className="rounded-[4px] border border-[#46534d] bg-[#202823] px-2 py-1 text-xs uppercase text-[#c8d2cd]" key={evidence}>
                      {evidence}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="role-title">
          <h2 className="display-font text-3xl text-white" id="role-title">How to Use It</h2>
          <p className="mt-4 text-base leading-7 text-[#c5d0ca]">{item.role}</p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="display-font text-3xl text-white">Strengths</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {item.strengths.map((strength) => <li className="border-l border-[#4d946d] pl-4" key={strength}>{strength}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">Cautions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c5d0ca]">
              {item.cautions.map((caution) => <li className="border-l border-[#927328] pl-4" key={caution}>{caution}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-14 border-t border-[#2c3631] pt-9" aria-labelledby="sources-title">
          <h2 className="display-font text-3xl text-white" id="sources-title">Sources</h2>
          <ul className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
            {item.sources.map((source) => (
              <li className="bg-[#151b18] p-4" key={`${source.url}-${source.label}`}>
                <a className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white" href={source.url} target="_blank" rel="noreferrer">
                  {source.label}<ExternalLink aria-hidden="true" size={15} />
                </a>
                <p className="mt-1 text-xs uppercase text-[#7f8e87]">{source.kind} - Last checked {source.lastChecked}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-6 border-t border-[#2c3631] pt-9 md:grid-cols-2">
          <div>
            <h2 className="display-font text-3xl text-white">Related Guides</h2>
            <ul className="mt-4 space-y-2">
              {item.relatedGuides.map((guideSlug) => (
                <li key={guideSlug}>
                  <Link className="inline-flex min-h-11 items-center text-[#7fd0a1] hover:text-white" href={`/guides/${guideSlug}`}>
                    {guideSlug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display-font text-3xl text-white">Related Items</h2>
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
