import {communityPois, type CommunityPoi} from "./map-community-pois";
import {getMapPlannerCopy} from "./map-planner-copy";
import {fieldReferenceCopy} from "./map-field-reference-copy";
import type {Locale} from "@/config/site";
import {calculateFiringSolution} from "@/features/artillery/ballistics-data";

export type BallisticRow = {
  range: number;
  mils: number;
  tof: number;
  notes?: "minRange" | "maxEffective";
};

const MORTAR_RANGES = [80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 684, 697] as const;
const ARTILLERY_RANGES = [735, 900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500, 2629] as const;

export const MORTAR_81MM_BALLISTICS: readonly BallisticRow[] = MORTAR_RANGES.map((range, index) => {
  const sol = calculateFiringSolution({weaponId: "mortar", distanceMeters: range});
  return {
    range,
    mils: sol.elevationMil,
    tof: sol.timeOfFlightSeconds,
    ...(index === 0 ? {notes: "minRange"} : index === MORTAR_RANGES.length - 1 ? {notes: "maxEffective"} : {})
  };
});

export const ARTILLERY_155MM_BALLISTICS: readonly BallisticRow[] = ARTILLERY_RANGES.map((range, index) => {
  const sol = calculateFiringSolution({weaponId: "sph2", distanceMeters: range, mode: "high"});
  return {
    range,
    mils: sol.elevationMil,
    tof: sol.timeOfFlightSeconds,
    ...(index === 0 ? {notes: "minRange"} : index === ARTILLERY_RANGES.length - 1 ? {notes: "maxEffective"} : {})
  };
});

export type MapTheaterIntel = {
  id: "bakurani" | "ozeti" | "zestafona";
  name: string;
  type: string;
  sectors: readonly string[];
  tactics: string;
};

export type TacticalIntelCopy = {
  secondScreenTitle: string;
  secondScreenDesc: string;
  features: readonly {title: string; desc: string}[];
  fireControlBadge: string;
  ballisticsTitle: string;
  ballisticsSubtitle: string;
  mortarTab: string;
  artilleryTab: string;
  rangeCol: string;
  milsCol: string;
  tofCol: string;
  notesCol: string;
  minRangeLabel: string;
  maxEffectiveLabel: string;
  standardMortarAmmo: string;
  standardArtilleryAmmo: string;
  ballisticsRuleTitle: string;
  ballisticsRuleDesc: string;
  theaterIntelBadge: string;
  theatersTitle: string;
  theatersSubtitle: string;
  keySectorsLabel: string;
  tacticalSopLabel: string;
  theaters: readonly MapTheaterIntel[];
  doctrineBadge: string;
  relatedGuidesTitle: string;
  guides: readonly {title: string; href: string; desc: string}[];
};

function getCommunityTheaters(locale: Locale): readonly MapTheaterIntel[] {
  const copy = getMapPlannerCopy(locale);
  const kinds: CommunityPoi["kind"][] = ["tower", "garage_vendor", "weapons_vendor", "spawn_board"];
  return (["bakurani", "ozeti", "zestafona"] as const).map((id) => ({
    id,
    name: id[0].toUpperCase() + id.slice(1),
    type: copy.community,
    sectors: kinds.flatMap((kind) => {
      const count = communityPois.filter((poi) => poi.map === id && poi.kind === kind).length;
      return count ? [copy[kind] + ": " + count] : [];
    }),
    tactics: fieldReferenceCopy[locale].tactics
  }));
}

