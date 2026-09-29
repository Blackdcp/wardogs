import links from "../../config/official-links.json";

export const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
export type Locale = (typeof locales)[number];

// Retain the former pilot type for historical content helpers, not route gating.
export type PilotLocale = "zh-tw" | "pl";
export const pilotLocales: readonly PilotLocale[] = [];
export const siteLocales = locales;
export type SiteLocale = (typeof siteLocales)[number];

export function isPilotLocale(value: string): value is PilotLocale {
  return pilotLocales.includes(value as PilotLocale);
}

export function isSiteLocale(value: string): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale);
}

export const officialLinks = links;
export const siteConfig = {
  gameName: "WARDOGS",
  siteName: "WARDOGS Wiki",
  defaultLocale: "en" as const,
  locales,
  steamAppId: "1867240",
  origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  theme: {
    background: "#0d0f0e",
    surface: "#151b18",
    card: "#1b221f",
    text: "#f2f5f3",
    muted: "#a8b4ae",
    navTheme: "152 45% 38%",
    navThemeLight: "152 48% 50%",
    warning: "#d9a93a",
    danger: "#d45d5d"
  }
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
