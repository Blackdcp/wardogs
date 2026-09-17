"use client";

import Image from "next/image";
import {useState} from "react";
import {ArrowUpRight, BookOpen, CalendarCheck2, ImageOff, MapPinned} from "lucide-react";
import type {Locale} from "@/config/site";
import {formatCatalogueVerifiedAt, localizeCatalogueBuild, localizeCatalogueFact} from "@/features/catalogue/catalogue-localization";
import {getCatalogueSourceClassLabel, getItemUi} from "@/features/items/item-ui";
import {
  filterOperationsAtlas,
  getLocalizedOperationsAtlasRecords,
  operationsAtlasTaskOrder,
  type OperationsAtlasCopy,
  type OperationsAtlasFilter,
} from "@/features/maps/operations-atlas";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";

type OperationsAtlasProps = {
  copy: OperationsAtlasCopy;
  guideTitles: Record<string, string>;
  locale: Locale;
  toolLabels: Record<string, string>;
};

const visualSizes = "(min-width: 1024px) 320px, (min-width: 640px) 38vw, calc(100vw - 32px)";

function visualLabel(copy: OperationsAtlasCopy, state: "verified" | "contextual" | "pending") {
  if (state === "verified") return copy.visualVerified;
  if (state === "contextual") return copy.visualContextual;
  return copy.visualPending;
}

