import type {Locale} from "@/config/site";
import type {CatalogueChangeHistory} from "./catalogue-types";
import type {SeasonOneChange} from "./catalogue-evidence-data";
import {localizeCatalogueBuild} from "./catalogue-localization";

const fieldByLocale: Record<Exclude<Locale, "en">, Record<string, string>> = {
  de: {
    "Vendor price": "Händlerpreis", "Support unlock": "Unterstützungs-Freischaltung", "Career unlock": "Karriere-Freischaltung",
    "Required career level": "Benötigte Karrierestufe", "Recon unlock": "Aufklärungs-Freischaltung", "Pilot unlock": "Piloten-Freischaltung",
    Unlock: "Freischaltung", "Driver unlock": "Fahrer-Freischaltung", "Required level": "Benötigte Stufe",
    "AP career level": "AP-Karrierestufe", "Progression track": "Fortschrittspfad",
  },
  ru: {
    "Vendor price": "Цена у продавца", "Support unlock": "Разблокировка поддержки", "Career unlock": "Карьерная разблокировка",
    "Required career level": "Требуемый карьерный уровень", "Recon unlock": "Разблокировка разведки", "Pilot unlock": "Разблокировка пилота",
    Unlock: "Разблокировка", "Driver unlock": "Разблокировка водителя", "Required level": "Требуемый уровень",
    "AP career level": "Карьерный уровень ББ", "Progression track": "Ветка прогрессии",
  },
  "pt-br": {
    "Vendor price": "Preço no vendedor", "Support unlock": "Desbloqueio de suporte", "Career unlock": "Desbloqueio de carreira",
    "Required career level": "Nível de carreira necessário", "Recon unlock": "Desbloqueio de reconhecimento", "Pilot unlock": "Desbloqueio de piloto",
    Unlock: "Desbloqueio", "Driver unlock": "Desbloqueio de motorista", "Required level": "Nível necessário",
    "AP career level": "Nível de carreira AP", "Progression track": "Trilha de progressão",
  },
  ja: {
    "Vendor price": "ベンダー価格", "Support unlock": "支援解除", "Career unlock": "キャリア解除",
    "Required career level": "必要キャリアレベル", "Recon unlock": "偵察解除", "Pilot unlock": "パイロット解除",
    Unlock: "解除価格", "Driver unlock": "ドライバー解除", "Required level": "必要レベル",
    "AP career level": "APキャリアレベル", "Progression track": "進行トラック",
  },
  "zh-cn": {
    "Vendor price": "商店价格", "Support unlock": "支援解锁", "Career unlock": "生涯解锁",
    "Required career level": "所需生涯等级", "Recon unlock": "侦察解锁", "Pilot unlock": "飞行员解锁",
    Unlock: "解锁价格", "Driver unlock": "驾驶员解锁", "Required level": "所需等级",
    "AP career level": "AP 生涯等级", "Progression track": "成长路线",
  },
};

const subjectById: Record<string, string> = {
  "fob-vendor-price": "FOB vendor", "large-hammer-vendor-price": "Large Hammer", "large-hammer-support-unlock": "Large Hammer",
  "artillery-tank-career-unlock": "Artillery Tank", "artillery-tank-career-level": "Artillery Tank",
  "recon-mrad-scope-unlock": "6-10x MRAD scope", "recon-moa-scope-unlock": "6-10x MOA scope",
  "medium-hammer-support-unlock": "Medium Hammer", "small-armored-crate-pilot-unlock": "Small Armored Supply Crate",
  "little-bird-miniguns-pilot-unlock": "Little Bird with miniguns", "z20-lakota-pilot-unlock": "Z20 Lakota",
  "ural-unlock": "URAL", "dune-buggy-unlock": "Dune Buggy", "kodiak-flatbed-unlock": "Kodiak Flatbed",
  "music-tape-h-driver-unlock": "Music Tape H", "sports-parachute-level": "Sports Parachute",
  "large-backpack-level": "Large Backpack", "deagle-level": "Deagle", "762-ap-career-level": "7.62x54mm AP",
  "556-ap-career-level": "5.56mm AP", "pp19-drum-level": "PP-19 50 round drum magazine",
  "large-hammer-support-level": "Large Hammer", "ural-level": "URAL", "kodiak-assault-level": "Kodiak Assault",
  "dune-buggy-level": "Dune Buggy", "kodiak-flatbed-level": "Kodiak Flatbed", "large-supply-crate-level": "Large Supply Crate",
  "ural-covered-level": "URAL Covered", "music-tape-h-track": "Music Tape H", "ural-attack-level": "URAL Attack",
  "humvee-minigun-level": "Humvee with minigun", "heavy-tank-track": "Heavy Tank",
};

