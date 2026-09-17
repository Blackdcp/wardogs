import {ArrowUpRight, History} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import {getHomeCurrentBuildChanges} from "@/features/home/home-data";
import {formatLocalizedDate} from "@/lib/localized-date";

export async function CurrentBuildChanges({locale}: {locale: Locale}) {
  const t = await getTranslations("home.buildChanges");
  const changes = getHomeCurrentBuildChanges();

  return (
    <section aria-labelledby="current-build-changes-title" className="border-b border-[#26312c] bg-[#151b18] py-12 sm:py-14" data-current-build-changes>
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
          <dl className="grid grid-cols-2 gap-x-7 border-t border-[#3a473f] pt-4 text-sm lg:min-w-[310px]">
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

        <ul className="mt-8 grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
          {changes.map((change) => (
            <li className="min-w-0 border-t border-[#3a473f] py-5" key={change.key}>
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

        <a
          title={t("sourceCta")}
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-[#a0e0ba]"
          href={changes[0]!.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {t("sourceCta")}<ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}
