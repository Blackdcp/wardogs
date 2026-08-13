import type {LucideIcon} from "lucide-react";
import {ArrowRight, BookOpen, CalendarDays, KeyRound, Monitor, ShoppingBag, Users, Video, Wrench} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {HOME_CATEGORY_GUIDES} from "@/features/home/home-data";

const categoryIcons: Record<(typeof HOME_CATEGORY_GUIDES)[number]["key"], LucideIcon> = {
  access: KeyRound,
  release: CalendarDays,
  store: ShoppingBag,
  platform: Monitor,
  video: Video,
  community: Users,
  developer: Wrench,
  guide: BookOpen
};

const categoryTones: Record<(typeof HOME_CATEGORY_GUIDES)[number]["key"], string> = {
  access: "border-[#4d946d] bg-[#244332] text-[#d8f4e4]",
  release: "border-[#927328] bg-[#3c321c] text-[#f6dda0]",
  store: "border-[#52665c] bg-[#202a25] text-[#cbd7d0]",
  platform: "border-[#52665c] bg-[#202a25] text-[#cbd7d0]",
  video: "border-[#8e4545] bg-[#3e2424] text-[#ffd4d4]",
  community: "border-[#4d946d] bg-[#244332] text-[#d8f4e4]",
  developer: "border-[#927328] bg-[#3c321c] text-[#f6dda0]",
  guide: "border-[#4d946d] bg-[#244332] text-[#d8f4e4]"
};

export async function CategoryGrid() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="all-guides-title" className="border-b border-[#26312c] bg-[#151b18] py-16 sm:py-20">
      <div className="site-container">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.categories.eyebrow")}</p>
            <h2 id="all-guides-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
              {t("home.categories.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.categories.description")}</p>
          </div>
          <Link href="/guides" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#79d19c] hover:text-[#a0e0ba] md:self-auto">
            {t("home.categories.allGuides")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ul className="mt-9 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_CATEGORY_GUIDES.map((category) => {
            const Icon = categoryIcons[category.key];
            return (
              <li key={category.key} className="border-t border-[#344039]">
                <Link
                  href={`/guides/${category.slug}`}
                  className="group flex min-h-[132px] items-start gap-4 py-5"
                >
                  <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[5px] border ${categoryTones[category.key]}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="display-font block text-lg leading-tight text-[#eef3f0] transition-colors group-hover:text-[#79d19c]">
                      {t(`categories.${category.key}`)}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[#98a69f]">
                      {t(`home.categories.items.${category.key}`)}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
