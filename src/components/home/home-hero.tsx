import Image from "next/image";
import {ArrowRight, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {assetPath} from "@/lib/assets";
import {ButtonLink} from "@/components/ui/button-link";
import {StatsGrid} from "@/components/ui/stats-grid";
import {StatusBadge} from "@/components/ui/status-badge";

type HomeHeroProps = {
  facts: readonly string[];
};

export async function HomeHero({facts}: HomeHeroProps) {
  const t = await getTranslations();

  return (
    <section aria-labelledby="home-hero-title" className="relative isolate flex min-h-[680px] items-center overflow-hidden border-b border-[#2c3631]">
      <Image
        src={assetPath("/images/wardogs-hero.jpg")}
        alt=""
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
            alt=""
            aria-hidden="true"
            priority
            className="mt-6 h-auto w-[260px] sm:w-[360px] lg:w-[430px]"
          />
          <h1 id="home-hero-title" className="display-font mt-2 text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
            <span className="screen-reader-only">WARDOGS </span>
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d6ded9] sm:text-base sm:leading-8">
            {t("home.heroDescription")}
          </p>

          <div className="mt-6 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/guides" className="w-full sm:w-auto">
              {t("home.primaryCta")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/guides/wardogs-playtest" variant="secondary" className="w-full sm:w-auto">
              {t("home.secondaryCta")}
            </ButtonLink>
          </div>

          <StatsGrid items={facts} label={t("home.statsLabel")} className="mt-7 w-full" />
        </div>
      </div>
    </section>
  );
}
