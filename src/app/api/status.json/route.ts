import {getPublicStatus} from "@/features/live-ops/public-status";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getPublicStatus(), {
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
