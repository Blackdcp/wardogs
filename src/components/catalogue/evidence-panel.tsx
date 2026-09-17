import {CalendarCheck, ExternalLink, ShieldCheck, ShieldQuestion, TriangleAlert} from "lucide-react";
import type {Locale} from "@/config/site";
import {getCatalogueFreshness, isCurrentDecisionSafe} from "@/features/catalogue/catalogue-evidence";
import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";
import {getItemUi} from "@/features/items/item-ui";
import {StatusBadge} from "@/components/ui/status-badge";

type EvidencePanelProps = {
  locale: Locale;
  evidence: CatalogueEvidence;
  dataAsOf: string;
  sourceUrl?: string;
};

const freshnessTone = {
  current: "accent",
  historical: "warning",
  unknown: "muted"
} as const;

const FreshnessIcon = {
  current: ShieldCheck,
  historical: TriangleAlert,
  unknown: ShieldQuestion
};

export function EvidencePanel({locale, evidence, dataAsOf, sourceUrl}: EvidencePanelProps) {
  const ui = getItemUi(locale);
  const record = {dataAsOf, evidence};
  const freshness = getCatalogueFreshness(record);
  const decisionSafe = isCurrentDecisionSafe(record);
  const Icon = FreshnessIcon[freshness];
  const evidenceUrl = sourceUrl ?? evidence.sourceUrl;

  return (
    <section
      aria-labelledby="item-evidence-title"
      className="border-y border-[#35423b] py-7"
      data-decision-safe={decisionSafe}
      data-evidence-state={freshness}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon aria-hidden="true" className="size-5 text-[#d9b455]" />
          <h2 className="display-font text-3xl text-white" id="item-evidence-title">{ui.evidenceTitle}</h2>
        </div>
        <StatusBadge tone={freshnessTone[freshness]}>{ui[freshness]}</StatusBadge>
      </div>

      <p className={`mt-4 text-sm font-semibold leading-6 ${decisionSafe ? "text-[#8addaa]" : "text-[#efd081]"}`}>
        {decisionSafe ? ui.decisionSafe : ui.notCurrentSafe}
      </p>

      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.observedBuild}</dt>
          <dd className="mt-1 text-sm leading-6 text-[#d8dfdb]">{evidence.build}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.verifiedAt}</dt>
          <dd className="mt-1 inline-flex items-center gap-2 text-sm leading-6 text-[#d8dfdb]">
            <CalendarCheck aria-hidden="true" size={15} />{evidence.verifiedAt}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.sourceClass}</dt>
          <dd className="mt-1 text-sm leading-6 text-[#d8dfdb]">{ui.sourceClassLabels[evidence.sourceClass]}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.confidence}</dt>
          <dd className="mt-1 text-sm leading-6 text-[#d8dfdb]">{ui.confidenceLabels[evidence.confidence]}</dd>
        </div>
      </dl>

      {evidenceUrl ? (
        <a
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white"
          href={evidenceUrl}
          rel="noreferrer"
          target="_blank"
          title={ui.evidenceSource}
        >
          {ui.evidenceSource}<ExternalLink aria-hidden="true" size={15} />
        </a>
      ) : null}
    </section>
  );
}
