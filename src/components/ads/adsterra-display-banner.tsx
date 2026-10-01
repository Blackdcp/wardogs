"use client";

import {useEffect, useState, useSyncExternalStore} from "react";
import {X} from "lucide-react";
import {ADSTERRA_ENABLED, ADSTERRA_LEADERBOARD_ENABLED, ADSTERRA_MOBILE_STICKY_ENABLED, ADSTERRA_RIGHT_RAIL_ENABLED} from "@/features/ads/ad-policy";
import {ADSTERRA_BANNER_SANDBOX, ADSTERRA_BANNER_UNITS, getAdsterraFrameOrigin, type AdsterraBannerUnit} from "@/features/ads/adsterra-banner";
export {ADSTERRA_BANNER_UNITS, buildAdsterraBannerDocument} from "@/features/ads/adsterra-banner";
export type {AdsterraBannerUnit} from "@/features/ads/adsterra-banner";

export function selectHorizontalBannerUnit(viewportWidth: number): AdsterraBannerUnit | null {
  if (!ADSTERRA_ENABLED) return null;
  if (viewportWidth >= 728) return ADSTERRA_LEADERBOARD_ENABLED ? ADSTERRA_BANNER_UNITS.leaderboard728 : null;
  if (viewportWidth >= 468) return ADSTERRA_BANNER_UNITS.horizontal468;
  return null;
}

type BannerSlotProps = {
  className?: string;
  label?: string;
  placement: string;
  unit: AdsterraBannerUnit | null;
};

const subscribeToFrameOrigin = () => () => {};
const getFrameOriginSnapshot = () => getAdsterraFrameOrigin(window.location.origin);
const getServerFrameOrigin = () => getAdsterraFrameOrigin();

function BannerSlot({className = "", label = "Advertisement", placement, unit}: BannerSlotProps) {
  const frameOrigin = useSyncExternalStore(subscribeToFrameOrigin, getFrameOriginSnapshot, getServerFrameOrigin);
  if (!ADSTERRA_ENABLED || !unit) return null;
  return (
    <aside
      aria-label={label}
      className={className}
      data-ad-placement={placement}
      data-ad-unit={unit.key}
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase text-[#718079]">{label}</p>
      <div className="mx-auto flex max-w-full items-center justify-center overflow-hidden" style={{height: unit.height, width: unit.width}}>
        <iframe
          key={unit.key}
          title={label}
          width={unit.width}
          height={unit.height}
          className="border-0"
          sandbox={ADSTERRA_BANNER_SANDBOX}
          src={`${frameOrigin}/api/ad-frame/${unit.key}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          data-adsterra-sandbox={unit.key}
        />
      </div>
    </aside>
  );
}

type AdsterraDisplayBannerProps = {
  label?: string;
  placement: "horizontal" | "rectangle";
};

export function AdsterraDisplayBanner({label, placement}: AdsterraDisplayBannerProps) {
  const [unit, setUnit] = useState<AdsterraBannerUnit | null>(
    placement === "rectangle" ? ADSTERRA_BANNER_UNITS.rectangle300 : null
  );

  useEffect(() => {
    if (!ADSTERRA_ENABLED || placement !== "horizontal") return;
    const update = () => setUnit(selectHorizontalBannerUnit(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [placement]);

  if (!ADSTERRA_ENABLED || !unit) return null;

  return (
    <BannerSlot
      className={placement === "rectangle" ? "my-10" : "my-6 min-h-0"}
      label={label}
      placement={placement}
      unit={unit}
    />
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
      {enabled && dismissLabel ? <button type="button" className="absolute bottom-full right-0 flex size-11 items-center justify-center rounded-t border border-[#46534d] bg-[#0d0f0e] text-white hover:bg-[#223329]" onClick={() => setDismissed(true)} aria-label={dismissLabel} title={dismissLabel}><X aria-hidden="true" size={18} /></button> : null}
      {enabled ? <BannerSlot label={label} placement={`${placement}-creative`} unit={unit} /> : null}
    </div>
  );
}

const closeAd: Record<string, string> = {en: "Close advertisement", ja: "広告を閉じる", ru: "Закрыть рекламу", de: "Werbung schließen", "pt-br": "Fechar anúncio", "zh-cn": "关闭广告", "zh-tw": "關閉廣告", pl: "Zamknij reklamę"};

export function AdsterraGlobalInventory({label = "Advertisement", locale = "en"}: {label?: string; locale?: string} = {}) {
  if (!ADSTERRA_ENABLED) return null;
  return (
    <>
      {ADSTERRA_MOBILE_STICKY_ENABLED ? <FixedBanner
        label={label}
        media="(max-width: 467px)"
        placement="mobile-sticky"
        dismissLabel={closeAd[locale] ?? closeAd.en}
        position="fixed inset-x-0 bottom-0 z-[70] mx-auto w-[320px] border-t border-[#2c3631] bg-[#0d0f0e] pt-1 min-[468px]:hidden"
        unit={ADSTERRA_BANNER_UNITS.mobile320}
      /> : null}
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
