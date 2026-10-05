"use client";

import type {Locale} from "@/config/site";
import {SiteSearchDialog} from "@/components/layout/site-search-dialog";

export function HeroSearchBox({placeholder}: {locale?: Locale; placeholder?: string}) {
  return (
    <div className="mt-5 w-full max-w-xl text-left" data-hero-search-box="true">
      <SiteSearchDialog placeholder={placeholder} source="hero" trigger="hero" />
    </div>
  );
}
