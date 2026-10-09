"use client";
import {useState} from "react";
import type {Locale} from "@/config/site";
import {calculateGoldBudget, goldBudgetFields, type GoldBudgetInput} from "@/features/markets/gold-budget";
import {goldBudgetCalculatorCopy} from "@/features/markets/gold-budget-copy";
const blank: GoldBudgetInput = {target: "", owned: "", cash: "", reserve: "", offerGold: "", offerCash: ""};
export function GoldBudgetCalculator({locale}: {locale: Locale}) {
  const c = goldBudgetCalculatorCopy[locale];
  const [input, setInput] = useState(blank);
  const [result, setResult] = useState<ReturnType<typeof calculateGoldBudget> | null>(null);
  const format = new Intl.NumberFormat(locale, {maximumFractionDigits: 2});
  return <div className="mt-6 rounded-lg border border-[#465149] bg-[#141c17] p-4 sm:p-6" data-gold-budget-calculator>
    <h3 className="display-font text-2xl text-white">{c.title}</h3>
    <p className="mt-3 text-sm leading-7 text-[#b6c2ba]" id="gold-calculator-help">{c.help}</p>
    <form className="mt-5" noValidate aria-describedby="gold-calculator-help" onSubmit={event => {event.preventDefault(); setResult(calculateGoldBudget(input));}}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{goldBudgetFields.map(key => <label className="min-w-0 text-sm text-[#c3cec6]" key={key}>
        <span className="mb-2 block">{c.fields[key]}</span>
        <input className="w-full rounded border border-[#596a5f] bg-[#0f1712] px-3 py-3 text-white focus-visible:outline-2 focus-visible:outline-[#79d19c]" type="number" inputMode="decimal" min="0" max="1000000000000" step="0.01" value={input[key]} onChange={event => {setInput({...input, [key]: event.target.value}); setResult(null);}} />
      </label>)}</div>
      <div className="mt-5 flex flex-wrap gap-3"><button className="rounded bg-[#79d19c] px-5 py-3 font-semibold text-[#101811]" type="submit">{c.calculate}</button><button className="rounded border border-[#596a5f] px-5 py-3 text-white" type="button" onClick={() => {setInput(blank); setResult(null);}}>{c.reset}</button></div>
    </form>
    <div role="status" aria-live="polite" aria-atomic="true">{result && <div className="mt-5 border-t border-[#465149] pt-5"><p className="text-sm leading-7 text-white">{c[result.status]}</p>{"missing" in result && <dl className="mt-4 grid gap-4 sm:grid-cols-2">{([[c.missing, result.missing], [c.remaining, result.remainingCash], [c.reserveGap, result.reserveGap], ...(result.status === "shortOffer" ? [[c.uncovered, result.uncoveredGold] as const] : [])] as const).map(([label, value]) => <div key={label}><dt className="text-xs text-[#b6c2ba]">{label}</dt><dd className="mt-1 text-xl tabular-nums text-[#79d19c]">{format.format(value)}</dd></div>)}</dl>}</div>}</div>
  </div>;
}
