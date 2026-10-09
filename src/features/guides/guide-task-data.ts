import enMessages from "../../../messages/en.json";
import deMessages from "../../../messages/de.json";
import ruMessages from "../../../messages/ru.json";
import ptBrMessages from "../../../messages/pt-br.json";
import jaMessages from "../../../messages/ja.json";
import zhCnMessages from "../../../messages/zh-cn.json";
import zhTwMessages from "../../../messages/zh-tw.json";
import plMessages from "../../../messages/pl.json";
import {TOOL_REGISTRY} from "@/features/tools/tool-registry";
import {getItemType, type ItemTypeId} from "@/features/items/item-library";
import {getLocalizedItemType} from "@/features/items/item-localization";
import {resolveItemRouteTarget} from "@/features/items/item-route-availability";
import type {Locale} from "@/config/site";
import {getArtilleryCopy} from "@/features/artillery/artillery-copy";
import {interactiveMapPageCopy} from "@/features/maps/interactive-map-page-copy";
import {getToolCopy} from "@/features/tools/tool-copy";
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
  "wardogs-map",
  "wardogs-artillery-guide"
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
  relatedTools: readonly {href: string; label: string}[];
  relatedCatalogue: readonly GuideCatalogueLink[];
  videos: readonly CurrentVideoSource[];
};

type GuideTaskCopy = Pick<GuideTaskData, "title" | "directAnswer" | "steps" | "caution">;
type ToolKey = "loadoutBudget" | "systemCheck" | "ammoMatcherTitle" | "weaponCompareTitle" | "logisticsPlannerTitle" | "progressionRouteTitle" | "artillery" | "map";

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
  "zh-cn": {eyebrow: "实战任务清单", checklistTitle: "按顺序完成这个流程", progressTemplate: "已完成 {done} / {total} 步", cautionLabel: "当前版本注意事项", relatedToolLabel: "使用相关工具继续"},

  pl: {eyebrow: "Praktyczna lista zadań", checklistTitle: "Wykonaj kolejne kroki", progressTemplate: "Ukończono {done} z {total} kroków", cautionLabel: "Uwaga zależna od wersji", relatedToolLabel: "Kontynuuj w narzędziu"},
  "zh-tw": { eyebrow: "實戰任務清單", checklistTitle: "按順序完成這個流程", progressTemplate: "已完成 {done} / {total} 步", cautionLabel: "當前版本注意事項", relatedToolLabel: "使用相關工具繼續" }
};

const toolLabels: Record<Locale, Record<"loadoutBudget" | "systemCheck", string>> = {
  en: {loadoutBudget: "Open the loadout budget planner", systemCheck: "Open the PC system checker"},
  de: {loadoutBudget: "Loadout-Budgetplaner öffnen", systemCheck: "PC-Systemprüfung öffnen"},
  ru: {loadoutBudget: "Открыть планировщик стоимости комплекта", systemCheck: "Открыть проверку системы ПК"},
  "pt-br": {loadoutBudget: "Abrir o planejador de orçamento do kit", systemCheck: "Abrir a verificação do PC"},
  ja: {loadoutBudget: "ロードアウト予算ツールを開く", systemCheck: "PCシステムチェックを開く"},
  "zh-cn": {loadoutBudget: "打开配装预算工具", systemCheck: "打开 PC 配置检测器"},

  pl: {loadoutBudget: "Otwórz planer budżetu wyposażenia", systemCheck: "Otwórz narzędzie sprawdzania komputera"},
  "zh-tw": { loadoutBudget: "開啟配裝預算工具", systemCheck: "開啟 PC 配置檢測器" }
};

const relatedTools: Partial<Record<GuideTaskSlug, {href: string; key: ToolKey}>> = {
  "wardogs-ammo-reload-guide": {href: "/tools/ammo-matcher", key: "ammoMatcherTitle"},
  "wardogs-beginner-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-money-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-best-settings": {href: "/tools/system-check", key: "systemCheck"},
  "wardogs-best-weapons-loadouts": {href: "/tools/weapon-compare", key: "weaponCompareTitle"},
  "wardogs-equipment-tools-guide": {href: "/tools/loadout-budget", key: "loadoutBudget"},
  "wardogs-crash-fix": {href: "/tools/system-check", key: "systemCheck"},
  "wardogs-artillery-guide": {href: "/tools/artillery-calculator", key: "artillery"},
  "wardogs-mortar-guide": {href: "/tools/artillery-calculator", key: "artillery"},
  "wardogs-map": {href: "/tools/map", key: "map"},
  "wardogs-cargo-guide": {href: "/tools/logistics-planner", key: "logisticsPlannerTitle"},
  "wardogs-fob-guide": {href: "/tools/logistics-planner", key: "logisticsPlannerTitle"},
  "wardogs-progression-wipes-guide": {href: "/tools/progression-route", key: "progressionRouteTitle"}
};

function toolLabel(locale: Locale, key: ToolKey): string {
  if (key === "loadoutBudget" || key === "systemCheck") return toolLabels[locale][key];
  if (key === "artillery") return getArtilleryCopy(locale).title;
  if (key === "map") return interactiveMapPageCopy[locale].title;
  return getToolCopy(locale)[key];
}

