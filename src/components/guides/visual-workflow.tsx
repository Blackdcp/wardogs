import Image from "next/image";
import {AlertTriangle, ArrowDown, CheckCircle2, ChevronDown, CornerDownRight, ExternalLink, Eye, ListOrdered} from "lucide-react";
import type {Locale} from "@/config/site";
import {getVisualWorkflow, getVisualWorkflowUi} from "@/features/guides/visual-workflows";
import {assetPath} from "@/lib/assets";
import {WorkflowVideoEvidence} from "./workflow-video-evidence";

export function VisualWorkflow({slug, locale}: {slug: string; locale: Locale}) {
  const workflow = getVisualWorkflow(slug, locale);
  if (!workflow) return null;
  const ui = getVisualWorkflowUi(locale);
  const titleId = `visual-workflow-${slug}-title`;
  const missingId = `visual-workflow-${slug}-missing`;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={missingId}
      className="not-prose mb-10 min-w-0 border-y border-[#354039] py-6 text-[#d7ded9] [overflow-wrap:anywhere]"
      data-visual-workflow={slug}
      data-operation-frames={workflow.operationFrames}
      lang={locale}
    >
      <div className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#79d19c]">
            <ListOrdered aria-hidden="true" className="size-4 shrink-0" />{ui.eyebrow}
          </p>
          <h2 className="display-font mt-2 text-2xl leading-snug text-white" id={titleId}>{workflow.title}</h2>
          <p className="mt-3 text-sm leading-6">{workflow.summary}</p>
          <p className="mt-3 text-xs leading-5 text-[#a8b4ae]" data-workflow-editorial>{ui.editorial}</p>
        </div>
        <figure className="min-w-0 max-w-[220px]" data-workflow-image-role={workflow.image.role}>
          <Image
            alt={workflow.imageAlt}
            className="h-auto max-h-36 w-full object-contain"
            decoding="async"
            height={workflow.image.height}
            loading="lazy"
            sizes="220px"
            src={assetPath(workflow.image.src)}
            unoptimized
            width={workflow.image.width}
          />
          <figcaption className="mt-2 text-xs leading-5 text-[#a8b4ae]">
            <strong className="block font-semibold text-[#d7ded9]">{ui.context}</strong>
            {workflow.imageCaption}
          </figcaption>
        </figure>
      </div>

      <ol className="mt-5 min-w-0" data-workflow-steps>
        {workflow.steps.map((step, index) => (
          <li className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-[#2c3631] py-4" data-workflow-step={step.id} key={step.id}>
            <div aria-hidden="true" className="flex flex-col items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center border border-[#4d6657] text-sm font-semibold tabular-nums text-white">{index + 1}</span>
              {index < workflow.steps.length - 1 ? <ArrowDown className="size-4 text-[#8b9992]" /> : null}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-6 text-white">{step.action}</h3>
              <dl className="mt-3 grid min-w-0 gap-3 lg:grid-cols-3 lg:gap-4">
                <div className="min-w-0" data-workflow-observe>
                  <dt className="flex items-start gap-2 text-xs font-semibold text-[#a8b4ae]"><Eye aria-hidden="true" className="size-4 shrink-0" />{ui.observe}</dt>
                  <dd className="mt-1 text-sm leading-6">{step.observe}</dd>
                </div>
                <div className="min-w-0 lg:border-l lg:border-[#2c3631] lg:pl-4" data-workflow-success>
                  <dt className="flex items-start gap-2 text-xs font-semibold text-[#79d19c]"><CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />{ui.success}</dt>
                  <dd className="mt-1 text-sm leading-6">{step.success}</dd>
                </div>
                <div className="min-w-0 lg:border-l lg:border-[#2c3631] lg:pl-4" data-workflow-failure>
                  <dt className="flex items-start gap-2 text-xs font-semibold text-[#e6bd5d]"><CornerDownRight aria-hidden="true" className="size-4 shrink-0" />{ui.failure}</dt>
                  <dd className="mt-1 text-sm leading-6">{step.failure}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>

      <aside className="flex min-w-0 items-start gap-3 border-t border-[#2c3631] pt-4 text-sm leading-6" data-workflow-missing-frames id={missingId}>
        <AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#e6bd5d]" />
        <p className="min-w-0"><strong className="font-semibold text-[#e6bd5d]">{ui.missing}: </strong>{workflow.missingFrames}</p>
      </aside>

      <WorkflowVideoEvidence slug={slug} locale={locale} />

      <details className="mt-4 min-w-0 border-t border-[#2c3631] pt-3" data-workflow-evidence>
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-[#a8b4ae] marker:content-none hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79d19c]">
          <ChevronDown aria-hidden="true" className="size-4 shrink-0" />{ui.sources}
        </summary>
        <ul className="mt-2 space-y-3 text-xs leading-5">
          {workflow.evidence.map((source) => (
            <li className="min-w-0" key={source.url}>
              <a className="inline-flex min-h-11 items-center gap-2 text-[#79d19c] underline underline-offset-4 hover:text-white" href={source.url} rel="noreferrer" target="_blank" title={`${ui.sources}: ${source.label}`}>
                {source.label}<ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              </a>
              <p>{source.scope === "original-sample" ? ui.originalSample : source.scope === "original-candidate" ? ui.originalCandidate : ui.officialContext}. {ui.buildUnknown}.</p>
            </li>
          ))}
          <li className="min-w-0 border-t border-[#2c3631] pt-3">
            <p className="font-semibold">{ui.imageSource}: {workflow.image.credit}</p>
            <p>{workflow.image.sourceLocator}. {ui.buildUnknown}.</p>
            {workflow.image.sourceUrl ? (
              <a className="inline-flex min-h-11 items-center gap-2 text-[#79d19c] underline underline-offset-4 hover:text-white" href={workflow.image.sourceUrl} rel="noreferrer" target="_blank" title={`${ui.imageSource}: ${workflow.image.credit}`}>
                {ui.imageSource}<ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              </a>
            ) : null}
          </li>
        </ul>
      </details>
    </section>
  );
}
