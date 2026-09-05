import Image from "next/image";
import {ArrowUpRight, Crosshair, MonitorCog, Play, Wrench} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {ComponentType, ReactNode} from "react";
import {HOME_ACTIONS} from "@/features/home/home-data";
import {assetPath} from "@/lib/assets";

type HomeActionKey = (typeof HOME_ACTIONS)[number]["key"];

export type HomeActionHubEntry = {
  key: HomeActionKey;
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
};

type ActionLinkComponent = ComponentType<{className: string; href: string; children: ReactNode}>;

type HomeActionHubViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: readonly HomeActionHubEntry[];
  LinkComponent?: ActionLinkComponent;
};

const actionPresentation = {
  play: {icon: Play, accent: "text-[#87e0a6]", border: "group-hover:border-[#4d946d]"},
  fix: {icon: Wrench, accent: "text-[#f0be55]", border: "group-hover:border-[#95763b]"},
  gear: {icon: Crosshair, accent: "text-[#7bb7e8]", border: "group-hover:border-[#4e7696]"},
  system: {icon: MonitorCog, accent: "text-[#ef8585]", border: "group-hover:border-[#8f4f4f]"}
} as const;

function NativeLink({children, ...props}: {className: string; href: string; children: ReactNode}) {
  return <a {...props}>{children}</a>;
}

export function HomeActionHubView({eyebrow, title, description, actions, LinkComponent = NativeLink}: HomeActionHubViewProps) {
  return (
    <section aria-labelledby="home-action-title" className="border-b border-[#2b3530] bg-[#0b0e0c] py-14 sm:py-18" data-home-action-hub="true">
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

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const presentation = actionPresentation[action.key];
            const Icon = presentation.icon;
            return (
              <li className="min-w-0" data-home-action={action.key} key={action.key}>
                <LinkComponent
                  className={`group flex h-full min-h-[318px] flex-col overflow-hidden rounded-[7px] border border-[#303b35] bg-[#141a17] transition-colors ${presentation.border}`}
                  href={action.href}
                >
                  <span className="relative block aspect-[16/9] overflow-hidden bg-[#080a09]">
                    <Image
                      alt={action.imageAlt}
                      className="object-cover opacity-80 transition duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
                      fill
                      sizes="(min-width: 1280px) 290px, (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
                      src={assetPath(action.image)}
                    />
                    <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/5" />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="flex items-start justify-between gap-4">
                      <Icon aria-hidden="true" className={`size-6 ${presentation.accent}`} />
                      <ArrowUpRight aria-hidden="true" className="size-5 text-[#7e8d85] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </span>
                    <span className="display-font mt-6 block text-2xl leading-tight text-white">{action.title}</span>
                    <span className="mt-3 block text-sm leading-6 text-[#a3afa9]">{action.description}</span>
                  </span>
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
    description: t(`${action.key}.description`),
    imageAlt: t(`${action.key}.imageAlt`)
  }));

  const LocalizedLink: ActionLinkComponent = ({children, href, className}) => (
    <Link className={className} href={href}>{children}</Link>
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
