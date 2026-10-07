"use client";

import {useEffect, useRef, useState, type ReactNode} from "react";
import {usePathname} from "next/navigation";
import {X} from "lucide-react";
import {ADSTERRA_BANNER_UNITS} from "@/features/ads/adsterra-banner";
import {getAdReportingMetadata} from "@/features/ads/ad-reporting";
import {getMobileAdSuppression, overlapsMobileAd, readMobileAdDismissal, saveMobileAdDismissal, type MobileAdSuppression} from "@/features/ads/mobile-ad-policy";
import {ANALYTICS_EVENTS, isProductionHostname, trackAnalyticsEvent} from "@/lib/analytics-events";

const protectedTools = "[data-mobile-ad-protected], [data-map-viewer], [data-tool-calculator-shell]";
const interactiveControls = 'button, a[href], input, select, textarea, [role="slider"], [role="button"], [tabindex]:not([tabindex="-1"])';

function sessionStore() {
  try { return window.sessionStorage; } catch { return null; }
}

/** Keep the same creative mounted during temporary UI avoidance; never refresh it. */
export function MobileAdInventory({children, dismissLabel}: {children: ReactNode; dismissLabel: string}) {
  const pathname = usePathname();
  const shell = useRef<HTMLDivElement>(null);
  const adHeight = useRef(80);
  const [dismissed, setDismissed] = useState(false);
  const [state, setState] = useState<{ready: boolean; loaded: boolean; suppressed: MobileAdSuppression}>({ready: false, loaded: false, suppressed: "viewport"});

  useEffect(() => {
    let frame = 0;
    let active = true;
    const update = () => {
      frame = 0;
      if (!active) return;
      if (readMobileAdDismissal(sessionStore())) {
        setDismissed(true);
        return;
      }
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const rect = shell.current?.getBoundingClientRect();
      if (rect && rect.height > 0) adHeight.current = rect.height;
      const safeArea = shell.current ? parseFloat(window.getComputedStyle(shell.current).paddingBottom) || 0 : 0;
      const reservedHeight = Math.max(adHeight.current, 80 + safeArea);
      const editableFocused = Boolean(document.activeElement?.matches('input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'));
      const modalOpen = Boolean(document.fullscreenElement || document.querySelector('[data-mobile-navigation-open="true"], [aria-modal="true"], dialog[open]'));
      const controlsOverlap = width <= 467 && [...document.querySelectorAll(protectedTools)].some((tool) =>
        [...tool.querySelectorAll(interactiveControls)].some((control) => overlapsMobileAd(control.getBoundingClientRect(), width, height, reservedHeight))
      );
      const suppressed = getMobileAdSuppression({
        width, height, visualHeight: window.visualViewport?.height ?? height,
        visualScale: window.visualViewport?.scale ?? 1,
        pageHidden: document.hidden, modalOpen, editableFocused, controlsOverlap
      });
      setState((previous) => {
        const loaded = previous.loaded || suppressed === null;
        return previous.ready && previous.loaded === loaded && previous.suppressed === suppressed ? previous : {ready: true, loaded, suppressed};
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ["aria-modal", "data-fullscreen", "hidden", "data-mobile-navigation-open"]});
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resize?.observe(document.body);
    if (shell.current) resize?.observe(shell.current);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, {passive: true});
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    document.addEventListener("fullscreenchange", schedule);
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("load", schedule, true);
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      document.removeEventListener("fullscreenchange", schedule);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("load", schedule, true);
    };
  }, [pathname]);

  useEffect(() => {
    const active = state.ready && !dismissed && state.suppressed === null;
    document.documentElement.dataset.mobileAdActive = String(active);
    document.documentElement.dataset.mobileAdDismissed = String(dismissed);
    return () => {
      delete document.documentElement.dataset.mobileAdActive;
      delete document.documentElement.dataset.mobileAdDismissed;
    };
  }, [dismissed, state.ready, state.suppressed]);

  if (dismissed) return null;
  const visible = state.ready && state.suppressed === null;
  return (
    <div ref={shell} className="mobile-ad-inventory fixed inset-x-0 bottom-0 z-[70] mx-auto w-[320px] border-t border-[#2c3631] bg-[#0d0f0e] pt-1 min-[468px]:hidden"
      data-ad-placement="mobile-sticky" data-ad-suppressed={state.suppressed ?? undefined} hidden={!visible}>
      <button type="button" className="absolute bottom-full right-0 flex size-11 items-center justify-center rounded-t border border-[#46534d] bg-[#0d0f0e] text-white hover:bg-[#223329]"
        aria-label={dismissLabel} title={dismissLabel}
        onClick={() => {
          saveMobileAdDismissal(sessionStore());
          setDismissed(true);
          if (isProductionHostname(window.location.hostname)) trackAnalyticsEvent(ANALYTICS_EVENTS.adDismiss, {
            ...getAdReportingMetadata(pathname, ADSTERRA_BANNER_UNITS.mobile320.key, "mobile-sticky-creative"),
            placement: "mobile-sticky", format: "display", reason: "user_close", locale: document.documentElement.lang
          });
        }}><X aria-hidden="true" size={18} /></button>
      {state.loaded ? children : null}
    </div>
  );
}
