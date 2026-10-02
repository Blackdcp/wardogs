import type {Locale} from "@/config/site";

export type BallisticRow = {
  range: number;
  mils: number;
  tof: number;
  notes?: string;
};

export const MORTAR_81MM_BALLISTICS: readonly BallisticRow[] = [
  {range: 100, mils: 1420, tof: 12},
  {range: 200, mils: 1355, tof: 14},
  {range: 300, mils: 1290, tof: 16},
  {range: 400, mils: 1225, tof: 18},
  {range: 500, mils: 1160, tof: 20},
  {range: 600, mils: 1095, tof: 22},
  {range: 700, mils: 1030, tof: 24},
  {range: 800, mils: 965, tof: 26},
  {range: 900, mils: 900, tof: 28},
  {range: 1000, mils: 835, tof: 30},
  {range: 1100, mils: 770, tof: 32},
  {range: 1200, mils: 700, tof: 34, notes: "Max effective"}
];

export const ARTILLERY_155MM_BALLISTICS: readonly BallisticRow[] = [
  {range: 200, mils: 1380, tof: 16},
  {range: 400, mils: 1280, tof: 20},
  {range: 600, mils: 1180, tof: 24},
  {range: 800, mils: 1080, tof: 28},
  {range: 1000, mils: 980, tof: 31},
  {range: 1200, mils: 880, tof: 34},
  {range: 1400, mils: 780, tof: 37},
  {range: 1600, mils: 680, tof: 40},
  {range: 1800, mils: 580, tof: 43},
  {range: 2000, mils: 480, tof: 46},
  {range: 2200, mils: 410, tof: 49},
  {range: 2500, mils: 350, tof: 52, notes: "Extended envelope"}
];

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
  ballisticsTitle: string;
  ballisticsSubtitle: string;
  mortarTab: string;
  artilleryTab: string;
  rangeCol: string;
  milsCol: string;
  tofCol: string;
  notesCol: string;
  ballisticsRuleTitle: string;
  ballisticsRuleDesc: string;
  theatersTitle: string;
  theatersSubtitle: string;
  theaters: readonly MapTheaterIntel[];
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
  ballisticsTitle: "Artillery & Mortar Elevation Quick Reference",
  ballisticsSubtitle: "Community-verified range-to-mil elevation conversion tables for indirect fire support",
  mortarTab: "81mm Mortar (L81)",
  artilleryTab: "155mm Artillery (SPH-2)",
  rangeCol: "Range (m)",
  milsCol: "Elevation (mils)",
  tofCol: "Time of Flight (s)",
  notesCol: "Operational Notes",
  ballisticsRuleTitle: "Field Correction Rule of Thumb",
  ballisticsRuleDesc: "For 81mm Mortars, adjust ~65 mils per 100m range delta. For 155mm Artillery, adjust ~50 mils per 100m. Always fire one ranging round, observe the impact via spotter or shell camera, and adjust elevation/azimuth before expending battery volleys.",
  theatersTitle: "Strategic Theater Operational Profiles",
  theatersSubtitle: "Terrain breakdown, fortified sectors, and tactical considerations across all three active maps",
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
  ballisticsTitle: "迫击炮与自行火炮密位射表速查",
  ballisticsSubtitle: "社区实测验证的距离-密位换算与弹道飞行时间参考表",
  mortarTab: "81mm 迫击炮 (L81)",
  artilleryTab: "155mm 自行火炮 (SPH-2)",
  rangeCol: "目标距离 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "飞行时间 (秒)",
  notesCol: "实战说明",
  ballisticsRuleTitle: "实战快速射击法则 (Rule of Thumb)",
  ballisticsRuleDesc: "81mm 迫击炮每增减 100 米距离，密位调整约 65 mils；155mm 自行火炮每 100 米调整约 50 mils。第一发务必使用单发校射弹，结合观察手报点或炮弹视角修正密位与方位角，确认命中后再进行整连效力射击。",
  theatersTitle: "三大核心战区战略情报与地形指南",
  theatersSubtitle: "Bakurani、Ozeti、Zestafona 三大战场的地形特征、核心隘口与战术建议",
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
  ballisticsTitle: "迫擊砲與自行火砲密位射表速查",
  ballisticsSubtitle: "社區實測驗證的距離-密位換算與彈道飛行時間參考表",
  mortarTab: "81mm 迫擊砲 (L81)",
  artilleryTab: "155mm 自行火砲 (SPH-2)",
  rangeCol: "目標距離 (米)",
  milsCol: "射角密位 (mils)",
  tofCol: "飛行時間 (秒)",
  notesCol: "實戰說明",
  ballisticsRuleTitle: "實戰快速射擊法則 (Rule of Thumb)",
  ballisticsRuleDesc: "81mm 迫擊砲每增減 100 米距離，密位調整約 65 mils；155mm 自行火砲每 100 米調整約 50 mils。第一發務必使用單發校射彈，結合觀察手報點或砲彈視角修正密位與方位角，確認命中後再進行整連效力射擊。",
  theatersTitle: "三大核心戰區戰略情報與地形指南",
  theatersSubtitle: "Bakurani、Ozeti、Zestafona 三大戰場的地形特徵、核心隘口與戰術建議",
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

export function getTacticalIntelCopy(locale: Locale): TacticalIntelCopy {
  if (locale === "zh-cn") return tacticalIntelZhCn;
  if (locale === "zh-tw") return tacticalIntelZhTw;
  return tacticalIntelEn;
}
