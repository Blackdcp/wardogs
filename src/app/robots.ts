import type {MetadataRoute} from "next";
import {getSiteOrigin} from "@/lib/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: {userAgent: "*", allow: "/"},
    sitemap: [`${origin}/sitemap.xml`, `${origin}/video-sitemap.xml`],
    host: origin
  };
}
