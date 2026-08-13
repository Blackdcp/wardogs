import {ArrowRight} from "lucide-react";
import type {GuideSummary} from "@/content/guides";
import {Link} from "@/i18n/navigation";
import {StatusBadge} from "@/components/ui/status-badge";

type GuideCardProps = {
  guide: GuideSummary;
  categoryLabel: string;
  readLabel: string;
};

export function GuideCard({guide, categoryLabel, readLabel}: GuideCardProps) {
  return (
    <article className="group flex min-h-[270px] flex-col border border-[#2c3631] bg-[#171d1a] p-6 transition hover:border-[#4d946d] hover:bg-[#1b231f]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <StatusBadge tone={guide.badges[0]?.tone ?? "muted"}>{categoryLabel}</StatusBadge>
        <span className="font-mono text-xs text-[#7f8e87]">{String(guide.order).padStart(2, "0")}</span>
      </div>
      <h2 className="display-font text-2xl leading-tight text-white">{guide.title}</h2>
      <p className="mt-4 flex-1 text-sm leading-6 text-[#a8b4ae]">{guide.description}</p>
      <Link
        href={`/guides/${guide.slug}`}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#68bd8d] group-hover:text-[#8bd5aa]"
      >
        {readLabel}<ArrowRight aria-hidden="true" size={17} />
      </Link>
    </article>
  );
}
