"use client";

import {useState} from "react";
import type {Locale} from "@/config/site";
import {getDiagnosticRecordCopy, type DiagnosticRecordKind} from "@/features/guides/diagnostic-record-copy";

export function DiagnosticRecord({locale, kind}: {locale: Locale; kind: DiagnosticRecordKind}) {
  const t = getDiagnosticRecordCopy(locale, kind);
  const [status, setStatus] = useState("");
  return <details data-diagnostic-record={kind} className="not-prose my-5 min-w-0 rounded border border-[#354039] bg-[#111b15] p-4">
    <summary className="min-h-11 cursor-pointer font-semibold text-[#d8e9dd]">{t.title}</summary>
    <pre className="my-3 whitespace-pre-wrap break-words text-xs leading-6 text-[#b7c8bd]">{t.text}</pre>
    <button className="min-h-11 rounded border border-[#497a5c] px-4 py-2 text-sm font-semibold text-[#b6e2c5] hover:bg-[#203629]" type="button" onClick={async () => {
      try {await navigator.clipboard.writeText(t.text); setStatus(t.copied);} catch {setStatus(t.failed);}
    }}>{t.copy}</button>
    <p role="status" className="mt-2 text-sm text-[#b7c8bd]">{status}</p>
  </details>;
}
