import Image from "next/image";
import {ArrowRight, Crosshair, Map, ShieldCheck} from "lucide-react";
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
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover object-[43%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[#080b09]/75" />

      <div className="site-container py-8 text-center sm:py-14">
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
            loading="eager"
            className="mt-4 h-auto w-[220px] sm:mt-6 sm:w-[360px] lg:w-[430px]"
          />
          <h1 id="home-hero-title" className="display-font mt-2 text-3xl leading-none text-white sm:text-5xl lg:text-6xl">
            WARDOGS Wiki
          </h1>
          <p className="display-font mt-3 text-lg leading-tight text-[#edf2ef] sm:text-2xl">
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

          <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
            <ButtonLink href="/tools/map" homeTask="map" className="min-h-12 text-base" title={t("nav.interactiveMap")}>
              <Map aria-hidden="true" className="size-5" />
              {t("nav.interactiveMap")}
            </ButtonLink>
            <ButtonLink href="/tools/artillery-calculator" homeTask="calculator" variant="secondary" className="min-h-12 border-[#3c5c46] bg-[#111a15]/90 text-base text-[#d8f4e4] hover:border-[#69c78f] hover:bg-[#193022]" title={t("nav.artilleryCalculator")}>
              <Crosshair aria-hidden="true" className="size-5 text-[#8ce2ad]" />
              {t("nav.artilleryCalculator")}
            </ButtonLink>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <ButtonLink href={`/guides/${CURRENT_EVENT.patchNotesGuideSlug}`} homeTask="season2" variant="secondary" className="min-h-10 px-4 py-2 text-xs" title={t("home.primaryCta")}>
              {t("home.primaryCta")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/guides/wardogs-server-status" homeTask="status" variant="secondary" className="min-h-10 px-4 py-2 text-xs" title={t("home.secondaryCta")}>
              {t("home.secondaryCta")}
            </ButtonLink>
          </div>

          <StatsGrid items={facts} label={t("home.statsLabel")} className="mt-5 w-full" />
        </div>
      </div>
    </section>
  );
}
