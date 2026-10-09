import type {Locale} from "@/config/site";

export type RecentVideoCopy = {title: string; answer: string; notes: readonly string[]; chapterTitles: readonly string[]};

// Full native caption tracks read on October 9. Monetary observations below belong
// to the recorded match; no client reproduction or hourly-income model is implied.
export const recentMatchCopy: Record<string, Record<Locale, RecentVideoCopy>> = {
  Qx1ndM1tc2Y: {
    en: {
      title: "WARDOGS FOB income: what RadioGLHF's 334k match actually earned",
      answer: "RadioGLHF reports 334k earned but just over 200k profit, then loses the match. The useful pattern is switching between supplies, construction, revives and confirmed artillery targets. Repeated drone failures, material shortages and the moving zone explain why copying the headline is not a money strategy.",
      chapterTitles: ["Deliver and deposit before counting income", "Protect the workers before expanding", "Three drones for one target", "Rescue, repair or push: choose the useful job", "Mechanical parts are a firing limit", "334k earned is not 334k profit"],
      notes: [
        "1:25 — The opening plan buys a truck and two pallets, delivers inside the control circle and puts the cargo into a FOB. The creator separates the first trip's vehicle cost from a second trip using the same surviving truck. Delivery and deposit are separate steps: arrange someone to unload before returning for more, and subtract lost cargo and replacement transport from your own ledger. His quoted prices describe this recording, not today's vendor. Two friends help in this match; this is not evidence for unattended solo income.",
        "8:05 — The author admits anti-air should have been built earlier: a pilot can kill the operator before destroying the weapon. Build protected working access and a way out before adding more drills. At 10:28 he notices people inside the FOB but outside the actual circle; walls do not make everyone count toward capture. Check the moving objective and keep a route from cover into it. Calling a Hot Zone also attracts artillery and attackers, so income infrastructure creates a defence obligation.",
        "12:16 — The first Stingray search finds the target late, then braking and a tight turn leave insufficient battery. A second launch follows the wrong vehicle and wastes more time. At 17:40 the third finally gets a kill, with the sequence reported as only about 350 net profit. Confirm a fresh artillery position before buying a shot, approach along its travel direction if it moves, and stop chasing when battery no longer allows a clean turn. At 28:48–29:25 teammates already carrying C4 are attacking the same target: coordinate before paying for a duplicate launch.",
        "18:26 — When there is no good artillery target, the author switches to actual casualties, construction and cover for his friend. His stadium push at 19:58–20:20 fails after leaving the FOB; the next return requires another kit and supplies. At 47:24 he distinguishes Medic XP from revives/healing and Support XP from building, while cash notifications can overlap. Record class progress separately from profit. Choose a rescue only when you can reach and protect the casualty; keeping armed teammates active matters more than repeatedly reviving someone under the same fire.",
        "39:39 — Ammunition for mortars, mechanical parts for Stingrays and fuel for drills compete for deliveries. With one shot left, he waits for confirmed artillery; at 42:53 the launcher cannot be used until a driver brings mechanical parts. Tell the supplier what is missing and how urgently it is needed. At 46:15 he warns against buying a drone and leaving it loaded: another player may fire it, or it can be forgotten while you repair. Buy when the target and operating window are ready, and switch jobs while supplies are unavailable.",
        "55:54 — The final explanation separates 334k total earned from a little over 200k profit. The author says drone purchases lower the green profit figure without adding to the red debt figure, so reading only one counter misleads. Driving, building and breaks were cut from the video; its 57-minute runtime is not a complete timed earnings test. The team still loses: some players remain outside the moving circle and others lack armour or a weapon when the FOB is breached. Compare your starting and ending cash, purchases, recoveries and match result across several similar rounds, rather than using this single headline as a promised return."
      ]
    },
    de: {
      title: "WARDOGS FOB-Einnahmen: Was RadioGLHFs 334k-Runde wirklich einbrachte",
      answer: "RadioGLHF nennt 334.000 Einnahmen, aber etwas über 200.000 Gewinn; das Team verliert trotzdem. Entscheidend ist der Wechsel zwischen Nachschub, Bau, Rettung und bestätigten Artilleriezielen. Fehlstarts, Materialmangel und die wandernde Zone gehören zur Rechnung.",
      chapterTitles: ["Lieferung und Einlagerung getrennt rechnen", "Arbeiter vor weiterer Expansion schützen", "Drei Drohnen für ein Ziel", "Retten, reparieren oder vorstoßen", "Mechanische Teile begrenzen den Beschuss", "334.000 Einnahmen sind nicht 334.000 Gewinn"],
      notes: [
        "1:25 — Zu Beginn kauft der Autor einen Lkw und zwei Paletten, liefert im Kontrollkreis ab und lagert die Fracht in einer FOB ein. Bei Fahrt zwei entfällt der erneute Fahrzeugkauf, solange der Lkw überlebt. Lieferung und Einlagerung sind verschiedene Schritte: Organisiere das Entladen, bevor du weitere Ladung holst. Ziehe verlorene Fracht und Ersatzfahrzeuge von deiner Bilanz ab. Die genannten Preise gelten für die Aufnahme; zwei Freunde helfen mit, es ist kein Beleg für unbeaufsichtigtes Solo-Einkommen.",
        "8:05 — Der Autor hätte die Flugabwehr früher bauen sollen: Ein Pilot kann den Bediener ausschalten, bevor die Anlage fällt. Sichere Arbeitswege und Ausgang vor weiteren Bohrern. Bei 10:28 stehen Spieler zwar innerhalb der FOB, aber außerhalb des eigentlichen Kreises. Prüfe das bewegliche Ziel und einen gedeckten Zugang dorthin. Eine gerufene Hot Zone zieht auch Artillerie und Angreifer an; Einkommensanlagen müssen verteidigt werden.",
        "12:16 — Die erste Stingray findet das Ziel spät; Bremsen und enge Kurve kosten die nötige Batterie. Die zweite verfolgt das falsche Fahrzeug. Erst die dritte trifft bei 17:40, laut Autor bleiben für diese Folge nur rund 350 Gewinn. Bestätige eine frische Artillerieposition vor dem Kauf. Nähere dich bewegten Zielen entlang ihrer Fahrtrichtung und brich die Jagd ab, wenn die Batterie keine saubere Wende erlaubt. Bei 28:48–29:25 greifen Freunde bereits mit C4 an: Eine weitere Drohne kann doppelte Kosten verursachen.",
        "18:26 — Fehlt ein gutes Artillerieziel, wechselt der Autor zu Verwundeten, Bau und Deckung für seinen Freund. Der Stadionvorstoß bei 19:58–20:20 scheitert; die Rückkehr kostet Ausrüstung und Nachschub. Bei 47:24 unterscheidet er Medic-XP durch Rettung/Heilung und Support-XP durch Bau, während Geldmeldungen überlappen. Notiere Klassenfortschritt getrennt vom Gewinn. Rette nur, wenn du den Verwundeten erreichen und schützen kannst; bewaffnete Mitspieler im Einsatz zu halten ist hilfreicher als Wiederbelebungen im gleichen Beschuss.",
        "39:39 — Mörsermunition, mechanische Teile für Stingrays und Bohrertreibstoff konkurrieren um Lieferungen. Mit einer Drohne übrig wartet der Autor auf bestätigte Artillerie. Bei 42:53 muss er auf neue Teile warten. Melde dem Fahrer konkret Material und Dringlichkeit. Bei 46:15 warnt er vor vorab gekauften, liegen gelassenen Drohnen: Andere können sie starten oder man vergisst sie beim Reparieren. Erst kaufen, wenn Ziel und Zeitfenster bereitstehen; während Material fehlt, eine andere Aufgabe übernehmen.",
        "55:54 — Die Schlussbilanz lautet 334.000 verdient und etwas über 200.000 Gewinn. Laut Autor senken Drohnenkäufe den grünen Gewinnzähler, ohne die rote Schuldzahl zu erhöhen. Nur einen Zähler zu lesen verfälscht die Bilanz. Fahrten, Bau und Pausen wurden gekürzt; 57 Minuten Video sind kein vollständiger Stundentest. Das Team verliert dennoch, weil Spieler außerhalb des wandernden Kreises stehen und bei der Erstürmung teils keine Rüstung oder Waffe haben. Vergleiche Start-/Endgeld, Käufe, Rückgewinnung und Matchausgang über mehrere ähnliche Runden."
      ]
    },
    ru: {
      title: "Доход FOB в WARDOGS: что осталось от 334 тысяч RadioGLHF",
      answer: "RadioGLHF называет 334 тысячи заработанного, но чуть больше 200 тысяч прибыли; матч команда проигрывает. Полезен выбор между снабжением, стройкой, помощью раненым и подтверждёнными целями. Ошибки дронов, нехватку деталей и движение зоны нельзя вычёркивать из расчёта.",
      chapterTitles: ["Доставка и склад — разные этапы", "Защитите рабочих до расширения", "Три дрона ради одной цели", "Спасать, ремонтировать или наступать", "Механические детали ограничивают огонь", "334 тысячи дохода не равны прибыли"],
      notes: [
        "1:25 — Автор начинает с грузовика и двух паллет: доставка внутрь контрольного круга, затем склад FOB. Во второй поездке стоимость машины не повторяется, пока она цела. Заранее договоритесь, кто разгрузит груз, прежде чем везти следующую партию. Потерянные паллеты и замену транспорта учитывайте как расходы. Цены относятся к записи, а помогают два друга: это не доказательство автономного заработка в одиночку.",
        "8:05 — Автор признаёт, что ПВО следовало построить раньше: пилот может убить оператора до уничтожения установки. Сначала защитите рабочий проход и выход, потом расширяйте буровые. В 10:28 люди стоят внутри FOB, но снаружи самого круга. Проверяйте перемещение цели и путь из укрытия в неё. Вызов Hot Zone привлекает артиллерию и штурмующих; доходная инфраструктура требует защиты.",
        "12:16 — Первая Stingray поздно находит цель и теряет батарею на торможении и тесном развороте. Вторая гонится за другой машиной. Только третья попадает в 17:40; автор оценивает прибыль всей этой серии примерно в 350. До покупки подтвердите свежее положение артиллерии. К движущейся цели заходите вдоль направления движения, а при недостатке батареи не продолжайте погоню. В 28:48–29:25 друзья уже атакуют ту же цель с C4: согласование экономит повторный запуск.",
        "18:26 — Без подходящей артиллерии автор помогает настоящим раненым, строит и прикрывает друга. Вылазка к стадиону в 19:58–20:20 заканчивается неудачей и повторной покупкой комплекта. В 47:24 он отделяет Medic XP за помощь от Support XP за стройку; денежные уведомления могут накладываться. Записывайте развитие класса отдельно от прибыли. Поднимайте бойца, когда можете добраться и защитить его; возвращение вооружённого союзника полезнее повторных подъёмов под тем же огнём.",
        "39:39 — Боеприпасы миномётов, детали Stingray и топливо буровых конкурируют за доставки. Последний дрон автор бережёт для подтверждённой артиллерии; в 42:53 приходится ждать водителя с деталями. Сообщайте конкретный дефицит и срочность. В 46:15 он предупреждает о заранее купленном дроне: его может запустить другой игрок, либо о покупке забудут во время ремонта. Покупайте под готовую цель и окно работы, а при нехватке материалов переключайтесь на другую задачу.",
        "55:54 — Итог: 334 тысячи заработанного и немногим более 200 тысяч прибыли. По объяснению автора, покупка дрона уменьшает зелёную прибыль, но не добавляется к красной задолженности. Один счётчик не даёт всей картины. Дорога, строительство и перерывы вырезаны; 57 минут ролика нельзя считать полным замером почасового дохода. Команда проигрывает: часть людей вне движущегося круга, другие без брони или оружия при прорыве FOB. Сравнивайте начальные и конечные деньги, покупки, возврат снаряжения и исход нескольких похожих матчей."
      ]
    },
    "pt-br": {
      title: "Renda de FOB em WARDOGS: quanto sobrou dos 334 mil de RadioGLHF",
      answer: "RadioGLHF relata 334 mil recebidos, mas pouco mais de 200 mil de lucro, e perde a partida. O valor está em alternar suprimentos, construção, resgates e alvos de artilharia confirmados. Drones perdidos, falta de peças e a zona móvel fazem parte da conta.",
      chapterTitles: ["Entregar e armazenar são etapas diferentes", "Proteger a equipe antes de ampliar", "Três drones para um alvo", "Resgatar, reparar ou avançar", "Peças mecânicas limitam os disparos", "334 mil recebidos não são 334 mil de lucro"],
      notes: [
        "1:25 — A abertura compra um caminhão e dois pallets, entrega dentro do círculo e deposita a carga no FOB. Na segunda viagem, não há nova compra do veículo se ele sobreviveu. Combine quem vai descarregar antes de buscar mais. Subtraia carga perdida e transporte de reposição do seu registro. Os preços citados pertencem à gravação; dois amigos ajudam, então não é prova de renda solo sem acompanhamento.",
        "8:05 — O autor admite que deveria ter montado a defesa antiaérea primeiro: o piloto pode matar o operador antes de destruir a arma. Garanta passagem protegida e saída antes de expandir as perfuradoras. Em 10:28 há jogadores dentro do FOB, mas fora do círculo real. Confira o movimento do objetivo e um caminho até ele. Chamar a Hot Zone também atrai artilharia e ataques; a estrutura de renda precisa de defesa.",
        "12:16 — O primeiro Stingray encontra o alvo tarde e perde bateria freando e fazendo uma curva apertada. O segundo persegue o veículo errado. Só o terceiro acerta em 17:40; o autor calcula cerca de 350 de lucro nessa sequência. Confirme uma posição atual antes de comprar o disparo. Aproxime-se na direção do deslocamento do alvo e interrompa a perseguição sem bateria para alinhar. Em 28:48–29:25 amigos já atacam o mesmo alvo com C4: coordene para evitar pagar um lançamento duplicado.",
        "18:26 — Sem boa artilharia para atacar, o autor cuida de feridos reais, constrói e cobre o amigo. A saída ao estádio em 19:58–20:20 falha; voltar exige equipamento e suprimentos novos. Em 47:24 ele distingue XP de Medic por resgate/cura e XP de Support por construção, enquanto notificações de dinheiro se sobrepõem. Registre progressão de classe separada do lucro. Resgate quando puder alcançar e proteger a pessoa; manter aliados armados ativos vale mais que reanimá-los repetidamente sob o mesmo fogo.",
        "39:39 — Munição de morteiro, peças do Stingray e combustível das perfuradoras disputam entregas. Com um disparo restante, ele espera artilharia confirmada; em 42:53 precisa aguardar o motorista com peças. Avise o material exato e a urgência. Em 46:15 alerta para não comprar um drone e deixá-lo carregado: outra pessoa pode disparar ou você pode esquecê-lo enquanto repara. Compre quando alvo e oportunidade estiverem prontos; mude de tarefa enquanto faltar material.",
        "55:54 — O fechamento separa 334 mil recebidos de pouco mais de 200 mil de lucro. Segundo o autor, comprar drones reduz o lucro verde sem aumentar a dívida vermelha; olhar apenas um contador engana. Trajetos, construção e pausas foram cortados, então 57 minutos de vídeo não medem uma hora completa de ganhos. A equipe perde: gente fora do círculo móvel e aliados sem proteção ou arma quando o FOB é invadido. Compare saldo inicial/final, compras, recuperação de equipamentos e resultado em várias partidas semelhantes."
      ]
    },
    ja: {
      title: "WARDOGS FOB金策：RadioGLHFの334kから実際に残った利益",
      answer: "RadioGLHFが示す334kは総収入で、利益は200k強。しかも試合には負けています。補給、建設、救助、確認済み砲兵への攻撃を切り替える判断が要点です。ドローンの失敗、資材切れ、動く占領円を含めて収支を読み解きます。",
      chapterTitles: ["配達と入庫を分けて収支をつける", "拡張前に作業員と移動経路を守る", "一つの目標にドローン三機を消費", "救助・修理・前進を状況で選ぶ", "機械部品がなければ発射できない", "334kの総収入と利益は別物"],
      notes: [
        "1:25 — 最初は輸送車とパレット2枚を購入し、占領円内へ運んでFOBに入庫します。作者は初回の車両購入費と、同じ車両が生き残った2往復目の費用を分けています。配達と入庫は別工程なので、次の荷を取りに戻る前に誰が荷下ろしするかを決めます。失った貨物や買い直した車両も帳簿から引いてください。紹介価格は収録時のもので、現在の店頭価格とは限りません。この試合には友人2人の協力もあり、一人で放置して得られる利益の証拠ではありません。",
        "8:05 — 作者は対空設備を先に作るべきだったと振り返ります。操作者が撃たれれば、武器自体が残っていても防衛できません。油井を増やす前に作業場所、出入口、退避先を確保します。10:28にはFOB内にいる人が占領円の外にいると気づきます。壁の内側なら自動的に占領へ貢献するわけではありません。動く目標まで遮蔽物から移れる経路を残し、Hot Zoneを呼ぶことで砲撃と攻撃側も集まる点を計画に含めます。",
        "12:16 — 最初のStingrayは目標の発見が遅れ、減速と急旋回で電池が不足します。2機目は別の車両を追って時間を失い、17:40に3機目でようやく撃破。作者の説明ではこの一連の純益は約350にとどまります。買う前に新しい砲兵位置を確認し、動く目標には進行方向に沿って進入します。戻すための電池が足りなければ追跡を打ち切りましょう。28:48–29:25には味方が同じ目標へC4で向かっており、重複発射を避ける連絡が必要になります。",
        "18:26 — 適した砲兵目標がないときは、負傷者の救助、建設、味方の援護へ切り替えています。19:58–20:20のスタジアムへの前進は失敗し、帰還には装備の買い直しと補給が必要でした。47:24では救助・回復によるMedic XPと建設によるSupport XPを区別しています。複数の現金通知が重なるので、クラス経験値と利益を別々に記録してください。救助地点へ安全に入れて、起こした相手を守れるかも判断します。同じ砲撃下で起こし続けるより、装備のある味方を戦線へ戻すことが目的です。",
        "39:39 — 迫撃砲の弾薬、Stingrayの機械部品、油井の燃料が輸送枠を取り合います。残り1発では確認済みの砲兵を待ち、42:53には部品がなく発射できず、運転手の補給を待っています。必要な資材と緊急度を具体的に伝えましょう。46:15には先に購入した機体を放置しないよう注意しています。修理中に別の人が発射したり、自分が買ったことを忘れたりするためです。目標と操作時間が確保できてから購入し、補給待ちの間は修理や救助に回ります。",
        "55:54 — 最後に作者は334kを総収入、200k強を利益として区別します。ドローン購入は赤い負債表示へ加算されず、緑の利益を減らすという説明なので、一方だけを見ると支出を見落とします。移動、建設、休憩は編集で省かれており、57分の映像をそのまま時給計算に使えません。さらにチームは敗北し、動く円の外にいた人や、突破時に防具・銃を持たない味方が問題になっています。自分の開始・終了残高、購入、装備回収、勝敗を同条件の数試合で比較し、この一度の大きな数字を収入保証にしないでください。"
      ]
    },
    "zh-cn": {
      title: "WARDOGS FOB赚钱复盘：RadioGLHF的334k到底剩多少",
      answer: "RadioGLHF报告的是334k总收入、略高于200k的净利润，而且最终输掉对局。值得学的是补给、建设、救援与确认炮兵目标之间的切换；无人机连败、机械件断供和人员没进移动圈，都要一起算进收益。",
      chapterTitles: ["交付与入库分开记账", "扩建之前先保护操作员", "三发无人机才换来一次击毁", "救人、修墙还是前推", "机械件决定能否继续发射", "334k收入并不等于334k净赚"],
      notes: [
        "1:25 — 开局方案是买运输车和两板物资，运进控制圈，再存入FOB。作者把首次买车成本与第二次沿用同一辆车的成本分开算；只有车和货都活着到达，第二趟才省下买车钱。交付与入库是两个环节，返程前先确认有人卸货，不能把扔在地上的货当作已经消耗。自己的账本要扣掉货损、车辆重购与路上耗时。视频所报价格属于录制现场，不能当作当前商店报价；这局还有两名朋友协作，也不能视作单人放置收益。",
        "8:05 — 作者承认应该更早建防空，因为飞行员可能先杀操作员，再处理武器。先把工作区、撤离口和补给通路保住，再增建油井。10:28时他发现很多人虽然在FOB里，却不在真正的占领圈内；墙内不等于圈内。跟着移动目标检查掩体到圈里的路线，否则基地越大，可能越多人安全地站错地方。召来Hot Zone也会招来炮击和冲锋，收益设施必须有人防守，不能只按持续施工时的通知估算回报。",
        "12:16 — 第一发Stingray很晚才发现目标，减速急转把电池耗掉；第二发追错车辆，继续浪费飞行时间。17:40第三发才击毁目标，作者说这一串操作净赚大约350。买弹前先确认新鲜炮兵位置，运动目标尽量沿其行进轴线接近；电量不足以重新摆正，就别继续追逐。28:48–29:25队友已经带C4攻击同一个目标，先沟通能避免重复投入。这里最有价值的是失败账单，不能把一次成功击毁的奖励当作每发都能拿到。",
        "18:26 — 没有合适炮兵目标时，作者转去救实际伤员、建造并掩护朋友。19:58–20:20离开FOB推进体育场失败，返场又需要装备和补给。47:24他把救援治疗得到的Medic XP与建设得到的Support XP分别说清；现金通知可能同时出现，职业经验和净利润要分栏记录。决定救谁时先看能否抵达、起身后是否有掩护与装备。让有武器的队友重新参战才有意义，不要把在同一片炮火里反复救起又倒地写成赚钱流程。",
        "39:39 — 迫击炮弹药、Stingray机械件和油井燃料在争抢补给。只剩一发时他决定等已确认的炮兵，42:53则因没有机械件完全停射，直到运输员送到货。向队友明确报缺什么、还剩多少次操作，不要只说需要补给。46:15他又提醒别先买无人机再放着修墙：其他人可能发射，也可能自己忘了买过。等目标和操作时间都具备再付款，断供时切去修复或救援，避免把稀缺资源浪费在无目的搜索里。",
        "55:54 — 结尾明确区分334k总收入与略高于200k净利润。按作者解释，买无人机会减少底部绿色利润，却不增加红色债务数字；只盯一个计数器会漏成本。驾驶、锤建和休息都被剪掉，所以57分钟成片不能直接换算时薪。最终队伍仍输了：有人没进入移动圈，基地被破时还有人没甲、没枪只拿锤子。复盘应同时记录期初期末现金、购买、回收和胜负，用同服同版本的数场对照，而不是承诺每场照做就有334k。"
      ]
    },
    "zh-tw": {
      title: "WARDOGS FOB賺錢復盤：RadioGLHF的334k究竟剩多少",
      answer: "RadioGLHF回報334k總收入、略高於200k的淨利，而且最後輸掉對局。值得學的是補給、建設、救援與確認砲兵目標之間的切換；無人機接連失敗、機械零件斷供，以及人員沒進移動圈，都必須算進收益。",
      chapterTitles: ["交付與入庫分開記帳", "擴建前先保護操作員", "三次無人機出擊才換來一次擊毀", "救人、修牆還是前推", "機械零件決定能否繼續發射", "334k收入不等於334k淨賺"],
      notes: [
        "1:25 — 開局先買運輸車和兩板物資，運入控制圈，再存進FOB。作者把首次買車與第二趟沿用同一輛車的成本分開計算；車和貨都安全抵達，第二趟才省下車款。交付與入庫是兩個環節，返程前先確認有人卸貨，別把放在地上的貨當成已經使用。自己的帳本要扣除貨損、車輛重購和路途耗時。影片價格屬於錄製當時，不是目前商店報價；這局還有兩位朋友協作，也不能當成單人放置收益。",
        "8:05 — 作者承認應該更早建防空，因為飛行員可能先殺操作員，再處理武器。先保住工作區、撤離口與補給通道，再增加油井。10:28他發現許多人雖然在FOB內，卻不在真正的占領圈裡；牆內不等於圈內。隨著目標移動檢查掩體到圈內的路線，否則基地越大，可能越多人安全地站錯地方。召來Hot Zone也會引來砲擊和進攻，收益設施需要防守，不能只靠持續施工時的通知推算回報。",
        "12:16 — 第一架Stingray很晚才找到目標，減速急轉耗掉電池；第二架追錯車輛，繼續浪費飛行時間。17:40第三次才成功擊毀，作者說這一連串操作淨賺大約350。購買前先確認新的砲兵位置，移動目標盡量沿行進方向接近；剩餘電量不足以重新對準，就別繼續追。28:48–29:25隊友已帶C4攻擊同一目標，先溝通才能避免重複投入。這段最有價值的是失敗成本，不能把成功一次的獎勵當成每次都拿得到。",
        "18:26 — 沒有合適砲兵目標時，作者轉去救傷員、建造與掩護朋友。19:58–20:20離開FOB推進體育場失敗，回場又需要裝備與補給。47:24他把救援治療的Medic XP和建設的Support XP分開說明；現金通知可能重疊，職業經驗與淨利應分欄記錄。決定救誰時先看能否抵達、起身後是否有掩護和裝備。讓持有武器的隊友重返戰線才有意義，別把在同一片砲火中反覆救起又倒下寫成賺錢流程。",
        "39:39 — 迫擊砲彈藥、Stingray機械零件與油井燃料爭用補給。只剩一發時他等確認過的砲兵，42:53因機械零件不足完全停射，直到運輸員送貨。向隊友明確報出缺哪種物資、還能操作幾次，別只說需要補給。46:15他提醒別預先買無人機後放著修牆：可能被別人發射，也可能自己忘了已經買過。目標和操作時間都具備再付款，斷供時轉去修復或救援，避免稀缺資源用在漫無目的的搜索。",
        "55:54 — 結尾明確區分334k總收入和略高於200k淨利。作者解釋買無人機會減少底部綠色利潤，卻不增加紅色債務數字；只看一個計數器會漏算支出。駕駛、施工與休息都經過剪輯，57分鐘成片不能直接換算時薪。隊伍最後仍輸了：有人不在移動圈裡，基地被突破時還有人沒甲、沒槍，只拿工具。復盤時記錄期初期末現金、購買、回收與勝敗，用同伺服器同版本的數局對照，別承諾每局照做都有334k。"
      ]
    },
    pl: {
      title: "Zarobek z FOB w WARDOGS: ile zostało z 334 tys. RadioGLHF",
      answer: "RadioGLHF podaje 334 tys. przychodu, lecz nieco ponad 200 tys. zysku, a mecz przegrywa. Ważne jest przełączanie się między dostawą, budową, ratowaniem i potwierdzoną artylerią. Stracone drony, brak części i ruch strefy należą do rachunku.",
      chapterTitles: ["Dostawa i magazyn to oddzielne etapy", "Ochrona obsługi przed rozbudową", "Trzy drony na jeden cel", "Ratować, naprawiać czy nacierać", "Części mechaniczne ograniczają ostrzał", "334 tys. przychodu to nie 334 tys. zysku"],
      notes: [
        "1:25 — Autor kupuje ciężarówkę i dwie palety, dostarcza je do okręgu i odkłada do FOB. Drugi kurs nie wymaga ponownego zakupu pojazdu, jeśli ten przetrwał. Dostawa i przyjęcie do magazynu są oddzielne: ustal, kto rozładuje, zanim ruszysz po więcej. Odejmuj utracony ładunek i pojazdy zastępcze. Ceny pochodzą z nagrania, a pomagają dwaj znajomi; nie jest to dowód biernego zarobku solo.",
        "8:05 — Autor przyznaje, że obronę przeciwlotniczą należało zbudować wcześniej: pilot może zabić operatora przed zniszczeniem broni. Zabezpiecz stanowisko i wyjście, zanim dodasz wiertnice. W 10:28 gracze stoją w FOB, ale poza właściwym okręgiem. Sprawdzaj ruch celu i drogę spod osłony. Przywołana Hot Zone ściąga artylerię i atakujących, więc infrastruktura dochodowa wymaga obrony.",
        "12:16 — Pierwszy Stingray późno odnajduje cel, a hamowanie i ciasny skręt zużywają baterię. Drugi ściga zły pojazd. Dopiero trzeci trafia w 17:40; autor podaje około 350 zysku z całej sekwencji. Przed zakupem potwierdź świeżą pozycję artylerii. Nadlatuj wzdłuż ruchu celu i przerwij pościg, jeśli brakuje baterii na ustawienie. W 28:48–29:25 znajomi już atakują ten sam cel C4, więc uzgodnienie działania oszczędza kolejny wystrzał.",
        "18:26 — Gdy brakuje dobrej artylerii do ataku, autor leczy prawdziwych rannych, buduje i osłania znajomego. Wypad na stadion w 19:58–20:20 kończy się stratą zestawu i ponownymi zakupami. W 47:24 rozróżnia XP Medica za ratowanie i leczenie oraz XP Support za budowę; komunikaty gotówkowe mogą się nakładać. Zapisuj postęp klasy osobno od zysku. Ratuj tam, gdzie możesz dotrzeć i osłonić gracza; uzbrojony sojusznik wracający do walki jest ważniejszy niż kolejne podnoszenie pod tym samym ogniem.",
        "39:39 — Amunicja moździerza, części Stingraya i paliwo wiertnic konkurują o dostawy. Ostatni strzał zostawia na potwierdzoną artylerię; w 42:53 czeka na kierowcę z częściami. Podaj konkretny brak i pilność. W 46:15 przestrzega przed kupnem drona na zapas: inny gracz może go odpalić albo zapomnisz o nim podczas napraw. Kupuj dopiero, gdy cel i czas na obsługę są gotowe; przy braku materiału zmień zadanie.",
        "55:54 — Bilans końcowy to 334 tys. przychodu i nieco ponad 200 tys. zysku. Według autora drony pomniejszają zielony zysk, lecz nie zwiększają czerwonego długu; jeden licznik nie pokazuje całości. Wycięto przejazdy, budowę i przerwy, więc 57 minut filmu nie mierzy zarobku godzinowego. Zespół przegrywa: część osób jest poza ruchomym okręgiem, inni bez pancerza lub broni przy przełamaniu FOB. Porównuj stan początkowy i końcowy, zakupy, odzysk oraz wynik kilku podobnych meczów."
      ]
    }
  },
  PhAVGZMIYCg: {
    en: {
      title: "WARDOGS offensive Support: Colvin's C4 unlock and FOB retake",
      answer: "Colvin turns building income into an offensive Support kit, but reaching Support Level 2 does not pay the separate remote-detonator unlock. His useful lessons are buying the complete kit, switching after failed RPG attacks, and preparing to hold a captured FOB instead of treating entry as victory.",
      chapterTitles: ["Level eligibility is not a paid unlock", "Close-range entry needs a recovery route", "Purchase the detonator before relying on C4", "Change the breach plan when RPGs fail", "Capture, hold and return are three jobs"],
      notes: [
        "0:29 — With only $182 reported at the start, Colvin buys a hammer and helps build around Tower 3. Building gives Support progress and cash; he reaches Level 2 but still needs money for the unlock leading to C4. Do not spend the whole balance on a shotgun because the class level looks sufficient. Check the vendor's eligibility, unlock fee and usable equipment separately, then keep enough for ammunition, medical supplies and a return kit. The recorded prices are examples, not a current price list.",
        "1:25 — The first attack on a respawn vehicle is inconclusive: Colvin wonders whether his improvised charge did anything. Later a helicopter delivers reinforcements and his shotgun attempt on the pilot fails; he dies and has to buy back in. Clear a close approach, fire from cover and leave room to heal or reload before the next push. The clip supplies neither a fixed charge count nor a shotgun one-shot range. A missed attack that leaves you outside the compound can cost the whole kit.",
        "5:53 — The actual purchase of the remote detonator comes later, despite the earlier class level. This is the difference between being eligible and carrying the equipment needed for the planned attack. Before departure, check the detonator and explosives together in the usable kit. The next match also shows an RPG helicopter hit that does not destroy the aircraft and subsequent misses. Do not budget a raid around a guaranteed one-shot kill; include enough reserve to withdraw, resupply or switch the objective.",
        "8:14 — Colvin identifies a FOB, tries RPG attacks and concludes that C4 would suit the breach better after two shots fail to open it. He dies outside, buys C4 and returns to find the compound upgraded. The target can change during a shopping trip, so inspect the wall and enemy activity again before spending another explosive. Entry at 9:29 succeeds with little resistance, but that is this encounter, not proof that every FOB needs the same charge count or can be taken alone.",
        "9:38 — Reinforcements land outside the captured base; sandbags obscure enemies, the main gate becomes dangerous and missed shots lead to another death. By 11:32 the enemy has retaken it. Colvin breaches again and says six C4 were probably unnecessary, which rules out using that amount as a tested requirement. Before taking a FOB, decide who watches the entrance, where to heal and reload, and how a dead teammate will return. Keep a reserve for the second fight. The final two wins and the earlier 105k claim are edited personal results, not a measured income or win-rate guarantee."
      ]
    },
    de: {
      title: "Offensiver Support in WARDOGS: Colvins C4-Freischaltung und FOB-Rückeroberung",
      answer: "Colvin finanziert seinen offensiven Support durch Bauarbeit. Support-Level 2 bezahlt aber noch keine separate Fernzünder-Freischaltung. Wichtig sind ein vollständiges Kit, ein neuer Plan nach gescheiterten RPG-Angriffen und die Verteidigung nach der Eroberung.",
      chapterTitles: ["Klassenstufe und bezahlte Freischaltung", "Nahkampfangriff mit Rückweg", "Fernzünder vor dem C4-Einsatz kaufen", "Nach RPG-Fehlschlägen den Plan ändern", "Erobern, halten und zurückkehren"],
      notes: [
        "0:29 — Mit gemeldeten 182 Dollar kauft Colvin einen Hammer und baut bei Tower 3. Er erhält Geld und Support-Fortschritt, erreicht Level 2 und braucht trotzdem noch Geld für den Zugang zu C4. Kaufe nicht für das ganze Guthaben eine Schrotflinte, nur weil die Klasse hoch genug ist. Prüfe Voraussetzung, Freischaltpreis und nutzbare Ausrüstung getrennt; Munition, Medizin und Ersatzkit brauchen ebenfalls Reserve. Die Aufnahme liefert keine aktuelle Preisliste.",
        "1:25 — Beim ersten Angriff auf ein Respawn-Fahrzeug ist unklar, ob die improvisierte Ladung etwas bewirkt. Später bringt ein Helikopter Verstärkung; der Schuss auf den Piloten scheitert und Colvin muss nach dem Tod neu einkaufen. Wähle einen gedeckten Nahzugang und Platz für Heilung oder Nachladen. Daraus folgt weder eine feste Sprengladungszahl noch eine garantierte Schrotflintenreichweite. Ein Fehlversuch vor der Mauer kann das ganze Kit kosten.",
        "5:53 — Erst jetzt kauft Colvin den Fernzünder, obwohl er die erforderliche Stufe zuvor erreicht hat. Berechtigung ist nicht dasselbe wie einsatzbereite Ausrüstung. Prüfe vor dem Abmarsch Zünder und Sprengstoff zusammen. Im nächsten Match zerstört ein RPG-Treffer den Helikopter nicht, weitere Schüsse verfehlen. Kalkuliere deshalb keinen garantierten Abschuss mit einer Rakete; behalte Spielraum für Rückzug, Nachschub oder ein anderes Ziel.",
        "8:14 — Colvin findet eine FOB und bevorzugt C4, nachdem zwei RPG-Schüsse keinen Eingang öffnen. Er stirbt davor, kauft C4 und findet bei der Rückkehr einen ausgebauten Stützpunkt vor. Ein Ziel verändert sich während des Einkaufs: Prüfe Mauer und Gegner erneut. Der Einstieg bei 9:29 gelingt fast ohne Gegenwehr, belegt aber weder eine feste Ladungszahl noch die sichere Solo-Einnahme jeder FOB.",
        "9:38 — Verstärkung landet draußen, Sandsäcke nehmen die Sicht und das Haupttor wird gefährlich. Nach Fehlschüssen stirbt Colvin; bei 11:32 ist die Basis zurückerobert. Beim nächsten Durchbruch nennt er sechs C4 selbst wahrscheinlich unnötig. Plane vor der Einnahme Torwache, Platz zum Heilen/Nachladen und den Rückweg nach einem Tod. Geld für den zweiten Kampf zurückhalten. Die zwei Siege und die frühere 105k-Angabe sind geschnittene persönliche Ergebnisse, keine gemessene Gewinn- oder Siegrate."
      ]
    },
    ru: {
      title: "Атакующий Support в WARDOGS: доступ к C4 и возврат FOB у Colvin",
      answer: "Colvin оплачивает атакующий комплект строительством, но Support 2 не заменяет отдельную покупку доступа к дистанционному детонатору. Полезны проверка полного комплекта, смена плана после неудачных RPG и подготовка обороны уже захваченного FOB.",
      chapterTitles: ["Уровень класса не оплачивает открытие", "Для ближнего штурма нужен путь назад", "Купите детонатор до расчёта на C4", "Меняйте план после неудачных RPG", "Захват, удержание и возвращение"],
      notes: [
        "0:29 — Автор сообщает о 182 долларах, покупает молоток и помогает строить у Tower 3. Так он получает деньги и Support XP, достигает второго уровня, но ещё копит на открытие доступа к C4. Не тратьте весь остаток на дробовик только потому, что уровень подходит. Отдельно проверьте требование класса, платное открытие и готовое снаряжение; оставьте деньги на патроны, медицину и повторный выход. Цены записи не являются текущим прайсом.",
        "1:25 — Первый взрыв у машины возрождения не даёт ясного результата: Colvin сам сомневается, сделал ли заряд что-нибудь. Позже вертолёт привозит подкрепление, попытка застрелить пилота срывается, а смерть требует новых покупок. Выбирайте близкий подход с укрытием и место для лечения или перезарядки. Здесь нет проверенного числа зарядов или дальности гарантированного убийства дробовиком. Неудача снаружи стены может стоить всего комплекта.",
        "5:53 — Только теперь куплен дистанционный детонатор, хотя уровень был получен раньше. Право покупки и готовность к штурму — разные вещи. До выхода проверьте детонатор вместе со взрывчаткой. В следующем матче попадание RPG не уничтожает вертолёт, последующие выстрелы мимо. Не стройте бюджет на гарантии одной ракеты: сохраните возможность отступить, пополниться или сменить цель.",
        "8:14 — После двух RPG, не открывших проход, Colvin решает применить C4. Он погибает снаружи, покупает взрывчатку и возвращается к уже улучшенной базе. За время закупки цель меняется; снова осмотрите стены и активность противника. Вход в 9:29 проходит почти без сопротивления, но не доказывает универсальное число зарядов или возможность взять любой FOB одному.",
        "9:38 — Снаружи садится подкрепление, мешки с песком мешают обзору, главные ворота становятся опасны. Промахи заканчиваются смертью; в 11:32 враг уже вернул базу. При повторном прорыве автор сам считает шесть C4 излишними, поэтому это не проверенный норматив. Заранее назначьте наблюдение за входом, место лечения/перезарядки и путь возвращения погибшего. Оставьте резерв на второй бой. Две победы и ранняя цифра 105k — личные результаты монтажа, а не измеренный доход или шанс победы."
      ]
    },
    "pt-br": {
      title: "Support ofensivo em WARDOGS: o C4 e a retomada de FOB de Colvin",
      answer: "Colvin financia um kit ofensivo construindo, mas Support nível 2 não paga o desbloqueio separado do detonador remoto. As lições são sair com o conjunto completo, mudar de plano após RPGs falharem e preparar a defesa depois de tomar o FOB.",
      chapterTitles: ["Nível de classe não paga o desbloqueio", "Entrada curta precisa de saída", "Compre o detonador antes de depender do C4", "Mude o ataque quando os RPGs falham", "Capturar, segurar e retornar"],
      notes: [
        "0:29 — Com 182 dólares relatados, Colvin compra um martelo e ajuda a construir em Tower 3. Ganha dinheiro e progresso de Support, chega ao nível 2, mas ainda precisa pagar o acesso ao C4. Não gaste tudo na espingarda só porque a classe já permite a compra. Confira requisito, taxa de desbloqueio e equipamento utilizável separadamente; reserve munição, remédios e um kit de retorno. Os preços da gravação não são uma tabela atual.",
        "1:25 — O primeiro ataque ao veículo de respawn é inconclusivo: ele não sabe se a carga improvisada fez efeito. Depois um helicóptero traz reforços, a tentativa contra o piloto falha e ele morre, precisando comprar novamente. Prepare aproximação curta com cobertura e espaço para curar ou recarregar. O trecho não mede quantidade fixa de cargas nem alcance de morte com um tiro. Falhar do lado de fora pode custar todo o kit.",
        "5:53 — Só agora ele compra o detonador remoto, apesar de já ter o nível. Estar habilitado é diferente de carregar as ferramentas do ataque. Confira detonador e explosivos juntos antes de sair. Na partida seguinte, um RPG acerta o helicóptero sem destruí-lo e outros disparos erram. Não planeje o custo da incursão contando com uma única peça: deixe reserva para retirar, reabastecer ou mudar de alvo.",
        "8:14 — Dois RPGs não abrem a entrada do FOB e Colvin prefere C4. Ele morre fora, compra explosivos e volta a uma base já melhorada. O alvo muda durante a compra: examine de novo a parede e a presença inimiga antes de gastar outra carga. A entrada de 9:29 tem pouca resistência, mas não demonstra quantidade universal de explosivos nem captura solo garantida.",
        "9:38 — Reforços pousam fora, sacos de areia escondem inimigos e o portão principal fica perigoso. Erros de tiro causam outra morte; em 11:32 o inimigo já retomou a base. Ao invadir novamente, o autor diz que seis C4 provavelmente foram desnecessários, então não use isso como requisito testado. Combine vigilância da entrada, local de cura/recarga e retorno após morrer. Guarde dinheiro para a segunda luta. As duas vitórias e a cifra anterior de 105k são resultados pessoais editados, não uma taxa medida de renda ou vitória."
      ]
    },
    ja: {
      title: "WARDOGS 攻めるSupport：ColvinのC4解放とFOB奪還を読む",
      answer: "建設で資金を作り、攻撃用のSupport装備へ移る記録です。ただしSupportレベル2に到達しても、遠隔起爆装置の有料解放は別。装備一式をそろえる判断、RPG失敗後の変更、奪ったFOBを守り直す準備までが実戦の要点です。",
      chapterTitles: ["クラス条件と有料解放を分ける", "近距離で入る前に回復経路を残す", "C4を使う前に起爆装置を確認する", "RPGで突破できなければ計画を変える", "奪取・維持・再入場は別の仕事"],
      notes: [
        "0:29 — 開始時の所持金は作者の申告で182ドル。ハンマーを買い、Tower 3付近の建設に加わります。建設で現金とSupportの進行を得てレベル2になっても、C4につながる解放費用はまだ足りません。クラスの数字だけを見て残金をショットガンへ使い切ると、目的の装備が買えないままです。店頭のクラス条件、有料解放、実際に持ち出す道具を分けて確認し、弾薬、医療品、再出撃用の予備費も残します。動画中の金額は収録時の例であり、現在の価格表ではありません。",
        "1:25 — 最初に復活車両へ仕掛けた即席爆薬は、作者自身が効果を確認できていません。その後はヘリから増援が到着し、パイロットをショットガンで倒す試みも失敗、死亡して装備を買い直します。接近経路を短くするだけでなく、遮蔽物から撃てるか、装填と回復をどこで行うかを先に決めましょう。爆薬が一つなら十分、特定距離なら一撃という試験ではありません。塀の外で攻撃が失敗すると装備一式を失うため、突入後より前段階の生存経路が重要です。",
        "5:53 — 遠隔起爆装置を実際に購入するのはこの場面です。前の章で条件となるレベルに到達していても、解放料を払い、必要な物を携行するまでは攻撃準備が終わっていません。出発前に起爆装置と爆薬が一組で使える状態か確認します。次の試合ではRPGがヘリに当たっても撃墜できず、その後の弾も外れます。一発で必ず壊せる前提の予算は組まず、退却、補給、別目標への変更ができる余裕を残してください。命中回数だけで車両耐久を逆算する材料にもなりません。",
        "8:14 — FOBを見つけてRPGで攻撃しますが、二発で入口を開けられずC4の方が向くと判断します。外で倒され、C4を買って戻ると、その間に敵基地が強化されていました。買い物に戻った時間は相手にもあるため、前回の壁や敵配置を前提に同じ攻撃を繰り返さず、現場を見直します。9:29の突入は抵抗が少ない状況で成功しています。これは当該場面の結果で、全FOBが同じ爆薬数で開く、いつでも単独制圧できるという根拠ではありません。",
        "9:38 — 奪取後には外へ増援ヘリが着陸し、砂袋で敵を見失い、正門付近が危険になります。撃ち損じて再び倒され、11:32には敵がFOBを取り返しています。再突入では作者自身がC4六個は不要だったかもしれないと話すため、六個を必要量として固定しないでください。入る前から入口の監視役、回復・装填場所、倒れた味方の復帰手段を決め、二度目の戦いに使える資金を残します。最後の二連勝や途中の105kという自己申告は編集された個人結果であり、測定済みの勝率や利益保証ではありません。"
      ]
    },
    "zh-cn": {
      title: "WARDOGS进攻型Support：Colvin的C4解锁与FOB争夺",
      answer: "Colvin先靠建设筹钱，再转进攻型Support；但Support二级不等于已经付费解锁遥控引爆器。真正有用的是出发前配齐工具、RPG失效后调整破点方案，以及占下FOB后如何守住和重新进入。",
      chapterTitles: ["职业等级不等于付清解锁费用", "近身突入也要留恢复路线", "依赖C4之前先确认引爆器", "RPG没破点就重新选择手段", "占领、守住与重返是三件事"],
      notes: [
        "0:29 — 作者报告开局只剩182现金，先买锤子，在Tower 3附近帮忙建造。施工同时积累Support经验与现金，到了二级仍要攒钱完成通向C4的解锁。不要看到职业等级够了，就把剩余现金全部花在霰弹枪上；等级资格、一次性解锁费用、实际携带的器材是三道检查。留出弹药、医疗用品以及死亡后再进场的一套钱，才不会拿着枪到了前线才发现破点工具缺失。视频金额属于当时记录，不是本站给出的现价清单。",
        "1:25 — 第一次攻击重生车时，作者自己也不确定临时炸药有没有效果。后来直升机运来增援，尝试用霰弹枪打飞行员失败，他死亡后需要重新买装备。近战路线不能只考虑怎样冲到脸上，还要有开火掩体、装填窗口和治疗位置。这个片段没有证明固定炸药用量，也没有测出霰弹枪的必杀距离。外墙前一次没打成，损失可能是整套装备；因此先确认撤回掩体的路径，再决定是否继续压上。",
        "5:53 — 真正买到遥控引爆器出现在这一刻，明显晚于前面达到职业等级。具备资格与携带了能用的爆破组合不是一回事，离开商店前应一起核对引爆器和炸药，而不是只看C4名称。下一局还出现RPG命中直升机却未摧毁、后续弹药打空的情况。不要按一发必杀去做袭击预算，留下撤退、补货或换目标的空间。这些命中镜头也没有完整目标状态，不能反推固定车体耐久或推荐精确发数。",
        "8:14 — 发现FOB后先尝试RPG，两发没有打开突破口，作者转而认为C4更合适。他死在外面，买C4再来时发现敌方基地已经升级。返场采购也给了对方加固的时间，所以再次进攻要重看墙体与人员活动，不能照上一条路线机械重复。9:29以很小阻力成功进入，仅代表这个时点的防守空缺，不证明所有FOB都能单人照抄，也不能据此给出通用爆破用量。",
        "9:38 — 占领后外面仍有增援落地，沙袋让作者看不清敌人，正门成为危险方向，失误射击后再次死亡；11:32敌方已经夺回FOB。第二次破入时他自己说六个C4可能没必要，因此不能把六个包装成验证后的标准答案。出手前就安排谁看入口、哪里治疗装填、队友死亡怎样回来，并留下第二场战斗的资金。结尾两连胜与中途105k自述都来自剪辑后的个人经历，不是实测胜率或净收益承诺。"
      ]
    },
    "zh-tw": {
      title: "WARDOGS進攻型Support：Colvin的C4解鎖與FOB爭奪",
      answer: "Colvin先靠建設籌錢，再轉進攻型Support；但Support二級不等於付清遙控引爆器的解鎖費。真正實用的是出發前備齊工具、RPG無效後改變突破方式，以及占下FOB後如何守住與重新進入。",
      chapterTitles: ["職業等級不等於付清解鎖費", "近身突入也要留恢復路線", "依賴C4前先確認引爆器", "RPG沒破點就重新選擇手段", "占領、守住與重返是三件事"],
      notes: [
        "0:29 — 作者回報開局只剩182現金，先買槌子，在Tower 3附近幫忙建造。施工累積Support經驗與現金，升到二級仍須存錢完成通往C4的解鎖。別看到職業等級足夠，就把剩下的錢全花在霰彈槍上；等級資格、一次性解鎖費與實際攜帶的工具是三項檢查。留出彈藥、醫療用品和死亡後再次進場的一套預備金，避免到前線才發現破點器材不齊。影片金額是當時紀錄，不是本站提供的目前售價表。",
        "1:25 — 首次攻擊重生車時，作者自己不確定臨時炸藥是否有效。之後直升機載來增援，他嘗試用霰彈槍打飛行員卻失敗，死亡後又得買裝備。近戰路線不能只想著怎麼衝到面前，還要有射擊掩體、裝填時機和治療位置。這段沒有證明固定炸藥用量，也沒測出霰彈槍的必殺距離。外牆前一次失敗可能賠掉整套裝備，因此先確認撤回掩體的路徑，再決定是否繼續推進。",
        "5:53 — 實際買到遙控引爆器是在這裡，晚於先前達到職業等級。取得資格與帶著可用的爆破組合是兩回事，離開商店前一起核對引爆器和炸藥，別只看C4名稱。下一局還有RPG命中直升機卻未擊毀，以及後續射擊落空。不要按一發必殺規劃突襲預算，留下撤退、補貨或更換目標的空間。這些命中片段也缺乏完整目標狀態，不能反推固定車體耐久或推薦精確發數。",
        "8:14 — 發現FOB後先用RPG，兩發沒開出突破口，作者改認為C4較合適。他在外面陣亡，買C4回來時基地已經升級。回場採購也給了對手加固的時間，因此再次進攻要重新看牆體與人員活動，不能照上一條路機械重複。9:29在抵抗很少的情況下成功進入，只代表當下防守空缺，不是所有FOB都能單人照做的保證，也無法推導通用爆破需求。",
        "9:38 — 占領後外面仍有增援落地，沙袋讓作者看不清敵人，正門成了危險方向，射擊失誤後又死亡；11:32敵方已奪回FOB。第二次突破時他自己說六個C4可能沒必要，不能把六個當成驗證完成的標準答案。進攻前就決定誰看入口、哪裡治療裝填、隊友陣亡後如何返回，並保留第二場戰鬥的資金。最後兩連勝和中途105k自述都是剪輯後的個人經歷，不是實測勝率或淨利保證。"
      ]
    },
    pl: {
      title: "Ofensywny Support w WARDOGS: C4 i odzyskiwanie FOB u Colvina",
      answer: "Colvin finansuje ofensywny zestaw budowaniem, ale Support poziomu 2 nie opłaca osobnego odblokowania zdalnego detonatora. Warto przejąć sprawdzenie całego zestawu, zmianę planu po nieudanych RPG i przygotowanie obrony po zdobyciu FOB.",
      chapterTitles: ["Poziom klasy nie opłaca odblokowania", "Bliski szturm potrzebuje drogi odwrotu", "Sprawdź detonator przed użyciem C4", "Zmień plan, gdy RPG nie robi przejścia", "Zdobyć, utrzymać i wrócić"],
      notes: [
        "0:29 — Autor podaje stan 182 dolarów, kupuje młotek i buduje przy Tower 3. Zyskuje gotówkę oraz postęp Support, dochodzi do poziomu 2, lecz nadal zbiera na dostęp do C4. Nie wydawaj całego salda na strzelbę tylko dlatego, że klasa jest wystarczająca. Sprawdź osobno wymaganie, płatne odblokowanie i gotowy sprzęt. Zachowaj zapas na amunicję, medykamenty i ponowne wejście. Ceny z nagrania nie są aktualnym cennikiem.",
        "1:25 — Pierwszy atak na pojazd odrodzenia jest niejednoznaczny: Colvin nie wie, czy prowizoryczny ładunek coś zrobił. Później śmigłowiec przywozi wsparcie, próba trafienia pilota się nie udaje i śmierć wymusza ponowne zakupy. Zaplanuj krótkie podejście z osłoną oraz miejsce na leczenie i przeładowanie. To nie pomiar liczby ładunków ani zasięgu pewnego zabicia strzelbą. Nieudany atak przed murem może kosztować cały zestaw.",
        "5:53 — Dopiero tutaj kupuje zdalny detonator, mimo wcześniejszego osiągnięcia poziomu. Uprawnienie nie oznacza gotowości do ataku. Sprawdź detonator razem z materiałem wybuchowym przed wyjściem. W następnym meczu RPG trafia śmigłowiec bez zniszczenia, kolejne pociski chybiają. Nie licz budżetu na gwarantowane zniszczenie jednym strzałem; zostaw środki na odwrót, uzupełnienie albo nowy cel.",
        "8:14 — Dwa RPG nie otwierają FOB, więc autor wybiera C4. Ginie na zewnątrz, kupuje ładunki i wraca do bazy, którą zdążono ulepszyć. Cel zmienia się podczas zakupów: ponownie oceń ściany i przeciwników. Wejście w 9:29 udaje się prawie bez oporu, ale nie dowodzi stałej liczby ładunków ani możliwości zdobycia każdej bazy solo.",
        "9:38 — Na zewnątrz lądują posiłki, worki z piaskiem zasłaniają wrogów, a główna brama robi się niebezpieczna. Pudła kończą się śmiercią; w 11:32 przeciwnik już odzyskał FOB. Przy kolejnym wejściu autor sam uważa sześć C4 za prawdopodobnie zbędne, więc nie jest to sprawdzony wymóg. Przed atakiem ustal obserwację wejścia, leczenie i powrót poległego. Zostaw rezerwę na drugi bój. Dwa zwycięstwa oraz wcześniejsze 105k to osobiste wyniki montażu, nie zmierzony dochód ani gwarancja wygranej."
      ]
    }
  }
};
