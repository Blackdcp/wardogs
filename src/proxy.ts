import createMiddleware from "next-intl/middleware";
import {NextRequest, NextResponse} from "next/server";
import {isLocale} from "@/config/site";
import {getLegacyEnglishRedirectPath} from "@/i18n/legacy-paths";
import {routing} from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (pathname === "/") return NextResponse.redirect(new URL("/en", request.url), 308);
  const legacyRedirectPath = getLegacyEnglishRedirectPath(pathname);
  if (legacyRedirectPath) return NextResponse.redirect(new URL(legacyRedirectPath, request.url), 308);
  const firstSegment = pathname.split("/")[1];
  if (firstSegment && !isLocale(firstSegment)) return NextResponse.next();
  return handleI18n(request);
}

export const config = {matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]};
