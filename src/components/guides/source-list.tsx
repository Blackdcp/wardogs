import {ExternalLink} from "lucide-react";
import {useTranslations} from "next-intl";
import type {GuideFrontmatter} from "@/content/schema";

export function SourceList({sources, title, checkedLabel}: {sources: GuideFrontmatter["sources"]; title: string; checkedLabel: string}) {
  const t = useTranslations("article");

  return (
    <section className="mt-14 border-t border-[#2c3631] pt-9" aria-labelledby="source-title">
      <h2 className="display-font text-3xl text-white" id="source-title">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#8b9992]">{t("sourceDateNote")}</p>
      <ul className="mt-5 grid gap-px bg-[#2c3631] sm:grid-cols-2">
        {sources.map((source) => (
          <li className="bg-[#151b18] p-4" key={`${source.url}-${source.label}`}>
            <a
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white"
              data-analytics-destination={source.kind === "official" ? "official_source" : undefined}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              title={source.label}
            >
              {source.label}<ExternalLink aria-hidden="true" size={15} />
            </a>
            <p className="mt-1 text-xs uppercase text-[#7f8e87]">{source.kind} · {checkedLabel} <time dateTime={source.checkedAt}>{source.checkedAt}</time></p>
          </li>
        ))}
      </ul>
    </section>
  );
}
