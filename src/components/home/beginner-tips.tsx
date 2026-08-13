import type {LucideIcon} from "lucide-react";
import {Coins, Crosshair, Map, Users} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {BEGINNER_TIP_KEYS} from "@/features/home/home-data";

const tipIcons: Record<(typeof BEGINNER_TIP_KEYS)[number], LucideIcon> = {
  objective: Crosshair,
  economy: Coins,
  support: Users,
  mobility: Map
};

export async function BeginnerTips() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="beginner-tips-title" className="border-b border-[#26312c] bg-[#151b18] py-16 sm:py-20">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[#69c78f]">{t("home.tips.eyebrow")}</p>
          <h2 id="beginner-tips-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.tips.title")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.tips.description")}</p>
        </div>

        <ol className="mt-9 grid gap-x-10 md:grid-cols-2">
          {BEGINNER_TIP_KEYS.map((key, index) => {
            const Icon = tipIcons[key];
            return (
              <li key={key} className="grid min-h-[170px] grid-cols-[44px_minmax(0,1fr)] gap-4 border-t border-[#344039] py-6">
                <span className="display-font text-sm text-[#d9a93a]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <Icon aria-hidden="true" className="size-5 text-[#69c78f]" />
                  <h3 className="display-font mt-4 text-xl leading-tight text-[#eef3f0]">{t(`home.tips.items.${key}.title`)}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#9fada6]">{t(`home.tips.items.${key}.description`)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
