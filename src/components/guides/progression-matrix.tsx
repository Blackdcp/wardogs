import {ArrowRight, ExternalLink} from "lucide-react";
import type {Locale} from "@/config/site";
import {getProgressionMatrix} from "@/features/guides/progression-matrix";

export function ProgressionMatrix({slug, locale}: {slug: string; locale: Locale}) {
  const data = getProgressionMatrix(slug, locale);
  if (!data) return null;
  const {ui} = data;
  return (
    <section aria-labelledby="progression-matrix-title" className="my-8 min-w-0 border-y border-[#354039] py-6" data-progression-matrix={slug} style={{overflowWrap: "anywhere"}}>
      <h2 className="display-font text-2xl text-white" id="progression-matrix-title">{ui.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#c3cec7]">{ui.scope}</p>
      <p className="mt-3 border-l-2 border-[#d9a93a] pl-3 text-sm leading-6 text-[#d7ded9]">{ui.purchaseNote}</p>
      <div className="mt-5 divide-y divide-[#354039]">
        {data.groups.map((group) => (
          <details key={group.id} open={group.id === "career" || group.id === "driver"} data-matrix-track={group.id}>
            <summary className="cursor-pointer py-3 font-semibold text-white">{group.label}</summary>
            {group.rows.length ? (
              <div className="mb-4 max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label={`${group.label}: ${ui.title}`}>
                <table className="block w-full border-collapse text-left text-sm md:table">
                  <caption className="sr-only">{group.label}: {ui.title}</caption>
                  <thead className="hidden text-xs text-[#8b9992] md:table-header-group"><tr>{[ui.item, ui.field, ui.before, ui.season1, ui.season2].map((heading) => <th scope="col" key={heading} className="px-2 py-2">{heading}</th>)}</tr></thead>
                  <tbody className="block md:table-row-group">{group.rows.map((row) => (
                    <tr className="grid grid-cols-2 border-t border-[#2c3631] py-2 text-[#d7ded9] md:table-row md:py-0" key={row.id} data-matrix-row={row.id}>
                      <th scope="row" className="col-span-2 px-2 py-1 font-medium md:py-2">{row.entity}</th>
                      <td className="col-span-2 px-2 py-1 text-xs text-[#8b9992] md:py-2 md:text-sm">{row.field}</td>
                      <td className="hidden px-2 py-2 text-[#8b9992] md:table-cell">{row.previousValue}</td>
                      <td className="px-2 py-1 md:py-2"><span className="mb-1 block text-xs text-[#8b9992] md:hidden">{ui.season1}</span>{row.currentValue}</td>
                      <td className="px-2 py-1 text-[#e6bd5d] md:py-2" data-season-two-state={row.seasonTwoState}><span className="mb-1 block text-xs text-[#8b9992] md:hidden">{ui.season2}</span>{ui.unknown}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <p className="pb-4 text-sm leading-6 text-[#a8b4ae]">{ui.empty}</p>}
          </details>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#a8b4ae]">
        <p><a className="inline-flex min-h-11 items-center gap-1 text-[#79d19c] hover:text-white" href={data.sourceUrl} title={ui.source} target="_blank" rel="noreferrer">{ui.source}<ExternalLink aria-hidden="true" size={13} /></a><br />{ui.checked}: {data.checkedAt}</p>
        <p><a className="inline-flex min-h-11 items-center gap-1 text-[#79d19c] hover:text-white" href={data.seasonTwoSourceUrl} title={ui.transition} target="_blank" rel="noreferrer">{ui.transition}<ExternalLink aria-hidden="true" size={13} /></a><br />{ui.checked}: {data.seasonTwoCheckedAt}</p>
        <a href={`/${locale}/tools/progression-route`} title={`${ui.route}: ${ui.title}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-[#79d19c] hover:text-white">{ui.route}<ArrowRight aria-hidden="true" size={16} /></a>
      </div>
    </section>
  );
}
