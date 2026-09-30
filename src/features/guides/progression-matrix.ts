import type {Locale} from "@/config/site";
import {localizeSeasonOneChange} from "@/features/catalogue/catalogue-change-localization";
import {seasonOneChanges, seasonOneSourceUrl, seasonOneVerifiedAt, type SeasonOneChange} from "@/features/catalogue/catalogue-evidence-data";
import {getProgressionRoutes} from "@/features/tools/progression-routes";

type MatrixCopy = {
  title: string; scope: string; purchaseNote: string; empty: string; unknown: string;
  career: string; item: string; field: string; before: string; season1: string; season2: string;
  source: string; checked: string; route: string; transition: string;
};

const copy: Record<Locale, MatrixCopy> = {
  en: {
    title: "Unlock checks across seasons", scope: "Selected changes published on September 9, not the complete unlock roster. Career is separate from the six role tracks. Season 2 requirements have not been published in the reviewed teaser; unknown does not mean unchanged.",
    purchaseNote: "A level or track gate, a one-time unlock fee and a vendor purchase are different requirements. Fees below are dated Season 1 unlock changes, not repeat-purchase prices. Confirm the current client before spending.",
    empty: "No published change recorded here; this does not mean the track has no unlocks.", unknown: "Unknown", career: "Career", item: "Item / category", field: "Requirement", before: "Before S1", season1: "Season 1", season2: "Season 2", source: "Official Season 1 changelog", checked: "Evidence recorded", route: "Role route", transition: "Season 2 teaser: requirements pending",
  },
  ru: {
    title: "Проверка открытий между сезонами", scope: "Избранные изменения от 9 сентября, не полный список открытий. Карьера отделена от шести ролевых веток. Изученный тизер второго сезона не публикует требования; неизвестно не означает без изменений.",
    purchaseNote: "Порог уровня или ветки, разовая плата за открытие и покупка у продавца — разные требования. Указанные суммы относятся к открытиям первого сезона, не к повторным покупкам. Перед расходами проверьте клиент.",
    empty: "Здесь не записано опубликованное изменение; это не значит, что в ветке нет открытий.", unknown: "Неизвестно", career: "Карьера", item: "Предмет / категория", field: "Требование", before: "До сезона 1", season1: "Сезон 1", season2: "Сезон 2", source: "Официальные изменения первого сезона", checked: "Дата записи данных", route: "Ролевая ветка", transition: "Тизер второго сезона: требования ожидаются",
  },
  de: {
    title: "Freischaltungen im Saisonvergleich", scope: "Ausgewählte Änderungen vom 9. September, keine vollständige Freischaltliste. Karriere ist von den sechs Rollenpfaden getrennt. Der geprüfte Teaser veröffentlicht keine Anforderungen für Saison 2; unbekannt bedeutet nicht unverändert.",
    purchaseNote: "Stufen- oder Pfadanforderung, einmalige Freischaltgebühr und Händlerkauf sind verschiedene Voraussetzungen. Die Beträge sind datierte Freischaltänderungen aus Saison 1, keine Wiederkaufpreise. Vor Ausgaben im aktuellen Client prüfen.",
    empty: "Hier ist keine veröffentlichte Änderung erfasst; das bedeutet nicht, dass dieser Pfad keine Freischaltungen hat.", unknown: "Unbekannt", career: "Karriere", item: "Gegenstand / Kategorie", field: "Anforderung", before: "Vor Saison 1", season1: "Saison 1", season2: "Saison 2", source: "Offizieller Changelog für Saison 1", checked: "Daten erfasst", route: "Rollenpfad", transition: "Teaser für Saison 2: Anforderungen ausstehend",
  },
  "pt-br": {
    title: "Desbloqueios entre temporadas", scope: "Mudanças selecionadas publicadas em 9 de setembro, não a lista completa de desbloqueios. Carreira é separada das seis funções. O teaser consultado não publica requisitos da Temporada 2; desconhecido não significa inalterado.",
    purchaseNote: "Requisito de nível ou trilha, taxa única de desbloqueio e compra no vendedor são exigências diferentes. Os valores são mudanças de desbloqueio da Temporada 1, não preços de recompra. Confira o cliente antes de gastar.",
    empty: "Nenhuma mudança publicada foi registrada aqui; isso não significa que a trilha não tenha desbloqueios.", unknown: "Desconhecido", career: "Carreira", item: "Item / categoria", field: "Requisito", before: "Antes da T1", season1: "Temporada 1", season2: "Temporada 2", source: "Changelog oficial da Temporada 1", checked: "Registro da evidência", route: "Trilha da função", transition: "Teaser da Temporada 2: requisitos pendentes",
  },
  ja: {
    title: "シーズン別の解除条件照合", scope: "9月9日公開の一部変更であり、全解除一覧ではありません。キャリアと6つのロールは別です。確認済みの第2シーズン予告には解除条件がなく、不明は変更なしを意味しません。",
    purchaseNote: "レベル・進行条件、1回限りの解除費、店での購入は別の条件です。下記金額は第1シーズンの解除費変更であり、再購入価格ではありません。支出前に現行クライアントで確認してください。",
    empty: "ここに公開変更の記録がないだけで、このロールに解除項目がないという意味ではありません。", unknown: "不明", career: "キャリア", item: "アイテム／分類", field: "条件", before: "第1シーズン以前", season1: "第1シーズン", season2: "第2シーズン", source: "第1シーズン公式変更履歴", checked: "証拠の記録日", route: "ロールの進行", transition: "第2シーズン予告：条件は未発表",
  },
  "zh-cn": {
    title: "跨赛季解锁核对", scope: "仅覆盖 9 月 9 日官方公布的部分变更，不是完整解锁清单。生涯与六条职业线分开；已核预告未公布第二赛季门槛，未知不等于没有改动。",
    purchaseNote: "等级／路线门槛、一次性解锁费、商店购买是不同条件。下列费用是第一赛季的历史解锁变更，不是重复购买报价；支出前须核对当前客户端。",
    empty: "这里没有记录该路线的官方变更，不代表它没有解锁项目。", unknown: "未知", career: "生涯", item: "物品／类别", field: "条件", before: "第一赛季前", season1: "第一赛季", season2: "第二赛季", source: "第一赛季官方更新日志", checked: "证据记录日期", route: "职业路线", transition: "第二赛季预告：门槛待公布",
  },
  "zh-tw": {
    title: "跨賽季解鎖核對", scope: "僅涵蓋 9 月 9 日官方公佈的部分變更，不是完整解鎖清單。生涯與六條職業線分開；已核預告未公佈第二賽季門檻，未知不等於沒有改動。",
    purchaseNote: "等級／路線門檻、一次性解鎖費、商店購買是不同條件。下列費用是第一賽季的歷史解鎖變更，不是重複購買報價；支出前須核對目前用戶端。",
    empty: "這裡沒有記錄該路線的官方變更，不代表它沒有解鎖項目。", unknown: "未知", career: "生涯", item: "物品／類別", field: "條件", before: "第一賽季前", season1: "第一賽季", season2: "第二賽季", source: "第一賽季官方更新日誌", checked: "證據記錄日期", route: "職業路線", transition: "第二賽季預告：門檻待公佈",
  },
  pl: {
    title: "Odblokowania między sezonami", scope: "Wybrane zmiany opublikowane 9 września, nie pełna lista odblokowań. Kariera jest oddzielna od sześciu ról. Sprawdzony teaser nie podaje wymagań sezonu 2; nieznane nie oznacza bez zmian.",
    purchaseNote: "Próg poziomu lub ścieżki, jednorazowa opłata odblokowania i zakup u sprzedawcy to różne wymagania. Kwoty oznaczają datowane zmiany odblokowań sezonu 1, nie ceny ponownych zakupów. Przed wydaniem pieniędzy sprawdź klienta.",
    empty: "Nie zapisano tu opublikowanej zmiany; nie oznacza to braku odblokowań w tej ścieżce.", unknown: "Nieznane", career: "Kariera", item: "Przedmiot / kategoria", field: "Wymaganie", before: "Przed sezonem 1", season1: "Sezon 1", season2: "Sezon 2", source: "Oficjalne zmiany sezonu 1", checked: "Data zapisu dowodów", route: "Ścieżka roli", transition: "Teaser sezonu 2: wymagania oczekiwane",
  },
};

export type ProgressionMatrixRow = SeasonOneChange & {seasonTwoValue: null; seasonTwoState: "unknown"};

export function getProgressionMatrix(slug: string, locale: Locale) {
  if (!["wardogs-progression-wipes-guide", "wardogs-season-2"].includes(slug)) return null;
  const ui = copy[locale];
  const rows = (changes: readonly SeasonOneChange[]): ProgressionMatrixRow[] => changes.map((change) => ({...change, seasonTwoValue: null, seasonTwoState: "unknown"}));
  return {
    ui,
    groups: [
      {id: "career", label: ui.career, rows: rows(seasonOneChanges.filter(({progressionTrack}) => progressionTrack === "career").map((change) => localizeSeasonOneChange(change, locale)))},
      ...getProgressionRoutes(locale).map((route) => ({id: route.id, label: route.roleLabel, rows: rows(route.changes)})),
    ],
    sourceUrl: seasonOneSourceUrl,
    checkedAt: seasonOneVerifiedAt,
    seasonTwoSourceUrl: "https://steamcommunity.com/games/1867240/announcements/detail/677384059121304815",
    seasonTwoCheckedAt: "2026-09-23",
  };
}