const subjectOverrides: Record<Exclude<Locale, "en">, Record<string, string>> = {
  de: {
    "fob-vendor-price": "FOB-Händler", "artillery-tank-career-unlock": "Artilleriepanzer", "artillery-tank-career-level": "Artilleriepanzer",
    "recon-mrad-scope-unlock": "MRAD-Zielfernrohr 6–10×", "recon-moa-scope-unlock": "MOA-Zielfernrohr 6–10×",
    "small-armored-crate-pilot-unlock": "Kleine gepanzerte Versorgungskiste", "little-bird-miniguns-pilot-unlock": "Little Bird mit Miniguns",
    "sports-parachute-level": "Sportfallschirm", "large-backpack-level": "Großer Rucksack", "pp19-drum-level": "PP-19-Trommelmagazin mit 50 Schuss",
    "large-supply-crate-level": "Große Versorgungskiste", "humvee-minigun-level": "Humvee mit Minigun", "heavy-tank-track": "Schwerer Panzer",
  },
  ru: {
    "fob-vendor-price": "Продавец FOB", "artillery-tank-career-unlock": "Артиллерийский танк", "artillery-tank-career-level": "Артиллерийский танк",
    "recon-mrad-scope-unlock": "Прицел MRAD 6–10×", "recon-moa-scope-unlock": "Прицел MOA 6–10×",
    "small-armored-crate-pilot-unlock": "Малый бронированный ящик снабжения", "little-bird-miniguns-pilot-unlock": "Little Bird с миниганами",
    "sports-parachute-level": "Спортивный парашют", "large-backpack-level": "Большой рюкзак", "pp19-drum-level": "Барабанный магазин PP-19 на 50 патронов",
    "large-supply-crate-level": "Большой ящик снабжения", "humvee-minigun-level": "Humvee с миниганом", "heavy-tank-track": "Тяжёлый танк",
  },
  "pt-br": {
    "fob-vendor-price": "Vendedor da FOB", "artillery-tank-career-unlock": "Tanque de artilharia", "artillery-tank-career-level": "Tanque de artilharia",
    "recon-mrad-scope-unlock": "Mira MRAD 6–10×", "recon-moa-scope-unlock": "Mira MOA 6–10×",
    "small-armored-crate-pilot-unlock": "Caixa pequena blindada de suprimentos", "little-bird-miniguns-pilot-unlock": "Little Bird com miniguns",
    "sports-parachute-level": "Paraquedas esportivo", "large-backpack-level": "Mochila grande", "pp19-drum-level": "Carregador tambor de 50 tiros da PP-19",
    "large-supply-crate-level": "Caixa grande de suprimentos", "humvee-minigun-level": "Humvee com minigun", "heavy-tank-track": "Tanque pesado",
  },
  ja: {
    "fob-vendor-price": "FOBベンダー", "artillery-tank-career-unlock": "自走砲戦車", "artillery-tank-career-level": "自走砲戦車",
    "recon-mrad-scope-unlock": "6～10倍MRADスコープ", "recon-moa-scope-unlock": "6～10倍MOAスコープ",
    "small-armored-crate-pilot-unlock": "小型装甲補給箱", "little-bird-miniguns-pilot-unlock": "ミニガン搭載Little Bird",
    "sports-parachute-level": "スポーツパラシュート", "large-backpack-level": "大型バックパック", "pp19-drum-level": "PP-19 50発ドラムマガジン",
    "large-supply-crate-level": "大型補給箱", "humvee-minigun-level": "ミニガン搭載Humvee", "heavy-tank-track": "重戦車",
  },
  "zh-cn": {
    "fob-vendor-price": "FOB 商店", "artillery-tank-career-unlock": "火炮坦克", "artillery-tank-career-level": "火炮坦克",
    "recon-mrad-scope-unlock": "6–10 倍 MRAD 瞄具", "recon-moa-scope-unlock": "6–10 倍 MOA 瞄具",
    "small-armored-crate-pilot-unlock": "小型装甲补给箱", "little-bird-miniguns-pilot-unlock": "机枪型 Little Bird",
    "sports-parachute-level": "运动降落伞", "large-backpack-level": "大型背包", "pp19-drum-level": "PP-19 50 发弹鼓",
    "large-supply-crate-level": "大型补给箱", "humvee-minigun-level": "机枪型 Humvee", "heavy-tank-track": "重型坦克",
  },
};

const levelTerms: Record<Exclude<Locale, "en">, Record<"Pilot" | "Driver" | "Career", string>> = {
  de: {Pilot: "Pilotenstufe", Driver: "Fahrerstufe", Career: "Karrierestufe"},
  ru: {Pilot: "Уровень пилота", Driver: "Уровень водителя", Career: "Карьерный уровень"},
  "pt-br": {Pilot: "Nível de piloto", Driver: "Nível de motorista", Career: "Nível de carreira"},
  ja: {Pilot: "パイロットレベル", Driver: "ドライバーレベル", Career: "キャリアレベル"},
  "zh-cn": {Pilot: "飞行员等级", Driver: "驾驶员等级", Career: "生涯等级"},
};

function localizeTextValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  const match = value.match(/^(Pilot|Driver|Career) level (\d+)$/);
  return match ? `${levelTerms[locale][match[1] as "Pilot" | "Driver" | "Career"]} ${match[2]}` : value;
}

export function localizeCatalogueChange(change: CatalogueChangeHistory, locale: Locale): CatalogueChangeHistory {
  if (locale === "en") return change;
  return {
    ...change,
    field: fieldByLocale[locale][change.field] ?? change.field,
    previousValue: localizeTextValue(change.previousValue, locale),
    currentValue: localizeTextValue(change.currentValue, locale),
    effectiveBuild: localizeCatalogueBuild(change.effectiveBuild, locale),
  };
}

export function localizeSeasonOneChange(change: SeasonOneChange, locale: Locale): SeasonOneChange {
  if (locale === "en") return change;
  const localized = localizeCatalogueChange(change, locale);
  return {
    ...change,
    ...localized,
    entity: subjectOverrides[locale][change.id] ?? subjectById[change.id] ?? change.entity,
  };
}