const copy: Record<Locale, Record<Exclude<GuideTaskSlug, "wardogs-artillery-guide">, GuideTaskCopy>> = {
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
      "Dying before you can contribute? Spawn with a squad or transport, move between cover toward the active Control Zone, and bring a cheap complete kit plus one support job. Learn the route before risking high-tier equipment.",
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
      "Deploy separates Official, Community, Infantry Mode and Low-Level choices. Pick the mode first, then match the server, region and team with your friends before joining; use the displayed eligibility rules for Low-Level sessions.",
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
      "Unload a pallet into a FOB",
      "If unloading a pallet appears to do nothing, check the requested resource and valid receiving area, use the current transfer prompt, then confirm the FOB's usable supply count increases. A dropped pallet is not proof of completed delivery.",
      "Vehicle capacity, resource names, loading controls, and transfer zones may differ from recorded test builds.",
      "Ask the destination what resource and quantity it currently needs.",
      "Choose a compatible transport and confirm the cargo appears in its current inventory.",
      "Plan a protected route and keep the unloading area clear before arrival.",
      "Transfer the cargo and verify the destination resource display actually changes.",
      "Leave without blocking the spawn or supply lane, then return the asset for another run."
    ),
    "wardogs-mortar-guide": task(
      "Aim and counter a mortar mission",
      "Set a current target with live range and azimuth cues, fire a small correction, and stop when friendlies move in. Players report that the live impact camera can aid solo observation, but a separate spotter improves safety. Under enemy fire, break observation and disrupt ammunition supply.",
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
      "Check what resets and what carries over",
      "BULKHEAD’s announced seasonal policy resets cash and XP, converts remaining cash to Gold Bars, and preserves Gold Bars and cosmetics. The Season 02 teaser names October 15, 2026; the reviewed notice does not specify the reset hour, conversion rate or treatment of individual paid unlocks.",
      "The announced seasonal policy, historical Beta carryover and an individual account reset are different cases. A live Gold exchange quote is not the season-end conversion rate.",
      "Read the asset checklist below before buying an unlock or converting cash.",
      "Record cash, Gold, cosmetics, Career XP and each role’s XP separately.",
      "Check the official Season 02 transition notice for the reset hour and conversion terms.",
      "Budget purchases for a task you can use now; leave unresolved carryover and refunds unconfirmed.",
      "For a progression goal, match the item’s named track and level to the current client."
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
      "Match equipment to your squad's medical, construction, repair, reconnaissance or supply task. The IR rangefinder is temporarily removed from vendor sale until Season 2 battery support; the CWIS hotfix also changes the Havoc counter, so review those notes before spending.",
      "Charges, capacities, costs, interaction prompts, placement rules, and compatible targets are build-sensitive.",
      "Name the task: medical support, repair, construction, demolition, reconnaissance, or resupply.",
      "Check the current item description, required resource, slot, and compatible target.",
      "Carry the minimum supporting supplies needed to complete the task safely.",
      "Test the interaction in a safe context and confirm the target state changes.",
      "Replace or remove the tool when the squad task changes instead of carrying dead weight."
    ),
    "wardogs-crash-fix": task(
      "Isolate the failure before changing settings",
      "WARDOGS patch 0.1.2 addressed WD-L020 linked to Windows KB5124010; update the game and verify files before retesting. WD-L014 and WD-L018 are separate launch errors acknowledged by the developers: record the exact code and follow that incident before changing unrelated settings.",
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
    "wardogs-community-servers-guide": task("Community-Server vor dem Beitritt prüfen", "Deploy trennt Official, Community, Infantry Mode und Low-Level. Wähle zuerst den Modus und gleiche danach Server, Region und Team mit Freunden ab. Für Low-Level gelten die im Spiel angezeigten Teilnahmebedingungen.", "Provider, RCON, Fortschrittsregeln und Browserfilter können sich gegenüber älteren Ankündigungen ändern.", "Live-Browser oder genehmigte Provider-Seite statt alter Serverliste öffnen.", "Name, Region, Modus, Regeln und Moderationskontakt lesen.", "Prüfen, ob Fortschritt oder eigene Einstellungen vom offiziellen Matchmaking abweichen.", "Latenz und Verbindung testen, bevor eine größere Gruppe organisiert wird.", "Irreführende Einträge über den aktuellen Provider- oder Ingame-Prozess melden."),
    "wardogs-controls": task("Steuerung im aktuellen Client prüfen", "Öffne die Eingabeeinstellungen und prüfe vor dem Einsatz für jede benötigte Aktion die aktuelle Belegung im Spiel. Teste Infanterie, Kommunikation, Fahrzeuge und Spezialaktionen sicher, statt einer alten Tastenliste zu vertrauen.", "Belegungen, Geräteerkennung, Anzeigen und Rücksetzverhalten können sich zwischen Builds ändern.", "Jede Eingabekategorie öffnen und die aktuelle Belegung im Spiel für Bewegung und Interaktion notieren.", "Karte, Ping, Sprache, Inventar, Nachladen und Kontextaktionen einzeln prüfen.", "Fahrzeugsitze und Achsen vor dem Kampf an einem sicheren Ort testen.", "Konflikte lösen, anwenden und nach einem Neustart prüfen, ob alles gespeichert bleibt.", "Aktuelles Layout vor Patch oder Treiberwechsel sichern."),
    "wardogs-fob-guide": task("Eine FOB für den nächsten Kampf bauen", "Eine nützliche FOB verbindet Platzierung, angeforderte Versorgung, freie Zufahrt, Verteidigung und Rückzugsplan. Prüfe Menü und Ressourcen des aktuellen Builds vor Bau oder Upgrade.", "Baukosten, Platzierungsregeln, Upgrades und Strukturen sind buildabhängig.", "Zweck und Position mit Deckung, Zufahrt und Abstand zu erkennbarem Feinddruck wählen.", "Benötigte Ressource bestätigen und Transport vor Baubeginn zuweisen.", "Straßen, Spawn-Ausgänge, Entladefläche und freundliche Bewegung freihalten.", "Nur Schutz und Dienste für das unmittelbare Ziel bauen.", "Versorgungsroute schützen und Reparatur, Verlegung oder Aufgabe vorbereiten."),
    "wardogs-cargo-guide": task("Den vollständigen Frachtkreislauf abschließen", "Eine Frachtfahrt endet erst, wenn die angeforderte Ressource geladen, geliefert, in den nutzbaren Bestand übertragen und das Fahrzeug für den nächsten Auftrag erhalten wurde. Prüfe bei jeder Übergabe die aktuelle Frachtoberfläche.", "Kapazität, Ressourcennamen, Ladesteuerung und Übergabezonen können von Test-Builds abweichen.", "Am Ziel nach aktuell benötigter Ressource und Menge fragen.", "Passenden Transport wählen und Fracht im aktuellen Inventar bestätigen.", "Geschützte Route planen und Entladefläche vor Ankunft freihalten.", "Fracht übertragen und prüfen, ob sich der Zielbestand wirklich ändert.", "Spawn und Versorgungsweg freihalten und das Fahrzeug zurückführen."),
    "wardogs-mortar-guide": task("Einen kontrollierten Mörserauftrag durchführen", "Ein Mörserteam braucht geschützte Stellung, aktuelles Ziel, Beobachter und gemessene Korrekturen. Alte Reichweiten- und Schadensangaben gelten nur als Hinweis, bis der aktuelle Build sie bestätigt.", "Reichweite, Munition, Schaden, Steuerung und Stellungsregeln können sich ändern.", "Mörser mit Deckung, Versorgungszugang und Rückzugsraum platzieren.", "Ziel und Freundpositionen vor dem Laden mit dem Beobachter bestätigen.", "Erste Lösung aus der aktuellen Oberfläche ableiten, nicht blind aus alter Tabelle.", "Kontrollschuss abgeben und jeweils nur eine Variable korrigieren.", "Stoppen oder verlegen, wenn Ziel, Freundlage oder Gegenfeuer es erfordern."),
    "wardogs-helicopter-guide": task("Einen sicheren Hubschraubereinsatz vorbereiten", "Prüfe aktuelle Flugbelegung, übe kontrollierten Start und Landung und wähle vor Passagier- oder Werttransport eine Route mit Abbruchmöglichkeit. Ein erfolgreicher Einsatz erhält das Luftfahrzeug für die nächste Aufgabe.", "Flugverhalten, Geräteunterstützung, Gegenmaßnahmen, Reparatur, Treibstoff und Verfügbarkeit sind buildabhängig.", "Pitch, Roll, Gier, Kollektiv, Sicht, Sitz und Ausstieg im aktuellen Client prüfen.", "Schweben, Start, Anflug, Durchstarten und Landen abseits des Kampfes üben.", "Passagiere über Aufnahme, Ziel, Bedrohungen und Abbruchsignal informieren.", "Route mit Geländedeckung und alternativer Landezone fliegen.", "Absetzen, Bedrohung verlassen, Luftfahrzeug prüfen und nächsten Einsatz bewerten."),
    "wardogs-ps5": task("Konsolenstatus ohne Vermutung prüfen", "Ein PS5-Termin ist nicht offiziell bestätigt. Nutze aktuelle First-Party-Store-Einträge und offizielle WARDOGS-Meldungen; unbelegte Daten und Platzhalter bleiben unbestätigt.", "Leite weder Konsolentermin noch Cross-Play, Controller-Modus oder Verfügbarkeit aus PC Early Access oder Drittseiten ab.", "Offizielle WARDOGS- und Publisher-Kanäle nach plattformspezifischer Meldung prüfen.", "Direkt im PlayStation Store suchen und echte Produktseite von Platzhalter unterscheiden.", "Region, Edition, Cross-Play und Fortschritt im Wortlaut der Meldung lesen.", "Countdowns ohne First-Party-Quelle ignorieren.", "Nach Roadmap- oder Launch-Updates erneut prüfen und Quelldatum bewahren."),
    "wardogs-progression-wipes-guide": task("Fortschritt mit aktuellen Belegen planen", "Lies die aktuelle Rollenstrecke und offizielle Patchnotes, bevor du ein Ziel wählst. Baue eine wiederholbare Route aus Aktionen, die den passenden Balken sichtbar bewegen, ohne Freischaltdauer oder Wipe-Regeln zu erfinden.", "Beta-Tempo, Rollenposition, Level, XP-Quellen und Reset-Regeln sind nicht dauerhaft.", "Ein Rollen- oder Freischaltziel wählen und aktuelle Strecke vor dem Match festhalten.", "Eine teamdienliche Aktion dieser Rolle sauber wiederholen.", "Balken direkt danach prüfen, damit andere Belohnungen das Ergebnis nicht vermischen.", "Ergebnis mit offizieller Änderung vergleichen und Unbekanntes markieren.", "Route nach Fortschrittspatch oder Reset-Meldung neu erstellen."),
    "wardogs-best-weapons-loadouts": task("Ein Loadout für eine Aufgabe bauen", "Das beste Loadout ist das günstigste verlässliche Set für Rolle, Distanz, Munition und Teamaufgabe. Vergleiche aktuelle Händler- und Inventarbelege statt einer dauerhaften Tier-Liste.", "Balance, Preis, Freischaltung, Aufsätze, Munition, Rüstung und Slots können sich ändern.", "Rolle, Distanz und zu lösendes Teamproblem definieren.", "Waffe mit aktuell prüfbarer Munitions- und Magazinbeziehung wählen.", "Schutz, Medizin und ein zweckmäßiges Werkzeug vor Extras ergänzen.", "Gesamtrisiko prüfen und günstige Ersatzoption vorsehen.", "Set in einer konstanten Situation testen und nur das fehlerhafte Teil ändern."),
    "wardogs-equipment-tools-guide": task("Ausrüstung nach Aufgabe wählen", "Wähle Ausrüstung für Heilung, Bau, Reparatur, Aufklärung oder Nachschub. Der IR-Entfernungsmesser wird bis zur Batterie-Unterstützung in Season 2 vorübergehend nicht verkauft; der CWIS-Hotfix verändert auch die Abwehr gegen Havoc. Prüfe diese Änderungen vor dem Kauf.", "Ladungen, Kapazitäten, Preise, Prompts, Platzierung und Ziele sind buildabhängig.", "Aufgabe benennen: Medizin, Reparatur, Bau, Sprengung, Aufklärung oder Versorgung.", "Aktuelle Beschreibung, Ressource, Slot und kompatibles Ziel prüfen.", "Nur nötige Hilfsmittel für sichere Ausführung mitnehmen.", "Interaktion sicher testen und Zustandsänderung des Ziels bestätigen.", "Werkzeug ersetzen oder ablegen, wenn sich die Truppaufgabe ändert."),
    "wardogs-crash-fix": task("Fehler vor Einstellungsänderung isolieren", "Den mit Windows KB5124010 verbundenen WD-L020 behandelte WARDOGS-Patch 0.1.2: Aktualisiere das Spiel und prüfe die Dateien vor dem nächsten Test. WD-L014 und WD-L018 sind separat bestätigte Startfehler. Notiere den genauen Code und prüfe die zugehörige Meldung, bevor du Einstellungen änderst.", "Eine Lösung für einen Build oder PC ist kein allgemeingültiger Fix.", "Build, Hardware, Treiber, Fehlertext und letzte Aktion notieren.", "Aktuelle offizielle Hinweise prüfen, um Dienstprobleme auszuschließen.", "Spieldateien prüfen und erforderliche Systemkomponenten aktualisieren.", "Jeweils ein Overlay, Hook oder Hintergrundprogramm deaktivieren und gleich testen.", "Logs und reproduzierbare Schritte sichern, wenn der saubere Test weiter fehlschlägt."),
    "wardogs-map": task("Die Karte in einen Bewegungsplan verwandeln", "Verbinde auf der Karte aktives Ziel, zuverlässigen Spawn, Transport, Versorgung, Gefahren und Rückzugsroute. Prüfe sie nach jedem wichtigen Kontakt neu, weil sich die beste Route schneller ändert als ein statisches Bild.", "Ziele, Routensicherheit, Marker, Gelände und Spawns ändern sich mit Match oder Build.", "Aktives Ziel und unmittelbare Truppaufgabe bestimmen.", "Spawn und Transportroute wählen, die den Trupp zusammenhalten.", "Gefahren, Versorgung, Landezonen und blockierte Wege markieren.", "Vor offenem Gelände oder Fahrzeugeinsatz eine Rückzugsroute planen.", "Nach Kontakt, Zielbewegung oder Spawnverlust Karte öffnen und Route ändern.")
  },
  ru: {
    "wardogs-ammo-reload-guide": task("Проверьте боеприпасы до выхода", "До покупки сопоставьте оружие, магазин и семейство боеприпасов. Проверяйте совместимость в текущем интерфейсе продавца и инвентаря, потому что связи из тестовых сборок могли измениться.", "Старая таблица калибров, название магазина или комплект автора не подтверждают текущую совместимость.", "Выберите оружие и прочитайте текущие метки боеприпасов и магазинов.", "Подберите одно семейство боеприпасов под ожидаемую цель и роль.", "Сначала купите минимальное количество для проверки.", "В безопасном месте зарядите и перезарядите, затем проверьте инвентарь и счетчик.", "После патча снова проверьте продавца перед использованием сохраненного комплекта."),
    "wardogs-beginner-guide": task("Проведите полезный первый матч", "Сначала изучите развертывание, активную цель, движение отряда и один цикл поддержки, а уже затем покупайте специальный комплект. Держитесь рядом с союзниками и сверяйте точные значения с текущим интерфейсом.", "Цены, награды, управление и прогресс из прежних сборок могут не совпадать с текущим клиентом.", "Вступите в отряд, прочитайте задачу и найдите активную Control Zone на карте.", "Выберите доступный комплект с понятной боевой или вспомогательной задачей.", "Используйте организованный спавн или транспорт вместо одиночного забега по открытому месту.", "Помогайте огнем, лечением, снабжением или транспортом рядом с отрядом.", "После смерти измените одну часть плана и сохраните деньги на следующую жизнь."),
    "wardogs-money-guide": task("Сохраняйте деньги и помогайте команде", "Выберите повторяемую работу, держите резерв и считайте чистый результат каждой жизни. Текущие выплаты и цены нужно читать в клиенте, поэтому порядок действий надежнее постоянной таблицы доходов.", "Доходный маршрут одной сборки или матча не гарантирует такую же выплату позже.", "Выберите полезную работу: цель, логистика, транспорт, ремонт или лечение.", "Задайте предел потерь до покупки снаряжения или транспорта.", "Завершите весь цикл услуги и проверьте награду в текущем интерфейсе.", "Вычтите стоимость замены и запишите чистый результат.", "Оставьте маршрут только если он полезен команде и повторяем без безрассудных потерь."),
    "wardogs-best-settings": task("Создайте воспроизводимую базу настроек", "Начните со стабильной базы и меняйте только один параметр графики или экрана за раз. Каждый раз сравнивайте одну и ту же сцену, чтобы не смешивать видимость, плавность кадров и сбои.", "Названия меню и результат зависят от сборки, драйвера, железа, разрешения и нагрузки боя.", "Запишите сборку, железо, драйвер, разрешение и исходный пресет.", "Выберите повторяемую сцену и оцените стабильность и видимость до изменений.", "Измените один параметр, повторите сцену и сохраните только явное улучшение.", "Отдельно проверьте оверлеи и фоновые программы при оставшихся задержках.", "Сохраните рабочую базу и повторите тест после обновления игры или драйвера."),
    "wardogs-community-servers-guide": task("Проверьте сервер сообщества перед входом", "В Deploy разделены Official, Community, Infantry Mode и Low-Level. Сначала выберите режим, затем согласуйте с друзьями сервер, регион и команду. Для Low-Level проверьте условия допуска, показанные в интерфейсе.", "Провайдеры, RCON, правила прогрессии и фильтры браузера могут измениться после старых анонсов.", "Откройте живой браузер или страницу одобренного провайдера вместо старого списка.", "Прочитайте название, регион, режим, правила и контакт модерации.", "Уточните, отличается ли прогрессия или настройки от официального матчмейкинга.", "Проверьте задержку и стабильность до сбора большой группы.", "Сообщайте о вводящих в заблуждение записях через текущую систему игры или провайдера."),
    "wardogs-controls": task("Проверьте управление в текущем клиенте", "Откройте настройки ввода и перед выходом проверьте текущее назначение в игре для каждого нужного действия. Безопасно протестируйте пехоту, связь, транспорт и специальные действия, не полагаясь на старую таблицу клавиш.", "Назначения, распознавание устройств, подсказки и сбросы могут меняться между сборками.", "Откройте категории ввода и запишите текущее назначение в игре для движения и взаимодействия.", "По очереди проверьте карту, метки, голос, инвентарь, перезарядку и контекстные действия.", "До боя проверьте места и оси транспорта в безопасной зоне.", "Устраните конфликты, примените изменения и после перезапуска проверьте сохранение.", "Сохраните схему перед патчем или обновлением драйвера устройства."),
    "wardogs-fob-guide": task("Постройте FOB для следующего боя", "Полезная FOB сочетает позицию, нужные ресурсы, свободный доступ, оборону и план отхода. До строительства или улучшения проверьте меню и требования текущей сборки.", "Стоимость, правила размещения, улучшения и доступные постройки зависят от сборки.", "Выберите задачу и место с укрытием, доступом и расстоянием от очевидного давления.", "Подтвердите нужный ресурс и назначьте транспорт до начала стройки.", "Оставьте дороги, выходы спавна, разгрузку и движение союзников свободными.", "Стройте только защиту и услуги для ближайшей цели.", "Защищайте снабжение и будьте готовы ремонтировать, переносить или оставить позицию."),
    "wardogs-cargo-guide": task("Завершите полный грузовой цикл", "Рейс завершен, только когда нужный ресурс загружен, доставлен, переведен в доступный запас цели, а транспорт сохранен для следующей задачи. Проверяйте текущий грузовой интерфейс на каждой передаче.", "Вместимость, названия ресурсов, управление загрузкой и зоны передачи могут отличаться от тестовых сборок.", "Узнайте у точки назначения, какой ресурс и объем ей сейчас нужен.", "Выберите совместимый транспорт и подтвердите груз в его текущем инвентаре.", "Спланируйте защищенный маршрут и освободите место разгрузки.", "Передайте груз и проверьте фактическое изменение ресурса цели.", "Не блокируйте спавн или снабжение и верните транспорт для нового рейса."),
    "wardogs-mortar-guide": task("Проведите управляемую минометную задачу", "Расчету нужны защищенная позиция, актуальная цель, наблюдатель и измеренные поправки. Старые таблицы дальности и урона остаются справкой, пока их не подтвердит текущая сборка.", "Дальность, боеприпасы, урон, управление и правила установки могут измениться.", "Разместите миномет в укрытии с доступом к снабжению и выходом.", "До заряжания подтвердите цель и союзников с наблюдателем.", "Получите первое решение из текущего интерфейса, а не слепо из старой таблицы.", "Сделайте контрольный выстрел и меняйте по одной величине.", "Остановитесь или смените позицию при движении цели, союзников или ответном огне."),
    "wardogs-helicopter-guide": task("Подготовьте безопасный вертолетный вылет", "Проверьте текущие назначения, отработайте управляемые взлет и посадку и выберите маршрут с вариантом отмены до перевозки отряда или дорогого ресурса. Успешный вылет сохраняет машину для следующей задачи.", "Физика полета, устройства, контрмеры, ремонт, топливо и доступность зависят от сборки.", "Проверьте тангаж, крен, рыскание, тягу, обзор, места и выход в текущем клиенте.", "В стороне от боя отработайте висение, взлет, заход, уход и посадку.", "Сообщите пассажирам точку, цель, угрозы и сигнал отмены.", "Летите с укрытием рельефом и запасной площадкой.", "Высадите, выйдите из угрозы, осмотрите машину и оцените следующий вылет."),
    "wardogs-ps5": task("Проверьте статус консольной версии без догадок", "Дата выхода на PS5 официально не подтверждена. Используйте актуальные магазины платформы и официальные объявления WARDOGS, а неподтвержденные даты и заглушки считайте неизвестными.", "Не выводите дату, кроссплей, режим контроллера или доступность из PC Early Access или сторонних страниц.", "Проверьте официальные каналы WARDOGS и издателя на объявление платформы.", "Ищите прямо в PlayStation Store и отличайте продукт от заглушки.", "Читайте сведения о регионе, издании, кроссплее и прогрессе в самом объявлении.", "Игнорируйте обратные отсчеты без ссылки на первичный источник.", "Повторяйте проверку после дорожной карты или запуска и сохраняйте дату источника."),
    "wardogs-progression-wipes-guide": task("Планируйте прогресс по текущим данным", "До выбора цели прочитайте текущую ветку роли и официальные заметки. Стройте повторяемый путь из действий, которые видимо двигают нужную шкалу, не придумывая время открытия или правила сброса.", "Скорость Beta, расположение ролей, уровни, XP и политика сбросов не являются постоянными.", "Выберите цель роли или открытия и зафиксируйте текущую ветку до матча.", "Чисто повторите одно полезное команде действие этой роли.", "Сразу проверьте шкалу, чтобы не смешать другие награды.", "Сравните результат с последними официальными изменениями и отметьте неизвестное.", "Пересоберите путь после патча прогресса или объявления сброса."),
    "wardogs-best-weapons-loadouts": task("Соберите комплект под одну задачу", "Лучший комплект — самый дешевый надежный набор под роль, дистанцию, боеприпасы и задачу команды. Сверяйте текущего продавца и инвентарь вместо постоянного тир-листа.", "Баланс, цена, открытия, модули, боеприпасы, броня и слоты могут измениться.", "Определите роль, дистанцию и проблему команды.", "Выберите оружие с проверяемой сейчас связью боеприпасов и магазина.", "Добавьте защиту, медицину и один целевой инструмент до необязательных вещей.", "Оцените риск замены и подготовьте дешевый запасной вариант.", "Проверьте комплект в одной ситуации и меняйте только неработающую часть."),
    "wardogs-equipment-tools-guide": task("Выбирайте снаряжение по задаче", "Подбирайте оснащение под лечение, строительство, ремонт, разведку или снабжение. IR-дальномер временно убран из продажи до поддержки батарей в сезоне 2; исправление CWIS меняет противодействие Havoc. Перед покупкой прочитайте соответствующие изменения.", "Заряды, емкость, цена, подсказки, размещение и совместимые цели зависят от сборки.", "Назовите задачу: медицина, ремонт, стройка, подрыв, разведка или снабжение.", "Проверьте описание, ресурс, слот и совместимую цель.", "Возьмите минимум расходников для безопасного выполнения.", "Проверьте взаимодействие безопасно и подтвердите изменение состояния цели.", "Замените или уберите инструмент, когда задача отряда меняется."),
    "wardogs-crash-fix": task("Изолируйте сбой до изменения настроек", "Связанную с Windows KB5124010 ошибку WD-L020 исправляли в патче WARDOGS 0.1.2: обновите игру и проверьте файлы перед повторным тестом. WD-L014 и WD-L018 — отдельные ошибки запуска, признанные разработчиками. Запишите точный код и сверяйтесь с сообщением об этом сбое перед изменением настроек.", "Решение для одного железа или сборки не является универсальным.", "Запишите сборку, железо, драйвер, текст ошибки и последнее действие.", "Проверьте текущие официальные сообщения, чтобы исключить сбой сервиса.", "Проверьте файлы игры и обновите необходимые компоненты системы.", "Отключайте по одному оверлею, хуку или фоновому приложению и повторяйте тест.", "Сохраните логи и воспроизводимые шаги, если чистый тест снова падает."),
    "wardogs-map": task("Превратите карту в план движения", "Свяжите на карте активную цель, надежный спавн, транспорт, снабжение, угрозы и путь отхода. Открывайте ее после каждого серьезного контакта, потому что полезный маршрут меняется быстрее статичной картинки.", "Цели, безопасность маршрута, метки, рельеф и спавны меняются в матче или сборке.", "Найдите активную цель и ближайшую задачу отряда.", "Выберите спавн и транспортный путь, сохраняющий отряд вместе.", "Отметьте угрозы, снабжение, посадочные зоны и закрытые подходы.", "До открытой местности или ввода машины подготовьте путь отхода.", "После боя, движения цели или потери спавна снова откройте карту и измените маршрут.")
  },
  "pt-br": {
    "wardogs-ammo-reload-guide": task("Confira a munição antes de sair", "Relacione a arma, o carregador e a família de munição antes de comprar ou entrar em campo. Confira cada indicação na loja e no inventário atuais, pois relações de builds de teste podem ter mudado.", "Uma lista antiga de calibres, o nome do carregador ou um kit de criador não comprovam compatibilidade atual.", "Identifique a arma e leia as indicações atuais de munição e carregador.", "Escolha uma família de munição para o alvo e a função esperados.", "Compre primeiro uma quantidade mínima para teste.", "Carregue e recarregue em local seguro, confirmando inventário e contador.", "Após um patch, confira novamente a loja antes de reutilizar um kit salvo."),
    "wardogs-beginner-guide": task("Faça uma primeira partida útil", "Aprenda a entrar, localizar o objetivo, mover-se com o esquadrão e completar um ciclo de suporte antes de comprar equipamento especializado. Fique perto da equipe e use a interface atual para valores exatos.", "Preços, recompensas, controles e progressão de builds antigas podem divergir do cliente atual.", "Entre em um esquadrão, leia a tarefa e encontre a Control Zone ativa no mapa.", "Escolha um kit acessível com propósito claro de infantaria ou suporte.", "Use spawn ou transporte organizado em vez de cruzar terreno aberto sozinho.", "Troque apoio, reviva, reabasteça ou transporte perto do esquadrão.", "Após morrer, mude uma parte do plano e preserve dinheiro para a próxima vida."),
    "wardogs-money-guide": task("Proteja o dinheiro criando valor para a equipe", "Escolha um trabalho repetível, mantenha uma reserva e meça o resultado líquido de cada vida. Pagamentos e preços atuais devem ser lidos no cliente, por isso o método vale mais que uma tabela permanente.", "Uma rota lucrativa em uma build ou partida não garante o mesmo pagamento depois.", "Escolha um trabalho útil: objetivo, logística, transporte, reparo ou revives.", "Defina um limite de perda antes de comprar equipamento ou veículo.", "Conclua o ciclo completo e confirme a recompensa na interface atual.", "Desconte o custo de reposição e registre o resultado líquido.", "Mantenha a rota apenas se ela ajudar a equipe e puder ser repetida sem perdas imprudentes."),
    "wardogs-best-settings": task("Crie uma base de configurações reproduzível", "Comece com uma base estável e altere somente uma opção gráfica ou de exibição por vez. Compare a mesma cena após cada mudança para não misturar visibilidade, ritmo de quadros e travamentos.", "Nomes do menu e resultados dependem da build, driver, hardware, resolução e carga da batalha.", "Registre build, hardware, driver, resolução e preset inicial.", "Escolha uma cena repetível e anote estabilidade e visibilidade antes das mudanças.", "Altere uma opção, repita a cena e mantenha apenas melhora clara.", "Teste overlays e programas em segundo plano separadamente se houver stutter.", "Salve a base funcional e teste outra vez após atualizar jogo ou driver."),
    "wardogs-community-servers-guide": task("Verifique o servidor da comunidade antes de entrar", "Deploy separa Official, Community, Infantry Mode e Low-Level. Escolha o modo primeiro e combine servidor, região e equipe com os amigos antes de entrar. Em Low-Level, confira os critérios de participação exibidos no jogo.", "Provedores, RCON, regras de progressão e filtros podem mudar após anúncios antigos.", "Abra o navegador ao vivo ou a página de um provedor aprovado, não uma lista antiga.", "Leia nome, região, modo, regras e contato da moderação.", "Confirme diferenças de progressão ou configurações em relação ao matchmaking oficial.", "Teste latência e estabilidade antes de organizar um grupo maior.", "Denuncie anúncios enganosos pelo processo atual do jogo ou provedor."),
    "wardogs-controls": task("Verifique os controles no cliente atual", "Abra as opções de entrada e confirme a vinculação atual no jogo para cada ação necessária antes de sair. Teste infantaria, comunicação, veículos e ações especiais em local seguro, sem presumir que uma lista antiga ainda vale.", "Vinculações, detecção de dispositivos, avisos e comportamento de reset podem mudar entre builds.", "Abra cada categoria e registre a vinculação atual no jogo para movimento e interação.", "Confira mapa, marcação, voz, inventário, recarga e ações contextuais separadamente.", "Teste assentos e eixos de veículos em local seguro antes do combate.", "Resolva conflitos, aplique e reinicie uma vez para confirmar que ficaram salvos.", "Guarde uma imagem do layout antes de patch ou mudança de driver."),
    "wardogs-fob-guide": task("Construa uma FOB para a próxima luta", "Uma FOB útil combina posição, suprimento solicitado, acesso livre, defesa e plano de recuperação. Confira o menu e os recursos da build atual antes de construir ou melhorar.", "Custos, regras de posicionamento, caminhos de melhoria e estruturas dependem da build.", "Escolha propósito e local com cobertura, acesso e distância da pressão óbvia.", "Confirme o recurso pedido e defina o transporte antes da construção.", "Mantenha estradas, saídas de spawn, descarga e movimento aliados livres.", "Construa somente proteção e serviços necessários ao objetivo imediato.", "Defenda a rota e prepare reparo, mudança ou abandono quando o valor da posição mudar."),
    "wardogs-cargo-guide": task("Conclua todo o ciclo de carga", "Uma viagem termina apenas quando o recurso pedido é carregado, entregue, transferido ao estoque utilizável e o transporte fica disponível para outra tarefa. Confira a interface atual em cada passagem.", "Capacidade, nomes dos recursos, controles de carga e zonas de transferência podem diferir das builds gravadas.", "Pergunte ao destino qual recurso e quantidade são necessários agora.", "Escolha transporte compatível e confirme a carga no inventário atual.", "Planeje rota protegida e libere a área de descarga antes de chegar.", "Transfira e confirme que o total do destino realmente mudou.", "Saia sem bloquear spawn ou suprimento e devolva o veículo para outro ciclo."),
    "wardogs-mortar-guide": task("Execute uma missão controlada de morteiro", "A equipe precisa de posição segura, alvo atual, observador e correções medidas. Use tabelas antigas de alcance e dano apenas como referência até a build atual confirmá-las.", "Alcance, suprimento, dano, controles e regras de posicionamento podem mudar.", "Posicione com cobertura, acesso a suprimento e espaço para sair.", "Confirme alvo e aliados com o observador antes de carregar.", "Use a interface atual para a solução inicial, sem copiar cegamente uma tabela antiga.", "Dispare um tiro controlado e ajuste uma variável por vez.", "Pare ou reposicione se o alvo mover, aliados entrarem ou houver contrafogo."),
    "wardogs-helicopter-guide": task("Prepare uma missão segura de helicóptero", "Confira os comandos atuais, pratique decolagem e pouso controlados e escolha uma rota com opção de aborto antes de transportar um esquadrão ou ativo caro. Uma missão boa preserva a aeronave para a próxima tarefa.", "Pilotagem, dispositivos, contramedidas, reparo, combustível e disponibilidade dependem da build.", "Confira pitch, roll, yaw, coletivo, visão, assento e saída no cliente atual.", "Pratique pairar, decolar, aproximar, arremeter e pousar longe da luta.", "Informe passageiros sobre embarque, destino, ameaças e sinal de aborto.", "Voe usando terreno e uma área alternativa de pouso.", "Desembarque, saia da ameaça, inspecione a aeronave e avalie a próxima missão."),
    "wardogs-ps5": task("Confira o status do console sem adivinhar", "Uma data de lançamento no PS5 não foi oficialmente confirmada. Use lojas da própria plataforma e anúncios oficiais de WARDOGS; datas sem fonte e páginas provisórias continuam não confirmadas.", "Não deduza data, cross-play, modo de controle ou disponibilidade do Acesso Antecipado no PC ou de listas de terceiros.", "Confira canais oficiais de WARDOGS e da publicadora por anúncio da plataforma.", "Pesquise diretamente na PlayStation Store e diferencie produto real de provisório.", "Leia região, edição, cross-play e progressão no texto do anúncio.", "Ignore contagens ou datas sem fonte primária.", "Revise após grandes anúncios de roadmap ou lançamento e preserve a data da fonte."),
    "wardogs-progression-wipes-guide": task("Planeje a progressão com evidência atual", "Leia a trilha atual da função e as notas oficiais antes de escolher a meta. Monte uma rota repetível com ações que movam visivelmente a barra relevante, sem inventar tempo de desbloqueio ou regras de wipe.", "Velocidade do Beta, posição das funções, níveis, fontes de XP e política de reset não são permanentes.", "Escolha uma meta de função ou desbloqueio e registre a trilha antes da partida.", "Repita com clareza uma ação útil ligada à função.", "Confira a barra logo depois para não misturar outras recompensas.", "Compare com as mudanças oficiais e marque o que segue desconhecido.", "Refaça a rota após patch de progressão ou anúncio de reset."),
    "wardogs-best-weapons-loadouts": task("Monte um kit para uma tarefa", "O melhor kit é o conjunto confiável mais barato que atende função, distância, munição e tarefa da equipe. Compare loja e inventário atuais em vez de copiar uma tier list permanente.", "Balanceamento, preço, desbloqueio, acessórios, munição, armadura e slots podem mudar.", "Defina função, distância e problema da equipe.", "Escolha arma cuja relação com munição e carregador possa ser verificada agora.", "Adicione proteção, medicina e uma ferramenta útil antes de extras.", "Confira risco total de reposição e prepare uma alternativa barata.", "Teste em uma situação consistente e mude apenas a parte que falhou."),
    "wardogs-equipment-tools-guide": task("Escolha equipamento pela tarefa", "Escolha equipamento para tratamento, construção, reparo, reconhecimento ou suprimento. O telêmetro IR saiu temporariamente da loja até o suporte a baterias da Temporada 2; o hotfix de CWIS também muda a resposta ao Havoc. Confira essas notas antes da compra.", "Cargas, capacidades, preços, avisos, posicionamento e alvos compatíveis dependem da build.", "Defina a tarefa: medicina, reparo, construção, demolição, reconhecimento ou suprimento.", "Confira descrição, recurso, slot e alvo compatível atuais.", "Leve somente os consumíveis necessários para concluir com segurança.", "Teste a interação em contexto seguro e confirme a mudança no alvo.", "Troque ou remova a ferramenta quando a tarefa do esquadrão mudar."),
    "wardogs-crash-fix": task("Isole a falha antes de mudar configurações", "O patch 0.1.2 de WARDOGS corrigiu o WD-L020 ligado ao Windows KB5124010; atualize o jogo e verifique os arquivos antes de testar de novo. WD-L014 e WD-L018 são erros de inicialização separados reconhecidos pelos desenvolvedores. Anote o código exato e consulte o aviso correspondente antes de mudar configurações.", "Uma solução para um hardware ou build não é uma correção universal.", "Registre build, hardware, driver, erro e última ação antes da falha.", "Confira avisos oficiais atuais para excluir incidentes de serviço.", "Verifique arquivos e atualize componentes necessários do sistema.", "Desative um overlay, hook ou programa em segundo plano por vez e repita.", "Preserve logs e etapas reproduzíveis se o teste limpo continuar falhando."),
    "wardogs-map": task("Transforme o mapa em um plano de movimento", "Use o mapa para ligar objetivo ativo, spawn confiável, transporte, suprimento, ameaças e rota de recuo. Confira outra vez após cada contato importante, pois a melhor rota muda mais rápido que uma imagem estática.", "Objetivos, segurança, marcadores, terreno e spawns mudam com a partida ou build.", "Identifique o objetivo ativo e a tarefa imediata do esquadrão.", "Escolha spawn e transporte que mantenham o grupo unido.", "Marque ameaças, suprimentos, pousos e acessos bloqueados.", "Planeje uma rota de recuo antes de terreno aberto ou de comprometer um veículo.", "Após contato, movimento do objetivo ou perda do spawn, reabra o mapa e revise." )
  },
  ja: {
    "wardogs-ammo-reload-guide": task("出撃前に弾薬を確認する", "購入や出撃の前に、武器・マガジン・弾薬系統を対応させます。テストビルド時の関係は変更されるため、現在のショップとインベントリで互換表示を確認してください。", "古い口径表、マガジン名、クリエイターの装備だけでは現行互換性を証明できません。", "武器を特定し、現在の弾薬とマガジン表示を読む。", "想定する標的と役割に合う弾薬系統を1つ選ぶ。", "最初は確認用の最小量だけ購入する。", "安全な場所で装填とリロードを行い、インベントリと残弾表示を確認する。", "パッチ後は保存済み装備を使う前にショップを再確認する。"),
    "wardogs-beginner-guide": task("最初の試合で役立つ動きをする", "専門装備を買う前に、出撃、現在の目標、分隊移動、1つの支援ループを学びます。味方の近くで行動し、正確な数値は現在の画面で確認してください。", "過去ビルドの価格、報酬、操作、進行は現行クライアントと異なる場合があります。", "分隊に入り、任務を読み、マップで現在のControl Zoneを確認する。", "歩兵または支援の目的が明確な手頃な装備を選ぶ。", "単独で開けた場所を走らず、整理されたスポーンか輸送を使う。", "分隊の近くで援護、蘇生、補給、輸送を行う。", "死亡後は計画を1つだけ変え、次の出撃資金を残す。"),
    "wardogs-money-guide": task("資金を守りながらチームへ価値を出す", "繰り返せる仕事を1つ選び、予備資金を残し、各ライフの純結果を測ります。現在の報酬と価格はクライアントで確認し、固定の稼ぎ表ではなく手順を使ってください。", "あるビルドや試合で利益が出たルートが、次も同じ報酬になるとは限りません。", "目標支援、兵站、輸送、修理、蘇生から役立つ仕事を選ぶ。", "装備や車両を買う前に損失上限を決める。", "サービス全体を完了し、現在の画面で報酬を確認する。", "再購入費を差し引き、総収入ではなく純結果を記録する。", "チームに役立ち、無謀な損失なしで繰り返せる場合だけ続ける。"),
    "wardogs-best-settings": task("再現できる設定基準を作る", "安定した基準から始め、グラフィックまたは表示設定を1項目ずつ変更します。毎回同じ場面を比較し、視認性、フレームの安定、クラッシュを混同しないでください。", "メニュー名と性能結果は、ビルド、ドライバー、機器、解像度、戦闘負荷に依存します。", "ビルド、機器、ドライバー、解像度、開始プリセットを記録する。", "再現できる場面を選び、変更前の安定性と視認性を確認する。", "設定を1つ変え、同じ場面で明確に改善した場合だけ残す。", "問題が残る場合はオーバーレイと常駐ソフトを個別に試す。", "動作した基準を保存し、ゲームやドライバー更新後に再試験する。"),
    "wardogs-community-servers-guide": task("参加前にコミュニティサーバーを確認する", "DeployではOfficial、Community、Infantry Mode、Low-Levelを選べます。先にモードを決め、フレンドとサーバー、地域、陣営を合わせて参加します。Low-Levelの参加条件は表示されたルールで確認してください。", "プロバイダー、RCON、進行ルール、ブラウザーフィルターは過去の告知から変わる場合があります。", "古い一覧ではなく、ライブブラウザーか承認済みプロバイダーを開く。", "名前、地域、モード、ルール、管理連絡先を読む。", "進行やカスタム設定が公式マッチメイキングと異なるか確認する。", "大人数を集める前に遅延と接続安定性を試す。", "誤解を招く掲載は現在のゲームまたはプロバイダー手順で報告する。"),
    "wardogs-controls": task("現行クライアントで操作を確認する", "入力設定を開き、出撃前に必要な各操作の現在のゲーム内の割り当てを確認します。古いキー一覧を前提にせず、歩兵、通信、車両、専門操作を安全な場所で試してください。", "割り当て、機器認識、表示、リセット動作はビルド間で変わる場合があります。", "入力カテゴリを開き、移動と操作の現在のゲーム内の割り当てを記録する。", "マップ、ピン、ボイス、インベントリ、リロード、状況操作を個別に確認する。", "戦闘前に安全な場所で車両座席と軸を試す。", "競合を解消して適用し、再起動後も保存されているか確認する。", "パッチや機器ドライバー変更前に現在の配置を保存する。"),
    "wardogs-fob-guide": task("次の戦闘を支えるFOBを作る", "有用なFOBには、配置、必要な補給、通行、守備、撤収計画が必要です。建設や強化の前に、現行ビルドのメニューと資源条件を確認してください。", "建設費、配置条件、強化経路、利用可能な施設はビルド依存です。", "目的を決め、遮蔽、アクセス、敵圧力からの距離を考えて場所を選ぶ。", "必要な資源を確認し、建設前に輸送担当を決める。", "道路、スポーン出口、荷下ろし、味方の動線を空ける。", "直近の目標に必要な防御と機能だけを建てる。", "補給路を守り、修理、移転、放棄の判断を準備する。"),
    "wardogs-cargo-guide": task("貨物ループ全体を完了する", "要求された資源を積み、届け、使用可能な保管先へ移し、車両を次の任務に残して初めて輸送完了です。受け渡しごとに現在の貨物画面を確認してください。", "車両容量、資源名、積載操作、受け渡し区域は録画時のビルドと異なる場合があります。", "目的地に現在必要な資源と量を確認する。", "対応する輸送手段を選び、現在のインベントリに貨物が入ったか確認する。", "守れるルートを決め、到着前に荷下ろし場所を空ける。", "移送後、目的地の資源表示が実際に増えたか確認する。", "スポーンや補給路を塞がず離脱し、車両を次の輸送へ戻す。"),
    "wardogs-mortar-guide": task("装填・照準・着弾修正の順に進める", "対応弾薬と装填状態を確認し、発射位置と目標の距離・方位をそろえてから試射します。L81計算機の仰角・飛翔時間は推定値です。観測手と着弾を確認し、一項目ずつ修正してください。", "射程、弾薬、操作、設置条件はビルド依存です。未校正の地図ピクセル値をメートルとして入力せず、計算結果を命中保証にしないでください。", "設置砲、対応弾薬、現在の装填表示と補給を確認する。", "観測手と目標、味方位置、退避方向を共有する。", "校正した地図で水平距離を測り、L81計算機へ距離と確認済みの方位・高低差を入力する。", "試射1発の着弾を観測し、左右・近遠を伝えて一項目ずつ修正する。", "味方進入、標的移動、対砲撃があれば停止し、補給または移設を判断する。"),
    "wardogs-helicopter-guide": task("乗客なしで離陸から着陸まで練習する", "現在のキーと軸を確認し、ホバリング、垂直離陸、短い周回、着陸の順に練習します。進入前に減速し、機体を安定させて少しずつ降下します。障害物や横流れで着陸できない場合は上昇して再進入してください。", "キー、感度、HOTASの機器別設定は本ページでは未検証です。入力や飛行挙動は現在のクライアントで確認してください。", "乗客なしでピッチ、ロール、ヨー、上昇下降のキーと軸を一つずつ確認する。", "開けた場所で機首を安定させ、垂直離陸と低いホバリングを練習する。", "短い周回から広い着陸地点へ進入し、早めに減速して降下を小さくする。", "障害物、横流れ、攻撃があれば無理に接地せず、上昇して再進入する。", "離着陸を再現できてから乗員と目的地・代替地点を共有し、燃料と帰路を確認して輸送する。"),
    "wardogs-ps5": task("推測せずコンソール状況を確認する", "PS5版の発売日は公式には確認されていません。現在の公式ストアとWARDOGS公式告知を使い、出典のない日付や仮ページは未確認として扱ってください。", "PC Early Accessや第三者一覧から、コンソール日程、クロスプレイ、操作モード、販売状況を推測しないでください。", "WARDOGSとパブリッシャーの公式チャンネルで機種別告知を探す。", "PlayStation Storeを直接検索し、正式商品と仮ページを区別する。", "地域、版、クロスプレイ、進行情報を告知本文で確認する。", "一次情報へリンクしないカウントダウンや日付を無視する。", "ロードマップや発売更新後に再確認し、情報源の日付を残す。"),
    "wardogs-progression-wipes-guide": task("ワイプで消えるもの・残るものを確認する", "公式方針ではシーズン終了時にCashとXPがリセットされ、残ったCashはGold Barsへ自動変換されます。Gold Barsとコスメは維持されます。Season 2は10月15日開始予定ですが、正確な移行時刻・換算率・購入済み解除の扱いは未発表です。", "シーズン開始日を正確なリセット時刻と同一視せず、現在のGold市場レートを季末の自動変換に使わないでください。", "Cash、Career XP、各ロールXP、Gold Bars、コスメを更新前に別々に記録する。", "購入済み解除、装備、設定は保持や再支払いを決めつけず、未確認として記録する。", "公式移行告知で時刻と換算率を確認し、Betaの過去情報と分ける。", "更新後は買い直す前に残高と解除状態を比較し、予期しない差を日時付きで残す。", "継続するロールの解除条件を現在の画面と公式変更で確認してから進行を計画する。"),
    "wardogs-best-weapons-loadouts": task("1つの仕事向けに装備を組む", "最良の装備は、役割、距離、弾薬関係、チーム任務に合う最小コストの信頼できるセットです。固定Tier表ではなく、現在のショップとインベントリを比較してください。", "武器バランス、価格、解除、アタッチメント、弾薬、装甲、スロットは変更されます。", "役割、交戦距離、解決するチーム課題を決める。", "現在確認できる弾薬とマガジン関係を持つ武器を選ぶ。", "追加品より先に防護、医療、目的のある道具を加える。", "再購入リスクを確認し、安価な予備構成を用意する。", "同じ状況で試し、失敗した部分だけ変更する。"),
    "wardogs-equipment-tools-guide": task("戦場任務に合わせて装備を選ぶ", "医療、建築、修理、偵察、補給の任務に合わせて装備を選びます。IR距離計はSeason 2のバッテリー対応まで販売が一時停止されています。CWIS修正でHavocへの対処も変わるため、購入前に最新項目を確認しましょう。", "回数、容量、費用、操作表示、設置条件、対応対象はビルド依存です。", "医療、修理、建設、破壊、偵察、補給から任務を決める。", "現在の説明、必要資源、スロット、対応対象を確認する。", "安全に完了するための最小限の消耗品を持つ。", "安全な状況で操作し、対象の状態変化を確認する。", "分隊任務が変わったら道具を交換または外す。"),
    "wardogs-crash-fix": task("設定を変える前に障害を切り分ける", "Windows KB5124010に関連するWD-L020はWARDOGSパッチ0.1.2で対応されました。ゲーム更新とファイル確認後に再テストします。WD-L014とWD-L018は開発側が把握している別の起動エラーです。正確なコードを記録し、該当告知を確認してから関連する対処を選びましょう。", "特定の機器やビルドで効いた回避策が万能な修正とは限りません。", "ビルド、機器、ドライバー、エラー文、直前操作を記録する。", "現在の公式告知でアクセスやサービス障害を除外する。", "ゲームファイルを確認し、必要なシステム要素を更新する。", "オーバーレイ、フック、常駐ソフトを1つずつ止めて再試験する。", "クリーンな試験でも失敗する場合はログと再現手順を保存する。"),
    "wardogs-map": task("マップを移動計画に変える", "マップ上で現在の目標、確実なスポーン、輸送、補給、脅威、退路をつなぎます。有用なルートは静止画像より早く変わるため、大きな接触後は毎回確認してください。", "目標位置、ルート安全性、マーカー、地形、スポーンは試合やビルドで変わります。", "現在の目標と分隊の直近任務を確認する。", "分隊をまとめられるスポーンと輸送ルートを選ぶ。", "既知の脅威、補給、着陸場所、封鎖経路をマークする。", "開けた場所や車両投入前に退路を1つ用意する。", "接触、目標移動、スポーン喪失後に再度マップを開き修正する。" )
  },
  "zh-cn": {
    "wardogs-ammo-reload-guide": task("出发前先核对弹药", "购买或部署前，先对应武器、弹匣和弹药系列。测试版本记录中的兼容关系可能变化，因此每一项都要以当前商店和背包界面为准。", "旧口径表、弹匣名称或创作者配装都不能单独证明当前兼容性。", "确认武器，并读取当前界面中的弹药和弹匣说明。", "按预期目标和职责只选择一个弹药系列。", "先购买最低测试量，不要一次用完整套预算。", "在安全位置装填和换弹，确认背包与弹药计数同步变化。", "版本更新后先重新核对商店，再使用保存的配装。"),
    "wardogs-beginner-guide": task("完成一场有价值的新手对局", "先学会部署、识别当前目标、跟随小队和完成一种支援循环，再购买专业装备。精确数值以当前界面为准，不要直接套用旧版新手视频。", "旧版本中的价格、奖励、操作和进度可能已经与当前客户端不同。", "加入小队，阅读任务，并在地图上确认当前 Control Zone。", "选择一套便宜且有明确步兵或支援用途的配装。", "使用有组织的出生点或运输路线，不要独自穿越开阔地。", "围绕小队完成掩护、救援、补给或运输，不追逐孤立交火。", "阵亡后只改变计划中的一项，并为下一次出击保留资金。"),
    "wardogs-money-guide": task("在创造团队价值时保护资金", "选择一种可重复工作，保留资金储备，并计算每次生命结束后的净结果。当前收益和价格必须查看客户端，因此方法比永久收益表更可靠。", "某个版本或某场对局赚钱，不代表下一次仍有相同收益。", "选择目标支援、后勤、运输、维修或救援中的一种团队工作。", "购买装备或载具前设定可承受的损失上限。", "完成整个服务循环，并在当前界面确认奖励。", "扣除补购成本，记录净结果而不是毛收入。", "只有路线持续帮助团队且不会造成鲁莽损失时才重复使用。"),
    "wardogs-best-settings": task("建立可重复验证的设置基线", "从稳定基线开始，每次只改一个画面或显示选项。每次都比较同一场景，避免把可见度、帧时间和崩溃混成一个猜测。", "菜单名称和性能结果取决于当前版本、驱动、硬件、分辨率与战场负载。", "记录当前版本、硬件、驱动、分辨率和初始预设。", "选择可重复的场景，在改动前记录稳定度与可见度。", "只改一项并重复场景，只有明确改善时才保留。", "仍有卡顿时，分别测试覆盖层和后台程序。", "保存有效基线，并在游戏或驱动更新后重新测试。"),
    "wardogs-community-servers-guide": task("加入前核验社区服务器", "Deploy 已区分 Official、Community、Infantry Mode 和 Low-Level。先选模式，再与好友统一服务器、地区和阵营后加入；低等级场次按界面显示的资格条件进入。", "服务商、RCON、进度规则和浏览器筛选都可能与旧公告不同。", "查看实时浏览器或获准服务商页面，不使用旧服务器列表。", "加入前阅读名称、地区、模式、规则和管理联系方式。", "确认进度或自定义设置是否区别于官方匹配。", "组织大队伍前，先测试延迟与连接稳定性。", "通过当前服务商或游戏内流程举报误导性条目。"),
    "wardogs-controls": task("在当前客户端核对操作", "进入设置后，逐项核对出击所需动作的当前游戏内绑定。不要假设旧键位表仍然有效，应在安全位置测试步兵、沟通、载具和专业操作。", "绑定、设备识别、提示和重置行为都可能随版本变化。", "打开每个输入类别，记录移动与互动的当前游戏内绑定。", "逐项验证地图、标记、语音、背包、换弹和情境动作。", "进入战斗前，在安全位置测试载具座位与控制轴。", "解决冲突并应用，重启一次确认设置仍然保存。", "补丁或设备驱动变更前保存当前布局截图。"),
    "wardogs-fob-guide": task("建造能支持下一场战斗的 FOB", "有效 FOB 需要合理位置、正确补给、畅通入口、防守和撤离方案。放置或升级前，先核对当前版本菜单与资源要求。", "建造成本、有效放置规则、升级路径和可用设施都与版本相关。", "明确用途，选择有掩体、运输入口且不暴露在明显压力下的位置。", "开工前确认所需资源类型并安排运输。", "保持道路、出生出口、卸货区和友军动线畅通。", "只建造当前目标所需的防护与服务设施。", "保护补给路线，并准备维修、迁移或放弃失去价值的阵地。"),
    "wardogs-cargo-guide": task("完成完整货运循环", "只有所需资源被装载、送达、转入目的地可用库存，并且运输工具能继续执行任务，货运才算完成。每次交接都要查看当前货运界面。", "载具容量、资源名称、装载操作和转移区域可能与测试录像不同。", "询问目的地当前需要的资源类型与数量。", "选择兼容运输工具，并确认货物出现在当前库存中。", "规划受保护路线，到达前清空卸货区域。", "完成转移并确认目的地资源数字确实变化。", "离开时不堵住出生点或补给线，将载具带回下一轮。"),
    "wardogs-mortar-guide": task("执行可控的迫击炮任务", "迫击炮小组需要安全阵地、当前目标、观察员和可测量的修正。旧射程表与伤害结论只能参考，必须由当前版本重新确认。", "射程行为、弹药补给、伤害、操作和部署规则都可能改变。", "选择有掩体、补给通道和撤离空间的位置。", "装填前与观察员确认目标和友军位置。", "使用当前界面建立初始解算，不盲抄旧表。", "先打一发受控试射，每次只修正一个变量。", "目标移动、友军进入或遭遇反炮火时停止或转移。"),
    "wardogs-helicopter-guide": task("准备一次安全的直升机任务", "先核对当前飞行绑定，练习可控起降，并在运输小队或高价值资产前选择带中止方案的路线。成功任务应让飞行器还能继续服务下一项工作。", "飞行手感、设备支持、反制、维修、燃料和机型可用性都与版本相关。", "在当前客户端确认俯仰、横滚、偏航、升力、视角、座位和离机绑定。", "远离战斗练习悬停、起飞、进近、复飞和着陆。", "向乘员说明上车点、目的地、威胁和中止信号。", "选择有地形掩护与备用着陆区的路线。", "投送后离开威胁区，检查飞行器并判断下一次任务是否安全。"),
    "wardogs-ps5": task("不靠猜测核对主机状态", "PS5 发售日期尚未得到官方确认。只使用当前第一方商店页面和 WARDOGS 官方公告，没有来源的日期与占位页面仍按未确认处理。", "不要根据 PC 抢先体验或第三方列表推断主机日期、跨平台、手柄模式或商店可用性。", "检查 WARDOGS 与发行商官方渠道是否有平台专门公告。", "直接搜索 PlayStation Store，区分真实商品页与占位或提及。", "从公告原文核对地区、版本、跨平台和进度信息。", "忽略没有链接到一手来源的倒计时或发售日期。", "重大路线图或上线更新后重新核验，并保留来源日期。"),
    "wardogs-progression-wipes-guide": task("根据当前证据规划进度", "选择目标前先读取当前职业路线与官方更新说明。只围绕能明确推动对应进度条的行动建立可重复路线，不编造解锁耗时或删档规则。", "Beta 进度速度、职业位置、解锁等级、XP 来源与重置政策都不能视为永久规则。", "选择一个职业或解锁目标，并在对局前记录当前路线。", "清晰重复一种与该职业有关且对团队有用的行动。", "行动后立即检查进度条，避免其他奖励混入结果。", "将结果与最新官方变更对照，并明确标记未知项。", "进度补丁或重置公告后重新建立路线。"),
    "wardogs-best-weapons-loadouts": task("为一个明确任务组建配装", "最佳配装是能满足职责、距离、弹药关系和团队任务的最低成本可靠组合。比较当前商店与背包证据，不复制永久武器排名。", "武器平衡、价格、解锁、配件、弹药、护甲和槽位都可能随版本改变。", "定义职责、交战距离和需要解决的团队问题。", "选择当前可核实弹药与弹匣关系的武器。", "先加入防护、医疗与一种有明确用途的工具，再考虑额外物品。", "检查整套补购风险，并准备低成本备用方案。", "在一致场景中测试，只替换实际失败的部分。"),
    "wardogs-equipment-tools-guide": task("按战场任务选择装备", "按医疗、建造、维修、侦察或补给任务选装备。IR 测距仪暂时停止商店销售，等待 Season 2 的电池支持；CWIS 热修也调整了对 Havoc 的反制，投入资金前先查看对应更新。", "次数、容量、价格、互动提示、放置规则和兼容目标都与版本相关。", "先确定任务：医疗、维修、建造、爆破、侦察或补给。", "查看当前物品说明、所需资源、槽位和兼容目标。", "只携带安全完成任务所需的最低配套物资。", "在安全情境测试互动，并确认目标状态发生变化。", "小队任务变化后更换或移除不再有用的工具。"),
    "wardogs-crash-fix": task("改设置前先隔离故障", "Windows KB5124010 引发的 WD-L020 已由 WARDOGS 游戏补丁 0.1.2 处理，先更新游戏并验证文件再复测。WD-L014、WD-L018 是开发者已确认的另一组启动错误：记录准确代码并查看对应公告，再选与症状相关的处理步骤。", "某个硬件或游戏版本有效的临时方案，不代表它是通用修复。", "记录版本、硬件、驱动、错误文本和故障前最后一步操作。", "检查当前官方公告，排除访问或服务端事件。", "验证游戏文件并更新必要系统组件，再改高级设置。", "每次只禁用一个覆盖层、Hook 或后台工具并重复测试。", "纯净测试仍失败时，保存日志与可复现步骤后提交报告。"),
    "wardogs-map": task("把地图变成移动计划", "用地图连接当前目标、可靠出生点、运输、补给、威胁和备用路线。有效路线比静态地图变化更快，因此每次重大接触后都要重新查看。", "目标位置、路线安全、标记、地形表现和出生点会随对局或版本变化。", "确认当前目标与小队眼前任务。", "选择能让小队保持集结的出生点与运输路线。", "标记已知威胁、补给点、着陆区和受阻入口。", "穿越开阔地或投入载具前，先规划一条备用路线。", "发生接触、目标移动或出生点丢失后重新打开地图并调整。" )
  },

  pl: {"wardogs-ammo-reload-guide": task("Sprawdź amunicję przed wyruszeniem", "Przed zakupem i odrodzeniem dopasuj broń, magazynek i rodzinę amunicji. Każde oznaczenie zgodności sprawdź w obecnym sklepie i ekwipunku: relacje zapisane w wersji testowej mogą się zmienić.", "Stara lista kalibrów, nazwa magazynka lub zestaw twórcy nie dowodzi obecnej zgodności.", "Rozpoznaj broń i odczytaj aktualne oznaczenia amunicji oraz magazynków.", "Wybierz rodzinę amunicji odpowiednią do celu i roli.", "Kup małą ilość testową, zanim wydasz resztę budżetu.", "Załaduj i przeładuj w bezpiecznym miejscu; sprawdź ekwipunek i licznik amunicji.", "Po aktualizacji sprawdź sklep ponownie przed użyciem zapisanego zestawu."),
"wardogs-beginner-guide": task("Wnieś wkład w pierwszy mecz", "Giniesz, zanim pomożesz drużynie? Odradzaj się z oddziałem lub transportem, przemieszczaj między osłonami do aktywnej strefy kontroli i zabierz tani kompletny zestaw z jednym zadaniem wsparcia. Poznaj trasę przed ryzykowaniem drogiego sprzętu.", "Ceny, nagrody, sterowanie i postępy ze starszych wersji mogą różnić się od obecnej gry.", "Dołącz do oddziału, sprawdź jego zadanie i aktywną strefę kontroli na mapie.", "Wybierz niedrogi zestaw do konkretnej roli piechoty lub wsparcia.", "Korzystaj ze zorganizowanego odrodzenia lub transportu, zamiast samotnie przekraczać otwarty teren.", "Wspieraj walkę oddziału, reanimuj, zaopatruj lub transportuj, zanim ruszysz w odosobnioną potyczkę.", "Po śmierci zmień jeden element planu i zachowaj gotówkę na kolejne życie."),
"wardogs-money-guide": task("Chroń gotówkę i pomagaj zespołowi", "Wybierz powtarzalne zadanie, utrzymuj rezerwę i oceniaj wynik netto każdego życia. Wypłaty i ceny odczytuj z obecnej gry; korzystaj z procedury, nie ze stałej tabeli zarobków.", "Opłacalna trasa z jednej wersji lub meczu nie gwarantuje kolejnej wypłaty.", "Wybierz użyteczną rolę: wsparcie celu, logistykę, transport, naprawy lub reanimację.", "Ustal limit straty przed zakupem sprzętu lub pojazdu.", "Wykonaj całą usługę i potwierdź nagrodę w aktualnym interfejsie.", "Odejmij koszt odtworzenia wyposażenia i zapisuj wynik netto, nie przychód brutto.", "Powtarzaj trasę tylko wtedy, gdy pomaga zespołowi i nie wymaga lekkomyślnych strat."),
"wardogs-best-settings": task("Ustal powtarzalny punkt odniesienia ustawień", "Zacznij od stabilnej konfiguracji i zmieniaj jedną opcję grafiki lub obrazu naraz. Porównuj tę samą scenę, aby nie mieszać widoczności, płynności i awarii w jedną diagnozę.", "Nazwy opcji i wydajność zależą od wersji gry, sterownika, sprzętu, rozdzielczości i obciążenia walką.", "Zapisz wersję gry, sprzęt, sterownik, rozdzielczość i początkowy profil.", "Wybierz powtarzalną scenę i zanotuj stabilność klatek oraz widoczność przed zmianami.", "Zmień jedną opcję i powtórz scenę; zachowaj zmianę tylko przy wyraźnej poprawie.", "Jeśli zacięcia lub niestabilność pozostają, osobno przetestuj nakładki i narzędzia w tle.", "Zapisz działającą konfigurację i sprawdź ją po aktualizacji gry lub sterownika."),
"wardogs-community-servers-guide": task("Sprawdź serwer społeczności przed dołączeniem", "Deploy rozdziela Official, Community, Infantry Mode i Low-Level. Najpierw wybierz tryb, potem uzgodnij ze znajomymi serwer, region i drużynę. W Low-Level sprawdź warunki udziału wyświetlone w grze.", "Dostawcy hostingu, obsługa RCON, zasady postępów i filtry przeglądarki mogą odbiegać od dawnych zapowiedzi.", "Sprawdź aktualną przeglądarkę lub stronę zatwierdzonego dostawcy, nie starą listę.", "Przeczytaj nazwę, region, tryb, regulamin i kontakt do moderacji.", "Potwierdź, czy postępy lub ustawienia różnią się od oficjalnego dobierania graczy.", "Sprawdź opóźnienia i stabilność połączenia przed organizacją większej grupy.", "Zgłoś mylący wpis przez aktualną procedurę dostawcy lub gry."),
"wardogs-controls": task("Sprawdź sterowanie w aktualnej grze", "Przed wyruszeniem otwórz ustawienia wejścia i sprawdź przypisania potrzebnych działań. Sterowanie piechotą, komunikacją, pojazdami i sprzętem specjalnym testuj w bezpiecznym miejscu, nie zakładając aktualności starych list klawiszy.", "Przypisania, wykrywanie urządzeń, komunikaty i reset ustawień mogą zmieniać się między wersjami.", "Sprawdź każdą kategorię wejścia i zapisz bieżące przypisania ruchu oraz interakcji.", "Po kolei sprawdź mapę, oznaczenia, głos, ekwipunek, przeładowanie i działania kontekstowe.", "Przetestuj miejsca w pojazdach i osie sterowania poza walką.", "Usuń konflikty, zastosuj zmiany i uruchom grę ponownie, aby potwierdzić zapis.", "Zachowaj bieżący układ przed aktualizacją gry lub sterownika urządzenia."),
"wardogs-fob-guide": task("Zbuduj FOB przydatny w następnej walce", "Użyteczny FOB łączy położenie, potrzebne zasoby, drożny dostęp, obronę i plan odzyskania. Przed budową lub ulepszeniem sprawdź aktualne menu i wymagania materiałowe.", "Koszty, zasady rozmieszczania, ulepszenia i dostępne budowle zależą od wersji.", "Wybierz cel i osłonięte miejsce z dojazdem, poza oczywistym naciskiem wroga.", "Potwierdź typ potrzebnych zasobów i przydziel transport przed rozpoczęciem budowy.", "Pozostaw drożne drogi, wyjścia z odrodzenia, rozładunek i przejścia sojuszników.", "Zbuduj tylko ochronę i usługi potrzebne do najbliższego celu.", "Broń trasy dostaw; przygotuj naprawę, przeniesienie lub opuszczenie pozycji, gdy straci wartość."),
"wardogs-cargo-guide": task("Rozładuj paletę do FOB", "Jeśli rozładunek nic nie zmienia, sprawdź zamówiony zasób i prawidłową strefę odbioru. Użyj bieżącego komunikatu transferu i potwierdź wzrost dostępnych zapasów FOB. Upuszczenie palety nie dowodzi zakończenia dostawy.", "Ładowność, nazwy zasobów, sterowanie załadunkiem i strefy transferu mogą różnić się od wersji testowych.", "Zapytaj odbiorcę, jakiego zasobu i ilości potrzebuje teraz.", "Wybierz zgodny transport i potwierdź obecność ładunku w jego ekwipunku.", "Przed przyjazdem zaplanuj osłoniętą trasę i zapewnij wolne miejsce rozładunku.", "Przekaż ładunek i sprawdź rzeczywistą zmianę stanu zasobów odbiorcy.", "Odjedź bez blokowania odrodzenia i dostaw, a pojazd zachowaj na kolejny kurs."),
"wardogs-mortar-guide": task("Przeprowadź i skoryguj ostrzał moździerzowy", "Wyznacz aktualny cel za pomocą bieżących wskazań odległości i azymutu, oddaj strzał korygujący i przerwij ogień przy sojusznikach. Gracze opisują kamerę trafienia jako pomoc dla samotnej obsługi, lecz osobny obserwator poprawia bezpieczeństwo. Pod ostrzałem zerwij obserwację i zakłóć dostawy amunicji przeciwnika.", "Zasięg, zaopatrzenie, obrażenia, sterowanie i zasady stanowiska mogą zmieniać się między wersjami.", "Ustaw moździerz z osłoną dla załogi, dostępem do zapasów i drogą odwrotu.", "Przed załadowaniem strzału potwierdź cel i pozycje sojuszników z obserwatorem.", "Wyznacz początkowe ustawienie z bieżącego interfejsu, nie kopiuj bez sprawdzenia starej tabeli.", "Oddaj kontrolowany strzał, odbierz jednoznaczną korektę i zmieniaj jedną wartość naraz.", "Przerwij ogień lub zmień pozycję, gdy cel się przesunie, wkroczą sojusznicy albo zagrozi kontratak."),
"wardogs-helicopter-guide": task("Przygotuj bezpieczny lot śmigłowcem", "Sprawdź bieżące przypisania sterowania, przećwicz start i lądowanie oraz zaplanuj możliwość przerwania lotu przed zabraniem oddziału lub drogiego ładunku. Udana misja zachowuje maszynę do kolejnego zadania.", "Prowadzenie, obsługa urządzeń, środki obrony, naprawy, paliwo i dostępność zależą od wersji.", "Sprawdź sterowanie pochyleniem, przechyleniem, odchyleniem, skokiem ogólnym, widokiem, miejscem i wyjściem.", "Ćwicz zawis, start, podejście, odejście na drugi krąg i lądowanie z dala od walki.", "Ustal z pasażerami odbiór, cel, zagrożenia i sygnał przerwania.", "Leć trasą osłoniętą terenem z alternatywnym bezpiecznym lądowiskiem.", "Wysadź pasażerów, opuść zagrożenie, sprawdź maszynę i oceń bezpieczeństwo kolejnego lotu."),
"wardogs-ps5": task("Sprawdź status konsol bez zgadywania", "Data premiery na PS5 nie jest oficjalnie potwierdzona. Korzystaj z aktualnych stron oficjalnych sklepów i komunikatów WARDOGS; daty bez źródeł i strony tymczasowe traktuj jako niepotwierdzone.", "Wczesny dostęp na PC ani zewnętrzne oferty nie potwierdzają terminu konsol, cross-play, trybu kontrolera czy dostępności sklepowej.", "Szukaj komunikatu dla konkretnej platformy w oficjalnych kanałach gry i wydawcy.", "Sprawdź bezpośrednio PlayStation Store i odróżnij produkt od wzmianki lub strony tymczasowej.", "Przeczytaj szczegóły regionu, edycji, cross-play i postępów, zamiast zakładać zgodność z PC.", "Ignoruj odliczania i daty bez odnośnika do oficjalnego źródła.", "Sprawdź ponownie po ważnych zmianach planu wydania i zachowaj datę źródła."),
"wardogs-progression-wipes-guide": task("Planuj postępy według aktualnych dowodów", "Przed wyborem celu przeczytaj bieżącą ścieżkę roli i oficjalne zmiany. Oprzyj powtarzalny plan na działaniach widocznie przesuwających właściwy pasek, bez wymyślania czasu odblokowań i zasad resetu.", "Tempo bety, przypisanie ról, poziomy odblokowań, źródła XP i polityka resetu nie są niezmienne.", "Wybierz rolę lub cel odblokowania i zapisz stan ścieżki przed meczem.", "Wybierz użyteczne zespołowo działanie tej roli i powtarzaj je w porównywalny sposób.", "Sprawdź pasek po działaniu, aby nie pomylić wyniku z innymi nagrodami.", "Porównaj rezultat z najnowszymi oficjalnymi zmianami i oznacz niepewne dane.", "Zbuduj plan ponownie po aktualizacji postępów lub ogłoszeniu resetu."),
"wardogs-best-weapons-loadouts": task("Zbuduj zestaw do jednego zadania", "Najlepszy zestaw to najtańszy niezawodny sprzęt pasujący do roli, dystansu, amunicji i zadania zespołu. Porównuj aktualne dane sklepu i ekwipunku, zamiast kopiować stały ranking.", "Balans broni, cena, wymagania, dodatki, amunicja, pancerz i działanie slotów zależą od wersji.", "Określ rolę, dystans starć i problem zespołu do rozwiązania.", "Wybierz broń o potwierdzonej obecnie zgodności z amunicją i magazynkiem.", "Przed dodatkami opcjonalnymi dodaj ochronę, medykamenty i jedno celowe narzędzie.", "Sprawdź pełny koszt odtworzenia i zachowaj tańszą opcję na powtarzające się zgony.", "Przetestuj zestaw w stałych warunkach i zmień tylko element, który zawiódł."),
"wardogs-equipment-tools-guide": task("Dobierz sprzęt do zadania na polu bitwy", "Dobierz wyposażenie do leczenia, budowy, naprawy, zwiadu lub zaopatrzenia. Dalmierz IR tymczasowo wycofano ze sprzedaży do obsługi baterii w sezonie 2; poprawka CWIS zmienia także przeciwdziałanie Havoc. Sprawdź te zmiany przed zakupem.", "Ładunki, pojemności, koszty, komunikaty, rozmieszczanie i zgodne cele zależą od wersji.", "Nazwij zadanie: leczenie, naprawa, budowa, wyburzanie, zwiad albo zaopatrzenie.", "Sprawdź opis przedmiotu, wymagany zasób, slot i zgodny cel.", "Zabierz minimalne zapasy pozwalające bezpiecznie ukończyć zadanie.", "Przetestuj interakcję w bezpiecznym miejscu i potwierdź zmianę stanu celu.", "Wymień lub usuń narzędzie po zmianie zadania, zamiast nosić zbędny ciężar."),
"wardogs-crash-fix": task("Wyizoluj awarię przed zmianą ustawień", "Błąd WD-L020 związany z Windows KB5124010 objęto poprawką gry WARDOGS 0.1.2; zaktualizuj grę i sprawdź pliki przed kolejnym testem. WD-L014 i WD-L018 to osobne błędy uruchamiania potwierdzone przez twórców. Zapisz dokładny kod i sprawdź odpowiedni komunikat przed zmianą ustawień.", "Obejście pomagające na jednym sprzęcie lub w jednej wersji nie dowodzi uniwersalnej naprawy.", "Zapisz wersję, sprzęt, sterownik, komunikat błędu i ostatnią czynność przed awarią.", "Sprawdź oficjalne komunikaty, aby wykluczyć problem dostępu lub usługi.", "Zweryfikuj pliki gry i wymagane składniki systemu przed edycją zaawansowanych ustawień.", "Wyłączaj po jednej nakładce, narzędziu przechwytującym lub aplikacji w tle i powtarzaj test.", "Zachowaj logi i zgłoś kroki odtworzenia, jeśli czysty test nadal zawodzi."),
"wardogs-map": task("Zamień mapę w plan ruchu", "Połącz aktywny cel, pewne odrodzenie, transport, dostawy, zagrożenia i drogę odwrotu. Sprawdzaj mapę po większych starciach, bo użyteczna trasa zmienia się szybciej niż statyczny obraz.", "Położenie celów, bezpieczeństwo tras, oznaczenia, teren i dostępność odrodzeń zależą od meczu i wersji.", "Rozpoznaj aktywny cel i najbliższe zadanie oddziału.", "Wybierz odrodzenie i transport pozwalające pozostać razem.", "Oznacz znane zagrożenia, zapasy, lądowiska i zablokowane podejścia.", "Przed otwartym terenem lub użyciem pojazdu zaplanuj trasę odwrotu.", "Po kontakcie, zmianie celu lub utracie odrodzenia otwórz mapę i popraw trasę.")},
  "zh-tw": {
    "wardogs-ammo-reload-guide": task("出發前先核對彈藥", "購買或部署前，先對應武器、彈匣和彈藥系列。測試版本記錄中的相容關係可能變化，因此每一項都要以當前商店和背包介面為準。", "舊口徑表、彈匣名稱或創作者配裝都不能單獨證明當前相容性。", "確認武器，並讀取當前介面中的彈藥和彈匣說明。", "按預期目標和職責只選擇一個彈藥系列。", "先購買最低測試量，不要一次用完整套預算。", "在安全位置裝填和換彈，確認背包與彈藥計數同步變化。", "版本更新後先重新核對商店，再使用儲存的配裝。"),
    "wardogs-beginner-guide": task("完成一場有價值的新手對局", "先學會部署、識別當前目標、跟隨小隊和完成一種支援迴圈，再購買專業裝備。精確數值以當前介面為準，不要直接套用舊版新手影片。", "舊版本中的價格、獎勵、操作和進度可能已經與當前客戶端不同。", "加入小隊，閱讀任務，並在地圖上確認當前 Control Zone。", "選擇一套便宜且有明確步兵或支援用途的配裝。", "使用有組織的出生點或運輸路線，不要獨自穿越開闊地。", "圍繞小隊完成掩護、救援、補給或運輸，不追逐孤立交火。", "陣亡後只改變計劃中的一項，併為下一次出擊保留資金。"),
    "wardogs-money-guide": task("在創造團隊價值時保護資金", "選擇一種可重複工作，保留資金儲備，並計算每次生命結束後的淨結果。當前收益和價格必須檢視客戶端，因此方法比永久收益表更可靠。", "某個版本或某場對局賺錢，不代表下一次仍有相同收益。", "選擇目標支援、後勤、運輸、維修或救援中的一種團隊工作。", "購買裝備或載具前設定可承受的損失上限。", "完成整個服務迴圈，並在當前介面確認獎勵。", "扣除補購成本，記錄淨結果而不是毛收入。", "只有路線持續幫助團隊且不會造成魯莽損失時才重複使用。"),
    "wardogs-best-settings": task("建立可重複驗證的設定基線", "從穩定基線開始，每次只改一個畫面或顯示選項。每次都比較同一場景，避免把可見度、幀時間和崩潰混成一個猜測。", "選單名稱和效能結果取決於當前版本、驅動、硬體、解析度與戰場負載。", "記錄當前版本、硬體、驅動、解析度和初始預設。", "選擇可重複的場景，在改動前記錄穩定度與可見度。", "只改一項並重復場景，只有明確改善時才保留。", "仍有卡頓時，分別測試覆蓋層和後臺程式。", "儲存有效基線，並在遊戲或驅動更新後重新測試。"),
    "wardogs-community-servers-guide": task("加入前核驗社群伺服器", "Deploy 已區分 Official、Community、Infantry Mode 和 Low-Level。先選模式，再與好友統一伺服器、地區和陣營後加入；低等級場次按介面顯示的資格條件進入。", "服務商、RCON、進度規則和瀏覽器篩選都可能與舊公告不同。", "檢視即時瀏覽器或獲准服務商頁面，不使用舊伺服器列表。", "加入前閱讀名稱、地區、模式、規則和管理聯絡方式。", "確認進度或自定義設定是否區別於官方匹配。", "組織大隊伍前，先測試延遲與連線穩定性。", "通過當前服務商或遊戲內流程舉報誤導性條目。"),
    "wardogs-controls": task("在當前客戶端核對操作", "進入設定後，逐項核對出擊所需動作的當前遊戲內繫結。不要假設舊鍵位表仍然有效，應在安全位置測試步兵、溝通、載具和專業操作。", "繫結、裝置識別、提示和重置行為都可能隨版本變化。", "開啟每個輸入類別，記錄移動與互動的當前遊戲內繫結。", "逐項驗證地圖、標記、語音、背包、換彈和情境動作。", "進入戰鬥前，在安全位置測試載具座位與控制軸。", "解決衝突並應用，重啟一次確認設定仍然儲存。", "補丁或裝置驅動變更前儲存當前佈局截圖。"),
    "wardogs-fob-guide": task("建造能支援下一場戰鬥的 FOB", "有效 FOB 需要合理位置、正確補給、暢通入口、防守和撤離方案。放置或升級前，先核對當前版本選單與資源要求。", "建造成本、有效放置規則、升級路徑和可用設施都與版本相關。", "明確用途，選擇有掩體、運輸入口且不暴露在明顯壓力下的位置。", "開工前確認所需資源型別並安排運輸。", "保持道路、出生出口、卸貨區和友軍動線暢通。", "只建造當前目標所需的防護與服務設施。", "保護補給路線，並準備維修、遷移或放棄失去價值的陣地。"),
    "wardogs-cargo-guide": task("完成完整貨運迴圈", "只有所需資源被裝載、送達、轉入目的地可用庫存，並且運輸工具能繼續執行任務，貨運才算完成。每次交接都要檢視當前貨運介面。", "載具容量、資源名稱、裝載操作和轉移區域可能與測試錄影不同。", "詢問目的地當前需要的資源型別與數量。", "選擇相容運輸工具，並確認貨物出現在當前庫存中。", "規劃受保護路線，到達前清空卸貨區域。", "完成轉移並確認目的地資源數字確實變化。", "離開時不堵住出生點或補給線，將載具帶回下一輪。"),
    "wardogs-mortar-guide": task("執行可控的迫擊炮任務", "迫擊炮小組需要安全陣地、當前目標、觀察員和可測量的修正。舊射程表與傷害結論只能參考，必須由當前版本重新確認。", "射程行為、彈藥補給、傷害、操作和部署規則都可能改變。", "選擇有掩體、補給通道和撤離空間的位置。", "裝填前與觀察員確認目標和友軍位置。", "使用當前介面建立初始解算，不盲抄舊錶。", "先打一發受控試射，每次只修正一個變數。", "目標移動、友軍進入或遭遇反炮火時停止或轉移。"),
    "wardogs-helicopter-guide": task("準備一次安全的直升機任務", "先核對當前飛行繫結，練習可控起降，並在運輸小隊或高價值資產前選擇帶中止方案的路線。成功任務應讓飛行器還能繼續服務下一項工作。", "飛行手感、裝置支援、反制、維修、燃料和機型可用性都與版本相關。", "在當前客戶端確認俯仰、橫滾、偏航、升力、視角、座位和離機繫結。", "遠離戰鬥練習懸停、起飛、進近、復飛和著陸。", "向乘員說明上車點、目的地、威脅和中止訊號。", "選擇有地形掩護與備用著陸區的路線。", "投送後離開威脅區，檢查飛行器並判斷下一次任務是否安全。"),
    "wardogs-ps5": task("不靠猜測核對主機狀態", "PS5 發售日期尚未得到官方確認。只使用當前第一方商店頁面和 WARDOGS 官方公告，沒有來源的日期與佔位頁面仍按未確認處理。", "不要根據 PC 搶先體驗或第三方列表推斷主機日期、跨平臺、手柄模式或商店可用性。", "檢查 WARDOGS 與發行商官方渠道是否有平臺專門公告。", "直接搜尋 PlayStation Store，區分真實商品頁與佔位或提及。", "從公告原文核對地區、版本、跨平臺和進度資訊。", "忽略沒有連結到一手來源的倒計時或發售日期。", "重大路線圖或上線更新後重新核驗，並保留來源日期。"),
    "wardogs-progression-wipes-guide": task("根據當前證據規劃進度", "選擇目標前先讀取當前職業路線與官方更新說明。只圍繞能明確推動對應進度條的行動建立可重複路線，不編造解鎖耗時或刪檔規則。", "Beta 進度速度、職業位置、解鎖等級、XP 來源與重置政策都不能視為永久規則。", "選擇一個職業或解鎖目標，並在對局前記錄當前路線。", "清晰重複一種與該職業有關且對團隊有用的行動。", "行動後立即檢查進度條，避免其他獎勵混入結果。", "將結果與最新官方變更對照，並明確標記未知項。", "進度補丁或重置公告後重新建立路線。"),
    "wardogs-best-weapons-loadouts": task("為一個明確任務組建配裝", "最佳配裝是能滿足職責、距離、彈藥關係和團隊任務的最低成本可靠組合。比較當前商店與背包證據，不復制永久武器排名。", "武器平衡、價格、解鎖、配件、彈藥、護甲和槽位都可能隨版本改變。", "定義職責、交戰距離和需要解決的團隊問題。", "選擇當前可核實彈藥與彈匣關係的武器。", "先加入防護、醫療與一種有明確用途的工具，再考慮額外物品。", "檢查整套補購風險，並準備低成本備用方案。", "在一致場景中測試，只替換實際失敗的部分。"),
    "wardogs-equipment-tools-guide": task("按戰場任務選擇裝備", "按醫療、建造、維修、偵察或補給任務選裝備。IR 測距儀暫時停止商店銷售，等待 Season 2 的電池支援；CWIS 熱修也調整了對 Havoc 的反制，投入資金前先查看對應更新。", "次數、容量、價格、互動提示、放置規則和相容目標都與版本相關。", "先確定任務：醫療、維修、建造、爆破、偵察或補給。", "檢視當前物品說明、所需資源、槽位和相容目標。", "只攜帶安全完成任務所需的最低配套物資。", "在安全情境測試互動，並確認目標狀態發生變化。", "小隊任務變化後更換或移除不再有用的工具。"),
    "wardogs-crash-fix": task("改設定前先隔離故障", "Windows KB5124010 引發的 WD-L020 已由 WARDOGS 遊戲補丁 0.1.2 處理，先更新遊戲並驗證檔案再複測。WD-L014、WD-L018 是開發者已確認的另一組啟動錯誤：記錄準確代碼並查看對應公告，再選與症狀相關的處理步驟。", "某個硬體或遊戲版本有效的臨時方案，不代表它是通用修復。", "記錄版本、硬體、驅動、錯誤文本和故障前最後一步操作。", "檢查當前官方公告，排除訪問或服務端事件。", "驗證遊戲檔案並更新必要系統元件，再改進階設定。", "每次只停用一個覆蓋層、Hook 或後臺工具並重複測試。", "純淨測試仍失敗時，儲存日誌與可復現步驟後提交報告。"),
    "wardogs-map": task("把地圖變成移動計劃", "用地圖連線當前目標、可靠出生點、運輸、補給、威脅和備用路線。有效路線比靜態地圖變化更快，因此每次重大接觸後都要重新檢視。", "目標位置、路線安全、標記、地形表現和出生點會隨對局或版本變化。", "確認當前目標與小隊眼前任務。", "選擇能讓小隊保持集結的出生點與運輸路線。", "標記已知威脅、補給點、著陸區和受阻入口。", "穿越開闊地或投入載具前，先規劃一條備用路線。", "發生接觸、目標移動或出生點丟失後重新開啟地圖並調整。")
}
};

