"use client";

import {useEffect, useRef} from "react";
import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED} from "@/features/ads/ad-policy";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SCRIPT_SRC,
  configureAdsterraNativeScript
} from "@/features/ads/adsterra-native";

export {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SCRIPT_SRC,
  ADSTERRA_NATIVE_ZONE_ID,
  configureAdsterraNativeScript
} from "@/features/ads/adsterra-native";

type AdsterraNativeBannerProps = {
  label: string;
};

export function AdsterraNativeBanner({label}: AdsterraNativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED) return;
    const container = containerRef.current;
    if (!container || !container.parentNode) return;

    const existingScript = container.parentNode.querySelector(
      `script[src="${ADSTERRA_NATIVE_SCRIPT_SRC}"]`
    );
    if (existingScript) return;

    const script = document.createElement("script");
    configureAdsterraNativeScript(script);
    container.parentNode.insertBefore(script, container);

    return () => {
      script.remove();
      container.innerHTML = "";
    };
  }, []);

  if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED) return null;

  return (
    <section
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-4"
      data-ad-slot="adsterra-native"
    >
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8e87]">
        {label}
      </p>
      <div
        ref={containerRef}
        id={ADSTERRA_NATIVE_CONTAINER_ID}
        className="min-h-[90px] w-full"
      />
    </section>
  );
}
