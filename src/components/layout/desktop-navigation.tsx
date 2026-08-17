"use client";

import {useEffect, useId, useRef, useState} from "react";
import {ChevronDown} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {NavigationGroup} from "@/features/navigation/navigation-data";

type DesktopNavigationProps = {
  groups: readonly NavigationGroup[];
  label: string;
};

export function DesktopNavigation({groups, label}: DesktopNavigationProps) {
  const navigationId = useId();
  const navigationRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (!openGroupId) return;
    const groupId = openGroupId;

    function handlePointerDown(event: PointerEvent) {
      if (!navigationRef.current?.contains(event.target as Node)) setOpenGroupId(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const trigger = triggerRefs.current.get(groupId);
      setOpenGroupId(null);
      trigger?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openGroupId]);

  function focusFirstItem(groupId: string) {
    requestAnimationFrame(() => {
      document.getElementById(`${navigationId}-${groupId}`)?.querySelector<HTMLElement>("a[href]")?.focus();
    });
  }

  return (
    <nav ref={navigationRef} aria-label={label} className="min-w-0 flex-1">
      <ul className="flex items-center justify-center gap-1 min-[1360px]:gap-2">
        {groups.map((group) => {
          if (group.href) {
            return (
              <li key={group.id}>
                <Link
                  href={group.href}
                  className="inline-flex min-h-11 min-w-20 items-center justify-center whitespace-nowrap px-3 text-[13px] font-semibold text-[#c2ccc7] transition-colors hover:text-[#79d19c]"
                >
                  {group.label}
                </Link>
              </li>
            );
          }

          const open = openGroupId === group.id;
          const dropdownId = `${navigationId}-${group.id}`;
          return (
            <li key={group.id} className="relative" onPointerEnter={() => setOpenGroupId(group.id)}>
              <button
                ref={(node) => {
                  if (node) triggerRefs.current.set(group.id, node);
                  else triggerRefs.current.delete(group.id);
                }}
                type="button"
                aria-expanded={open}
                aria-controls={dropdownId}
                className="inline-flex min-h-11 min-w-24 items-center justify-center gap-1.5 whitespace-nowrap px-3 text-[13px] font-semibold text-[#c2ccc7] transition-colors hover:text-[#79d19c]"
                onClick={(event) => {
                  const keyboardToggle = event.detail === 0;
                  setOpenGroupId(keyboardToggle && open ? null : group.id);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown") return;
                  event.preventDefault();
                  setOpenGroupId(group.id);
                  focusFirstItem(group.id);
                }}
              >
                {group.label}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <ul
                  id={dropdownId}
                  className="absolute left-1/2 top-full z-50 mt-1 grid min-w-60 -translate-x-1/2 gap-1 rounded-[6px] border border-[#35413b] bg-[#101512] p-2 shadow-2xl"
                >
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex min-h-10 items-center whitespace-nowrap rounded-[4px] px-3 py-2 text-sm font-semibold text-[#dce4df] transition-colors hover:bg-[#1e2923] hover:text-[#79d19c]"
                        onClick={() => setOpenGroupId(null)}
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
    </nav>
  );
}
