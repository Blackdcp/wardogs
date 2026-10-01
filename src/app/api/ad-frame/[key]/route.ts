import {ADSTERRA_ENABLED} from "@/features/ads/ad-policy";
import {ADSTERRA_BANNER_SANDBOX, buildAdsterraBannerDocument, getApprovedAdsterraBanner} from "@/features/ads/adsterra-banner";

export async function GET(request: Request, {params}: {params: Promise<{key: string}>}) {
  const host = new URL(request.url).hostname;
  const isolatedHost = host === "wardogswiki.com" || (process.env.NODE_ENV !== "production" && (host === "localhost" || host === "127.0.0.1"));
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": `sandbox ${ADSTERRA_BANNER_SANDBOX}; frame-ancestors https://www.wardogswiki.com${process.env.NODE_ENV !== "production" ? " http://127.0.0.1:* http://localhost:*" : ""}; base-uri 'none'; form-action 'none'; object-src 'none'`,
    "Origin-Agent-Cluster": "?1",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "public, max-age=300"
  };
  // Never serve ad scripts on the canonical parent origin, even when opened directly.
  if (!isolatedHost) return new Response("Isolated host required", {status: 403, headers});
  const unit = getApprovedAdsterraBanner((await params).key);
  if (!ADSTERRA_ENABLED || !unit) return new Response("Ad unavailable", {status: 404, headers});
  return new Response(buildAdsterraBannerDocument(unit), {headers});
}
