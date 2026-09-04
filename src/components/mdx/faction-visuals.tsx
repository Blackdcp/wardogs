import Image from "next/image";
import type {Locale} from "@/config/site";
import {assetPath} from "@/lib/assets";

const factions = [
  {name: "Valkyra", image: "/images/catalogue/factions/valkyra.webp"},
  {name: "Lonestar", image: "/images/catalogue/factions/lonestar.webp"},
  {name: "Manticore", image: "/images/catalogue/factions/manticore.webp"}
] as const;

const copy: Record<Locale, {label: string; note: string; alt: (name: string) => string}> = {
  en: {label: "Pre-release faction emblems", note: "Identity is confirmed; unique bonuses and locked equipment are not.", alt: (name) => `${name} faction emblem shown in WARDOGS pre-release material`},
  de: {label: "Fraktionssymbole aus der Vorabversion", note: "Die Identität ist bestätigt; einzigartige Boni und gesperrte Ausrüstung nicht.", alt: (name) => `${name}-Fraktionssymbol aus WARDOGS-Vorabmaterial`},
  ru: {label: "Эмблемы фракций из предрелизных материалов", note: "Названия подтверждены; уникальные бонусы и закрытое снаряжение не подтверждены.", alt: (name) => `Эмблема фракции ${name} из предрелизных материалов WARDOGS`},
  "pt-br": {label: "Emblemas de facção da pré-build", note: "A identidade é confirmada; bônus únicos e equipamento bloqueado não são.", alt: (name) => `Emblema da facção ${name} em material de pré-lançamento de WARDOGS`},
  ja: {label: "発売前ビルドの派閥エンブレム", note: "派閥名は確認済みですが、固有ボーナスや装備制限は未確認です。", alt: (name) => `WARDOGS発売前資料に表示された${name}派閥エンブレム`},
  "zh-cn": {label: "预发布版本阵营徽记", note: "阵营身份已经确认，但独有加成和阵营锁定装备仍未确认。", alt: (name) => `WARDOGS 预发布素材中的 ${name} 阵营徽记`}
};

export function FactionVisuals({locale = "en"}: {locale?: Locale}) {
  const text = copy[locale];

  return (
    <figure className="my-8" data-faction-visuals>
      <figcaption className="mb-4">
        <span className="block text-sm font-semibold text-white">{text.label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#93a098]">{text.note}</span>
      </figcaption>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {factions.map((faction) => (
          <div className="border border-[#303b35] bg-[#101411] p-4 text-center" key={faction.name}>
            <div className="relative mx-auto aspect-square w-full max-w-44">
              <Image alt={text.alt(faction.name)} className="object-contain" fill sizes="(min-width: 640px) 176px, 50vw" src={assetPath(faction.image)} />
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{faction.name}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
