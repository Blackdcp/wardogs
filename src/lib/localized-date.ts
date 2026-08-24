import type {Locale} from "@/config/site";

const dateLocales: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  de: "de-DE",
  "pt-br": "pt-BR",
  ja: "ja-JP"
};

export function formatLocalizedDate(value: string, locale: Locale) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(dateLocales[locale], {
    dateStyle: "long",
    timeZone: "UTC"
  }).format(date);
}
