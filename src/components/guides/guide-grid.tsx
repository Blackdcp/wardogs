import type {GuideCategory} from "@/content/manifest";
import type {GuideSummary} from "@/content/guides";
import {GuideCard} from "./guide-card";

type GuideGridProps = {
  guides: GuideSummary[];
  readLabel: string;
  categoryLabels: Record<GuideCategory, string>;
};

export function GuideGrid({guides, readLabel, categoryLabels}: GuideGridProps) {
  return (
    <div className="grid grid-cols-1 border-l border-t border-[#2c3631] md:grid-cols-2 xl:grid-cols-3">
      {guides.map((guide) => (
        <div className="border-b border-r border-[#2c3631]" key={guide.slug}>
          <GuideCard guide={guide} readLabel={readLabel} categoryLabel={categoryLabels[guide.category]} />
        </div>
      ))}
    </div>
  );
}
