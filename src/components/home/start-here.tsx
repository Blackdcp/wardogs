import {ArrowUpRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {START_GUIDES} from "@/features/home/home-data";

export async function StartHere() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="start-here-title" className="border-b border-[#26312c] bg-[#0d0f0e] py-16 sm:py-20">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[#69c78f]">{t("home.startEyebrow")}</p>
          <h2 id="start-here-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.startTitle")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.start.description")}</p>
        </div>

        <ol className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {START_GUIDES.map((guide) => {
            const anchor = "anchor" in guide ? `#${guide.anchor}` : "";
            const href = `/guides/${guide.slug}${anchor}`;
            return (
              <li key={guide.number}>
                <Link
                  href={href}
                  className="group flex min-h-[224px] h-full flex-col rounded-[7px] border border-[#303c36] bg-[#171d1a] p-5 transition-colors hover:border-[#4d946d] hover:bg-[#1d2621]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="display-font inline-flex size-10 items-center justify-center rounded-[4px] bg-[#244332] text-lg text-[#d8f4e4]">
                      {guide.number}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-5 text-[#728078] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
                  </div>
                  <h3 className="display-font mt-8 text-xl leading-tight text-[#f2f5f3]">
                    {t(`home.start.cards.${guide.titleKey}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#9fada6]">
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
