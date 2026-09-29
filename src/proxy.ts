import createMiddleware from "next-intl/middleware";
import {NextRequest, NextResponse} from "next/server";
import {isLocale} from "@/config/site";
import {isItemDetailRouteAvailable} from "@/features/items/item-route-availability";
import {getLegacyEnglishRedirectPath} from "@/i18n/legacy-paths";
import {routing} from "@/i18n/routing";
import {getCanonicalHostRedirect} from "@/lib/public-url";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const canonicalHostRedirect = getCanonicalHostRedirect(request.nextUrl);
  if (canonicalHostRedirect) return NextResponse.redirect(canonicalHostRedirect, 308);

  const {pathname} = request.nextUrl;
  if (pathname === "/") return NextResponse.redirect(new URL("/en", request.url), 308);
  const legacyRedirectPath = getLegacyEnglishRedirectPath(pathname);
  if (legacyRedirectPath) return NextResponse.redirect(new URL(legacyRedirectPath, request.url), 308);
  const firstSegment = pathname.split("/")[1];
  if (firstSegment && !isLocale(firstSegment)) return NextResponse.next();
  const response = handleI18n(request);
  const segments = pathname.split("/").filter(Boolean);
  if (
    firstSegment && isLocale(firstSegment) &&
    segments.length === 4 && segments[1] === "items" &&
    !isItemDetailRouteAvailable(firstSegment, `/items/${segments[2]}/${segments[3]}`)
  ) {
    response.headers.delete("Link");
  }
  return response;
}

export const config = {
  matcher: [
    // Keep the apex-to-www redirect for every path it handled before, including 404s.
    {
      source: "/((?!api|_next|_vercel|.*\\..*).*)",
      has: [{type: "host", value: "wardogswiki.com"}]
    },
    // Only localized pages and known legacy redirects need Proxy on the canonical host.
    "/",
    "/((?!.*\\..*)(?:(?:en|ru|de|pt-br|ja|zh-cn)(?:/.*)?|wardogs(?:/.*)?|(?:guides|videos|items|news|privacy|terms)(?:/.*)?|maps|about|contact|editorial-policy|tools/(?:system-check|ammo-matcher|logistics-planner|progression-route|weapon-compare|loadout-budget)))"
  ]
};
