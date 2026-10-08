"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {Link} from "@/i18n/navigation";
import {isProductionHostname} from "@/lib/analytics-events";
import {CLARITY_SETTINGS_EVENT, type ClarityChoice} from "@/features/analytics/clarity-consent";
import {getClarityController} from "@/features/analytics/clarity-runtime";

export function ClaritySettingsButton({label}: {label: string}) {
  return <button className="navigation-link inline-flex min-h-8 items-center text-left transition-colors hover:text-[#c7d1cc]" type="button" data-clarity-settings onClick={() => window.dispatchEvent(new Event(CLARITY_SETTINGS_EVENT))}>{label}</button>;
}

export function MicrosoftClarity() {
  const t = useTranslations("clarity");
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<ClarityChoice | null>(null);
  const [settings, setSettings] = useState({open: false, pathname});
  const [suppressed, setSuppressed] = useState(false);
  const [mobileAd, setMobileAd] = useState(true);
  const panel = useRef<HTMLElement>(null);
  const settingsOpen = settings.open && settings.pathname === pathname;
  if (settings.pathname !== pathname) setSettings({open: false, pathname});

  useEffect(() => {
    if (!isProductionHostname(window.location.hostname)) return;
    const controller = getClarityController(window);
    const sync = () => { setChoice(controller.getChoice()); setReady(true); };
    const unsubscribe = controller.subscribe(sync);
    const open = () => setSettings({open: true, pathname: window.location.pathname});
    const update = () => {
      setSuppressed(Boolean(document.hidden || document.fullscreenElement || document.querySelector('[aria-modal="true"], [data-mobile-navigation-open="true"], dialog[open], [data-map-viewer][data-fullscreen]:not([data-fullscreen="off"])') || document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')));
      setMobileAd(document.documentElement.dataset.mobileAdActive === "true");
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, {subtree: true, childList: true, attributes: true, attributeFilter: ["aria-modal", "data-mobile-navigation-open", "open", "data-fullscreen"]});
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ["data-mobile-ad-active"]});
    window.addEventListener(CLARITY_SETTINGS_EVENT, open);
    for (const name of ["fullscreenchange", "visibilitychange", "focusin", "focusout"]) document.addEventListener(name, update);
    sync();
    update();
    return () => {
      unsubscribe(); observer.disconnect();
      window.removeEventListener(CLARITY_SETTINGS_EVENT, open);
      for (const name of ["fullscreenchange", "visibilitychange", "focusin", "focusout"]) document.removeEventListener(name, update);
    };
  }, []);

  useEffect(() => {
    if (settingsOpen && !suppressed) panel.current?.focus({preventScroll: true});
  }, [settingsOpen, suppressed]);

  const closeSettings = () => {
    setSettings({open: false, pathname});
    document.querySelector<HTMLButtonElement>("[data-clarity-settings]")?.focus({preventScroll: true});
  };
  const choose = (value: ClarityChoice) => { closeSettings(); getClarityController(window).choose(value); };
  if (!ready || suppressed || !settingsOpen) return null;

  return (
    <aside ref={panel} tabIndex={-1} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeSettings(); } }} aria-labelledby="clarity-consent-title" data-clarity-consent data-clarity-mask="true" className={`fixed right-3 left-3 z-40 rounded-md border border-[#45634e] bg-[#101a14] p-4 text-[#d3dfd7] shadow-xl focus:outline-none sm:left-auto sm:w-[360px] sm:bottom-4 min-[1600px]:right-[184px] ${mobileAd ? "bottom-[calc(136px+env(safe-area-inset-bottom,0px))]" : "bottom-[calc(12px+env(safe-area-inset-bottom,0px))]"}`}>
      <h2 id="clarity-consent-title" className="text-sm font-semibold text-white">{t("title")}</h2>
      <p className="mt-1 text-xs leading-5">{t("description")} <Link href="/privacy" title={t("privacy")} className="underline underline-offset-2">{t("privacy")}</Link></p>
      {choice ? <p className="mt-1 text-xs" role="status">{t(choice === "allowed" ? "statusAllowed" : "statusDenied")}</p> : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" data-clarity-choice="denied" onClick={() => choose("denied")} className="min-h-11 rounded border border-[#687e70] px-3 text-xs font-semibold hover:bg-[#243429]">{t("decline")}</button>
        <button type="button" data-clarity-choice="allowed" onClick={() => choose("allowed")} className="min-h-11 rounded border border-[#687e70] px-3 text-xs font-semibold hover:bg-[#243429]">{t("allow")}</button>
      </div>
    </aside>
  );
}
