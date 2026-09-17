import type {Locale} from "@/config/site";
import {
  getCurrentVideoSourcesForGuide,
  type CurrentVideoSource
} from "@/features/videos/video-library";

export const guideTaskSlugs = [
  "wardogs-ammo-reload-guide",
  "wardogs-beginner-guide",
  "wardogs-money-guide",
  "wardogs-best-settings",
  "wardogs-community-servers-guide",
  "wardogs-controls",
  "wardogs-fob-guide",
  "wardogs-cargo-guide",
  "wardogs-mortar-guide",
  "wardogs-helicopter-guide",
  "wardogs-ps5",
  "wardogs-progression-wipes-guide",
  "wardogs-best-weapons-loadouts",
  "wardogs-equipment-tools-guide",
  "wardogs-crash-fix",
  "wardogs-map"
] as const;

export type GuideTaskSlug = (typeof guideTaskSlugs)[number];

export type GuideTaskUi = {
  eyebrow: string;
  checklistTitle: string;
  progressTemplate: string;
  cautionLabel: string;
  relatedToolLabel: string;
};

export type GuideTaskData = {
  slug: GuideTaskSlug;
  eyebrow: string;
  title: string;
  directAnswer: string;
  steps: readonly string[];
  caution?: string;
  relatedTool?: {href: string; label: string};
  videos: readonly CurrentVideoSource[];
};

type GuideTaskCopy = Pick<GuideTaskData, "title" | "directAnswer" | "steps" | "caution">;
type ToolKey = "loadoutBudget" | "systemCheck";

const task = (
  title: string,
  directAnswer: string,
  caution: string,
  ...steps: readonly string[]
): GuideTaskCopy => ({title, directAnswer, caution, steps});

const ui: Record<Locale, GuideTaskUi> = {
  en: {eyebrow: "Practical field checklist", checklistTitle: "Complete this workflow", progressTemplate: "{done} of {total} steps complete", cautionLabel: "Build-sensitive caution", relatedToolLabel: "Continue with a tool"},
  de: {eyebrow: "Praktische Feldcheckliste", checklistTitle: "Diesen Ablauf abschließen", progressTemplate: "{done} von {total} Schritten abgeschlossen", cautionLabel: "Hinweis zum aktuellen Build", relatedToolLabel: "Mit einem Werkzeug fortfahren"},
  ru: {eyebrow: "Практический полевой список", checklistTitle: "Выполните этот порядок действий", progressTemplate: "Выполнено шагов: {done} из {total}", cautionLabel: "Оговорка о текущей сборке", relatedToolLabel: "Продолжить в инструменте"},
  "pt-br": {eyebrow: "Checklist prático de campo", checklistTitle: "Conclua este fluxo", progressTemplate: "{done} de {total} etapas concluídas", cautionLabel: "Atenção à build atual", relatedToolLabel: "Continuar em uma ferramenta"},
  ja: {eyebrow: "実戦チェックリスト", checklistTitle: "この手順を完了する", progressTemplate: "{total}項目中{done}項目を完了", cautionLabel: "現行ビルドに関する注意", relatedToolLabel: "ツールで次へ進む"},
  "zh-cn": {eyebrow: "实战任务清单", checklistTitle: "按顺序完成这个流程", progressTemplate: "已完成 {done} / {total} 步", cautionLabel: "当前版本注意事项", relatedToolLabel: "使用相关工具继续"}
};

const toolLabels: Record<Locale, Record<ToolKey, string>> = {
  en: {loadoutBudget: "Open the loadout budget planner", systemCheck: "Open the PC system checker"},
  de: {loadoutBudget: "Loadout-Budgetplaner öffnen", systemCheck: "PC-Systemprüfung öffnen"},
  ru: {loadoutBudget: "Открыть планировщик стоимости комплекта", systemCheck: "Открыть проверку системы ПК"},
  "pt-br": {loadoutBudget: "Abrir o planejador de orçamento do kit", systemCheck: "Abrir a verificação do PC"},
  ja: {loadoutBudget: "ロードアウト予算ツールを開く", systemCheck: "PCシステムチェックを開く"},
  "zh-cn": {loadoutBudget: "打开配装预算工具", systemCheck: "打开 PC 配置检测器"}
};

const relatedTools: Partial<Record<GuideTaskSlug, {href: string; key: ToolKey}>> = {
  "wardogs-ammo-reload-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-beginner-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-money-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-best-settings": {href: "/tools/system-check", key: "systemCheck"},
  "wardogs-best-weapons-loadouts": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-equipment-tools-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-crash-fix": {href: "/tools/system-check", key: "systemCheck"}
};

