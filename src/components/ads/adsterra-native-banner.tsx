"use client";

import {useEffect, useRef, useState, useSyncExternalStore} from "react";
import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED} from "@/features/ads/ad-policy";
import {ADSTERRA_BANNER_SANDBOX, ADSTERRA_FRAME_VERSION, getAdsterraFrameOrigin} from "@/features/ads/adsterra-banner";
import {ADSTERRA_NATIVE_ZONE_ID, getAdsterraNativeFrameHeight} from "@/features/ads/adsterra-native";
export {ADSTERRA_NATIVE_CONTAINER_ID, ADSTERRA_NATIVE_SCRIPT_SRC, ADSTERRA_NATIVE_ZONE_ID} from "@/features/ads/adsterra-native";

const subscribeToFrameOrigin = () => () => {};
const getFrameOriginSnapshot = () => getAdsterraFrameOrigin(window.location.origin);
const getServerFrameOrigin = () => getAdsterraFrameOrigin();

type AdsterraNativeBannerProps = {
  label: string;
};

export function AdsterraNativeBanner({label}: AdsterraNativeBannerProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameOrigin = useSyncExternalStore(subscribeToFrameOrigin, getFrameOriginSnapshot, getServerFrameOrigin);
  const noFillTimer = useRef<number | null>(null);
  const filled = useRef(false);
  const [height, setHeight] = useState(320);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED) return;
    const onMessage = (event: MessageEvent) => {
      const nextHeight = getAdsterraNativeFrameHeight(event, frameOrigin, frameRef.current?.contentWindow ?? null);
      if (nextHeight === null) return;
      filled.current = true;
      if (noFillTimer.current !== null) window.clearTimeout(noFillTimer.current);
      setHeight(nextHeight);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (noFillTimer.current !== null) window.clearTimeout(noFillTimer.current);
    };
  }, [frameOrigin]);

  const onLoad = () => {
    if (filled.current) return;
    if (noFillTimer.current !== null) window.clearTimeout(noFillTimer.current);
    noFillTimer.current = window.setTimeout(() => {
      if (!filled.current) setActive(false);
    }, 30_000);
  };

  if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED || !active) return null;

  return (
    <section
      aria-label={label}
      className="my-10 border-y border-[#2c3631] py-4"
      data-ad-slot="adsterra-native"
    >
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8e87]">
        {label}
      </p>
      <iframe
        ref={frameRef}
        title={label}
        src={`${frameOrigin}/api/ad-frame/${ADSTERRA_NATIVE_ZONE_ID}?v=${ADSTERRA_FRAME_VERSION}`}
        sandbox={ADSTERRA_BANNER_SANDBOX}
        className="block w-full border-0"
        height={height}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={onLoad}
        onError={() => setActive(false)}
        data-adsterra-native-sandbox={ADSTERRA_NATIVE_ZONE_ID}
      />
    </section>
  );
}