export function OperationsAtlas({copy, guideTitles, locale, toolLabels}: OperationsAtlasProps) {
  const [filter, setFilter] = useState<OperationsAtlasFilter>("all");
  const visibleRecords = filterOperationsAtlas(getLocalizedOperationsAtlasRecords(locale), filter);
  const itemUi = getItemUi(locale);

  return (
    <section aria-labelledby="operations-atlas-heading" className="border-y border-[#303b35] bg-[#101512]">
      <div className="site-container py-8 md:py-12">
        <div className="flex flex-col gap-5 border-b border-[#303b35] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#69c78f]">
              <MapPinned aria-hidden="true" className="size-4" />
              {copy.eyebrow}
            </p>
            <h1 className="display-font mt-3 text-4xl leading-tight text-white sm:text-5xl" id="operations-atlas-heading">
              {copy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.description}</p>
          </div>
          <p aria-live="polite" className="font-mono text-xs uppercase text-[#d9a93a]">
            {visibleRecords.length} {copy.showing}
          </p>
        </div>

        <div className="py-6">
          <p className="mb-3 text-xs font-semibold uppercase text-[#8f9d96]">{copy.filtersLabel}</p>
          <div aria-label={copy.filtersLabel} className="flex flex-wrap gap-2" role="group">
            {operationsAtlasTaskOrder.map((task) => (
              <button
                aria-pressed={filter === task}
                className="min-h-11 border border-[#3a4840] px-4 py-2 text-sm font-semibold text-[#c7d1cc] transition-colors hover:border-[#69c78f] hover:text-white aria-pressed:border-[#69c78f] aria-pressed:bg-[#173523] aria-pressed:text-[#dff6e8]"
                key={task}
                onClick={() => setFilter(task)}
                type="button"
              >
                {copy.filters[task]}
              </button>
            ))}
          </div>
        </div>

        <ol className="border-t border-[#303b35]">
          {visibleRecords.map((record) => {
            const entry = copy.entries[record.id];
            const sourceUrl = record.evidence.sourceUrl;
            const localizedFacts = record.facts.map((fact) => localizeCatalogueFact(fact, locale));
            return (
              <li className="grid gap-6 border-b border-[#303b35] py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10" data-atlas-entry={record.id} key={record.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-xs uppercase text-[#d9a93a]">{record.tasks.map((task) => copy.filters[task]).join(" / ")}</span>
                    <span className="text-xs text-[#849189]">{visualLabel(copy, record.visual.state)}</span>
                  </div>
                  <h2 className="display-font mt-3 text-3xl leading-tight text-white">{entry.title}</h2>
                  <section className="mt-5 border-l-2 border-[#4d695a] pl-4" data-atlas-editorial-workflow>
                    <h3 className="text-xs font-semibold uppercase text-[#d9a93a]">{copy.workflowLabel}</h3>
                    <p className="mt-2 max-w-3xl text-xs leading-5 text-[#849189]">{copy.workflowNote}</p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase text-[#849189]">{copy.objectiveLabel}</dt>
                        <dd className="mt-1 text-sm leading-6 text-[#e1e7e3]">{entry.objective}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase text-[#849189]">{copy.contextLabel}</dt>
                        <dd className="mt-1 text-sm leading-6 text-[#e1e7e3]">{entry.context}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#aeb9b3]">{entry.summary}</p>
                  </section>

                  <section className="mt-6 border-y border-[#28322d] py-4" data-atlas-sourced-facts>
                    <h3 className="text-xs font-semibold uppercase text-[#d9a93a]">{copy.sourcedFactsLabel}</h3>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#d9e1dc] sm:grid-cols-2">
                      {localizedFacts.map((fact) => (
                        <li className="border-l border-[#4d695a] pl-3" key={`${fact.label}:${fact.value}`}>
                          <span className="block text-[11px] uppercase text-[#7f8d86]">{fact.label}</span>
                          <span className="mt-0.5 block">{fact.value}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-[#28322d] pt-4 text-xs sm:grid-cols-3">
                      <div>
                        <dt className="uppercase text-[#7f8d86]">{copy.evidenceLabel}</dt>
                        <dd className="mt-1 text-[#d9e1dc]">{getCatalogueSourceClassLabel(locale, record.evidence.sourceClass)} · {itemUi.confidenceLabels[record.evidence.confidence]}</dd>
                      </div>
                      <div>
                        <dt className="inline-flex items-center gap-1 uppercase text-[#7f8d86]"><CalendarCheck2 aria-hidden="true" className="size-3.5" />{copy.checkedLabel}</dt>
                        <dd className="mt-1 text-[#d9e1dc]">{formatCatalogueVerifiedAt(record.evidence.verifiedAt, locale)}</dd>
                      </div>
                      <div>
                        <dt className="uppercase text-[#7f8d86]">{copy.buildLabel}</dt>
                        <dd className="mt-1 text-[#d9e1dc]">{localizeCatalogueBuild(record.evidence.build, locale)}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 border-t border-[#28322d] pt-4">
                      <p className="text-[11px] font-semibold uppercase text-[#7f8d86]">{copy.sourceScopeLabel}</p>
                      <ul className="mt-2 space-y-1 text-xs leading-5 text-[#aeb9b3]">
                        {record.sourceNotes.map((note) => <li key={note}>{note}</li>)}
                      </ul>
                      {sourceUrl ? (
                        <a className="mt-3 inline-flex min-h-11 items-center gap-2 border border-[#405047] px-4 py-2 text-sm font-semibold text-[#d4ded8] hover:border-[#69c78f] hover:text-white" href={sourceUrl} rel="noreferrer" target="_blank" title={`${copy.sourceLabel}: ${record.sourceLabel}`}>
                          {copy.sourceLabel}: {record.sourceLabel}
                          <ArrowUpRight aria-hidden="true" className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </section>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link className="inline-flex min-h-11 items-center gap-2 bg-[#2f7d50] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a9360]" href={`/guides/${record.guideSlug}`} title={`${copy.openGuide}: ${entry.title}`}>
                      <BookOpen aria-hidden="true" className="size-4" />
                      {copy.openGuide}
                    </Link>
                  </div>

                  {(record.relatedGuideSlugs.length > 0 || record.relatedToolHrefs.length > 0) ? (
                    <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
                      {record.relatedGuideSlugs.length > 0 ? (
                        <p className="leading-6 text-[#8f9d96]">
                          <span className="mr-2 font-semibold text-[#c8d2cc]">{copy.relatedGuides}:</span>
                          {record.relatedGuideSlugs.map((slug, index) => (
                            <span key={slug}>{index > 0 ? " · " : ""}<Link className="text-[#79d19c] hover:text-white" href={`/guides/${slug}`} title={guideTitles[slug] ?? slug}>{guideTitles[slug] ?? slug}</Link></span>
                          ))}
                        </p>
                      ) : null}
                      {record.relatedToolHrefs.length > 0 ? (
                        <p className="leading-6 text-[#8f9d96]">
                          <span className="mr-2 font-semibold text-[#c8d2cc]">{copy.relatedTools}:</span>
                          {record.relatedToolHrefs.map((href, index) => (
                            <span key={href}>{index > 0 ? " · " : ""}<Link className="text-[#79d19c] hover:text-white" href={href} title={toolLabels[href] ?? href}>{toolLabels[href] ?? href}</Link></span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 lg:pt-1">
                  {record.visual.state === "pending" || !record.visual.image ? (
                    <div className="flex aspect-[4/3] min-h-56 flex-col items-center justify-center border border-dashed border-[#465249] bg-[#0a0e0c] px-6 text-center" data-atlas-visual="pending">
                      <ImageOff aria-hidden="true" className="size-8 text-[#819087]" strokeWidth={1.5} />
                      <p className="mt-4 text-sm font-semibold text-[#d6ded9]">{copy.visualPending}</p>
                      <p className="mt-2 text-xs leading-5 text-[#849189]">{copy.visualPendingDescription}</p>
                    </div>
                  ) : (
                    <figure data-atlas-visual={record.visual.state}>
                      <div className="relative aspect-[4/3] overflow-hidden border border-[#303b35] bg-[#090c0a]">
                        <Image alt={entry.imageAlt ?? entry.title} className="object-cover" fill sizes={visualSizes} src={assetPath(record.visual.image)} />
                      </div>
                      <figcaption className="mt-2 text-xs leading-5 text-[#849189]">{visualLabel(copy, record.visual.state)}</figcaption>
                      <dl className="mt-3 space-y-3 border-t border-[#28322d] pt-3 text-xs leading-5" data-atlas-visual-provenance>
                        <div>
                          <dt className="font-semibold uppercase text-[#7f8d86]">{copy.visualSourceLabel}</dt>
                          <dd className="mt-1">
                            <a className="text-[#79d19c] hover:text-white" href={record.visual.sourceUrl} rel="noreferrer" target="_blank" title={`${copy.visualSourceLabel}: ${record.visual.sourceLabel}`}>
                              {record.visual.sourceLabel}<ArrowUpRight aria-hidden="true" className="ml-1 inline size-3.5" />
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase text-[#7f8d86]">{copy.visualRetrievedLabel}</dt>
                          <dd className="mt-1 text-[#aeb9b3]">{formatCatalogueVerifiedAt(record.visual.retrievedAt, locale)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase text-[#7f8d86]">{copy.visualUsageLabel}</dt>
                          <dd className="mt-1 text-[#aeb9b3]">{record.visual.usageNote}</dd>
                        </div>
                      </dl>
                    </figure>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
