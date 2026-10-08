"use client";

import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {
  ADSTERRA_ENABLED, ADSTERRA_POPUNDER_SCRIPT_SRC, ADSTERRA_POPUNDER_VERIFIED,
  ADSTERRA_SOCIAL_BAR_ENABLED, ADSTERRA_SOCIAL_BAR_SCRIPT_SRC, ADSTERRA_SOCIAL_BAR_VERIFIED,
  BEHAVIORAL_POPUNDER_ENABLED, isBehavioralAdPath, POPUNDER_STORAGE_KEY
} from "@/features/ads/ad-policy";
import {behavioralEligibility, behavioralNavigationTarget, claimBehavioralLoad, getBehavioralVariant, recordBehavioralContentVisit, SOCIAL_BAR_LOAD_KEY, type BehavioralVariant} from "@/features/ads/behavioral-ad-policy";
import {getAdReportingMetadata} from "@/features/ads/ad-reporting";
import {ANALYTICS_EVENTS, isProductionHostname, trackAnalyticsEvent} from "@/lib/analytics-events";

const documentLoads = new WeakMap<Document, {pathname: string; variant: BehavioralVariant}>();

/** Registered before the vendor executes; removing its script cannot undo it. */
function installDocumentBoundary() {
  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;
  const wrap = (original: History["pushState"], replace: boolean): History["pushState"] => function (this: History, data, unused, url) {
    const destination = behavioralNavigationTarget(window.location.href, url);
    if (destination) { window.location[replace ? "replace" : "assign"](destination); return; }
    original.call(this, data, unused, url);
  };
  const push = wrap(originalPush, false);
  const replace = wrap(originalReplace, true);
  window.history.pushState = push;
  window.history.replaceState = replace;
  const click = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const destination = behavioralNavigationTarget(window.location.href, anchor.href);
    if (!destination) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(destination);
  };
  const initialPath = window.location.pathname;
  const popstate = () => {
    if (window.location.pathname !== initialPath) window.location.replace(window.location.href);
  };
  const resize = () => {
    // A loaded desktop vendor must not survive into the mobile sticky layout.
    if (document.documentElement.clientWidth < 1024) window.location.replace(window.location.href);
  };
  window.addEventListener("click", click, true);
  window.addEventListener("popstate", popstate, true);
  window.addEventListener("resize", resize);
  // Intentionally lasts for the document: a component unmount cannot remove
  // vendor global handlers, so it must not remove this isolation boundary.
}

