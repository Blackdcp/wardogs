"use client";

import {ArrowRight, BookOpen} from "lucide-react";
import Link from "next/link";
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
  const [state, setState] = useState<"loading" | "filled" | "fallback">("loading");

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
      setState("filled");
      window.clearTimeout(timeoutId);
    };
    const showFallback = () => {
      if (hasContent()) return;
      container.replaceChildren();
      section.dataset.state = "fallback";
      setState("fallback");
    };

    const observer = new MutationObserver(markFilled);
    observer.observe(container, {childList: true, subtree: true});
    script.addEventListener("error", showFallback, {once: true});
    section.insertBefore(script, container.parentElement);
    timeoutId = window.setTimeout(showFallback, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
      script.removeEventListener("error", showFallback);
      script.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-5"
      data-ad-slot="adsterra-native"
      data-state={state}
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase text-[#718079]">
        {label}
      </p>
      <div className="relative aspect-[4/1] w-full overflow-hidden" data-ad-shell="native-content">
        <div
          ref={containerRef}
          id={ADSTERRA_NATIVE_CONTAINER_ID}
          className="absolute inset-0"
        />
        <Link
          aria-hidden={state !== "fallback"}
          className="absolute inset-0 flex items-center gap-3 bg-[#142019] p-3 text-left text-white"
          hidden={state !== "fallback"}
          href="/en/items"
        >
          <BookOpen aria-hidden="true" className="size-5 shrink-0 text-[#68bd8d]" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase leading-3 text-[#68bd8d]">
              WARDOGS Wiki recommendation
            </span>
            <span className="mt-0.5 block text-sm font-semibold leading-4">Explore the WARDOGS Catalogue</span>
            <span className="mt-0.5 block text-[11px] leading-3 text-[#c4d0c8]">
              Compare weapons, vehicles, ammo, attachments, gear, and loadout planning.
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-[#68bd8d]" />
        </Link>
      </div>
    </section>
  );
}
