"use client";

import {useEffect, useRef} from "react";
import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED} from "@/features/ads/ad-policy";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  mountAdsterraNative
} from "@/features/ads/adsterra-native";
import {observeAdSlot} from "@/features/ads/adsterra-banner";
import {isProductionHostname} from "@/lib/analytics-events";

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
    if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED || !isProductionHostname(window.location.hostname)) return;
    const container = containerRef.current;
    if (!container || !container.parentNode) return;

    const observation = observeAdSlot(container, "native", "native");
    const cancelLoad = mountAdsterraNative(container, observation.report);
    return () => {
      observation.cleanup();
      cancelLoad();
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
