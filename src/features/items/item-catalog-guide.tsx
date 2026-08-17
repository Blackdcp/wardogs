import {AlertTriangle, CheckCircle2, ExternalLink} from "lucide-react";
import type {Locale} from "@/config/site";
import {publicRoutePath} from "@/lib/public-url";
import type {CatalogGuide, CatalogRow} from "./item-catalog-guides";
import {getCatalogEntryCount} from "./item-catalog-guides";

export type RecordLinkedCatalogRow = CatalogRow & {
  recordSlug?: string;
  detailStatus?: "inline" | "planned" | "published";
  detailHref?: `/items/${"weapons" | "vehicles"}/${string}`;
};

export type RecordLinkedCatalogGuide = Omit<CatalogGuide, "sections"> & {
  sections: Array<Omit<CatalogGuide["sections"][number], "rows"> & {rows: RecordLinkedCatalogRow[]}>;
};

type ItemCatalogGuideProps = {
  guide: CatalogGuide;
  locale: Locale;
};

export function ItemCatalogGuide({guide}: ItemCatalogGuideProps) {
  const sectionOffsets = guide.sections.map((_, sectionIndex) =>
    guide.sections.slice(0, sectionIndex).reduce((total, section) => total + section.rows.length, 0)
  );

  return (
    <>
      <section className="border-b border-[#2c3631] bg-[#111512]">
        <div className="site-container py-10 md:py-12">
          <div className="grid gap-4 border border-[#3b463f] bg-[#171d1a] p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
              <p className="font-mono text-xs uppercase text-[#d9a93a]">Catalogue snapshot</p>
              <p className="mt-2 text-lg font-semibold text-white">{guide.countLabel}</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a8b4ae]">{guide.disclaimer}</p>
            </div>
            <div className="border-l border-[#3b463f] pl-4 md:min-w-48">
              <p className="text-xs uppercase text-[#7f8e87]">Data as of</p>
              <p className="mt-2 font-mono text-sm text-[#d9a93a]">{guide.dataAsOf}</p>
              <p className="mt-2 text-xs text-[#7f8e87]">{getCatalogEntryCount(guide.id)} recorded rows</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-12 md:py-16" aria-label={`${guide.title} tables`}>
        <div className="space-y-12">
          {guide.sections.map((section, sectionIndex) => (
            <section key={section.title} aria-labelledby={`${guide.id}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <div className="max-w-3xl">
                <h2
                  className="display-font text-3xl text-white md:text-4xl"
                  id={`${guide.id}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{section.description}</p>
              </div>
              <div
                aria-label={`${section.title} catalogue table. Scroll horizontally to view every column.`}
                className="mt-5 overflow-x-auto border border-[#2c3631] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#68bd8d]"
                role="region"
                tabIndex={0}
              >
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <caption className="sr-only">{section.title}: {section.description}</caption>
                  <thead className="bg-[#1b221f] text-xs uppercase text-[#91a199]">
                    <tr>
                      {guide.columns.map((column) => (
                        <th className="border-b border-[#38433e] px-4 py-3 font-semibold" key={column} scope="col">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c3631] bg-[#131815]">
                    {section.rows.map((catalogueRow, rowIndex) => {
                      const rowPosition = sectionOffsets[sectionIndex] + rowIndex + 1;
                      const linkedRow = catalogueRow as RecordLinkedCatalogRow;
                      const firstCellHref = linkedRow.detailStatus === "published"
                        ? linkedRow.detailHref && publicRoutePath(`/en${linkedRow.detailHref}`)
                        : (linkedRow.detailStatus === "planned" || linkedRow.detailStatus === "inline") && linkedRow.recordSlug
                          ? `#record-${guide.id}-${linkedRow.recordSlug}`
                          : undefined;
                      return (
                        <tr className="transition-colors hover:bg-[#19211d]" id={`catalog-${rowPosition}`} key={`${section.title}-${catalogueRow.cells[0]}`}>
                          {catalogueRow.cells.map((cell, cellIndex) => (
                            cellIndex === 0 ? (
                              <th className="px-4 py-3 font-semibold text-white" key={`${cell}-${cellIndex}`} scope="row">
                                {firstCellHref ? (
                                  <a className="underline decoration-[#397b59] underline-offset-4 hover:text-[#7fd0a1]" href={firstCellHref}>{cell}</a>
                                ) : cell}
                              </th>
                            ) : (
                              <td className="px-4 py-3 text-[#b6c1bb]" key={`${cell}-${cellIndex}`}>{cell}</td>
                            )
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-[#2c3631] bg-[#111512]">
        <div className="site-container grid gap-10 py-12 md:grid-cols-2 md:py-16">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="size-5 text-[#68bd8d]" />
              <h2 className="display-font text-3xl text-white">What the catalogue means</h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[#c5d0ca]">
              {guide.insights.map((insight) => <li className="border-l border-[#4d946d] pl-4" key={insight}>{insight}</li>)}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle aria-hidden="true" className="size-5 text-[#d9a93a]" />
              <h2 className="display-font text-3xl text-white">What is not confirmed</h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[#c5d0ca]">
              {guide.unknowns.map((unknown) => <li className="border-l border-[#927328] pl-4" key={unknown}>{unknown}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="site-container py-12 md:py-16" aria-labelledby={`${guide.id}-official-sources`}>
        <h2 className="display-font text-3xl text-white" id={`${guide.id}-official-sources`}>Official game sources</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a8b4ae]">
          Official pages confirm the game, platform, and high-level systems. Catalogue rows remain labeled as an Alpha snapshot until official final data is published.
        </p>
        <ul className="mt-5 grid gap-px bg-[#2c3631] md:grid-cols-3">
          {guide.officialSources.map((source) => (
            <li className="bg-[#151b18] p-4" key={source.url}>
              <a className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#7fd0a1] hover:text-white" href={source.url} rel="noreferrer" target="_blank">
                {source.label}<ExternalLink aria-hidden="true" size={15} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
