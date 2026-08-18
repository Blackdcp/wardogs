"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";
import {
  ADSTERRA_POPUNDER_SCRIPT_SRC,
  ADSTERRA_SOCIAL_BAR_SCRIPT_SRC,
  canLoadPopunder,
  isBehavioralAdPath,
  POPUNDER_STORAGE_KEY
} from "@/features/ads/ad-policy";

function appendAdScript(src: string, unit: string) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.dataset.adsterraUnit = unit;
  document.body.appendChild(script);
  return script;
}

export function AdsterraBehavioralAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isBehavioralAdPath(pathname)) return;

    const socialBarScript = appendAdScript(ADSTERRA_SOCIAL_BAR_SCRIPT_SRC, "social-bar");
    let popunderScript: HTMLScriptElement | null = null;

    const loadPopunder = () => {
      let lastLoadedAt: string | null = null;
      try {
        lastLoadedAt = window.localStorage.getItem(POPUNDER_STORAGE_KEY);
      } catch {
        // Storage can be unavailable in hardened browsing modes.
      }
      if (!canLoadPopunder(lastLoadedAt)) return;

      popunderScript = appendAdScript(ADSTERRA_POPUNDER_SCRIPT_SRC, "popunder");
      try {
        window.localStorage.setItem(POPUNDER_STORAGE_KEY, String(Date.now()));
      } catch {
        // The current page still gets one attempt when storage is unavailable.
      }
      removeInteractionListeners();
    };
    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", loadPopunder);
      window.removeEventListener("keydown", loadPopunder);
    };

    window.addEventListener("pointerdown", loadPopunder, {once: true, passive: true});
    window.addEventListener("keydown", loadPopunder, {once: true});

    return () => {
      removeInteractionListeners();
      socialBarScript.remove();
      popunderScript?.remove();
    };
  }, [pathname]);

  return null;
}
