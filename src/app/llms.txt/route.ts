import {guideManifest} from "@/content/manifest";
import {getSiteOrigin} from "@/lib/metadata";

export const dynamic = "force-static";

export function GET() {
  const origin = getSiteOrigin();
  const topGuides = guideManifest.map((guide) => `- ${guide.keyword}: ${origin}/en/guides/${guide.slug}`);
  const body = [
    "# WARDOGS Wiki",
    "",
    "WARDOGS Wiki is an independent fan-made guide site for WARDOGS, a tactical all-out warfare FPS by BULKHEAD and Team17.",
    "",
    "## Core Pages",
    `- Home: ${origin}/en`,
    `- Guides: ${origin}/en/guides`,
    `- Sitemap: ${origin}/sitemap.xml`,
    "",
    "## English Guide URLs",
    ...topGuides,
    "",
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
