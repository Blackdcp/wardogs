import {ArrowUpRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {START_GUIDES} from "@/features/home/home-data";

export async function StartHere() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="start-here-title" className="border-b border-[#26312c] bg-[#101512] py-10 sm:py-12" data-start-here data-home-section="start">
      <div className="site-container">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#69c78f]">{t("home.startEyebrow")}</p>
            <h2 id="start-here-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
              {t("home.startTitle")}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#a8b4ae] sm:text-base lg:justify-self-end">{t("home.start.description")}</p>
        </div>

        <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {START_GUIDES.map((guide) => {
            const anchor = "anchor" in guide ? `#${guide.anchor}` : "";
            const href = `/guides/${guide.slug}${anchor}`;
            const title = t(`home.start.cards.${guide.titleKey}.title`);
            return (
              <li key={guide.number}>
                <Link
                  href={href}
                  title={title}
                  className="group flex h-full flex-col rounded-[6px] border border-[#303c36] bg-[#171d1a] p-4 transition-colors hover:border-[#4d946d] hover:bg-[#1d2621]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="display-font inline-flex size-8 items-center justify-center rounded-[4px] bg-[#244332] text-sm text-[#d8f4e4]">
                      {guide.number}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-4 text-[#82938a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
                  </div>
                  <h3 className="display-font mt-5 text-lg leading-tight text-[#f2f5f3]">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#9fada6]">
                    {t(`home.start.cards.${guide.titleKey}.description`)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
