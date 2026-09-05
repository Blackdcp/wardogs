import englishMessages from "../../../messages/en.json";
import {listGuideSummaries} from "@/content/guides";
import {NEWS_UPDATES} from "@/features/news/news-data";
import {getSiteOrigin} from "@/lib/metadata";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRssDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const origin = getSiteOrigin();
  const guides = await listGuideSummaries("en");
  const newsMessages = englishMessages.news.timeline.items;

  const newsItems = NEWS_UPDATES.map((update) => {
    const message = newsMessages[update.titleKey];
    const link = `${origin}/en/guides/${update.guideSlug}`;

    return [
      "    <item>",
      `      <title>${escapeXml(message.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">urn:wardogswiki:news:${update.titleKey}:${update.date}</guid>`,
      `      <pubDate>${toRssDate(update.date)}</pubDate>`,
      "      <category>News</category>",
      `      <description>${escapeXml(message.description)}</description>`,
      "    </item>"
    ].join("\n");
  });

  const guideItems = guides.map((guide) => {
    const link = `${origin}/en/guides/${guide.slug}`;

    return [
      "    <item>",
      `      <title>${escapeXml(guide.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `      <pubDate>${toRssDate(guide.updatedAt)}</pubDate>`,
      "      <category>Guide</category>",
      `      <category>${escapeXml(guide.category)}</category>`,
      `      <description>${escapeXml(guide.description)}</description>`,
      "    </item>"
    ].join("\n");
  });

  const publicationDates = [
    ...NEWS_UPDATES.map((update) => update.date),
    ...guides.map((guide) => guide.updatedAt)
  ].sort();
  const lastBuildDate = toRssDate(publicationDates.at(-1) ?? "2026-09-05");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>WARDOGS Wiki News, Patches and Guides</title>",
    `    <link>${escapeXml(`${origin}/en`)}</link>`,
    "    <description>Verified WARDOGS news, patch context and independent player guides.</description>",
    "    <language>en-us</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${origin}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...newsItems,
    ...guideItems,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