const copy: Record<Locale, Record<GuideTaskSlug, GuideTaskCopy>> = {
  en: {
    "wardogs-ammo-reload-guide": task(
      "Check ammunition before deployment",
      "Match the weapon, magazine, and ammunition family before you buy or deploy. Verify every compatibility label in the current vendor and inventory UI because recorded test-build relationships can change.",
      "Do not treat an older calibre list, magazine name, or creator loadout as proof of current compatibility.",
      "Identify the weapon and read its current ammunition and magazine labels.",
      "Choose one ammunition family for the target and role you expect.",
      "Buy a minimal test quantity before committing the rest of the loadout budget.",
      "Load and reload in a safe area, then confirm the inventory and ammunition counter update.",
      "Recheck the vendor after a patch before reusing a saved loadout."
    ),
    "wardogs-beginner-guide": task(
      "Run a useful first match",
      "Learn deployment, the active objective, squad movement, and one support loop before buying a specialist kit. Stay near teammates and use the current interface instead of relying on an old beginner video for exact values.",
      "Prices, rewards, controls, and progression shown in earlier builds may no longer match the live client.",
      "Join a squad, read its objective, and identify the active Control Zone on the map.",
      "Choose an affordable loadout with a clear infantry or support purpose.",
      "Use an organized spawn or transport route instead of crossing open ground alone.",
      "Trade, revive, resupply, or transport near the squad before chasing isolated fights.",
      "After a death, change one part of the plan and preserve enough cash for the next life."
    ),
    "wardogs-money-guide": task(
      "Protect cash while creating team value",
      "Choose a repeatable job, keep a reserve, and measure the net result after each life. Current payouts and prices must be read from the live client, so use the workflow rather than a permanent earnings table.",
      "A profitable route in one build or match is not a guaranteed payout in the next one.",
      "Pick one useful job such as objective support, logistics, transport, repairs, or revives.",
      "Set a loss limit before buying equipment or taking a vehicle.",
      "Complete the whole service loop and confirm the reward in the current interface.",
      "Subtract replacement costs and record the net result instead of counting gross income.",
      "Keep the route only if it remains useful to the team and repeatable without reckless losses."
    ),
    "wardogs-best-settings": task(
      "Build a reproducible settings baseline",
      "Start from a stable baseline and change one graphics or display option at a time. Compare the same scene after each change so visibility, frame pacing, and crashes are not mixed into one guess.",
      "Menu names and performance results depend on the current build, driver, hardware, resolution, and battlefield load.",
      "Record the current build, hardware, driver, resolution, and starting preset.",
      "Choose one repeatable scene and note frame stability and visibility before changing anything.",
      "Change one setting, repeat the scene, and keep the result only when it is clearly better.",
      "Test overlays and background tools separately when stutter or instability remains.",
      "Save the working baseline and retest it after game or driver updates."
    ),
    "wardogs-community-servers-guide": task(
      "Verify a community server before joining",
      "Use only the current server browser and official provider notices to decide what is available. Confirm region, rules, moderation, progression treatment, and connection details before committing a session.",
      "Hosting providers, RCON support, progression rules, and browser filters can change without matching older announcements.",
      "Check the live browser or an approved provider page rather than an old server list.",
      "Read the server name, region, mode, rules, and moderation contact before joining.",
      "Confirm whether progression or custom settings differ from official matchmaking.",
      "Test latency and connection stability before organizing a larger group.",
      "Report misleading listings through the current provider or in-game process."
    ),
    "wardogs-controls": task(
      "Verify controls in the current client",
      "Open the input settings and verify the current in-game binding for every action you need before deployment. Test infantry, communication, vehicle, and specialist controls in a safe area instead of assuming an older key list still applies.",
      "Bindings, device detection, prompts, and reset behavior can change between builds or after a settings reset.",
      "Open each input category and record the current in-game binding for movement and interaction.",
      "Verify map, ping, voice, inventory, reload, and contextual actions one by one.",
      "Test vehicle seats and axes in a safe location before entering combat.",
      "Resolve conflicts, apply the changes, and restart once to confirm they remain saved.",
      "Capture the current layout before a patch or device-driver change."
    ),
    "wardogs-fob-guide": task(
      "Build a FOB that supports the next fight",
      "A useful FOB combines placement, requested supplies, clear access, defense, and a recovery plan. Confirm the current build menu and resource requirements before placing or upgrading anything.",
      "Construction costs, valid placement rules, upgrade paths, and available structures are build-sensitive.",
      "Choose a purpose and location with cover, access, and distance from obvious enemy pressure.",
      "Confirm the requested resource type and assign transport before construction begins.",
      "Keep roads, spawn exits, unloading space, and friendly movement clear.",
      "Build only the protection and services needed for the immediate objective.",
      "Defend the supply route and prepare to repair, relocate, or abandon the position when its value changes."
    ),
    "wardogs-cargo-guide": task(
      "Complete the entire cargo loop",
      "A cargo run is complete only when the requested resource is loaded, delivered, transferred into the usable destination pool, and the transport survives for another task. Check the current cargo interface at every handoff.",
      "Vehicle capacity, resource names, loading controls, and transfer zones may differ from recorded test builds.",
      "Ask the destination what resource and quantity it currently needs.",
      "Choose a compatible transport and confirm the cargo appears in its current inventory.",
      "Plan a protected route and keep the unloading area clear before arrival.",
      "Transfer the cargo and verify the destination resource display actually changes.",
      "Leave without blocking the spawn or supply lane, then return the asset for another run."
    ),
    "wardogs-mortar-guide": task(
      "Run a controlled mortar mission",
      "A mortar team needs a safe emplacement, a current target, an observer, and measured corrections. Treat old range marks and damage claims as references only until the current build confirms them.",
      "Range behavior, ammunition supply, damage, controls, and emplacement rules can change between builds.",
      "Place the mortar where the crew has cover, supply access, and room to leave.",
      "Confirm the target and friendly positions with an observer before loading a shot.",
      "Use the current interface to set the initial solution rather than copying an old table blindly.",
      "Fire a controlled shot, receive a clear correction, and adjust one variable at a time.",
      "Stop or relocate when the target moves, friendlies enter the area, or counterfire threatens the crew."
    ),
    "wardogs-helicopter-guide": task(
      "Prepare a safe helicopter sortie",
      "Verify the current flight bindings, practice a controlled takeoff and landing, and choose a route with an abort option before carrying a squad or expensive asset. A successful sortie returns the aircraft for another useful task.",
      "Flight handling, device support, countermeasures, repair, fuel, and aircraft availability are build-sensitive.",
      "Confirm pitch, roll, yaw, collective, view, seat, and exit bindings in the current client.",
      "Practice hover, takeoff, approach, go-around, and landing away from the active fight.",
      "Brief passengers on pickup, destination, threats, and the abort signal.",
      "Fly a route with terrain cover and a safe alternative landing area.",
      "Drop, leave the threat area, inspect the aircraft, and decide whether another sortie is safe."
    ),
    "wardogs-ps5": task(
      "Check the console status without guessing",
      "A PS5 release date is not officially confirmed. Use current first-party store listings and official WARDOGS announcements, and treat unsourced dates or placeholder pages as unconfirmed.",
      "Do not infer a console date, cross-play feature, controller mode, or store availability from PC Early Access or third-party listings.",
      "Check the official WARDOGS and publisher channels for a platform-specific announcement.",
      "Search the PlayStation Store directly and distinguish a real product page from a placeholder or mention.",
      "Read any announcement for region, edition, cross-play, and progression details instead of assuming parity.",
      "Ignore countdowns or release dates that do not link to a first-party source.",
      "Recheck after major roadmap or launch updates and preserve the source date."
    ),
    "wardogs-progression-wipes-guide": task(
      "Plan progression from current evidence",
      "Read the current role track and official patch notes before choosing a goal. Build a repeatable route around actions that visibly move the relevant bar, without inventing time-to-unlock estimates or wipe rules.",
      "Beta progression speed, role placement, unlock levels, XP sources, and reset policy must not be treated as permanent.",
      "Choose one role or unlock goal and record the current track before the match.",
      "Select one team-useful action associated with that role and repeat it cleanly.",
      "Check the bar after the action so unrelated rewards do not contaminate the observation.",
      "Compare the result with the latest official change notes and label unknowns explicitly.",
      "Rebuild the route after a progression patch or reset announcement."
    ),
    "wardogs-best-weapons-loadouts": task(
      "Build a loadout for one job",
      "The best loadout is the least expensive reliable kit that fits the role, expected range, ammunition relationship, and team task. Compare current vendor and inventory evidence instead of copying a permanent tier list.",
      "Weapon balance, price, unlock gates, attachments, ammunition, armor, and slot behavior can change with the build.",
      "Define the role, engagement range, and team problem the loadout must solve.",
      "Choose a weapon whose current ammunition and magazine relationship you can verify.",
      "Add protection, medical supplies, and one purposeful tool before optional extras.",
      "Check total replacement risk and keep a lower-cost fallback for repeated deaths.",
      "Test the kit in one consistent situation and change only the part that failed."
    ),
    "wardogs-equipment-tools-guide": task(
      "Choose equipment by battlefield task",
      "Carry tools that solve a named team problem, then verify their current slot, charge, resource, and interaction requirements in the live interface. Extra equipment without a job adds cost and complexity rather than value.",
      "Charges, capacities, costs, interaction prompts, placement rules, and compatible targets are build-sensitive.",
      "Name the task: medical support, repair, construction, demolition, reconnaissance, or resupply.",
      "Check the current item description, required resource, slot, and compatible target.",
      "Carry the minimum supporting supplies needed to complete the task safely.",
      "Test the interaction in a safe context and confirm the target state changes.",
      "Replace or remove the tool when the squad task changes instead of carrying dead weight."
    ),
    "wardogs-crash-fix": task(
      "Isolate the failure before changing settings",
      "First separate an access or service issue from a local crash, freeze, or launch failure. Capture the exact symptom, then apply one reversible fix at a time and retest the same path.",
      "A workaround that helped one hardware or game build is not proof of a universal fix.",
      "Record the build, hardware, driver, error text, and the last action before the failure.",
      "Check current official notices to rule out access or service-side incidents.",
      "Verify game files and update required system components before editing advanced settings.",
      "Disable one overlay, hook, or background tool at a time and repeat the same test.",
      "Preserve logs and report reproducible steps if the clean test still fails."
    ),
    "wardogs-map": task(
      "Turn the map into a movement plan",
      "Use the map to connect the active objective, a reliable spawn, transport, supply, threats, and a fallback route. Recheck it after every major contact because the useful route can change faster than a static map image.",
      "Objective locations, route safety, markers, terrain behavior, and spawn availability can change with the match or build.",
      "Identify the active objective and your squad's immediate task.",
      "Choose a spawn and transport route that keeps the squad together.",
      "Mark known threats, supply points, landing areas, and blocked approaches.",
      "Plan one fallback route before crossing exposed terrain or committing a vehicle.",
      "Open the map again after contact, objective movement, or spawn loss and revise the route."
    )
  },
  de: {
    "wardogs-ammo-reload-guide": task("Munition vor dem Einsatz prüfen", "Ordne Waffe, Magazin und Munitionsfamilie vor Kauf oder Einsatz einander zu. Prüfe jede Kompatibilitätsangabe im aktuellen Händler- und Inventarmenü, da Beziehungen aus Test-Builds geändert worden sein können.", "Eine ältere Kaliberliste, ein Magazinname oder ein Creator-Loadout beweist keine aktuelle Kompatibilität.", "Waffe bestimmen und die aktuellen Munitions- und Magazinangaben lesen.", "Eine Munitionsfamilie für erwartetes Ziel und Rolle wählen.", "Zuerst nur eine kleine Testmenge kaufen.", "In sicherer Umgebung laden und nachladen; Inventar und Munitionszähler kontrollieren.", "Nach einem Patch den Händler erneut prüfen, bevor ein gespeichertes Loadout verwendet wird."),
    "wardogs-beginner-guide": task("Ein nützliches erstes Match spielen", "Lerne Einsatz, aktives Ziel, Truppbewegung und einen Support-Ablauf, bevor du Spezialausrüstung kaufst. Bleibe bei Teamkameraden und nutze die aktuelle Oberfläche statt alter Videos für genaue Werte.", "Preise, Belohnungen, Steuerung und Fortschritt früherer Builds können vom Live-Client abweichen.", "Trupp beitreten, Auftrag lesen und die aktive Control Zone auf der Karte finden.", "Ein bezahlbares Loadout mit klarer Infanterie- oder Support-Aufgabe wählen.", "Organisierten Spawn oder Transport nutzen, statt allein offenes Gelände zu queren.", "In Truppnähe handeln, wiederbeleben, versorgen oder transportieren.", "Nach dem Tod einen Teil des Plans ändern und Geld für den nächsten Einsatz behalten."),
    "wardogs-money-guide": task("Geld schützen und Teamwert schaffen", "Wähle eine wiederholbare Aufgabe, halte eine Reserve und messe nach jedem Leben das Nettoergebnis. Aktuelle Auszahlungen und Preise stehen im Live-Client; der Ablauf ist verlässlicher als eine dauerhafte Einkommenstabelle.", "Eine profitable Route in einem Build oder Match garantiert keine spätere Auszahlung.", "Eine nützliche Aufgabe wie Zielhilfe, Logistik, Transport, Reparatur oder Wiederbelebung wählen.", "Vor Ausrüstung oder Fahrzeug ein Verlustlimit festlegen.", "Den gesamten Service-Ablauf abschließen und die Belohnung in der aktuellen Oberfläche prüfen.", "Ersatzkosten abziehen und das Nettoergebnis notieren.", "Die Route nur behalten, wenn sie dem Team nutzt und ohne leichtsinnige Verluste wiederholbar ist."),
    "wardogs-best-settings": task("Eine reproduzierbare Einstellungsbasis bauen", "Beginne mit einer stabilen Basis und ändere jeweils nur eine Grafik- oder Anzeigeoption. Vergleiche nach jeder Änderung dieselbe Szene, damit Sichtbarkeit, Frame-Pacing und Abstürze nicht vermischt werden.", "Menünamen und Leistungswerte hängen von Build, Treiber, Hardware, Auflösung und Gefechtslast ab.", "Build, Hardware, Treiber, Auflösung und Start-Preset notieren.", "Eine wiederholbare Szene wählen und Stabilität sowie Sichtbarkeit vorher festhalten.", "Eine Einstellung ändern, Szene wiederholen und nur eindeutig bessere Ergebnisse behalten.", "Overlays und Hintergrundprogramme getrennt testen, wenn Stottern bleibt.", "Funktionierende Basis speichern und nach Spiel- oder Treiberupdates erneut testen."),
    "wardogs-community-servers-guide": task("Community-Server vor dem Beitritt prüfen", "Entscheide nur anhand des aktuellen Server-Browsers und offizieller Provider-Hinweise, was verfügbar ist. Prüfe Region, Regeln, Moderation, Fortschritt und Verbindung vor einer längeren Sitzung.", "Provider, RCON, Fortschrittsregeln und Browserfilter können sich gegenüber älteren Ankündigungen ändern.", "Live-Browser oder genehmigte Provider-Seite statt alter Serverliste öffnen.", "Name, Region, Modus, Regeln und Moderationskontakt lesen.", "Prüfen, ob Fortschritt oder eigene Einstellungen vom offiziellen Matchmaking abweichen.", "Latenz und Verbindung testen, bevor eine größere Gruppe organisiert wird.", "Irreführende Einträge über den aktuellen Provider- oder Ingame-Prozess melden."),
    "wardogs-controls": task("Steuerung im aktuellen Client prüfen", "Öffne die Eingabeeinstellungen und prüfe vor dem Einsatz für jede benötigte Aktion die aktuelle Belegung im Spiel. Teste Infanterie, Kommunikation, Fahrzeuge und Spezialaktionen sicher, statt einer alten Tastenliste zu vertrauen.", "Belegungen, Geräteerkennung, Anzeigen und Rücksetzverhalten können sich zwischen Builds ändern.", "Jede Eingabekategorie öffnen und die aktuelle Belegung im Spiel für Bewegung und Interaktion notieren.", "Karte, Ping, Sprache, Inventar, Nachladen und Kontextaktionen einzeln prüfen.", "Fahrzeugsitze und Achsen vor dem Kampf an einem sicheren Ort testen.", "Konflikte lösen, anwenden und nach einem Neustart prüfen, ob alles gespeichert bleibt.", "Aktuelles Layout vor Patch oder Treiberwechsel sichern."),
    "wardogs-fob-guide": task("Eine FOB für den nächsten Kampf bauen", "Eine nützliche FOB verbindet Platzierung, angeforderte Versorgung, freie Zufahrt, Verteidigung und Rückzugsplan. Prüfe Menü und Ressourcen des aktuellen Builds vor Bau oder Upgrade.", "Baukosten, Platzierungsregeln, Upgrades und Strukturen sind buildabhängig.", "Zweck und Position mit Deckung, Zufahrt und Abstand zu erkennbarem Feinddruck wählen.", "Benötigte Ressource bestätigen und Transport vor Baubeginn zuweisen.", "Straßen, Spawn-Ausgänge, Entladefläche und freundliche Bewegung freihalten.", "Nur Schutz und Dienste für das unmittelbare Ziel bauen.", "Versorgungsroute schützen und Reparatur, Verlegung oder Aufgabe vorbereiten."),
    "wardogs-cargo-guide": task("Den vollständigen Frachtkreislauf abschließen", "Eine Frachtfahrt endet erst, wenn die angeforderte Ressource geladen, geliefert, in den nutzbaren Bestand übertragen und das Fahrzeug für den nächsten Auftrag erhalten wurde. Prüfe bei jeder Übergabe die aktuelle Frachtoberfläche.", "Kapazität, Ressourcennamen, Ladesteuerung und Übergabezonen können von Test-Builds abweichen.", "Am Ziel nach aktuell benötigter Ressource und Menge fragen.", "Passenden Transport wählen und Fracht im aktuellen Inventar bestätigen.", "Geschützte Route planen und Entladefläche vor Ankunft freihalten.", "Fracht übertragen und prüfen, ob sich der Zielbestand wirklich ändert.", "Spawn und Versorgungsweg freihalten und das Fahrzeug zurückführen."),
    "wardogs-mortar-guide": task("Einen kontrollierten Mörserauftrag durchführen", "Ein Mörserteam braucht geschützte Stellung, aktuelles Ziel, Beobachter und gemessene Korrekturen. Alte Reichweiten- und Schadensangaben gelten nur als Hinweis, bis der aktuelle Build sie bestätigt.", "Reichweite, Munition, Schaden, Steuerung und Stellungsregeln können sich ändern.", "Mörser mit Deckung, Versorgungszugang und Rückzugsraum platzieren.", "Ziel und Freundpositionen vor dem Laden mit dem Beobachter bestätigen.", "Erste Lösung aus der aktuellen Oberfläche ableiten, nicht blind aus alter Tabelle.", "Kontrollschuss abgeben und jeweils nur eine Variable korrigieren.", "Stoppen oder verlegen, wenn Ziel, Freundlage oder Gegenfeuer es erfordern."),
    "wardogs-helicopter-guide": task("Einen sicheren Hubschraubereinsatz vorbereiten", "Prüfe aktuelle Flugbelegung, übe kontrollierten Start und Landung und wähle vor Passagier- oder Werttransport eine Route mit Abbruchmöglichkeit. Ein erfolgreicher Einsatz erhält das Luftfahrzeug für die nächste Aufgabe.", "Flugverhalten, Geräteunterstützung, Gegenmaßnahmen, Reparatur, Treibstoff und Verfügbarkeit sind buildabhängig.", "Pitch, Roll, Gier, Kollektiv, Sicht, Sitz und Ausstieg im aktuellen Client prüfen.", "Schweben, Start, Anflug, Durchstarten und Landen abseits des Kampfes üben.", "Passagiere über Aufnahme, Ziel, Bedrohungen und Abbruchsignal informieren.", "Route mit Geländedeckung und alternativer Landezone fliegen.", "Absetzen, Bedrohung verlassen, Luftfahrzeug prüfen und nächsten Einsatz bewerten."),
    "wardogs-ps5": task("Konsolenstatus ohne Vermutung prüfen", "Ein PS5-Termin ist nicht offiziell bestätigt. Nutze aktuelle First-Party-Store-Einträge und offizielle WARDOGS-Meldungen; unbelegte Daten und Platzhalter bleiben unbestätigt.", "Leite weder Konsolentermin noch Cross-Play, Controller-Modus oder Verfügbarkeit aus PC Early Access oder Drittseiten ab.", "Offizielle WARDOGS- und Publisher-Kanäle nach plattformspezifischer Meldung prüfen.", "Direkt im PlayStation Store suchen und echte Produktseite von Platzhalter unterscheiden.", "Region, Edition, Cross-Play und Fortschritt im Wortlaut der Meldung lesen.", "Countdowns ohne First-Party-Quelle ignorieren.", "Nach Roadmap- oder Launch-Updates erneut prüfen und Quelldatum bewahren."),
    "wardogs-progression-wipes-guide": task("Fortschritt mit aktuellen Belegen planen", "Lies die aktuelle Rollenstrecke und offizielle Patchnotes, bevor du ein Ziel wählst. Baue eine wiederholbare Route aus Aktionen, die den passenden Balken sichtbar bewegen, ohne Freischaltdauer oder Wipe-Regeln zu erfinden.", "Beta-Tempo, Rollenposition, Level, XP-Quellen und Reset-Regeln sind nicht dauerhaft.", "Ein Rollen- oder Freischaltziel wählen und aktuelle Strecke vor dem Match festhalten.", "Eine teamdienliche Aktion dieser Rolle sauber wiederholen.", "Balken direkt danach prüfen, damit andere Belohnungen das Ergebnis nicht vermischen.", "Ergebnis mit offizieller Änderung vergleichen und Unbekanntes markieren.", "Route nach Fortschrittspatch oder Reset-Meldung neu erstellen."),
    "wardogs-best-weapons-loadouts": task("Ein Loadout für eine Aufgabe bauen", "Das beste Loadout ist das günstigste verlässliche Set für Rolle, Distanz, Munition und Teamaufgabe. Vergleiche aktuelle Händler- und Inventarbelege statt einer dauerhaften Tier-Liste.", "Balance, Preis, Freischaltung, Aufsätze, Munition, Rüstung und Slots können sich ändern.", "Rolle, Distanz und zu lösendes Teamproblem definieren.", "Waffe mit aktuell prüfbarer Munitions- und Magazinbeziehung wählen.", "Schutz, Medizin und ein zweckmäßiges Werkzeug vor Extras ergänzen.", "Gesamtrisiko prüfen und günstige Ersatzoption vorsehen.", "Set in einer konstanten Situation testen und nur das fehlerhafte Teil ändern."),
    "wardogs-equipment-tools-guide": task("Ausrüstung nach Aufgabe wählen", "Trage Werkzeuge für ein benanntes Teamproblem und prüfe Slot, Ladung, Ressource und Interaktion in der Live-Oberfläche. Ausrüstung ohne Aufgabe erhöht Kosten und Komplexität statt Nutzen.", "Ladungen, Kapazitäten, Preise, Prompts, Platzierung und Ziele sind buildabhängig.", "Aufgabe benennen: Medizin, Reparatur, Bau, Sprengung, Aufklärung oder Versorgung.", "Aktuelle Beschreibung, Ressource, Slot und kompatibles Ziel prüfen.", "Nur nötige Hilfsmittel für sichere Ausführung mitnehmen.", "Interaktion sicher testen und Zustandsänderung des Ziels bestätigen.", "Werkzeug ersetzen oder ablegen, wenn sich die Truppaufgabe ändert."),
    "wardogs-crash-fix": task("Fehler vor Einstellungsänderung isolieren", "Trenne zuerst Zugangs- oder Dienstproblem von lokalem Absturz, Freeze oder Startfehler. Erfasse das genaue Symptom und wende jeweils nur eine reversible Maßnahme an.", "Eine Lösung für einen Build oder PC ist kein allgemeingültiger Fix.", "Build, Hardware, Treiber, Fehlertext und letzte Aktion notieren.", "Aktuelle offizielle Hinweise prüfen, um Dienstprobleme auszuschließen.", "Spieldateien prüfen und erforderliche Systemkomponenten aktualisieren.", "Jeweils ein Overlay, Hook oder Hintergrundprogramm deaktivieren und gleich testen.", "Logs und reproduzierbare Schritte sichern, wenn der saubere Test weiter fehlschlägt."),
    "wardogs-map": task("Die Karte in einen Bewegungsplan verwandeln", "Verbinde auf der Karte aktives Ziel, zuverlässigen Spawn, Transport, Versorgung, Gefahren und Rückzugsroute. Prüfe sie nach jedem wichtigen Kontakt neu, weil sich die beste Route schneller ändert als ein statisches Bild.", "Ziele, Routensicherheit, Marker, Gelände und Spawns ändern sich mit Match oder Build.", "Aktives Ziel und unmittelbare Truppaufgabe bestimmen.", "Spawn und Transportroute wählen, die den Trupp zusammenhalten.", "Gefahren, Versorgung, Landezonen und blockierte Wege markieren.", "Vor offenem Gelände oder Fahrzeugeinsatz eine Rückzugsroute planen.", "Nach Kontakt, Zielbewegung oder Spawnverlust Karte öffnen und Route ändern.")
  },
  ru: {
    "wardogs-ammo-reload-guide": task("Проверьте боеприпасы до выхода", "До покупки сопоставьте оружие, магазин и семейство боеприпасов. Проверяйте совместимость в текущем интерфейсе продавца и инвентаря, потому что связи из тестовых сборок могли измениться.", "Старая таблица калибров, название магазина или комплект автора не подтверждают текущую совместимость.", "Выберите оружие и прочитайте текущие метки боеприпасов и магазинов.", "Подберите одно семейство боеприпасов под ожидаемую цель и роль.", "Сначала купите минимальное количество для проверки.", "В безопасном месте зарядите и перезарядите, затем проверьте инвентарь и счетчик.", "После патча снова проверьте продавца перед использованием сохраненного комплекта."),
    "wardogs-beginner-guide": task("Проведите полезный первый матч", "Сначала изучите развертывание, активную цель, движение отряда и один цикл поддержки, а уже затем покупайте специальный комплект. Держитесь рядом с союзниками и сверяйте точные значения с текущим интерфейсом.", "Цены, награды, управление и прогресс из прежних сборок могут не совпадать с текущим клиентом.", "Вступите в отряд, прочитайте задачу и найдите активную Control Zone на карте.", "Выберите доступный комплект с понятной боевой или вспомогательной задачей.", "Используйте организованный спавн или транспорт вместо одиночного забега по открытому месту.", "Помогайте огнем, лечением, снабжением или транспортом рядом с отрядом.", "После смерти измените одну часть плана и сохраните деньги на следующую жизнь."),
    "wardogs-money-guide": task("Сохраняйте деньги и помогайте команде", "Выберите повторяемую работу, держите резерв и считайте чистый результат каждой жизни. Текущие выплаты и цены нужно читать в клиенте, поэтому порядок действий надежнее постоянной таблицы доходов.", "Доходный маршрут одной сборки или матча не гарантирует такую же выплату позже.", "Выберите полезную работу: цель, логистика, транспорт, ремонт или лечение.", "Задайте предел потерь до покупки снаряжения или транспорта.", "Завершите весь цикл услуги и проверьте награду в текущем интерфейсе.", "Вычтите стоимость замены и запишите чистый результат.", "Оставьте маршрут только если он полезен команде и повторяем без безрассудных потерь."),
    "wardogs-best-settings": task("Создайте воспроизводимую базу настроек", "Начните со стабильной базы и меняйте только один параметр графики или экрана за раз. Каждый раз сравнивайте одну и ту же сцену, чтобы не смешивать видимость, плавность кадров и сбои.", "Названия меню и результат зависят от сборки, драйвера, железа, разрешения и нагрузки боя.", "Запишите сборку, железо, драйвер, разрешение и исходный пресет.", "Выберите повторяемую сцену и оцените стабильность и видимость до изменений.", "Измените один параметр, повторите сцену и сохраните только явное улучшение.", "Отдельно проверьте оверлеи и фоновые программы при оставшихся задержках.", "Сохраните рабочую базу и повторите тест после обновления игры или драйвера."),
    "wardogs-community-servers-guide": task("Проверьте сервер сообщества перед входом", "Решайте, что доступно, только по текущему браузеру серверов и официальным сообщениям провайдеров. До игры подтвердите регион, правила, модерацию, прогрессию и данные подключения.", "Провайдеры, RCON, правила прогрессии и фильтры браузера могут измениться после старых анонсов.", "Откройте живой браузер или страницу одобренного провайдера вместо старого списка.", "Прочитайте название, регион, режим, правила и контакт модерации.", "Уточните, отличается ли прогрессия или настройки от официального матчмейкинга.", "Проверьте задержку и стабильность до сбора большой группы.", "Сообщайте о вводящих в заблуждение записях через текущую систему игры или провайдера."),
    "wardogs-controls": task("Проверьте управление в текущем клиенте", "Откройте настройки ввода и перед выходом проверьте текущее назначение в игре для каждого нужного действия. Безопасно протестируйте пехоту, связь, транспорт и специальные действия, не полагаясь на старую таблицу клавиш.", "Назначения, распознавание устройств, подсказки и сбросы могут меняться между сборками.", "Откройте категории ввода и запишите текущее назначение в игре для движения и взаимодействия.", "По очереди проверьте карту, метки, голос, инвентарь, перезарядку и контекстные действия.", "До боя проверьте места и оси транспорта в безопасной зоне.", "Устраните конфликты, примените изменения и после перезапуска проверьте сохранение.", "Сохраните схему перед патчем или обновлением драйвера устройства."),
    "wardogs-fob-guide": task("Постройте FOB для следующего боя", "Полезная FOB сочетает позицию, нужные ресурсы, свободный доступ, оборону и план отхода. До строительства или улучшения проверьте меню и требования текущей сборки.", "Стоимость, правила размещения, улучшения и доступные постройки зависят от сборки.", "Выберите задачу и место с укрытием, доступом и расстоянием от очевидного давления.", "Подтвердите нужный ресурс и назначьте транспорт до начала стройки.", "Оставьте дороги, выходы спавна, разгрузку и движение союзников свободными.", "Стройте только защиту и услуги для ближайшей цели.", "Защищайте снабжение и будьте готовы ремонтировать, переносить или оставить позицию."),
    "wardogs-cargo-guide": task("Завершите полный грузовой цикл", "Рейс завершен, только когда нужный ресурс загружен, доставлен, переведен в доступный запас цели, а транспорт сохранен для следующей задачи. Проверяйте текущий грузовой интерфейс на каждой передаче.", "Вместимость, названия ресурсов, управление загрузкой и зоны передачи могут отличаться от тестовых сборок.", "Узнайте у точки назначения, какой ресурс и объем ей сейчас нужен.", "Выберите совместимый транспорт и подтвердите груз в его текущем инвентаре.", "Спланируйте защищенный маршрут и освободите место разгрузки.", "Передайте груз и проверьте фактическое изменение ресурса цели.", "Не блокируйте спавн или снабжение и верните транспорт для нового рейса."),
    "wardogs-mortar-guide": task("Проведите управляемую минометную задачу", "Расчету нужны защищенная позиция, актуальная цель, наблюдатель и измеренные поправки. Старые таблицы дальности и урона остаются справкой, пока их не подтвердит текущая сборка.", "Дальность, боеприпасы, урон, управление и правила установки могут измениться.", "Разместите миномет в укрытии с доступом к снабжению и выходом.", "До заряжания подтвердите цель и союзников с наблюдателем.", "Получите первое решение из текущего интерфейса, а не слепо из старой таблицы.", "Сделайте контрольный выстрел и меняйте по одной величине.", "Остановитесь или смените позицию при движении цели, союзников или ответном огне."),
    "wardogs-helicopter-guide": task("Подготовьте безопасный вертолетный вылет", "Проверьте текущие назначения, отработайте управляемые взлет и посадку и выберите маршрут с вариантом отмены до перевозки отряда или дорогого ресурса. Успешный вылет сохраняет машину для следующей задачи.", "Физика полета, устройства, контрмеры, ремонт, топливо и доступность зависят от сборки.", "Проверьте тангаж, крен, рыскание, тягу, обзор, места и выход в текущем клиенте.", "В стороне от боя отработайте висение, взлет, заход, уход и посадку.", "Сообщите пассажирам точку, цель, угрозы и сигнал отмены.", "Летите с укрытием рельефом и запасной площадкой.", "Высадите, выйдите из угрозы, осмотрите машину и оцените следующий вылет."),
    "wardogs-ps5": task("Проверьте статус консольной версии без догадок", "Дата выхода на PS5 официально не подтверждена. Используйте актуальные магазины платформы и официальные объявления WARDOGS, а неподтвержденные даты и заглушки считайте неизвестными.", "Не выводите дату, кроссплей, режим контроллера или доступность из PC Early Access или сторонних страниц.", "Проверьте официальные каналы WARDOGS и издателя на объявление платформы.", "Ищите прямо в PlayStation Store и отличайте продукт от заглушки.", "Читайте сведения о регионе, издании, кроссплее и прогрессе в самом объявлении.", "Игнорируйте обратные отсчеты без ссылки на первичный источник.", "Повторяйте проверку после дорожной карты или запуска и сохраняйте дату источника."),
    "wardogs-progression-wipes-guide": task("Планируйте прогресс по текущим данным", "До выбора цели прочитайте текущую ветку роли и официальные заметки. Стройте повторяемый путь из действий, которые видимо двигают нужную шкалу, не придумывая время открытия или правила сброса.", "Скорость Beta, расположение ролей, уровни, XP и политика сбросов не являются постоянными.", "Выберите цель роли или открытия и зафиксируйте текущую ветку до матча.", "Чисто повторите одно полезное команде действие этой роли.", "Сразу проверьте шкалу, чтобы не смешать другие награды.", "Сравните результат с последними официальными изменениями и отметьте неизвестное.", "Пересоберите путь после патча прогресса или объявления сброса."),
    "wardogs-best-weapons-loadouts": task("Соберите комплект под одну задачу", "Лучший комплект — самый дешевый надежный набор под роль, дистанцию, боеприпасы и задачу команды. Сверяйте текущего продавца и инвентарь вместо постоянного тир-листа.", "Баланс, цена, открытия, модули, боеприпасы, броня и слоты могут измениться.", "Определите роль, дистанцию и проблему команды.", "Выберите оружие с проверяемой сейчас связью боеприпасов и магазина.", "Добавьте защиту, медицину и один целевой инструмент до необязательных вещей.", "Оцените риск замены и подготовьте дешевый запасной вариант.", "Проверьте комплект в одной ситуации и меняйте только неработающую часть."),
    "wardogs-equipment-tools-guide": task("Выбирайте снаряжение по задаче", "Берите инструменты для конкретной проблемы команды и проверяйте их слот, заряд, ресурс и условия взаимодействия в живом интерфейсе. Лишняя вещь без задачи увеличивает стоимость и сложность.", "Заряды, емкость, цена, подсказки, размещение и совместимые цели зависят от сборки.", "Назовите задачу: медицина, ремонт, стройка, подрыв, разведка или снабжение.", "Проверьте описание, ресурс, слот и совместимую цель.", "Возьмите минимум расходников для безопасного выполнения.", "Проверьте взаимодействие безопасно и подтвердите изменение состояния цели.", "Замените или уберите инструмент, когда задача отряда меняется."),
    "wardogs-crash-fix": task("Изолируйте сбой до изменения настроек", "Сначала отделите проблему доступа или сервиса от локального вылета, зависания или ошибки запуска. Запишите точный симптом, затем применяйте по одному обратимому исправлению и повторяйте один тест.", "Решение для одного железа или сборки не является универсальным.", "Запишите сборку, железо, драйвер, текст ошибки и последнее действие.", "Проверьте текущие официальные сообщения, чтобы исключить сбой сервиса.", "Проверьте файлы игры и обновите необходимые компоненты системы.", "Отключайте по одному оверлею, хуку или фоновому приложению и повторяйте тест.", "Сохраните логи и воспроизводимые шаги, если чистый тест снова падает."),
    "wardogs-map": task("Превратите карту в план движения", "Свяжите на карте активную цель, надежный спавн, транспорт, снабжение, угрозы и путь отхода. Открывайте ее после каждого серьезного контакта, потому что полезный маршрут меняется быстрее статичной картинки.", "Цели, безопасность маршрута, метки, рельеф и спавны меняются в матче или сборке.", "Найдите активную цель и ближайшую задачу отряда.", "Выберите спавн и транспортный путь, сохраняющий отряд вместе.", "Отметьте угрозы, снабжение, посадочные зоны и закрытые подходы.", "До открытой местности или ввода машины подготовьте путь отхода.", "После боя, движения цели или потери спавна снова откройте карту и измените маршрут.")
  },
  "pt-br": {
    "wardogs-ammo-reload-guide": task("Confira a munição antes de sair", "Relacione a arma, o carregador e a família de munição antes de comprar ou entrar em campo. Confira cada indicação na loja e no inventário atuais, pois relações de builds de teste podem ter mudado.", "Uma lista antiga de calibres, o nome do carregador ou um kit de criador não comprovam compatibilidade atual.", "Identifique a arma e leia as indicações atuais de munição e carregador.", "Escolha uma família de munição para o alvo e a função esperados.", "Compre primeiro uma quantidade mínima para teste.", "Carregue e recarregue em local seguro, confirmando inventário e contador.", "Após um patch, confira novamente a loja antes de reutilizar um kit salvo."),
    "wardogs-beginner-guide": task("Faça uma primeira partida útil", "Aprenda a entrar, localizar o objetivo, mover-se com o esquadrão e completar um ciclo de suporte antes de comprar equipamento especializado. Fique perto da equipe e use a interface atual para valores exatos.", "Preços, recompensas, controles e progressão de builds antigas podem divergir do cliente atual.", "Entre em um esquadrão, leia a tarefa e encontre a Control Zone ativa no mapa.", "Escolha um kit acessível com propósito claro de infantaria ou suporte.", "Use spawn ou transporte organizado em vez de cruzar terreno aberto sozinho.", "Troque apoio, reviva, reabasteça ou transporte perto do esquadrão.", "Após morrer, mude uma parte do plano e preserve dinheiro para a próxima vida."),
    "wardogs-money-guide": task("Proteja o dinheiro criando valor para a equipe", "Escolha um trabalho repetível, mantenha uma reserva e meça o resultado líquido de cada vida. Pagamentos e preços atuais devem ser lidos no cliente, por isso o método vale mais que uma tabela permanente.", "Uma rota lucrativa em uma build ou partida não garante o mesmo pagamento depois.", "Escolha um trabalho útil: objetivo, logística, transporte, reparo ou revives.", "Defina um limite de perda antes de comprar equipamento ou veículo.", "Conclua o ciclo completo e confirme a recompensa na interface atual.", "Desconte o custo de reposição e registre o resultado líquido.", "Mantenha a rota apenas se ela ajudar a equipe e puder ser repetida sem perdas imprudentes."),
    "wardogs-best-settings": task("Crie uma base de configurações reproduzível", "Comece com uma base estável e altere somente uma opção gráfica ou de exibição por vez. Compare a mesma cena após cada mudança para não misturar visibilidade, ritmo de quadros e travamentos.", "Nomes do menu e resultados dependem da build, driver, hardware, resolução e carga da batalha.", "Registre build, hardware, driver, resolução e preset inicial.", "Escolha uma cena repetível e anote estabilidade e visibilidade antes das mudanças.", "Altere uma opção, repita a cena e mantenha apenas melhora clara.", "Teste overlays e programas em segundo plano separadamente se houver stutter.", "Salve a base funcional e teste outra vez após atualizar jogo ou driver."),
    "wardogs-community-servers-guide": task("Verifique o servidor da comunidade antes de entrar", "Use apenas o navegador atual e avisos oficiais dos provedores para saber o que está disponível. Confirme região, regras, moderação, progressão e conexão antes de dedicar uma sessão.", "Provedores, RCON, regras de progressão e filtros podem mudar após anúncios antigos.", "Abra o navegador ao vivo ou a página de um provedor aprovado, não uma lista antiga.", "Leia nome, região, modo, regras e contato da moderação.", "Confirme diferenças de progressão ou configurações em relação ao matchmaking oficial.", "Teste latência e estabilidade antes de organizar um grupo maior.", "Denuncie anúncios enganosos pelo processo atual do jogo ou provedor."),
    "wardogs-controls": task("Verifique os controles no cliente atual", "Abra as opções de entrada e confirme a vinculação atual no jogo para cada ação necessária antes de sair. Teste infantaria, comunicação, veículos e ações especiais em local seguro, sem presumir que uma lista antiga ainda vale.", "Vinculações, detecção de dispositivos, avisos e comportamento de reset podem mudar entre builds.", "Abra cada categoria e registre a vinculação atual no jogo para movimento e interação.", "Confira mapa, marcação, voz, inventário, recarga e ações contextuais separadamente.", "Teste assentos e eixos de veículos em local seguro antes do combate.", "Resolva conflitos, aplique e reinicie uma vez para confirmar que ficaram salvos.", "Guarde uma imagem do layout antes de patch ou mudança de driver."),
    "wardogs-fob-guide": task("Construa uma FOB para a próxima luta", "Uma FOB útil combina posição, suprimento solicitado, acesso livre, defesa e plano de recuperação. Confira o menu e os recursos da build atual antes de construir ou melhorar.", "Custos, regras de posicionamento, caminhos de melhoria e estruturas dependem da build.", "Escolha propósito e local com cobertura, acesso e distância da pressão óbvia.", "Confirme o recurso pedido e defina o transporte antes da construção.", "Mantenha estradas, saídas de spawn, descarga e movimento aliados livres.", "Construa somente proteção e serviços necessários ao objetivo imediato.", "Defenda a rota e prepare reparo, mudança ou abandono quando o valor da posição mudar."),
    "wardogs-cargo-guide": task("Conclua todo o ciclo de carga", "Uma viagem termina apenas quando o recurso pedido é carregado, entregue, transferido ao estoque utilizável e o transporte fica disponível para outra tarefa. Confira a interface atual em cada passagem.", "Capacidade, nomes dos recursos, controles de carga e zonas de transferência podem diferir das builds gravadas.", "Pergunte ao destino qual recurso e quantidade são necessários agora.", "Escolha transporte compatível e confirme a carga no inventário atual.", "Planeje rota protegida e libere a área de descarga antes de chegar.", "Transfira e confirme que o total do destino realmente mudou.", "Saia sem bloquear spawn ou suprimento e devolva o veículo para outro ciclo."),
    "wardogs-mortar-guide": task("Execute uma missão controlada de morteiro", "A equipe precisa de posição segura, alvo atual, observador e correções medidas. Use tabelas antigas de alcance e dano apenas como referência até a build atual confirmá-las.", "Alcance, suprimento, dano, controles e regras de posicionamento podem mudar.", "Posicione com cobertura, acesso a suprimento e espaço para sair.", "Confirme alvo e aliados com o observador antes de carregar.", "Use a interface atual para a solução inicial, sem copiar cegamente uma tabela antiga.", "Dispare um tiro controlado e ajuste uma variável por vez.", "Pare ou reposicione se o alvo mover, aliados entrarem ou houver contrafogo."),
    "wardogs-helicopter-guide": task("Prepare uma missão segura de helicóptero", "Confira os comandos atuais, pratique decolagem e pouso controlados e escolha uma rota com opção de aborto antes de transportar um esquadrão ou ativo caro. Uma missão boa preserva a aeronave para a próxima tarefa.", "Pilotagem, dispositivos, contramedidas, reparo, combustível e disponibilidade dependem da build.", "Confira pitch, roll, yaw, coletivo, visão, assento e saída no cliente atual.", "Pratique pairar, decolar, aproximar, arremeter e pousar longe da luta.", "Informe passageiros sobre embarque, destino, ameaças e sinal de aborto.", "Voe usando terreno e uma área alternativa de pouso.", "Desembarque, saia da ameaça, inspecione a aeronave e avalie a próxima missão."),
    "wardogs-ps5": task("Confira o status do console sem adivinhar", "Uma data de lançamento no PS5 não foi oficialmente confirmada. Use lojas da própria plataforma e anúncios oficiais de WARDOGS; datas sem fonte e páginas provisórias continuam não confirmadas.", "Não deduza data, cross-play, modo de controle ou disponibilidade do Acesso Antecipado no PC ou de listas de terceiros.", "Confira canais oficiais de WARDOGS e da publicadora por anúncio da plataforma.", "Pesquise diretamente na PlayStation Store e diferencie produto real de provisório.", "Leia região, edição, cross-play e progressão no texto do anúncio.", "Ignore contagens ou datas sem fonte primária.", "Revise após grandes anúncios de roadmap ou lançamento e preserve a data da fonte."),
    "wardogs-progression-wipes-guide": task("Planeje a progressão com evidência atual", "Leia a trilha atual da função e as notas oficiais antes de escolher a meta. Monte uma rota repetível com ações que movam visivelmente a barra relevante, sem inventar tempo de desbloqueio ou regras de wipe.", "Velocidade do Beta, posição das funções, níveis, fontes de XP e política de reset não são permanentes.", "Escolha uma meta de função ou desbloqueio e registre a trilha antes da partida.", "Repita com clareza uma ação útil ligada à função.", "Confira a barra logo depois para não misturar outras recompensas.", "Compare com as mudanças oficiais e marque o que segue desconhecido.", "Refaça a rota após patch de progressão ou anúncio de reset."),
    "wardogs-best-weapons-loadouts": task("Monte um kit para uma tarefa", "O melhor kit é o conjunto confiável mais barato que atende função, distância, munição e tarefa da equipe. Compare loja e inventário atuais em vez de copiar uma tier list permanente.", "Balanceamento, preço, desbloqueio, acessórios, munição, armadura e slots podem mudar.", "Defina função, distância e problema da equipe.", "Escolha arma cuja relação com munição e carregador possa ser verificada agora.", "Adicione proteção, medicina e uma ferramenta útil antes de extras.", "Confira risco total de reposição e prepare uma alternativa barata.", "Teste em uma situação consistente e mude apenas a parte que falhou."),
    "wardogs-equipment-tools-guide": task("Escolha equipamento pela tarefa", "Leve ferramentas para um problema específico e confira slot, carga, recurso e interação na interface ao vivo. Equipamento extra sem função aumenta custo e complexidade em vez de valor.", "Cargas, capacidades, preços, avisos, posicionamento e alvos compatíveis dependem da build.", "Defina a tarefa: medicina, reparo, construção, demolição, reconhecimento ou suprimento.", "Confira descrição, recurso, slot e alvo compatível atuais.", "Leve somente os consumíveis necessários para concluir com segurança.", "Teste a interação em contexto seguro e confirme a mudança no alvo.", "Troque ou remova a ferramenta quando a tarefa do esquadrão mudar."),
    "wardogs-crash-fix": task("Isole a falha antes de mudar configurações", "Primeiro separe problema de acesso ou serviço de travamento, congelamento ou falha local de abertura. Registre o sintoma exato, aplique uma correção reversível por vez e repita o mesmo teste.", "Uma solução para um hardware ou build não é uma correção universal.", "Registre build, hardware, driver, erro e última ação antes da falha.", "Confira avisos oficiais atuais para excluir incidentes de serviço.", "Verifique arquivos e atualize componentes necessários do sistema.", "Desative um overlay, hook ou programa em segundo plano por vez e repita.", "Preserve logs e etapas reproduzíveis se o teste limpo continuar falhando."),
    "wardogs-map": task("Transforme o mapa em um plano de movimento", "Use o mapa para ligar objetivo ativo, spawn confiável, transporte, suprimento, ameaças e rota de recuo. Confira outra vez após cada contato importante, pois a melhor rota muda mais rápido que uma imagem estática.", "Objetivos, segurança, marcadores, terreno e spawns mudam com a partida ou build.", "Identifique o objetivo ativo e a tarefa imediata do esquadrão.", "Escolha spawn e transporte que mantenham o grupo unido.", "Marque ameaças, suprimentos, pousos e acessos bloqueados.", "Planeje uma rota de recuo antes de terreno aberto ou de comprometer um veículo.", "Após contato, movimento do objetivo ou perda do spawn, reabra o mapa e revise." )
  },
  ja: {
    "wardogs-ammo-reload-guide": task("出撃前に弾薬を確認する", "購入や出撃の前に、武器・マガジン・弾薬系統を対応させます。テストビルド時の関係は変更されるため、現在のショップとインベントリで互換表示を確認してください。", "古い口径表、マガジン名、クリエイターの装備だけでは現行互換性を証明できません。", "武器を特定し、現在の弾薬とマガジン表示を読む。", "想定する標的と役割に合う弾薬系統を1つ選ぶ。", "最初は確認用の最小量だけ購入する。", "安全な場所で装填とリロードを行い、インベントリと残弾表示を確認する。", "パッチ後は保存済み装備を使う前にショップを再確認する。"),
    "wardogs-beginner-guide": task("最初の試合で役立つ動きをする", "専門装備を買う前に、出撃、現在の目標、分隊移動、1つの支援ループを学びます。味方の近くで行動し、正確な数値は現在の画面で確認してください。", "過去ビルドの価格、報酬、操作、進行は現行クライアントと異なる場合があります。", "分隊に入り、任務を読み、マップで現在のControl Zoneを確認する。", "歩兵または支援の目的が明確な手頃な装備を選ぶ。", "単独で開けた場所を走らず、整理されたスポーンか輸送を使う。", "分隊の近くで援護、蘇生、補給、輸送を行う。", "死亡後は計画を1つだけ変え、次の出撃資金を残す。"),
    "wardogs-money-guide": task("資金を守りながらチームへ価値を出す", "繰り返せる仕事を1つ選び、予備資金を残し、各ライフの純結果を測ります。現在の報酬と価格はクライアントで確認し、固定の稼ぎ表ではなく手順を使ってください。", "あるビルドや試合で利益が出たルートが、次も同じ報酬になるとは限りません。", "目標支援、兵站、輸送、修理、蘇生から役立つ仕事を選ぶ。", "装備や車両を買う前に損失上限を決める。", "サービス全体を完了し、現在の画面で報酬を確認する。", "再購入費を差し引き、総収入ではなく純結果を記録する。", "チームに役立ち、無謀な損失なしで繰り返せる場合だけ続ける。"),
    "wardogs-best-settings": task("再現できる設定基準を作る", "安定した基準から始め、グラフィックまたは表示設定を1項目ずつ変更します。毎回同じ場面を比較し、視認性、フレームの安定、クラッシュを混同しないでください。", "メニュー名と性能結果は、ビルド、ドライバー、機器、解像度、戦闘負荷に依存します。", "ビルド、機器、ドライバー、解像度、開始プリセットを記録する。", "再現できる場面を選び、変更前の安定性と視認性を確認する。", "設定を1つ変え、同じ場面で明確に改善した場合だけ残す。", "問題が残る場合はオーバーレイと常駐ソフトを個別に試す。", "動作した基準を保存し、ゲームやドライバー更新後に再試験する。"),
    "wardogs-community-servers-guide": task("参加前にコミュニティサーバーを確認する", "利用可否は現在のサーバーブラウザーと公式プロバイダー告知で判断します。地域、ルール、管理、進行、接続条件を確認してから参加してください。", "プロバイダー、RCON、進行ルール、ブラウザーフィルターは過去の告知から変わる場合があります。", "古い一覧ではなく、ライブブラウザーか承認済みプロバイダーを開く。", "名前、地域、モード、ルール、管理連絡先を読む。", "進行やカスタム設定が公式マッチメイキングと異なるか確認する。", "大人数を集める前に遅延と接続安定性を試す。", "誤解を招く掲載は現在のゲームまたはプロバイダー手順で報告する。"),
    "wardogs-controls": task("現行クライアントで操作を確認する", "入力設定を開き、出撃前に必要な各操作の現在のゲーム内の割り当てを確認します。古いキー一覧を前提にせず、歩兵、通信、車両、専門操作を安全な場所で試してください。", "割り当て、機器認識、表示、リセット動作はビルド間で変わる場合があります。", "入力カテゴリを開き、移動と操作の現在のゲーム内の割り当てを記録する。", "マップ、ピン、ボイス、インベントリ、リロード、状況操作を個別に確認する。", "戦闘前に安全な場所で車両座席と軸を試す。", "競合を解消して適用し、再起動後も保存されているか確認する。", "パッチや機器ドライバー変更前に現在の配置を保存する。"),
    "wardogs-fob-guide": task("次の戦闘を支えるFOBを作る", "有用なFOBには、配置、必要な補給、通行、守備、撤収計画が必要です。建設や強化の前に、現行ビルドのメニューと資源条件を確認してください。", "建設費、配置条件、強化経路、利用可能な施設はビルド依存です。", "目的を決め、遮蔽、アクセス、敵圧力からの距離を考えて場所を選ぶ。", "必要な資源を確認し、建設前に輸送担当を決める。", "道路、スポーン出口、荷下ろし、味方の動線を空ける。", "直近の目標に必要な防御と機能だけを建てる。", "補給路を守り、修理、移転、放棄の判断を準備する。"),
    "wardogs-cargo-guide": task("貨物ループ全体を完了する", "要求された資源を積み、届け、使用可能な保管先へ移し、車両を次の任務に残して初めて輸送完了です。受け渡しごとに現在の貨物画面を確認してください。", "車両容量、資源名、積載操作、受け渡し区域は録画時のビルドと異なる場合があります。", "目的地に現在必要な資源と量を確認する。", "対応する輸送手段を選び、現在のインベントリに貨物が入ったか確認する。", "守れるルートを決め、到着前に荷下ろし場所を空ける。", "移送後、目的地の資源表示が実際に増えたか確認する。", "スポーンや補給路を塞がず離脱し、車両を次の輸送へ戻す。"),
    "wardogs-mortar-guide": task("管理された迫撃砲任務を行う", "迫撃砲班には安全な陣地、現在の標的、観測員、測定した修正が必要です。古い射程表やダメージ情報は、現行ビルドで確認するまで参考に留めてください。", "射程、弾薬補給、ダメージ、操作、設置条件は変更される場合があります。", "遮蔽、補給、退避空間がある場所へ迫撃砲を置く。", "装填前に観測員と標的および味方位置を確認する。", "古い表を盲信せず、現在の画面で初期解を作る。", "確認射撃を行い、変数を1つずつ修正する。", "標的移動、味方進入、対砲撃があれば停止または移動する。"),
    "wardogs-helicopter-guide": task("安全なヘリコプター任務を準備する", "現在の飛行割り当てを確認し、安定した離着陸を練習し、分隊や高価な資産を運ぶ前に中止可能なルートを選びます。成功した任務は次の仕事へ機体を残します。", "飛行挙動、機器対応、対抗手段、修理、燃料、機体の利用可否はビルド依存です。", "現行クライアントでピッチ、ロール、ヨー、コレクティブ、視点、座席、降車を確認する。", "戦闘外でホバリング、離陸、進入、復行、着陸を練習する。", "乗員へ乗降地点、目的地、脅威、中止合図を伝える。", "地形遮蔽と代替着陸地点があるルートを飛ぶ。", "降ろしたら脅威から離れ、機体を確認して次の任務を判断する。"),
    "wardogs-ps5": task("推測せずコンソール状況を確認する", "PS5版の発売日は公式には確認されていません。現在の公式ストアとWARDOGS公式告知を使い、出典のない日付や仮ページは未確認として扱ってください。", "PC Early Accessや第三者一覧から、コンソール日程、クロスプレイ、操作モード、販売状況を推測しないでください。", "WARDOGSとパブリッシャーの公式チャンネルで機種別告知を探す。", "PlayStation Storeを直接検索し、正式商品と仮ページを区別する。", "地域、版、クロスプレイ、進行情報を告知本文で確認する。", "一次情報へリンクしないカウントダウンや日付を無視する。", "ロードマップや発売更新後に再確認し、情報源の日付を残す。"),
    "wardogs-progression-wipes-guide": task("現行証拠から進行を計画する", "目標を決める前に、現在の役割トラックと公式パッチノートを読みます。解除時間やワイプ規則を推測せず、対象バーが実際に動く行動で繰り返せるルートを作ってください。", "Betaの進行速度、役割位置、解除レベル、XP源、リセット方針を恒久仕様として扱えません。", "役割または解除目標を1つ選び、試合前のトラックを記録する。", "その役割に関連する有用な行動を1つ明確に繰り返す。", "別報酬が混ざる前に、行動後すぐバーを確認する。", "結果を最新の公式変更と比較し、不明点を明記する。", "進行パッチやリセット告知後にルートを作り直す。"),
    "wardogs-best-weapons-loadouts": task("1つの仕事向けに装備を組む", "最良の装備は、役割、距離、弾薬関係、チーム任務に合う最小コストの信頼できるセットです。固定Tier表ではなく、現在のショップとインベントリを比較してください。", "武器バランス、価格、解除、アタッチメント、弾薬、装甲、スロットは変更されます。", "役割、交戦距離、解決するチーム課題を決める。", "現在確認できる弾薬とマガジン関係を持つ武器を選ぶ。", "追加品より先に防護、医療、目的のある道具を加える。", "再購入リスクを確認し、安価な予備構成を用意する。", "同じ状況で試し、失敗した部分だけ変更する。"),
    "wardogs-equipment-tools-guide": task("戦場任務に合わせて装備を選ぶ", "名前を付けられるチーム課題を解決する道具だけを持ち、現在の画面でスロット、回数、資源、操作条件を確認します。仕事のない余分な装備は価値より費用と複雑さを増やします。", "回数、容量、費用、操作表示、設置条件、対応対象はビルド依存です。", "医療、修理、建設、破壊、偵察、補給から任務を決める。", "現在の説明、必要資源、スロット、対応対象を確認する。", "安全に完了するための最小限の消耗品を持つ。", "安全な状況で操作し、対象の状態変化を確認する。", "分隊任務が変わったら道具を交換または外す。"),
    "wardogs-crash-fix": task("設定を変える前に障害を切り分ける", "まずアクセスやサービスの問題と、ローカルのクラッシュ、フリーズ、起動失敗を分けます。正確な症状を記録し、元に戻せる対策を1つずつ適用して同じ手順を再試験してください。", "特定の機器やビルドで効いた回避策が万能な修正とは限りません。", "ビルド、機器、ドライバー、エラー文、直前操作を記録する。", "現在の公式告知でアクセスやサービス障害を除外する。", "ゲームファイルを確認し、必要なシステム要素を更新する。", "オーバーレイ、フック、常駐ソフトを1つずつ止めて再試験する。", "クリーンな試験でも失敗する場合はログと再現手順を保存する。"),
    "wardogs-map": task("マップを移動計画に変える", "マップ上で現在の目標、確実なスポーン、輸送、補給、脅威、退路をつなぎます。有用なルートは静止画像より早く変わるため、大きな接触後は毎回確認してください。", "目標位置、ルート安全性、マーカー、地形、スポーンは試合やビルドで変わります。", "現在の目標と分隊の直近任務を確認する。", "分隊をまとめられるスポーンと輸送ルートを選ぶ。", "既知の脅威、補給、着陸場所、封鎖経路をマークする。", "開けた場所や車両投入前に退路を1つ用意する。", "接触、目標移動、スポーン喪失後に再度マップを開き修正する。" )
  },
  "zh-cn": {
    "wardogs-ammo-reload-guide": task("出发前先核对弹药", "购买或部署前，先对应武器、弹匣和弹药系列。测试版本记录中的兼容关系可能变化，因此每一项都要以当前商店和背包界面为准。", "旧口径表、弹匣名称或创作者配装都不能单独证明当前兼容性。", "确认武器，并读取当前界面中的弹药和弹匣说明。", "按预期目标和职责只选择一个弹药系列。", "先购买最低测试量，不要一次用完整套预算。", "在安全位置装填和换弹，确认背包与弹药计数同步变化。", "版本更新后先重新核对商店，再使用保存的配装。"),
    "wardogs-beginner-guide": task("完成一场有价值的新手对局", "先学会部署、识别当前目标、跟随小队和完成一种支援循环，再购买专业装备。精确数值以当前界面为准，不要直接套用旧版新手视频。", "旧版本中的价格、奖励、操作和进度可能已经与当前客户端不同。", "加入小队，阅读任务，并在地图上确认当前 Control Zone。", "选择一套便宜且有明确步兵或支援用途的配装。", "使用有组织的出生点或运输路线，不要独自穿越开阔地。", "围绕小队完成掩护、救援、补给或运输，不追逐孤立交火。", "阵亡后只改变计划中的一项，并为下一次出击保留资金。"),
    "wardogs-money-guide": task("在创造团队价值时保护资金", "选择一种可重复工作，保留资金储备，并计算每次生命结束后的净结果。当前收益和价格必须查看客户端，因此方法比永久收益表更可靠。", "某个版本或某场对局赚钱，不代表下一次仍有相同收益。", "选择目标支援、后勤、运输、维修或救援中的一种团队工作。", "购买装备或载具前设定可承受的损失上限。", "完成整个服务循环，并在当前界面确认奖励。", "扣除补购成本，记录净结果而不是毛收入。", "只有路线持续帮助团队且不会造成鲁莽损失时才重复使用。"),
    "wardogs-best-settings": task("建立可重复验证的设置基线", "从稳定基线开始，每次只改一个画面或显示选项。每次都比较同一场景，避免把可见度、帧时间和崩溃混成一个猜测。", "菜单名称和性能结果取决于当前版本、驱动、硬件、分辨率与战场负载。", "记录当前版本、硬件、驱动、分辨率和初始预设。", "选择可重复的场景，在改动前记录稳定度与可见度。", "只改一项并重复场景，只有明确改善时才保留。", "仍有卡顿时，分别测试覆盖层和后台程序。", "保存有效基线，并在游戏或驱动更新后重新测试。"),
    "wardogs-community-servers-guide": task("加入前核验社区服务器", "只用当前服务器浏览器和官方服务商公告判断可用情况。投入一场完整游戏前，确认地区、规则、管理、进度处理和连接信息。", "服务商、RCON、进度规则和浏览器筛选都可能与旧公告不同。", "查看实时浏览器或获准服务商页面，不使用旧服务器列表。", "加入前阅读名称、地区、模式、规则和管理联系方式。", "确认进度或自定义设置是否区别于官方匹配。", "组织大队伍前，先测试延迟与连接稳定性。", "通过当前服务商或游戏内流程举报误导性条目。"),
    "wardogs-controls": task("在当前客户端核对操作", "进入设置后，逐项核对出击所需动作的当前游戏内绑定。不要假设旧键位表仍然有效，应在安全位置测试步兵、沟通、载具和专业操作。", "绑定、设备识别、提示和重置行为都可能随版本变化。", "打开每个输入类别，记录移动与互动的当前游戏内绑定。", "逐项验证地图、标记、语音、背包、换弹和情境动作。", "进入战斗前，在安全位置测试载具座位与控制轴。", "解决冲突并应用，重启一次确认设置仍然保存。", "补丁或设备驱动变更前保存当前布局截图。"),
    "wardogs-fob-guide": task("建造能支持下一场战斗的 FOB", "有效 FOB 需要合理位置、正确补给、畅通入口、防守和撤离方案。放置或升级前，先核对当前版本菜单与资源要求。", "建造成本、有效放置规则、升级路径和可用设施都与版本相关。", "明确用途，选择有掩体、运输入口且不暴露在明显压力下的位置。", "开工前确认所需资源类型并安排运输。", "保持道路、出生出口、卸货区和友军动线畅通。", "只建造当前目标所需的防护与服务设施。", "保护补给路线，并准备维修、迁移或放弃失去价值的阵地。"),
    "wardogs-cargo-guide": task("完成完整货运循环", "只有所需资源被装载、送达、转入目的地可用库存，并且运输工具能继续执行任务，货运才算完成。每次交接都要查看当前货运界面。", "载具容量、资源名称、装载操作和转移区域可能与测试录像不同。", "询问目的地当前需要的资源类型与数量。", "选择兼容运输工具，并确认货物出现在当前库存中。", "规划受保护路线，到达前清空卸货区域。", "完成转移并确认目的地资源数字确实变化。", "离开时不堵住出生点或补给线，将载具带回下一轮。"),
    "wardogs-mortar-guide": task("执行可控的迫击炮任务", "迫击炮小组需要安全阵地、当前目标、观察员和可测量的修正。旧射程表与伤害结论只能参考，必须由当前版本重新确认。", "射程行为、弹药补给、伤害、操作和部署规则都可能改变。", "选择有掩体、补给通道和撤离空间的位置。", "装填前与观察员确认目标和友军位置。", "使用当前界面建立初始解算，不盲抄旧表。", "先打一发受控试射，每次只修正一个变量。", "目标移动、友军进入或遭遇反炮火时停止或转移。"),
    "wardogs-helicopter-guide": task("准备一次安全的直升机任务", "先核对当前飞行绑定，练习可控起降，并在运输小队或高价值资产前选择带中止方案的路线。成功任务应让飞行器还能继续服务下一项工作。", "飞行手感、设备支持、反制、维修、燃料和机型可用性都与版本相关。", "在当前客户端确认俯仰、横滚、偏航、升力、视角、座位和离机绑定。", "远离战斗练习悬停、起飞、进近、复飞和着陆。", "向乘员说明上车点、目的地、威胁和中止信号。", "选择有地形掩护与备用着陆区的路线。", "投送后离开威胁区，检查飞行器并判断下一次任务是否安全。"),
    "wardogs-ps5": task("不靠猜测核对主机状态", "PS5 发售日期尚未得到官方确认。只使用当前第一方商店页面和 WARDOGS 官方公告，没有来源的日期与占位页面仍按未确认处理。", "不要根据 PC 抢先体验或第三方列表推断主机日期、跨平台、手柄模式或商店可用性。", "检查 WARDOGS 与发行商官方渠道是否有平台专门公告。", "直接搜索 PlayStation Store，区分真实商品页与占位或提及。", "从公告原文核对地区、版本、跨平台和进度信息。", "忽略没有链接到一手来源的倒计时或发售日期。", "重大路线图或上线更新后重新核验，并保留来源日期。"),
    "wardogs-progression-wipes-guide": task("根据当前证据规划进度", "选择目标前先读取当前职业路线与官方更新说明。只围绕能明确推动对应进度条的行动建立可重复路线，不编造解锁耗时或删档规则。", "Beta 进度速度、职业位置、解锁等级、XP 来源与重置政策都不能视为永久规则。", "选择一个职业或解锁目标，并在对局前记录当前路线。", "清晰重复一种与该职业有关且对团队有用的行动。", "行动后立即检查进度条，避免其他奖励混入结果。", "将结果与最新官方变更对照，并明确标记未知项。", "进度补丁或重置公告后重新建立路线。"),
    "wardogs-best-weapons-loadouts": task("为一个明确任务组建配装", "最佳配装是能满足职责、距离、弹药关系和团队任务的最低成本可靠组合。比较当前商店与背包证据，不复制永久武器排名。", "武器平衡、价格、解锁、配件、弹药、护甲和槽位都可能随版本改变。", "定义职责、交战距离和需要解决的团队问题。", "选择当前可核实弹药与弹匣关系的武器。", "先加入防护、医疗与一种有明确用途的工具，再考虑额外物品。", "检查整套补购风险，并准备低成本备用方案。", "在一致场景中测试，只替换实际失败的部分。"),
    "wardogs-equipment-tools-guide": task("按战场任务选择装备", "只携带能解决明确团队问题的工具，并在当前界面确认槽位、次数、资源和互动要求。没有任务的额外装备只会增加成本与复杂度。", "次数、容量、价格、互动提示、放置规则和兼容目标都与版本相关。", "先确定任务：医疗、维修、建造、爆破、侦察或补给。", "查看当前物品说明、所需资源、槽位和兼容目标。", "只携带安全完成任务所需的最低配套物资。", "在安全情境测试互动，并确认目标状态发生变化。", "小队任务变化后更换或移除不再有用的工具。"),
    "wardogs-crash-fix": task("改设置前先隔离故障", "先区分访问或服务问题与本地崩溃、卡死、启动失败。记录准确症状，每次只应用一种可撤销修复，并重复同一路径测试。", "某个硬件或游戏版本有效的临时方案，不代表它是通用修复。", "记录版本、硬件、驱动、错误文本和故障前最后一步操作。", "检查当前官方公告，排除访问或服务端事件。", "验证游戏文件并更新必要系统组件，再改高级设置。", "每次只禁用一个覆盖层、Hook 或后台工具并重复测试。", "纯净测试仍失败时，保存日志与可复现步骤后提交报告。"),
    "wardogs-map": task("把地图变成移动计划", "用地图连接当前目标、可靠出生点、运输、补给、威胁和备用路线。有效路线比静态地图变化更快，因此每次重大接触后都要重新查看。", "目标位置、路线安全、标记、地形表现和出生点会随对局或版本变化。", "确认当前目标与小队眼前任务。", "选择能让小队保持集结的出生点与运输路线。", "标记已知威胁、补给点、着陆区和受阻入口。", "穿越开阔地或投入载具前，先规划一条备用路线。", "发生接触、目标移动或出生点丢失后重新打开地图并调整。" )
  }
};

const taskSlugSet = new Set<string>(guideTaskSlugs);

export function getGuideTaskUi(locale: Locale): GuideTaskUi {
  return ui[locale];
}

export function getGuideTaskData(slug: string, locale: Locale): GuideTaskData | undefined {
  if (!taskSlugSet.has(slug)) return undefined;

  const taskSlug = slug as GuideTaskSlug;
  const localized = copy[locale][taskSlug];
  const tool = relatedTools[taskSlug];

  return {
    slug: taskSlug,
    eyebrow: ui[locale].eyebrow,
    ...localized,
    relatedTool: tool ? {href: tool.href, label: toolLabels[locale][tool.key]} : undefined,
    videos: getCurrentVideoSourcesForGuide(taskSlug)
  };
}
