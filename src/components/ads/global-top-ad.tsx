"use client";

import {usePathname} from "next/navigation";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {siteLocales} from "@/config/site";

type GlobalTopAdProps = {
  label: string;
};

const localizedHomepagePaths = new Set(siteLocales.map((locale) => `/${locale}`));

export function isLocalizedHomepage(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return normalizedPath === "/" || localizedHomepagePaths.has(normalizedPath);
}

export function GlobalTopAd({label}: GlobalTopAdProps) {
  const pathname = usePathname();

  if (isLocalizedHomepage(pathname)) {
    return null;
  }

  return (
    <div className="site-container py-1" data-global-ad-position="top">
      <AdsterraDisplayBanner label={label} placement="horizontal" />
    </div>
  );
}
