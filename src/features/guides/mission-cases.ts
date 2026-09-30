import type {Locale} from "@/config/site";
import {calculateSupplyPlan, type SupplyPlan} from "@/features/tools/workflow-state";
import {encodeLogisticsPlanState} from "@/features/tools/share-state";

export type MissionKind = "cargo" | "fob";
type StageCopy = readonly [title: string, owner: string, action: string, pass: string, failure: string];
type CaseCopy = {title: string; brief: string; stages: readonly StageCopy[]};
type MissionCopy = {
  assumption: string; action: string; pass: string; failure: string; observations: string;
  missing: string; calculation: string; demand: string; stock: string; capacity: string; remaining: string; trips: string;
  units: string; planner: string; source: string; basis: string; cargo: CaseCopy; fob: CaseCopy;
};

const copy: Record<Locale, MissionCopy> = {
  en: {
    assumption: "Hypothetical squad operation, not a recorded match or official mission. The roles and order are editorial choices; adapt them to the live interface and squad size.",
    action: "Action", pass: "Pass evidence", failure: "Failure / recovery", observations: "Missing field observations",
    missing: "No client build, before/after stock capture, measured capacity, journey time, cash payout or XP delta is supplied for this case. Completion and profit are not claimed. Record the build, resource unit, departure/receipt times, stock before/after, losses and separate cash/XP changes during your own run; concurrent spending can obscure the stock delta.",
    calculation: "Assumed planning units only, not official supply units, vehicle capacity or rewards. No construction recipe is inferred. Remaining demand = demand − stock; trips round up remaining ÷ assumed capacity. Recompute after losses, spending or a changed request.",
    demand: "Assumed demand", stock: "Assumed stock", capacity: "Assumed units per trip", remaining: "Remaining", trips: "Planned trips", units: "Custom planning units", planner: "Open this assumed supply plan", source: "Official systems reference", basis: "Steam confirms logistics, vehicles and FOB construction. The sequence below is an editorial scenario, not an official task script or proof of current transfer controls.",
    cargo: {title: "Case: deliver one requested resource to a FOB", brief: "A receiver requests one resource; a driver, escort and receiver complete the delivery loop. Do not mix resource units or count nearby cargo as received stock.", stages: [
      ["Brief and request", "Receiver + squad lead", "Agree the resource, destination, unmet demand and abort condition before buying.", "Receiver confirms the live resource label, stock and priority.", "Wrong or already stocked resource: cancel or change the request before loading."],
      ["Load and check", "Driver + loader", "Check vehicle and container compatibility in the live interface; confirm the actual loaded manifest and leave an exit.", "Cargo appears in the vehicle manifest and the squad can depart.", "Rejected container or missing load: change vehicle/container; do not assume a particular truck capacity."],
      ["Approach", "Driver + escort", "Agree primary and fallback routes; escort checks the receiving approach while the receiver keeps unloading space clear.", "Squad reports a usable approach and a return route.", "Ambush or blocked road: halt outside fire, reroute or abort; update surviving cargo, not the original manifest."],
      ["Transfer", "Driver + receiver", "Stop at the live accepted receiving location; follow its current prompts and transfer the requested resource.", "Receiving interface acknowledges the transfer; compare the named resource stock.", "Drop without receipt: check position, permission and resource type; protect remaining cargo and do not count the drop as delivery."],
      ["Reconcile", "Receiver + squad lead", "Compare stock before/after and concurrent use; tell the builders what is actually available.", "Receipt and stock change are reconciled with spending or consumption.", "No clear increase: keep delivery unconfirmed; record build and message, then resolve the mismatch before another purchase."],
      ["Return and repeat", "Driver + escort", "Leave the receiving route clear, report losses and ask for the next unmet request before returning.", "Vehicle/team recover safely or losses are recorded; the next run uses updated demand.", "Route compromised or objective moved: stop repeat runs and choose a new destination; do not assume refunds or profit."],
    ]},
    fob: {title: "Case: establish a minimal, supplied FOB", brief: "A lead, builder, driver and defender establish only the services the current objective needs. A placed foundation, a supplied base and usable spawn support are separate acceptance states.", stages: [
      ["Choose the job and site", "Squad lead + scout", "Name the objective, required service, approach and withdrawal route; inspect terrain and exposure.", "The team agrees why the position matters and how deliveries enter and leave.", "Objective moved or approach exposed: relocate or cancel before committing purchases."],
      ["Check gates and placement", "Builder", "Read the live item, tool, role/Career gate, unlock fee and vendor cost separately; test a valid preview.", "The correct tool and item are available and the placement preview accepts the intended ground.", "Invalid terrain, overlap, limit or missing gate: record the rejection and resolve that cause; supplies cannot bypass an unlock."],
      ["Request and receive supplies", "Builder + driver + receiver", "Request the exact resource, check the loaded manifest and use a protected receiving lane.", "Transfer is acknowledged and usable stock is visible for the next build.", "Wrong resource or no receipt: pause building, reconcile delivery and reroute; do not count a nearby pallet as stock."],
      ["Build the minimum service", "Builder + defender", "Complete the accepted core/service first; keep delivery and turning space open. Add defenses only for the named threat.", "Required service is built and usable; the intended vehicle can enter and leave.", "Blocked access or insufficient stock: remove the obstruction or revise the resource request before expanding."],
      ["Verify spawn separately", "Squad lead + spawn operator", "Check the live spawn interface and any separate asset requirements; test an eligible teammate rather than inferring spawn from the FOB icon.", "A teammate can actually use the intended spawn under its displayed conditions.", "Unavailable spawn: distinguish deployment, eligibility and cooldown from stock or access; keep spawn unconfirmed until tested."],
      ["Defend, resupply or withdraw", "Defender + lead + driver", "Cover the approach and key assets, request replacements from actual consumption and reassess objective relevance.", "Supply access and useful services remain operational; consumption and losses inform the next run.", "Core/route lost or objective irrelevant: stop expansion, recover mobile assets if safe and report losses; no guaranteed recovery/refund."],
    ]},
  },
  ru: {
    assumption: "Условная операция отряда, не запись матча и не официальная миссия. Роли и порядок выбраны редакцией; адаптируйте их к интерфейсу и размеру отряда.",
    action: "Действие", pass: "Признак выполнения", failure: "Сбой / восстановление", observations: "Недостающие наблюдения",
    missing: "Для случая нет номера сборки, снимков запасов до/после, измеренной вместимости, времени рейса, выплаты денег или изменения XP. Выполнение и прибыль не заявлены. В своём рейсе запишите сборку, единицу ресурса, время отправления/приёмки, запасы, потери и деньги/XP отдельно; расходование одновременно с доставкой искажает разницу запасов.",
    calculation: "Только условные плановые единицы, не официальные ресурсы, вместимость или награда. Рецепт строительства не выводится. Остаток = потребность − запас; рейсы = округление вверх остатка ÷ условная вместимость. После потерь или расходования пересчитайте.",
    demand: "Условная потребность", stock: "Условный запас", capacity: "Условные единицы за рейс", remaining: "Остаток", trips: "Плановые рейсы", units: "Условные плановые единицы", planner: "Открыть условный план снабжения", source: "Официальное описание систем", basis: "Steam подтверждает логистику, транспорт и строительство FOB. Последовательность ниже — редакционный сценарий, не официальный скрипт и не подтверждение нынешних кнопок передачи.",
    cargo: {title: "Пример: доставка одного ресурса на FOB", brief: "Получатель запрашивает ресурс; водитель, охрана и получатель завершают доставку. Не смешивайте единицы и не считайте груз рядом с базой принятым запасом.", stages: [
      ["Заявка", "Получатель + командир", "Согласуйте ресурс, место, дефицит и условие отмены до покупки.", "Получатель подтверждает название ресурса, запас и приоритет в игре.", "Неверный ресурс или полный запас: отмените либо измените заявку до загрузки."],
      ["Загрузка", "Водитель + грузчик", "Проверьте совместимость машины и контейнера в интерфейсе, фактический груз и выезд.", "Груз виден в списке машины, отряд может выехать.", "Контейнер отклонён или груз отсутствует: смените машину/контейнер; не предполагайте вместимость грузовика."],
      ["Подход", "Водитель + охрана", "Определите основной и запасной маршруты; охрана проверяет подход, получатель освобождает разгрузку.", "Отряд подтверждает проезд и обратный путь.", "Засада или блокировка: остановитесь вне огня, смените маршрут либо отмените рейс; обновите список уцелевшего груза."],
      ["Передача", "Водитель + получатель", "Остановитесь в допустимой зоне приёмки и выполните текущие подсказки передачи нужного ресурса.", "Интерфейс подтверждает приём; сопоставьте запас нужного ресурса.", "Груз сброшен без приёмки: проверьте место, права и тип; защитите остаток и не объявляйте доставку выполненной."],
      ["Сверка", "Получатель + командир", "Сопоставьте запас до/после с одновременным расходом; сообщите строителям доступное количество.", "Приёмка и изменение запаса согласованы с расходованием.", "Изменение неясно: оставьте доставку неподтверждённой, запишите сборку/сообщение и выясните причину до новой покупки."],
      ["Возврат", "Водитель + охрана", "Освободите подъезд, сообщите потери и запросите следующий дефицит перед возвратом.", "Транспорт/отряд возвращаются или потери записаны; следующий рейс основан на новой заявке.", "Путь потерян или цель сместилась: прекратите повторные рейсы, выберите новое место; возврат денег и прибыль не гарантированы."],
    ]},
    fob: {title: "Пример: минимальная снабжаемая FOB", brief: "Командир, строитель, водитель и защитник создают только нужные текущей цели службы. Размещённое основание, снабжение и доступное возрождение проверяются отдельно.", stages: [
      ["Задача и место", "Командир + разведчик", "Определите цель, службу, подъезд и отход; проверьте рельеф и открытость.", "Отряд понимает пользу позиции и путь доставки туда и обратно.", "Цель сместилась или подъезд простреливается: перенесите либо отмените стройку до покупок."],
      ["Требования и размещение", "Строитель", "Раздельно проверьте предмет, инструмент, уровень роли/карьеры, плату открытия и цену продавца; проверьте предпросмотр.", "Нужные предмет и инструмент доступны, земля допускает размещение.", "Рельеф, пересечение, лимит или уровень: запишите отказ и устраните конкретную причину; запас не заменяет открытие."],
      ["Приём снабжения", "Строитель + водитель + получатель", "Закажите точный ресурс, проверьте груз и защищённый подъезд.", "Передача принята, доступный запас виден для стройки.", "Неверный ресурс или нет приёмки: приостановите стройку, сверьте доставку; лежащий рядом поддон не считается запасом."],
      ["Минимальная служба", "Строитель + защитник", "Завершите нужное ядро/службу, оставьте проезд и разворот; добавляйте защиту под конкретную угрозу.", "Нужная служба работает, выбранная машина въезжает и выезжает.", "Проезд закрыт или запас мал: уберите препятствие либо измените заявку до расширения."],
      ["Проверка возрождения", "Командир + оператор возрождения", "Проверьте интерфейс и отдельные активы возрождения на подходящем товарище, не по значку FOB.", "Товарищ реально использует нужное возрождение при указанных условиях.", "Возрождение недоступно: разделите развёртывание, право и задержку, запас и доступ; не подтверждайте без теста."],
      ["Защита или отход", "Защитник + командир + водитель", "Прикройте подход и ключевые активы, пополняйте по расходу и пересматривайте пользу позиции.", "Доставка и нужные службы работают; расход и потери учтены в следующем рейсе.", "Ядро/маршрут потеряны или цель неактуальна: прекратите расширение, безопасно вывезите мобильные активы; компенсация не гарантирована."],
    ]},
  },
  de: {
    assumption: "Angenommene Truppoperation, kein aufgezeichnetes Match und keine offizielle Mission. Rollen und Reihenfolge sind redaktionelle Entscheidungen; an Oberfläche und Truppgröße anpassen.",
    action: "Aktion", pass: "Erfolgsnachweis", failure: "Fehler / Wiederherstellung", observations: "Fehlende Feldbeobachtungen",
    missing: "Für diesen Fall fehlen Client-Build, Bestandsbilder vorher/nachher, gemessene Kapazität, Fahrzeit, Cash-Auszahlung und XP-Differenz. Abschluss und Gewinn werden nicht behauptet. Im eigenen Lauf Build, Ressourceneinheit, Abfahrt/Annahme, Bestände, Verluste und Cash/XP getrennt protokollieren; gleichzeitiger Verbrauch kann Bestandsänderungen verdecken.",
    calculation: "Nur angenommene Planungseinheiten, keine offiziellen Ressourcen, Fahrzeugkapazitäten oder Belohnungen. Daraus folgt kein Baurezept. Restbedarf = Bedarf − Bestand; Fahrten = aufgerundeter Restbedarf ÷ angenommene Kapazität. Nach Verlusten oder Verbrauch neu rechnen.",
    demand: "Angenommener Bedarf", stock: "Angenommener Bestand", capacity: "Angenommene Einheiten je Fahrt", remaining: "Restbedarf", trips: "Geplante Fahrten", units: "Eigene Planungseinheiten", planner: "Angenommenen Versorgungsplan öffnen", source: "Offizielle Systembeschreibung", basis: "Steam bestätigt Logistik, Fahrzeuge und FOB-Bau. Die folgende Abfolge ist ein redaktionelles Szenario, kein offizieller Auftrag oder Nachweis aktueller Übergabesteuerung.",
    cargo: {title: "Fall: eine angeforderte Ressource zur FOB liefern", brief: "Empfänger, Fahrer und Eskorte schließen einen Versorgungsauftrag ab. Ressourceneinheiten nicht mischen; nahe Fracht ist noch kein angenommener Bestand.", stages: [
      ["Auftrag", "Empfänger + Truppführung", "Ressource, Ziel, Fehlbedarf und Abbruchbedingung vor dem Kauf vereinbaren.", "Empfänger bestätigt aktuelle Bezeichnung, Bestand und Priorität.", "Falsche Ressource oder voller Bestand: Auftrag vor dem Laden ändern oder stoppen."],
      ["Beladen", "Fahrer + Verlader", "Fahrzeug-/Behälterkompatibilität aktuell prüfen; tatsächliche Ladung bestätigen und Ausfahrt freihalten.", "Fracht steht im Fahrzeugmanifest; Abfahrt ist möglich.", "Behälter abgelehnt oder Ladung fehlt: Fahrzeug/Behälter wechseln; keine feste Lkw-Kapazität annehmen."],
      ["Anfahrt", "Fahrer + Eskorte", "Haupt- und Ausweichroute festlegen; Eskorte prüft den Zugang, Empfänger hält die Entladung frei.", "Trupp bestätigt nutzbare Zufahrt und Rückweg.", "Hinterhalt oder Sperre: außerhalb des Feuers halten, umfahren oder abbrechen; verbliebene Ladung neu erfassen."],
      ["Übergabe", "Fahrer + Empfänger", "An akzeptierter Annahmestelle halten und den aktuellen Hinweisen zur Ressourcenübergabe folgen.", "Annahme wird bestätigt; Bestand der benannten Ressource vergleichen.", "Abwurf ohne Annahme: Standort, Rechte und Typ prüfen; Rest schützen und Lieferung nicht als abgeschlossen zählen."],
      ["Abgleich", "Empfänger + Truppführung", "Vorher-/Nachherbestand mit gleichzeitigem Verbrauch abgleichen und Bauende über verfügbare Menge informieren.", "Annahme und Bestandsänderung passen zum Verbrauch.", "Keine klare Änderung: Lieferung unbestätigt lassen, Build/Meldung notieren und vor erneutem Kauf klären."],
      ["Rückkehr", "Fahrer + Eskorte", "Zufahrt freigeben, Verluste melden und vor der Rückfahrt den nächsten Fehlbedarf erfragen.", "Fahrzeug/Team kehren zurück oder Verluste sind erfasst; nächste Fahrt nutzt den neuen Auftrag.", "Route gefährdet oder Ziel verlegt: Wiederholungsfahrten stoppen und neues Ziel wählen; kein zugesicherter Gewinn oder Ersatz."],
    ]},
    fob: {title: "Fall: eine minimale versorgte FOB errichten", brief: "Führung, Bauende, Fahrer und Verteidiger bauen nur die aktuell benötigten Dienste. Platzierte Grundlage, versorgte Basis und nutzbarer Spawn sind getrennte Prüfzustände.", stages: [
      ["Aufgabe und Standort", "Truppführung + Aufklärung", "Ziel, nötigen Dienst, Zugang und Rückzug benennen; Gelände und Exposition prüfen.", "Team versteht den Nutzen und den Lieferweg hinein und hinaus.", "Ziel verschoben oder Zufahrt offen: vor Käufen verlegen oder abbrechen."],
      ["Freischaltung und Platzierung", "Bauende", "Gegenstand, Werkzeug, Rollen-/Karrierestufe, Freischaltgebühr und Händlerpreis getrennt prüfen; Vorschau testen.", "Werkzeug und Gegenstand verfügbar; Vorschau akzeptiert den Boden.", "Gelände, Überlappung, Grenze oder fehlende Stufe: Ablehnung notieren und Ursache lösen; Vorräte ersetzen keine Freischaltung."],
      ["Nachschub annehmen", "Bauende + Fahrer + Empfänger", "Genaue Ressource anfordern, Ladung prüfen und geschützte Annahmespur nutzen.", "Übergabe bestätigt; nutzbarer Bestand für den Bau sichtbar.", "Falscher Typ oder keine Annahme: Bau pausieren, Lieferung abgleichen; nahe Palette nicht als Bestand zählen."],
      ["Minimalen Dienst bauen", "Bauende + Verteidiger", "Kern/Dienst zuerst fertigstellen; Entladung und Wendefläche offen halten. Abwehr nur für konkrete Bedrohungen ergänzen.", "Nötiger Dienst funktioniert; vorgesehenes Fahrzeug fährt hinein und hinaus.", "Zugang blockiert oder Vorrat fehlt: Hindernis entfernen oder Auftrag ändern, bevor erweitert wird."],
      ["Spawn separat prüfen", "Truppführung + Spawn-Bediener", "Aktuelles Spawn-Menü und gesonderte Anforderungen mit berechtigtem Teammitglied testen, nicht vom FOB-Symbol ableiten.", "Teammitglied nutzt den vorgesehenen Spawn unter angezeigten Bedingungen.", "Spawn fehlt: Aufstellung, Berechtigung und Abklingzeit von Vorrat/Zugang trennen; bis zum Test unbestätigt lassen."],
      ["Verteidigen oder abziehen", "Verteidiger + Führung + Fahrer", "Zufahrt und wichtige Anlagen decken, nach Verbrauch nachliefern und Zielnutzen neu bewerten.", "Versorgungszugang und nötige Dienste funktionieren; Verbrauch/Verluste bestimmen die nächste Fahrt.", "Kern/Route verloren oder Ziel unwichtig: Ausbau stoppen, mobile Mittel sicher bergen und Verluste melden; keine garantierte Erstattung."],
    ]},
  },
  "pt-br": {
    assumption: "Operação hipotética de esquadrão, não partida registrada nem missão oficial. Funções e ordem são escolhas editoriais; adapte ao cliente e ao tamanho do grupo.",
    action: "Ação", pass: "Evidência de conclusão", failure: "Falha / recuperação", observations: "Observações de campo ausentes",
    missing: "Não há build do cliente, capturas de estoque antes/depois, capacidade medida, tempo de viagem, pagamento ou variação de XP deste caso. Não alegamos conclusão ou lucro. Registre build, unidade do recurso, horários de saída/recebimento, estoques, perdas e dinheiro/XP separados; consumo simultâneo pode ocultar a diferença de estoque.",
    calculation: "Somente unidades hipotéticas de planejamento, não recursos oficiais, capacidade de veículo ou recompensas. Nenhuma receita de construção é inferida. Saldo = demanda − estoque; viagens = saldo ÷ capacidade hipotética, arredondado para cima. Recalcule após perdas ou consumo.",
    demand: "Demanda hipotética", stock: "Estoque hipotético", capacity: "Unidades hipotéticas por viagem", remaining: "Saldo necessário", trips: "Viagens planejadas", units: "Unidades próprias de planejamento", planner: "Abrir este plano hipotético", source: "Referência oficial dos sistemas", basis: "Steam confirma logística, veículos e construção de FOB. A sequência abaixo é um cenário editorial, não roteiro oficial nem prova dos comandos atuais de transferência.",
    cargo: {title: "Caso: entregar um recurso solicitado à FOB", brief: "Recebedor, motorista e escolta fecham um pedido de suprimento. Não misture unidades nem considere carga próxima como estoque recebido.", stages: [
      ["Pedido", "Recebedor + líder", "Combine recurso, destino, déficit e condição de cancelamento antes da compra.", "Recebedor confirma nome atual do recurso, estoque e prioridade.", "Recurso errado ou estoque cheio: cancele ou altere o pedido antes de carregar."],
      ["Carga", "Motorista + carregador", "Confira compatibilidade de veículo/contêiner no cliente, carga efetiva e saída livre.", "Carga aparece no manifesto do veículo e o grupo pode sair.", "Contêiner rejeitado ou carga ausente: troque veículo/contêiner; não suponha capacidade fixa do caminhão."],
      ["Aproximação", "Motorista + escolta", "Defina rota principal e alternativa; escolta verifica acesso e recebedor libera descarga.", "Grupo confirma aproximação utilizável e caminho de volta.", "Emboscada ou bloqueio: pare fora do fogo, desvie ou cancele; atualize a carga sobrevivente."],
      ["Transferência", "Motorista + recebedor", "Pare no ponto aceito e siga os comandos atuais para transferir o recurso solicitado.", "Interface reconhece recebimento; compare o estoque do recurso correto.", "Soltou sem recibo: confira posição, permissão e tipo; proteja o restante e não conte como entrega."],
      ["Conciliação", "Recebedor + líder", "Compare antes/depois com consumo simultâneo e informe aos construtores a quantidade disponível.", "Recebimento e variação do estoque correspondem ao consumo.", "Aumento incerto: deixe a entrega não confirmada, registre build/mensagem e resolva antes de comprar de novo."],
      ["Retorno", "Motorista + escolta", "Libere acesso, informe perdas e peça o próximo déficit antes de voltar.", "Veículo/grupo voltam ou perdas são registradas; próxima viagem usa demanda atualizada.", "Rota comprometida ou objetivo mudou: interrompa repetições e escolha outro destino; sem promessa de reembolso ou lucro."],
    ]},
    fob: {title: "Caso: montar uma FOB mínima abastecida", brief: "Líder, construtor, motorista e defensor montam somente os serviços úteis ao objetivo atual. Fundação colocada, base abastecida e ponto de renascimento utilizável são estados separados.", stages: [
      ["Tarefa e local", "Líder + batedor", "Defina objetivo, serviço, acesso e retirada; inspecione terreno e exposição.", "Equipe entende a utilidade e como entregas entram e saem.", "Objetivo mudou ou acesso exposto: mude local ou cancele antes das compras."],
      ["Requisitos e colocação", "Construtor", "Confira item, ferramenta, nível de função/carreira, taxa de desbloqueio e preço de vendedor separadamente; teste prévia.", "Item/ferramenta disponíveis e prévia aceita o terreno.", "Terreno, sobreposição, limite ou requisito: registre rejeição e resolva a causa; suprimentos não substituem desbloqueio."],
      ["Receber suprimentos", "Construtor + motorista + recebedor", "Peça recurso exato, confira manifesto e use corredor protegido de recebimento.", "Transferência reconhecida e estoque utilizável visível para construir.", "Recurso errado ou sem recibo: pause construção e concilie; pallet próximo não é estoque recebido."],
      ["Serviço mínimo", "Construtor + defensor", "Termine núcleo/serviço primeiro; mantenha descarga e manobra livres. Acrescente defesa para ameaça definida.", "Serviço necessário funciona e veículo previsto entra e sai.", "Acesso bloqueado ou estoque insuficiente: remova obstáculo ou revise pedido antes de expandir."],
      ["Testar renascimento", "Líder + operador de renascimento", "Teste interface e requisitos de ativos separados com colega elegível; não deduza pelo ícone da FOB.", "Colega realmente usa o ponto sob as condições mostradas.", "Ponto indisponível: separe implantação, elegibilidade e espera de estoque/acesso; mantenha não confirmado até testar."],
      ["Defender ou retirar", "Defensor + líder + motorista", "Cubra acesso e ativos, reponha conforme consumo e reavalie relevância do objetivo.", "Acesso e serviços úteis operacionais; consumo e perdas orientam próximo transporte.", "Núcleo/rota perdidos ou objetivo irrelevante: pare expansão, recupere ativos móveis se seguro e registre perdas; reembolso não garantido."],
    ]},
  },
  ja: {
    assumption: "仮定の分隊作戦であり、記録された試合でも公式ミッションでもありません。役割と手順は編集上の提案です。現行画面と人数に合わせて変更してください。",
    action: "行動", pass: "完了の証拠", failure: "失敗時の対応", observations: "不足している実測記録",
    missing: "この事例にはクライアント版、在庫の前後画像、実測容量、所要時間、現金報酬、XP差分がありません。完了や利益は主張しません。自分の作戦で版、資源単位、出発・受領時刻、在庫前後、損失、現金とXPを別々に記録してください。同時消費で在庫差分が見えなくなる場合があります。",
    calculation: "仮定の計画単位だけで、公式資源単位・車両容量・報酬ではありません。建築レシピも推定しません。残り＝需要−在庫、便数＝残り÷仮定容量を切り上げ。損失や消費、依頼変更の後は再計算します。",
    demand: "仮定の需要", stock: "仮定の在庫", capacity: "仮定の1便容量", remaining: "残り", trips: "計画便数", units: "任意の計画単位", planner: "この仮定補給計画を開く", source: "公式システム説明", basis: "Steamは物流、車両、FOB建築を確認しています。以下は編集上の想定作戦であり、公式手順や現行移送操作の実証ではありません。",
    cargo: {title: "事例：依頼された1種類の資源をFOBへ届ける", brief: "受取担当、運転手、護衛で依頼を完了させます。資源単位を混ぜず、近くの荷物を受領済み在庫とみなしません。", stages: [
      ["依頼確認", "受取担当＋分隊長", "購入前に資源、目的地、不足量、中止条件を決めます。", "受取担当が現行の資源名、在庫、優先順位を確認します。", "種類違い・在庫充足なら積載前に依頼を変更または中止します。"],
      ["積載確認", "運転手＋積載担当", "現行画面で車両と容器の適合、実際の積載一覧、退出路を確認します。", "車両の一覧に荷物が表示され、出発できます。", "容器拒否・積載不足なら車両や容器を変更します。固定のトラック容量は仮定しません。"],
      ["接近", "運転手＋護衛", "主経路と予備経路を決め、護衛が入口を確認し、受取担当が荷下ろし場所を空けます。", "利用可能な接近路と帰路を分隊が確認します。", "待ち伏せ・封鎖なら射線外で停止し、迂回か中止。生き残った荷物に一覧を更新します。"],
      ["移送", "運転手＋受取担当", "現在受理される受領地点で停車し、現行の表示に従って指定資源を移します。", "受領表示を確認し、該当資源の在庫を比較します。", "落としただけなら位置・権限・種類を確認。残りを守り、配達完了とは扱いません。"],
      ["照合", "受取担当＋分隊長", "在庫前後と同時消費を照合し、建築担当へ利用可能量を伝えます。", "受領と在庫変化が支出・消費と整合します。", "増加が不明なら未確認のまま版と表示を記録し、再購入前に食い違いを解決します。"],
      ["帰還と次便", "運転手＋護衛", "受領経路を空け、損失を報告し、帰還前に次の不足を聞きます。", "車両・隊員が帰還するか損失を記録し、次便は更新需要に従います。", "経路喪失・目標移動なら反復輸送を止めて目的地変更。返金や利益は保証しません。"],
    ]},
    fob: {title: "事例：最小限の補給済みFOBを作る", brief: "隊長、建築担当、運転手、防衛担当が現目標に必要な設備だけを作ります。基礎設置、補給完了、実際に使えるスポーンは別々に判定します。", stages: [
      ["目的と場所", "分隊長＋偵察担当", "目標、必要機能、接近路、退路を決め、地形と露出を確認します。", "位置の有用性と配送車両の出入りを合意します。", "目標移動・入口露出なら購入前に移設または中止します。"],
      ["解除条件と設置", "建築担当", "品目、道具、ロール／キャリア条件、解除費、店頭価格を別々に読み、設置プレビューを試します。", "必要品と道具が利用可能で、予定地が設置許可されます。", "地形・重なり・上限・解除不足なら拒否理由を記録して解決。補給では解除条件を飛ばせません。"],
      ["補給受領", "建築担当＋運転手＋受取担当", "正確な資源を依頼し、積載一覧と守られた受領通路を確認します。", "移送が受理され、建築に使える在庫が表示されます。", "種類違い・受領なしなら建築停止して照合。近くのパレットを在庫とみなしません。"],
      ["最小機能の建築", "建築担当＋防衛担当", "核・必要機能を先に完成させ、荷下ろしと旋回場所を確保。明確な脅威に応じて防御を追加します。", "必要機能が使え、予定車両が出入りできます。", "通路閉塞・在庫不足なら障害を除去するか依頼を修正してから拡張します。"],
      ["スポーンを別に検証", "分隊長＋スポーン担当", "現行画面と別資産の条件を確認し、資格のある隊員で試します。FOBアイコンから推定しません。", "表示条件に従って隊員が目的のスポーンを実際に使えます。", "利用不可なら展開・資格・待機時間と補給・通路を分け、テストまで未確認とします。"],
      ["防衛・補給・撤退", "防衛担当＋隊長＋運転手", "入口と重要資産を守り、消費量から再補給し、目標への有用性を見直します。", "配送路と必要機能が維持され、消費と損失が次便に反映されます。", "核・経路喪失や目標無関係なら拡張中止。安全なら移動資産を回収し損失報告。回収や返金は保証しません。"],
    ]},
  },
  "zh-cn": {
    assumption: "这是小队任务假设，不是已观测对局或官方任务脚本。角色分工和执行顺序是编辑建议，须按当前界面与小队人数调整。",
    action: "执行动作", pass: "通过证据", failure: "失败与恢复", observations: "缺少的实际观测",
    missing: "本案例没有客户端版本、库存前后截图、实测容量、运输耗时、现金奖励或 XP 增量，因此不声称已完成或盈利。实际执行时记录版本、资源单位、出发／收货时间、前后库存、损失，以及分开的现金／XP 变化；同步消耗可能掩盖库存差值。",
    calculation: "以下只是自定义规划单位的假设，不是官方资源单位、载具容量或奖励，也不推导建筑配方。缺口＝需求－库存；趟数＝缺口÷假设容量向上取整。损失、消耗或需求变化后重新计算。",
    demand: "假设需求", stock: "假设库存", capacity: "假设每趟单位", remaining: "剩余缺口", trips: "规划趟数", units: "自定义规划单位", planner: "打开此假设补给计划", source: "官方系统说明", basis: "Steam 确认物流、载具与 FOB 建设系统。下列流程是编辑任务演练，不是官方步骤，也不是当前转移按键的客户端验证。",
    cargo: {title: "案例：把一种所需资源送到 FOB", brief: "收货人提出资源需求，司机、护送与收货人完成闭环。不混用资源单位，不把基地附近的货物算作入库。", stages: [
      ["确定请求", "收货人＋队长", "购买前约定资源、目的地、未满足需求和中止条件。", "收货人确认当前资源名称、库存和优先级。", "资源错误或已经满库存：装载前取消或变更请求。"],
      ["装载核对", "司机＋装载人", "在当前界面确认载具／容器兼容与实际装载清单，留出离场路线。", "载具清单显示货物，小队可以出发。", "容器被拒或没有装上：更换载具／容器，不假定某辆卡车的容量。"],
      ["接近目的地", "司机＋护送", "约定主路和备选路；护送检查入口，收货人保持卸货空间畅通。", "小队确认入口可用，且有返回路线。", "遭伏击或道路封锁：在火线外停车、绕行或中止，按幸存货物更新清单。"],
      ["转移收货", "司机＋收货人", "停在当前允许收货的位置，按当前提示转移所请求的资源。", "收货界面确认转移，再比较同类资源库存。", "落地却没有收货：检查位置、权限和资源类型，保护剩余货物，不算作送达。"],
      ["对账验收", "收货人＋队长", "核对前后库存与同期消耗，告知建造者实际可用数量。", "收货记录与库存变化能和消耗／支出对应。", "没有明确增量：保留为未确认，记录版本和提示，解决差异后再购买下一批。"],
      ["返回与下一趟", "司机＋护送", "让开收货通道，报告损失，返回前重新询问缺口。", "载具／队员安全返回或损失有记录；下一趟用更新后的需求。", "路线失守或目标移动：停止重复跑线，换目的地，不假定返款或盈利。"],
    ]},
    fob: {title: "案例：建立最小可用且已补给的 FOB", brief: "队长、建造者、司机和防守者只建立当前目标需要的服务。基础已放置、基地已补给、出生支援可用是三种不同验收状态。", stages: [
      ["任务与选址", "队长＋侦察", "明确目标、所需服务、进入与撤离路线，检查地形和暴露方向。", "小队同意位置的价值，并知道配送如何进出。", "目标移动或入口暴露：采购前改址或取消。"],
      ["门槛与放置", "建造者", "分开核对物品、工具、职业／生涯门槛、解锁费与商店价，先试有效预览。", "工具和物品可用，地面接受预定放置。", "地形、重叠、数量限制或缺门槛：记录拒绝原因并解决，送补给不能绕过解锁。"],
      ["请求并接收补给", "建造者＋司机＋收货人", "请求准确资源，核对装载清单，使用受保护的收货通道。", "转移被确认，下一个建造项目所需可用库存可见。", "资源错误或没收货：暂停建设、核对运输；旁边的托盘不等于入库。"],
      ["先建最小服务", "建造者＋防守者", "先完成被允许的核心／服务，保留卸货与转弯空间，只针对明确威胁加防御。", "所需服务已建成可用，目标载具能够进出。", "入口被堵或库存不足：清障或修改资源请求后再扩建。"],
      ["单独验证出生", "队长＋出生支援操作人", "查看当前出生界面与独立资产要求，用符合条件的队友实测，不靠 FOB 图标推断。", "队友在显示条件下确实能使用目标出生点。", "无法出生：分开排查部署、资格、冷却与补给／通路问题，测试前保持未确认。"],
      ["防守、补给或撤离", "防守者＋队长＋司机", "守住入口与关键资产，按实际消耗补货，并重新判断目标价值。", "补给入口和所需服务仍可用，下一趟反映消耗与损失。", "核心／路线失守或目标无关：停止扩建，安全时回收移动资产并报损，不保证回收或退款。"],
    ]},
  },
  "zh-tw": {
    assumption: "這是小隊任務假設，不是已觀測對局或官方任務腳本。角色分工與執行順序是編輯建議，須按目前介面與小隊人數調整。",
    action: "執行動作", pass: "通過證據", failure: "失敗與恢復", observations: "缺少的實際觀測",
    missing: "本案例沒有用戶端版本、庫存前後截圖、實測容量、運輸耗時、現金獎勵或 XP 增量，因此不聲稱已完成或盈利。實際執行時記錄版本、資源單位、出發／收貨時間、前後庫存、損失，以及分開的現金／XP 變化；同步消耗可能掩蓋庫存差值。",
    calculation: "以下只是自訂規劃單位的假設，不是官方資源單位、載具容量或獎勵，也不推導建築配方。缺口＝需求－庫存；趟數＝缺口÷假設容量向上取整。損失、消耗或需求變化後重新計算。",
    demand: "假設需求", stock: "假設庫存", capacity: "假設每趟單位", remaining: "剩餘缺口", trips: "規劃趟數", units: "自訂規劃單位", planner: "開啟此假設補給計畫", source: "官方系統說明", basis: "Steam 確認物流、載具與 FOB 建設系統。下列流程是編輯任務演練，不是官方步驟，也不是目前轉移按鍵的用戶端驗證。",
    cargo: {title: "案例：把一種所需資源送到 FOB", brief: "收貨人提出資源需求，司機、護送與收貨人完成閉環。不混用資源單位，不把基地附近的貨物算作入庫。", stages: [
      ["確定請求", "收貨人＋隊長", "購買前約定資源、目的地、未滿足需求和中止條件。", "收貨人確認目前資源名稱、庫存和優先級。", "資源錯誤或已經滿庫存：裝載前取消或變更請求。"],
      ["裝載核對", "司機＋裝載人", "在目前介面確認載具／容器相容與實際裝載清單，留出離場路線。", "載具清單顯示貨物，小隊可以出發。", "容器被拒或沒有裝上：更換載具／容器，不假定某輛卡車的容量。"],
      ["接近目的地", "司機＋護送", "約定主路和備選路；護送檢查入口，收貨人保持卸貨空間暢通。", "小隊確認入口可用，且有返回路線。", "遭伏擊或道路封鎖：在火線外停車、繞行或中止，按倖存貨物更新清單。"],
      ["轉移收貨", "司機＋收貨人", "停在目前允許收貨的位置，按目前提示轉移所請求的資源。", "收貨介面確認轉移，再比較同類資源庫存。", "落地卻沒有收貨：檢查位置、權限和資源類型，保護剩餘貨物，不算作送達。"],
      ["對帳驗收", "收貨人＋隊長", "核對前後庫存與同期消耗，告知建造者實際可用數量。", "收貨記錄與庫存變化能和消耗／支出對應。", "沒有明確增量：保留為未確認，記錄版本和提示，解決差異後再購買下一批。"],
      ["返回與下一趟", "司機＋護送", "讓開收貨通道，報告損失，返回前重新詢問缺口。", "載具／隊員安全返回或損失有記錄；下一趟用更新後的需求。", "路線失守或目標移動：停止重複跑線，換目的地，不假定返款或盈利。"],
    ]},
    fob: {title: "案例：建立最小可用且已補給的 FOB", brief: "隊長、建造者、司機和防守者只建立目前目標需要的服務。基礎已放置、基地已補給、出生支援可用是三種不同驗收狀態。", stages: [
      ["任務與選址", "隊長＋偵察", "明確目標、所需服務、進入與撤離路線，檢查地形和暴露方向。", "小隊同意位置的價值，並知道配送如何進出。", "目標移動或入口暴露：採購前改址或取消。"],
      ["門檻與放置", "建造者", "分開核對物品、工具、職業／生涯門檻、解鎖費與商店價，先試有效預覽。", "工具和物品可用，地面接受預定放置。", "地形、重疊、數量限制或缺門檻：記錄拒絕原因並解決，送補給不能繞過解鎖。"],
      ["請求並接收補給", "建造者＋司機＋收貨人", "請求準確資源，核對裝載清單，使用受保護的收貨通道。", "轉移被確認，下一個建造項目所需可用庫存可見。", "資源錯誤或沒收貨：暫停建設、核對運輸；旁邊的棧板不等於入庫。"],
      ["先建最小服務", "建造者＋防守者", "先完成被允許的核心／服務，保留卸貨與轉彎空間，只針對明確威脅加防禦。", "所需服務已建成可用，目標載具能夠進出。", "入口被堵或庫存不足：清障或修改資源請求後再擴建。"],
      ["單獨驗證出生", "隊長＋出生支援操作人", "查看目前出生介面與獨立資產要求，用符合條件的隊友實測，不靠 FOB 圖示推斷。", "隊友在顯示條件下確實能使用目標出生點。", "無法出生：分開排查部署、資格、冷卻與補給／通路問題，測試前保持未確認。"],
      ["防守、補給或撤離", "防守者＋隊長＋司機", "守住入口與關鍵資產，按實際消耗補貨，並重新判斷目標價值。", "補給入口和所需服務仍可用，下一趟反映消耗與損失。", "核心／路線失守或目標無關：停止擴建，安全時回收移動資產並報損，不保證回收或退款。"],
    ]},
  },
  pl: {
    assumption: "Hipotetyczna operacja drużyny, nie zapis meczu ani oficjalna misja. Role i kolejność są propozycją redakcji; dostosuj je do interfejsu i liczebności grupy.",
    action: "Działanie", pass: "Dowód wykonania", failure: "Niepowodzenie / odzyskanie", observations: "Brakujące pomiary terenowe",
    missing: "Brakuje wersji klienta, ujęć zapasów przed/po, zmierzonej pojemności, czasu przejazdu, wypłaty gotówki i przyrostu XP tego przypadku. Nie twierdzimy, że zadanie wykonano lub osiągnięto zysk. Zapisz wersję, jednostkę zasobu, czas wyjazdu/odbioru, zapasy, straty oraz gotówkę/XP oddzielnie; równoczesne zużycie może ukryć zmianę zapasu.",
    calculation: "Tylko założone jednostki planowania, nie oficjalne zasoby, pojemność pojazdu ani nagrody. Nie wyprowadzamy receptury budowy. Brak = potrzeba − zapas; kursy = brak ÷ założona pojemność, zaokrąglone w górę. Po stratach lub zużyciu przelicz ponownie.",
    demand: "Założona potrzeba", stock: "Założony zapas", capacity: "Założone jednostki na kurs", remaining: "Pozostały brak", trips: "Planowane kursy", units: "Własne jednostki planowania", planner: "Otwórz ten hipotetyczny plan", source: "Oficjalny opis systemów", basis: "Steam potwierdza logistykę, pojazdy i budowę FOB. Poniższa kolejność to scenariusz redakcyjny, nie oficjalny skrypt ani potwierdzenie obecnego sterowania transferem.",
    cargo: {title: "Przypadek: dostawa jednego zasobu do FOB", brief: "Odbiorca składa zamówienie, a kierowca, eskorta i odbiorca zamykają dostawę. Nie mieszaj jednostek i nie uznawaj pobliskiego ładunku za przyjęty zapas.", stages: [
      ["Zamówienie", "Odbiorca + dowódca", "Przed zakupem ustal zasób, cel, brak i warunek przerwania.", "Odbiorca potwierdza obecną nazwę, zapas i priorytet.", "Zły zasób lub pełny magazyn: anuluj albo zmień zamówienie przed załadunkiem."],
      ["Załadunek", "Kierowca + ładujący", "Sprawdź zgodność pojazdu i kontenera w grze, faktyczny wykaz ładunku i wolny wyjazd.", "Ładunek jest widoczny w wykazie pojazdu, grupa może wyjechać.", "Kontener odrzucony lub brak ładunku: zmień pojazd/kontener; nie zakładaj stałej pojemności ciężarówki."],
      ["Dojazd", "Kierowca + eskorta", "Ustal trasę główną i zapasową; eskorta sprawdza podejście, odbiorca zwalnia miejsce rozładunku.", "Grupa potwierdza przejezdne podejście i drogę powrotną.", "Zasadzka lub blokada: zatrzymaj poza ostrzałem, objazd albo przerwanie; aktualizuj wykaz ocalałego ładunku."],
      ["Przekazanie", "Kierowca + odbiorca", "Zatrzymaj się w akceptowanym miejscu i wykonaj obecne komunikaty transferu właściwego zasobu.", "Interfejs potwierdza odbiór; porównaj zapas tego zasobu.", "Zrzut bez odbioru: sprawdź pozycję, uprawnienia i typ; chroń resztę i nie uznawaj dostawy za zakończoną."],
      ["Rozliczenie", "Odbiorca + dowódca", "Porównaj zapas przed/po z równoczesnym zużyciem; podaj budującym dostępną ilość.", "Odbiór i zmiana zapasu zgadzają się z zużyciem.", "Brak wyraźnego wzrostu: pozostaw niepotwierdzone, zapisz wersję/komunikat i wyjaśnij przed kolejnym zakupem."],
      ["Powrót", "Kierowca + eskorta", "Zwolnij dojazd, zgłoś straty i zapytaj o następny brak przed powrotem.", "Pojazd/grupa wraca albo straty są zapisane; kolejny kurs używa nowego zapotrzebowania.", "Trasa zagrożona lub cel przesunięty: zatrzymaj powtarzane kursy i wybierz nowy cel; bez gwarancji zwrotu lub zysku."],
    ]},
    fob: {title: "Przypadek: minimalna zaopatrzona FOB", brief: "Dowódca, budujący, kierowca i obrońca tworzą tylko usługi potrzebne obecnemu celowi. Ustawiony fundament, zaopatrzona baza i dostępne odrodzenie to osobne stany odbioru.", stages: [
      ["Zadanie i miejsce", "Dowódca + zwiadowca", "Określ cel, usługę, dojazd i odwrót; sprawdź teren i ekspozycję.", "Grupa rozumie wartość miejsca oraz wjazd i wyjazd dostaw.", "Cel zmieniony lub dojazd odsłonięty: przenieś albo anuluj przed zakupami."],
      ["Wymagania i ustawienie", "Budujący", "Oddzielnie sprawdź przedmiot, narzędzie, poziom roli/kariery, opłatę odblokowania i cenę sklepu; przetestuj podgląd.", "Narzędzie/przedmiot dostępne, podgląd akceptuje planowany grunt.", "Teren, kolizja, limit lub próg: zapisz odmowę i rozwiąż przyczynę; zapasy nie omijają odblokowania."],
      ["Odbiór zapasów", "Budujący + kierowca + odbiorca", "Zamów dokładny zasób, sprawdź wykaz i użyj chronionego dojazdu.", "Transfer potwierdzony, użyteczny zapas widoczny dla budowy.", "Zły zasób lub brak odbioru: wstrzymaj budowę i rozlicz dostawę; pobliska paleta nie jest zapasem."],
      ["Minimalna usługa", "Budujący + obrońca", "Najpierw ukończ rdzeń/usługę; zostaw rozładunek i miejsce na skręt. Dodawaj obronę pod konkretną groźbę.", "Usługa działa, przewidziany pojazd wjeżdża i wyjeżdża.", "Blokada lub brak zapasu: usuń przeszkodę albo zmień zamówienie przed rozbudową."],
      ["Osobny test odrodzenia", "Dowódca + operator odrodzenia", "Sprawdź interfejs i osobne wymagania z uprawnionym kolegą, nie wnioskuj z ikony FOB.", "Kolega faktycznie używa wskazanego odrodzenia pod widocznymi warunkami.", "Niedostępne: oddziel rozmieszczenie, uprawnienia i czas oczekiwania od zapasów/dojazdu; potwierdź dopiero po teście."],
      ["Obrona lub odwrót", "Obrońca + dowódca + kierowca", "Chroń dojazd i kluczowe obiekty, uzupełniaj według zużycia, oceniaj aktualny cel.", "Dostawy i usługi działają; zużycie i straty wyznaczają następny kurs.", "Rdzeń/trasa utracone lub cel nieistotny: wstrzymaj rozbudowę, bezpiecznie odzyskaj mobilne zasoby i zgłoś straty; zwrot nie jest gwarantowany."],
    ]},
  },
};

