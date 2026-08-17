import Image from "next/image";
import {ArrowUpRight} from "lucide-react";
import type {Locale} from "@/config/site";
import type {CatalogueRecord} from "@/features/catalogue/catalogue-types";
import {assetPath} from "@/lib/assets";

type CatalogueCardProps = {
  locale: Locale;
  record: CatalogueRecord;
  eagerImage?: boolean;
  hidden?: boolean;
};

const cardImageSizes = "(min-width: 1280px) 370px, (min-width: 640px) calc(50vw - 44px), calc(100vw - 32px)";

function CardContent({record, linked, eagerImage}: {record: CatalogueRecord; linked: boolean; eagerImage: boolean}) {
  return (
    <>
      <span className="relative block h-56 shrink-0 overflow-hidden border-b border-[#303b35] bg-[#090c0a] sm:h-64">
        <Image
          alt={record.imageAlt}
          className={`object-contain p-4 ${linked ? "transition-transform duration-300 group-hover:scale-[1.025]" : ""}`}
          fill
          loading={eagerImage ? "eager" : "lazy"}
          sizes={cardImageSizes}
          src={assetPath(record.image)}
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase leading-5 text-[#d9a93a]">{record.subtype}</span>
            <span className={`display-font mt-1 block [overflow-wrap:anywhere] text-2xl leading-tight ${linked ? "text-[#f2f5f3] group-hover:text-[#79d19c]" : "text-[#f2f5f3]"}`}>
              {record.name}
            </span>
          </span>
          {linked ? <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#728078] group-hover:text-[#79d19c]" /> : null}
        </div>
        <span className="mt-3 block text-sm leading-6 text-[#a8b4ae]">{record.summary}</span>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#303b35] pt-4">
          {record.facts.map((fact) => (
            <div className="min-w-0" key={fact.label}>
              <dt className="text-[11px] font-semibold uppercase leading-4 text-[#7f8e87]">{fact.label}</dt>
              <dd className="mt-1 [overflow-wrap:anywhere] text-sm leading-5 text-[#d6ded9]">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto block pt-5 font-mono text-[11px] uppercase leading-4 text-[#82938a]">{record.dataAsOf}</span>
      </div>
    </>
  );
}

export function CatalogueCard({record, eagerImage = false, hidden = false}: CatalogueCardProps) {
  const detailHref = record.detailStatus === "published" && record.detailHref
    ? assetPath(`/en${record.detailHref}`)
    : undefined;
  const className = "flex h-full min-h-[34rem] min-w-0 flex-col border border-[#303b35] bg-[#151b18]";

  return (
    <li
      className="min-w-0 scroll-mt-24"
      data-catalogue-record={record.slug}
      hidden={hidden}
      id={`record-${record.type}-${record.slug}`}
    >
      {detailHref ? (
        <a className={`group ${className}`} href={detailHref}>
          <CardContent eagerImage={eagerImage} linked record={record} />
        </a>
      ) : (
        <div className={className}>
          <CardContent eagerImage={eagerImage} linked={false} record={record} />
        </div>
      )}
    </li>
  );
}