const taskSlugSet = new Set<string>(guideTaskSlugs);

export function getGuideTaskUi(locale: Locale): GuideTaskUi {
  return ui[locale];
}

export function getGuideTaskData(slug: string, locale: Locale, authoredDirectAnswer?: string): GuideTaskData | undefined {
  if (!taskSlugSet.has(slug)) return undefined;

  const taskSlug = slug as GuideTaskSlug;
  const localized = taskSlug === "wardogs-artillery-guide" ? {
    title: discoveryMessage(locale, "guides.tasks.artillery.title"),
    directAnswer: discoveryMessage(locale, "guides.tasks.artillery.directAnswer"),
    caution: discoveryMessage(locale, "guides.tasks.artillery.caution"),
    steps: ["one", "two", "three", "four", "five"].map((step) => discoveryMessage(locale, `guides.tasks.artillery.steps.${step}`))
  } : copy[locale][taskSlug];
  const tool = relatedTools[taskSlug];

  return {
    slug: taskSlug,
    eyebrow: ui[locale].eyebrow,
    ...localized,
    directAnswer: authoredDirectAnswer?.trim() || localized.directAnswer,
    relatedTool: tool ? {href: tool.href, label: toolLabel(locale, tool.key)} : undefined,
    ...getGuideDiscoveryLinks(taskSlug, locale),
    videos: getCurrentVideoSourcesForGuide(taskSlug)
  };
}


