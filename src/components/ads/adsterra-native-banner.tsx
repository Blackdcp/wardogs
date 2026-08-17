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

export type AdsterraNativeSlotState = "loading" | "filled" | "fallback";
type AdsterraNativeSlotEvent = "meaningful-fill" | "timeout" | "error";

export type AdsterraNativeContentNode = {
  childNodes?: Iterable<AdsterraNativeContentNode>;
  getAttribute?: (name: string) => string | null;
  nodeType: number;
  tagName?: string;
  textContent?: string | null;
};

export function hasMeaningfulAdsterraContent(nodes: Iterable<AdsterraNativeContentNode>) {
  for (const node of nodes) {
    if (node.nodeType === 3 && node.textContent?.trim()) return true;
    if (node.nodeType !== 1) continue;

    const tagName = node.tagName?.toLowerCase();
    if (tagName === "script" || tagName === "style" || tagName === "template") continue;
    const href = node.getAttribute?.("href")?.trim();
    const src = node.getAttribute?.("src")?.trim();
    if ((tagName === "a" && href) || ((tagName === "iframe" || tagName === "img") && src)) return true;
    if (node.childNodes && hasMeaningfulAdsterraContent(node.childNodes)) return true;
  }

  return false;
}

export function transitionAdsterraNativeState(
  state: AdsterraNativeSlotState,
  event: AdsterraNativeSlotEvent
): AdsterraNativeSlotState {
  if (state !== "loading") return state;
  return event === "meaningful-fill" ? "filled" : "fallback";
}

export function AdsterraNativeBanner({label}: AdsterraNativeBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<AdsterraNativeSlotState>("loading");
  const [state, setState] = useState<AdsterraNativeSlotState>("loading");

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    container.replaceChildren();
    const script = document.createElement("script");
    configureAdsterraScript(script);

    let timeoutId = 0;
    let disposed = false;
    const hasContent = () => hasMeaningfulAdsterraContent(container.childNodes);
    const updateState = (event: AdsterraNativeSlotEvent) => {
      const nextState = transitionAdsterraNativeState(stateRef.current, event);
      if (nextState === stateRef.current) return false;
      stateRef.current = nextState;
      section.dataset.state = nextState;
      setState(nextState);
      return true;
    };
    const markFilled = () => {
      if (disposed || !hasContent() || !updateState("meaningful-fill")) return;
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
    const showFallback = (event: "timeout" | "error") => {
      if (disposed || !updateState(event)) return;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      container.replaceChildren();
      container.hidden = true;
    };

    const observer = new MutationObserver(markFilled);
    observer.observe(container, {childList: true, subtree: true});
    const handleScriptError = () => showFallback("error");
    script.addEventListener("error", handleScriptError, {once: true});
    section.insertBefore(script, container.parentElement);
    if (stateRef.current === "loading") timeoutId = window.setTimeout(() => showFallback("timeout"), 8000);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      script.removeEventListener("error", handleScriptError);
      script.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={state === "fallback" ? "WARDOGS Wiki recommendation" : label}
      className="my-10 border-y border-[#2c3631] py-5"
      data-ad-slot="adsterra-native"
      data-state={state}
    >
      <p aria-hidden={state === "fallback"} className="mb-3 text-center text-[10px] font-semibold uppercase text-[#718079]">
        {label}
      </p>
      <div className="relative aspect-[4/1] w-full overflow-hidden" data-ad-shell="native-content">
        <div
          ref={containerRef}
          id={ADSTERRA_NATIVE_CONTAINER_ID}
          className="absolute inset-0"
          hidden={state === "fallback"}
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
