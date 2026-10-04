import {ArrowUpRight, Crosshair, DollarSign, Hourglass, Map, Play, Wrench, type LucideIcon} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {ComponentType, ReactNode} from "react";
import {HOME_ACTIONS} from "@/features/home/home-data";

type HomeActionKey = (typeof HOME_ACTIONS)[number]["key"];

export type HomeActionHubEntry = {
  key: HomeActionKey;
  href: string;
  title: string;
  description: string;
};

type ActionLinkProps = {className: string; href: string; title: string; children: ReactNode; "data-home-task"?: string; "data-home-placement"?: string};
type ActionLinkComponent = ComponentType<ActionLinkProps>;

type HomeActionHubViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: readonly HomeActionHubEntry[];
  LinkComponent?: ActionLinkComponent;
  sponsoredSlot?: ReactNode;
  ctaLabel?: string;
};

type ActionPresentation = {
  icon: LucideIcon;
  accent: string;
  label: string;
};

const actionPresentation: Record<HomeActionKey, ActionPresentation> = {
  firstMatch: {icon: Play, accent: "text-[#87e0a6]", label: "Start"},
  map: {icon: Map, accent: "text-[#69c78f]", label: "Tool"},
  money: {icon: DollarSign, accent: "text-[#f0be55]", label: "Route"},
  weapons: {icon: Crosshair, accent: "text-[#ef8585]", label: "Build"},
  pcFixes: {icon: Wrench, accent: "text-[#7bb7e8]", label: "Fix"},
  season2: {icon: Hourglass, accent: "text-[#d9a93a]", label: "Live"}
};

function HomeActionCard({action, index, LinkComponent, ctaLabel}: {action: HomeActionHubEntry; index: number; LinkComponent: ActionLinkComponent; ctaLabel: string}) {
  const presentation = actionPresentation[action.key];
  const Icon = presentation.icon;

  return (
    <li className="min-w-0" data-home-action={action.key}>
      <LinkComponent
        className="group flex min-h-[176px] flex-col justify-between rounded-[6px] border border-[#344039] bg-[#111613] p-5 outline-none transition-colors hover:border-[#79d19c] hover:bg-[#151d18] focus-visible:ring-2 focus-visible:ring-[#79d19c]"
        href={action.href}
        title={action.title}
        data-home-task={action.key}
        data-home-placement="action-hub"
      >
        <span className="flex items-start justify-between gap-4">
          <span className={`flex size-10 items-center justify-center rounded-[4px] border border-[#3a473f] bg-[#0d120f] ${presentation.accent}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{String(index + 1).padStart(2, "0")} · {presentation.label}</span>
        </span>
        <span>
          <span className="display-font mt-5 block text-xl leading-tight text-white group-hover:text-[#79d19c]">{action.title}</span>
          <span className="mt-2 block text-sm leading-6 text-[#a3afa9]">{action.description}</span>
        </span>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#79d19c] group-hover:text-white">
          <span>{ctaLabel}</span>
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </LinkComponent>
    </li>
  );
}

function NativeLink({children, ...props}: ActionLinkProps) {
  return <a {...props}>{children}</a>;
}

export function HomeActionHubView({eyebrow, title, description, actions, LinkComponent = NativeLink, sponsoredSlot, ctaLabel = "Open"}: HomeActionHubViewProps) {
  return (
    <section aria-labelledby="home-action-title" className="border-b border-[#2b3530] bg-[#0b0e0c] py-12 sm:py-14" data-home-action-hub="true">
      <div className="site-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#79d19c]">{eyebrow}</p>
            <h2 id="home-action-title" className="display-font mt-3 max-w-xl text-3xl leading-tight text-white sm:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#a9b5af] sm:text-base lg:justify-self-end">{description}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-6">
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:col-start-1 lg:row-start-1">
            {actions.slice(0, 3).map((action, index) => (
              <HomeActionCard
                action={action}
                index={index}
                key={action.key}
                LinkComponent={LinkComponent}
                ctaLabel={ctaLabel}
              />
            ))}
          </ul>

          {sponsoredSlot ? (
            <aside className="rounded-[6px] border border-[#344039] bg-[#101512] p-3 lg:col-start-2 lg:row-span-2 lg:row-start-1" data-home-sponsored-slot="true">
              {sponsoredSlot}
            </aside>
          ) : null}

          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:col-start-1 lg:row-start-2">
            {actions.slice(3).map((action, index) => (
              <HomeActionCard
                action={action}
                index={index + 3}
                key={action.key}
                LinkComponent={LinkComponent}
                ctaLabel={ctaLabel}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function HomeActionHub({sponsoredSlot}: {sponsoredSlot?: ReactNode} = {}) {
  const t = await getTranslations("home.actions");
  const {Link} = await import("@/i18n/navigation");
  const actions: HomeActionHubEntry[] = HOME_ACTIONS.map((action) => ({
    ...action,
    title: t(`${action.key}.title`),
    description: t(`${action.key}.description`)
  }));

  const LocalizedLink: ActionLinkComponent = ({children, title, ...props}) => (
    <Link aria-label={title} title={title} {...props}>{children}</Link>
  );

  return (
    <HomeActionHubView
      actions={actions}
      ctaLabel={t("cta")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      LinkComponent={LocalizedLink}
      sponsoredSlot={sponsoredSlot}
      title={t("title")}
    />
  );
}
