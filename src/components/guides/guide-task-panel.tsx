import {AlertTriangle, ArrowRight, ListChecks, Wrench} from "lucide-react";
import type {Locale} from "@/config/site";
import type {GuideTaskData} from "@/features/guides/guide-task-data";
import {getGuideTaskUi} from "@/features/guides/guide-task-data";
import {ContextualVideoEvidence} from "./contextual-video-evidence";
import {GuideTaskChecklist} from "./guide-task-checklist";

export function GuideTaskPanel({data, locale}: {data: GuideTaskData; locale: Locale}) {
  const ui = getGuideTaskUi(locale);
  const titleId = `guide-task-${data.slug}-title`;

  return (
    <section className="mb-10 border-y border-[#354039] py-8 md:py-10" data-guide-task-panel={data.slug} aria-labelledby={titleId}>
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#68bd8d]">
        <ListChecks aria-hidden="true" className="size-4" />
        {data.eyebrow}
      </p>
      <h2 className="display-font mt-3 text-3xl leading-tight text-white md:text-4xl" data-guide-task-heading="true" id={titleId}>{data.title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#d7ded9]" data-guide-task-answer="true" style={{overflowWrap: "anywhere"}}>{data.directAnswer}</p>

      <GuideTaskChecklist checklistTitle={ui.checklistTitle} progressTemplate={ui.progressTemplate} steps={data.steps} />

      {data.caution ? (
        <aside className="mt-6 border-l-4 border-[#d9a93a] bg-[#1b1a13] px-4 py-3" data-guide-task-caution="true">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#e6bd5d]"><AlertTriangle aria-hidden="true" className="size-4" />{ui.cautionLabel}</p>
          <p className="mt-2 text-sm leading-6 text-[#d7ded9]">{data.caution}</p>
        </aside>
      ) : null}

      {data.relatedTool ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#2c3631] pt-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#8b9992]"><Wrench aria-hidden="true" className="size-4" />{ui.relatedToolLabel}</span>
          <a className="inline-flex min-h-11 items-center gap-2 border border-[#4d946d] px-4 py-2 text-sm font-semibold text-[#79d19c] hover:bg-[#193122] hover:text-white" href={`/${locale}${data.relatedTool.href}`} title={data.relatedTool.label}>{data.relatedTool.label}<ArrowRight aria-hidden="true" className="size-4" /></a>
        </div>
      ) : null}

      <ContextualVideoEvidence locale={locale} sources={data.videos} />
    </section>
  );
}