type MessageTree = {[key: string]: string | MessageTree};
const discoveryMessages = {en: enMessages, de: deMessages, ru: ruMessages, "pt-br": ptBrMessages, ja: jaMessages, "zh-cn": zhCnMessages, "zh-tw": zhTwMessages, pl: plMessages} satisfies Record<Locale, object>;
function discoveryMessage(locale: Locale, key: string): string {
  let value: string | MessageTree = discoveryMessages[locale] as MessageTree;
  for (const segment of key.split(".")) {
    if (typeof value === "string" || !(segment in value)) throw new Error(`Missing localized discovery message: ${locale}/${key}`);
    value = value[segment];
  }
  if (typeof value !== "string") throw new Error(`Invalid discovery message: ${locale}/${key}`);
  return value;
}

export type GuideCatalogueLink = {href: string; label: string; locale: Locale};
// Only categories that help complete this guide's task belong here. PC checks
// and progression do not acquire generic catalogue links without item evidence.
const guideCatalogueTypes: Readonly<Record<string, readonly ItemTypeId[]>> = {
  "wardogs-ammo-reload-guide": ["weapons", "ammo", "attachments"],
  "wardogs-beginner-guide": ["loadouts", "gear"],
  "wardogs-money-guide": ["loadouts", "gear"],
  "wardogs-best-weapons-loadouts": ["weapons", "ammo", "attachments", "gear"],
  "wardogs-equipment-tools-guide": ["equipment", "medical", "deployables"],
  "wardogs-cargo-guide": ["vehicles", "supplies"],
  "wardogs-fob-guide": ["mechanics", "equipment"],
  "wardogs-oil-rig-guide": ["vehicles", "mechanics"],
  "wardogs-helicopter-guide": ["vehicles"],
  "wardogs-map": ["mechanics"],
  "wardogs-infantry-mode": ["mechanics"],
  "wardogs-mortar-guide": ["mechanics", "equipment"],
  "wardogs-artillery-guide": ["vehicles", "mechanics"]
};

export function getGuideDiscoveryLinks(slug: string, locale: Locale) {
  const registered = TOOL_REGISTRY.filter((tool) => tool.relatedGuideSlugs.some((relatedSlug) => relatedSlug === slug));
  const primary = relatedTools[slug as GuideTaskSlug];
  const tools = new Map<string, {href: string; label: string}>(registered.map((tool) => [tool.href as string, {href: tool.href, label: discoveryMessage(locale, tool.labelKey)}]));
  if (primary && !tools.has(primary.href)) tools.set(primary.href, {href: primary.href, label: toolLabel(locale, primary.key)});
  const relatedCatalogue: GuideCatalogueLink[] = (guideCatalogueTypes[slug] ?? []).map((id) => {
    const type = getItemType(id);
    if (!type) throw new Error(`Missing discovery catalogue category: ${id}`);
    const target = resolveItemRouteTarget(locale, type.href);
    return {href: target.pathname, locale: target.locale, label: getLocalizedItemType(type, locale).label};
  });
  return {relatedTools: [...tools.values()], relatedCatalogue};
}
