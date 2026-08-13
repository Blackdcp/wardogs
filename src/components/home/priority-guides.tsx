import {ArrowRight, CheckCircle2, Clock3, Flame, HelpCircle} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {GuideSummary} from "@/content/guides";
import {CONFIRMED_RUMOR_ITEMS, getRecentlyUpdatedGuides, TOP_GUIDE_SLUGS} from "@/features/home/home-data";

type PriorityGuidesProps = {
  guides: GuideSummary[];
};

const statusStyles = {
  confirmed: "border-[#4d946d] bg-[#1f3a2b] text-[#bce9cc]",
  rumor: "border-[#8e4545] bg-[#3e2424] text-[#ffd4d4]"
} as const;

export async function PriorityGuides({guides}: PriorityGuidesProps) {
  const t = await getTranslations();
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const topGuides = TOP_GUIDE_SLUGS.map((slug) => bySlug.get(slug)).filter((guide): guide is GuideSummary => Boolean(guide));
  const recentGuides = getRecentlyUpdatedGuides(guides, 6);

  return (
    <section aria-labelledby="priority-guides-title" className="border-b border-[#26312c] bg-[#111613] py-16 sm:py-20">
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.priority.eyebrow")}</p>
          <h2 id="priority-guides-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.priority.title")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.priority.description")}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.9fr_1fr] lg:gap-8">
          <div className="border-t border-[#3a473f] pt-5">
            <div className="flex items-center gap-3">
              <Flame aria-hidden="true" className="size-5 text-[#d9a93a]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">{t("home.priority.top.title")}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#98a69f]">{t("home.priority.top.description")}</p>
            <ol aria-label={t("home.priority.top.title")} className="mt-6 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {topGuides.map((guide, index) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group flex min-h-12 items-start gap-3 border-b border-[#26312c] pb-3 text-sm text-[#d7ded9] hover:text-[#79d19c]"
                  >
                    <span className="display-font mt-0.5 w-6 shrink-0 text-right text-xs text-[#728078]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 leading-6">{guide.title}</span>
                    <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#64726a] transition-transform group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#3a473f] pt-5">
            <div className="flex items-center gap-3">
              <Clock3 aria-hidden="true" className="size-5 text-[#79a9d1]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">{t("home.priority.recent.title")}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#98a69f]">{t("home.priority.recent.description")}</p>
            <ul aria-label={t("home.priority.recent.title")} className="mt-6 space-y-3">
              {recentGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group block border-b border-[#26312c] pb-3"
                  >
                    <span className="block text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">
                      {guide.title}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[#728078]">
                      {t("common.updated")} {guide.updatedAt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#3a473f] pt-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden="true" className="size-5 text-[#69c78f]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">{t("home.priority.status.title")}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#98a69f]">{t("home.priority.status.description")}</p>
            <ul aria-label={t("home.priority.status.title")} className="mt-6 space-y-3">
              {CONFIRMED_RUMOR_ITEMS.map((item) => (
                <li key={item.titleKey}>
                  <Link
                    href={`/guides/${item.slug}`}
                    className="group flex gap-3 border-b border-[#26312c] pb-3"
                  >
                    <span className={`mt-1 inline-flex h-6 shrink-0 items-center rounded-[4px] border px-2 text-[11px] font-semibold uppercase ${statusStyles[item.status]}`}>
                      {t(`home.priority.status.labels.${item.status}`)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">
                        {t(`home.priority.status.items.${item.titleKey}.title`)}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[#98a69f]">
                        {t(`home.priority.status.items.${item.titleKey}.description`)}
                      </span>
                    </span>
                    <HelpCircle aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#64726a] group-hover:text-[#79d19c]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