export function AdsterraBehavioralAds() {
  const pathname = usePathname();
  const [state, setState] = useState("blocked");

  useEffect(() => {
    const prior = documentLoads.get(document);
    if (prior && prior.pathname !== pathname) {
      // Fallback for framework navigation that did not pass through history.
      window.location.replace(window.location.href);
      return;
    }
    if (!ADSTERRA_ENABLED || !isProductionHostname(window.location.hostname) || !isBehavioralAdPath(pathname) || prior) return;
    // Until the supplier confirms both format and frequency, do not enroll
    // users, write storage, poll engagement, or request third-party code.
    if (!(ADSTERRA_SOCIAL_BAR_ENABLED && ADSTERRA_SOCIAL_BAR_VERIFIED) && !(BEHAVIORAL_POPUNDER_ENABLED && ADSTERRA_POPUNDER_VERIFIED)) return;
    if (document.documentElement.clientWidth < 1024) return;
    let local: Storage | null = null;
    let session: Storage | null = null;
    try { local = window.localStorage; session = window.sessionStorage; } catch { /* Serving remains blocked. */ }
    const variant = getBehavioralVariant(local, () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32);
    const contentVisits = recordBehavioralContentVisit(session, pathname);
    const social = variant === "social-bar";
    const enabled = social ? ADSTERRA_SOCIAL_BAR_ENABLED : BEHAVIORAL_POPUNDER_ENABLED;
    const verified = social ? ADSTERRA_SOCIAL_BAR_VERIFIED : ADSTERRA_POPUNDER_VERIFIED;
    let foregroundMs = 0;
    let lastTick = performance.now();
    let script: HTMLScriptElement | null = null;
    let active = true;
    let diagnostic: ReturnType<typeof setTimeout> | undefined;
    const sent = new Set<string>();
    const report = (status: string, reason?: string) => {
      const key = `${status}:${reason ?? ""}`;
      if (!active || sent.has(key)) return;
      sent.add(key);
      setState(status === "blocked" ? "blocked" : status);
      try {
        trackAnalyticsEvent(ANALYTICS_EVENTS.adStatus, {
          ...getAdReportingMetadata(pathname, variant === "social-bar" ? "ff48ce7ab0b6833443b9f5bb64ec5e3c" : variant === "popunder" ? "9ccb058d9d56da7b7f2e39d95a819b02" : "behavioral-control", "behavioral"),
          placement: "behavioral", format: variant === "social-bar" || variant === "popunder" ? variant : "behavioral", variant: variant ?? "unassigned", status,
          ...(reason ? {reason} : {}), locale: document.documentElement.lang.toLowerCase()
        });
      } catch { /* Diagnostics never determine ad delivery. */ }
    };
    if (!variant || contentVisits === null || variant === "control" || !enabled || !verified) {
      report("blocked", !variant || contentVisits === null ? "storage_unavailable" : variant === "control" ? "control" : !enabled ? "disabled" : "vendor_unverified");
      return;
    }
    let foreground = !document.hidden;
    let stopped = false;
    const update = () => {
      if (!active || script || stopped) return;
      const now = performance.now();
      if (foreground) foregroundMs += Math.max(0, now - lastTick);
      lastTick = now;
      foreground = !document.hidden;
      const pageHeight = document.documentElement.scrollHeight;
      const reason = behavioralEligibility({
        production: true, pathname, variant, enabled, verified, contentVisits,
        viewportWidth: document.documentElement.clientWidth, foregroundMs,
        scrollDepth: pageHeight > 0 ? (window.scrollY + window.innerHeight) / pageHeight : 0,
        pageHidden: document.hidden,
        modalOpen: Boolean(document.fullscreenElement || document.querySelector('[aria-modal="true"], [data-mobile-navigation-open="true"], dialog[open]') || document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')),
        protectedTool: Boolean(document.querySelector("[data-mobile-ad-protected], [data-map-viewer], [data-tool-calculator-shell]"))
      });
      if (reason) { report("blocked", reason); return; }
      report("eligible");
      stopped = true;
      clearInterval(timer);
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", update);
      if (!claimBehavioralLoad(local, social ? SOCIAL_BAR_LOAD_KEY : POPUNDER_STORAGE_KEY, Date.now())) { report("blocked", "load_cooldown_or_storage"); return; }
      // One format and one insertion per document; this does not count impressions.
      documentLoads.set(document, {pathname, variant: variant!});
      installDocumentBoundary();
      script = document.createElement("script");
      script.src = social ? ADSTERRA_SOCIAL_BAR_SCRIPT_SRC : ADSTERRA_POPUNDER_SCRIPT_SRC;
      script.async = true;
      script.dataset.cfasync = "false";
      script.dataset.adsterraUnit = variant!;
      script.onload = () => { clearTimeout(diagnostic); report("script_loaded"); };
      script.onerror = () => { clearTimeout(diagnostic); report("script_error"); };
      report("request_started");
      diagnostic = setTimeout(() => report("loader_stalled"), 15_000);
      (social ? document.body : document.head).appendChild(script);
    };
    const timer = setInterval(update, 1_000);
    window.addEventListener("scroll", update, {passive: true});
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      active = false;
      clearInterval(timer);
      clearTimeout(diagnostic);
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", update);
      if (script) {script.onload = null; script.onerror = null; script.remove();}
    };
  }, [pathname]);

  return <span hidden data-behavioral-ad-state={state} />;
}
