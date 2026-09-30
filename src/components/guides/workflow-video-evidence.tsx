import {ChevronDown, ExternalLink, Film} from "lucide-react";
import type {Locale} from "@/config/site";
import {getWorkflowVideoEvidence, getWorkflowVideoEvidenceUi, videoSampleTime} from "@/features/guides/workflow-video-evidence";
import {OfficialVideo} from "@/components/mdx/official-video";

export function WorkflowVideoEvidence({slug, locale}: {slug: string; locale: Locale}) {
  const examples = getWorkflowVideoEvidence(slug, locale);
  if (!examples.length) return null;
  const ui = getWorkflowVideoEvidenceUi(locale);

  return (
    <details className="mt-6 min-w-0 border-t border-[#354039] pt-3" data-workflow-video-evidence>
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-[#79d19c] marker:content-none hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79d19c]"><Film className="size-4 shrink-0" aria-hidden="true" />{ui.heading}<ChevronDown className="ml-auto size-4 shrink-0" aria-hidden="true" /></summary>
      {examples.map((example) => (
        <article className="mt-5 min-w-0" key={example.id} data-workflow-source={example.id}>
          <h4 className="text-base font-semibold leading-6 text-white">{example.title}</h4>
          <p className="mt-1 text-xs leading-5 text-[#a8b4ae]">
            {example.author} · {ui.published} <time dateTime={example.publishedAt}>{example.publishedAt}</time> · {ui.reviewed} <time dateTime={example.reviewedAt}>{example.reviewedAt}</time>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {example.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          <div className="mt-2 text-xs leading-5 text-[#a8b4ae]" data-workflow-observed-seconds>
            <span>{example.observedSeconds.length ? ui.visual : ui.narration}: </span>
            {example.observedSeconds.map((seconds) => (
              <a className="mr-3 inline-flex min-h-11 items-center gap-1 text-[#79d19c] underline underline-offset-4 hover:text-white" href={`https://www.youtube.com/watch?v=${example.id}&t=${seconds}s`} key={seconds} target="_blank" rel="noopener noreferrer" title={`${example.author}: ${videoSampleTime(seconds)}`}>
                {videoSampleTime(seconds)}<ExternalLink className="size-3 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-1 text-xs leading-5 text-[#e6bd5d]" data-workflow-capture-limit>{ui.limit}</p>
          <OfficialVideo id={example.id} title={`${example.author}: ${example.title}`} startSeconds={example.startSeconds} endSeconds={example.endSeconds} className="mt-3 mb-6" />
        </article>
      ))}
    </details>
  );
}
