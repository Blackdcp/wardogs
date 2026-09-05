import {ArrowRight, CheckCircle2, Clock3, Flame, HelpCircle} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {GuideSummary} from "@/content/guides";
import {getHomePriorityGuides} from "@/features/home/home-data";
import type {Locale} from "@/config/site";
import {formatLocalizedDate} from "@/lib/localized-date";

type PriorityGuidesProps = {
  guides: GuideSummary[];
  locale: Locale;
};

const statusStyles = {
  confirmed: "border-[#4d946d] bg-[#1f3a2b] text-[#bce9cc]",
  rumor: "border-[#8e4545] bg-[#3e2424] text-[#ffd4d4]"
} as const;

export async function PriorityGuides({guides, locale}: PriorityGuidesProps) {
  const t = await getTranslations();
  const {top: topGuides, recent: recentGuides, status: statusItems} = getHomePriorityGuides(guides);

  return (
    <section aria-labelledby="priority-guides-title" className="border-b border-[#26312c] bg-[#111613] py-16 sm:py-20">
      <div className="site-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.priority.eyebrow")}</p>
            <h2 id="priority-guides-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
              {t("home.priority.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.priority.description")}</p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center gap-2 border border-[#536159] px-4 py-2 text-sm font-semibold text-[#dce4df] hover:border-[#79d19c] hover:text-white" href="/guides">
            {t("nav.allGuides")}<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
          <div className="border-t border-[#3a473f] pt-5">
            <div className="flex items-center gap-3">
              <Flame aria-hidden="true" className="size-5 text-[#d9a93a]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">{t("home.priority.top.title")}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#98a69f]">{t("home.priority.top.description")}</p>
            <ol aria-label={t("home.priority.top.title")} className="mt-6 grid gap-x-7 sm:grid-cols-2">
              {topGuides.map((guide, index) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group flex min-h-12 items-start gap-3 border-b border-[#26312c] pb-3 text-sm text-[#d7ded9] hover:text-[#79d19c]"
                  >
            <span className="display-font mt-0.5 w-6 shrink-0 text-right text-xs text-[#82938a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 leading-6">{guide.title}</span>
                    <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#64726a] transition-transform group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-9">
            <div className="border-t border-[#3a473f] pt-5">
              <div className="flex items-center gap-3">
                <Clock3 aria-hidden="true" className="size-5 text-[#79a9d1]" />
                <h3 className="display-font text-xl text-[#f2f5f3]">{t("home.priority.recent.title")}</h3>
              </div>
              <ul aria-label={t("home.priority.recent.title")} className="mt-5 space-y-3">
                {recentGuides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`} className="group block border-b border-[#26312c] pb-3">
                      <span className="block text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">{guide.title}</span>
                      <span className="mt-1 block text-xs uppercase text-[#82938a]">{t("common.updated")} {formatLocalizedDate(guide.updatedAt, locale)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#3a473f] pt-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 aria-hidden="true" className="size-5 text-[#69c78f]" />
                <h3 className="display-font text-xl text-[#f2f5f3]">{t("home.priority.status.title")}</h3>
              </div>
              <ul aria-label={t("home.priority.status.title")} className="mt-5 space-y-3">
                {statusItems.map((item) => (
                  <li key={item.titleKey}>
                    <Link href={`/guides/${item.slug}`} className="group flex items-start gap-3 border-b border-[#26312c] pb-3">
                      <span className={`mt-0.5 inline-flex h-6 shrink-0 items-center rounded-[4px] border px-2 text-[10px] font-semibold uppercase ${statusStyles[item.status]}`}>
                        {t(`home.priority.status.labels.${item.status}`)}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">
                        {t(`home.priority.status.items.${item.titleKey}.title`)}
                      </span>
                      <HelpCircle aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#64726a] group-hover:text-[#79d19c]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
