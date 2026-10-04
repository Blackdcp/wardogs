import {ArrowUpRight, Hourglass, Play, Route, ShieldCheck, Wrench, type LucideIcon} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {ReactNode} from "react";

type PriorityKey = "firstMatch" | "season2" | "pcFixes";
type PathKey = "newPlayer" | "returning" | "tools";

type Priority = {
  key: PriorityKey;
  href: string;
  task: string;
  icon: LucideIcon;
  tone: string;
};

type PlayerPath = {
  key: PathKey;
  href: string;
  task: string;
};

const priorities: readonly Priority[] = [
  {
    key: "firstMatch",
    href: "/guides/wardogs-beginner-guide",
    task: "firstMatch",
    icon: Play,
    tone: "text-[#87e0a6]"
  },
  {
    key: "season2",
    href: "/guides/wardogs-season-2",
    task: "season2",
    icon: Hourglass,
    tone: "text-[#d9a93a]"
  },
  {
    key: "pcFixes",
    href: "/guides/wardogs-crash-fix",
    task: "pcFixes",
    icon: Wrench,
    tone: "text-[#7bb7e8]"
  }
] as const;

const playerPaths: readonly PlayerPath[] = [
  {key: "newPlayer", href: "/guides/wardogs-beginner-guide", task: "firstMatch"},
  {key: "returning", href: "/guides/wardogs-patch-notes", task: "season2"},
  {key: "tools", href: "/tools/artillery-calculator", task: "calculator"}
] as const;

export async function HomeEditorialBriefing({sponsoredSlot}: {sponsoredSlot?: ReactNode} = {}) {
  const t = await getTranslations("home.briefing");
  const [lead, ...secondary] = priorities;
  const LeadIcon = lead.icon;

  return (
    <section
      aria-labelledby="home-briefing-title"
      className="border-b border-[#26312c] bg-[#0b0e0c] py-12 sm:py-14"
      data-home-editorial-briefing="true"
      data-home-section="briefing"
    >
      <div className="site-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-stretch">
          <div className="rounded-[6px] border border-[#344039] bg-[#111713] p-5 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#79d19c]">
              <ShieldCheck aria-hidden="true" className="size-4" />
              {t("eyebrow")}
            </p>
            <h2 id="home-briefing-title" className="display-font mt-3 max-w-3xl text-3xl leading-tight text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a9b5af] sm:text-base">
              {t("description")}
            </p>

            <Link
              className="group mt-7 grid gap-5 rounded-[6px] border border-[#3f5548] bg-[#151d18] p-5 transition-colors hover:border-[#79d19c] hover:bg-[#18241d] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              data-home-placement="editorial-priority"
              data-home-priority={lead.key}
              data-home-task={lead.task}
              href={lead.href}
              title={t(`priority.${lead.key}.title`)}
            >
              <span className={`flex size-11 items-center justify-center rounded-[4px] border border-[#344039] bg-[#0d120f] ${lead.tone}`}>
                <LeadIcon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{t("primaryLabel")}</span>
                <span className="display-font mt-1 block text-2xl leading-tight text-[#f4f8f5] group-hover:text-[#79d19c]">
                  {t(`priority.${lead.key}.title`)}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#a9b5af]">
                  {t(`priority.${lead.key}.description`)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#79d19c] group-hover:text-white">
                {t(`priority.${lead.key}.cta`)}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          <div className="grid gap-3">
            {secondary.map((priority) => {
              const Icon = priority.icon;
              return (
                <Link
                  className="group grid min-h-[132px] grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 rounded-[6px] border border-[#344039] bg-[#111713] p-4 transition-colors hover:border-[#79d19c] hover:bg-[#151d18]"
                  data-home-placement="editorial-priority"
                  data-home-priority={priority.key}
                  data-home-task={priority.task}
                  href={priority.href}
                  key={priority.key}
                  title={t(`priority.${priority.key}.title`)}
                >
                  <span className={`flex size-10 items-center justify-center rounded-[4px] border border-[#344039] bg-[#0d120f] ${priority.tone}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="display-font block text-xl leading-tight text-[#f4f8f5] group-hover:text-[#79d19c]">
                      {t(`priority.${priority.key}.title`)}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[#a9b5af]">
                      {t(`priority.${priority.key}.description`)}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#64726a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
                </Link>
              );
            })}

            <div className="rounded-[6px] border border-[#344039] bg-[#111713] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
                <Route aria-hidden="true" className="size-4" />
                {t("pathsTitle")}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {playerPaths.map((path) => (
                  <li key={path.key}>
                    <Link
                      className="group block rounded-[4px] border border-[#2d3933] bg-[#0d120f] px-3 py-3 transition-colors hover:border-[#79d19c] hover:bg-[#151d18]"
                      data-home-placement="editorial-path"
                      data-home-task={path.task}
                      href={path.href}
                      title={t(`paths.${path.key}.title`)}
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{t(`paths.${path.key}.label`)}</span>
                      <span className="mt-1 flex items-center justify-between gap-2 text-sm font-semibold leading-5 text-[#dce4df] group-hover:text-[#79d19c]">
                        {t(`paths.${path.key}.title`)}
                        <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {sponsoredSlot ? (
              <aside className="rounded-[6px] border border-[#344039] bg-[#101512] p-3" data-home-sponsored-slot="true">
                {sponsoredSlot}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
