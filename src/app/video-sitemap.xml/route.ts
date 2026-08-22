import {buildVideoSitemapXml} from "@/features/videos/video-structured-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildVideoSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
