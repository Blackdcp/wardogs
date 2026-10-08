"use client";

import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {ExternalLink} from "lucide-react";
import {ADSTERRA_ENABLED, ADSTERRA_SMARTLINK_ENABLED, ADSTERRA_SMARTLINK_URLS} from "@/features/ads/ad-policy";
import {AD_REPORTING_VERSION} from "@/features/ads/ad-reporting";
import {observeSmartlink} from "@/features/ads/smartlink-tracking";

type AdsterraSmartlinkProps = {
  cta?: string;
  description?: string;
  label?: string;
  placement?: string;
};

export function AdsterraSmartlink({
  cta = "Open sponsored link",
  description = "Opens an external advertiser’s website in a new tab.",
  label = "Sponsored link",
  placement = "smartlink"
}: AdsterraSmartlinkProps = {}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!ADSTERRA_ENABLED || !ADSTERRA_SMARTLINK_ENABLED || !linkRef.current) return;
    return observeSmartlink(linkRef.current, pathname, placement);
  }, [pathname, placement]);

  if (!ADSTERRA_ENABLED || !ADSTERRA_SMARTLINK_ENABLED) return null;
  const smartlink = ADSTERRA_SMARTLINK_URLS[0];

  return (
    <aside
      className="my-8 border border-[#2c3631] bg-[#111512] p-4"
      data-ad-slot="adsterra-smartlink"
      data-ad-config={AD_REPORTING_VERSION}
    >
      <p className="text-[10px] font-semibold uppercase text-[#82938a]">{label}</p>
      <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-xl text-sm leading-6 text-[#a8b4ae]">{description}</p>
        <a
          ref={linkRef}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#4d946d] px-4 text-sm font-semibold text-[#8ed1aa] transition-colors hover:bg-[#17231b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed1aa]"
          data-ad-unit={smartlink.id}
          href={smartlink.url}
          rel="nofollow noopener noreferrer sponsored"
          target="_blank"
          title={description}
        >
          {cta}<ExternalLink aria-hidden="true" size={15} />
        </a>
      </div>
    </aside>
  );
}
