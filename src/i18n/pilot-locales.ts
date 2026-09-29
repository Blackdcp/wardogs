import {isPilotLocale, type PilotLocale, type SiteLocale} from "@/config/site";

export const pilotGuideSlugs = {
  "zh-tw": [
    "wardogs-money-guide",
    "wardogs-medic-revive-guide",
    "wardogs-towers-guide",
    "wardogs-fob-guide",
    "wardogs-controls"
  ],
  pl: [
    "wardogs-money-guide",
    "wardogs-fob-guide",
    "wardogs-progression-wipes-guide",
    "wardogs-mortar-guide",
    "wardogs-towers-guide"
  ]
} as const satisfies Record<PilotLocale, readonly string[]>;

export const siteLanguageTags: Record<SiteLocale, string> = {
  en: "en", ru: "ru", de: "de", "pt-br": "pt-BR", ja: "ja", "zh-cn": "zh-CN",
  "zh-tw": "zh-TW", pl: "pl"
};

export const siteLocaleLabels: Record<SiteLocale, string> = {
  en: "English", ru: "Русский", de: "Deutsch", "pt-br": "Português (Brasil)",
  ja: "日本語", "zh-cn": "简体中文", "zh-tw": "繁體中文", pl: "Polski"
};

export function isPilotGuideSlug(locale: PilotLocale, slug: string): boolean {
  return (pilotGuideSlugs[locale] as readonly string[]).includes(slug);
}

export function isPilotPathAvailable(locale: PilotLocale, pathname: string): boolean {
  if (!isPilotLocale(locale)) return true;
  const cleanPath = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  if (cleanPath === "/guides") return true;
  const match = /^\/guides\/([^/]+)$/.exec(cleanPath);
  return Boolean(match && isPilotGuideSlug(locale, match[1]));
}

// A switch to an untranslated pilot topic goes to its real guide index, never an English clone.
export function getPilotSwitchPath(locale: SiteLocale, pathname: string): string {
  if (!isPilotLocale(locale)) return pathname;
  return isPilotPathAvailable(locale, pathname) ? pathname.split(/[?#]/, 1)[0] : "/guides";
}
