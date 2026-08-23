import {guideManifest} from "@/content/manifest";
import {locales, type Locale} from "@/config/site";
import {getLocalizedVideoArticles} from "@/features/videos/video-localization";
import {getSiteOrigin} from "@/lib/metadata";

export const dynamic = "force-static";

const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Russian",
  de: "German",
  "pt-br": "Brazilian Portuguese",
  ja: "Japanese"
};

export function GET() {
  const origin = getSiteOrigin();
  const localizedSections = locales.flatMap((locale) => {
    const guideUrls = guideManifest.map((guide) => `- ${guide.keyword}: ${origin}/${locale}/guides/${guide.slug}`);
    const videoUrls = getLocalizedVideoArticles(locale).map((article) => `- ${article.title}: ${origin}/${locale}/videos/${article.slug}`);

    return [
      `## ${localeNames[locale]} Core Pages`,
      `- Home: ${origin}/${locale}`,
      `- Guides: ${origin}/${locale}/guides`,
      `- YouTube Guides: ${origin}/${locale}/videos`,
      `- Catalogue: ${origin}/${locale}/items`,
      "",
      `## ${localeNames[locale]} Guide URLs`,
      ...guideUrls,
      "",
      `## ${localeNames[locale]} YouTube Guide URLs`,
      ...videoUrls,
      ""
    ];
  });
  const body = [
    "# WARDOGS Wiki",
    "",
    "WARDOGS Wiki is an independent fan-made guide site for WARDOGS, a tactical all-out warfare FPS by BULKHEAD and Team17.",
    "",
    "## Discovery Files",
    `- Sitemap: ${origin}/sitemap.xml`,
    `- Video Sitemap: ${origin}/video-sitemap.xml`,
    `- Robots: ${origin}/robots.txt`,
    "",
    ...localizedSections,
    "## Crawling",
    "Public guide pages are intended to be crawlable by search engines and AI assistants. Please respect robots.txt and use canonical URLs.",
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
