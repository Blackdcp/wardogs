import {ExternalLink} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {officialLinks} from "@/config/site";
import {ButtonLink} from "@/components/ui/button-link";
import {StatusBadge} from "@/components/ui/status-badge";
import {OfficialVideo} from "@/components/mdx/official-video";

const communityVideos = [
  {creator: "FGS", title: "7 Things You NEED To Know About WARDOGS", href: "https://www.youtube.com/watch?v=-k6IV0ITLDo"},
  {creator: "jackfrags", title: "WARDOGS Gameplay and Impressions...", href: "https://www.youtube.com/watch?v=eAE9LOV-p3s"},
  {creator: "FRANKIEonPC", title: "WARDOGS Alpha - Gameplay and Impressions!", href: "https://www.youtube.com/watch?v=83AVH6FtemY"}
] as const;

export async function OfficialMedia() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="official-media-title" className="border-b border-[#26312c] bg-[#0d0f0e] py-16 sm:py-20">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-14">
        <OfficialVideo id="hVtmnaUCpuQ" title={t("home.media.videoTitle")} className="my-0 rounded-[8px]" />

        <div>
          <StatusBadge tone="warning">{t("common.official")}</StatusBadge>
          <p className="mt-5 text-xs font-semibold uppercase text-[#d9a93a]">{t("home.media.eyebrow")}</p>
          <h2 id="official-media-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.media.title")}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#a8b4ae] sm:text-base sm:leading-8">{t("home.media.description")}</p>
          <ButtonLink href={officialLinks.trailer} external variant="secondary" className="mt-7">
            {t("home.media.watch")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </ButtonLink>

          <div className="mt-8 border-t border-[#2a342f] pt-6">
            <p className="text-xs font-semibold uppercase text-[#8e9b95]">{t("home.media.fieldReports")}</p>
            <ul className="mt-3 divide-y divide-[#27312c]">
              {communityVideos.map((video) => (
                <li key={video.href}>
                  <a
                    href={video.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-14 items-center justify-between gap-4 py-3 text-sm text-[#c9d2cd] transition-colors hover:text-white"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-[#79d19c]">{video.creator}</span>
                      <span className="mt-1 block leading-5">{video.title}</span>
                    </span>
                    <ExternalLink aria-hidden="true" className="size-4 shrink-0 text-[#6f7d76] transition-colors group-hover:text-[#79d19c]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
