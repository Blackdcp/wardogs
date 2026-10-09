import {ArrowRight} from "lucide-react";
import type {Locale} from "@/config/site";
import type {GuideSummary} from "@/content/guides";
import {buildRelatedGuideHref} from "@/features/guides/related";
import {SeasonTaskPath} from "@/components/releases/season-task-path";

export function RelatedGuides({guides, locale, title, path}: {guides: GuideSummary[]; locale: Locale; title: string; path?: string}) {
  return (
    <section className="site-container py-14" aria-labelledby="related-title">
      {path && <SeasonTaskPath locale={locale} path={path} />}
      <h2 className="display-font text-3xl text-white" id="related-title">{title}</h2>
      <div className="mt-6 grid gap-px bg-[#2c3631] md:grid-cols-3">
        {guides.map((guide) => (
          <a className="group min-h-40 bg-[#171d1a] p-5 hover:bg-[#1d2722]" href={buildRelatedGuideHref(locale, guide.slug)} key={guide.slug} title={guide.title}>
            <span className="text-xs uppercase text-[#68bd8d]">{guide.category}</span>
            <span className="display-font mt-3 block text-xl leading-tight text-white">{guide.title}</span>
            <ArrowRight aria-hidden="true" className="mt-5 text-[#68bd8d] transition group-hover:translate-x-1" size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}
