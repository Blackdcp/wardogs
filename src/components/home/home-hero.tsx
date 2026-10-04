import Image from "next/image";
import {Crosshair, Map, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {assetPath} from "@/lib/assets";
import {ButtonLink} from "@/components/ui/button-link";
import {StatusBadge} from "@/components/ui/status-badge";
import {HeroSearchBox} from "./hero-search-box";
import type {Locale} from "@/config/site";

type HomeHeroProps = {
  facts: readonly string[];
  locale?: Locale;
};

export async function HomeHero({facts, locale = "en"}: HomeHeroProps) {
  const t = await getTranslations();
  const proofPoints = facts.slice(0, 3);

  return (
    <section aria-labelledby="home-hero-title" className="relative isolate flex min-h-[540px] items-center overflow-hidden border-b border-[#2c3631]">
      <Image
        src={assetPath("/images/wardogs-hero.jpg")}
        alt={t("home.heroImageAlt")}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover object-[43%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[#080b09]/78" />

      <div className="site-container py-9 text-center sm:py-14">
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

          <HeroSearchBox
            locale={locale}
            placeholder={t("home.search.placeholder")}
            hotTagsLabel={locale === "zh-cn" || locale === "zh-tw" ? "常用" : "Popular"}
          />

          <div className="mt-5 grid w-full max-w-xl gap-2.5 sm:grid-cols-2">
            <ButtonLink href="/tools/map" homeTask="map" variant="secondary" className="min-h-11 border-[#344039] bg-[#111713]/88 text-sm text-[#d8f4e4] hover:border-[#69c78f] hover:bg-[#17251d]" title={t("nav.interactiveMap")}>
              <Map aria-hidden="true" className="size-[18px] text-[#8ce2ad]" />
              {t("nav.interactiveMap")}
            </ButtonLink>
            <ButtonLink href="/tools/artillery-calculator" homeTask="calculator" variant="secondary" className="min-h-11 border-[#344039] bg-[#111713]/88 text-sm text-[#d8f4e4] hover:border-[#69c78f] hover:bg-[#17251d]" title={t("nav.artilleryCalculator")}>
              <Crosshair aria-hidden="true" className="size-[18px] text-[#8ce2ad]" />
              {t("nav.artilleryCalculator")}
            </ButtonLink>
          </div>

          {proofPoints.length > 0 ? (
            <ul aria-label={t("home.statsLabel")} className="mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#aab7b0]" data-hero-proof="true">
              {proofPoints.map((fact) => (
                <li className="flex items-center gap-2" key={fact}>
                  <span aria-hidden="true" className="size-1 rounded-full bg-[#69c78f]" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
