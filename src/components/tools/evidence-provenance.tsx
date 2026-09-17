import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";
import {
  getConfidenceLabel,
  getSourceClassLabel,
  type ToolCopy,
} from "@/features/tools/tool-copy";
import {formatCatalogueVerifiedAt, localizeCatalogueBuild} from "@/features/catalogue/catalogue-localization";

type EvidenceProvenanceProps = {
  build: string | null;
  verifiedAt: string | null;
  sourceClass: CatalogueEvidence["sourceClass"] | null;
  confidence: CatalogueEvidence["confidence"] | null;
  copy: ToolCopy;
};

export function EvidenceProvenance({
  build,
  verifiedAt,
  sourceClass,
  confidence,
  copy,
}: EvidenceProvenanceProps) {
  if (!build && !verifiedAt && !sourceClass && !confidence) return null;

  return (
    <div className="mt-2 min-w-0 space-y-0.5 break-words text-xs leading-5 text-[#819087]">
      {build ? <p>{copy.build}: {localizeCatalogueBuild(build, copy.locale)}</p> : null}
      {verifiedAt ? <p>{copy.verified}: {formatCatalogueVerifiedAt(verifiedAt, copy.locale)}</p> : null}
      {sourceClass ? <p>{copy.sourceClass}: {getSourceClassLabel(sourceClass, copy)}</p> : null}
      {confidence ? <p>{copy.confidence}: {getConfidenceLabel(confidence, copy)}</p> : null}
    </div>
  );
}
