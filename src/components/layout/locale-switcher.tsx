"use client";

import {useId, useTransition, type ChangeEvent} from "react";
import {ChevronDown, Languages} from "lucide-react";
import {useLocale} from "next-intl";
import type {Locale} from "@/config/site";
import {locales} from "@/config/site";
import {resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {usePathname, useRouter} from "@/i18n/navigation";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  de: "DE",
  "pt-br": "PT-BR"
};

type LocaleSwitcherProps = {
  label: string;
  compact?: boolean;
};

export function LocaleSwitcher({label, compact = false}: LocaleSwitcherProps) {
  const id = useId();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    if (nextLocale === locale) return;
    const target = resolveItemRouteTarget(nextLocale, pathname, "localized-category");
    trackAnalyticsEvent(ANALYTICS_EVENTS.languageSwitch, {
      from_locale: locale,
      to_locale: nextLocale,
      page_path: pathname
    });
    startTransition(() => router.replace(target.pathname, {locale: target.locale}));
  }

  return (
    <div
      className={`relative flex h-11 shrink-0 items-center rounded-[6px] border border-[#37423d] bg-[#151a18] text-[#dce4df] transition-colors hover:border-[#5b6d64] ${compact ? "w-[64px]" : "w-[98px]"}`}
      title={label}
    >
      {!compact && <Languages aria-hidden="true" className="pointer-events-none absolute left-2.5 size-4 text-[#69c78f]" />}
      <label className="screen-reader-only" htmlFor={id}>{label}</label>
      <select
        id={id}
        aria-busy={isPending}
        className={`h-full w-full cursor-pointer appearance-none rounded-[6px] bg-transparent pr-6 text-xs font-semibold text-[#f2f5f3] disabled:cursor-wait disabled:opacity-60 ${compact ? "pl-2" : "pl-8"}`}
        value={locale}
        onChange={handleChange}
        disabled={isPending}
      >
        {locales.map((option) => (
          <option key={option} value={option} className="bg-[#151b18] text-[#f2f5f3]">
            {localeLabels[option]}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-1.5 size-3.5 text-[#93a29b]" />
    </div>
  );
}
