"use client";

import {useEffect, useRef, useState} from "react";
import {X} from "lucide-react";
import {usePathname} from "next/navigation";
import {AD_REPORTING_VERSION, getAdReportingMetadata} from "@/features/ads/ad-reporting";
import {
  ADSTERRA_ENABLED,
  ADSTERRA_MOBILE_STICKY_ENABLED,
  ADSTERRA_RIGHT_RAIL_ENABLED
} from "@/features/ads/ad-policy";
import type {Locale} from "@/config/site";
import {
  ADSTERRA_BANNER_UNITS,
  mountAdsterraBanner,
  observeAdContainerWidth,
  observeAdSlot,
  selectAdsterraDisplayUnit,
  type AdStatus,
  type AdsterraBannerUnit
} from "@/features/ads/adsterra-banner";
import {isProductionHostname} from "@/lib/analytics-events";

export {ADSTERRA_BANNER_UNITS} from "@/features/ads/adsterra-banner";
export type {AdsterraBannerUnit} from "@/features/ads/adsterra-banner";

export function selectHorizontalBannerUnit(contentWidth: number): AdsterraBannerUnit | null {
  return selectAdsterraDisplayUnit("horizontal", contentWidth);
}

type BannerSlotProps = {
  className?: string;
  label?: string;
  placement: string;
  unit: AdsterraBannerUnit | null;
  loadEnabled?: boolean;
};

function BannerSlot({className = "", label = "Advertisement", placement, unit, loadEnabled = true}: BannerSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reportRef = useRef<((status: AdStatus) => void) | null>(null);
  const loadedState = useRef<{key: string; status: "script_loaded" | "script_error"} | null>(null);

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !unit || !loadEnabled || !isProductionHostname(window.location.hostname)) return;
    const el = slotRef.current;
    if (!el) return;

    const observation = observeAdSlot(el, placement, "display", getAdReportingMetadata(pathname, unit.key));
    reportRef.current = observation.report;
    if (loadedState.current?.key === unit.key) observation.report(loadedState.current.status);
    return () => {
      reportRef.current = null;
      observation.cleanup();
    };
  }, [loadEnabled, pathname, placement, unit]);

  // Attribute persistent layout creatives to the current page without refreshing
  // the vendor request whenever the visitor changes routes.
  useEffect(() => {
    if (!unit || !loadEnabled || !slotRef.current) return;
    loadedState.current = null;
    const cancelLoad = mountAdsterraBanner(slotRef.current, unit, (status) => {
      if (status === "script_loaded" || status === "script_error") loadedState.current = {key: unit.key, status};
      reportRef.current?.(status);
    });
    return () => {
      loadedState.current = null;
      cancelLoad();
    };
  }, [loadEnabled, unit]);

  if (!ADSTERRA_ENABLED || !unit) return null;

  return (
    <aside
      aria-label={label}
      className={className}
      data-ad-placement={placement}
      data-ad-unit={unit.key}
      data-ad-config={AD_REPORTING_VERSION}
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase text-[#82938a]">{label}</p>
      <div
        ref={slotRef}
        className="mx-auto flex items-center justify-center"
        style={{minHeight: unit.height, width: unit.width, maxWidth: loadEnabled ? undefined : "100%"}}
        data-adsterra-unit={unit.key}
      />
    </aside>
  );
}

type AdsterraDisplayBannerProps = {
  label?: string;
  placement: "horizontal" | "rectangle";
};

export function AdsterraDisplayBanner({label, placement}: AdsterraDisplayBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(false);
  const [unit, setUnit] = useState<AdsterraBannerUnit | null>(
    placement === "rectangle" ? ADSTERRA_BANNER_UNITS.rectangle300 : null
  );

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !containerRef.current) return;
    return observeAdContainerWidth(containerRef.current, (width) => {
      setUnit(selectAdsterraDisplayUnit(placement, width));
      setMeasured(true);
    });
  }, [placement]);

  if (!ADSTERRA_ENABLED) return null;

  return (
    <div ref={containerRef} className="min-w-0 w-full" data-ad-container={placement}>
      <BannerSlot
        className={placement === "rectangle" ? "my-10" : "my-6 min-h-0"}
        label={label}
        placement={placement}
        unit={unit}
        loadEnabled={measured}
      />
    </div>
  );
}

function FixedBanner({label, media, placement, position, unit, dismissLabel}: {
  label?: string;
  media: string;
  placement: string;
  position: string;
  unit: AdsterraBannerUnit;
  dismissLabel?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(media);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [media]);

  if (dismissed) return null;
  return (
    <div className={position} data-ad-placement={placement}>
      {enabled && dismissLabel ? (
        <button
          type="button"
          className="absolute bottom-full right-0 flex size-11 items-center justify-center rounded-t border border-[#46534d] bg-[#0d0f0e] text-white hover:bg-[#223329]"
          onClick={() => setDismissed(true)}
          aria-label={dismissLabel}
          title={dismissLabel}
        >
          <X aria-hidden="true" size={18} />
        </button>
      ) : null}
      {enabled ? <BannerSlot label={label} placement={`${placement}-creative`} unit={unit} /> : null}
    </div>
  );
}

const closeAd: Record<Locale, string> = {
  en: "Close advertisement",
  ja: "広告を閉じる",
  ru: "Закрыть рекламу",
  de: "Werbung schließen",
  "pt-br": "Fechar anúncio",
  "zh-cn": "关闭广告",
  "zh-tw": "關閉廣告",
  pl: "Zamknij reklamę"
};

export function AdsterraGlobalInventory({
  label = "Advertisement",
  locale = "en"
}: {label?: string; locale?: Locale} = {}) {
  if (!ADSTERRA_ENABLED) return null;
  return (
    <>
      {ADSTERRA_MOBILE_STICKY_ENABLED ? (
        <FixedBanner
          label={label}
          media="(max-width: 467px)"
          placement="mobile-sticky"
          dismissLabel={closeAd[locale]}
          position="fixed inset-x-0 bottom-0 z-[70] mx-auto w-[320px] border-t border-[#2c3631] bg-[#0d0f0e] pt-1 min-[468px]:hidden"
          unit={ADSTERRA_BANNER_UNITS.mobile320}
        />
      ) : null}
      <FixedBanner
        label={label}
        media="(min-width: 1600px) and (min-height: 500px)"
        placement="left-rail"
        position="fixed left-3 top-24 z-40 hidden min-[1600px]:block"
        unit={ADSTERRA_BANNER_UNITS.rail300}
      />
      {ADSTERRA_RIGHT_RAIL_ENABLED ? (
        <FixedBanner
          label={label}
          media="(min-width: 1600px) and (min-height: 760px)"
          placement="right-rail"
          position="fixed right-3 top-24 z-40 hidden min-[1600px]:block"
          unit={ADSTERRA_BANNER_UNITS.rail600}
        />
      ) : null}
    </>
  );
}
