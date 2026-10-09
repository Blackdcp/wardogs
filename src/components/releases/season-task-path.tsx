import type {Locale} from "@/config/site";
import {getReleaseImpactCopy} from "@/features/releases/release-impacts";
import {publicRoutePath} from "@/lib/public-url";
const entryPaths = new Set(["/gold-market", ...["season-2", "progression-wipes-guide", "money-guide", "what-to-buy-before-wipe", "best-weapons-loadouts", "launch-checklist", "server-status", "known-issues"].map(slug => `/guides/wardogs-${slug}`)]);
const labels: Record<Locale, readonly [string, string]> = {
  en: ["Your season update plan", "Solve update-day problems"], de: ["Dein Plan zum Saisonwechsel", "Probleme am Update-Tag lösen"], ru: ["План обновления сезона", "Решить проблемы после обновления"], "pt-br": ["Seu plano para a nova temporada", "Resolver problemas da atualização"], ja: ["シーズン更新の準備順", "更新後の問題を解決"], "zh-cn": ["赛季更新行动顺序", "处理更新后的问题"], "zh-tw": ["賽季更新行動順序", "處理更新後的問題"], pl: ["Twój plan zmiany sezonu", "Rozwiąż problemy po aktualizacji"]
};
export function SeasonTaskPath({locale, path}: {locale: Locale; path: string}) {
  if (!entryPaths.has(path)) return null;
  const copy = getReleaseImpactCopy(locale);
  const steps = ["/guides/wardogs-progression-wipes-guide", "/gold-market", "/tools/loadout-budget", "/guides/wardogs-launch-checklist"];
  return <nav className="mb-6 rounded border border-[#354039] p-4" aria-label={labels[locale][0]} data-season-task-path>
    <p className="text-sm font-semibold text-white">{labels[locale][0]}</p>
    <ol className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#8bd4a6]">{steps.map((href, index) => <li key={href} className="min-h-11 flex items-center gap-2"><span className="text-[#9daea3]" aria-hidden="true">{index + 1}.</span>{href === path ? <span aria-current="page">{copy.links[href] ?? labels[locale][1]}</span> : <a className="py-2 underline underline-offset-4 hover:text-white" href={publicRoutePath(`/${locale}${href}`)} title={copy.links[href] ?? labels[locale][1]}>{copy.links[href] ?? labels[locale][1]}</a>}</li>)}</ol>
  </nav>;
}
