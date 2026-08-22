import {ExternalLink} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {officialLinks} from "@/config/site";
import {Link} from "@/i18n/navigation";
import {SiteBrand} from "./site-brand";

export async function SiteFooter() {
  const t = await getTranslations();
  const guideLinks = [
    {href: "/guides/wardogs-playtest", label: t("nav.playtest")},
    {href: "/guides/wardogs-gameplay", label: t("nav.gameplay")},
    {href: "/guides/wardogs-factions", label: t("nav.factions")},
    {href: "/news", label: t("nav.news")},
    {href: "/guides", label: t("nav.guides")}
  ] as const;
  const externalLinks = [
    {href: officialLinks.team17, label: t("footer.officialSite")},
    {href: officialLinks.steam, label: t("nav.steam")},
    {href: officialLinks.trailer, label: t("footer.revealTrailer")},
    {href: officialLinks.discord, label: "Discord"}
  ] as const;

  return (
    <footer className="border-t border-[#2b3530] bg-[#090b0a]">
      <div className="site-container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(160px,0.7fr)_minmax(180px,0.7fr)] md:gap-12">
          <div className="max-w-xl">
            <Link href="/" aria-label={t("footer.aboutTitle")} className="inline-flex">
              <SiteBrand markClassName="w-[156px]" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-[#a8b4ae]">{t("footer.about")}</p>
          </div>

          <nav aria-labelledby="footer-guides-title">
            <h2 id="footer-guides-title" className="display-font text-base text-[#f2f5f3]">{t("footer.guideLinks")}</h2>
            <ul className="mt-4 space-y-2.5">
              {guideLinks.map((item) => (
                <li key={item.href}>
                  <Link className="text-sm text-[#a8b4ae] transition-colors hover:text-[#79d19c]" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-official-title">
            <h2 id="footer-official-title" className="display-font text-base text-[#f2f5f3]">{t("footer.officialLinks")}</h2>
            <ul className="mt-4 space-y-2.5">
              {externalLinks.map((item) => (
                <li key={item.href}>
                  <a
                    className="inline-flex items-center gap-1.5 text-sm text-[#a8b4ae] transition-colors hover:text-[#79d19c]"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#27312c] pt-6 text-xs text-[#7f8d86] sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.description")}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="transition-colors hover:text-[#c7d1cc]" href="/editorial-policy">{t("footer.editorialPolicy")}</Link>
            <Link className="transition-colors hover:text-[#c7d1cc]" href="/privacy">{t("footer.privacy")}</Link>
            <Link className="transition-colors hover:text-[#c7d1cc]" href="/terms">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
