"use client";

import {useEffect, useRef, useState} from "react";

export const ADSTERRA_NATIVE_ZONE_ID = "481d6501bcd0c27b98bc3c4776a26f6e";
export const ADSTERRA_NATIVE_CONTAINER_ID = `container-${ADSTERRA_NATIVE_ZONE_ID}`;
export const ADSTERRA_NATIVE_SCRIPT_SRC =
  `https://pl30888081.effectivecpmnetwork.com/${ADSTERRA_NATIVE_ZONE_ID}/invoke.js`;

export function configureAdsterraScript(script: HTMLScriptElement) {
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = ADSTERRA_NATIVE_SCRIPT_SRC;
}

type AdsterraNativeBannerProps = {
  label: string;
};

export function AdsterraNativeBanner({label}: AdsterraNativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setActive(true);
    const script = document.createElement("script");
    configureAdsterraScript(script);

    const hasFilled = () => container.children.length > 0 || container.textContent?.trim();
    const observer = new MutationObserver(() => {
      if (hasFilled()) setActive(true);
    });
    const noFillTimer = window.setTimeout(() => {
      if (!hasFilled()) setActive(false);
    }, 8_000);

    script.addEventListener("error", () => setActive(false), {once: true});
    observer.observe(container, {childList: true, subtree: true, characterData: true});
    container.before(script);

    return () => {
      window.clearTimeout(noFillTimer);
      observer.disconnect();
      script.remove();
      container.replaceChildren();
    };
  }, []);

  if (!active) return null;

  return (
    <section
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-4"
      data-ad-slot="adsterra-native"
    >
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8e87]">
        {label}
      </p>
      <div className="min-h-[90px] overflow-hidden md:min-h-[120px]" id={ADSTERRA_NATIVE_CONTAINER_ID} ref={containerRef} />
    </section>
  );
}
