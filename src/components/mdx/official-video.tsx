"use client";

import {useState} from "react";
import {Play} from "lucide-react";
import {useTranslations} from "next-intl";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";

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
  "Em9HAhrZFeI"
]);

export function OfficialVideo({id, title, className = "my-8"}: {id: string; title: string; className?: string}) {
  const [active, setActive] = useState(false);
  const t = useTranslations("article");
  if (!approvedVideoIds.has(id)) return null;

  function startVideo() {
    trackAnalyticsEvent(ANALYTICS_EVENTS.videoStart, {video_id: id, video_title: title});
    setActive(true);
  }

  return (
    <figure className={`${className} overflow-hidden border border-[#2c3631] bg-black`}>
      <div className="aspect-video">
        {active ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="group flex size-full flex-col items-center justify-center gap-5 bg-cover bg-center px-6 text-center"
            style={{backgroundImage: `linear-gradient(rgba(10,13,11,.45), rgba(10,13,11,.88)), url('${videoThumbnailUrl(id)}')`}}
            onClick={startVideo}
            aria-label={`${t("videoConsent")}: ${title}`}
          >
            <span className="flex size-16 items-center justify-center rounded-full border border-[#75c596] bg-[#397b59] text-white transition group-hover:scale-105">
              <Play aria-hidden="true" fill="currentColor" size={26} />
            </span>
            <span className="display-font text-xl text-white md:text-2xl">{title}</span>
            <span className="text-xs uppercase text-[#c7d2cc]">{t("videoConsent")}</span>
          </button>
        )}
      </div>
    </figure>
  );
}
