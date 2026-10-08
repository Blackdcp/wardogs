"use client";

import {Copy} from "lucide-react";
import {useMemo, useState, useSyncExternalStore} from "react";
import {createToolResultRecorder} from "@/lib/analytics-events";
import {hasSharedToolState, markToolShare} from "@/features/tools/tool-analytics";
import {getWorkflowCopy} from "@/features/tools/workflow-copy";
import {useToolAnalytics} from "./use-tool-analytics";
import {
  calculateCashXpPlan,
  decodeCashXpPlan,
  defaultCashXpPlan,
  encodeCashXpPlan,
  normalizeCashXpPlan,
  type CashXpPlan,
} from "@/features/tools/cash-xp-calculator";

type CopyText = {
  eyebrow: string;
  title: string;
  description: string;
  observed: string;
  count: string;
  cashPerAction: string;
  xpPerAction: string;
  cashMultiplier: string;
  xpMultiplier: string;
  repeatEfficiency: string;
  kitCost: string;
  vehicleCost: string;
  targetCash: string;
  targetXp: string;
  grossCash: string;
  grossXp: string;
  cost: string;
  netCash: string;
  cashGap: string;
  xpGap: string;
  breakEven: string;
  share: string;
  copied: string;
  warning: string;
};

const copyByLocale: Record<string, CopyText> = {
  en: {
    eyebrow: "Observed reward planner",
    title: "Cash & XP Calculator",
    description: "Enter rewards from your current client. The tool estimates a route; it does not publish official payout tables.",
    observed: "Current-client inputs",
    count: "Actions completed",
    cashPerAction: "Cash per action",
    xpPerAction: "XP per action",
    cashMultiplier: "Cash multiplier",
    xpMultiplier: "XP multiplier",
    repeatEfficiency: "Repeat efficiency (%)",
    kitCost: "Kit replacement cost",
    vehicleCost: "Vehicle / team cost",
    targetCash: "Target net cash",
    targetXp: "Target XP",
    grossCash: "Gross cash",
    grossXp: "Gross XP",
    cost: "Planned cost",
    netCash: "Net cash",
    cashGap: "Cash gap",
    xpGap: "XP gap",
    breakEven: "Break-even actions",
    share: "Copy calculator link",
    copied: "Link copied",
    warning: "Use observed live values. Patch notes, server rules, Hot Zone state and exploit fixes can change rewards.",
  },
  "zh-cn": {
    eyebrow: "当前版本收益规划",
    title: "金钱与 XP 计算器",
    description: "输入你当前客户端看到的奖励，本工具只做路线估算，不发布未经确认的官方固定奖励表。",
    observed: "当前客户端输入",
    count: "完成次数",
    cashPerAction: "每次金钱",
    xpPerAction: "每次 XP",
    cashMultiplier: "金钱倍率",
    xpMultiplier: "XP 倍率",
    repeatEfficiency: "重复效率 (%)",
    kitCost: "配装补购成本",
    vehicleCost: "载具 / 团队成本",
    targetCash: "目标净现金",
    targetXp: "目标 XP",
    grossCash: "总现金",
    grossXp: "总 XP",
    cost: "计划成本",
    netCash: "净现金",
    cashGap: "现金差额",
    xpGap: "XP 差额",
    breakEven: "回本次数",
    share: "复制计算器链接",
    copied: "链接已复制",
    warning: "请使用当前游戏内观察值。补丁、服务器规则、Hot Zone 状态和反漏洞修复都可能改变奖励。",
  },
  "zh-tw": {
    eyebrow: "當前版本收益規劃",
    title: "金錢與 XP 計算器",
    description: "輸入你當前客戶端看到的獎勵，本工具只做路線估算，不發布未經確認的官方固定獎勵表。",
    observed: "當前客戶端輸入",
    count: "完成次數",
    cashPerAction: "每次金錢",
    xpPerAction: "每次 XP",
    cashMultiplier: "金錢倍率",
    xpMultiplier: "XP 倍率",
    repeatEfficiency: "重複效率 (%)",
    kitCost: "配裝補購成本",
    vehicleCost: "載具 / 團隊成本",
    targetCash: "目標淨現金",
    targetXp: "目標 XP",
    grossCash: "總現金",
    grossXp: "總 XP",
    cost: "計畫成本",
    netCash: "淨現金",
    cashGap: "現金差額",
    xpGap: "XP 差額",
    breakEven: "回本次數",
    share: "複製計算器連結",
    copied: "連結已複製",
    warning: "請使用當前遊戲內觀察值。補丁、伺服器規則、Hot Zone 狀態和反漏洞修復都可能改變獎勵。",
  },
};

const fallbackCopy = copyByLocale.en;
const emptySearch = () => "";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function formatValue(value: number) {
  return new Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(value);
}

