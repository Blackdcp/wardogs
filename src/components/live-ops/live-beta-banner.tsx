import {AlertTriangle, ArrowRight, CalendarClock, Download, Radio} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {CURRENT_EVENT} from "@/features/live-ops/current-event";
import {EventCountdown, type EventCountdownLabels} from "./event-countdown";

type LiveBetaBannerProps = {
  compact?: boolean;
};

export async function LiveBetaBanner({compact = false}: LiveBetaBannerProps) {
  const t = await getTranslations("liveOps");
  const countdownLabels: EventCountdownLabels = {
    starts: t("countdown.starts"),
    ends: t("countdown.ends"),
    earlyAccess: t("countdown.earlyAccess"),
    reached: t("countdown.reached"),
    checking: t("countdown.checking"),
    scheduleOnly: t("countdown.scheduleOnly"),
    exactTimeUnconfirmed: t("countdown.exactTimeUnconfirmed"),
    dateValue: t("countdown.dateValue"),
    days: t("countdown.days"),
    hours: t("countdown.hours"),
    minutes: t("countdown.minutes"),
    seconds: t("countdown.seconds")
  };

  return (
    <section
      aria-labelledby={compact ? "guide-live-beta-title" : "home-live-beta-title"}
      className="border-b border-[#31543f] bg-[#13251b]"
      data-live-event={CURRENT_EVENT.id}
    >
      <div className={`site-container ${compact ? "max-w-4xl py-5" : "py-7"}`}>
        <div className={`grid items-center gap-5 ${compact ? "md:grid-cols-[1fr_auto]" : "lg:grid-cols-2 xl:grid-cols-[1.15fr_0.72fr_1fr_auto]"}`}>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#7ddd9f]">
              <Radio aria-hidden="true" className="size-4" />
              {t("eyebrow")}
            </p>
            <h2
              className={`${compact ? "text-2xl" : "text-3xl"} display-font mt-2 leading-tight text-white`}
              id={compact ? "guide-live-beta-title" : "home-live-beta-title"}
            >
              {t("title")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c6d6cc]">{t("description")}</p>
          </div>

          {!compact ? (
            <EventCountdown
              labels={countdownLabels}
              schedule={{startsAt: CURRENT_EVENT.startsAt, endsAt: CURRENT_EVENT.endsAt, earlyAccessDate: CURRENT_EVENT.earlyAccessAt}}
            />
          ) : null}

          {!compact ? (
            <div className="border-y border-[#31543f] py-4 xl:border-y-0 xl:border-l xl:py-0 xl:pl-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase text-[#8ba99a]"><CalendarClock aria-hidden="true" className="size-4" />{t("windowLabel")}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{t("windowValue")}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase text-[#8ba99a]"><Download aria-hidden="true" className="size-4" />{t("accessLabel")}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{t("accessValue")}</dd>
                </div>
              </dl>
              <div className="col-span-2 flex items-start gap-2 text-xs leading-5 text-[#d6c47f]">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{t("closedBetaNote")}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link className="inline-flex min-h-11 items-center gap-2 border border-[#68bd8d] bg-[#24583a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2c6a46]" href={`/guides/${CURRENT_EVENT.accessGuideSlug}`}>
              {t("accessCta")}<ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="inline-flex min-h-11 items-center border border-[#4b6255] px-4 py-2 text-sm font-semibold text-[#dbe7df] hover:border-[#79d19c] hover:text-white" href={`/guides/${CURRENT_EVENT.issuesGuideSlug}`}>
              {t("issuesCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
