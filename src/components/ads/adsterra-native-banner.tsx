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
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    container.replaceChildren();
    const script = document.createElement("script");
    configureAdsterraScript(script);

    let timeoutId = 0;
    const hasContent = () => container.childNodes.length > 0;
    const markFilled = () => {
      if (!hasContent()) return;
      section.dataset.state = "filled";
      window.clearTimeout(timeoutId);
    };
    const hideEmptySlot = () => {
      if (!hasContent()) setHidden(true);
    };

    const observer = new MutationObserver(markFilled);
    observer.observe(container, {childList: true, subtree: true});
    script.addEventListener("error", hideEmptySlot, {once: true});
    section.insertBefore(script, container);
    timeoutId = window.setTimeout(hideEmptySlot, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
      script.removeEventListener("error", hideEmptySlot);
      script.remove();
      container.replaceChildren();
    };
  }, []);

  if (hidden) return null;

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-5"
      data-ad-slot="adsterra-native"
      data-state="loading"
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase text-[#718079]">
        {label}
      </p>
      <div
        ref={containerRef}
        id={ADSTERRA_NATIVE_CONTAINER_ID}
        className="min-h-[150px] w-full"
      />
    </section>
  );
}
