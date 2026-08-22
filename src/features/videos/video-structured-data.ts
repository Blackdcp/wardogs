import {locales, type Locale} from "@/config/site";
import {videoArticles, type VideoArticle} from "@/features/videos/video-library";
import {buildLocalizedUrl} from "@/lib/metadata";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";

type JsonLdItem = Record<string, unknown>;

function asUtcDateTime(date: string) {
  return `${date}T00:00:00+00:00`;
}

export function buildVideoArticleJsonLd(locale: Locale, article: VideoArticle): JsonLdItem[] {
  const url = buildLocalizedUrl(locale, `/videos/${article.slug}`);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      mainEntityOfPage: url,
      author: {"@type": "Organization", name: "WARDOGS Wiki Editorial Team", url: buildLocalizedUrl(locale, "/editorial-policy")},
      datePublished: article.publishedDate,
      dateModified: article.updatedDate,
      image: videoThumbnailUrl(article.youtubeId)
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: article.sourceLabel,
      description: article.description,
      uploadDate: asUtcDateTime(article.publishedDate),
      embedUrl: `https://www.youtube-nocookie.com/embed/${article.youtubeId}`,
      url: article.sourceUrl,
      thumbnailUrl: videoThumbnailUrl(article.youtubeId),
      ...(article.clips ? {
        hasPart: article.clips.map((clip) => ({
          "@type": "Clip",
          name: clip.name,
          startOffset: clip.startOffset,
          ...(clip.endOffset === undefined ? {} : {endOffset: clip.endOffset}),
          url: `${url}?t=${clip.startOffset}`
        }))
      } : {})
    }
  ];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildVideoSitemapXml() {
  const entries = locales.flatMap((locale) => videoArticles.map((article) => {
    const pageUrl = buildLocalizedUrl(locale, `/videos/${article.slug}`);
    return [
      "  <url>",
      `    <loc>${escapeXml(pageUrl)}</loc>`,
      "    <video:video>",
      `      <video:thumbnail_loc>${escapeXml(videoThumbnailUrl(article.youtubeId))}</video:thumbnail_loc>`,
      `      <video:title>${escapeXml(article.title)}</video:title>`,
      `      <video:description>${escapeXml(article.description)}</video:description>`,
      `      <video:player_loc allow_embed="yes">${escapeXml(`https://www.youtube-nocookie.com/embed/${article.youtubeId}`)}</video:player_loc>`,
      `      <video:publication_date>${asUtcDateTime(article.publishedDate)}</video:publication_date>`,
      "    </video:video>",
      "  </url>"
    ].join("\n");
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    ...entries,
    "</urlset>",
    ""
  ].join("\n");
}
