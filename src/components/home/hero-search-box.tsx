"use client";

import {Flame} from "lucide-react";
import type {Locale} from "@/config/site";
import {SiteSearchDialog} from "@/components/layout/site-search-dialog";

type HeroSearchBoxProps = {
  locale?: Locale;
  placeholder?: string;
  hotTagsLabel?: string;
};

const hotTagsData: Record<string, {tag: string; href: string; title: string}[]> = {
  "zh-cn": [
    {tag: "WD-L020报错", href: "/zh-cn/guides/wardogs-crash-fix", title: "WD-L020 报错与闪退修复"},
    {tag: "S2删档清零", href: "/zh-cn/guides/wardogs-season-2", title: "S2 赛季重置政策与待公布细节"},
    {tag: "Ural运货", href: "/zh-cn/guides/wardogs-cargo-guide", title: "乌拉尔双托盘运货装载指南"},
    {tag: "M4配装", href: "/zh-cn/guides/wardogs-best-weapons-loadouts", title: "M4 突击步枪配装推荐"},
    {tag: "迫击炮密位", href: "/zh-cn/tools/artillery-calculator", title: "火炮与迫击炮计算器"}
  ],
  "zh-tw": [
    {tag: "WD-L020報錯", href: "/zh-tw/guides/wardogs-crash-fix", title: "WD-L020 報錯與崩潰修復"},
    {tag: "S2刪檔清零", href: "/zh-tw/guides/wardogs-season-2", title: "S2 賽季重置政策與待公布細節"},
    {tag: "Ural運貨", href: "/zh-tw/guides/wardogs-cargo-guide", title: "烏拉爾雙托盤運貨裝載指南"},
    {tag: "M4配裝", href: "/zh-tw/guides/wardogs-best-weapons-loadouts", title: "M4 突擊步槍配裝推薦"},
    {tag: "迫擊砲密位", href: "/zh-tw/tools/artillery-calculator", title: "火砲與迫擊砲計算器"}
  ],
  en: [
    {tag: "WD-L020 Fix", href: "/en/guides/wardogs-crash-fix", title: "WD-L020 Crash & Launch Fix"},
    {tag: "S2 Wipe Matrix", href: "/en/guides/wardogs-season-2", title: "Season 2 Reset Policy and Unconfirmed Details"},
    {tag: "Ural Cargo SOP", href: "/en/guides/wardogs-cargo-guide", title: "Ural 2-Pallet Logistics Guide"},
    {tag: "M4 Loadout", href: "/en/guides/wardogs-best-weapons-loadouts", title: "M4 Assault Rifle Loadout"},
    {tag: "Mortar Calculator", href: "/en/tools/artillery-calculator", title: "Artillery & Mortar Ballistics Calculator"}
  ],
  ru: [
    {tag: "WD-L020 фикс", href: "/ru/guides/wardogs-crash-fix", title: "Исправление ошибки WD-L020"},
    {tag: "S2 Вайп", href: "/ru/guides/wardogs-season-2", title: "Правила сброса сезона 2 и неподтверждённые детали"},
    {tag: "Урал Логистика", href: "/ru/guides/wardogs-cargo-guide", title: "Гайд по перевозке грузов на Урале"},
    {tag: "Сборка M4", href: "/ru/guides/wardogs-best-weapons-loadouts", title: "Лучший билд на автомат M4"},
    {tag: "Калькулятор миномета", href: "/ru/tools/artillery-calculator", title: "Калькулятор артиллерии и минометов"}
  ],
  de: [
    {tag: "WD-L020 Fix", href: "/de/guides/wardogs-crash-fix", title: "WD-L020 Absturz- & Start-Fix"},
    {tag: "S2 Wipe-Matrix", href: "/de/guides/wardogs-season-2", title: "Reset-Regeln für Saison 2 und unbestätigte Details"},
    {tag: "Ural Fracht SOP", href: "/de/guides/wardogs-cargo-guide", title: "Ural 2-Paletten Logistik-Leitfaden"},
    {tag: "M4 Loadout", href: "/de/guides/wardogs-best-weapons-loadouts", title: "M4 Sturmgewehr Ausrüstung"},
    {tag: "Mörser-Rechner", href: "/de/tools/artillery-calculator", title: "Artillerie- und Mörser-Rechner"}
  ],
  ja: [
    {tag: "WD-L020対策", href: "/ja/guides/wardogs-crash-fix", title: "WD-L020 起動エラー・クラッシュ対策"},
    {tag: "S2ワイプ情報", href: "/ja/guides/wardogs-season-2", title: "シーズン2のリセット方針と未発表の詳細"},
    {tag: "ウラル輸送SOP", href: "/ja/guides/wardogs-cargo-guide", title: "ウラル2パレット輸送ガイド"},
    {tag: "M4カスタム", href: "/ja/guides/wardogs-best-weapons-loadouts", title: "M4 アサルトライフル推奨カスタム"},
    {tag: "迫撃砲計算機", href: "/ja/tools/artillery-calculator", title: "迫撃砲・曲射砲弾道計算機"}
  ],
  "pt-br": [
    {tag: "WD-L020 Fix", href: "/pt-br/guides/wardogs-crash-fix", title: "Correção de travamento WD-L020"},
    {tag: "S2 Wipe Matriz", href: "/pt-br/guides/wardogs-season-2", title: "Política de reset da Temporada 2 e detalhes não confirmados"},
    {tag: "Ural Carga SOP", href: "/pt-br/guides/wardogs-cargo-guide", title: "Guia de Logística Ural com 2 Paletes"},
    {tag: "M4 Loadout", href: "/pt-br/guides/wardogs-best-weapons-loadouts", title: "Melhor montagem de M4"},
    {tag: "Calculadora Morteiro", href: "/pt-br/tools/artillery-calculator", title: "Calculadora de Artilharia e Morteiro"}
  ],
  pl: [
    {tag: "WD-L020 Błąd", href: "/pl/guides/wardogs-crash-fix", title: "Naprawa błędu WD-L020"},
    {tag: "S2 Wipe Reset", href: "/pl/guides/wardogs-season-2", title: "Zasady resetu sezonu 2 i niepotwierdzone szczegóły"},
    {tag: "Ural Logistyka", href: "/pl/guides/wardogs-cargo-guide", title: "Przewodnik załadunku ciężarówki Ural"},
    {tag: "Zestaw M4", href: "/pl/guides/wardogs-best-weapons-loadouts", title: "Polecany zestaw karabinka M4"},
    {tag: "Kalkulator moździerzy", href: "/pl/tools/artillery-calculator", title: "Kalkulator artylerii i moździerzy"}
  ]
};

export function HeroSearchBox({locale = "en", placeholder, hotTagsLabel = "HOT"}: HeroSearchBoxProps) {
  const tags = hotTagsData[locale] ?? hotTagsData.en;

  return (
    <div className="mt-7 w-full max-w-xl text-left" data-hero-search-box="true">
      <SiteSearchDialog
        placeholder={placeholder || "Search weapons, error codes, wipe dates, controls..."}
        source="hero"
        trigger="hero"
      />

      <div className="-mx-2 mt-3 flex items-center gap-2 overflow-x-auto px-2 pb-1 text-xs sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0" data-hero-trending="true">
        <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#9daaa3]">
          <Flame aria-hidden="true" className="size-3 text-[#d9a93a]" />
          {hotTagsLabel}
        </span>
        {tags.map((item) => (
          <a
            key={item.href}
            href={item.href}
            title={item.title}
            className="shrink-0 rounded-full border border-[#2b3831] bg-[#0e1511]/80 px-2.5 py-1 text-[11px] font-semibold text-[#a8d8ba] transition-colors hover:border-[#5b8f6a] hover:bg-[#17251d] hover:text-white"
          >
            {item.tag}
          </a>
        ))}
      </div>
    </div>
  );
}
