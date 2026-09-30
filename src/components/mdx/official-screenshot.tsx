import Image from "next/image";
import type {Locale} from "@/config/site";
import {officialGameplayAssets} from "@/features/media/official-gameplay-assets";
import {assetPath} from "@/lib/assets";

const sourceLabels: Record<Locale, string> = {
  en: "Official source",
  de: "Offizielle Quelle",
  ru: "Официальный источник",
  "pt-br": "Fonte oficial",
  ja: "公式出典",
  "zh-cn": "官方来源",
  "zh-tw": "官方來源",
  pl: "Oficjalne źródło"
};

export function OfficialScreenshot({
  id,
  alt,
  caption,
  locale = "en"
}: {
  id: string;
  alt: string;
  caption: string;
  locale?: Locale;
}) {
  const asset = officialGameplayAssets[id as keyof typeof officialGameplayAssets];
  if (!asset) return null;

  return (
    <figure className="my-8" data-official-screenshot={id}>
      <a href={assetPath(asset.src)} rel="noopener" target="_blank" title={alt}>
        <Image
          alt={alt}
          className="h-auto w-full"
          height={asset.height}
          sizes="(min-width: 1024px) 880px, 100vw"
          src={assetPath(asset.src)}
          unoptimized
          width={asset.width}
        />
      </a>
      <figcaption className="mt-3 text-sm leading-6 text-[#aab8b0]">
        <span className="block">{caption}</span>
        <span className="mt-1 block text-xs">
          {asset.credit}
          {asset.publishedAt && <> · <time dateTime={asset.publishedAt}>{asset.publishedAt.slice(0, 10)}</time></>}
          {" · "}
          <a href={asset.sourceUrl} rel="noopener" target="_blank" title={sourceLabels[locale]}>
            {sourceLabels[locale]}
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
