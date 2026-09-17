"use client";

import {useMemo, useState} from "react";

type GuideTaskChecklistProps = {
  checklistTitle: string;
  progressTemplate: string;
  steps: readonly string[];
};

export function GuideTaskChecklist({checklistTitle, progressTemplate, steps}: GuideTaskChecklistProps) {
  const [completed, setCompleted] = useState<ReadonlySet<number>>(() => new Set());
  const progress = useMemo(
    () => progressTemplate.replace("{done}", String(completed.size)).replace("{total}", String(steps.length)),
    [completed.size, progressTemplate, steps.length]
  );

  function toggleStep(index: number) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="mt-8" data-guide-task-checklist="true">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-[#354039] pb-3">
        <h3 className="text-sm font-semibold text-white">{checklistTitle}</h3>
        <p aria-live="polite" className="text-xs font-semibold text-[#79d19c]">{progress}</p>
      </div>
      <progress aria-label={progress} className="mt-3 h-1.5 w-full accent-[#68bd8d]" max={steps.length} value={completed.size} />
      <ol className="mt-4 divide-y divide-[#2c3631] border-y border-[#2c3631]">
        {steps.map((step, index) => {
          const inputId = `guide-task-${index + 1}`;
          return (
            <li className="min-h-20 py-3" key={`${index}-${step}`}>
              <label className="grid min-h-14 cursor-pointer grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 text-sm leading-6 text-[#d7ded9]" htmlFor={inputId}>
                <input
                  aria-label={`${index + 1}. ${step}`}
                  checked={completed.has(index)}
                  className="mt-1 size-5 accent-[#68bd8d]"
                  id={inputId}
                  onChange={() => toggleStep(index)}
                  type="checkbox"
                />
                <span className="min-w-0" style={{overflowWrap: "anywhere"}}>
                  <span aria-hidden="true" className="mr-2 font-semibold text-[#d9a93a]">{index + 1}.</span>
                  {step}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
