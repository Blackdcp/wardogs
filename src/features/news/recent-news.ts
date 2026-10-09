import type {Locale} from "@/config/site";
import {getRecentMatchNews} from "./recent-match-news";

// These are publication/event dates in Asia/Shanghai, never editorial checkedAt dates.
const records = [
  {date: "2026-10-09", titleKey: "contestClosedOctober9", guideSlug: "wardogs-100k-clip-contest", sourceClass: "official", kind: "change", sources: ["https://www.wardogs100k.com/terms-conditions", "https://www.wardogs100k.com/"]},
  {date: "2026-10-08", titleKey: "devlogPreviewOctober8", guideSlug: "wardogs-season-2", sourceClass: "official", kind: "season", sources: ["https://discord.com/channels/1464219389913071646/1464230515862278215/1557782520223895602"]},
  {date: "2026-10-08", titleKey: "creatorGuidesOctober8", guideSlug: "wardogs-fob-layouts", sourceClass: "creator-current", kind: "change", sources: ["https://www.youtube.com/watch?v=z7wMLQQtIIM", "https://www.youtube.com/watch?v=kC3P-klWNxk"]},
  {date: "2026-10-02", titleKey: "irHotfixOctober2", guideSlug: "wardogs-patch-notes", sourceClass: "official", kind: "patch", sources: ["https://discord.com/channels/1464219389913071646/1464230515862278215/1555603801602523216"]}
] as const;
type Copy = readonly [title: string, description: string, badge: string, dateLabel: string];
const copy: Record<Locale, readonly Copy[]> = {
  en: [
    ["$100K contest closed; results still pending", "The entry deadline passed October 9 at 06:59 Shanghai time (October 8, 23:59 BST). The organizer plans winners on October 15 or shortly after; no final winner list has been verified. Keep your clip, entry record and contact inbox available.", "Entries closed", "Deadline"],
    ["Official devlog preview: Season 1 recap and October 15", "At 23:51 Shanghai time on October 8, the official Discord announced a devlog for the following day covering Season 1 and a preview of October 15. No published video link was present at review; this does not establish a patch-release hour or completed features.", "Official preview", "Announced"],
    ["New creator guides: solo/duo FOB and attachment trade-offs", "Wake Up's October 8 FOB layout includes re-entry and firing-arc limitations; Evo4Fun compares attachments and handling. Our caption-based breakdowns separate the creators' observations from official rules and link to logistics and loadout planning.", "Creator analysis", "Video publication"],
    ["IR Rangefinder purchases disabled; CIWS change announced", "The October 2 official notice disabled IR Rangefinder purchases until Season 2 and announced a Havoc CIWS time to destroy a Havoc changing from 12 to around 6 seconds. Rollout followed server restarts. This is dated patch history, not a live server status check.", "Official update", "Announced"]
  ],
  de: [
    ["100.000-Dollar-Wettbewerb beendet; Ergebnisse ausstehend", "Die Einsendefrist endete am 9. Oktober um 06:59 Uhr in Shanghai (8. Oktober, 23:59 BST). Gewinner sind für den 15. Oktober oder kurz danach angekündigt; eine endgültige Liste wurde nicht bestätigt. Clip, Teilnahmebeleg und Kontaktpostfach aufbewahren.", "Teilnahme beendet", "Frist"],
    ["Offizielle Devlog-Vorschau: Season 1 und 15. Oktober", "Am 8. Oktober um 23:51 Uhr in Shanghai kündigte der offizielle Discord für den Folgetag einen Season-1-Rückblick und eine Vorschau auf den 15. Oktober an. Bei der Prüfung lag kein veröffentlichter Videolink vor; weder Patch-Uhrzeit noch fertige Funktionen sind damit bestätigt.", "Offizielle Vorschau", "Angekündigt"],
    ["Neue Videos: Solo-/Duo-FOB und Aufsatz-Abwägungen", "Wake Ups FOB-Entwurf vom 8. Oktober behandelt Wiedereintritt und Schusswinkel; Evo4Fun vergleicht Aufsätze und Handhabung. Unsere Untertitel-Auswertungen trennen Beobachtungen von offiziellen Regeln und führen zur Logistik- und Ausrüstungsplanung.", "Creator-Analyse", "Videoveröffentlichung"],
    ["IR-Käufe gesperrt; CIWS-Änderung angekündigt", "Die offizielle Meldung vom 2. Oktober sperrte IR-Rangefinder-Käufe bis Season 2 und kündigte eine Verkürzung der CIWS-Zeit zum Zerstören eines Havoc von 12 auf etwa 6 Sekunden an. Die Einführung folgte Serverneustarts. Patchverlauf, keine Live-Statusprüfung.", "Offizielles Update", "Angekündigt"]
  ],
  ru: [
    ["Конкурс на $100 000 закрыт; результаты ожидаются", "Приём закончился 9 октября в 06:59 по Шанхаю (8 октября, 23:59 BST). Организатор планирует объявить победителей 15 октября или вскоре после; итоговый список не подтверждён. Сохраните ролик, запись заявки и доступ к почте.", "Приём закрыт", "Срок"],
    ["Официальный анонс дневника: Season 1 и 15 октября", "8 октября в 23:51 по Шанхаю официальный Discord анонсировал на следующий день итоги Season 1 и предварительный взгляд на 15 октября. При проверке ссылки на опубликованное видео не было; это не время установки патча и не подтверждение готовности функций.", "Официальный анонс", "Объявлено"],
    ["Новые видео: FOB для одного/двоих и выбор модулей", "План FOB от Wake Up за 8 октября включает ограничения повторного входа и углов огня; Evo4Fun сравнивает модули и управление. Разборы субтитров отделяют наблюдения авторов от официальных правил и ведут к планировщикам логистики и снаряжения.", "Разбор авторов", "Публикация видео"],
    ["Покупка IR отключена; объявлено изменение CIWS", "Официальная запись 2 октября отключила покупку IR Rangefinder до Season 2 и объявила сокращение времени уничтожения Havoc системой CIWS с 12 до примерно 6 секунд. Развёртывание шло через перезапуски серверов. Это история обновлений, не проверка серверов в реальном времени.", "Официальное обновление", "Объявлено"]
  ],
  "pt-br": [
    ["Concurso de US$ 100 mil encerrado; resultados pendentes", "O prazo terminou em 9 de outubro às 06h59 de Xangai (8 de outubro, 23h59 BST). O organizador prevê vencedores em 15 de outubro ou pouco depois; nenhuma lista final foi confirmada. Guarde o vídeo, o registro e o acesso ao e-mail.", "Inscrições encerradas", "Prazo"],
    ["Prévia oficial do devlog: Season 1 e 15 de outubro", "Em 8 de outubro às 23h51 de Xangai, o Discord oficial anunciou para o dia seguinte um balanço da Season 1 e uma prévia de 15 de outubro. Na revisão não havia link de vídeo publicado; isso não define horário do patch nem recursos concluídos.", "Prévia oficial", "Anunciado"],
    ["Novos vídeos: FOB solo/dupla e escolhas de acessórios", "O projeto de FOB de Wake Up de 8 de outubro inclui limitações de reentrada e ângulo de tiro; Evo4Fun compara acessórios e manuseio. Os resumos das legendas separam observações dos criadores de regras oficiais e levam aos planejadores de logística e equipamento.", "Análise de criadores", "Publicação do vídeo"],
    ["Compra do IR suspensa; mudança de CIWS anunciada", "O aviso oficial de 2 de outubro suspendeu a compra do IR Rangefinder até a Season 2 e anunciou redução do tempo de CIWS destruir um Havoc de 12 para cerca de 6 segundos. A implantação acompanhou reinicializações dos servidores. É histórico do patch, não monitoramento ao vivo.", "Atualização oficial", "Anunciado"]
  ],
  ja: [
    ["10万ドルコンテスト受付終了・結果待ち", "締切は上海時間10月9日06:59（日本時間07:59、BST10月8日23:59）でした。主催者は10月15日またはその直後の発表を予定していますが、最終受賞者一覧は未確認です。応募動画・記録・連絡用メールを保管してください。", "受付終了", "締切"],
    ["公式開発日誌予告：Season 1振り返りと10月15日", "公式Discordは上海時間10月8日23:51、翌日の開発日誌でSeason 1を振り返り、10月15日の内容を先行紹介すると告知しました。確認時点では公開済み動画リンクはなく、パッチ適用時刻や機能完成を示す告知ではありません。", "公式予告", "告知日"],
    ["新着解説：ソロ／デュオFOBとアタッチメント選び", "10月8日のWake UpのFOB設計では再入場や射角の制約も扱い、Evo4Funはアタッチメントと取り回しを比較しています。字幕に基づく解説では投稿者の観察と公式ルールを分け、補給・装備計画へつなげます。", "投稿者による解説", "動画公開日"],
    ["IR購入停止・CIWS変更の公式告知", "10月2日の公式告知はIR Rangefinderの購入をSeason 2まで停止し、CIWSによるHavoc撃破時間を12秒から約6秒へ短縮すると発表。サーバー再起動に合わせた展開でした。過去の更新記録であり、現在の稼働状況確認ではありません。", "公式更新", "告知日"]
  ],
  "zh-cn": [
    ["10万美元比赛已截止，获奖名单待公布", "报名于北京时间10月9日06:59截止（BST10月8日23:59）。主办方计划10月15日或稍后公布获奖者；尚未核到最终名单。请保留原视频、报名记录和联系邮箱。", "报名已截止", "截止日期"],
    ["官方预告新DEVLOG：回顾S1，前瞻10月15日", "官方Discord于北京时间10月8日23:51预告次日发布开发日志，回顾Season 1并先睹10月15日内容。核查时尚无已发布视频链接；这不是补丁精确上线时刻，也不代表预告功能已经实装。", "官方预告", "公告日期"],
    ["新作者攻略：单双人FOB与配件取舍", "Wake Up的10月8日FOB设计包含重新入场和射界限制；Evo4Fun比较配件与操控取舍。本站字幕解读区分作者观察和官方规则，并衔接后勤及配装工具。", "作者解析", "视频发布日期"],
    ["IR测距仪停购，CIWS调整已有官方公告", "10月2日官方公告暂停IR Rangefinder购买至Season 2，并宣布CIWS击毁Havoc的时间由12秒改为约6秒，随服务器重启分批应用。这是有日期的补丁记录，不是实时服务器检查。", "官方更新", "公告日期"]
  ],
  "zh-tw": [
    ["10萬美元比賽已截止，獲獎名單待公布", "報名於台北時間10月9日06:59截止（BST10月8日23:59）。主辦方預計10月15日或稍後公布獲獎者；尚未查到最終名單。請保留原影片、報名紀錄和聯絡信箱。", "報名已截止", "截止日期"],
    ["官方預告新DEVLOG：回顧S1，前瞻10月15日", "官方Discord於台北時間10月8日23:51預告隔日發布開發日誌，回顧Season 1並搶先介紹10月15日內容。查核時尚無已發布影片連結；這不是更新精確上線時刻，也不代表預告功能已經實裝。", "官方預告", "公告日期"],
    ["新作者攻略：單雙人FOB與配件取捨", "Wake Up的10月8日FOB設計包含重新入場和射界限制；Evo4Fun比較配件與操控取捨。本站字幕解讀區分作者觀察和官方規則，並串連後勤及配裝工具。", "作者解析", "影片發布日期"],
    ["IR測距儀停止販售，CIWS調整已有官方公告", "10月2日官方公告暫停IR Rangefinder購買至Season 2，並宣布CIWS擊毀Havoc的時間由12秒改為約6秒，隨伺服器重新啟動分批套用。這是有日期的更新紀錄，不是即時伺服器檢查。", "官方更新", "公告日期"]
  ],
  pl: [
    ["Konkurs o 100 tys. dolarów zamknięty; wyniki oczekiwane", "Termin minął 9 października o 06:59 w Szanghaju (8 października, 23:59 BST). Organizator planuje wyniki 15 października lub krótko po tej dacie; nie potwierdzono końcowej listy. Zachowaj film, zgłoszenie i dostęp do poczty.", "Zgłoszenia zamknięte", "Termin"],
    ["Oficjalna zapowiedź devloga: Season 1 i 15 października", "8 października o 23:51 w Szanghaju oficjalny Discord zapowiedział na następny dzień podsumowanie Season 1 i przegląd planów na 15 października. Podczas kontroli nie było linku do opublikowanego filmu; nie potwierdza to godziny aktualizacji ani wdrożenia funkcji.", "Oficjalna zapowiedź", "Ogłoszono"],
    ["Nowe poradniki wideo: FOB solo/duo i dobór dodatków", "Projekt FOB Wake Up z 8 października obejmuje ograniczenia ponownego wejścia i pola ostrzału; Evo4Fun porównuje dodatki i obsługę. Omówienia napisów oddzielają obserwacje twórców od oficjalnych zasad i prowadzą do planowania logistyki oraz zestawów.", "Analiza twórców", "Publikacja filmu"],
    ["Zakup IR wyłączony; zapowiedziano zmianę CIWS", "Oficjalny wpis z 2 października wyłączył zakup IR Rangefinder do Season 2 i zapowiedział skrócenie czasu zniszczenia Havoca przez CIWS z 12 do około 6 sekund. Wdrażano ją przy restartach serwerów. To historia aktualizacji, nie bieżący monitoring.", "Oficjalna aktualizacja", "Ogłoszono"]
  ]
};
export function getRecentNews(locale: Locale) {
  return [...records.map((record, index) => ({...record, status: "Confirmed" as const, title: copy[locale][index][0], description: copy[locale][index][1], badge: copy[locale][index][2], dateLabel: copy[locale][index][3]})), ...getRecentMatchNews(locale)];
}
