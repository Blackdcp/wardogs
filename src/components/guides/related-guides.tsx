import {ArrowRight} from "lucide-react";
import type {GuideSummary} from "@/content/guides";
import {Link} from "@/i18n/navigation";

export function RelatedGuides({guides, title}: {guides: GuideSummary[]; title: string}) {
  return (
    <section className="site-container py-14" aria-labelledby="related-title">
      <h2 className="display-font text-3xl text-white" id="related-title">{title}</h2>
      <div className="mt-6 grid gap-px bg-[#2c3631] md:grid-cols-3">
        {guides.map((guide) => (
          <Link className="group min-h-40 bg-[#171d1a] p-5 hover:bg-[#1d2722]" href={`/guides/${guide.slug}`} key={guide.slug}>
            <span className="text-xs uppercase text-[#68bd8d]">{guide.category}</span>
            <span className="display-font mt-3 block text-xl leading-tight text-white">{guide.title}</span>
            <ArrowRight aria-hidden="true" className="mt-5 text-[#68bd8d] transition group-hover:translate-x-1" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}
