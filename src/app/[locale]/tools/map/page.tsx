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
    desc: "16×16 km 全景战术测绘底图，支持平移缩放、网格标尺（1km/100m）、中心 2×2km 争夺区与塔台终端 1~5 号点位标记。",
    badge: "2D 战术底图系统"
  },
  en: {
    title: "WARDOGS Interactive Tactical Theater Map",
    desc: "16×16 km full theater tactical map with smooth pan & zoom, 1km/100m grid coordinates, 2×2km Control Zone, and verified Tower Terminals 1–5.",
    badge: "2D Tactical Cartography"
  },
  de: {
    title: "WARDOGS Interaktive Taktische Karte",
    desc: "16×16 km taktische Karte mit stufenlosem Zoom, Gitterkoordinaten (1km/100m), Kontrollzone und Funktürmen 1–5.",
    badge: "2D Taktische Karte"
  },
  ru: {
    title: "WARDOGS Интерактивная тактическая карта",
    desc: "Тактическая карта 16×16 км с масштабированием, сеткой координат (1 км / 100 м), зоной контроля 2×2 км и вышками 1–5.",
    badge: "2D Тактическая карта"
  },
  "pt-br": {
    title: "Mapa Tático Interativo do WARDOGS",
    desc: "Mapa tático de 16×16 km com zoom suave, grade de coordenadas (1km/100m), Zona de Controle 2×2km e Torres 1–5.",
    badge: "Cartografia Tática 2D"
  },
  ja: {
    title: "WARDOGS インタラクティブ戦術マップ",
    desc: "16×16 kmの全域戦術マップ。ズーム・パン、グリッド座標（1km/100m）、2×2km制圧エリア、タワー端末1〜5の表示に対応。",
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
        <WardogsMapViewer initialMap="bakurani" />
      </section>
    </main>
  );
}
