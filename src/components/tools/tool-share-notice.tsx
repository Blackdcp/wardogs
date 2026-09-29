"use client";

import {inspectToolState, toolDataVersion} from "@/features/tools/workflow-state";
import {getWorkflowCopy} from "@/features/tools/workflow-copy";

export function ToolShareNotice({search, locale, dataVersion = toolDataVersion, invalid = false}: {search: string; locale: string; dataVersion?: string; invalid?: boolean}) {
  const copy = getWorkflowCopy(locale);
  const metadata = inspectToolState(search, dataVersion);
  const message = invalid ? copy.invalid : metadata.status === "legacy" ? copy.legacy : metadata.status === "changed" ? copy.changed : metadata.status === "unsupported" ? copy.unsupported : null;
  return <div className="min-w-0 px-5 py-3 text-xs leading-5 md:px-8">
    {message ? <p className="border-l-2 border-[#d9a93a] pl-3 text-[#e4c35f]" role="status">{message}</p> : null}
    <p className="mt-1 break-all text-[#8fa098]">{copy.snapshot}: {dataVersion}</p>
  </div>;
}
