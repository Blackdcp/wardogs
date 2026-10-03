"use client";

import {useState, useSyncExternalStore} from "react";
import {ExternalLink, Play} from "lucide-react";
import {useTranslations} from "next-intl";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";
import {parseVideoStartTime} from "@/features/videos/video-start-time";

function subscribeToVideoUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function readVideoUrlStart() {
  return parseVideoStartTime(new URLSearchParams(window.location.search).get("t"));
}

const noVideoUrlSubscription = () => () => {};
const defaultVideoUrlStart = () => 0;

const approvedVideoIds = new Set([
  "hVtmnaUCpuQ",
  "ugkuP4a3xk4",
  "-k6IV0ITLDo",
  "eAE9LOV-p3s",
  "83AVH6FtemY",
  "utnQT_Jmd5w",
  "3EynP3GjopE",
  "3Jwi15nA-gg",
  "UKL0hwMRT9s",
  "tF4-GnGlo4I",
  "Msg78ysR_hQ",
  "F5YU7eaQHBU",
  "fupZGU7LJaU",
  "2E-KNIugA2M",
  "wcsY2EeIlyc",
  "ZFRrDSru7Kg",
  "9mSvZyAk62E",
  "cSn5IGknapM",
  "Em9HAhrZFeI",
  "3rdbnh8P0T0",
  "xc6JMDhlzVQ",
  "CfbKirbnhu8",
  "8Mgl4FRekbg",
  "f-B-26p8soc",
  "XUyP1GLUF5o"
]);

export function OfficialVideo({id, title, className = "my-8", startSeconds = 0, endSeconds, usePageTimestamp = false}: {id: string; title: string; className?: string; startSeconds?: number; endSeconds?: number; usePageTimestamp?: boolean}) {
  const [active, setActive] = useState(false);
  const pageStart = useSyncExternalStore(
    usePageTimestamp ? subscribeToVideoUrl : noVideoUrlSubscription,
    usePageTimestamp ? readVideoUrlStart : defaultVideoUrlStart,
    defaultVideoUrlStart
  );
  const t = useTranslations("article");
  if (!approvedVideoIds.has(id)) return null;
  const requestedStart = usePageTimestamp ? pageStart : startSeconds;
  const start = Number.isSafeInteger(requestedStart) && requestedStart > 0 && requestedStart < 86400 ? requestedStart : 0;
  const end = typeof endSeconds === "number" && Number.isSafeInteger(endSeconds) && endSeconds > start && endSeconds < 86400 ? endSeconds : null;
  const timing = `${start ? `&start=${start}` : ""}${end ? `&end=${end}` : ""}`;

  function startVideo() {
    trackAnalyticsEvent(ANALYTICS_EVENTS.videoEmbedOpen, {video_id: id, video_title: title});
    setActive(true);
  }

  return (
    <figure className={`${className} overflow-hidden border border-[#2c3631] bg-black`}>
      <div className="aspect-video">
        {active ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${timing}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="group flex size-full flex-col items-center justify-center gap-3 bg-cover bg-center px-4 text-center sm:gap-5 sm:px-6"
            style={{backgroundImage: `linear-gradient(rgba(10,13,11,.45), rgba(10,13,11,.88)), url('${videoThumbnailUrl(id)}')`}}
            onClick={startVideo}
            aria-label={`${t("videoConsent")}: ${title}`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#75c596] bg-[#397b59] text-white transition group-hover:scale-105 sm:size-16">
              <Play aria-hidden="true" fill="currentColor" size={26} />
            </span>
            <span className="display-font break-words text-base leading-snug text-white sm:text-xl md:text-2xl">{title}</span>
            <span className="text-xs uppercase text-[#c7d2cc]">{t("videoConsent")}</span>
          </button>
        )}
      </div>
      <figcaption className="border-t border-[#2c3631] px-4 py-2 text-sm text-[#79d19c]">
        <a
          className="inline-flex min-h-11 items-center gap-2 break-words underline underline-offset-4"
          href={`https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`${t("watch")}: ${title}`}
        >
          {t("watch")} (YouTube)<ExternalLink aria-hidden="true" className="size-4 shrink-0" />
        </a>
      </figcaption>
    </figure>
  );
}
