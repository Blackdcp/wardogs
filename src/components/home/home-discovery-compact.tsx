import type {LucideIcon} from "lucide-react";
import {ArrowRight, BookOpen, HelpCircle, Info, Video} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import {HOME_CATEGORY_GUIDES, HOME_FAQ_KEYS} from "@/features/home/home-data";
import {getVideoUi} from "@/features/videos/video-ui";
import {Link} from "@/i18n/navigation";

type DiscoveryCard = {
  cta: string;
  description: string;
  href: string;
  icon: LucideIcon;
  key: string;
  task: "videos" | "guides" | "faq" | "about";
  title: string;
};

const aboutPoints = ["teams", "battlefield", "roles"] as const;

export async function HomeDiscoveryCompact({guideCount, locale}: {guideCount: number; locale: Locale}) {
  const t = await getTranslations();
  const videoUi = getVideoUi(locale);

  const cards: DiscoveryCard[] = [
    {
      cta: videoUi.allVideos,
      description: videoUi.homeDescription,
      href: "/videos",
      icon: Video,
      key: "videos",
      task: "videos",
      title: videoUi.homeTitle
    },
    {
      cta: t("home.categories.allGuides", {count: guideCount}),
      description: t("home.categories.description"),
      href: "/guides",
      icon: BookOpen,
      key: "guides",
      task: "guides",
      title: t("home.categories.title")
    },
    {
      cta: t("home.faq.eyebrow"),
      description: t("home.faq.description"),
      href: "#home-discovery-faq",
      icon: HelpCircle,
      key: "faq",
      task: "faq",
      title: t("home.faq.title")
    },
    {
      cta: t("home.aboutTitle"),
      description: t("home.about.bodyOne"),
      href: "/about",
      icon: Info,
      key: "about",
      task: "about",
      title: t("home.aboutTitle")
    }
  ];

  return (
    <section aria-labelledby="home-discovery-title" className="border-b border-[#26312c] bg-[#101512] py-8 sm:py-10" data-home-compact-discovery data-home-section="discovery">
      <div className="site-container">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.categories.eyebrow")}</p>
            <h2 id="home-discovery-title" className="display-font mt-2 text-2xl leading-tight text-[#f2f5f3] sm:text-3xl">
              {t("home.categories.title")}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#a8b4ae] lg:justify-self-end">{t("home.categories.description")}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const isAnchor = card.href.startsWith("#");
            const className = "group flex h-full min-h-[112px] flex-col justify-between rounded-[6px] border border-[#344039] bg-[#111713] p-3 transition-colors hover:border-[#4d946d] hover:bg-[#17231d]";
            const content = (
              <>
                <span className="flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-[#3f5147] bg-[#0d120f] text-[#79d19c]">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="display-font text-base leading-tight text-[#f2f5f3] sm:text-lg">{card.title}</span>
                </span>
                <span className="mt-2 line-clamp-2 text-xs leading-5 text-[#9fada6]">{card.description}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#79d19c] group-hover:text-[#a0e0ba]">
                  {card.cta}
                  <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </>
            );

            if (isAnchor) {
              return (
                <a className={className} data-home-placement="discovery" data-home-task={card.task} href={card.href} key={card.key} title={card.title}>
                  {content}
                </a>
              );
            }

            return (
              <Link className={className} data-home-placement="discovery" data-home-task={card.task} href={card.href} key={card.key} title={card.title}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-[6px] border border-[#344039] bg-[#111713] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="display-font text-xl text-[#f2f5f3]">{t("home.categories.eyebrow")}</h3>
              <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#79d19c] hover:text-[#a0e0ba]" href="/guides" title={t("home.categories.allGuides", {count: guideCount})}>
                {t("home.categories.allGuides", {count: guideCount})}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {HOME_CATEGORY_GUIDES.map((category) => (
                <li key={category.key}>
                  <Link
                    className="group block rounded-[4px] border border-[#303c36] bg-[#151b18] px-3 py-2.5 transition-colors hover:border-[#4d946d] hover:bg-[#1b241f]"
                    data-home-discovery-category={category.key}
                    href={`/guides/${category.slug}`}
                    title={t(`categories.${category.key}`)}
                  >
                    <span className="display-font block text-sm leading-tight text-[#edf2ef] group-hover:text-[#79d19c]">{t(`categories.${category.key}`)}</span>
                    <span className="mt-1 line-clamp-2 block text-[11px] leading-4 text-[#8d9a93]">{t(`home.categories.items.${category.key}`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[6px] border border-[#344039] bg-[#111713] p-3 sm:p-4">
            <h3 className="display-font text-xl text-[#f2f5f3]">{t("home.aboutTitle")}</h3>
            <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{t("home.about.bodyOne")}</p>
            <ul className="mt-4 space-y-2">
              {aboutPoints.map((point) => (
                <li className="flex gap-2 text-xs leading-5 text-[#d7ded9]" key={point}>
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#79d19c]" />
                  <span>{t(`home.about.points.${point}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-[6px] border border-[#344039] bg-[#0d120f] p-3 sm:p-4" id="home-discovery-faq">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.faq.eyebrow")}</p>
              <h3 className="display-font mt-2 text-xl text-[#f2f5f3]">{t("home.faq.title")}</h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#a8b4ae]">{t("home.faq.description")}</p>
          </div>
          <div className="mt-4 grid gap-2 lg:grid-cols-2">
            {HOME_FAQ_KEYS.map((key) => (
              <details className="rounded-[4px] border border-[#303c36] bg-[#151b18] p-3" data-home-discovery-faq={key} key={key}>
                <summary className="cursor-pointer text-sm font-semibold text-[#edf2ef]">{t(`home.faq.items.${key}.question`)}</summary>
                <p className="mt-2 text-xs leading-5 text-[#9fada6]">{t(`home.faq.items.${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
