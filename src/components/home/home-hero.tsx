import Image from "next/image";
import {ArrowRight, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {assetPath} from "@/lib/assets";
import {ButtonLink} from "@/components/ui/button-link";
import {StatsGrid} from "@/components/ui/stats-grid";
import {StatusBadge} from "@/components/ui/status-badge";
import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {HeroSearchBox} from "./hero-search-box";
import type {Locale} from "@/config/site";

type HomeHeroProps = {
  facts: readonly string[];
  locale?: Locale;
};

export async function HomeHero({facts, locale = "en"}: HomeHeroProps) {
  const t = await getTranslations();

  return (
    <section aria-labelledby="home-hero-title" className="relative isolate flex min-h-[560px] items-center overflow-hidden border-b border-[#2c3631]">
      <Image
        src={assetPath("/images/wardogs-hero.jpg")}
        alt={t("home.heroImageAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[43%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[#080b09]/75" />

      <div className="site-container py-10 text-center sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#d5ddd8] sm:text-sm">
              <ShieldCheck aria-hidden="true" className="size-4 text-[#69c78f]" />
              {t("common.fanMade")}
            </span>
            <StatusBadge>{t("home.status")}</StatusBadge>
          </div>

          <Image
            src={assetPath("/images/wardogs-fullmark-full.png")}
            width={2468}
            height={490}
            alt="WARDOGS"
            priority
            className="mt-6 h-auto w-[260px] sm:w-[360px] lg:w-[430px]"
          />
          <h1 id="home-hero-title" className="display-font mt-2 text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
            WARDOGS Wiki
          </h1>
          <p className="display-font mt-3 text-xl leading-tight text-[#edf2ef] sm:text-2xl">
            {t("home.heroTitle")}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d6ded9] sm:text-base sm:leading-8">
            {t("home.heroDescription")}
          </p>

          {/* 1. Hero 战术聚焦区：智能搜索框 + 5 个免打字热搜标签 */}
          <HeroSearchBox
            locale={locale}
            placeholder={t("home.search.placeholder")}
            hotTagsLabel={locale === "zh-cn" || locale === "zh-tw" ? "热搜" : "HOT"}
          />

          <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-4">
            <ButtonLink href="/items/weapons" homeTask="weapons" className="px-2" title={t("home.quickTasks.weapons")}>{t("home.quickTasks.weapons")}</ButtonLink>
            <ButtonLink href="/items/vehicles" homeTask="vehicles" variant="secondary" className="px-2" title={t("home.quickTasks.vehicles")}>{t("home.quickTasks.vehicles")}</ButtonLink>
            <ButtonLink href="/tools/map" homeTask="map" variant="secondary" className="px-2" title={t("home.quickTasks.map")}>{t("home.quickTasks.map")}</ButtonLink>
            <ButtonLink href="/guides/wardogs-server-status" homeTask="status" variant="secondary" className="px-2" title={t("home.quickTasks.status")}>{t("home.quickTasks.status")}</ButtonLink>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <ButtonLink href={`/guides/${CURRENT_EVENT.patchNotesGuideSlug}`} variant="secondary" title={t("home.primaryCta")}>
              {t("home.primaryCta")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>

          <StatsGrid items={facts} label={t("home.statsLabel")} className="mt-5 w-full" />
        </div>
      </div>
    </section>
  );
}
