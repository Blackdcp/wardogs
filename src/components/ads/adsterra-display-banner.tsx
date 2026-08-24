"use client";

import {useEffect, useRef, useState} from "react";

export type AdsterraBannerUnit = {
  height: number;
  key: string;
  src: string;
  width: number;
};

function bannerUnit(key: string, width: number, height: number): AdsterraBannerUnit {
  return {height, key, src: `https://arkgleamfox.com/${key}/invoke.js`, width};
}

export const ADSTERRA_BANNER_UNITS = {
  horizontal468: bannerUnit("c6d1a3e01dc90e01385598a3c84dcaea", 468, 60),
  rectangle300: bannerUnit("3342dc928824e6ed5c01555e7f9e9e0f", 300, 250),
  rail300: bannerUnit("f6fc5667adc4cb97634312e962c199c5", 160, 300),
  rail600: bannerUnit("b2a91c3759bccd2386763c1c71b7d7ad", 160, 600),
  mobile320: bannerUnit("174695845dde18793bf09d3361f8af30", 320, 50),
  leaderboard728: bannerUnit("035c3a3eb2cdc2bcb65b641e981d4874", 728, 90)
} as const;

type AdsterraWindow = Window & typeof globalThis & {
  atOptions?: Record<string, unknown>;
  wardogsAdsterraBannerQueue?: Promise<void>;
};

function loadBanner(container: HTMLElement, unit: AdsterraBannerUnit) {
  const browser = window as AdsterraWindow;
  const run = () => new Promise<void>((resolve) => {
    if (!container.isConnected) {
      resolve();
      return;
    }

    browser.atOptions = {
      key: unit.key,
      format: "iframe",
      height: unit.height,
      width: unit.width,
      params: {}
    };

    const script = document.createElement("script");
    script.src = unit.src;
    script.async = false;
    script.dataset.adsterraBanner = unit.key;
    const finish = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };
    const timeoutId = window.setTimeout(finish, 8_000);
    script.addEventListener("load", finish, {once: true});
    script.addEventListener("error", finish, {once: true});
    container.appendChild(script);
  });

  const next = (browser.wardogsAdsterraBannerQueue ?? Promise.resolve())
    .catch(() => undefined)
    .then(run);
  browser.wardogsAdsterraBannerQueue = next;
  return next;
}

export function selectHorizontalBannerUnit(viewportWidth: number): AdsterraBannerUnit | null {
  if (viewportWidth >= 728) return ADSTERRA_BANNER_UNITS.leaderboard728;
  if (viewportWidth >= 468) return ADSTERRA_BANNER_UNITS.horizontal468;
  return null;
}

type BannerSlotProps = {
  className?: string;
  label?: string;
  placement: string;
  unit: AdsterraBannerUnit | null;
};

function BannerSlot({className = "", label = "Advertisement", placement, unit}: BannerSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !unit) return;
    container.replaceChildren();
    void loadBanner(container, unit);
    return () => container.replaceChildren();
  }, [unit]);

  return (
    <aside
      aria-label={label}
      className={className}
      data-ad-placement={placement}
      data-ad-unit={unit?.key ?? "responsive"}
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase text-[#718079]">{label}</p>
      <div className="mx-auto flex max-w-full items-center justify-center overflow-hidden" style={unit ? {height: unit.height, width: unit.width} : undefined}>
        <div ref={containerRef} />
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
    if (placement !== "horizontal") return;
    const update = () => setUnit(selectHorizontalBannerUnit(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [placement]);

  if (!unit) return null;

  return (
    <BannerSlot
      className={placement === "rectangle" ? "my-10" : "my-6 min-h-0"}
      label={label}
      placement={placement}
      unit={unit}
    />
  );
}

function FixedBanner({label, media, placement, position, unit}: {
  label?: string;
  media: string;
  placement: string;
  position: string;
  unit: AdsterraBannerUnit;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(media);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [media]);

  return (
    <div className={position} data-ad-placement={placement}>
      {enabled ? <BannerSlot label={label} placement={`${placement}-creative`} unit={unit} /> : null}
    </div>
  );
}

export function AdsterraGlobalInventory({label = "Advertisement"}: {label?: string} = {}) {
  return (
    <>
      <FixedBanner
        label={label}
        media="(max-width: 467px)"
        placement="mobile-sticky"
        position="fixed inset-x-0 bottom-0 z-[70] mx-auto w-[320px] border-t border-[#2c3631] bg-[#0d0f0e] pt-1 min-[468px]:hidden"
        unit={ADSTERRA_BANNER_UNITS.mobile320}
      />
      <FixedBanner
        label={label}
        media="(min-width: 1600px) and (min-height: 500px)"
        placement="left-rail"
        position="fixed left-3 top-24 z-40 hidden min-[1600px]:block"
        unit={ADSTERRA_BANNER_UNITS.rail300}
      />
      <FixedBanner
        label={label}
        media="(min-width: 1600px) and (min-height: 760px)"
        placement="right-rail"
        position="fixed right-3 top-24 z-40 hidden min-[1600px]:block"
        unit={ADSTERRA_BANNER_UNITS.rail600}
      />
      <div aria-hidden="true" className="h-[74px] min-[468px]:hidden" />
    </>
  );
}
