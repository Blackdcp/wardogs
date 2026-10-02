import {ArrowUpRight, Boxes, Crosshair, DollarSign, Hourglass, Keyboard, ListChecks, type LucideIcon, Map, Play, Radio, Truck, Wrench} from "lucide-react";
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
  tacticalCards?: readonly {
    title: string;
    description: string;
    badge: string;
    href: string;
    cta: string;
    icon: LucideIcon;
    accent: string;
  }[];
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

const defaultTacticalCards = [
  {
    title: "战术交互地图",
    description: "256km² 高清底图、迫击炮与重炮密位射表及点位测距",
    badge: "HD 2048px",
    href: "/tools/map",
    cta: "立即调取",
    icon: Map,
    accent: "text-[#69c78f]"
  },
  {
    title: "武器载具图鉴",
    description: "11大类装备库、枪械伤害属性与出战预算精算",
    badge: "11 大类",
    href: "/items",
    cta: "查验图鉴",
    icon: Crosshair,
    accent: "text-[#ef8585]"
  },
  {
    title: "实时服务监控",
    description: "官方停机维护动态、匹配队列监测与跨区延迟雷达",
    badge: "Live Radar",
    href: "/guides/wardogs-server-status",
    cta: "查看状态",
    icon: Radio,
    accent: "text-[#7bb7e8]"
  },
  {
    title: "第二赛季删档",
    description: "赛季清零规则矩阵、12 天避险策略与现金兑换率",
    badge: "S2 Wipe",
    href: "/guides/wardogs-season-2",
    cta: "查看应对",
    icon: Hourglass,
    accent: "text-[#f0be55]"
  }
] as const;

export function HomeActionHubView({eyebrow, title, description, actions, LinkComponent = NativeLink, tacticalCards = defaultTacticalCards}: HomeActionHubViewProps) {
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

        {/* 四大战术中枢大卡 (Four Primary Strategic Tactical Hub Cards) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tactical-cards="true">
          {tacticalCards.map((card) => {
            const Icon = card.icon;
            return (
              <LinkComponent
                key={card.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[#30543e] bg-gradient-to-b from-[#14231b] to-[#0c1410] p-5 shadow-lg transition-all hover:border-[#69c78f] hover:shadow-[0_0_20px_rgba(76,217,136,0.15)]"
                href={card.href}
                title={card.title}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-md border border-[#3b684c] bg-[#1a3326] ${card.accent}`}>
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <span className="rounded bg-[#203a2b] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#8ce2ad]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="display-font mt-4 text-lg font-bold text-white group-hover:text-[#69c78f]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#a3afa9]">
                    {card.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#8ce2ad] group-hover:text-white">
                  <span>{card.cta}</span>
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </LinkComponent>
            );
          })}
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
