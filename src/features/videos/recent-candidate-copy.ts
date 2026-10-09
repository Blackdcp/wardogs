import type {Locale} from "@/config/site";

// These are caption-based case notes, not claims that the complete footage was watched.
// Shacknews reading ranges are stated per recording; Nalerian's full caption track was read.
const ids = ["NC7nsS8qKBM", "PNfh95Ua4-M", "-4QpcApA6SY", "MI_aXSfoQws"];
const copy: Record<Locale, readonly string[]> = {
  en: [
    "Full captions, 0:01–8:11: Nalerian's team must recover its FOB before building anti-air (2:10–3:23). At 4:21 he forgets the Talon's manual reload; at 4:38 a sniper forces him off the weapon. The anti-air is gone again by 5:30. Secure the operator, reload after firing and keep a retreat path; one successful interception does not make the base safe. His 11k kit deficit is one player's loss, not a standard defence cost.",
    "Captions read 1:26–43:21 of the 1:52:55 stream. At 5:23 the Recon player returns to HQ for a forgotten spotter. At 30:15 a rescue fails because there is no revive item; at 39:15 rebuying the previous loadout apparently omitted a parachute. Check those three items before transport. Marks and line of sight separate at 41:26–42:50 as enemies move, so update the callout and reposition instead of assuming the old mark is still a firing solution.",
    "Captions read 1:23–26:33 of the 1:49:57 stream. At 17:43 cargo sits unused: delivery and unpacking into the FOB are separate. At 23:19 the pilot asks for ammunition type and box count before stocking a crate. The 25:49 crane drop misses, and incoming fire makes recovery difficult. Agree on demand, a safe drop point and an unloader before purchasing; do not count unsold ammunition or an inaccessible crate as revenue.",
    "Captions read 1:31–31:51 of the 1:57:14 stream. At 8:54 the pilot abandons a pickup because of gunfire. From 21:56 the squad responds to rockets near HQ by deploying infantry away from the suspected position and sharing approximate marks. At 29:06 they discover two enemies, and by 31:31 the casualty says his kit has been stripped. Reassess both the enemy count and what a rescue can recover; a map mark is not current visual contact."
  ],
  de: [
    "Vollständige Untertitel 0:01–8:11 gelesen: Vor dem Flugabwehrbau muss das Team die FOB zurückholen (2:10–3:23). Bei 4:21 vergisst Nalerian das manuelle Talon-Nachladen; bei 4:38 zwingt ihn ein Scharfschütze vom Gerät. Bis 5:30 ist die Abwehr wieder zerstört. Bediener schützen, nachladen und Rückweg offenhalten; ein Abschuss macht die Basis nicht sicher. Das 11k-Defizit ist sein Einzelfall, kein Standardpreis.",
    "Untertitel 1:26–43:21 des 1:52:55-Streams gelesen. Bei 5:23 fehlt das Aufklärungsgerät, bei 30:15 scheitert eine Rettung ohne Wiederbelebungsgegenstand und bei 39:15 fehlt nach dem Kit-Rückkauf offenbar der Fallschirm. Diese drei Dinge vor dem Transport prüfen. In 41:26–42:50 bewegen sich Gegner aus der Sicht; Meldung aktualisieren und verlegen, statt eine alte Markierung als aktuelle Schusslösung zu behandeln.",
    "Untertitel 1:23–26:33 des 1:49:57-Streams gelesen. Bei 17:43 bleibt Fracht ungenutzt: Abliefern und Einlagern sind getrennt. Bei 23:19 fragt der Pilot Munitionstyp und Menge vor dem Einkauf ab. Der Kranabwurf bei 25:49 verfehlt das Ziel, Feindfeuer erschwert die Bergung. Bedarf, sicheren Abwurf und Entlader vorher vereinbaren; unverkaufte Munition und unerreichbare Kisten nicht als Einnahme zählen.",
    "Untertitel 1:31–31:51 des 1:57:14-Streams gelesen. Bei 8:54 bricht der Pilot wegen Beschuss eine Abholung ab. Ab 21:56 setzt der Trupp Infanterie abseits einer vermuteten Raketenstellung nahe HQ ab und teilt ungefähre Marker. Bei 29:06 sind es zwei Feinde; bei 31:31 meldet der Gefallene geplünderte Ausrüstung. Gegnerzahl und Rettungswert neu bewerten; ein Kartenmarker ist kein aktueller Sichtkontakt."
  ],
  ru: [
    "Все субтитры 0:01–8:11 прочитаны: перед постройкой ПВО отряду приходится вернуть FOB (2:10–3:23). В 4:21 Nalerian забывает перезарядить Talon вручную, в 4:38 снайпер вынуждает покинуть установку. К 5:30 ПВО снова уничтожено. Защитите оператора, перезаряжайтесь и оставьте путь отхода; один сбитый вертолёт не обеспечивает безопасность. Дефицит 11k относится к его комплекту, а не ко всем оборонительным выходам.",
    "Прочитаны субтитры 1:26–43:21 из 1:52:55. В 5:23 разведчик возвращается за забытым прибором; в 30:15 не хватает предмета для подъёма, в 39:15 после повторной покупки комплекта, по словам игрока, нет парашюта. Проверьте эти три вещи до посадки в транспорт. В 41:26–42:50 враги уходят из видимости: обновляйте сообщение и позицию, не считайте старую отметку готовым решением для выстрела.",
    "Прочитаны субтитры 1:23–26:33 из 1:49:57. В 17:43 груз лежит без дела: доставка не заменяет приём в склад FOB. В 23:19 пилот уточняет калибр и число коробок до закупки. Сброс на кран в 25:49 не попадает на место, а огонь мешает забрать груз. До покупки согласуйте спрос, безопасную точку и разгрузку; непроданные патроны и недоступный ящик ещё не доход.",
    "Прочитаны субтитры 1:31–31:51 из 1:57:14. В 8:54 пилот отменяет подбор из-за огня. С 21:56 отряд реагирует на ракеты у HQ: высаживается в стороне от предполагаемой позиции и передаёт приблизительные отметки. В 29:06 обнаруживаются два противника; к 31:31 погибший сообщает о полностью снятом комплекте. Заново оцените число врагов и ценность спасения; метка на карте не равна зрительному контакту."
  ],
  "pt-br": [
    "Legendas completas lidas, 0:01–8:11: a equipe precisa recuperar o FOB antes de montar defesa aérea (2:10–3:23). Em 4:21 Nalerian esquece a recarga manual do Talon; em 4:38 um sniper o força a sair. Em 5:30 a defesa já foi destruída de novo. Proteja o operador, recarregue e mantenha uma rota de saída; uma interceptação não torna a base segura. O prejuízo de 11k é daquele kit, não um custo padrão.",
    "Legendas lidas de 1:26–43:21 da transmissão de 1:52:55. Em 5:23 falta o equipamento de observação; em 30:15 um resgate falha sem item de reanimação; em 39:15 a recompra do kit aparentemente não trouxe paraquedas. Confira os três antes do transporte. Em 41:26–42:50 os alvos se movem para fora da visão: atualize a chamada e reposicione, em vez de confiar na marca anterior para atirar.",
    "Legendas lidas de 1:23–26:33 da transmissão de 1:49:57. Em 17:43 a carga fica parada: entregar e guardar no FOB são etapas diferentes. Em 23:19 o piloto pergunta calibre e quantidade antes de comprar. A carga lançada ao guindaste em 25:49 cai fora, e o fogo dificulta buscá-la. Combine demanda, local seguro e quem descarrega; munição sem comprador ou caixa inacessível ainda não é receita.",
    "Legendas lidas de 1:31–31:51 da transmissão de 1:57:14. Em 8:54 o piloto abandona a coleta sob tiros. A partir de 21:56 o grupo responde a foguetes perto do HQ, desembarcando longe da posição suspeita e compartilhando marcas aproximadas. Em 29:06 aparecem dois inimigos; em 31:31 o caído diz que levaram seu kit. Reavalie ameaça e valor do resgate; marca no mapa não é contato visual atual."
  ],
  ja: [
    "字幕全編0:01–8:11を確認。2:10–3:23では対空設備を作る前にFOBを取り返す必要があります。4:21でTalonの手動装填を忘れ、4:38には狙撃手のため砲座を離れます。5:30には対空設備が再び全滅。操作者の遮蔽、発射後の装填、退避路を一組で考え、一度の撃墜で基地が安全になったと思わないこと。装備の11k赤字は本人の事例で、標準費用ではありません。",
    "1:52:55の配信のうち字幕1:26–43:21を確認。5:23で観測装備を忘れてHQへ戻り、30:15では蘇生アイテム不足で救助できず、39:15では前の装備を買い直してもパラシュートがなかったと話します。搭乗前に三点を現物確認。41:26–42:50では敵の移動でマークと視線がずれるため、報告を更新し、以前の印をそのまま射撃目標にしないでください。",
    "1:49:57の配信のうち字幕1:23–26:33を確認。17:43では荷物を落としても誰も入庫せず、配達とFOBへの収納が別だと分かります。23:19では弾種と箱数を聞いてから購入。25:49のクレーンへの投下は外れ、敵の射撃で回収しにくくなります。需要、安全な受取場所、荷下ろし担当を決めてから仕入れ、売れていない弾薬や届かない箱を収益に数えないこと。",
    "1:57:14の配信のうち字幕1:31–31:51を確認。8:54では銃撃を理由に迎えを中止。21:56以降、HQ近くのロケット攻撃へ対処するため、推定位置から離れた場所に歩兵を降ろし、おおよその位置を共有します。29:06では敵が二人と判明、31:31には倒れた人の装備が奪われています。敵の数と救助で取り戻せる物を再評価し、地図マークを現在の目視確認と混同しないでください。"
  ],
  "zh-cn": [
    "已读完整字幕0:01–8:11：2:10–3:23先要夺回FOB，才有条件建防空。4:21作者忘记Talon须手动装填，4:38又因狙击手被迫离开炮位；5:30防空再次被毁。把操作员掩护、发射后装填和撤离路径一起准备，不要认为击落一架就安全了。11k装备亏损是作者这一条命的记录，不是防守的统一成本。",
    "已读1:52:55直播的1:26–43:21字幕。5:23忘带观测装备被迫回HQ，30:15没有复活道具救不了人，39:15作者说重买上一套装备后仍没降落伞。上车前检查这三件实物，别只相信配装名称。41:26–42:50敌人移动后标记和视线分离，应更新报点并换位，旧标记不是现成射击答案。",
    "已读1:49:57直播的1:23–26:33字幕。17:43货落地却无人入库，交付与FOB入库分属两步；23:19先问具体弹种和箱数再采购。25:49想投到起重机却落偏，敌火又让回收变困难。先确认需求、安全收货点与卸货人，再买货；尚未卖出的子弹和够不到的箱子不能算作收入。",
    "已读1:57:14直播的1:31–31:51字幕。8:54听见交火后取消接人；21:56起应对HQ附近火箭伏击，先远离猜测位置放下步兵，再共享大致标记。29:06发现敌人其实有两个，31:31伤员表示装备已被拿空。重新评估敌人数和救援能保住什么，地图标记不等于当前目视确认。"
  ],
  "zh-tw": [
    "已讀完整字幕0:01–8:11：2:10–3:23得先奪回FOB，才有條件建防空。4:21作者忘記Talon須手動裝填，4:38又因狙擊手被迫離開砲位；5:30防空再度被毀。把操作員掩護、射擊後裝填與撤離路徑一起準備，別以為擊落一架就安全了。11k裝備虧損是作者這次出擊的紀錄，不是防守的統一成本。",
    "已讀1:52:55直播的1:26–43:21字幕。5:23忘帶觀測裝備被迫回HQ，30:15缺少復活道具無法救人，39:15作者說重買上一套裝備後仍沒有降落傘。搭車前確認這三件實物，別只相信配裝名稱。41:26–42:50敵人移動後標記與視線分離，應更新報點並換位，舊標記不是現成射擊解答。",
    "已讀1:49:57直播的1:23–26:33字幕。17:43貨物落地卻無人入庫，交付與FOB入庫是兩步；23:19先問彈種和箱數再採購。25:49想投到起重機卻落偏，敵火又讓回收困難。先確認需求、安全收貨點和卸貨人，再買貨；尚未售出的子彈與拿不到的箱子不能算成收入。",
    "已讀1:57:14直播的1:31–31:51字幕。8:54聽到交火便取消接人；21:56起應對HQ附近火箭伏擊，先在遠離推測位置的地方放下步兵，再分享大致標記。29:06發現敵人其實有兩個，31:31傷員表示裝備已被拿光。重新評估敵人人數與救援能保住什麼，地圖標記不等於當前目視確認。"
  ],
  pl: [
    "Przeczytano całe napisy 0:01–8:11. Zanim powstaje obrona przeciwlotnicza, zespół musi odzyskać FOB (2:10–3:23). W 4:21 Nalerian zapomina ręcznie przeładować Talona; w 4:38 snajper zmusza go do zejścia. Do 5:30 obrona znów jest zniszczona. Osłona operatora, przeładowanie i odwrót są jednym planem; pojedyncze strącenie nie zapewnia bezpieczeństwa. Strata 11k dotyczy jego zestawu, nie standardowego kosztu.",
    "Przeczytano napisy 1:26–43:21 z transmisji 1:52:55. W 5:23 gracz wraca po zapomniany sprzęt obserwacyjny; w 30:15 brakuje przedmiotu do reanimacji; w 39:15 po odkupieniu zestawu podobno nie ma spadochronu. Sprawdź te trzy rzeczy przed transportem. W 41:26–42:50 cele zmieniają pozycję i znikają z widoku: aktualizuj meldunek i przemieść się, zamiast celować według starego znacznika.",
    "Przeczytano napisy 1:23–26:33 z transmisji 1:49:57. W 17:43 dostarczony ładunek czeka bez rozładunku do FOB. W 23:19 pilot pyta o rodzaj amunicji i liczbę pudełek przed zakupem. Zrzut na dźwig w 25:49 chybia, a ostrzał utrudnia odbiór. Ustal popyt, bezpieczne miejsce i osobę rozładowującą; niesprzedana amunicja i niedostępna skrzynia nie są przychodem.",
    "Przeczytano napisy 1:31–31:51 z transmisji 1:57:14. W 8:54 pilot rezygnuje z odbioru pod ogniem. Od 21:56 oddział reaguje na rakiety koło HQ: wysadza piechotę z dala od podejrzanej pozycji i podaje przybliżone znaczniki. W 29:06 okazuje się, że wrogów jest dwóch; w 31:31 poległy zgłasza ograbienie zestawu. Oceń ponownie zagrożenie i wartość ratunku; znacznik mapy nie oznacza aktualnego kontaktu wzrokowego."
  ]
};
const labels: Record<Locale, readonly (readonly string[])[]> = {
  en: [["Recover the FOB", "Reload and protect the operator", "Replace lost defence"], ["Check observation equipment", "Bring a revive item", "Check the rebought kit"], ["Delivery versus deposit", "Order the right ammunition", "Reachable cargo matters"], ["Abort the pickup", "Deploy away from the threat", "Reassess the rescue"]],
  de: [["FOB zurückerobern", "Nachladen und Bediener schützen", "Verlorene Abwehr ersetzen"], ["Aufklärungsgerät prüfen", "Rettungsmittel mitnehmen", "Rückkauf kontrollieren"], ["Liefern oder einlagern", "Passende Munition bestellen", "Erreichbare Fracht"], ["Abholung abbrechen", "Abseits der Gefahr absetzen", "Rettung neu bewerten"]],
  ru: [["Вернуть FOB", "Перезарядить и защитить оператора", "Восстановить ПВО"], ["Проверить прибор", "Взять предмет для подъёма", "Проверить повторный комплект"], ["Доставить или принять на склад", "Заказать нужные патроны", "Доступность груза"], ["Отменить подбор", "Высадить в стороне от угрозы", "Переоценить спасение"]],
  "pt-br": [["Recuperar o FOB", "Recarregar e proteger o operador", "Repor a defesa perdida"], ["Conferir observação", "Levar reanimação", "Conferir a recompra"], ["Entrega e depósito", "Pedir a munição certa", "Carga acessível"], ["Cancelar a coleta", "Desembarcar longe da ameaça", "Reavaliar o resgate"]],
  ja: [["FOBを取り返す", "装填と操作者の保護", "失った対空設備"], ["観測装備を確認", "蘇生アイテムを持つ", "買い直した装備の確認"], ["配達と入庫の違い", "必要な弾薬を注文", "回収できる荷物"], ["迎えを中止", "脅威から離れて降ろす", "救助の価値を見直す"]],
  "zh-cn": [["先夺回FOB", "装填与操作员保护", "防空再次被毁"], ["检查观测装备", "携带救援道具", "重购后检查实物"], ["交付不等于入库", "先问弹种和数量", "货物要能安全拾取"], ["取消危险接人", "远离伏击点下客", "重新评估救援"]],
  "zh-tw": [["先奪回FOB", "裝填與操作員保護", "防空再次被毀"], ["檢查觀測裝備", "攜帶救援道具", "重購後檢查實物"], ["交付不等於入庫", "先問彈種和數量", "貨物要能安全拾取"], ["取消危險接人", "遠離伏擊點下客", "重新評估救援"]],
  pl: [["Odzyskać FOB", "Przeładować i osłonić operatora", "Odbudować obronę"], ["Sprawdzić obserwację", "Zabrać reanimację", "Sprawdzić odkupiony zestaw"], ["Dostawa a magazyn", "Zamówić właściwą amunicję", "Dostęp do ładunku"], ["Przerwać odbiór", "Wysadzić z dala od zagrożenia", "Ponownie ocenić ratunek"]]
};
export function getRecentCandidateCopy(locale: Locale, youtubeId: string) {
  const index = ids.indexOf(youtubeId);
  return index < 0 ? undefined : copy[locale][index];
}
export function getRecentCandidateChapterLabel(locale: Locale, youtubeId: string, index: number) {
  const sourceIndex = ids.indexOf(youtubeId);
  return sourceIndex < 0 ? undefined : labels[locale][sourceIndex]?.[index];
}
