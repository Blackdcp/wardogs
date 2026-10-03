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

const tacticalIntelEn: TacticalIntelCopy = {
  secondScreenTitle: "Dual-Monitor Field Command & Tactical Workflow",
  secondScreenDesc: "Run this interactive map on your second display during raids and clan wars. Calibrate distances with the ruler, spot enemy FOBs, and direct fire support in real time.",
  features: [
    {
      title: "Second-Screen Optimization",
      desc: "Keep the map live during 20–40 minute raids to navigate terrain, plan logistics supply routes, and check chokepoints without alt-tabbing."
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
  ballisticsSubtitle: "Community-verified range-to-mil elevation conversion tables for indirect fire support",
  mortarTab: "81mm Mortar (L81)",
  artilleryTab: "155mm Artillery (SPH-2)",
  rangeCol: "Range (m)",
  milsCol: "Elevation (mils)",
  tofCol: "Time of Flight (s)",
  notesCol: "Operational Notes",
  minRangeLabel: "Min range",
  maxEffectiveLabel: "Max effective",
  standardMortarAmmo: "Standard 81mm HE",
  standardArtilleryAmmo: "155mm Heavy HE",
  ballisticsRuleTitle: "Field Correction Rule of Thumb",
  ballisticsRuleDesc: "For 81mm Mortars (L81), adjust ~125 mils per 100m range delta (e.g. 400m is 550 mils, 500m is 425 mils). For 155mm Artillery (SPH-2), adjust ~25–50 mils per 100m depending on range envelope. Always fire one ranging round, observe the impact via spotter or shell camera, and adjust elevation/azimuth before expending battery volleys.",
  theaterIntelBadge: "Theater Intel",
  theatersTitle: "Strategic Theater Operational Profiles",
  theatersSubtitle: "Terrain breakdown, fortified sectors, and tactical considerations across all three active maps",
  keySectorsLabel: "Key Sectors:",
  tacticalSopLabel: "Tactical SOP:",
  doctrineBadge: "Doctrine & SOP",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani",
      type: "Mountain & Valley Basin (256 km²)",
      sectors: [
        "Communications Mast Ridge (Grid D4/E4) - Supreme spotting elevation",
        "South Hydro Substation - Essential power objective & convoy route",
        "River Valley Chokepoint - Ambush zone for armor & logistics trucks"
      ],
      tactics: "Position mortar batteries in reverse-slope valleys to shield crews from direct counter-battery fire. Station MANPADS/Stingray teams on ridgelines to deny enemy CAS helicopters."
    },
    {
      id: "ozeti",
      name: "Ozeti",
      type: "River Crossing & Industrial Complex",
      sectors: [
        "Central Rail Marshalling Yard - Heavy industrial cover & close-quarters fighting",
        "River Barge Ferry Crossing - Primary armor transit bottleneck",
        "Power Distribution Substation - High-value tactical FOB construction site"
      ],
      tactics: "SPH-2 artillery can dominate river crossings from 1,200m standoff range. Maintain dedicated logistics supply depots on the friendly bank to feed 155mm shell consumption."
    },
    {
      id: "zestafona",
      name: "Zestafona",
      type: "Coastal Peninsula & Port Operations",
      sectors: [
        "Container Crane Gantry - Vertical sniper & spotter vantage points",
        "Coastal Fuel Refinery - Fuel resource hub & high-flammable hazard zone",
        "Airfield Flightline Hangars - Vehicle spawn facility & helicopter landing zones"
      ],
      tactics: "Open coastal waters allow rapid amphibious flanking. Use container yards to establish reinforced infantry killzones while denying enemy armor maneuverability."
    }
  ],
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
  secondScreenDesc: "在突袭和军团战期间，将此交互地图置于副显示屏。利用标尺校准距离、侦察敌方 FOB，并实时引导曲射火力支援。",
  features: [
    {
      title: "副显示屏专属优化",
      desc: "在 20–40 分钟的高压对局中持续开启，随时查验地形路线、车队补给通道与防线隘口，无需切屏防掉帧。"
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
  ballisticsSubtitle: "社区实测验证的距离-密位换算与弹道飞行时间参考表",
  mortarTab: "81mm 迫击炮 (L81)",
  artilleryTab: "155mm 自行火炮 (SPH-2)",
  rangeCol: "目标距离 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "飞行时间 (秒)",
  notesCol: "实战说明",
  minRangeLabel: "最小射程",
  maxEffectiveLabel: "最大有效射程",
  standardMortarAmmo: "标准 81mm 高爆弹",
  standardArtilleryAmmo: "155mm 重型高爆弹",
  ballisticsRuleTitle: "实战快速射击法则 (Rule of Thumb)",
  ballisticsRuleDesc: "81mm 迫击炮 (L81) 在常规交战射程内每 100 米约需调整 125 密位（如 400m 为 550 mil，500m 为 425 mil）；155mm 自行火炮 (SPH-2) 随射程不同每 100 米约需调整 25–50 密位。务必先发射单发校射弹，由观察手或炮弹视角确认弹着点并修正射角与方向角后，再进行多发效力射。",
  theaterIntelBadge: "战区态势情报",
  theatersTitle: "三大核心战区战略情报与地形指南",
  theatersSubtitle: "Bakurani、Ozeti、Zestafona 三大战场的地形特征、核心隘口与战术建议",
  keySectorsLabel: "关键要点分区：",
  tacticalSopLabel: "战术标准作业程序 (SOP)：",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani (巴库拉尼)",
      type: "山地与谷地盆地 (256 平方公里)",
      sectors: [
        "通讯铁塔山脊 (Grid D4/E4) - 全图最高观察与侦察高地",
        "南区水电分站 - 核心电网据点与卡车补给主干道",
        "河谷狭窄隘口 - 伏击装甲车与后勤车队的致命口袋阵"
      ],
      tactics: "将迫击炮部署在反斜面谷地以规避直射与敌方反炮兵火力；在山脊线布置毒刺防空小组，封锁敌方武直入场。"
    },
    {
      id: "ozeti",
      name: "Ozeti (奥泽蒂)",
      type: "河流交汇与重工业综合区",
      sectors: [
        "中央铁路调车场 - 密集集装箱掩护与近距巷战核心",
        "渡河驳船码头 - 重装甲载具跨河的唯一咽喉隘口",
        "变电枢纽站 - 极佳的前线作业基地 (FOB) 建设点"
      ],
      tactics: "SPH-2 自行火炮可在 1,200 米外跨河安全压制渡口；在己方岸侧建立专用后勤物资站，持续供应 155mm 高爆弹。"
    },
    {
      id: "zestafona",
      name: "Zestafona (泽斯塔福纳)",
      type: "沿海半岛与港口要塞",
      sectors: [
        "集装箱门式起重机 - 垂直狙击与火炮观测制高点",
        "沿海炼油厂 - 燃料战略储备区与高易燃爆炸危险区",
        "机场跑道机库区 - 载具刷新工坊与直升机起降场 (LZ)"
      ],
      tactics: "开阔的沿海水域极易遭遇侧翼登岛袭击；利用集装箱构筑坚固的步兵防守交叉火力网，限制敌方装甲穿插。"
    }
  ],
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
  secondScreenDesc: "在突襲和軍團戰期間，將此互動地圖置於副顯示屏。利用標尺校準距離、偵察敵方 FOB，並即時引導曲射火力支援。",
  features: [
    {
      title: "副顯示螢幕專屬優化",
      desc: "在 20–40 分鐘的高壓對局中持續開啟，隨時查驗地形路線、車隊補給通道與防線隘口，無需切換畫面防掉幀。"
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
  ballisticsSubtitle: "社區實測驗證的距離-密位換算與彈道飛行時間參考表",
  mortarTab: "81mm 迫擊砲 (L81)",
  artilleryTab: "155mm 自行火砲 (SPH-2)",
  rangeCol: "目標距離 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "飛行時間 (秒)",
  notesCol: "實戰說明",
  minRangeLabel: "最小射程",
  maxEffectiveLabel: "最大有效射程",
  standardMortarAmmo: "標準 81mm 高爆彈",
  standardArtilleryAmmo: "155mm 重型高爆彈",
  ballisticsRuleTitle: "實戰快速射擊法則 (Rule of Thumb)",
  ballisticsRuleDesc: "81mm 迫擊砲 (L81) 在常規交戰射程內每 100 公尺約需調整 125 密位（如 400m 為 550 mil，500m 為 425 mil）；155mm 自行火砲 (SPH-2) 隨射程不同每 100 公尺約需調整 25–50 密位。務必先發射單發校射彈，由觀察手或砲彈視角確認彈著點並修正射角與方位角後，再進行多發效力射。",
  theaterIntelBadge: "戰區態勢情報",
  theatersTitle: "三大核心戰區戰略情報與地形指南",
  theatersSubtitle: "Bakurani、Ozeti、Zestafona 三大戰場的地形特徵、核心隘口與戰術建議",
  keySectorsLabel: "關鍵要點分區：",
  tacticalSopLabel: "戰術標準作業程序 (SOP)：",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani (巴庫拉尼)",
      type: "山地與谷地盆地 (256 平方公里)",
      sectors: [
        "通訊鐵塔山脊 (Grid D4/E4) - 全圖最高觀察與偵察高地",
        "南區水電分站 - 核心電網據點與卡車補給主幹道",
        "河谷狹窄隘口 - 伏擊裝甲車與後勤車隊的致命口袋陣"
      ],
      tactics: "將迫擊砲部署在反斜面谷地以規避直射與敵方反砲兵火力；在山脊線布置毒刺防空小組，封鎖敵方武直入場。"
    },
    {
      id: "ozeti",
      name: "Ozeti (奧澤蒂)",
      type: "河流交匯與重工業綜合區",
      sectors: [
        "中央鐵路調車場 - 密集貨櫃掩護與近距巷戰核心",
        "渡河駁船碼頭 - 重裝甲載具跨河的唯一咽喉隘口",
        "變電樞紐站 - 極佳的前線作業基地 (FOB) 建設點"
      ],
      tactics: "SPH-2 自行火砲可在 1,200 米外跨河安全壓制渡口；在己方岸側建立專用後勤物資站，持續供應 155mm 高爆彈。"
    },
    {
      id: "zestafona",
      name: "Zestafona (澤斯塔福納)",
      type: "沿海半島與港口要塞",
      sectors: [
        "貨櫃門式起重機 - 垂直狙擊與火砲觀測制高點",
        "沿海煉油廠 - 燃料戰略儲備區與高易燃爆炸危險區",
        "機場跑道機庫區 - 載具刷新工坊與直升機起降場 (LZ)"
      ],
      tactics: "開闊的沿海水域極易遭遇側翼登島襲擊；利用貨櫃構築堅固的步兵防守交叉火力網，限制敵方裝甲穿插。"
    }
  ],
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
  secondScreenDesc: "レイドやクラン戦の際、本インタラクティブマップをサブモニターに表示。定規で射程を計測し、敵FOBを偵察し、曲射支援射撃をリアルタイムで誘導できます。",
  features: [
    {
      title: "サブモニター専用設計",
      desc: "20〜40分の戦闘中常時表示可能。Alt+Tabによる画面切り替えを行わずに、地形ルート、補給線、チョークポイントを瞬時に確認できます。"
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
  ballisticsSubtitle: "間接射撃支援のためのコミュニティ検証済み距離・ミル対照表",
  mortarTab: "81mm迫撃砲 (L81)",
  artilleryTab: "155mm榴弾砲 (SPH-2)",
  rangeCol: "距離 (m)",
  milsCol: "仰角 (mils)",
  tofCol: "着弾時間 (秒)",
  notesCol: "運用ノート",
  minRangeLabel: "最短射程",
  maxEffectiveLabel: "最大有効射程",
  standardMortarAmmo: "標準 81mm 榴弾 (HE)",
  standardArtilleryAmmo: "155mm 重榴弾 (HE)",
  ballisticsRuleTitle: "実戦照準補正の基本法則",
  ballisticsRuleDesc: "81mm迫撃砲（L81）は通常交戦距離において100mあたり約125ミル調整します（例：400mで550ミル、500mで425ミル）。155mm自走砲（SPH-2）は射程帯に応じて100mあたり約25〜50ミル調整します。必ず初弾（試射弾）を撃ち、観測手または砲弾カメラで弾着を確認・修正してから斉射に移行してください。",
  theaterIntelBadge: "戦域情報",
  theatersTitle: "作戦戦域別タクティカルプロファイル",
  theatersSubtitle: "3つの稼働マップにおける地形特性、要衝セクター、戦術的留意点",
  keySectorsLabel: "重要セクター：",
  tacticalSopLabel: "戦術標準手順 (SOP)：",
  theaters: [
    {
      id: "bakurani",
      name: "バクラニ (Bakurani)",
      type: "山岳・盆地峡谷 (256 km²)",
      sectors: [
        "通信鉄塔尾根 (グリッド D4/E4) - 全域を見渡す最高観測拠点",
        "南側水力発電サブステーション - 枢要電力拠点・補給トラック幹線",
        "河谷チョークポイント - 装甲車両や補給車列を奇襲するキルゾーン"
      ],
      tactics: "敵の直射や対砲兵射撃を防ぐため、迫撃砲は逆斜面谷地に展開。尾根には対空兵器を配置し、敵攻撃ヘリの進入を遮断します。"
    },
    {
      id: "ozeti",
      name: "オゼティ (Ozeti)",
      type: "河川合流点・重工業コンプレックス",
      sectors: [
        "中央鉄道操車場 - 密集コンテナ群と近接市街戦の要所",
        "渡河バージ船着場 - 重装甲車両の唯一の渡河ボトルネック",
        "変電サブステーション - 前線作業基地 (FOB) 建設の最適地"
      ],
      tactics: "SPH-2自走砲は1,200m離れた対岸から安全に渡河拠点を封鎖可能。自軍側岸辺に兵站倉庫を設置し、155mm砲弾を絶やさず補給します。"
    },
    {
      id: "zestafona",
      name: "ゼスタフォナ (Zestafona)",
      type: "沿岸半島・要塞港湾",
      sectors: [
        "コンテナガントリークレーン - 狙撃手と弾着観測手の垂直制高点",
        "沿岸製油所 - 燃料集積所および高引火性爆発危険エリア",
        "飛行場滑走路・格納庫 - 車両スポーン工廠およびヘリ着陸帯 (LZ)"
      ],
      tactics: "開けた海側からの迂回強襲に注意。コンテナヤードを活用して強固な歩兵防衛ラインを構築し、敵装甲の突破を阻止します。"
    }
  ],
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
  secondScreenDesc: "Используйте интерактивную карту на втором мониторе во время рейдов и клановых войн. Измеряйте дистанции линейкой, находите вражеские FOB и координируйте артиллерию в реальном времени.",
  features: [
    {
      title: "Оптимизация для второго экрана",
      desc: "Держите карту открытой на протяжении 20–40 минут рейда: следите за маршрутами, логистикой и узкими местами без переключения окон через Alt+Tab."
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
  ballisticsSubtitle: "Проверенные сообществом таблицы перевода дистанции в тысячные для огня с закрытых позиций",
  mortarTab: "81-мм миномет (L81)",
  artilleryTab: "155-мм артиллерия (SPH-2)",
  rangeCol: "Дистанция (м)",
  milsCol: "Прицел (тыс.)",
  tofCol: "Время полета (с)",
  notesCol: "Примечания",
  minRangeLabel: "Мин. дистанция",
  maxEffectiveLabel: "Макс. эфф. дальность",
  standardMortarAmmo: "Стандартный 81-мм ОФ",
  standardArtilleryAmmo: "155-мм тяжелый ОФ",
  ballisticsRuleTitle: "Полевое правило корректировки",
  ballisticsRuleDesc: "Для 81-мм миномета (L81) поправка составляет около 125 тыс. на каждые 100 м дистанции (например, 400 м — 550 тыс., 500 м — 425 тыс.); для 155-мм САУ (SPH-2) — около 25–50 тыс. на 100 м в зависимости от дальности. Всегда делайте пристрелочный выстрел и корректируйте наводку перед ведением огня на поражение.",
  theaterIntelBadge: "Разведданные ТВД",
  theatersTitle: "Оперативные профили театров военных действий",
  theatersSubtitle: "Анализ рельефа, ключевых секторов и тактики на всех трех активных картах",
  keySectorsLabel: "Ключевые секторы:",
  tacticalSopLabel: "Тактический регламент (SOP):",
  theaters: [
    {
      id: "bakurani",
      name: "Бакурани (Bakurani)",
      type: "Горно-долинный бассейн (256 км²)",
      sectors: [
        "Хребет радиомачты (Grid D4/E4) — высшая точка наблюдения и разведки",
        "Южная гидроподстанция — ключевой энергообъект и трасса снабжения",
        "Узкое речное ущелье — опасная зона засад на бронетехнику и грузовики"
      ],
      tactics: "Размещайте минометы на обратных склонах для защиты от прямой наводки и контрбатарейного огня. Держите расчеты ПЗРК на хребтах для прикрытия от ударных вертолетов."
    },
    {
      id: "ozeti",
      name: "Озети (Ozeti)",
      type: "Речной узел и промышленный комплекс",
      sectors: [
        "Центральный железнодорожный узел — плотные укрытия и ближний бой",
        "Баржевая переправа — единственное горлышко для тяжелой техники",
        "Электрораспределительная подстанция — идеальное место для возведения FOB"
      ],
      tactics: "САУ SPH-2 может подавлять переправу через реку с безопасного расстояния 1200 м. Держите склад боеприпасов на своем берегу для бесперебойного снабжения 155-мм снарядами."
    },
    {
      id: "zestafona",
      name: "Зестафона (Zestafona)",
      type: "Прибрежный полуостров и портовая крепость",
      sectors: [
        "Портальные краны — вертикальные позиции для снайперов и наводчиков",
        "Прибрежный НПЗ — база хранения топлива и зона повышенной взрывоопасности",
        "Ангары летного поля — зона спавна техники и вертолетные площадки (LZ)"
      ],
      tactics: "Открытая вода позволяет совершать фланговые десантные высадки. Используйте контейнерные терминалы для организации перекрестного огня пехоты против вражеской брони."
    }
  ],
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
  secondScreenDesc: "Nutzen Sie diese interaktive Karte bei Raids und Clan-Gefechten auf dem zweiten Monitor. Messen Sie Distanzen, klären Sie gegnerische FOBs auf und leiten Sie Artillerieunterstützung in Echtzeit.",
  features: [
    {
      title: "Optimiert für Zweitmonitore",
      desc: "Lassen Sie die Karte während des gesamten 20–40-minütigen Raids geöffnet, um Routen, Logistik und Engpässe ohne Alt-Tab zu prüfen."
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
  ballisticsSubtitle: "Community-geprüfte Schusstafeln für indirektes Feuer",
  mortarTab: "81mm Mörser (L81)",
  artilleryTab: "155mm Artillerie (SPH-2)",
  rangeCol: "Reichweite (m)",
  milsCol: "Erhöhung (Strich)",
  tofCol: "Flugzeit (s)",
  notesCol: "Einsatzhinweise",
  minRangeLabel: "Min. Reichweite",
  maxEffectiveLabel: "Max. effektive Reichweite",
  standardMortarAmmo: "Standard 81mm HE",
  standardArtilleryAmmo: "155mm schwere HE",
  ballisticsRuleTitle: "Faustregel für Feldkorrekturen",
  ballisticsRuleDesc: "Für 81mm-Mörser (L81) korrigieren Sie ~125 Strich pro 100m Reichweitenunterschied (z. B. 400m = 550 Strich, 500m = 425 Strich); für 155mm-Artillerie (SPH-2) je nach Distanz ~25–50 Strich pro 100m. Schießen Sie stets einen Einschießschuss, beobachten Sie den Einschlag und korrigieren Sie vor vollen Salven.",
  theaterIntelBadge: "Kriegsschauplatz-Aufklärung",
  theatersTitle: "Strategische Einsatzprofile der Kriegsschauplätze",
  theatersSubtitle: "Geländeanalysen, befestigte Sektoren und taktische Aspekte auf allen drei aktiven Karten",
  keySectorsLabel: "Schlüsselsektoren:",
  tacticalSopLabel: "Taktische Standardverfahren (SOP):",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani",
      type: "Berg- und Talkessel (256 km²)",
      sectors: [
        "Funkmast-Bergkamm (Grid D4/E4) – Höchster Beobachtungspunkt der Karte",
        "Südliches Umspannwerk – Strategisches Energieziel und Nachschubroute",
        "Flusstal-Engpass – Gefährliche Hinterhaltszone für Panzer und Konvois"
      ],
      tactics: "Positionieren Sie Mörser an Gegenhängen, um sie vor direktem Gegenfeuer zu schützen. Sichern Sie Bergkämme mit Flugabwehr gegen Erdkampfhubschrauber."
    },
    {
      id: "ozeti",
      name: "Ozeti",
      type: "Flusskreuzung & Industriekomplex",
      sectors: [
        "Zentraler Rangierbahnhof – Dichte Industriedeckung und Nahkampfzone",
        "Fähranleger – Einziger Flussübergang für schwere Panzerfahrzeuge",
        "Energieverteiler-Umspannwerk – Hervorragender Standort für den Bau einer FOB"
      ],
      tactics: "SPH-2 Artillerie kann die Flussüberquerung aus 1.200m Entfernung dominieren. Richten Sie am eigenen Ufer ein Munitionsdepot für 155mm-Granaten ein."
    },
    {
      id: "zestafona",
      name: "Zestafona",
      type: "Küstenhalbinsel & Hafenfeste",
      sectors: [
        "Container-Portalkräne – Vertikale Aussichtspunkte für Scharfschützen und Beobachter",
        "Küsten-Treibstoffraffinerie – Treibstofflager und explosionsgefährdeter Bereich",
        "Flugfeld-Hangars – Fahrzeug-Spawnwerkstatt und Hubschrauberlandeplätze (LZ)"
      ],
      tactics: "Offenes Küstenwasser begünstigt amphibische Flankenangriffe. Nutzen Sie Containerdepots für Infanterie-Abwehrzonen gegen feindliche Vorstöße."
    }
  ],
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
  secondScreenDesc: "Abra este mapa interativo no segundo monitor durante invasões e guerras de clãs. Calcule distâncias com a régua, localize FOBs inimigas e coordene apoio de artilharia em tempo real.",
  features: [
    {
      title: "Otimizado para Segunda Tela",
      desc: "Mantenha o mapa aberto durante as partidas de 20–40 minutos para planejar rotas logísticas e gargalos sem usar Alt+Tab."
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
  ballisticsSubtitle: "Tabelas de conversão de alcance para mils verificadas pela comunidade",
  mortarTab: "Morteiro 81mm (L81)",
  artilleryTab: "Artilharia 155mm (SPH-2)",
  rangeCol: "Alcance (m)",
  milsCol: "Elevação (mils)",
  tofCol: "Tempo de Voo (s)",
  notesCol: "Notas Operacionais",
  minRangeLabel: "Alcance Mínimo",
  maxEffectiveLabel: "Alcance Máx. Efetivo",
  standardMortarAmmo: "81mm HE Padrão",
  standardArtilleryAmmo: "155mm HE Pesado",
  ballisticsRuleTitle: "Regra Prática de Correção em Campo",
  ballisticsRuleDesc: "Para morteiros de 81mm (L81), ajuste ~125 mils a cada 100m de variação de alcance (ex.: 400m = 550 mils, 500m = 425 mils); para artilharia de 155mm (SPH-2), ajuste ~25–50 mils a cada 100m dependendo da distância. Sempre dispare um tiro de calibragem antes de rajadas completas.",
  theaterIntelBadge: "Inteligência de Teatro",
  theatersTitle: "Perfis Operacionais dos Teatros Estratégicos",
  theatersSubtitle: "Análise de terreno, setores fortificados e táticas nos três mapas ativos",
  keySectorsLabel: "Setores Críticos:",
  tacticalSopLabel: "Procedimento Padrão (SOP):",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani",
      type: "Bacia de Montanhas e Vales (256 km²)",
      sectors: [
        "Crista da Torre de Comunicação (Grid D4/E4) – Ponto de observação supremo",
        "Subestação Hidroelétrica Sul – Alvo elétrico essencial e rota de comboios",
        "Gargalo do Vale do Rio – Zona de emboscada para blindados e caminhões"
      ],
      tactics: "Posicione baterias de morteiro em contra-encostas para protegê-las de contrabateria direta. Mantenha equipes antiaéreas nos cumes contra helicópteros de ataque."
    },
    {
      id: "ozeti",
      name: "Ozeti",
      type: "Cruzamento Fluvial e Complexo Industrial",
      sectors: [
        "Pátio Ferroviário Central – Cobertura pesada e combate a curta distância",
        "Travessia de Balsa do Rio – Principal gargalo para veículos pesados",
        "Subestação de Distribuição de Energia – Local ideal para construção de FOB"
      ],
      tactics: "A artilharia SPH-2 pode cobrir a travessia do rio a 1.200m de distância segura. Mantenha depósitos de suprimentos na margem amiga para alimentar obuseiros de 155mm."
    },
    {
      id: "zestafona",
      name: "Zestafona",
      type: "Península Costeira e Porto Fortificado",
      sectors: [
        "Guindastes de Contêineres – Plataformas elevadas para atiradores e observadores",
        "Refinaria Costeira – Centro de combustível e área de alto risco de explosão",
        "Hangares do Aeródromo – Fábrica de veículos e zonas de pouso de helicópteros (LZ)"
      ],
      tactics: "As águas abertas facilitam investidas de flanco. Use terminais de contêineres para formar zonas de contenção de infantaria e travar blindados inimigos."
    }
  ],
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
  secondScreenDesc: "Uruchom interaktywną mapę na drugim monitorze podczas rajdów i wojen klanowych. Mierz odległości linijką, wykrywaj wrogie FOB-y i koordynuj ogień artylerii w czasie rzeczywistym.",
  features: [
    {
      title: "Optymalizacja pod drugi monitor",
      desc: "Miej mapę pod ręką przez cały 20–40 minutowy rajd: sprawdzaj trasy zaopatrzenia i wąskie gardła bez konieczności przełączania okien Alt+Tab."
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
  ballisticsSubtitle: "Zweryfikowane przez społeczność tabele przeliczania zasięgu na tysięczne",
  mortarTab: "Moździerz 81mm (L81)",
  artilleryTab: "Artyleria 155mm (SPH-2)",
  rangeCol: "Zasięg (m)",
  milsCol: "Kąt podniesienia (tys.)",
  tofCol: "Czas lotu (s)",
  notesCol: "Uwagi operacyjne",
  minRangeLabel: "Minimalny zasięg",
  maxEffectiveLabel: "Maks. zasięg skuteczny",
  standardMortarAmmo: "Standardowy 81mm HE",
  standardArtilleryAmmo: "Ciężki 155mm HE",
  ballisticsRuleTitle: "Praktyczna zasada korekty ognia",
  ballisticsRuleDesc: "Dla moździerza 81mm (L81) koryguj o ~125 tysięcznych na każde 100m różnicy zasięgu (np. 400m = 550 tys., 500m = 425 tys.); dla artylerii 155mm (SPH-2) o ~25–50 tysięcznych na 100m w zależności od dystansu. Zawsze wystrzel pocisk wstrzeliwujący przed przejściem do salw bateryjnych.",
  theaterIntelBadge: "Wywiad Teatru Działań",
  theatersTitle: "Profile operacyjne teatrów działań",
  theatersSubtitle: "Analiza terenu, ufortyfikowane sektory i taktyka na wszystkich trzech aktywnych mapach",
  keySectorsLabel: "Kluczowe sektory:",
  tacticalSopLabel: "Standardowe procedury (SOP):",
  theaters: [
    {
      id: "bakurani",
      name: "Bakurani",
      type: "Kotlina górska i doliny (256 km²)",
      sectors: [
        "Grzbiet masztu radiowego (Grid D4/E4) – Główny punkt obserwacyjny na mapie",
        "Południowa podstacja hydroelektryczna – Strategiczny cel energetyczny i trasa konwojów",
        "Wąwóz w dolinie rzeki – Niebezpieczna strefa zasadzek na pojazdy opancerzone"
      ],
      tactics: "Ustawiaj moździerze na stokach przeciwstoku, aby chronić je przed bezpośrednim ogniem kontrbateryjnym. Na grzbietach rozmieść zespoły plot. przeciwko śmigłowcom."
    },
    {
      id: "ozeti",
      name: "Ozeti",
      type: "Węzeł rzeczny i kompleks przemysłowy",
      sectors: [
        "Centralna stacja rozrządowa – Gęsta osłona przemysłowa i walka na krótkim dystansie",
        "Przeprawa promowa – Jedyne wąskie gardło dla ciężkich pojazdów przez rzekę",
        "Podstacja rozdzielcza energii – Idealna lokalizacja pod budowę wysuniętej bazy (FOB)"
      ],
      tactics: "Artyleria SPH-2 może ryglować przeprawę rzeczną z bezpiecznej odległości 1200m. Utrzymuj skład zaopatrzenia na własnym brzegu, by zasilać haubice w pociski 155mm."
    },
    {
      id: "zestafona",
      name: "Zestafona",
      type: "Nadmorski półwysep i portowa twierdza",
      sectors: [
        "Suwnice kontenerowe – Pionowe punkty obserwacyjne dla snajperów i spotterów",
        "Nadmorska rafineria paliw – Magazyn paliwa i strefa podwyższonego ryzyka wybuchu",
        "Hangary lotniska – Warsztat pojazdów i lądowiska dla śmigłowców (LZ)"
      ],
      tactics: "Otwarte wody przybrzeżne ułatwiają ataki z flanki. Wykorzystaj place kontenerowe do stworzenia strefy ognia zaporowego piechoty przeciwko pojazdom wroga."
    }
  ],
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
