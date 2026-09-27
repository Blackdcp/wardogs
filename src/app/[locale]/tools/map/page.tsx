import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {WardogsMapViewer} from "@/components/map/wardogs-map-viewer";
import {isLocale, locales, type Locale} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

const copy: Record<string, {title: string; desc: string; badge: string}> = {
  "zh-cn": {
    title: "WARDOGS 交互式战术战区地图",
    desc: "查看 Bakurani、Ozeti、Zestafona 三张 2D 战场底图；可缩放、拖动与切换地图。",
    badge: "2D 战术底图系统"
  },
  en: {
    title: "WARDOGS Interactive Tactical Theater Map",
    desc: "Explore 2D basemaps of Bakurani, Ozeti, and Zestafona. Pan, zoom, and switch between maps.",
    badge: "2D Tactical Cartography"
  },
  de: {
    title: "WARDOGS Interaktive Taktische Karte",
    desc: "Erkunde die 2D-Karten von Bakurani, Ozeti und Zestafona. Verschiebe, vergrößere und wechsle zwischen den Karten.",
    badge: "2D Taktische Karte"
  },
  ru: {
    title: "WARDOGS Интерактивная тактическая карта",
    desc: "Изучайте 2D-карты Bakurani, Ozeti и Zestafona. Перемещайте, увеличивайте и переключайте карты.",
    badge: "2D Тактическая карта"
  },
  "pt-br": {
    title: "Mapa Tático Interativo do WARDOGS",
    desc: "Explore os mapas 2D de Bakurani, Ozeti e Zestafona. Arraste, amplie e alterne entre os mapas.",
    badge: "Cartografia Tática 2D"
  },
  ja: {
    title: "WARDOGS インタラクティブ戦術マップ",
    desc: "Bakurani、Ozeti、Zestafona の2Dマップを表示。ドラッグ、ズーム、マップ切り替えに対応しています。",
    badge: "2D戦術マップ"
  }
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const c = copy[locale] || copy.en;
  return buildPageMetadata(locale as Locale, "/tools/map", c.title, c.desc);
}

export default async function TacticalMapPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const c = copy[requestedLocale] || copy.en;

  return (
    <main className="site-container py-8 md:py-12">
      <header className="mb-6 max-w-4xl">
        <span className="rounded bg-sky-950 px-2.5 py-1 font-mono text-xs font-semibold text-sky-400 border border-sky-800 uppercase tracking-wider">
          {c.badge}
        </span>
        <h1 className="display-font mt-3 text-3xl font-black text-white sm:text-4xl md:text-5xl">
          {c.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-300">
          {c.desc}
        </p>
      </header>

      <section aria-label="Interactive Map Viewer">
        <WardogsMapViewer initialMap="bakurani" locale={requestedLocale} />
      </section>
    </main>
  );
}
