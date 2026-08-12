import type {ReactNode} from "react";

type StatusBadgeProps = {children: ReactNode; tone?: "accent" | "warning" | "danger" | "muted"; className?: string};

const toneClasses = {
  accent: "border-[#4d946d] bg-[#244332] text-[#d8f4e4]",
  warning: "border-[#927328] bg-[#3c321c] text-[#f6dda0]",
  danger: "border-[#8e4545] bg-[#3e2424] text-[#ffd4d4]",
  muted: "border-[#46534d] bg-[#242c28] text-[#c8d2cd]"
};

export function StatusBadge({children, tone = "accent", className = ""}: StatusBadgeProps) {
  return <span className={`inline-flex min-h-7 items-center rounded-[4px] border px-2.5 py-1 text-xs font-semibold uppercase ${toneClasses[tone]} ${className}`}>{children}</span>;
}
