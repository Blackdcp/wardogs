export interface InteractiveMapCopy {
  title: string;
  desc: string;
  badge: string;
  calcPrompt: string;
  calcCta: string;
  calcTitle: string;
}

export const interactiveMapPageCopy: Record<string, InteractiveMapCopy> = {
  "zh-cn": {
    title: "WARDOGS 交互式战区地图",
    desc: "查看 Bakurani、Ozeti、Zestafona 三张 2D 战场底图。支持拖动、缩放和切换地图。",
    badge: "2D 战场地图浏览器",
    calcPrompt: "需要 L81 迫击炮 / SPH-2 自行火炮的高精度密位射表解算？",
    calcCta: "打开战术火控计算器 ➜",
    calcTitle: "打开战术火控计算器"
  },
  en: {
    title: "WARDOGS Interactive Map Viewer",
    desc: "View the Bakurani, Ozeti, and Zestafona 2D map images. Pan, zoom, and switch between maps.",
    badge: "2D Map Viewer",
    calcPrompt: "Looking for L81 Mortar & SPH-2 Artillery Mil firing solutions?",
    calcCta: "Open Artillery Calculator ➜",
    calcTitle: "Open Artillery Calculator"
  },
  de: {
    title: "WARDOGS Interaktiver Kartenbrowser",
    desc: "Sieh dir die Bakurani-, Ozeti- und Zestafona-2D-Kartenbilder an. Verschiebe, zoome und wechsle zwischen den Karten.",
    badge: "2D-Kartenbrowser",
    calcPrompt: "Benötigen Sie präzise Strich-Schusstafeln für L81 Mörser & SPH-2 Artillerie?",
    calcCta: "Artillerie-Rechner öffnen ➜",
    calcTitle: "Artillerie-Rechner öffnen"
  },
  ru: {
    title: "Интерактивный просмотр карт WARDOGS",
    desc: "Просматривайте 2D-изображения карт Bakurani, Ozeti и Zestafona. Перемещайте, масштабируйте и переключайте карты.",
    badge: "Просмотр 2D-карт",
    calcPrompt: "Нужны точные таблицы стрельбы в тысячных для миномета L81 и САУ SPH-2?",
    calcCta: "Открыть артиллерийский калькулятор ➜",
    calcTitle: "Открыть артиллерийский калькулятор"
  },
  "pt-br": {
    title: "Visualizador interativo de mapas de WARDOGS",
    desc: "Veja as imagens de mapas 2D de Bakurani, Ozeti e Zestafona. Arraste, amplie e alterne entre os mapas.",
    badge: "Visualizador de mapas 2D",
    calcPrompt: "Procurando soluções de tiro em mils para morteiro L81 e artilharia SPH-2?",
    calcCta: "Abrir Calculadora de Artilharia ➜",
    calcTitle: "Abrir Calculadora de Artilharia"
  },
  ja: {
    title: "WARDOGS インタラクティブマップビューア",
    desc: "Bakurani、Ozeti、Zestafona の2Dマップ画像を表示できます。ドラッグやズーム、マップの切り替えに対応しています。",
    badge: "2Dマップビューア",
    calcPrompt: "L81迫撃砲 / SPH-2自走砲の高精度ミル射表・弾道解算が必要ですか？",
    calcCta: "弾道火控計算機を開く ➜",
    calcTitle: "弾道火控計算機を開く"
  },
  pl: {
    title: "Interaktywna przeglądarka map WARDOGS",
    desc: "Oglądaj obrazy 2D map Bakurani, Ozeti i Zestafona. Przesuwaj, przybliżaj i przełączaj mapy.",
    badge: "Przeglądarka map 2D",
    calcPrompt: "Szukasz precyzyjnych obliczeń w tysięcznych dla moździerza L81 i artylerii SPH-2?",
    calcCta: "Otwórz kalkulator artylerii ➜",
    calcTitle: "Otwórz kalkulator artylerii"
  },
  "zh-tw": {
    title: "WARDOGS 互動式戰區地圖",
    desc: "檢視 Bakurani、Ozeti、Zestafona 三張 2D 戰場底圖。支援拖動、縮放和切換地圖。",
    badge: "2D 戰場地圖瀏覽器",
    calcPrompt: "需要 L81 迫擊砲 / SPH-2 自走砲的高精度密位射表解算？",
    calcCta: "開啟戰術火控計算器 ➜",
    calcTitle: "開啟戰術火控計算器"
  }
};
