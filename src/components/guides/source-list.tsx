import {ExternalLink} from "lucide-react";
import type {GuideFrontmatter} from "@/content/schema";

export function SourceList({sources, title, checkedLabel}: {sources: GuideFrontmatter["sources"]; title: string; checkedLabel: string}) {
  return (
    <section className="mt-14 border-t border-[#2c3631] pt-9" aria-labelledby="source-title">
      <h2 className="display-font text-3xl text-white" id="source-title">{title}</h2>
      <ul className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
        {sources.map((source) => (
          <li className="bg-[#151b18] p-4" key={`${source.url}-${source.label}`}>
            <a className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white" href={source.url} target="_blank" rel="noreferrer">
              {source.label}<ExternalLink aria-hidden="true" size={15} />
            </a>
            <p className="mt-1 text-xs uppercase text-[#7f8e87]">{source.kind} · {checkedLabel} {source.checkedAt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
