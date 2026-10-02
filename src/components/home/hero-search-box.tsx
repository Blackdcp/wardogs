import {Flame, Search} from "lucide-react";
import type {Locale} from "@/config/site";

type HeroSearchBoxProps = {
  locale?: Locale;
  placeholder?: string;
  hotTagsLabel?: string;
};

const hotTagsData: Record<string, {tag: string; href: string; title: string}[]> = {
  "zh-cn": [
    {tag: "WD-L020报错", href: "/zh-cn/guides/wardogs-crash-fix", title: "WD-L020 报错与闪退修复"},
    {tag: "S2删档清零", href: "/zh-cn/guides/wardogs-season-2", title: "S2 赛季删档与资产对冲"},
    {tag: "Ural运货", href: "/zh-cn/guides/wardogs-cargo-guide", title: "乌拉尔双托盘运货装载指南"},
    {tag: "M4配装", href: "/zh-cn/guides/wardogs-best-weapons-loadouts", title: "M4 突击步枪配装推荐"},
    {tag: "迫击炮密位", href: "/zh-cn/tools/map", title: "迫击炮与火炮密位射表"}
  ],
  "zh-tw": [
    {tag: "WD-L020報錯", href: "/zh-tw/guides/wardogs-crash-fix", title: "WD-L020 報錯與崩潰修復"},
    {tag: "S2刪檔清零", href: "/zh-tw/guides/wardogs-season-2", title: "S2 賽季刪檔與資產對沖"},
    {tag: "Ural運貨", href: "/zh-tw/guides/wardogs-cargo-guide", title: "烏拉爾雙托盤運貨裝載指南"},
    {tag: "M4配裝", href: "/zh-tw/guides/wardogs-best-weapons-loadouts", title: "M4 突擊步槍配裝推薦"},
    {tag: "迫擊砲密位", href: "/zh-tw/tools/map", title: "迫擊砲與火砲密位射表"}
  ],
  en: [
    {tag: "WD-L020 Fix", href: "/en/guides/wardogs-crash-fix", title: "WD-L020 Crash & Launch Fix"},
    {tag: "S2 Wipe Matrix", href: "/en/guides/wardogs-season-2", title: "Season 2 Wipe & Capital Hedge"},
    {tag: "Ural Cargo SOP", href: "/en/guides/wardogs-cargo-guide", title: "Ural 2-Pallet Logistics Guide"},
    {tag: "M4 Loadout", href: "/en/guides/wardogs-best-weapons-loadouts", title: "M4 Assault Rifle Loadout"},
    {tag: "Mortar Mils", href: "/en/tools/map", title: "Mortar & Artillery Ballistics Mil Tables"}
  ]
};

export function HeroSearchBox({locale = "en", placeholder, hotTagsLabel = "HOT"}: HeroSearchBoxProps) {
  const tags = hotTagsData[locale] ?? hotTagsData.en;
  const isZh = locale === "zh-cn" || locale === "zh-tw";

  return (
    <div className="mt-7 w-full max-w-2xl text-left" data-hero-search-box="true">
      {/* High-visibility Tactical Search Trigger leading to Search Hub */}
      <a
        href="#site-search-title"
        title={placeholder || "Search WARDOGS database"}
        className="group relative flex w-full items-center justify-between rounded-lg border border-[#3f5746] bg-[#111713]/90 px-4 py-3 shadow-xl transition-all hover:border-[#69c78f] hover:bg-[#15201a]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Search aria-hidden="true" className="size-5 shrink-0 text-[#79d19c] transition-colors group-hover:text-white" />
          <span className="truncate text-xs text-[#91a098] group-hover:text-[#d5ddd8] sm:text-sm">
            {placeholder || "Search weapons, error codes, wipe dates, controls..."}
          </span>
        </div>
        <span className="hidden shrink-0 rounded border border-[#304538] bg-[#18231c] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#8ce2ad] group-hover:border-[#4d6a56] group-hover:text-white sm:inline-block">
          {isZh ? "点击全库检索" : "Quick Search"}
        </span>
      </a>

      {/* 5 免打字热搜标签 */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#d9a93a]">
          <Flame aria-hidden="true" className="size-3.5 text-[#f08c35]" />
          {hotTagsLabel}:
        </span>
        {tags.map((item) => (
          <a
            key={item.href}
            href={item.href}
            title={item.title}
            className="rounded border border-[#304538] bg-[#141e18]/90 px-2.5 py-1 text-xs font-medium text-[#8ce2ad] transition-colors hover:border-[#69c78f] hover:bg-[#1a2c22] hover:text-white"
          >
            [{item.tag}]
          </a>
        ))}
      </div>
    </div>
  );
}
