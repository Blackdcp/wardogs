import {getTranslations} from "next-intl/server";
import type {ReactNode} from "react";
import type {Locale} from "@/config/site";
import type {GuideSummary} from "@/content/guides";
import type {TrafficAsset} from "@/features/discovery/discovery-types";
import {HomeSectionSentinel} from "@/components/seo/home-section-analytics";
import {SectionHeading} from "@/components/ui/section-heading";
import {Link} from "@/i18n/navigation";
import {getHomeDemandHandoffs} from "@/features/home/home-traffic-assets";
import {getReleaseImpactCopy} from "@/features/releases/release-impacts";

export async function HomeProvenDemand({locale, assets, guides, sponsoredSlot}: {locale: Locale; assets: readonly TrafficAsset[]; guides: readonly GuideSummary[]; sponsoredSlot: ReactNode}) {
  const t = await getTranslations({locale});
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const handoffs = getHomeDemandHandoffs(locale);
  const handoffLabels = getReleaseImpactCopy(locale).links;
  return (
    <section data-home-section="proven-demand" aria-labelledby="home-demand-title" className="border-b border-[#26312c] bg-[#0b0e0c] py-8 sm:py-10">
      <HomeSectionSentinel section="proven-demand" />
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="home-demand-title" title={t("home.discovery.sections.proven-demand.title")} description={t("home.discovery.sections.proven-demand.description")} />
          <Link className="task-link task-link--text mb-6" href="/items" data-home-task="catalogue" data-home-placement="proven-demand" title={t("home.discovery.actions.catalogue")}>{t("home.discovery.actions.catalogue")} →</Link>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const guide = bySlug.get(asset.href.slice("/guides/".length));
            if (!guide) throw new Error(`Missing protected home title: ${asset.href}`);
            return <li key={asset.id} data-protected-demand={asset.id}>
              <Link className="group flex min-h-[96px] h-full flex-col justify-center rounded-[6px] border border-[#344039] bg-[#111713] px-4 py-3 hover:border-[#79d19c]" href={asset.href} data-home-task={asset.task} data-home-placement="proven-demand" title={guide.title}>
                <span className="text-xs font-semibold text-[#79d19c]">{t(asset.labelKey)}</span>
                <span className="mt-1 text-sm font-semibold leading-6 text-white [overflow-wrap:anywhere]">{guide.title}</span>
              </Link>
            </li>;
          })}
        </ul>
        {handoffs.length > 0 ? <ul className="mt-2 flex flex-wrap gap-x-6 border-t border-[#26312c] pt-1" data-home-demand-handoffs="true">
          {handoffs.map(({href, task}) => <li key={href}>
            <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#a9d8bb] underline decoration-[#466651] underline-offset-4 hover:text-white" href={href} data-home-task={task} data-home-placement="proven-demand" title={handoffLabels[href]}>
              {handoffLabels[href]} <span aria-hidden="true">→</span>
            </Link>
          </li>)}
        </ul> : null}
        <aside className="mt-5 rounded-[6px] border border-[#344039] bg-[#101512] p-3" data-home-sponsored-slot="true">{sponsoredSlot}</aside>
      </div>
    </section>
  );
}
