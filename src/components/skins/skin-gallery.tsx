import Image from "next/image";
import type {Locale} from "@/config/site";
import {assetPath} from "@/lib/assets";

type SkinFamily = "Black & Gold" | "Digital Wood" | "Two Tone Desert" | "Taxi" | "Faction Logo";
type SkinEntry = {family: SkinFamily; item: string; image?: string; candidate?: boolean};

const skins: readonly SkinEntry[] = [
  {family: "Black & Gold", item: "AK74", image: "blackandgold-ak74.webp"},
  {family: "Digital Wood", item: "GGX 17", image: "digitalwood-ggx17.webp"},
  {family: "Digital Wood", item: "M4", image: "digitalwood-m4.webp"},
  {family: "Digital Wood", item: "Sport Parachute", image: "digitalwood-sportsparachute.webp"},
  {family: "Digital Wood", item: "SV98", image: "digitalwood-sv98.webp"},
  {family: "Two Tone Desert", item: "A-91", image: "twotonedesert-a91.webp"},
  {family: "Two Tone Desert", item: "AMP-9", image: "twotonedesert-mp9.webp", candidate: true},
  {family: "Two Tone Desert", item: "AMR 50", image: "twotonedesert-ax50.webp", candidate: true},
  {family: "Two Tone Desert", item: "Bobcat", image: "twotonedesert-bobcat.webp"},
  {family: "Two Tone Desert", item: "Bushmaster M17S", image: "twotonedesert-bushmaster.webp"},
  {family: "Two Tone Desert", item: "Dune Buggy", image: "twotonedesert-dunebuggy.webp"},
  {family: "Two Tone Desert", item: "Humvee", image: "twotonedesert-humvee.webp"},
  {family: "Two Tone Desert", item: "KH-2002", image: "twotonedesert-kh2002.webp"},
  {family: "Two Tone Desert", item: "M249 SAW", image: "twotonedesert-m249.webp"},
  {family: "Two Tone Desert", item: "M4", image: "twotonedesert-m4.webp"},
  {family: "Two Tone Desert", item: "M500", image: "twotonedesert-m500.webp"},
  {family: "Two Tone Desert", item: "MH-6", image: "twotonedesert-littlebird.webp"},
  {family: "Taxi", item: "MH-6", image: "taxi-littlebird.webp"},
  {family: "Faction Logo", item: "A-91", image: "factionlogo-a91.webp"},
  {family: "Faction Logo", item: "Bushmaster M17S"},
  {family: "Faction Logo", item: "KH-2002", image: "factionlogo-kh2002.webp"},
];

const families: readonly SkinFamily[] = ["Black & Gold", "Digital Wood", "Two Tone Desert", "Taxi", "Faction Logo"];

const copy: Record<Locale, {intro: string; archive: string; candidate: string; pending: string; note: string}> = {
  en: {
    intro: "A visual index of 21 listed WARDOGS cosmetics, grouped by finish. Images come from an owner-provided historical archive; current availability, pricing, and unlocks need a live-build check.",
    archive: "Historical archive image",
    candidate: "Candidate image; item identity unverified",
    pending: "Image pending identity check",
    note: "The archive file labelled wepn_033 shows a faction emblem, not the Bushmaster or its applied finish. No Bushmaster Faction Logo image is shown until that match is verified.",
  },
  ru: {
    intro: "Визуальный каталог 21 указанного облика WARDOGS. Изображения взяты из исторического архива владельца; наличие, цены и разблокировка в текущей версии требуют проверки.",
    archive: "Изображение из исторического архива", candidate: "Возможное изображение; предмет не подтвержден", pending: "Изображение ожидает проверки", note: "Файл wepn_033 показывает эмблему фракции, но не Bushmaster с этим обликом. Изображение будет добавлено после проверки.",
  },
  de: {
    intro: "Bildkatalog mit 21 gelisteten WARDOGS-Skins. Die Bilder stammen aus einem historischen Archiv des Eigentümers; aktuelle Verfügbarkeit, Preise und Freischaltungen müssen im Spiel geprüft werden.",
    archive: "Bild aus historischem Archiv", candidate: "Mögliches Bild; Gegenstand nicht bestätigt", pending: "Bild wartet auf Identitätsprüfung", note: "Die Datei wepn_033 zeigt ein Fraktionsemblem, aber keinen Bushmaster mit diesem Skin. Ein passendes Bild fehlt noch.",
  },
  "pt-br": {
    intro: "Índice visual de 21 cosméticos listados de WARDOGS. As imagens vêm de um arquivo histórico fornecido pelo proprietário; disponibilidade, preços e desbloqueios atuais precisam de confirmação no jogo.",
    archive: "Imagem de arquivo histórico", candidate: "Imagem candidata; item não confirmado", pending: "Imagem aguardando verificação", note: "O arquivo wepn_033 mostra um emblema de facção, não o Bushmaster com este visual. A imagem ficará pendente até a confirmação.",
  },
  ja: {
    intro: "WARDOGSの掲載済みスキン21件を仕上げ別にまとめた画像一覧です。画像は提供された過去のアーカイブ由来で、現行版の入手方法、価格、解除条件は未確認です。",
    archive: "過去のアーカイブ画像", candidate: "候補画像・対象アイテム未確認", pending: "画像の対象を確認中", note: "wepn_033には陣営エンブレムが写っていますが、Bushmasterに適用したスキンは確認できません。画像は照合まで保留します。",
  },
  "zh-cn": {
    intro: "按外观系列整理的 21 个 WARDOGS 皮肤条目。图片来自站长提供的历史素材包；当前版本的可用性、价格与解锁条件仍需游戏内核查。",
    archive: "历史素材图片", candidate: "候选图片，物品身份未核实", pending: "图片待核对身份", note: "wepn_033 文件展示的是阵营徽标，未显示 Bushmaster 武器或皮肤效果；确认对应关系前暂不配图。",
  },
};

export function SkinGallery({locale}: {locale: Locale}) {
  const labels = copy[locale];

  return (
    <div>
      <p className="max-w-3xl text-base leading-7 text-[#a8b4ae]">{labels.intro}</p>
      <div className="mt-10 space-y-12">
        {families.map((family) => (
          <section key={family} aria-labelledby={`skin-${family.replace(/\W+/g, "-").toLowerCase()}`}>
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#354039] pb-3">
              <h2 id={`skin-${family.replace(/\W+/g, "-").toLowerCase()}`} className="display-font text-2xl text-white md:text-3xl">{family}</h2>
              <span className="font-mono text-xs text-[#a8b4ae]">{skins.filter((skin) => skin.family === family).length}</span>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {skins.filter((skin) => skin.family === family).map((skin) => (
                <li data-skin-entry key={`${skin.family}-${skin.item}`} className="overflow-hidden border border-[#354039] bg-[#151b18]">
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-[#0c100e]">
                    {skin.image ? (
                      <Image
                        src={assetPath(`/images/catalogue/imported/cosmetics/${skin.image}`)}
                        alt={`${skin.family} ${skin.item} cosmetic archive preview`}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 270px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-contain p-4"
                      />
                    ) : <span className="px-6 text-center text-sm text-[#d9a93a]">{labels.pending}</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="display-font text-xl text-white">{skin.family} · {skin.item}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#a8b4ae]">{skin.image ? (skin.candidate ? labels.candidate : labels.archive) : labels.pending}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-10 max-w-3xl border-l-2 border-[#d9a93a] pl-4 text-sm leading-6 text-[#a8b4ae]">{labels.note}</p>
    </div>
  );
}
