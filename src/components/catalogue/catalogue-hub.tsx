import {HubHeader} from "@/components/ui/hub-header";
import {SectionHeading} from "@/components/ui/section-heading";
import Image from "next/image";
import {ShieldCheck} from "lucide-react";
import type {ReactNode} from "react";
import type {Locale} from "@/config/site";
import {CatalogueCategoryCard} from "./catalogue-category-card";
import {CataloguePreviewRow} from "./catalogue-preview-row";
import {StatusBadge} from "@/components/ui/status-badge";
import {buildCatalogueHubModel} from "@/features/catalogue/catalogue-hub-data";
import {formatCatalogueIndexCount, getItemUi} from "@/features/items/item-ui";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";

export function CatalogueHub({locale, children, secondarySponsoredSlot}: {locale: Locale; children?: ReactNode; secondarySponsoredSlot?: ReactNode}) {
  const {categories, featured, previews} = buildCatalogueHubModel(locale);
  const ui = getItemUi(locale);
  return (<>
      <section data-catalogue-hero className="border-b border-[#2c3631] bg-[#0d110f]">
        <div className="site-container py-5 sm:py-7">
          <div className="relative w-full aspect-[4/5] min-h-[420px] overflow-hidden border-y border-[#354039] sm:aspect-[16/7] sm:min-h-[360px] lg:aspect-[18/5]">
            <Image
              src={assetPath("/images/catalogue/banners/thegame-1280.webp")}
              alt={ui.hubDescription}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, calc(100vw - 32px)"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[#070a08]/70" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-10">
              <HubHeader layout="overlay" eyebrow={ui.hubEyebrow} title={ui.hubTitle} description={ui.hubDescription}>
                <div className="mt-5"><StatusBadge tone="warning">{ui.alphaSnapshot}</StatusBadge></div>
              </HubHeader>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-12 md:py-16" aria-labelledby="catalogue-categories-title">
        <SectionHeading eyebrow={formatCatalogueIndexCount(locale, categories.length)} id="catalogue-categories-title" title={ui.browseTitle} description={ui.browseDescription} />
        <ul className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CatalogueCategoryCard
              key={category.id}
              title={category.label}
              description={category.description}
              count={category.count}
              href={category.href}
              image={category.image}
              imageAlt={category.imageAlt}
              imageFit={category.imageFit}
              discoveryTask={category.id === "weapons" || category.id === "vehicles" ? category.id : "catalogue"}
            />
          ))}
        </ul>
      </section>

      {children}

      <section data-evidence-legend aria-labelledby="evidence-legend-title" className="border-y border-[#2c3631] bg-[#111512]">
        <div className="site-container py-9 md:py-11">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-5 text-[#68bd8d]" />
            <SectionHeading id="evidence-legend-title" title={ui.evidenceTitle} />
          </div>
          <dl className="mt-6 grid gap-6 md:grid-cols-3 md:gap-0">
            <div className="border-t border-[#354039] pt-4 md:border-r md:pr-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.official}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.officialDescription}</dd>
            </div>
            <div className="border-t border-[#354039] pt-4 md:border-r md:px-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.verified}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.verifiedDescription}</dd>
            </div>
            <div className="border-t border-[#354039] pt-4 md:pl-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.preRelease}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.preReleaseDescription}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="site-container py-3 md:py-5">
        <CataloguePreviewRow
          locale={locale}
          type="weapons"
          records={previews.weapons}
          title={ui.featuredWeapons}
          description={ui.featuredWeaponsDescription}
        />
        {secondarySponsoredSlot}
        <CataloguePreviewRow
          locale={locale}
          type="vehicles"
          records={previews.vehicles}
          title={ui.featuredVehicles}
          description={ui.featuredVehiclesDescription}
        />
      </div>

      <section className="border-t border-[#2c3631] bg-[#111512]" aria-labelledby="published-guides-title">
        <div className="site-container py-12 md:py-16">
          <SectionHeading eyebrow={ui.publishedAnalysis} id="published-guides-title" title={ui.detailedFieldGuides} />
          <ul className="mt-7 grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
              <li className="border-t border-[#354039]" key={item.slug}>
                <Link
                  className="group block min-h-48 py-5"
                  href={item.target.pathname}
                  locale={item.target.locale}
                  title={`WARDOGS ${item.name}`}
                  data-discovery-hub="catalogue" data-discovery-task="catalogue" data-discovery-target={item.target.pathname}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={item.status === "official" ? "accent" : "warning"}>{item.statusLabel}</StatusBadge>
                    <span className="text-xs uppercase text-[#7f8e87]">{item.subtype}</span>
                  </div>
                  <h3 className="display-font mt-4 text-2xl leading-tight text-white group-hover:text-[#79d19c]">WARDOGS {item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{item.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
