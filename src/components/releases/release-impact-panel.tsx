import {ExternalLink} from "lucide-react";
import type {Locale} from "@/config/site";
import {getReleaseImpactCopy, getReleaseImpacts} from "@/features/releases/release-impacts";
import {formatLocalizedDate} from "@/lib/localized-date";
import {publicRoutePath} from "@/lib/public-url";

export function ReleaseImpactPanel({locale, path}: {locale: Locale; path: string}) {
  const impacts = getReleaseImpacts(path);
  if (!impacts.length) return null;
  const copy = getReleaseImpactCopy(locale);
  return <section className="my-10 border-y border-[#2c3631] py-6" data-release-impacts="season-2" aria-label={copy.title}>
    <h2 className="display-font text-2xl text-white">{copy.title}</h2>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a8b4ae]">{copy.description}</p>
    <div className={`mt-5 grid items-start gap-4 ${impacts.length > 1 ? "md:grid-cols-2" : ""}`}>
      {impacts.map((impact) => {
        const text = copy.impacts[impact.id];
        return <article key={impact.id} className="min-w-0 rounded border border-[#2c3631] bg-[#151b18] p-4" data-release-impact={impact.id} data-release-status={impact.status}>
          <p className="text-xs font-semibold text-[#d9a93a]">{impact.status === "announced" ? copy.announced : copy.explained}</p>
          <h3 className="mt-2 text-base font-semibold text-white">{text.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#b8c3bd]">{text.summary}</p>
          <details className="mt-3 border-t border-[#2c3631] pt-2">
            <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[#8bb59d] hover:text-white">{copy.details}</summary>
            <p className="text-sm leading-6 text-[#b8c3bd]">{text.action}</p>
            <nav aria-label={`${copy.readNext}: ${text.title}`} className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-1">
              {impact.relatedPaths.filter((href) => href !== path).map((href) => <a className="inline-flex min-h-11 items-center py-2 text-sm text-[#8bb59d] underline underline-offset-4 hover:text-white" href={publicRoutePath(`/${locale}${href}`)} title={copy.links[href]} key={href}>{copy.links[href]}</a>)}
            </nav>
          </details>
          <a className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-[#8bb59d] underline underline-offset-4 hover:text-white" href={impact.sourceUrl} title={`${copy.source} · ${impact.sourceTime}`} target="_blank" rel="noreferrer">{copy.source} · {impact.sourceTime}<ExternalLink aria-hidden="true" className="size-3 shrink-0" /></a>
          <p className="mt-1 text-xs text-[#8b9992]">{copy.checked}: <time dateTime={impact.reviewedAt}>{formatLocalizedDate(impact.reviewedAt, locale)}</time></p>
        </article>;
      })}
    </div>
  </section>;
}
