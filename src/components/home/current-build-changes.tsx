import {ArrowUpRight, History, Hourglass} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import {getHomeCurrentBuildChanges} from "@/features/home/home-data";
import {formatLocalizedDate} from "@/lib/localized-date";
import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {Link} from "@/i18n/navigation";

export async function CurrentBuildChanges({locale}: {locale: Locale}) {
  const t = await getTranslations("home.buildChanges");
  const changes = getHomeCurrentBuildChanges();

  return (
    <section aria-labelledby="current-build-changes-title" className="border-b border-[#26312c] bg-[#101512] py-12 sm:py-14" data-current-build-changes data-home-section="evidence">
      <div className="site-container">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
              <History aria-hidden="true" className="size-4" />
              {t("eyebrow")}
            </p>
            <h2 className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl" id="current-build-changes-title">{t("title")}</h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("description")}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-7 rounded-[6px] border border-[#344039] bg-[#111713] p-4 text-sm lg:min-w-[310px]">
            <div>
              <dt className="text-[11px] uppercase text-[#82938a]">{t("buildLabel")}</dt>
              <dd className="mt-1 font-semibold text-white">{changes[0]?.effectiveBuild}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase text-[#82938a]">{t("verifiedLabel")}</dt>
              <dd className="mt-1 font-semibold text-white">{formatLocalizedDate(changes[0]!.verifiedAt, locale)}</dd>
            </div>
          </dl>
        </div>

        <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {changes.map((change) => (
            <li className="min-w-0 rounded-[6px] border border-[#344039] bg-[#111713] p-4" key={change.key}>
              <p className="text-sm font-semibold leading-6 text-[#edf2ef]">{t(`entries.${change.key}.title`)}</p>
              <p className="mt-1 text-xs text-[#82938a]">{t(`entries.${change.key}.field`)}</p>
              <p className="display-font mt-4 flex items-center gap-3 text-xl text-white">
                <span className="text-[#8e9b94] line-through">{change.previousValue}</span>
                <span aria-hidden="true">→</span>
                <span className="text-[#79d19c]">{change.currentValue}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-[6px] border border-[#344039] bg-[#111713] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-[#344039] bg-[#0d120f] text-[#d9a93a]">
                <Hourglass aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#d9a93a]">
                  {t("s2WipeEyebrow")}
                </p>
                <p className="mt-0.5 text-xs text-[#dbe5df] sm:text-sm">
                  {t("s2WipeDesc")}
                </p>
              </div>
            </div>
            <Link
              href={`/guides/${CURRENT_EVENT.nextSeasonGuideSlug}`}
              title={t("s2WipeTitle")}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[4px] border border-[#4d6b56] bg-[#17251d] px-4 py-2 text-xs font-semibold text-[#d8f4e4] transition-colors hover:border-[#69c78f] hover:bg-[#1d3024]"
            >
              <span>{t("s2WipeCta")}</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <a
            title={t("sourceCta")}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-[#a0e0ba]"
            href={changes[0]!.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            {t("sourceCta")}<ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
