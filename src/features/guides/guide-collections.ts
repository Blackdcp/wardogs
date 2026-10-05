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
  en: ["Guide collections", "Choose a task, then follow the relevant guides.", "Start playing", "Weapons & combat", "Map, FOB & logistics", "Seasons & progression", "PC & server fixes", "Game & release reference", "Tools & calculators", "Squad, towers & cargo"],
  ja: ["攻略コレクション", "目的を選んで、必要な攻略へ進みましょう。", "初心者・フレンドと遊ぶ", "武器・戦闘", "マップ・FOB・物流", "シーズン・進行・ワイプ", "PC・サーバーの不具合", "ゲーム・発売情報", "ツール・計算機", "フレンド・拠点・輸送の攻略"],
  de: ["Guide-Sammlungen", "Wähle deine Aufgabe und die passenden Guides.", "Spielstart", "Waffen & Kampf", "Karte, FOB & Logistik", "Saisons & Fortschritt", "PC- & Serverprobleme", "Spiel- & Releaseinfos", "Tools & Rechner", "Squad, Türme & Fracht"],
  ru: ["Разделы руководств", "Выберите задачу и нужное руководство.", "Начало игры", "Оружие и бой", "Карта, FOB и логистика", "Сезоны и прогресс", "Проблемы ПК и серверов", "Об игре и релизе", "Инструменты и калькуляторы", "Отряд, вышки и грузы"],
  "pt-br": ["Coleções de guias", "Escolha uma tarefa e siga os guias relevantes.", "Começar a jogar", "Armas e combate", "Mapa, FOB e logística", "Temporadas e progressão", "Problemas de PC e servidor", "Jogo e lançamento", "Ferramentas e calculadoras", "Esquadrão, torres e carga"],
  pl: ["Zbiory poradników", "Wybierz zadanie i odpowiedni poradnik.", "Początek gry", "Broń i walka", "Mapa, FOB i logistyka", "Sezony i postępy", "Problemy PC i serwerów", "Gra i premiera", "Narzędzia i kalkulatory", "Drużyna, wieże i ładunki"],
  "zh-cn": ["攻略合集", "按当前任务找到需要的攻略。", "新手与组队", "武器与战斗", "地图、FOB 与后勤", "赛季、成长与重置", "电脑与服务器排障", "游戏与发售信息", "工具与计算器", "好友邀请、塔楼与货运"],
  "zh-tw": ["攻略合集", "按目前任務找到需要的攻略。", "新手與組隊", "武器與戰鬥", "地圖、FOB 與後勤", "賽季、成長與重置", "電腦與伺服器排障", "遊戲與發售資訊", "工具與計算機", "好友邀請、塔樓與貨運"]
} satisfies Record<Locale, readonly string[]>;

export function getGuideHubCopy(locale: Locale) {
  const [title, description, start, combat, logistics, progression, fixes, reference, tools, recovery] = labels[locale];
  return {title, description, tools, recovery, collections: {start, combat, logistics, progression, fixes, reference}};
}