const tacticalIntelEn: TacticalIntelCopy = {
  secondScreenTitle: "Dual-Monitor Field Command & Tactical Workflow",
  secondScreenDesc: fieldReferenceCopy["en"].intro,
  features: [
    {
      title: "Second-Screen Optimization",
      desc: getMapPlannerCopy("en").routeHelp + " " + getMapPlannerCopy("en").limits
    },
    {
      title: "Ballistics & Elevation Tables",
      desc: "Instant mil-to-range elevation references for L81 81mm Mortars and SPH-2 155mm Howitzers right under the interactive canvas."
    },
    {
      title: "Instant Squad Share URL",
      desc: "Click 'Share view and markers' to generate a persistent URL hash with marked waypoints, artillery targets, or rally points for your team."
    }
  ],
  fireControlBadge: "Indirect Fire Control",
  ballisticsTitle: "Artillery & Mortar Elevation Quick Reference",
  ballisticsSubtitle: fieldReferenceCopy["en"].tableHelp,
  mortarTab: "81mm Mortar (L81)",
  artilleryTab: "155mm Artillery (SPH-2)",
  rangeCol: "Range (m)",
  milsCol: "Elevation (mils)",
  tofCol: "Est. flight time (s)",
  notesCol: "Operational Notes",
  minRangeLabel: "Min range",
  maxEffectiveLabel: "Max effective",
  standardMortarAmmo: "Standard 81mm HE",
  standardArtilleryAmmo: "155mm Heavy HE",
  ballisticsRuleTitle: fieldReferenceCopy["en"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["en"].correction,
  theaterIntelBadge: "Theater Intel",
  theatersTitle: fieldReferenceCopy["en"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("en").communityHelp,
  keySectorsLabel: getMapPlannerCopy("en").community,
  tacticalSopLabel: "Tactical SOP:",
  doctrineBadge: "Doctrine & SOP",
  theaters: getCommunityTheaters("en"),
  relatedGuidesTitle: "Essential Tactical Guides for Field Commanders",
  guides: [
    {
      title: "Mortar Firing & FOB Shelling Guide",
      href: "/guides/wardogs-mortar-guide",
      desc: "Complete guide on aiming, spotting, counter-battery operations, and shell-camera mechanics."
    },
    {
      title: "SPH-2 Artillery Tank Guide",
      href: "/guides/wardogs-artillery-guide",
      desc: "Career 90 unlock requirements, $8,000 deployment economics, and three-man crew coordination."
    },
    {
      title: "Helicopter Flight & Transport Guide",
      href: "/guides/wardogs-helicopter-guide",
      desc: "Flight mechanics, LZ extraction SOPs, and avoiding Stingray anti-air lock-ons."
    },
    {
      title: "FOB Construction & Logistics Guide",
      href: "/guides/wardogs-fob-guide",
      desc: "How to fortify forward operating bases, route supply trucks, and maintain indirect fire ammunition."
    }
  ]
};

const tacticalIntelZhCn: TacticalIntelCopy = {
  secondScreenTitle: "副屏作战指挥与实战战术工作流",
  secondScreenDesc: fieldReferenceCopy["zh-cn"].intro,
  features: [
    {
      title: "副显示屏专属优化",
      desc: getMapPlannerCopy("zh-cn").routeHelp + " " + getMapPlannerCopy("zh-cn").limits
    },
    {
      title: "迫击炮与重炮密位射表",
      desc: "在交互画布正下方提供 L81 81mm 迫击炮与 SPH-2 155mm 自行榴弹炮的距离-密位对照表，即时校射。"
    },
    {
      title: "小队坐标一键同步",
      desc: "点击“分享当前视角与标记”即可生成带有点位、火炮标定与集结点的 URL 哈希链接，秒发队友。"
    }
  ],
  fireControlBadge: "曲射火力控制",
  ballisticsTitle: "迫击炮与自行火炮密位射表速查",
  ballisticsSubtitle: fieldReferenceCopy["zh-cn"].tableHelp,
  mortarTab: "81mm 迫击炮 (L81)",
  artilleryTab: "155mm 自行火炮 (SPH-2)",
  rangeCol: "目标距离 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "估算飞行时间 (秒)",
  notesCol: "实战说明",
  minRangeLabel: "最小射程",
  maxEffectiveLabel: "最大有效射程",
  standardMortarAmmo: "标准 81mm 高爆弹",
  standardArtilleryAmmo: "155mm 重型高爆弹",
  ballisticsRuleTitle: fieldReferenceCopy["zh-cn"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["zh-cn"].correction,
  theaterIntelBadge: "战区态势情报",
  theatersTitle: fieldReferenceCopy["zh-cn"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("zh-cn").communityHelp,
  keySectorsLabel: getMapPlannerCopy("zh-cn").community,
  tacticalSopLabel: "战术标准作业程序 (SOP)：",
  theaters: getCommunityTheaters("zh-cn"),
  doctrineBadge: "战术条令与实战 SOP",
  relatedGuidesTitle: "战场指挥官核心实战攻略",
  guides: [
    {
      title: "迫击炮瞄准与反制 FOB 炮击指南",
      href: "/guides/wardogs-mortar-guide",
      desc: "涵盖密位测距、观察手协同、反炮兵雷达与炮弹视角全流程 SOP。"
    },
    {
      title: "SPH-2 自行火炮装甲车实战指南",
      href: "/guides/wardogs-artillery-guide",
      desc: "90 级解锁门槛、$8,000 部署成本精算与三人车组装填协调。"
    },
    {
      title: "直升机飞行驾驶与空运机降指南",
      href: "/guides/wardogs-helicopter-guide",
      desc: "飞行操控手感、降落区撤离规程与规避毒刺防空导弹技巧。"
    },
    {
      title: "前线基地 (FOB) 建造与后勤物流指南",
      href: "/guides/wardogs-fob-guide",
      desc: "如何建立坚固前哨、开辟卡车补给线并保障曲射火力弹药供应。"
    }
  ]
};

const tacticalIntelZhTw: TacticalIntelCopy = {
  secondScreenTitle: "副螢幕作戰指揮與實戰戰術工作流",
  secondScreenDesc: fieldReferenceCopy["zh-tw"].intro,
  features: [
    {
      title: "副顯示螢幕專屬優化",
      desc: getMapPlannerCopy("zh-tw").routeHelp + " " + getMapPlannerCopy("zh-tw").limits
    },
    {
      title: "迫擊砲與重砲密位射表",
      desc: "在互動畫布正下方提供 L81 81mm 迫擊砲與 SPH-2 155mm 自行榴彈砲的距離-密位對照表，即時校射。"
    },
    {
      title: "小隊座標一鍵同步",
      desc: "點擊「分享當前視角與標記」即可生成帶有點位、火砲標定與集結點的 URL 哈希連結，秒發隊友。"
    }
  ],
  fireControlBadge: "曲射火力控制",
  ballisticsTitle: "迫擊砲與自行火砲密位射表速查",
  ballisticsSubtitle: fieldReferenceCopy["zh-tw"].tableHelp,
  mortarTab: "81mm 迫擊砲 (L81)",
  artilleryTab: "155mm 自行火砲 (SPH-2)",
  rangeCol: "目標距離 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "估算飛行時間 (秒)",
  notesCol: "實戰說明",
  minRangeLabel: "最小射程",
  maxEffectiveLabel: "最大有效射程",
  standardMortarAmmo: "標準 81mm 高爆彈",
  standardArtilleryAmmo: "155mm 重型高爆彈",
  ballisticsRuleTitle: fieldReferenceCopy["zh-tw"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["zh-tw"].correction,
  theaterIntelBadge: "戰區態勢情報",
  theatersTitle: fieldReferenceCopy["zh-tw"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("zh-tw").communityHelp,
  keySectorsLabel: getMapPlannerCopy("zh-tw").community,
  tacticalSopLabel: "戰術標準作業程序 (SOP)：",
  theaters: getCommunityTheaters("zh-tw"),
  doctrineBadge: "戰術條令與實戰 SOP",
  relatedGuidesTitle: "戰場指揮官核心實戰攻略",
  guides: [
    {
      title: "迫擊砲瞄準與反制 FOB 砲擊指南",
      href: "/guides/wardogs-mortar-guide",
      desc: "涵蓋密位測距、觀察手協同、反砲兵雷達與砲彈視角全流程 SOP。"
    },
    {
      title: "SPH-2 自行火砲裝甲車實戰指南",
      href: "/guides/wardogs-artillery-guide",
      desc: "90 級解鎖門檻、$8,000 部署成本精算與三人車組裝填協調。"
    },
    {
      title: "直升機飛行駕駛與空運機降指南",
      href: "/guides/wardogs-helicopter-guide",
      desc: "飛行操控手感、降落區撤離規程與規避毒刺防空飛彈技巧。"
    },
    {
      title: "前線基地 (FOB) 建造與後勤物流指南",
      href: "/guides/wardogs-fob-guide",
      desc: "如何建立堅固前哨、開闢卡車補給線並保障曲射火力彈藥供應。"
    }
  ]
};

const tacticalIntelJa: TacticalIntelCopy = {
  secondScreenTitle: "サブモニター戦術指揮＆実戦ワークフロー",
  secondScreenDesc: fieldReferenceCopy["ja"].intro,
  features: [
    {
      title: "サブモニター専用設計",
      desc: getMapPlannerCopy("ja").routeHelp + " " + getMapPlannerCopy("ja").limits
    },
    {
      title: "迫撃砲・重砲 仰角射表",
      desc: "インタラクティブマップの直下にL81 81mm迫撃砲とSPH-2 155mm自走榴弾砲の距離・ミル照準対照表を常備。"
    },
    {
      title: "分隊共有URL即時発行",
      desc: "「視点とマーカーを共有」をクリックすると、指定したウェイポイント、砲撃目標、集結地点を含むURLハッシュを生成します。"
    }
  ],
  fireControlBadge: "間接射撃統制",
  ballisticsTitle: "迫撃砲・自走砲 仰角クイックリファレンス",
  ballisticsSubtitle: fieldReferenceCopy["ja"].tableHelp,
  mortarTab: "81mm迫撃砲 (L81)",
  artilleryTab: "155mm榴弾砲 (SPH-2)",
  rangeCol: "距離 (m)",
  milsCol: "仰角 (mils)",
  tofCol: "推定飛翔時間 (秒)",
  notesCol: "運用ノート",
  minRangeLabel: "最短射程",
  maxEffectiveLabel: "最大有効射程",
  standardMortarAmmo: "標準 81mm 榴弾 (HE)",
  standardArtilleryAmmo: "155mm 重榴弾 (HE)",
  ballisticsRuleTitle: fieldReferenceCopy["ja"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["ja"].correction,
  theaterIntelBadge: "戦域情報",
  theatersTitle: fieldReferenceCopy["ja"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("ja").communityHelp,
  keySectorsLabel: getMapPlannerCopy("ja").community,
  tacticalSopLabel: "戦術標準手順 (SOP)：",
  theaters: getCommunityTheaters("ja"),
  doctrineBadge: "教本＆標準手順 (SOP)",
  relatedGuidesTitle: "戦場指揮官のための重要戦術ガイド",
  guides: [
    {
      title: "迫撃砲照準＆対FOB砲撃ガイド",
      href: "/guides/wardogs-mortar-guide",
      desc: "ミル測距、観測連携、対砲兵レーダー回避、砲弾カメラ運用の全手順。"
    },
    {
      title: "SPH-2 自走砲装甲車両 実戦ガイド",
      href: "/guides/wardogs-artillery-guide",
      desc: "レベル90解放条件、$8,000配備コスト精算、3人乗員の装填連携。"
    },
    {
      title: "ヘリコプター操縦＆空挺降下ガイド",
      href: "/guides/wardogs-helicopter-guide",
      desc: "操縦特性、着陸ゾーン離脱手順、スティンガー防空ミサイル回避術。"
    },
    {
      title: "前線基地 (FOB) 建設＆兵站補給ガイド",
      href: "/guides/wardogs-fob-guide",
      desc: "堅固な前哨拠点の構築、トラック補給線の開拓、間接火力への弾薬供給。"
    }
  ]
};

const tacticalIntelRu: TacticalIntelCopy = {
  secondScreenTitle: "Тактическое управление и рабочий процесс для второго экрана",
  secondScreenDesc: fieldReferenceCopy["ru"].intro,
  features: [
    {
      title: "Оптимизация для второго экрана",
      desc: getMapPlannerCopy("ru").routeHelp + " " + getMapPlannerCopy("ru").limits
    },
    {
      title: "Таблицы стрельбы минометов и артиллерии",
      desc: "Мгновенные таблицы перевода дистанции в тысячные для 81-мм миномета L81 и 155-мм САУ SPH-2 прямо под картой."
    },
    {
      title: "Ссылка для отряда в один клик",
      desc: "Нажмите «Поделиться видом и метками», чтобы получить постоянную ссылку с отмеченными точками маршрута, целями и сбором."
    }
  ],
  fireControlBadge: "Управление огнем",
  ballisticsTitle: "Таблицы возвышения для минометов и артиллерии",
  ballisticsSubtitle: fieldReferenceCopy["ru"].tableHelp,
  mortarTab: "81-мм миномет (L81)",
  artilleryTab: "155-мм артиллерия (SPH-2)",
  rangeCol: "Дистанция (м)",
  milsCol: "Прицел (тыс.)",
  tofCol: "Оценка времени полёта (с)",
  notesCol: "Примечания",
  minRangeLabel: "Мин. дистанция",
  maxEffectiveLabel: "Макс. эфф. дальность",
  standardMortarAmmo: "Стандартный 81-мм ОФ",
  standardArtilleryAmmo: "155-мм тяжелый ОФ",
  ballisticsRuleTitle: fieldReferenceCopy["ru"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["ru"].correction,
  theaterIntelBadge: "Разведданные ТВД",
  theatersTitle: fieldReferenceCopy["ru"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("ru").communityHelp,
  keySectorsLabel: getMapPlannerCopy("ru").community,
  tacticalSopLabel: "Тактический регламент (SOP):",
  theaters: getCommunityTheaters("ru"),
  doctrineBadge: "Тактическая доктрина и SOP",
  relatedGuidesTitle: "Ключевые тактические руководства для командиров",
  guides: [
    {
      title: "Наведение минометов и обстрел вражеских FOB",
      href: "/guides/wardogs-mortar-guide",
      desc: "Расчет дистанции в тысячных, работа с наводчиком, радар контрбатарейной борьбы и камера снаряда."
    },
    {
      title: "Боевое применение САУ SPH-2 (155 мм)",
      href: "/guides/wardogs-artillery-guide",
      desc: "Требование 90-го уровня, затраты на развертывание $8,000 и слаженная работа экипажа из 3 человек."
    },
    {
      title: "Пилотирование вертолетов и тактический десант",
      href: "/guides/wardogs-helicopter-guide",
      desc: "Управление полетом, процедуры эвакуации с зоны посадки и уклонение от ракет ПЗРК."
    },
    {
      title: "Строительство FOB и логистика снабжения",
      href: "/guides/wardogs-fob-guide",
      desc: "Как возвести укрепленный аванпост, наладить цепочку поставок и обеспечить снарядами артиллерию."
    }
  ]
};

const tacticalIntelDe: TacticalIntelCopy = {
  secondScreenTitle: "Taktische Einsatzführung auf dem Zweitbildschirm",
  secondScreenDesc: fieldReferenceCopy["de"].intro,
  features: [
    {
      title: "Optimiert für Zweitmonitore",
      desc: getMapPlannerCopy("de").routeHelp + " " + getMapPlannerCopy("de").limits
    },
    {
      title: "Mörser- & Artillerie-Schusstafeln",
      desc: "Sofortige Strich-zu-Reichweite-Erhöhungstabellen für L81 81mm-Mörser und SPH-2 155mm-Haubitzen direkt unter der Karte."
    },
    {
      title: "Squad-Freigabe-URL per Klick",
      desc: "Klicken Sie auf 'Ansicht und Markierungen teilen', um eine persistente URL mit Wegpunkten, Zielen und Sammelpunkten zu erstellen."
    }
  ],
  fireControlBadge: "Indirekte Feuerleitung",
  ballisticsTitle: "Schnellübersicht Artillerie- und Mörsererhöhung",
  ballisticsSubtitle: fieldReferenceCopy["de"].tableHelp,
  mortarTab: "81mm Mörser (L81)",
  artilleryTab: "155mm Artillerie (SPH-2)",
  rangeCol: "Reichweite (m)",
  milsCol: "Erhöhung (Strich)",
  tofCol: "Geschätzte Flugzeit (s)",
  notesCol: "Einsatzhinweise",
  minRangeLabel: "Min. Reichweite",
  maxEffectiveLabel: "Max. effektive Reichweite",
  standardMortarAmmo: "Standard 81mm HE",
  standardArtilleryAmmo: "155mm schwere HE",
  ballisticsRuleTitle: fieldReferenceCopy["de"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["de"].correction,
  theaterIntelBadge: "Kriegsschauplatz-Aufklärung",
  theatersTitle: fieldReferenceCopy["de"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("de").communityHelp,
  keySectorsLabel: getMapPlannerCopy("de").community,
  tacticalSopLabel: "Taktische Standardverfahren (SOP):",
  theaters: getCommunityTheaters("de"),
  doctrineBadge: "Doktrin & SOP",
  relatedGuidesTitle: "Wichtige Taktikleitfäden für Kommandanten",
  guides: [
    {
      title: "Mörser-Zielen & Beschuss feindlicher FOBs",
      href: "/guides/wardogs-mortar-guide",
      desc: "Entfernungsermittlung in Strich, Spotter-Koordination, Artillerieradar und Granatenkamera."
    },
    {
      title: "SPH-2 155mm Selbstfahrlafette im Feldeinsatz",
      href: "/guides/wardogs-artillery-guide",
      desc: "Stufe-90-Voraussetzung, $8.000 Bereitstellungskosten und Dreier-Besatzungsabläufe."
    },
    {
      title: "Hubschrauber-Pilotierung & Luftlandetaktik",
      href: "/guides/wardogs-helicopter-guide",
      desc: "Flugeigenschaften, LZ-Evakuierungsverfahren und Ausweichen von Flugabwehrraketen."
    },
    {
      title: "FOB-Bau & Nachschub-Logistik",
      href: "/guides/wardogs-fob-guide",
      desc: "Errichtung befestigter Vorposten, Lkw-Versorgungslinien und Munitionsnachschub für Artillerie."
    }
  ]
};

const tacticalIntelPtBr: TacticalIntelCopy = {
  secondScreenTitle: "Comando Tático e Fluxo de Batalha no Segundo Monitor",
  secondScreenDesc: fieldReferenceCopy["pt-br"].intro,
  features: [
    {
      title: "Otimizado para Segunda Tela",
      desc: getMapPlannerCopy("pt-br").routeHelp + " " + getMapPlannerCopy("pt-br").limits
    },
    {
      title: "Tabelas de Elevação para Morteiros e Artilharia",
      desc: "Conversão direta de distância para mils para o morteiro L81 de 81mm e obuseiro autopropulsado SPH-2 de 155mm logo abaixo do mapa."
    },
    {
      title: "Link Instantâneo de Compartilhamento de Esquadrão",
      desc: "Clique em 'Compartilhar visão e marcadores' para gerar uma URL persistente com pontos de rota, alvos e locais de reagrupamento."
    }
  ],
  fireControlBadge: "Controle de Fogo Indireto",
  ballisticsTitle: "Referência Rápida de Elevação de Morteiros e Artilharia",
  ballisticsSubtitle: fieldReferenceCopy["pt-br"].tableHelp,
  mortarTab: "Morteiro 81mm (L81)",
  artilleryTab: "Artilharia 155mm (SPH-2)",
  rangeCol: "Alcance (m)",
  milsCol: "Elevação (mils)",
  tofCol: "Tempo de voo estimado (s)",
  notesCol: "Notas Operacionais",
  minRangeLabel: "Alcance Mínimo",
  maxEffectiveLabel: "Alcance Máx. Efetivo",
  standardMortarAmmo: "81mm HE Padrão",
  standardArtilleryAmmo: "155mm HE Pesado",
  ballisticsRuleTitle: fieldReferenceCopy["pt-br"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["pt-br"].correction,
  theaterIntelBadge: "Inteligência de Teatro",
  theatersTitle: fieldReferenceCopy["pt-br"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("pt-br").communityHelp,
  keySectorsLabel: getMapPlannerCopy("pt-br").community,
  tacticalSopLabel: "Procedimento Padrão (SOP):",
  theaters: getCommunityTheaters("pt-br"),
  doctrineBadge: "Doutrina e SOP",
  relatedGuidesTitle: "Guias Táticos Essenciais para Comandantes de Campo",
  guides: [
    {
      title: "Mira de Morteiro e Bombardeio de FOBs Inimigas",
      href: "/guides/wardogs-mortar-guide",
      desc: "Cálculo de mils, trabalho de observador, radar de contrabateria e câmera de projétil."
    },
    {
      title: "Guia Operacional do Blindado de Artilharia SPH-2 (155mm)",
      href: "/guides/wardogs-artillery-guide",
      desc: "Requisito de nível 90, custo de $8.000 e coordenação de tripulação de 3 operadores."
    },
    {
      title: "Pilotagem de Helicópteros e Desembarque Tático",
      href: "/guides/wardogs-helicopter-guide",
      desc: "Manuseio de voo, evacuação em zonas de pouso e evasão de mísseis antiaéreos."
    },
    {
      title: "Construção de FOBs e Logística de Suprimentos",
      href: "/guides/wardogs-fob-guide",
      desc: "Como erguer postos avançados, manter linhas de comboios e abastecer munição pesada."
    }
  ]
};

const tacticalIntelPl: TacticalIntelCopy = {
  secondScreenTitle: "Dowodzenie taktyczne i przepływ pracy na drugim ekranie",
  secondScreenDesc: fieldReferenceCopy["pl"].intro,
  features: [
    {
      title: "Optymalizacja pod drugi monitor",
      desc: getMapPlannerCopy("pl").routeHelp + " " + getMapPlannerCopy("pl").limits
    },
    {
      title: "Tabele kątów podniesienia moździerzy i artylerii",
      desc: "Natychmiastowe tabele przeliczania zasięgu na tysięczne dla moździerza L81 81mm oraz haubicy SPH-2 155mm tuż pod mapą."
    },
    {
      title: "Błyskawiczne udostępnianie widoku drużynie",
      desc: "Kliknij 'Udostępnij widok i znaczniki', aby wygenerować link z zapisanymi punktami trasy, celami artyleryjskimi i punktami zbiórki."
    }
  ],
  fireControlBadge: "Kierowanie Ogniem Pośrednim",
  ballisticsTitle: "Szybka ściąga kątów podniesienia artylerii i moździerzy",
  ballisticsSubtitle: fieldReferenceCopy["pl"].tableHelp,
  mortarTab: "Moździerz 81mm (L81)",
  artilleryTab: "Artyleria 155mm (SPH-2)",
  rangeCol: "Zasięg (m)",
  milsCol: "Kąt podniesienia (tys.)",
  tofCol: "Szacowany czas lotu (s)",
  notesCol: "Uwagi operacyjne",
  minRangeLabel: "Minimalny zasięg",
  maxEffectiveLabel: "Maks. zasięg skuteczny",
  standardMortarAmmo: "Standardowy 81mm HE",
  standardArtilleryAmmo: "Ciężki 155mm HE",
  ballisticsRuleTitle: fieldReferenceCopy["pl"].correctionTitle,
  ballisticsRuleDesc: fieldReferenceCopy["pl"].correction,
  theaterIntelBadge: "Wywiad Teatru Działań",
  theatersTitle: fieldReferenceCopy["pl"].theatersTitle,
  theatersSubtitle: getMapPlannerCopy("pl").communityHelp,
  keySectorsLabel: getMapPlannerCopy("pl").community,
  tacticalSopLabel: "Standardowe procedury (SOP):",
  theaters: getCommunityTheaters("pl"),
  doctrineBadge: "Doktryna i SOP",
  relatedGuidesTitle: "Niezbędne poradniki taktyczne dla dowódców polowych",
  guides: [
    {
      title: "Celowanie moździerzem i ostrzał wrogich FOB-ów",
      href: "/guides/wardogs-mortar-guide",
      desc: "Wyznaczanie odległości w tysięcznych, współpraca ze spotterem, radar kontrbateryjny i kamera pocisku."
    },
    {
      title: "Działo samobieżne SPH-2 (155mm) w boju",
      href: "/guides/wardogs-artillery-guide",
      desc: "Wymóg 90. poziomu, koszt wystawienia $8,000 i zgranie 3-osobowej załogi."
    },
    {
      title: "Pilotaż śmigłowców i desant taktyczny",
      href: "/guides/wardogs-helicopter-guide",
      desc: "Sterowanie, procedury ewakuacji ze strefy lądowania i unikanie rakiet plot."
    },
    {
      title: "Budowa baz FOB i logistyka zaopatrzenia",
      href: "/guides/wardogs-fob-guide",
      desc: "Jak stawiać umocnione posterunki, utrzymywać linie dostaw i zaopatrywać baterie w amunicję."
    }
  ]
};

export function getTacticalIntelCopy(locale: Locale): TacticalIntelCopy {
  switch (locale) {
    case "zh-cn":
      return tacticalIntelZhCn;
    case "zh-tw":
      return tacticalIntelZhTw;
    case "ja":
      return tacticalIntelJa;
    case "ru":
      return tacticalIntelRu;
    case "de":
      return tacticalIntelDe;
    case "pt-br":
      return tacticalIntelPtBr;
    case "pl":
      return tacticalIntelPl;
    default:
      return tacticalIntelEn;
  }
}
