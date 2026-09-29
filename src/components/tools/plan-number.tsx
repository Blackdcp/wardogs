"use client";

export const planInputClass = "min-h-11 w-full min-w-0 border border-[#46534d] bg-[#0c100e] px-3 py-2 text-sm text-white";

export function PlanNumber({label, value, onChange, integer = false, minimum = 0, maximum = 1_000_000, placeholder}: {
  label: string; value: number | null; onChange: (value: number | null) => void; integer?: boolean; minimum?: number; maximum?: number; placeholder?: string;
}) {
  return <label className="grid min-w-0 content-start gap-2 text-sm text-[#cbd5cf]">{label}
    <input className={planInputClass} type="number" inputMode={integer ? "numeric" : "decimal"} min={minimum} max={maximum} step={integer ? 1 : 0.01} placeholder={placeholder} value={value ?? ""} onChange={(event) => {
      const next = event.target.valueAsNumber;
      onChange(Number.isFinite(next) ? Math.max(minimum, Math.min(maximum, integer ? Math.floor(next) : Math.round(next * 100) / 100)) : null);
    }} />
  </label>;
}
