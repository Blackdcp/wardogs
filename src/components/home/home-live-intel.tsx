import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import type {HomeLiveIntelEntry} from "@/features/home/home-live-intel";
import {HomeSectionSentinel} from "@/components/seo/home-section-analytics";
import {SectionHeading} from "@/components/ui/section-heading";
import {Link} from "@/i18n/navigation";

export async function HomeLiveIntel({locale, entries}: {locale: Locale; entries: readonly HomeLiveIntelEntry[]}) {
  const t = await getTranslations({locale});
  return (
    <section data-home-section="live-intel" aria-labelledby="home-intel-title" className="border-b border-[#26312c] bg-[#101512] py-8 sm:py-10">
      <HomeSectionSentinel section="live-intel" />
      <div className="site-container">
        <SectionHeading id="home-intel-title" title={t("home.discovery.sections.live-intel.title")} description={t("home.discovery.sections.live-intel.description")} />
        {entries.length ? <ul className="grid gap-3 md:grid-cols-3">{entries.map((entry) => (
          <li key={entry.id} className="rounded-[6px] border border-[#344039] bg-[#111713] p-4" data-home-intel={entry.id}>
            <p className="text-xs font-semibold text-[#d9a93a]">{t(`home.discovery.states.${entry.current ? "current" : "archive"}`)}</p>
            <Link className="mt-2 block text-sm font-semibold leading-6 text-white hover:text-[#79d19c]" href={entry.href} data-home-task={entry.kind === "season" ? "season2" : entry.kind === "status" ? "status" : "patchNotes"} data-home-placement="live-intel" title={entry.sourceTitle ?? t(entry.titleKey)}>{entry.sourceTitle ?? t(entry.titleKey)}</Link>
            <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{entry.build || t("home.discovery.states.unknownBuild")} · {t("home.discovery.states.verifiedAt")} <time dateTime={entry.verifiedAt}>{new Intl.DateTimeFormat(locale, {year: "numeric", month: "short", day: "numeric", timeZone: "UTC"}).format(new Date(`${entry.verifiedAt}T00:00:00Z`))}</time></p>
            <p className="mt-1 text-xs text-[#82938a]">{t(`home.discovery.states.sources.${entry.sourceClass}`)}</p>
          </li>
        ))}</ul> : <p className="text-sm text-[#a8b4ae]">{t("home.discovery.states.noVerifiedChanges")}</p>}
        <nav className="mt-4 flex flex-wrap gap-x-5" aria-label={t("home.discovery.sections.live-intel.title")}>
          <Link className="task-link task-link--text" href="/guides/wardogs-server-status" data-home-task="status" data-home-placement="live-intel" title={t("home.discovery.actions.serverStatus")}>{t("home.discovery.actions.serverStatus")} →</Link>
          <Link className="task-link task-link--text" href="/guides/wardogs-patch-notes" data-home-task="patchNotes" data-home-placement="live-intel" title={t("home.discovery.actions.patchNotes")}>{t("home.discovery.actions.patchNotes")} →</Link>
        </nav>
      </div>
    </section>
  );
}
