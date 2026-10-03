import type {Locale} from "@/config/site";

export interface ArtilleryCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  modeMap: string;
  modeDirect: string;
  selectWeapon: string;
  selectMap: string;
  trajectoryMode: string;
  highArc: string;
  lowArc: string;
  gunPosition: string;
  targetPosition: string;
  clickToSetGun: string;
  clickToSetTarget: string;
  statusGunSet: string;
  statusTargetSet: string;
  distance: string;
  heightDelta: string;
  elevationMil: string;
  azimuth: string;
  timeOfFlight: string;
  seconds: string;
  meters: string;
  mils: string;
  degrees: string;
  tooClose: string;
  outOfRange: string;
  readyToFire: string;
  fireButton: string;
  splashIn: string;
  splashImpact: string;
  resetButton: string;
  tacticalTipTitle: string;
  tacticalTipBody: string;
  quickTools: {
    ammoTitle: string;
    ammoDesc: string;
    logisticsTitle: string;
    logisticsDesc: string;
    guideTitle: string;
    guideDesc: string;
  };
  keypadTitle: string;
  directDistanceLabel: string;
  directHeightLabel: string;
  directAzimuthLabel: string;
  adNotice: string;
}

const copy: Record<Locale, ArtilleryCopy> = {
  "zh-cn": {
    metaTitle: "WARDOGS 战术火炮与迫击炮密位计算器：L81 与 SPH-2 射表解算",
    metaDescription: "WARDOGS 高精度迫击炮与火炮密位射表解算器。支持 L81 迫击炮与 SPH-2 自行火炮高低仰角，实时计算距离、高差补偿、密位（Mil）、方位角与弹道飞行时间。",
    eyebrow: "战术火控系统",
    title: "战术火炮与迫击炮密位计算器",
    subtitle: "256km² 战区高清射击诸元解算工具。在地图上标记发射阵地与打击目标，实时获取密位与飞行时间倒计时。",
    modeMap: "地图交互点选",
    modeDirect: "数字快捷录入",
    selectWeapon: "选择武器型号",
    selectMap: "选择作战地图",
    trajectoryMode: "弹道模式",
    highArc: "高仰角 (High Arc)",
    lowArc: "低仰角 (Low Arc)",
    gunPosition: "发射阵地 (Gun)",
    targetPosition: "打击目标 (Target)",
    clickToSetGun: "点击地图设定发射阵地 (A 点)",
    clickToSetTarget: "点击地图设定打击目标 (B 点)",
    statusGunSet: "阵地已标定",
    statusTargetSet: "目标已锁定",
    distance: "水平距离",
    heightDelta: "高低落差 (ΔZ)",
    elevationMil: "射击密位 (Mil)",
    azimuth: "射击方位角 (Azimuth)",
    timeOfFlight: "弹道飞行时间 (TOF)",
    seconds: "秒",
    meters: "米",
    mils: "密位",
    degrees: "度",
    tooClose: "目标过近 (超出最小射程)",
    outOfRange: "超出最大射程",
    readyToFire: "诸元已装订，准备击发",
    fireButton: "击发倒计时 (FIRE)",
    splashIn: "弹着倒计时",
    splashImpact: "💥 炮弹落点命中！",
    resetButton: "重置诸元",
    tacticalTipTitle: "战术压制与后勤配给提示",
    tacticalTipBody: "L81 迫击炮使用 81mm 高爆弹压制步兵时，建议 3 发连射覆盖 40m 散布圆。目标若处在高地（ΔZ > 0），射角密位需相应调低；在移动前至少保证 FOB 储备有 3 箱弹药备件。",
    quickTools: {
      ammoTitle: "81mm / 155mm 弹药图鉴",
      ammoDesc: "查看弹药类型、伤害半径与穿甲特性",
      logisticsTitle: "后勤卡车运输精算",
      logisticsDesc: "规划 Ural 卡车前线补给路线与 FOB 补给配额",
      guideTitle: "迫击炮阵地生存攻略",
      guideDesc: "学习规避反炮兵雷达侦察与防空反制技巧"
    },
    keypadTitle: "快捷参数调节",
    directDistanceLabel: "手动输入目标距离 (米)",
    directHeightLabel: "目标相对高差 (米, 上坡为正)",
    directAzimuthLabel: "目标方位角 (0° - 360°)",
    adNotice: "赞助商战术支持"
  },
  "zh-tw": {
    metaTitle: "WARDOGS 戰術火砲與迫擊砲密位計算器：L81 與 SPH-2 射表解算",
    metaDescription: "WARDOGS 高精度迫擊砲與火砲密位射表解算器。支援 L81 迫擊砲與 SPH-2 自行火砲高低仰角，即時計算距離、高差補償、密位（Mil）、方位角與彈道飛行時間。",
    eyebrow: "戰術火控系統",
    title: "戰術火砲與迫擊砲密位計算器",
    subtitle: "256km² 戰區高解析度射擊諸元解算工具。在地圖上標記發射陣地與打擊目標，即時取得密位與飛行時間倒數。",
    modeMap: "地圖互動點選",
    modeDirect: "數字快捷輸入",
    selectWeapon: "選擇武器型號",
    selectMap: "選擇作戰地圖",
    trajectoryMode: "彈道模式",
    highArc: "高仰角 (High Arc)",
    lowArc: "低仰角 (Low Arc)",
    gunPosition: "發射陣地 (Gun)",
    targetPosition: "打擊目標 (Target)",
    clickToSetGun: "點擊地圖設定發射陣地 (A 點)",
    clickToSetTarget: "點擊地圖設定打擊目標 (B 點)",
    statusGunSet: "陣地已標定",
    statusTargetSet: "目標已鎖定",
    distance: "水平距離",
    heightDelta: "高低落差 (ΔZ)",
    elevationMil: "射擊密位 (Mil)",
    azimuth: "射擊方位角 (Azimuth)",
    timeOfFlight: "彈道飛行時間 (TOF)",
    seconds: "秒",
    meters: "米",
    mils: "密位",
    degrees: "度",
    tooClose: "目標過近 (超出最小射程)",
    outOfRange: "超出最大射程",
    readyToFire: "諸元已裝訂，準備擊發",
    fireButton: "擊發倒數 (FIRE)",
    splashIn: "彈著倒數",
    splashImpact: "💥 砲彈落點命中！",
    resetButton: "重設諸元",
    tacticalTipTitle: "戰術壓制與後勤配給提示",
    tacticalTipBody: "L81 迫擊砲使用 81mm 高爆彈壓制步兵時，建議 3 發連射覆蓋 40m 散布圓。目標若處在高地（ΔZ > 0），射角密位需相應調低；在移動前至少保證 FOB 儲備有 3 箱彈藥備件。",
    quickTools: {
      ammoTitle: "81mm / 155mm 彈藥圖鑑",
      ammoDesc: "檢視彈藥類型、傷害半徑與穿甲特性",
      logisticsTitle: "後勤卡車運輸精算",
      logisticsDesc: "規劃 Ural 卡車前線補給路線與 FOB 補給配額",
      guideTitle: "迫擊砲陣地生存攻略",
      guideDesc: "學習規避反砲兵雷達偵察與防空反制技巧"
    },
    keypadTitle: "快捷參數調節",
    directDistanceLabel: "手動輸入目標距離 (米)",
    directHeightLabel: "目標相對高差 (米, 上坡為正)",
    directAzimuthLabel: "目標方位角 (0° - 360°)",
    adNotice: "贊助商戰術支援"
  },
  en: {
    metaTitle: "WARDOGS Artillery Calculator: L81 Mortar & SPH-2 Firing Table",
    metaDescription: "Interactive WARDOGS artillery and mortar calculator. Calculate firing solutions for L81 81mm Mortar and SPH-2 Howitzer: elevation mils, azimuth, elevation delta, and flight time.",
    eyebrow: "Tactical Fire Control",
    title: "Artillery & Mortar Mil Calculator",
    subtitle: "High-precision ballistic firing table calculator for 256km² combat zones. Plot your battery and target on interactive maps to receive instantaneous Mil, Azimuth, and Time of Flight.",
    modeMap: "Interactive Map",
    modeDirect: "Direct Numeric",
    selectWeapon: "Select Weapon System",
    selectMap: "Operational Theatre Map",
    trajectoryMode: "Trajectory Mode",
    highArc: "High Arc (Plunging)",
    lowArc: "Low Arc (Direct)",
    gunPosition: "Battery Position (Gun)",
    targetPosition: "Target Impact Point",
    clickToSetGun: "Click on map to place battery position (A)",
    clickToSetTarget: "Click on map to place target impact point (B)",
    statusGunSet: "Battery Plotted",
    statusTargetSet: "Target Locked",
    distance: "Ground Distance",
    heightDelta: "Elevation Delta (ΔZ)",
    elevationMil: "Elevation (Mils)",
    azimuth: "Azimuth (Bearing)",
    timeOfFlight: "Time of Flight (TOF)",
    seconds: "s",
    meters: "m",
    mils: "mil",
    degrees: "deg",
    tooClose: "Target Too Close (Below Minimum Range)",
    outOfRange: "Out of Range (Exceeds Maximum Range)",
    readyToFire: "Firing Solution Computed",
    fireButton: "Fire Round (TOF Timer)",
    splashIn: "Splash In",
    splashImpact: "💥 Rounds On Target!",
    resetButton: "Reset Positions",
    tacticalTipTitle: "Tactical Suppression & Supply Notes",
    tacticalTipBody: "L81 81mm HE shells create a 40m effective dispersion cone; fire 3-round salvos for reliable infantry bunker denial. When firing uphill (ΔZ > 0), reduce mil setting accordingly. Keep at least 3 ammo crates stocked in your FOB.",
    quickTools: {
      ammoTitle: "81mm / 155mm Shell Specs",
      ammoDesc: "Review HE, smoke, and illum ballistic stats",
      logisticsTitle: "Logistics Route Planner",
      logisticsDesc: "Calculate Ural truck trips and FOB supply points",
      guideTitle: "Mortar Survivability Guide",
      guideDesc: "Learn counter-battery mitigation and crew dispersal"
    },
    keypadTitle: "Direct Range Input",
    directDistanceLabel: "Target Distance (meters)",
    directHeightLabel: "Height Delta (meters, uphill is positive)",
    directAzimuthLabel: "Target Azimuth (0° - 360°)",
    adNotice: "Sponsored Tactical Intel"
  },
  ru: {
    metaTitle: "Калькулятор артиллерии и миномёта WARDOGS: L81 и SPH-2",
    metaDescription: "Интерактивный артиллерийский калькулятор WARDOGS. Расчет таблиц стрельбы для миномета L81 81мм и САУ SPH-2: прицел (mils), азимут, поправка на высоту и время полета снаряда.",
    eyebrow: "Система управления огнем",
    title: "Калькулятор миномета и артиллерии",
    subtitle: "Высокоточный расчет баллистических таблиц для зоны 256 км². Укажите позицию орудия и цель на карте для мгновенного получения прицела в милах и азимута.",
    modeMap: "Интерактивная карта",
    modeDirect: "Ручной ввод",
    selectWeapon: "Выбор орудия",
    selectMap: "Карта операций",
    trajectoryMode: "Траектория",
    highArc: "Навесная (High Arc)",
    lowArc: "Настильная (Low Arc)",
    gunPosition: "Позиция орудия (A)",
    targetPosition: "Цель (B)",
    clickToSetGun: "Кликните по карте для установки позиции",
    clickToSetTarget: "Кликните по карте для выбора цели",
    statusGunSet: "Орудие установлено",
    statusTargetSet: "Цель захвачена",
    distance: "Дистанция",
    heightDelta: "Перепад высоты (ΔZ)",
    elevationMil: "Прицел (Милы)",
    azimuth: "Азимут (Azimuth)",
    timeOfFlight: "Время полета (TOF)",
    seconds: "сек",
    meters: "м",
    mils: "мил",
    degrees: "град",
    tooClose: "Слишком близко (меньше мин. дистанции)",
    outOfRange: "Вне зоны досягаемости",
    readyToFire: "Данные для стрельбы готовы",
    fireButton: "Выстрел (Таймер TOF)",
    splashIn: "Прилет через",
    splashImpact: "💥 Разрыв снаряда!",
    resetButton: "Сбросить точки",
    tacticalTipTitle: "Тактические советы и снабжение",
    tacticalTipBody: "Миномет L81 эффективен при стрельбе сериями по 3 снаряда. Учитывайте перепад высот и наличие ящиков с БК на передовом пункте сбора (FOB).",
    quickTools: {
      ammoTitle: "Каталог снарядов 81мм / 155мм",
      ammoDesc: "Осколочно-фугасные и дымовые боеприпасы",
      logisticsTitle: "Планировщик снабжения",
      logisticsDesc: "Расчет рейсов грузовика Урал и ресурсов FOB",
      guideTitle: "Руководство по минометам",
      guideDesc: "Защита от контрбатарейного огня противника"
    },
    keypadTitle: "Ручной ввод данных",
    directDistanceLabel: "Дистанция до цели (м)",
    directHeightLabel: "Разница высот (м)",
    directAzimuthLabel: "Азимут на цель (0° - 360°)",
    adNotice: "Спонсорские материалы"
  },
  de: {
    metaTitle: "WARDOGS Artillerie- & Mörser-Rechner: L81 & SPH-2 Schusstabelle",
    metaDescription: "Interaktiver WARDOGS Artillerie- und Mörser-Rechner. Berechne Schusslösungen für L81 81mm Mörser und SPH-2 Haubitze: Strich/Mils, Azimut, Höhenkorrektur und Flugzeit.",
    eyebrow: "Taktisches Feuerleitsystem",
    title: "Artillerie- & Mörser-Rechner",
    subtitle: "Hochpräzise Ballistikberechnung für 256km² Kampfzonen. Markiere Batterie und Ziel auf der Karte für sofortige Mils, Azimut und Flugzeit.",
    modeMap: "Interaktive Karte",
    modeDirect: "Direkteingabe",
    selectWeapon: "Waffensystem wählen",
    selectMap: "Einsatzkarte",
    trajectoryMode: "Flugbahn",
    highArc: "Steilfeuer (High Arc)",
    lowArc: "Flachfeuer (Low Arc)",
    gunPosition: "Geschützposition (A)",
    targetPosition: "Zielpunkt (B)",
    clickToSetGun: "Klicke auf die Karte für Geschützstandort",
    clickToSetTarget: "Klicke auf die Karte für Zielmarkierung",
    statusGunSet: "Geschütz markiert",
    statusTargetSet: "Ziel erfasst",
    distance: "Distanz",
    heightDelta: "Höhendifferenz (ΔZ)",
    elevationMil: "Rohrerhöhung (Mils)",
    azimuth: "Azimut (Richtung)",
    timeOfFlight: "Flugzeit (TOF)",
    seconds: "s",
    meters: "m",
    mils: "Mil",
    degrees: "Grad",
    tooClose: "Ziel zu nah (unter Mindestreichweite)",
    outOfRange: "Außer Reichweite",
    readyToFire: "Feuerdaten berechnet",
    fireButton: "Feuer (Flugzeit-Timer)",
    splashIn: "Einschlag in",
    splashImpact: "💥 Einschlag im Ziel!",
    resetButton: "Zurücksetzen",
    tacticalTipTitle: "Taktische Hinweise & Logistik",
    tacticalTipBody: "L81 81mm Streukegel ca. 40m. 3er-Salven empfohlen. Bei Zielen bergauf Rohrerhöhung anpassen und FOB-Munitionskisten bereithalten.",
    quickTools: {
      ammoTitle: "Munitionskatalog 81mm / 155mm",
      ammoDesc: "HE- und Nebelgranaten im Detail",
      logisticsTitle: "Logistik-Planer",
      logisticsDesc: "Ural-LKW Nachschub und FOB-Versorgung",
      guideTitle: "Mörser-Leitfaden",
      guideDesc: "Taktiken gegen Gegenartillerie-Beschuss"
    },
    keypadTitle: "Direkte Werteeingabe",
    directDistanceLabel: "Distanz zum Ziel (Meter)",
    directHeightLabel: "Höhenunterschied (Meter)",
    directAzimuthLabel: "Azimut (0° - 360°)",
    adNotice: "Gesponserte Inhalte"
  },
  "pt-br": {
    metaTitle: "Calculadora de Artilharia e Morteiro WARDOGS: L81 e SPH-2",
    metaDescription: "Calculadora tática de artilharia e morteiro WARDOGS. Soluções de tiro para Morteiro L81 81mm e SPH-2: elevação em mils, azimute, desnível e tempo de voo.",
    eyebrow: "Sistema de Controle de Tiro",
    title: "Calculadora de Artilharia e Morteiro",
    subtitle: "Cálculo balístico de alta precisão para zonas de combate de 256km². Marque a peça e o alvo no mapa interativo para obter mils e azimute instantâneos.",
    modeMap: "Mapa Interativo",
    modeDirect: "Entrada Numérica",
    selectWeapon: "Sistema de Armas",
    selectMap: "Mapa de Operação",
    trajectoryMode: "Trajetória",
    highArc: "Tiro Curvo (High Arc)",
    lowArc: "Tiro Tenso (Low Arc)",
    gunPosition: "Posição da Peça (A)",
    targetPosition: "Ponto de Impacto (B)",
    clickToSetGun: "Clique no mapa para marcar a peça de artilharia",
    clickToSetTarget: "Clique no mapa para marcar o alvo",
    statusGunSet: "Peça Marcada",
    statusTargetSet: "Alvo Travado",
    distance: "Distância",
    heightDelta: "Desnível (ΔZ)",
    elevationMil: "Elevação (Mils)",
    azimuth: "Azimute",
    timeOfFlight: "Tempo de Voo (TOF)",
    seconds: "s",
    meters: "m",
    mils: "mil",
    degrees: "graus",
    tooClose: "Alvo muito próximo",
    outOfRange: "Fora de alcance",
    readyToFire: "Solução de tiro pronta",
    fireButton: "Disparar (Timer TOF)",
    splashIn: "Impacto em",
    splashImpact: "💥 Impacto no Alvo!",
    resetButton: "Redefinir Posições",
    tacticalTipTitle: "Supressão Tática e Suprimentos",
    tacticalTipBody: "Recomendado rajada de 3 granadas para dispersão ideal. Mantenha caixas de munição no FOB para manter a bateria operando.",
    quickTools: {
      ammoTitle: "Munição 81mm / 155mm",
      ammoDesc: "Especificações de projéteis HE e fumaça",
      logisticsTitle: "Planejador Logístico",
      logisticsDesc: "Cálculo de cargas com caminhão Ural",
      guideTitle: "Guia de Morteiros",
      guideDesc: "Posicionamento e defesa antibateria"
    },
    keypadTitle: "Entrada Direta",
    directDistanceLabel: "Distância até o alvo (metros)",
    directHeightLabel: "Desnível de altitude (metros)",
    directAzimuthLabel: "Azimute (0° - 360°)",
    adNotice: "Informações Patrocinadas"
  },
  ja: {
    metaTitle: "WARDOGS 迫撃砲・自走砲計算機：L81 & SPH-2 射表計算ツール",
    metaDescription: "WARDOGS 高精度迫撃砲・火砲射表計算ツール。L81 81mm迫撃砲とSPH-2自走榴弾砲に対応。距離、高低差補正、ミル（Mil）、方位角（Azimuth）、弾道飛行時間をリアルタイム算出。",
    eyebrow: "戦術火器管制システム",
    title: "迫撃砲・自走砲 密位計算ツール",
    subtitle: "256km² 戦闘ゾーン用高精度弾道計算ツール。マップ上で射撃陣地と着弾目標を指定し、瞬時に射角ミルと方位角を取得できます。",
    modeMap: "マップ対話入力",
    modeDirect: "数値直接入力",
    selectWeapon: "火器を選択",
    selectMap: "作戦マップ",
    trajectoryMode: "弾道モード",
    highArc: "高射角 (High Arc)",
    lowArc: "低射角 (Low Arc)",
    gunPosition: "射撃陣地 (A点)",
    targetPosition: "着弾目標 (B点)",
    clickToSetGun: "マップをクリックして射撃陣地を設定",
    clickToSetTarget: "マップをクリックして目標地点を設定",
    statusGunSet: "陣地設定済み",
    statusTargetSet: "目標ロック完了",
    distance: "水平距離",
    heightDelta: "高低差 (ΔZ)",
    elevationMil: "射角密位 (Mils)",
    azimuth: "方位角 (Azimuth)",
    timeOfFlight: "弾道飛行時間 (TOF)",
    seconds: "秒",
    meters: "m",
    mils: "ミル",
    degrees: "度",
    tooClose: "目標が近すぎます（最小射程未満）",
    outOfRange: "最大射程を超えています",
    readyToFire: "諸元入力完了、射撃可能",
    fireButton: "射撃カウントダウン (FIRE)",
    splashIn: "着弾まで",
    splashImpact: "💥 目標地点に着弾！",
    resetButton: "位置リセット",
    tacticalTipTitle: "戦術制圧と補給の要点",
    tacticalTipBody: "L81迫撃砲は3点バースト連射が効果的です。高台の目標（ΔZ > 0）には射角を調整してください。前線FOBには弾薬箱を常時備蓄しましょう。",
    quickTools: {
      ammoTitle: "81mm / 155mm 弾薬スペック",
      ammoDesc: "HE榴弾・発煙弾の威力と特性",
      logisticsTitle: "兵站輸送プランナー",
      logisticsDesc: "ウラル輸送トラック補給計画",
      guideTitle: "迫撃砲陣地サバイバルガイド",
      guideDesc: "対砲兵射撃回避と陣地防衛"
    },
    keypadTitle: "直接パラメータ入力",
    directDistanceLabel: "目標までの距離 (メートル)",
    directHeightLabel: "目標との高低差 (メートル)",
    directAzimuthLabel: "目標の方位角 (0° - 360°)",
    adNotice: "スポンサー提供"
  },
  pl: {
    metaTitle: "Kalkulator Artylerii i Moździerza WARDOGS: L81 i SPH-2",
    metaDescription: "Interaktywny kalkulator artylerii WARDOGS. Rozwiązania ogniowe dla moździerza L81 81mm i haubicy SPH-2: kąt podniesienia w milach, azymut, różnica wysokości i czas lotu.",
    eyebrow: "System Kierowania Ogniem",
    title: "Kalkulator Artylerii i Moździerza",
    subtitle: "Precyzyjny kalkulator balistyczny dla stref walki 256 km². Wyznacz działo i cel na mapie, aby natychmiast otrzymać nastawy celownika i azymut.",
    modeMap: "Interaktywna Mapa",
    modeDirect: "Wprowadzanie Liczbowe",
    selectWeapon: "Wybór Uzbrojenia",
    selectMap: "Mapa Operacyjna",
    trajectoryMode: "Trajektoria",
    highArc: "Stroma (High Arc)",
    lowArc: "Płaska (Low Arc)",
    gunPosition: "Pozycja Działa (A)",
    targetPosition: "Punkt Uderzenia (B)",
    clickToSetGun: "Kliknij na mapie, aby ustawić działo",
    clickToSetTarget: "Kliknij na mapie, aby wybrać cel",
    statusGunSet: "Działo ustawione",
    statusTargetSet: "Cel namierzony",
    distance: "Odległość",
    heightDelta: "Różnica Wysokości (ΔZ)",
    elevationMil: "Kąt Podniesienia (Mils)",
    azimuth: "Azymut",
    timeOfFlight: "Czas Lotu (TOF)",
    seconds: "s",
    meters: "m",
    mils: "mil",
    degrees: "stopni",
    tooClose: "Cel za blisko (poniżej zasięgu minimalnego)",
    outOfRange: "Poza zasięgiem maksymalnym",
    readyToFire: "Nastawy gotowe do strzału",
    fireButton: "Wystrzał (Stoper TOF)",
    splashIn: "Uderzenie za",
    splashImpact: "💥 Trafienie w cel!",
    resetButton: "Zresetuj Pozycje",
    tacticalTipTitle: "Wskazówki Taktyczne i Logistyka",
    tacticalTipBody: "Moździerz L81: seria 3 pocisków pokrywa obszar 40m. Zwróć uwagę na różnice wysokości i zapas skrzyń z amunicją w bazie FOB.",
    quickTools: {
      ammoTitle: "Amunicja 81mm / 155mm",
      ammoDesc: "Pociski odłamkowe i dymne",
      logisticsTitle: "Planer Logistyczny",
      logisticsDesc: "Transport ciężarówką Ural i zaopatrzenie FOB",
      guideTitle: "Poradnik Obsługi Moździerzy",
      guideDesc: "Obrona przed ogniem kontrbateryjnym"
    },
    keypadTitle: "Ręczne Wprowadzanie Danych",
    directDistanceLabel: "Odległość do celu (metry)",
    directHeightLabel: "Różnica wysokości (metry)",
    directAzimuthLabel: "Azymut celu (0° - 360°)",
    adNotice: "Materiały Sponsorowane"
  }
};

export function getArtilleryCopy(locale: Locale): ArtilleryCopy {
  return copy[locale] ?? copy.en;
}
