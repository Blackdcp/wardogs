import type {Metadata} from "next";
import type {Locale} from "@/config/site";
import {catalogueMetadataImages} from "@/features/catalogue/catalogue-media";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import type {WardogsItem} from "@/features/items/item-library";
import {getLocalizedItem} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {buildLocalizedUrl, buildPageMetadata, languageTags} from "./metadata";
import {publicAssetUrl} from "./public-url";

function itemPath(item: WardogsItem) {
  return `/items/${item.type}/${item.slug}`;
}

export function getItemCanonicalLocale(locale: Locale, item: WardogsItem): Locale {
  return resolveItemRouteTarget(locale, itemPath(item)).locale;
}

function searchTitle(locale: Locale, item: WardogsItem): string {
  let candidates: string[];
  if (locale === "zh-cn") {
    candidates = item.type === "vehicles"
      ? [`WARDOGS ${item.name} 载具攻略：价格、定位与解锁`, `WARDOGS ${item.name} 载具攻略`]
      : item.type === "weapons"
        ? [`WARDOGS ${item.name} 武器攻略：${item.subtype}、价格与解锁`, `WARDOGS ${item.name} 武器攻略`]
        : [`WARDOGS ${item.name} 攻略：${item.subtype}、价格与用途`, `WARDOGS ${item.name} 攻略`];
  } else if (locale === "ja") {
    candidates = item.type === "vehicles"
      ? [`WARDOGS ${item.name}車両攻略：価格・役割・解除条件`, `WARDOGS ${item.name}車両攻略`]
      : [`WARDOGS ${item.name}攻略：${item.subtype}・価格・解除条件`, `WARDOGS ${item.name}攻略`];
  } else if (locale === "ru") {
    candidates = item.type === "vehicles"
      ? [`WARDOGS ${item.name}: гайд по технике, цене и открытию`, `WARDOGS ${item.name}: гайд по технике`]
      : [`WARDOGS ${item.name}: гайд по ${item.subtype}, цене и открытию`, `WARDOGS ${item.name}: гайд`];
  } else if (locale === "de") {
    candidates = item.type === "vehicles"
      ? [`WARDOGS ${item.name} Fahrzeug-Guide: Preis, Rolle & Freischaltung`, `WARDOGS ${item.name} Fahrzeug-Guide`]
      : [`WARDOGS ${item.name} Guide: ${item.subtype}, Preis & Freischaltung`, `WARDOGS ${item.name} Guide`];
  } else if (locale === "pt-br") {
    candidates = item.type === "vehicles"
      ? [`Guia do veículo ${item.name} em WARDOGS: preço, função e desbloqueio`, `Guia do ${item.name} em WARDOGS`]
      : [`Guia de ${item.name} em WARDOGS: ${item.subtype}, preço e desbloqueio`, `Guia de ${item.name} em WARDOGS`];
  } else if (item.type === "weapons") {
    candidates = [
      `WARDOGS ${item.name} Guide: ${item.subtype} Price, Ammo & Unlocks`,
      `WARDOGS ${item.name} Guide: Price, Ammo & Unlocks`,
      `WARDOGS ${item.name} Weapon Guide`
    ];
  } else if (item.type === "vehicles") {
    candidates = [
      `WARDOGS ${item.name} Vehicle Guide: Price, Role & Unlocks`,
      `WARDOGS ${item.name} Vehicle Guide: Price & Unlocks`,
      `WARDOGS ${item.name} Vehicle Guide`
    ];
  } else {
    candidates = [
      `WARDOGS ${item.name} Guide: ${item.subtype}, Price & Unlocks`,
      `WARDOGS ${item.name} Guide: Price & Unlocks`,
      `WARDOGS ${item.name} Guide`
    ];
  }
  return candidates.find((candidate) => candidate.length <= 60) ?? candidates.at(-1)!;
}

