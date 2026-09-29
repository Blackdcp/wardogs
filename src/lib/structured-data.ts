import type {GuideDocument, GuideSummary} from "@/content/guides";
import {officialLinks, type Locale} from "@/config/site";
import {buildLocalizedUrl, getSiteOrigin} from "./metadata";
import {getGuideDiscoveryImage} from "@/features/guides/guide-discovery-images";
import {publicAssetUrl} from "@/lib/public-url";

type JsonLd = Record<string, unknown>;

function guideLabel(locale: Locale) {
  return locale === "pl" ? "Poradniki" : locale === "zh-tw" ? "攻略" : "Guides";
}

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
  const siteUrl = `${origin.replace(/\/$/, "")}/`;
  const localizedHomeUrl = pageUrl(locale);
  const homeFaq = locale === "pl" ? [
    {question: "Czym jest WARDOGS?", answer: "WARDOGS to taktyczna gra FPS na komputery z Windows, w której do 100 graczy walczy w trzech drużynach."},
    {question: "Czy to oficjalna strona WARDOGS?", answer: "Nie. WARDOGS Wiki to niezależny, nieoficjalny poradnik tworzony dla graczy."}
  ] : locale === "zh-tw" ? [
    {question: "WARDOGS 是什麼遊戲？", answer: "WARDOGS 是 Windows PC 平台的戰術全面戰爭 FPS，最多 100 名玩家分成三支隊伍作戰。"},
    {question: "這是 WARDOGS 官方網站嗎？", answer: "不是。WARDOGS Wiki 是獨立的非官方玩家攻略網站。"}
  ] : [
    {question: "What is WARDOGS?", answer: "WARDOGS is a 100-player, three-team tactical all-out warfare FPS for Windows PC."},
    {question: "Is this the official WARDOGS website?", answer: "No. WARDOGS Wiki is an independent fan-made guide."}
  ];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "WARDOGS Wiki",
      url: siteUrl,
      logo: `${origin}/images/wardogs-fullmark-full.png`,
      description: "WARDOGS Wiki is an independent fan-made guide for WARDOGS players."
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "WARDOGS Wiki",
      alternateName: ["WardogsWiki", "wardogswiki.com"],
      inLanguage: locale,
      url: siteUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "WARDOGS Wiki",
      url: localizedHomeUrl,
      inLanguage: locale,
      datePublished: "2026-08-13",
      dateModified: "2026-09-26",
      author: {"@type": "Organization", name: "WARDOGS Wiki Editorial Team", url: pageUrl(locale, "/editorial-policy")},
      publisher: {"@type": "Organization", name: "WARDOGS Wiki", url: pageUrl(locale, "/about")},
      isPartOf: {"@type": "WebSite", name: "WARDOGS Wiki", url: siteUrl},
      about: {"@type": "VideoGame", name: "WARDOGS", url: officialLinks.steam}
    },
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
      mainEntity: homeFaq.map(({question, answer}) => ({"@type": "Question", name: question, acceptedAnswer: {"@type": "Answer", text: answer}}))
    }
  ];
}

export function buildGuideIndexJsonLd(locale: Locale, guides: GuideSummary[]): JsonLd[] {
  const url = pageUrl(locale, "/guides");
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: `WARDOGS ${guideLabel(locale)}`, url},
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
        {"@type": "ListItem", position: 2, name: guideLabel(locale), item: url}
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
      image: publicAssetUrl(discoveryImage?.url ?? "/images/og-wardogs.jpg")
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: guideLabel(locale), item: pageUrl(locale, "/guides")},
        {"@type": "ListItem", position: 3, name: guide.frontmatter.title, item: url}
      ]
    },
    faqSchema(guide.frontmatter.faq)
  ];
}
