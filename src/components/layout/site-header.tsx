import {Crosshair, ExternalLink, Gamepad2, Map} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {officialLinks} from "@/config/site";
import {buildNavigation} from "@/features/navigation/navigation-data";
import {Link} from "@/i18n/navigation";
import {DesktopNavigation} from "./desktop-navigation";
import {LocaleSwitcher} from "./locale-switcher";
import {MobileNav} from "./mobile-nav";
import {SiteBrand} from "./site-brand";
import {SiteSearchDialog} from "./site-search-dialog";

export async function SiteHeader() {
  const t = await getTranslations();
  const navigation = buildNavigation(t);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#2b3530] bg-[#0d0f0e]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 md:px-8">
        <div className="flex w-full items-center justify-between gap-3 min-[1180px]:hidden">
          <Link
            href="/"
            aria-label={t("footer.aboutTitle")}
            title={t("footer.aboutTitle")}
            className="shrink-0"
          >
            <SiteBrand markClassName="w-[108px] sm:w-[118px]" suffixClassName="hidden min-[420px]:inline-block" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/tools/map"
              aria-label={t("nav.interactiveMap")}
              title={t("nav.interactiveMap")}
              className="inline-flex size-11 items-center justify-center rounded-[6px] border border-[#30543e] bg-[#16271e] text-[#8be2ad] transition-colors hover:bg-[#1e382b] hover:text-[#d8f4e4]"
            >
              <Map aria-hidden="true" className="size-5 text-[#4cd988]" />
              <span className="sr-only">{t("nav.interactiveMap")}</span>
            </Link>
            <SiteSearchDialog compact />
            <a
              href={officialLinks.steam}
              target="_blank"
              rel="noreferrer"
              aria-label={t("common.openSteam")}
              title={t("common.openSteam")}
              className="hidden size-11 items-center justify-center rounded-[6px] border border-[#397b59] bg-[#244332] text-[#d8f4e4] transition-colors hover:bg-[#315a43] sm:inline-flex"
            >
              <Gamepad2 aria-hidden="true" className="size-5" />
              <span className="sr-only">{t("common.openSteam")}</span>
            </a>
            <LocaleSwitcher label={t("common.language")} compact />
            <MobileNav
              groups={navigation}
              openLabel={t("common.openMenu")}
              closeLabel={t("common.closeMenu")}
              navigationLabel={t("nav.primaryLabel")}
              mapLabel={t("nav.mapPill")}
              calcLabel={t("nav.calcPill")}
            />
          </div>
        </div>

        <div className="hidden w-full min-w-0 items-center gap-3 min-[1360px]:gap-4 min-[1180px]:flex">
          <Link
            href="/"
            aria-label={t("footer.aboutTitle")}
            title={t("footer.aboutTitle")}
            className="shrink-0"
          >
            <SiteBrand markClassName="w-[136px] min-[1360px]:w-[150px]" />
          </Link>
          <DesktopNavigation groups={navigation} label={t("nav.primaryLabel")} />

          {/* 战术双核心高绿胶囊 (Tactical Twin Capsule: Map & Artillery) */}
          <div
            className="inline-flex min-h-10 shrink-0 items-center overflow-hidden rounded-[6px] border border-[#30543e] bg-[#122319] p-0.5 shadow-[0_0_15px_rgba(76,217,136,0.12)] transition-colors hover:border-[#4cd988]"
            data-tactical-capsule="true"
          >
            <Link
              href="/tools/map"
              title={t("nav.interactiveMap")}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] px-2.5 text-xs font-semibold text-[#8be2ad] transition-colors hover:bg-[#1b3626] hover:text-[#d8f4e4]"
            >
              <Map aria-hidden="true" className="size-3.5 text-[#4cd988]" />
              <span className="whitespace-nowrap">{t("nav.mapPill")}</span>
            </Link>
            <span aria-hidden="true" className="h-4 w-px bg-[#264432]" />
            <Link
              href="/tools/artillery-calculator"
              title={t("nav.artilleryCalculator")}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] px-2.5 text-xs font-semibold text-[#8be2ad] transition-colors hover:bg-[#1b3626] hover:text-[#d8f4e4]"
            >
              <Crosshair aria-hidden="true" className="size-3.5 text-[#4cd988]" />
              <span className="whitespace-nowrap">{t("nav.calcPill")}</span>
            </Link>
          </div>

          <SiteSearchDialog compact />
          <LocaleSwitcher label={t("common.language")} />
          <a
            href={officialLinks.steam}
            target="_blank"
            rel="noreferrer"
            aria-label={t("common.openSteam")}
            title={t("common.openSteam")}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] border border-[#397b59] bg-[#397b59] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#45946c] min-[1360px]:px-4 min-[1360px]:text-sm"
          >
            {t("nav.steamCta")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