function clampSearchDescription(value: string, locale: Locale = "en"): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  const fillers: Record<Locale, string> = {
    en: "Review the source-checked role, costs, and pre-release limits.",
    ru: "Сверяйте роль, стоимость, источники и ограничения текущей версии.",
    de: "Prüfe Rolle, Kosten, Quellen und die Grenzen der aktuellen Version.",
    "pt-br": "Confira função, custos, fontes e limites da versão atual.",
    ja: "役割、費用、情報源、現在のビルドでの制限を確認できます。",
    "zh-cn": "页面同时标注来源、版本边界与尚未确认的内容，便于出战前复核。"
  };
  const complete = normalized.length >= 140
    ? normalized
    : `${normalized} ${fillers[locale]}`;
  if (complete.length <= 160) return complete;

  if (locale === "zh-cn" || locale === "ja") {
    const window = complete.slice(0, 160);
    const punctuation = [..."。！？；"].reduce((last, mark) => Math.max(last, window.lastIndexOf(mark)), -1);
    if (punctuation >= 139) return window.slice(0, punctuation + 1);
    return `${complete.slice(0, 159).replace(/[、，；。]+$/, "")}。`;
  }

  const boundary = complete.lastIndexOf(" ", 159);
  return `${complete.slice(0, boundary).replace(/[,:;.-]+$/, "")}.`;
}

function searchDescription(locale: Locale, item: WardogsItem): string {
  if (locale !== "en") {
    return clampSearchDescription(`WARDOGS ${item.name}: ${item.description}`, locale);
  }

  const price = item.observedPrice ?? "an unconfirmed price";
  const gate = item.observedProgressionOrGate ?? "an unconfirmed unlock";
  const classOrAmmo = item.observedAmmoOrVehicleClass ?? item.subtype;

  if (item.type === "weapons") {
    return clampSearchDescription(
      `WARDOGS ${item.name} guide: ${item.subtype} observed at ${price} using ${classOrAmmo}, with ${gate} progression. Check its role, strengths, cautions, source evidence, and pre-release limits.`
    );
  }
  if (item.type === "vehicles") {
    return clampSearchDescription(
      `WARDOGS ${item.name} vehicle guide: ${classOrAmmo} at ${price} with ${gate} in Alpha 1. Check its role, strengths, cautions, evidence, and pre-release limits.`
    );
  }
  return clampSearchDescription(
    `WARDOGS ${item.name} guide: ${item.subtype} observed at ${price} with ${gate}. Check its role, strengths, cautions, source evidence, and pre-release limits.`
  );
}

export function buildItemMetadata(locale: Locale, item: WardogsItem): Metadata {
  const localizedItem = getLocalizedItem(item, locale);
  const canonicalLocale = getItemCanonicalLocale(locale, localizedItem);
  const canonical = buildLocalizedUrl(canonicalLocale, itemPath(localizedItem));
  const languages = Object.fromEntries(
    localizedItem.indexLocales.map((itemLocale) => [itemLocale, buildLocalizedUrl(itemLocale, itemPath(localizedItem))])
  ) as Record<string, string>;
  languages["x-default"] = languages.en ?? canonical;

  const title = searchTitle(locale, localizedItem);
  const description = searchDescription(locale, localizedItem);
  const image = publicAssetUrl(localizedItem.detailImage ?? "/images/og-wardogs.jpg");
  const imageAlt = localizedItem.detailImageAlt ?? `WARDOGS ${localizedItem.name}`;

  return {
    title,
    description,
    alternates: {canonical, languages},
    keywords: `WARDOGS ${localizedItem.name}, WARDOGS items, WARDOGS ${localizedItem.type}, WARDOGS guide`,
    openGraph: {
      type: "article",
      locale: languageTags[canonicalLocale],
      url: canonical,
      siteName: "WARDOGS Wiki",
      title,
      description,
      images: [{url: image, width: 1200, height: 630, alt: imageAlt}]
    },
    twitter: {card: "summary_large_image", title, description, images: [image]}
  };
}

export function buildCatalogGuideMetadata(locale: Locale, guide: CatalogGuide): Metadata {
  return buildLocalizedItemPageMetadata(
    locale,
    `/items/${guide.id}`,
    guide.title,
    guide.description,
    catalogueMetadataImages[guide.id]
  );
}

export function buildItemHubMetadata(locale: Locale): Metadata {
  const ui = getItemUi(locale);
  return buildLocalizedItemPageMetadata(
    locale,
    "/items",
    ui.hubMetaTitle,
    ui.hubMetaDescription,
    catalogueMetadataImages.hub
  );
}

function buildLocalizedItemPageMetadata(locale: Locale, pathname: string, title: string, description: string, imagePath: string): Metadata {
  const metadata = buildPageMetadata(locale, pathname, title, description);
  const image = publicAssetUrl(imagePath);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{url: image, alt: title}]
    },
    twitter: {
      ...metadata.twitter,
      images: [image]
    },
    robots: undefined
  };
}
