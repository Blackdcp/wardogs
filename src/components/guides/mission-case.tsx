import {ArrowRight, ExternalLink} from "lucide-react";
import type {Locale} from "@/config/site";
import {getMissionCase} from "@/features/guides/mission-cases";

export function MissionCase({slug, locale}: {slug: string; locale: Locale}) {
  const data = getMissionCase(slug, locale);
  if (!data) return null;
  const {ui} = data;
  const titleId = `mission-case-${data.kind}-title`;
  return (
    <section aria-labelledby={titleId} className="my-8 min-w-0 border-y border-[#354039] py-6" data-mission-case={data.kind} style={{overflowWrap: "anywhere"}}>
      <h2 id={titleId} className="display-font text-2xl text-white">{data.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#d7ded9]">{data.brief}</p>
      <p className="mt-3 border-l-2 border-[#d9a93a] pl-3 text-sm leading-6 text-[#e6bd5d]" data-mission-evidence="hypothetical">{ui.assumption}</p>
      <ol className="mt-5 divide-y divide-[#354039]">
        {data.stages.map((stage, index) => (
          <li className="py-4" key={stage.id} data-mission-stage={stage.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-white">{index + 1}. {stage.title}</h3>
              <p className="text-xs text-[#8ed1aa]">{stage.owner}</p>
            </div>
            <dl className="mt-3 grid gap-3 text-sm leading-6 md:grid-cols-3">
              {[[ui.action, stage.action], [ui.pass, stage.pass], [ui.failure, stage.failure]].map(([label, value]) => (
                <div className="min-w-0" key={label}><dt className="text-xs font-semibold text-[#8b9992]">{label}</dt><dd className="mt-1 text-[#d7ded9]">{value}</dd></div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
      <h3 className="mt-4 text-base font-semibold text-white">{ui.observations}</h3>
      <p className="mt-2 text-sm leading-6 text-[#a8b4ae]" data-mission-observations="unknown">{ui.missing}</p>
      <div className="mt-5 border-t border-[#354039] pt-4" data-mission-calculation="assumed">
        <p className="text-sm leading-6 text-[#a8b4ae]">{ui.calculation}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[[ui.demand, data.plan.demand], [ui.stock, data.plan.stock], [ui.capacity, data.plan.capacity], [ui.remaining, data.calculation.remaining], [ui.trips, data.calculation.trips]].map(([label, value]) => (
            <div className="min-w-0" key={String(label)}><dt className="text-xs text-[#8b9992]">{label}</dt><dd className="mt-1 font-semibold text-white">{value}</dd></div>
          ))}
        </dl>
        <a href={data.plannerHref} title={`${ui.planner}: ${data.title}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-[#79d19c] hover:text-white">{ui.planner}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
      </div>
      <p className="mt-3 text-xs leading-6 text-[#a8b4ae]">{ui.basis}</p>
      <a className="inline-flex min-h-11 items-center gap-1 text-xs text-[#79d19c] hover:text-white" href={data.sourceUrl} title={`${ui.source}: WARDOGS (Steam)`} target="_blank" rel="noreferrer">{ui.source}<ExternalLink aria-hidden="true" size={13} /></a>
    </section>
  );
}
