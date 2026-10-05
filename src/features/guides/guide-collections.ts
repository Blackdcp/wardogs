import type {GuideSummary} from "@/content/guides";
import type {Locale} from "@/config/site";

export const GUIDE_COLLECTIONS = [
  {key: "start", slugs: ["wardogs-beginner-guide", "wardogs-money-guide", "wardogs-controls", "wardogs-squad-guide", "wardogs-community-servers-guide"]},
  {key: "combat", slugs: ["wardogs-best-weapons-loadouts", "wardogs-mortar-guide", "wardogs-artillery-guide", "wardogs-ammo-reload-guide", "wardogs-infantry-mode", "wardogs-best-settings"]},
  {key: "logistics", slugs: ["wardogs-map", "wardogs-fob-guide", "wardogs-towers-guide", "wardogs-cargo-guide", "wardogs-helicopter-guide", "wardogs-equipment-tools-guide"]},
  {key: "progression", slugs: ["wardogs-season-2", "wardogs-progression-wipes-guide", "wardogs-patch-notes"]},
  {key: "fixes", slugs: ["wardogs-crash-fix", "wardogs-known-issues", "wardogs-server-status", "wardogs-system-requirements", "wardogs-linux-proton"]},
  {key: "reference", slugs: []}
] as const;

export type GuideCollectionKey = (typeof GUIDE_COLLECTIONS)[number]["key"];

// Each existing guide stays discoverable exactly once, with curated routes first.
export function groupGuideCollections<T extends Pick<GuideSummary, "slug">>(guides: readonly T[]) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const assigned = new Set<string>();
  return GUIDE_COLLECTIONS.map((collection) => {
    const entries = collection.key === "reference"
      ? guides.filter((guide) => !assigned.has(guide.slug))
      : collection.slugs.flatMap((slug) => {
        const guide = bySlug.get(slug);
        if (!guide || assigned.has(slug)) return [];
        assigned.add(slug);
        return [guide];
      });
    return {key: collection.key, guides: entries};
  }).filter((collection) => collection.guides.length > 0);
}

// UI copy follows the site's existing locale-specific feature data pattern.
const labels = {
  en: ["Guide collections", "Start playing", "Weapons & combat", "Map, FOB & logistics", "Seasons & progression", "PC & server fixes", "Game & release reference"],
  ja: ["攻略コレクション", "初心者・フレンドと遊ぶ", "武器・戦闘", "マップ・FOB・物流", "シーズン・進行・ワイプ", "PC・サーバーの不具合", "ゲーム・発売情報"],
  de: ["Guide-Sammlungen", "Spielstart", "Waffen & Kampf", "Karte, FOB & Logistik", "Saisons & Fortschritt", "PC- & Serverprobleme", "Spiel- & Releaseinfos"],
  ru: ["Разделы руководств", "Начало игры", "Оружие и бой", "Карта, FOB и логистика", "Сезоны и прогресс", "Проблемы ПК и серверов", "Об игре и релизе"],
  "pt-br": ["Coleções de guias", "Começar a jogar", "Armas e combate", "Mapa, FOB e logística", "Temporadas e progressão", "Problemas de PC e servidor", "Jogo e lançamento"],
  pl: ["Zbiory poradników", "Początek gry", "Broń i walka", "Mapa, FOB i logistyka", "Sezony i postępy", "Problemy PC i serwerów", "Gra i premiera"],
  "zh-cn": ["攻略合集", "新手与组队", "武器与战斗", "地图、FOB 与后勤", "赛季、成长与重置", "电脑与服务器排障", "游戏与发售信息"],
  "zh-tw": ["攻略合集", "新手與組隊", "武器與戰鬥", "地圖、FOB 與後勤", "賽季、成長與重置", "電腦與伺服器排障", "遊戲與發售資訊"]
} satisfies Record<Locale, readonly string[]>;

export function getGuideHubCopy(locale: Locale) {
  const [title, start, combat, logistics, progression, fixes, reference] = labels[locale];
  return {
    title,
    collections: {start, combat, logistics, progression, fixes, reference}
  };
}
