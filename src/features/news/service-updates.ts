const records = [
  {date: "2026-09-29", titleKey: "devResponseSeptember29", guideSlug: "wardogs-season-2", sources: ["https://x.com/Brammflakes/status/2104937869634662749"]},
  {date: "2026-09-26", titleKey: "threeMillionSeptember26", guideSlug: "wardogs-player-count", sources: ["https://steamcommunity.com/app/1867240/announcements/"]},
  {date: "2026-09-25", titleKey: "securityMaintenanceSeptember25", guideSlug: "wardogs-server-status", sources: ["https://x.com/WARDOGSUpdates/status/2103432101781545416", "https://x.com/WARDOGSUpdates/status/2103450008431313221"]},
  {date: "2026-09-24", titleKey: "distributionIncidentSeptember24", guideSlug: "wardogs-patch-notes", sources: ["https://x.com/WARDOGSUpdates/status/2103051537308135694", "https://x.com/WARDOGSUpdates/status/2103054159641538707"]}
] as const;

const copy: Record<string, readonly (readonly [string, string])[]> = {
  en: [
    ["Developer response on balance and XP", "Joe Brammer published a response. Its full transcript has not been verified here; no specific XP values, patch date or level-capped server promise is inferred."],
    ["Three million copies sold", "The September 26 official announcement is a cumulative sales milestone, not current concurrent players or proof that every server is available."],
    ["Security maintenance: recovery notice", "Maintenance was scheduled for 11:00 UTC; at 11:42 UTC the team said services were returning. This dated notice is not live telemetry or evidence that WD-L020 / KB5124010 was fixed."],
    ["Wrong Steam build incident resolved", "A wrong build affected a small group; the team subsequently said the incident was resolved. The roughly 16 GB redownload advice applied to that affected group then, not all players today. No new patch number is established."]
  ],
  ja: [
    ["バランスとXPへの開発者応答", "Joe Brammerが応答を公開。字幕全文は未検証のため、具体的XP値、パッチ日程、レベル制限サーバーの実装約束は抽出しません。"],
    ["販売300万本", "9月26日の公式告知は累計販売の節目です。現在の同時接続数や全サーバーの正常稼働を示しません。"],
    ["セキュリティ保守後の復旧案内", "11:00 UTC開始予定の保守後、11:42 UTCにサービス復旧中と告知。日時付き履歴でありライブ監視やWD-L020 / KB5124010修正の証拠ではありません。"],
    ["Steam誤ビルド配信を解決", "少数に誤ビルドが配信され、後に公式が解決と返信。約16 GB再ダウンロードは当時の対象者向けで、現在の全員への指示ではありません。新パッチ番号も確認されていません。"]
  ],
  ru: [
    ["Ответ разработчика о балансе и XP", "Joe Brammer опубликовал ответ. Полный текст видео здесь не проверен: конкретные значения XP, дата патча или обещание серверов с лимитом уровня не выводятся."],
    ["Три миллиона проданных копий", "Официальный анонс 26 сентября сообщает суммарные продажи, не текущий онлайн и не доступность всех серверов."],
    ["Обслуживание безопасности: восстановление", "Начало планировалось на 11:00 UTC; в 11:42 UTC команда сообщила о возвращении сервисов. Это датированная история, не живая телеметрия и не доказательство исправления WD-L020 / KB5124010."],
    ["Неверная сборка Steam: инцидент решен", "Небольшая группа получила неверный билд; позднее команда сообщила о решении. Совет скачать около 16 GB касался той группы тогда, не всех игроков сегодня. Новый номер патча не установлен."]
  ],
  de: [
    ["Entwicklerantwort zu Balance und XP", "Joe Brammer veröffentlichte eine Antwort. Das vollständige Transkript ist hier ungeprüft; keine konkreten XP-Werte, Patchtermine oder Levelserver-Zusagen werden abgeleitet."],
    ["Drei Millionen verkaufte Exemplare", "Die offizielle Meldung vom 26. September betrifft kumulierte Verkäufe, nicht aktuelle Gleichzeitigkeit oder die Verfügbarkeit jedes Servers."],
    ["Sicherheitswartung: Wiederherstellung gemeldet", "Wartungsbeginn war für 11:00 UTC geplant; um 11:42 UTC meldete das Team zurückkehrende Dienste. Datierter Verlauf, keine Live-Telemetrie und kein Nachweis für einen WD-L020-/KB5124010-Fix."],
    ["Falscher Steam-Build: Vorfall behoben", "Eine kleine Gruppe erhielt einen falschen Build; später meldete das Team die Behebung. Etwa 16 GB erneut herunterzuladen war eine damalige Empfehlung für Betroffene, nicht für alle heute. Keine neue Patchnummer bestätigt."]
  ],
  "pt-br": [
    ["Resposta do desenvolvedor sobre balanceamento e XP", "Joe Brammer publicou uma resposta. A transcrição completa não foi verificada aqui; não inferimos valores de XP, data de patch ou promessa de servidores com limite de nível."],
    ["Três milhões de cópias vendidas", "O anúncio oficial de 26 de setembro é de vendas acumuladas, não jogadores simultâneos atuais nem disponibilidade de todos os servidores."],
    ["Manutenção de segurança: recuperação anunciada", "O início estava previsto para 11:00 UTC; às 11:42 UTC a equipe informou retorno dos serviços. É um registro datado, não telemetria ao vivo ou prova de correção WD-L020 / KB5124010."],
    ["Incidente de build errada no Steam resolvido", "Uma pequena parcela recebeu a build errada; depois a equipe informou resolução. A orientação de baixar cerca de 16 GB era para os afetados naquele momento, não todos hoje. Nenhum novo número de patch foi estabelecido."]
  ],
  "zh-cn": [
    ["开发者发布平衡与XP回应", "Joe Brammer已发布回应，本站未核完整字幕，不从中提取具体XP数值、补丁日期或等级限制服上线承诺。"],
    ["累计销量达到三百万份", "9月26日官方宣布的是累计销量里程碑，不是实时同时在线人数，也不证明所有服务器可用。"],
    ["安全维护后发布恢复通知", "维护计划11:00 UTC开始，团队于11:42 UTC表示服务正在恢复。这是有日期的记录，不是实时遥测，也不是WD-L020 / KB5124010已修的证据。"],
    ["Steam错误构建分发事故已解决", "错误构建影响少部分玩家，团队随后回复已解决。重新下载约16 GB的提示仅适用于当时受影响者，不是当前全体玩家的要求，也未确立新补丁编号。"]
  ],

  pl: [
["Odpowiedź dewelopera w sprawie balansu i XP", "Joe Brammer opublikował odpowiedź. Nie zweryfikowaliśmy pełnej transkrypcji, więc nie wywodzimy z niej wartości XP, daty aktualizacji ani obietnicy serwerów z limitem poziomu."],
["Trzy miliony sprzedanych egzemplarzy", "Oficjalne ogłoszenie z 26 września dotyczy łącznej sprzedaży, a nie obecnej liczby graczy jednocześnie ani dostępności wszystkich serwerów."],
["Konserwacja zabezpieczeń: komunikat o przywracaniu usług", "Konserwację zaplanowano na 11:00 UTC; o 11:42 UTC zespół poinformował o przywracaniu usług. To datowany zapis, nie monitoring na żywo ani dowód naprawienia WD-L020 / KB5124010."],
["Rozwiązano incydent z błędną wersją Steam", "Niewielka grupa otrzymała niewłaściwą wersję; później zespół poinformował o rozwiązaniu incydentu. Zalecenie ponownego pobrania około 16 GB dotyczyło wtedy poszkodowanych, a nie wszystkich graczy obecnie. Nie potwierdzono nowego numeru aktualizacji."]
],
  "zh-tw": [
    ["開發者釋出平衡與XP回應", "Joe Brammer已釋出回應，本站未核完整字幕，不從中提取具體XP數值、補丁日期或等級限制服上線承諾。"],
    ["累計銷量達到三百萬份", "9月26日官方宣佈的是累計銷量里程碑，不是即時同時線上人數，也不證明所有伺服器可用。"],
    ["安全維護後釋出恢復通知", "維護計劃11:00 UTC開始，團隊於11:42 UTC表示服務正在恢復。這是有日期的記錄，不是即時遙測，也不是WD-L020 / KB5124010已修的證據。"],
    ["Steam錯誤構建分發事故已解決", "錯誤構建影響少部分玩家，團隊隨後回覆已解決。重新下載約16 GB的提示僅適用於當時受影響者，不是當前全體玩家的要求，也未確立新補丁編號。"]
]
};

export function getServiceUpdates(locale: string) {
  const localized = copy[locale] ?? copy.en;
  return records.map((record, index) => ({...record, status: "Confirmed" as const, title: localized[index][0], description: localized[index][1]}));
}
