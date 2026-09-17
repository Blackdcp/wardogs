import {ArrowUpRight, Boxes, Crosshair, DollarSign, Keyboard, ListChecks, Play, Truck, Wrench} from "lucide-react";
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

type ActionLinkComponent = ComponentType<{className: string; href: string; title: string; children: ReactNode}>;

type HomeActionHubViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: readonly HomeActionHubEntry[];
  LinkComponent?: ActionLinkComponent;
};

const actionPresentation = {
  firstMatch: {icon: Play, accent: "text-[#87e0a6]"},
  money: {icon: DollarSign, accent: "text-[#f0be55]"},
  progression: {icon: ListChecks, accent: "text-[#7bb7e8]"},
  weapons: {icon: Crosshair, accent: "text-[#ef8585]"},
  logistics: {icon: Boxes, accent: "text-[#87e0a6]"},
  vehicles: {icon: Truck, accent: "text-[#f0be55]"},
  controls: {icon: Keyboard, accent: "text-[#7bb7e8]"},
  pcFixes: {icon: Wrench, accent: "text-[#ef8585]"}
} as const;

function NativeLink({children, ...props}: {className: string; href: string; title: string; children: ReactNode}) {
  return <a {...props}>{children}</a>;
}

export function HomeActionHubView({eyebrow, title, description, actions, LinkComponent = NativeLink}: HomeActionHubViewProps) {
  return (
    <section aria-labelledby="home-action-title" className="border-b border-[#2b3530] bg-[#0b0e0c] py-12 sm:py-14" data-home-action-hub="true">
      <div className="site-container">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#79d19c]">{eyebrow}</p>
            <h2 id="home-action-title" className="display-font mt-3 max-w-xl text-3xl leading-tight text-white sm:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#a9b5af] sm:text-base lg:justify-self-end">{description}</p>
        </div>

        <ul className="mt-8 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const presentation = actionPresentation[action.key];
            const Icon = presentation.icon;
            return (
              <li className="min-w-0" data-home-action={action.key} key={action.key}>
                <LinkComponent
                  className="group flex min-h-[150px] flex-col border-t border-[#3a473f] py-5 outline-none hover:border-[#79d19c] focus-visible:ring-2 focus-visible:ring-[#79d19c]"
                  href={action.href}
                  title={action.title}
                >
                  <span className="flex items-start justify-between gap-4">
                    <Icon aria-hidden="true" className={`size-6 ${presentation.accent}`} />
                    <ArrowUpRight aria-hidden="true" className="size-5 text-[#7e8d85] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </span>
                  <span className="display-font mt-5 block text-xl leading-tight text-white group-hover:text-[#79d19c]">{action.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#a3afa9]">{action.description}</span>
                </LinkComponent>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export async function HomeActionHub() {
  const t = await getTranslations("home.actions");
  const {Link} = await import("@/i18n/navigation");
  const actions: HomeActionHubEntry[] = HOME_ACTIONS.map((action) => ({
    ...action,
    title: t(`${action.key}.title`),
    description: t(`${action.key}.description`)
  }));

  const LocalizedLink: ActionLinkComponent = ({children, href, className, title}) => (
    <Link aria-label={title} className={className} href={href} title={title}>{children}</Link>
  );

  return (
    <HomeActionHubView
      actions={actions}
      description={t("description")}
      eyebrow={t("eyebrow")}
      LinkComponent={LocalizedLink}
      title={t("title")}
    />
  );
}
