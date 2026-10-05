"use client";

import {useId, useState} from "react";
import {ChevronDown, Crosshair, Map} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {NavigationGroup} from "@/features/navigation/navigation-data";

type MobileNavigationGroupsProps = {
  groups: readonly NavigationGroup[];
  onNavigate: () => void;
  mapLabel?: string;
  calcLabel?: string;
};

export function MobileNavigationGroups({groups, onNavigate, mapLabel, calcLabel}: MobileNavigationGroupsProps) {
  const navigationId = useId();
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-[720px]">
      {/* 战术双核心高绿快捷入口 (Mobile Tactical Shortcuts) */}
      {mapLabel && calcLabel && (
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <Link
            href="/tools/map"
            title={mapLabel}
            className="navigation-link flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-[#30543e] bg-[#14261c] px-3 py-2 text-xs font-bold text-[#8be2ad] shadow-sm transition-colors hover:border-[#4cd988] hover:bg-[#1a3827] hover:text-white"
            onClick={onNavigate}
          >
            <Map aria-hidden="true" className="size-4 text-[#4cd988]" />
            <span>{mapLabel}</span>
          </Link>
          <Link
            href="/tools/artillery-calculator"
            title={calcLabel}
            className="navigation-link flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-[#30543e] bg-[#14261c] px-3 py-2 text-xs font-bold text-[#8be2ad] shadow-sm transition-colors hover:border-[#4cd988] hover:bg-[#1a3827] hover:text-white"
            onClick={onNavigate}
          >
            <Crosshair aria-hidden="true" className="size-4 text-[#4cd988]" />
            <span>{calcLabel}</span>
          </Link>
        </div>
      )}

      <ul className="grid w-full gap-2 sm:grid-cols-2 sm:items-start">
        {groups.map((group) => {
          if (group.href) {
            return (
              <li key={group.id}>
                <Link
                  href={group.href}
                  title={group.label}
                  className="navigation-link flex min-h-12 items-center rounded-[6px] border border-[#2f3934] bg-[#171d1a] px-4 py-3 text-sm font-semibold text-[#edf2ef] transition-colors hover:border-[#4d946d] hover:bg-[#1e2923] hover:text-white"
                  onClick={onNavigate}
                >
                  {group.label}
                </Link>
              </li>
            );
          }

          const open = openGroupId === group.id;
          const contentId = `${navigationId}-${group.id}`;
          return (
            <li key={group.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                className="navigation-link flex min-h-12 w-full items-center justify-between gap-3 rounded-[6px] border border-[#2f3934] bg-[#171d1a] px-4 py-3 text-left text-sm font-semibold text-[#edf2ef] transition-colors hover:border-[#4d946d] hover:bg-[#1e2923] hover:text-white"
                onClick={() => setOpenGroupId(open ? null : group.id)}
              >
                <span>{group.label}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <ul id={contentId} className="mt-1 grid gap-1 border-l border-[#397b59] pl-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        locale={item.locale}
                        title={item.label}
                        className="navigation-link flex min-h-11 items-center rounded-[4px] px-3 py-2 text-sm text-[#cbd5d0] transition-colors hover:bg-[#1e2923] hover:text-white"
                        onClick={onNavigate}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
