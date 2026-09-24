import {ExternalLink} from "lucide-react";
import {ADSTERRA_SMARTLINK_URLS} from "@/features/ads/ad-policy";

type AdsterraSmartlinkProps = {
  cta?: string;
  description?: string;
  label?: string;
};

export function AdsterraSmartlink({
  cta = "Explore sponsored recommendations",
  description = "Open an external sponsored destination in a new tab.",
  label = "Sponsored"
}: AdsterraSmartlinkProps = {}) {
  return (
    <aside className="my-8 border border-[#2c3631] bg-[#111512] p-4" data-ad-slot="adsterra-smartlink">
      <p className="text-[10px] font-semibold uppercase text-[#718079]">{label}</p>
      <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-xl text-sm leading-6 text-[#a8b4ae]">{description}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {ADSTERRA_SMARTLINK_URLS.map((smartlink, index) => (
            <a
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#4d946d] px-4 text-sm font-semibold text-[#8ed1aa] transition-colors hover:bg-[#17231b] hover:text-white"
              data-ad-unit={smartlink.id}
              href={smartlink.url}
              key={smartlink.id}
              rel="nofollow noopener noreferrer sponsored"
              target="_blank"
              title={`${cta} ${index + 1}`}
            >
              {cta} {index + 1}<ExternalLink aria-hidden="true" size={15} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
