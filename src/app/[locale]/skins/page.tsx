import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {SkinGallery} from "@/components/skins/skin-gallery";
import {isLocale, locales, type Locale} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

const headings: Record<Locale, {title: string; eyebrow: string; description: string}> = {
  en: {title: "WARDOGS Skins", eyebrow: "Cosmetic archive", description: "Browse 21 listed WARDOGS skins by finish, with historical image provenance and clear identity checks."},
  ru: {title: "Скины WARDOGS", eyebrow: "Архив обликов", description: "21 указанный облик WARDOGS с отметками о происхождении и проверке изображений."},
  de: {title: "WARDOGS-Skins", eyebrow: "Skin-Archiv", description: "21 gelistete WARDOGS-Skins mit Herkunft der Bilder und Hinweisen zur Identitätsprüfung."},
  "pt-br": {title: "Skins de WARDOGS", eyebrow: "Arquivo de visuais", description: "21 visuais listados de WARDOGS com origem das imagens e checagem de identidade."},
  ja: {title: "WARDOGS スキン", eyebrow: "外観アーカイブ", description: "掲載済みのWARDOGSスキン21件を、画像の出典と照合状況とともに確認できます。"},
  "zh-cn": {title: "WARDOGS 皮肤图鉴", eyebrow: "外观素材档案", description: "浏览 21 个已列出的 WARDOGS 皮肤，并查看图片来源与身份核对状态。"},
  "zh-tw": {title: "WARDOGS 造型圖鑑", eyebrow: "外觀素材檔案", description: "瀏覽 21 個已列出的 WARDOGS 造型，並查看圖片來源與物件核對狀態。"},
  pl: {title: "Skórki WARDOGS", eyebrow: "Archiwum wyglądu", description: "Przeglądaj 21 opisanych skórek WARDOGS. Sprawdź historyczne źródła obrazów oraz stan weryfikacji przedstawionych przedmiotów."},
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata(locale, "/skins", headings[locale].title, headings[locale].description);
}

export default async function SkinsPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const copy = headings[locale];

  return (
    <main className="site-container py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase text-[#69c78f]">{copy.eyebrow}</p>
        <h1 className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.title}</h1>
      </header>
      <SkinGallery locale={locale} />
    </main>
  );
}
