"use client";

import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {AD_REPORTING_VERSION, getAdReportingMetadata} from "@/features/ads/ad-reporting";
import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED} from "@/features/ads/ad-policy";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_ZONE_ID,
  mountAdsterraNative
} from "@/features/ads/adsterra-native";
import {observeAdSlot, type AdStatus} from "@/features/ads/adsterra-banner";
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
  const pathname = usePathname();
  const reportRef = useRef<((status: AdStatus) => void) | null>(null);
  const loadedState = useRef<"script_loaded" | "script_error" | null>(null);

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED || !isProductionHostname(window.location.hostname)) return;
    const container = containerRef.current;
    if (!container || !container.parentNode) return;

    const observation = observeAdSlot(container, "native", "native", getAdReportingMetadata(pathname, ADSTERRA_NATIVE_ZONE_ID));
    reportRef.current = observation.report;
    if (loadedState.current) observation.report(loadedState.current);
    return () => {
      reportRef.current = null;
      observation.cleanup();
    };
  }, [pathname]);

  useEffect(() => {
    if (!containerRef.current) return;
    loadedState.current = null;
    return mountAdsterraNative(containerRef.current, (status) => {
      if (status === "script_loaded" || status === "script_error") loadedState.current = status;
      reportRef.current?.(status);
    });
  }, []);

  if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED) return null;

  return (
    <section
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-4"
      data-ad-slot="adsterra-native"
      data-ad-config={AD_REPORTING_VERSION}
      data-ad-unit={ADSTERRA_NATIVE_ZONE_ID}
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
