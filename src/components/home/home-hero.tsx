import Image from "next/image";
import {ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {assetPath} from "@/lib/assets";
import {StatusBadge} from "@/components/ui/status-badge";
import {HomeSectionSentinel} from "@/components/seo/home-section-analytics";
import {Link} from "@/i18n/navigation";
import type {DiscoveryDestination} from "@/features/discovery/discovery-types";
import {getHomeCommandDestinations} from "@/features/home/home-discovery-model";
import {HeroSearchBox} from "./hero-search-box";
import type {Locale} from "@/config/site";

type HomeHeroProps = {
  facts: readonly string[];
  locale?: Locale;
  command?: readonly DiscoveryDestination[];
};

export async function HomeHero({facts, locale = "en", command = getHomeCommandDestinations(locale)}: HomeHeroProps) {
  const t = await getTranslations();
  const proofPoints = facts.slice(0, 3);

  return (
    <section data-home-section="command" aria-labelledby="home-hero-title" className="relative isolate flex min-h-[520px] items-center overflow-hidden border-b border-[#2c3631]">
      {/* The first section cannot scroll its top into the shared 25%–75% observation region. */}
      <div className="absolute left-0" style={{top: "40vh"}}><HomeSectionSentinel section="command" /></div>
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
            <StatusBadge>{t("home.discovery.states.earlyAccess")}</StatusBadge>
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
            {t("home.discovery.sections.command.title")}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d6ded9] sm:text-base sm:leading-8">
            {t("home.discovery.sections.command.description")}
          </p>

          <HeroSearchBox
            locale={locale}
            placeholder={t("home.search.placeholder")}
          />

          <div className="mt-5 grid w-full max-w-xl gap-2.5 sm:grid-cols-2">
            {command.filter((destination) => destination.task !== "search").map((destination) => (
              <Link key={destination.id} href={destination.href} className="task-link task-link--secondary text-[#d8f4e4]" data-home-task={destination.task} data-home-placement="command" title={t(destination.labelKey)}>{t(destination.labelKey)}</Link>
            ))}
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
