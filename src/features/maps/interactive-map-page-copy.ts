import type {Locale} from "@/config/site";

export const interactiveMapPageCopy: Record<Locale, {title: string; desc: string; badge: string}> = {
  "zh-cn": {
    title: "WARDOGS 交互式战区地图",
    desc: "查看 Bakurani、Ozeti、Zestafona 三张 2D 战场底图。支持拖动、缩放和切换地图。",
    badge: "2D 战场地图浏览器"
  },
  en: {
    title: "WARDOGS Interactive Map Viewer",
    desc: "View the Bakurani, Ozeti, and Zestafona 2D map images. Pan, zoom, and switch between maps.",
    badge: "2D Map Viewer"
  },
  de: {
    title: "WARDOGS Interaktiver Kartenbrowser",
    desc: "Sieh dir die Bakurani-, Ozeti- und Zestafona-2D-Kartenbilder an. Verschiebe, zoome und wechsle zwischen den Karten.",
    badge: "2D-Kartenbrowser"
  },
  ru: {
    title: "Интерактивный просмотр карт WARDOGS",
    desc: "Просматривайте 2D-изображения карт Bakurani, Ozeti и Zestafona. Перемещайте, масштабируйте и переключайте карты.",
    badge: "Просмотр 2D-карт"
  },
  "pt-br": {
    title: "Visualizador interativo de mapas de WARDOGS",
    desc: "Veja as imagens de mapas 2D de Bakurani, Ozeti e Zestafona. Arraste, amplie e alterne entre os mapas.",
    badge: "Visualizador de mapas 2D"
  },
  ja: {
    title: "WARDOGS インタラクティブマップビューア",
    desc: "Bakurani、Ozeti、Zestafona の2Dマップ画像を表示できます。ドラッグやズーム、マップの切り替えに対応しています。",
    badge: "2Dマップビューア"
  }
};
