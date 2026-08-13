import {ArrowRight, ExternalLink} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {officialLinks} from "@/config/site";
import {ButtonLink} from "@/components/ui/button-link";

export async function FinalCta() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="final-cta-title" className="border-b border-[#4d795f] bg-[#244332] py-14 sm:py-16">
      <div className="site-container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[#f1d58c]">{t("home.final.eyebrow")}</p>
          <h2 id="final-cta-title" className="display-font mt-3 text-3xl leading-tight text-white sm:text-4xl">
            {t("home.finalTitle")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#d3e5d9] sm:text-base">{t("home.finalDescription")}</p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/guides" variant="light" className="w-full sm:w-auto">
            {t("home.final.guidesCta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <ButtonLink href={officialLinks.steam} external variant="secondary" className="w-full border-[#71947e] bg-[#183024] sm:w-auto">
            {t("home.final.steamCta")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
