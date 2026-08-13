"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {Menu, X} from "lucide-react";
import {Link, usePathname} from "@/i18n/navigation";

export type MobileNavItem = {
  href: string;
  label: string;
};

type MobileNavProps = {
  items: readonly MobileNavItem[];
  openLabel: string;
  closeLabel: string;
  navigationLabel: string;
};

export function MobileNav({items, openLabel, closeLabel, navigationLabel}: MobileNavProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({pathname, open: false});
  const open = menuState.pathname === pathname && menuState.open;

  const closeMenu = useCallback(() => {
    setMenuState({pathname, open: false});
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-[6px] border border-[#37423d] bg-[#151a18] text-[#f2f5f3] transition-colors hover:border-[#5b6d64] hover:bg-[#202723]"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        title={open ? closeLabel : openLabel}
        onClick={() => setMenuState({pathname, open: !open})}
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        <span className="screen-reader-only">{open ? closeLabel : openLabel}</span>
      </button>

      {open && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 top-16 z-40 bg-[#050706]/75 min-[1180px]:hidden"
            onMouseDown={closeMenu}
          />
          <nav
            ref={panelRef}
            id="mobile-navigation"
            aria-label={navigationLabel}
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-[#35413b] bg-[#101512] px-4 py-5 shadow-2xl min-[1180px]:hidden"
          >
            <ul className="mx-auto grid w-full max-w-[720px] gap-2 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-12 items-center rounded-[6px] border border-[#2f3934] bg-[#171d1a] px-4 py-3 text-sm font-semibold text-[#edf2ef] transition-colors hover:border-[#4d946d] hover:bg-[#1e2923] hover:text-white"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
