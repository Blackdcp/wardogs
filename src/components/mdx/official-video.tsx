"use client";

import {useState} from "react";
import {Play} from "lucide-react";
import {useTranslations} from "next-intl";
import {assetPath} from "@/lib/assets";

const approvedVideoIds = new Set(["hVtmnaUCpuQ", "-k6IV0ITLDo", "eAE9LOV-p3s", "83AVH6FtemY"]);

export function OfficialVideo({id, title, className = "my-8"}: {id: string; title: string; className?: string}) {
  const [active, setActive] = useState(false);
  const t = useTranslations("article");
  if (!approvedVideoIds.has(id)) return null;

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
            style={{backgroundImage: `linear-gradient(rgba(10,13,11,.45), rgba(10,13,11,.88)), url('${assetPath("/images/wardogs-hero.jpg")}')`}}
            onClick={() => setActive(true)}
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
