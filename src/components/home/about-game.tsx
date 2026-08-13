import Image from "next/image";
import {Check} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {assetPath} from "@/lib/assets";

export async function AboutGame() {
  const t = await getTranslations();
  const points = ["teams", "battlefield", "roles"] as const;

  return (
    <section aria-labelledby="about-wardogs-title" className="border-b border-[#26312c] bg-[#111613] py-16 sm:py-20">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-[#36433c] bg-[#090b0a]">
          <Image
            src={assetPath("/images/wardogs-helicopter.jpg")}
            alt={t("home.about.imageAlt")}
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 left-3 rounded-[4px] border border-[#826b2f] bg-[#17130b]/90 px-2.5 py-1 text-xs font-semibold text-[#f1d58c]">
            {t("common.official")}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.about.eyebrow")}</p>
          <h2 id="about-wardogs-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.aboutTitle")}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#bac5bf] sm:text-base sm:leading-8">{t("home.about.bodyOne")}</p>
          <p className="mt-4 text-sm leading-7 text-[#9facA5] sm:text-base sm:leading-8">{t("home.about.bodyTwo")}</p>
          <ul className="mt-7 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-[#d7ded9] sm:text-base">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#69c78f]" />
                <span>{t(`home.about.points.${point}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
