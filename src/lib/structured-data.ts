import type {GuideDocument, GuideSummary} from "@/content/guides";
import {officialLinks, type Locale} from "@/config/site";
import {buildLocalizedUrl, getSiteOrigin} from "./metadata";
import {getGuideDiscoveryImage} from "@/features/guides/guide-discovery-images";

type JsonLd = Record<string, unknown>;

function pageUrl(locale: Locale, pathname = "") {
  return buildLocalizedUrl(locale, pathname || "/");
}

function faqSchema(faq: GuideDocument["frontmatter"]["faq"]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({question, answer}) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {"@type": "Answer", text: answer}
    }))
  };
}

export function buildHomeJsonLd(locale: Locale): JsonLd[] {
  const origin = getSiteOrigin();
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "WARDOGS Wiki",
      url: pageUrl(locale),
      logo: `${origin}/images/wardogs-fullmark-full.png`,
      description: "WARDOGS Wiki is an independent fan-made guide for WARDOGS players."
    },
    {"@context": "https://schema.org", "@type": "WebSite", name: "WARDOGS Wiki", url: pageUrl(locale)},
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "WARDOGS",
      url: officialLinks.steam,
      sameAs: [
        officialLinks.steam,
        officialLinks.team17,
        officialLinks.trailer,
        officialLinks.discord,
        officialLinks.reddit,
        officialLinks.twitter
      ],
      gamePlatform: "Windows PC",
      applicationCategory: "Tactical all-out warfare FPS",
      publisher: {"@type": "Organization", name: "Team17", url: officialLinks.team17},
      author: {"@type": "Organization", name: "BULKHEAD"}
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {"@type": "Question", name: "What is WARDOGS?", acceptedAnswer: {"@type": "Answer", text: "WARDOGS is a 100-player, three-team tactical all-out warfare FPS for Windows PC."}},
        {"@type": "Question", name: "Is this the official WARDOGS website?", acceptedAnswer: {"@type": "Answer", text: "No. WARDOGS Wiki is an independent fan-made guide."}}
      ]
    }
  ];
}

export function buildGuideIndexJsonLd(locale: Locale, guides: GuideSummary[]): JsonLd[] {
  const url = pageUrl(locale, "/guides");
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: "WARDOGS Guides", url},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: pageUrl(locale, `/guides/${guide.slug}`)
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: "Guides", item: url}
      ]
    }
  ];
}

export function buildArticleJsonLd(locale: Locale, guide: GuideDocument): JsonLd[] {
  const url = pageUrl(locale, `/guides/${guide.frontmatter.slug}`);
  const discoveryImage = getGuideDiscoveryImage(guide.frontmatter.slug);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.frontmatter.title,
      description: guide.frontmatter.description,
      dateModified: guide.frontmatter.updatedAt,
      mainEntityOfPage: url,
      author: {"@type": "Organization", name: "WARDOGS Wiki Editorial Team", url: pageUrl(locale, "/editorial-policy")},
      image: discoveryImage?.url ?? `${getSiteOrigin()}/images/og-wardogs.jpg`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: "Guides", item: pageUrl(locale, "/guides")},
        {"@type": "ListItem", position: 3, name: guide.frontmatter.title, item: url}
      ]
    },
    faqSchema(guide.frontmatter.faq)
  ];
}
