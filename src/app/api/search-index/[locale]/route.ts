import {isLocale, locales} from "@/config/site";
import {buildSiteSearchIndex} from "@/features/search/site-search-index";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function GET(_request: Request, {params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) return new Response("Not found", {status: 404});
  return Response.json(await buildSiteSearchIndex(locale), {
    headers: {"Cache-Control": "public, max-age=0, s-maxage=86400"}
  });
}