export function getMissionCase(slug: string, locale: Locale) {
  const kind: MissionKind | null = slug === "wardogs-cargo-guide" ? "cargo" : slug === "wardogs-fob-guide" ? "fob" : null;
  if (!kind) return null;
  const ui = copy[locale];
  const scenario = ui[kind];
  const plan: SupplyPlan = {demand: kind === "cargo" ? 120 : 80, stock: kind === "cargo" ? 20 : 10, capacity: kind === "cargo" ? 40 : 25, resource: ui.units, lines: []};
  return {
    kind, ui, title: scenario.title, brief: scenario.brief,
    stages: scenario.stages.map(([title, owner, action, pass, failure], index) => ({id: `${kind}-${index + 1}`, title, owner, action, pass, failure})),
    observations: {clientBuild: null, stockBefore: null, stockAfter: null, measuredCapacity: null, journeySeconds: null, cashDelta: null, xpDelta: null},
    plan, calculation: calculateSupplyPlan(plan),
    plannerHref: `/${locale}/tools/logistics-planner?${encodeLogisticsPlanState({stages: kind === "cargo" ? ["supply", "transport", "recovery"] : ["construction", "supply", "spawn", "defense", "recovery"], supplies: plan})}`,
    sourceUrl: "https://store.steampowered.com/app/1867240/WARDOGS/",
  };
}
