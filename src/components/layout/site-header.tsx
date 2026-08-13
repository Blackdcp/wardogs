import {ExternalLink, Gamepad2} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {officialLinks} from "@/config/site";
import {Link} from "@/i18n/navigation";
import {LocaleSwitcher} from "./locale-switcher";
import {MobileNav, type MobileNavItem} from "./mobile-nav";
import {SiteBrand} from "./site-brand";

export async function SiteHeader() {
  const t = await getTranslations();
  const navigation: readonly MobileNavItem[] = [
    {href: "/guides/wardogs-playtest", label: t("nav.playtest")},
    {href: "/guides/wardogs-release-date", label: t("nav.release")},
    {href: "/guides/wardogs-steam", label: t("nav.steam")},
    {href: "/guides/wardogs-gameplay", label: t("nav.gameplay")},
    {href: "/guides/wardogs-factions", label: t("nav.factions")},
    {href: "/guides/wardogs-discord", label: t("nav.community")},
    {href: "/guides/wardogs-trailer", label: t("nav.videos")},
    {href: "/guides", label: t("nav.guides")}
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#2b3530] bg-[#0d0f0e]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 md:px-8">
        <div className="flex w-full items-center justify-between gap-3 min-[1180px]:hidden">
          <Link href="/" aria-label={t("footer.aboutTitle")} className="min-w-0 shrink">
            <SiteBrand markClassName="w-[100px] sm:w-[118px]" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={officialLinks.steam}
              target="_blank"
              rel="noreferrer"
              aria-label={t("common.openSteam")}
              title={t("common.openSteam")}
              className="inline-flex size-11 items-center justify-center rounded-[6px] border border-[#397b59] bg-[#244332] text-[#d8f4e4] transition-colors hover:bg-[#315a43]"
            >
              <Gamepad2 aria-hidden="true" className="size-5" />
            </a>
            <LocaleSwitcher label={t("common.language")} compact />
            <MobileNav
              items={navigation}
              openLabel={t("common.openMenu")}
              closeLabel={t("common.closeMenu")}
              navigationLabel={t("nav.primaryLabel")}
            />
          </div>
        </div>

        <div className="hidden w-full min-w-0 items-center gap-4 min-[1180px]:flex">
          <Link href="/" aria-label={t("footer.aboutTitle")} className="shrink-0">
            <SiteBrand markClassName="w-[136px] min-[1360px]:w-[150px]" />
          </Link>
          <nav aria-label={t("nav.primaryLabel")} className="min-w-0 flex-1">
            <ul className="flex items-center justify-center gap-0.5 min-[1360px]:gap-1.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center whitespace-nowrap px-2 text-[12px] font-semibold text-[#c2ccc7] transition-colors hover:text-[#79d19c] min-[1360px]:px-2.5 min-[1360px]:text-[13px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitcher label={t("common.language")} />
          <a
            href={officialLinks.steam}
            target="_blank"
            rel="noreferrer"
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
