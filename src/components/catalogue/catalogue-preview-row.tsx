import {SectionHeading} from "@/components/ui/section-heading";
import Image from "next/image";
import {ArrowRight} from "lucide-react";
import type {Locale} from "@/config/site";
import {StatusBadge} from "@/components/ui/status-badge";
import type {PublishedPreviewRecord} from "@/features/catalogue/catalogue-hub-data";
import {getItemUi} from "@/features/items/item-ui";
import {itemTypes} from "@/features/items/item-library";
import {getLocalizedItemType} from "@/features/items/item-localization";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";
import {publicRoutePath} from "@/lib/public-url";
const previewSizes = "(min-width: 1280px) 386px, (min-width: 640px) calc(33vw - 36px), calc(100vw - 32px)";
export function CataloguePreviewRow({locale, type, title, description, records}: {locale: Locale; type: "weapons" | "vehicles"; title: string; description: string; records: readonly PublishedPreviewRecord[]}) {
  const ui = getItemUi(locale);
  const headingId = `featured-${type}`;

  return (
    <section data-catalogue-preview-row aria-labelledby={headingId} className="border-t border-[#354039] py-9 first:border-t-0 md:py-11">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow={ui.modelPreview} id={headingId} title={title} description={description} />
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-white" href={`/items/${type}`} data-discovery-hub="catalogue" data-discovery-task={type} data-discovery-target={`/items/${type}`} title={`${ui.viewAll}: ${getLocalizedItemType(itemTypes.find((itemType) => itemType.id === type)!, locale).label}`}>
          {ui.viewAll}: {getLocalizedItemType(itemTypes.find((itemType) => itemType.id === type)!, locale).label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-3">
        {records.map((record) => (
          <li data-catalogue-preview key={record.slug} className="min-w-0 border-t border-[#354039] pt-4">
            <a
              className="group block h-full"
              href={publicRoutePath(record.href)}
              title={`WARDOGS ${record.name}`}
              data-discovery-hub="catalogue" data-discovery-task={type} data-discovery-target={record.detailHref}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[#090c0a]">
                <Image src={assetPath(record.image)} alt={record.imageAlt} fill sizes={previewSizes} className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]" />
              </span>
              <div className="pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="warning">{ui.preRelease}</StatusBadge>
                  <span className="text-xs uppercase text-[#829087]">{record.subtype}</span>
                </div>
                <h3 className="display-font mt-3 text-2xl leading-tight text-white group-hover:text-[#79d19c]">{record.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#a8b4ae]">{record.summary}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