function NumberField({label, value, min = 0, max = 1_000_000, step = 1, onChange}: {label: string; value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#cbd5cf]">
      {label}
      <input
        className="min-h-11 w-full border border-[#46534d] bg-[#0c100e] px-3 text-white"
        inputMode="decimal"
        max={max}
        min={min}
        step={step}
        type="number"
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function CashXpCalculator({locale}: {locale: string}) {
  const text = copyByLocale[locale] ?? fallbackCopy;
  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, emptySearch);
  const sharedState = useMemo(() => search ? decodeCashXpPlan(search) : defaultCashXpPlan, [search]);
  const analytics = useToolAnalytics("cash-xp-calculator", locale, hasSharedToolState(search, encodeCashXpPlan(sharedState), Object.keys(defaultCashXpPlan), "cash-xp-calculator"));
  const [editedState, setEditedState] = useState<CashXpPlan | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);
  const state = editedState ?? sharedState;
  const result = calculateCashXpPlan(state);

  const resultRecorder = useMemo(() => createToolResultRecorder("cash-xp-calculator", locale), [locale]);

  function commit(next: Partial<CashXpPlan>) {
    analytics.engage();
    const normalized = normalizeCashXpPlan({...state, ...next});
    resultRecorder(calculateCashXpPlan(normalized).netCash < 0 ? "cash_negative" : "cash_positive");
    setEditedState(normalized);
    setCopied(false);
    setShareError(false);
    const url = new URL(window.location.href);
    url.search = encodeCashXpPlan(normalized);
    window.history.replaceState(null, "", url);
  }

  async function copyLink() {
    analytics.beginShare();
    const url = new URL(window.location.href);
    url.search = encodeCashXpPlan(state);
    markToolShare(url, "cash-xp-calculator");
    window.history.replaceState(null, "", url);
    setCopied(false);
    setShareError(false);
    try {
      await navigator.clipboard.writeText(url.toString());
      analytics.shareCopied();
      setCopied(true);
    } catch { setShareError(true); }
  }

  const stats = [
    [text.grossCash, result.grossCash],
    [text.grossXp, result.grossXp],
    [text.cost, result.cost],
    [text.netCash, result.netCash],
    [text.cashGap, result.cashGap],
    [text.xpGap, result.xpGap],
    [text.breakEven, result.breakEvenActions ?? 0],
  ] as const;

  return (
    <section className="border-y border-[#354039] bg-[#111512]" aria-label={text.title}>
      {shareError ? <p role="status" className="px-5 py-3 text-sm text-[#e4c35f]">{getWorkflowCopy(locale).shareFailed}</p> : null}
      <div className="border-b border-[#354039] px-5 py-4 md:px-8">
        <p className="text-xs font-semibold uppercase text-[#69c78f]">{text.eyebrow}</p>
        <h2 className="display-font mt-2 text-2xl text-white">{text.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a8b4ae]">{text.description}</p>
      </div>
      <div className="grid gap-8 p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.75fr)] md:p-8">
        <div>
          <h3 className="text-sm font-semibold uppercase text-[#d9b455]">{text.observed}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <NumberField label={text.count} value={state.count} min={1} max={1000} onChange={(value) => commit({count: value})} />
            <NumberField label={text.repeatEfficiency} value={state.repeatEfficiency} min={1} max={100} onChange={(value) => commit({repeatEfficiency: value})} />
            <NumberField label={text.cashPerAction} value={state.cashPerAction} onChange={(value) => commit({cashPerAction: value})} />
            <NumberField label={text.xpPerAction} value={state.xpPerAction} onChange={(value) => commit({xpPerAction: value})} />
            <NumberField label={text.cashMultiplier} value={state.cashMultiplier} min={0.1} max={3} step={0.1} onChange={(value) => commit({cashMultiplier: value})} />
            <NumberField label={text.xpMultiplier} value={state.xpMultiplier} min={0.1} max={3} step={0.1} onChange={(value) => commit({xpMultiplier: value})} />
            <NumberField label={text.kitCost} value={state.kitCost} onChange={(value) => commit({kitCost: value})} />
            <NumberField label={text.vehicleCost} value={state.vehicleCost} onChange={(value) => commit({vehicleCost: value})} />
            <NumberField label={text.targetCash} value={state.targetCash} onChange={(value) => commit({targetCash: value})} />
            <NumberField label={text.targetXp} value={state.targetXp} onChange={(value) => commit({targetXp: value})} />
          </div>
          <p className="mt-4 border-l-2 border-[#d9b455] pl-3 text-xs leading-5 text-[#d7bd68]">{text.warning}</p>
        </div>
        <div className="border border-[#354039] bg-[#0c100e] p-5">
          <div className="grid gap-3">
            {stats.map(([label, value]) => (
              <div className="flex items-center justify-between gap-4 border-b border-[#24302a] pb-3" key={label}>
                <span className="text-sm text-[#a8b4ae]">{label}</span>
                <span className="font-mono text-lg font-bold text-white">{formatValue(value)}</span>
              </div>
            ))}
          </div>
          <button className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#397b59] bg-[#397b59] px-4 text-sm font-semibold text-white hover:bg-[#45946c]" onClick={copyLink} type="button">
            <Copy aria-hidden="true" size={16} />{copied ? text.copied : text.share}
          </button>
        </div>
      </div>
    </section>
  );
}
