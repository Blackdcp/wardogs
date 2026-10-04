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
    title: "WARDOGS 交互式战术地图：FOB 路线、塔楼与迫击炮射程",
    desc: "规划 Bakurani、Ozeti、Zestafona 的控制区路线、FOB 补给线、塔楼推进和迫击炮射程。支持测距、标记和分享视角。",
    badge: "战术地图工具",
    calcPrompt: "测完路线或目标距离后，需要立刻算迫击炮 / 火炮密位？",
    calcCta: "打开迫击炮与火炮计算器 ➜",
    calcTitle: "打开迫击炮与火炮计算器"
  },
  en: {
    title: "WARDOGS Interactive Tactical Map: FOB Routes, Towers & Mortar Ranges",
    desc: "Plan Control Zone routes, FOB supply paths, tower pushes and mortar ranges on Bakurani, Ozeti and Zestafona. Pan, zoom, measure, mark and share the tactical view.",
    badge: "Tactical Map Tool",
    calcPrompt: "Need a firing solution after measuring the route or target range?",
    calcCta: "Open Mortar & Artillery Calculator ➜",
    calcTitle: "Open Mortar & Artillery Calculator"
  },
  de: {
    title: "WARDOGS taktische Karte: FOB-Routen, Türme & Mörserreichweiten",
    desc: "Plane Control-Zone-Routen, FOB-Nachschub, Tower-Pushes und Mörserreichweiten auf Bakurani, Ozeti und Zestafona. Messen, markieren und teilen.",
    badge: "Taktisches Kartentool",
    calcPrompt: "Nach der Entfernungsmessung direkt Mörser- oder Artilleriewerte berechnen?",
    calcCta: "Mörser- und Artillerie-Rechner öffnen ➜",
    calcTitle: "Mörser- und Artillerie-Rechner öffnen"
  },
  ru: {
    title: "Тактическая карта WARDOGS: FOB, башни и минометы",
    desc: "Планируйте маршруты Control Zone, снабжение FOB, атаки башен и дальности минометов на Bakurani, Ozeti и Zestafona. Измеряйте, ставьте метки и делитесь видом.",
    badge: "Тактическая карта",
    calcPrompt: "Измерили дистанцию и нужен расчет для миномета или артиллерии?",
    calcCta: "Открыть калькулятор миномета и артиллерии ➜",
    calcTitle: "Открыть калькулятор миномета и артиллерии"
  },
  "pt-br": {
    title: "Mapa tático WARDOGS: FOB, torres e alcance de morteiro",
    desc: "Planeje rotas de Control Zone, suprimento de FOB, avanço em torres e alcance de morteiro em Bakurani, Ozeti e Zestafona. Meça, marque e compartilhe a visão.",
    badge: "Ferramenta de mapa tático",
    calcPrompt: "Mediu a distância e precisa calcular morteiro ou artilharia?",
    calcCta: "Abrir calculadora de morteiro e artilharia ➜",
    calcTitle: "Abrir calculadora de morteiro e artilharia"
  },
  ja: {
    title: "WARDOGS 戦術マップ：FOBルート・塔・迫撃砲射程",
    desc: "Bakurani、Ozeti、ZestafonaでControl Zone経路、FOB補給、塔攻め、迫撃砲射程を計画。距離測定、マーカー、共有に対応します。",
    badge: "戦術マップツール",
    calcPrompt: "距離測定後に迫撃砲や砲兵の射撃解を計算しますか？",
    calcCta: "迫撃砲・砲兵計算機を開く ➜",
    calcTitle: "迫撃砲・砲兵計算機を開く"
  },
  pl: {
    title: "Mapa taktyczna WARDOGS: FOB, wieże i zasięg moździerzy",
    desc: "Planuj trasy Control Zone, dostawy FOB, wejścia na wieże i zasięg moździerzy na Bakurani, Ozeti i Zestafona. Mierz, oznaczaj i udostępniaj widok.",
    badge: "Narzędzie mapy taktycznej",
    calcPrompt: "Po pomiarze dystansu potrzebujesz nastaw moździerza lub artylerii?",
    calcCta: "Otwórz kalkulator moździerza i artylerii ➜",
    calcTitle: "Otwórz kalkulator moździerza i artylerii"
  },
  "zh-tw": {
    title: "WARDOGS 互動式戰術地圖：FOB 路線、塔樓與迫擊砲射程",
    desc: "規劃 Bakurani、Ozeti、Zestafona 的控制區路線、FOB 補給線、塔樓推進和迫擊砲射程。支援測距、標記和分享視角。",
    badge: "戰術地圖工具",
    calcPrompt: "測完路線或目標距離後，需要立刻算迫擊砲 / 火砲密位？",
    calcCta: "開啟迫擊砲與火砲計算器 ➜",
    calcTitle: "開啟迫擊砲與火砲計算器"
  }
};
