"use client";

import type {Locale} from "@/config/site";
import {SiteSearchDialog} from "@/components/layout/site-search-dialog";

type HeroSearchBoxProps = {
  locale?: Locale;
  placeholder?: string;
  hotTagsLabel?: string;
};

const hotTagsData: Record<string, {tag: string; href: string; title: string}[]> = {
  "zh-cn": [
    {tag: "修复 WD-L020", href: "/zh-cn/guides/wardogs-crash-fix", title: "WD-L020 报错与闪退修复"},
    {tag: "第二赛季删档时间", href: "/zh-cn/guides/wardogs-season-2", title: "S2 赛季重置政策与待公布细节"},
    {tag: "乌拉尔运货路线", href: "/zh-cn/guides/wardogs-cargo-guide", title: "乌拉尔双托盘运货装载指南"},
    {tag: "M4 怎么配", href: "/zh-cn/guides/wardogs-best-weapons-loadouts", title: "M4 突击步枪配装推荐"},
    {tag: "迫击炮计算器", href: "/zh-cn/tools/artillery-calculator", title: "火炮与迫击炮计算器"}
  ],
  "zh-tw": [
    {tag: "修復 WD-L020", href: "/zh-tw/guides/wardogs-crash-fix", title: "WD-L020 報錯與崩潰修復"},
    {tag: "第二賽季刪檔時間", href: "/zh-tw/guides/wardogs-season-2", title: "S2 賽季重置政策與待公布細節"},
    {tag: "烏拉爾運貨路線", href: "/zh-tw/guides/wardogs-cargo-guide", title: "烏拉爾雙托盤運貨裝載指南"},
    {tag: "M4 怎麼配", href: "/zh-tw/guides/wardogs-best-weapons-loadouts", title: "M4 突擊步槍配裝推薦"},
    {tag: "迫擊砲計算器", href: "/zh-tw/tools/artillery-calculator", title: "火砲與迫擊砲計算器"}
  ],
  en: [
    {tag: "Fix WD-L020", href: "/en/guides/wardogs-crash-fix", title: "WD-L020 Crash & Launch Fix"},
    {tag: "Season 2 wipe date", href: "/en/guides/wardogs-season-2", title: "Season 2 Reset Policy and Unconfirmed Details"},
    {tag: "Find URAL unlock", href: "/en/guides/wardogs-cargo-guide", title: "Ural 2-Pallet Logistics Guide"},
    {tag: "Build an M4 kit", href: "/en/guides/wardogs-best-weapons-loadouts", title: "M4 Assault Rifle Loadout"},
    {tag: "Mortar range calc", href: "/en/tools/artillery-calculator", title: "Artillery & Mortar Ballistics Calculator"}
  ],
  ru: [
    {tag: "Исправить WD-L020", href: "/ru/guides/wardogs-crash-fix", title: "Исправление ошибки WD-L020"},
    {tag: "Дата вайпа S2", href: "/ru/guides/wardogs-season-2", title: "Правила сброса сезона 2 и неподтверждённые детали"},
    {tag: "Маршрут Урала", href: "/ru/guides/wardogs-cargo-guide", title: "Гайд по перевозке грузов на Урале"},
    {tag: "Собрать M4", href: "/ru/guides/wardogs-best-weapons-loadouts", title: "Лучший билд на автомат M4"},
    {tag: "Расчёт миномёта", href: "/ru/tools/artillery-calculator", title: "Калькулятор артиллерии и минометов"}
  ],
  de: [
    {tag: "Fix WD-L020", href: "/de/guides/wardogs-crash-fix", title: "WD-L020 Absturz- & Start-Fix"},
    {tag: "Season-2-Wipe-Datum", href: "/de/guides/wardogs-season-2", title: "Reset-Regeln für Saison 2 und unbestätigte Details"},
    {tag: "URAL-Fracht finden", href: "/de/guides/wardogs-cargo-guide", title: "Ural 2-Paletten Logistik-Leitfaden"},
    {tag: "M4-Setup bauen", href: "/de/guides/wardogs-best-weapons-loadouts", title: "M4 Sturmgewehr Ausrüstung"},
    {tag: "Mörser berechnen", href: "/de/tools/artillery-calculator", title: "Artillerie- und Mörser-Rechner"}
  ],
  ja: [
    {tag: "WD-L020を直す", href: "/ja/guides/wardogs-crash-fix", title: "WD-L020 起動エラー・クラッシュ対策"},
    {tag: "S2ワイプ日程", href: "/ja/guides/wardogs-season-2", title: "シーズン2のリセット方針と未発表の詳細"},
    {tag: "ウラル輸送ルート", href: "/ja/guides/wardogs-cargo-guide", title: "ウラル2パレット輸送ガイド"},
    {tag: "M4構成を作る", href: "/ja/guides/wardogs-best-weapons-loadouts", title: "M4 アサルトライフル推奨カスタム"},
    {tag: "迫撃砲を計算", href: "/ja/tools/artillery-calculator", title: "迫撃砲・曲射砲弾道計算機"}
  ],
  "pt-br": [
    {tag: "Fix WD-L020", href: "/pt-br/guides/wardogs-crash-fix", title: "Correção de travamento WD-L020"},
    {tag: "Data do wipe S2", href: "/pt-br/guides/wardogs-season-2", title: "Política de reset da Temporada 2 e detalhes não confirmados"},
    {tag: "Rota do Ural", href: "/pt-br/guides/wardogs-cargo-guide", title: "Guia de Logística Ural com 2 Paletes"},
    {tag: "Montar M4", href: "/pt-br/guides/wardogs-best-weapons-loadouts", title: "Melhor montagem de M4"},
    {tag: "Calcular morteiro", href: "/pt-br/tools/artillery-calculator", title: "Calculadora de Artilharia e Morteiro"}
  ],
  pl: [
    {tag: "Napraw WD-L020", href: "/pl/guides/wardogs-crash-fix", title: "Naprawa błędu WD-L020"},
    {tag: "Data wipe S2", href: "/pl/guides/wardogs-season-2", title: "Zasady resetu sezonu 2 i niepotwierdzone szczegóły"},
    {tag: "Trasa Urala", href: "/pl/guides/wardogs-cargo-guide", title: "Przewodnik załadunku ciężarówki Ural"},
    {tag: "Zbuduj M4", href: "/pl/guides/wardogs-best-weapons-loadouts", title: "Polecany zestaw karabinka M4"},
    {tag: "Oblicz moździerz", href: "/pl/tools/artillery-calculator", title: "Kalkulator artylerii i moździerzy"}
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

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-[#aeb9b3]" data-hero-popular-links="true">
        <span className="font-semibold uppercase tracking-wide text-[#7f8e87]">{hotTagsLabel}</span>
        {tags.map((item, index) => (
          <span className="inline-flex items-center gap-2" key={item.href}>
            <a
              href={item.href}
              title={item.title}
              className="font-semibold text-[#bcd8c7] underline decoration-[#35523d] decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-[#69c78f]"
            >
              {item.tag}
            </a>
            {index < tags.length - 1 ? <span aria-hidden="true" className="text-[#46534d]">/</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
