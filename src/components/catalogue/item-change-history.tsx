import {ExternalLink} from "lucide-react";
import type {Locale} from "@/config/site";
import type {CatalogueChangeHistory} from "@/features/catalogue/catalogue-types";
import {getItemUi} from "@/features/items/item-ui";
import {StatusBadge} from "@/components/ui/status-badge";

export function ItemChangeHistory({locale, changes}: {locale: Locale; changes: readonly CatalogueChangeHistory[]}) {
  if (changes.length === 0) return null;

  const ui = getItemUi(locale);
  const chronologicalChanges = [...changes].sort((left, right) => left.verifiedAt.localeCompare(right.verifiedAt));

  return (
    <section className="mt-10" aria-labelledby="item-change-history-title" data-item-change-history>
      <p className="text-xs font-semibold uppercase text-[#68bd8d]">{ui.currentChanges}</p>
      <h2 className="display-font mt-2 text-3xl text-white" id="item-change-history-title">{ui.changeHistory}</h2>
      <ol className="mt-5 divide-y divide-[#303b35] border-y border-[#303b35]">
        {chronologicalChanges.map((change) => (
          <li className="py-5" key={`${change.verifiedAt}-${change.field}-${change.currentValue}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-white">{change.field}</h3>
              <StatusBadge tone="accent">{change.effectiveBuild}</StatusBadge>
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.oldValue}</dt>
                <dd className="mt-1 text-sm text-[#b8c3bd]"><del>{change.previousValue}</del></dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.newValue}</dt>
                <dd className="mt-1 text-sm font-semibold text-[#8addaa]">{change.currentValue}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{ui.effectiveBuild}</dt>
                <dd className="mt-1 text-sm text-[#d8dfdb]">{change.effectiveBuild} · {change.verifiedAt}</dd>
              </div>
            </dl>
            {change.note ? <p className="mt-4 text-sm leading-6 text-[#aab7b0]">{change.note}</p> : null}
            <a
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#7fd0a1] hover:text-white"
              href={change.sourceUrl}
              rel="noreferrer"
              target="_blank"
              title={ui.evidenceSource}
            >
              {ui.evidenceSource}<ExternalLink aria-hidden="true" size={14} />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
