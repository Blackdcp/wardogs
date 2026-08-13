import type {ReactNode} from "react";
import {Link} from "@/i18n/navigation";

type ButtonLinkProps = {href: string; children: ReactNode; variant?: "primary" | "secondary" | "light"; className?: string; external?: boolean};

const variants = {
  primary: "border-[#397b59] bg-[#397b59] text-white hover:bg-[#45946c]",
  secondary: "border-[#46534d] bg-[#171c1a] text-[#f2f5f3] hover:border-[#5e7168] hover:bg-[#202723]",
  light: "border-[#f2f5f3] bg-[#f2f5f3] text-[#132219] hover:bg-white"
};

export function ButtonLink({href, children, variant = "primary", className = "", external = false}: ButtonLinkProps) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border px-5 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`;
  if (external) return <a className={classes} href={href} target="_blank" rel="noreferrer">{children}</a>;
  return <Link className={classes} href={href}>{children}</Link>;
}
