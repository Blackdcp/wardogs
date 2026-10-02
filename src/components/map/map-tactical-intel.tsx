"use client";

import {useState} from "react";
import {Activity, BookOpen, Compass, Crosshair, ExternalLink, HelpCircle, Monitor, ShieldAlert} from "lucide-react";
import type {Locale} from "@/config/site";
import {
  ARTILLERY_155MM_BALLISTICS,
  MORTAR_81MM_BALLISTICS,
  getTacticalIntelCopy
} from "@/features/maps/map-tactical-data";
import {Link} from "@/i18n/navigation";

type MapTacticalIntelProps = {
  locale: Locale;
};

export function MapTacticalIntel({locale}: MapTacticalIntelProps) {
  const copy = getTacticalIntelCopy(locale);
  const [activeWeapon, setActiveWeapon] = useState<"mortar" | "artillery">("mortar");

  const tableData = activeWeapon === "mortar" ? MORTAR_81MM_BALLISTICS : ARTILLERY_155MM_BALLISTICS;

  return (
    <section className="mt-12 space-y-12" aria-labelledby="tactical-intel-heading">
      {/* Second Screen Workflow Banner */}
      <div className="rounded-lg border border-[#303b35] bg-[#101512] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-[#2b3530] pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#69c78f]">
              <Monitor aria-hidden="true" className="size-4" />
              <span>{copy.secondScreenTitle}</span>
            </div>
            <h2 id="tactical-intel-heading" className="display-font mt-2 text-2xl font-bold text-white sm:text-3xl">
              {copy.secondScreenTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#a8b4ae]">
              {copy.secondScreenDesc}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-md border border-[#2b3530] bg-[#151c18] p-4 transition-colors hover:border-[#3d5246]"
            >
              <h3 className="text-sm font-semibold text-[#dff6e8]">{feature.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#91a098]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Artillery & Mortar Ballistics Elevation Reference */}
      <div className="rounded-lg border border-[#303b35] bg-[#101512] p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#d9a93a]">
              <Crosshair aria-hidden="true" className="size-4" />
              <span>Indirect Fire Control</span>
            </div>
            <h3 className="display-font mt-1 text-2xl font-bold text-white">
              {copy.ballisticsTitle}
            </h3>
            <p className="mt-1 text-sm text-[#a8b4ae]">{copy.ballisticsSubtitle}</p>
          </div>

          {/* Weapon Toggle */}
          <div className="flex items-center rounded-md border border-[#3a4840] bg-[#0c100e] p-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeWeapon === "mortar"}
              onClick={() => setActiveWeapon("mortar")}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeWeapon === "mortar"
                  ? "bg-[#254734] text-[#dff6e8] shadow-sm"
                  : "text-[#8f9d96] hover:text-white"
              }`}
            >
              {copy.mortarTab}
            </button>
            <button
              role="tab"
              aria-selected={activeWeapon === "artillery"}
              onClick={() => setActiveWeapon("artillery")}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeWeapon === "artillery"
                  ? "bg-[#254734] text-[#dff6e8] shadow-sm"
                  : "text-[#8f9d96] hover:text-white"
              }`}
            >
              {copy.artilleryTab}
            </button>
          </div>
        </div>

        {/* Firing Elevation Table */}
        <div className="mt-6 overflow-x-auto rounded-md border border-[#2b3530]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#2b3530] bg-[#161e1a] font-mono text-xs text-[#a0aea6] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">{copy.rangeCol}</th>
                <th scope="col" className="px-4 py-3">{copy.milsCol}</th>
                <th scope="col" className="px-4 py-3">{copy.tofCol}</th>
                <th scope="col" className="px-4 py-3">{copy.notesCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222c26] bg-[#111714]">
              {tableData.map((row) => (
                <tr key={row.range} className="hover:bg-[#18221c] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-white">{row.range}m</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#69c78f]">{row.mils} mils</td>
                  <td className="px-4 py-3 font-mono text-[#d9a93a]">{row.tof}s</td>
                  <td className="px-4 py-3 text-xs text-[#8f9d96]">
                    {row.notes ?? (activeWeapon === "mortar" ? "Standard 81mm HE" : "155mm Heavy HE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tactical Rule of Thumb */}
        <div className="mt-4 flex items-start gap-3 rounded-md border border-[#37443d] bg-[#141c17] p-4 text-xs">
          <HelpCircle aria-hidden="true" className="size-5 shrink-0 text-[#69c78f] mt-0.5" />
          <div>
            <span className="font-semibold text-[#dff6e8]">{copy.ballisticsRuleTitle}: </span>
            <span className="text-[#a0aea6]">{copy.ballisticsRuleDesc}</span>
          </div>
        </div>
      </div>

      {/* Three Strategic Theaters Field Briefing */}
      <div className="rounded-lg border border-[#303b35] bg-[#101512] p-6 md:p-8">
        <div className="border-b border-[#2b3530] pb-5">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#69c78f]">
            <Compass aria-hidden="true" className="size-4" />
            <span>Theater Intel</span>
          </div>
          <h3 className="display-font mt-1 text-2xl font-bold text-white">
            {copy.theatersTitle}
          </h3>
          <p className="mt-1 text-sm text-[#a8b4ae]">{copy.theatersSubtitle}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {copy.theaters.map((theater) => (
            <div
              key={theater.id}
              className="flex flex-col justify-between rounded-md border border-[#2b3530] bg-[#151d18] p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">{theater.name}</h4>
                  <span className="rounded bg-[#203629] px-2 py-0.5 font-mono text-[11px] text-[#8ce2ad]">
                    2048px HD
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#d9a93a]">{theater.type}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-[#8f9d96]">Key Sectors:</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#a0aea6]">
                    {theater.sectors.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#69c78f]">•</span>
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#243129]">
                <p className="text-xs font-semibold uppercase text-[#8f9d96]">Tactical SOP:</p>
                <p className="mt-1 text-xs leading-5 text-[#b0c0b8]">{theater.tactics}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Tactical Guides Links */}
      <div className="rounded-lg border border-[#303b35] bg-[#101512] p-6 md:p-8">
        <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#69c78f]">
          <BookOpen aria-hidden="true" className="size-4" />
          <span>Doctrine & SOP</span>
        </div>
        <h3 className="display-font mt-1 text-2xl font-bold text-white">
          {copy.relatedGuidesTitle}
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {copy.guides.map((guide, i) => (
            <Link
              key={i}
              href={guide.href}
              title={guide.title}
              className="group flex flex-col justify-between rounded-md border border-[#2b3530] bg-[#151c18] p-4 transition-all hover:border-[#69c78f] hover:bg-[#1a251e]"
            >
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-[#69c78f]">
                  <span>{guide.title}</span>
                  <ExternalLink aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-2 text-xs leading-5 text-[#91a098]">{guide.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
