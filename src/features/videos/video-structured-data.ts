import type {Locale} from "@/config/site";
import type {VideoArticle} from "@/features/videos/video-library";
import {getSiteOrigin} from "@/lib/metadata";

type JsonLdItem = Record<string, unknown>;

export function buildVideoArticleJsonLd(locale: Locale, article: VideoArticle): JsonLdItem[] {
  const origin = getSiteOrigin();
  const url = `${origin}/${locale}/videos/${article.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      mainEntityOfPage: url,
      author: {"@type": "Organization", name: "WARDOGS Wiki"},
      datePublished: article.publishedDate,
      dateModified: article.updatedDate,
      image: `${origin}/images/og-wardogs.jpg`
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: article.sourceLabel,
      description: article.description,
      uploadDate: article.publishedDate,
      embedUrl: `https://www.youtube-nocookie.com/embed/${article.youtubeId}`,
      url: article.sourceUrl,
      thumbnailUrl: `https://i.ytimg.com/vi/${article.youtubeId}/hqdefault.jpg`
    }
  ];
}
