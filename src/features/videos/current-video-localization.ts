import type {Locale} from "@/config/site";
import type {CurrentVideoTopic} from "@/features/videos/video-library";

type TopicCopy = {label: string; summary: string};

export type CurrentVideoUi = {
  allTopics: string;
  filterLabel: string;
  published: string;
  reviewed: string;
  creatorGuidance: string;
  viewGuide: string;
  topics: Record<CurrentVideoTopic, TopicCopy>;
};

const copy: Record<Locale, CurrentVideoUi> = {
  en: {
    allTopics: "All player tasks",
    filterLabel: "Filter reviewed videos by player task",
    published: "Published",
    reviewed: "Reviewed",
    creatorGuidance: "Reviewed creator guidance. Check current-client details and official notes before acting on version-sensitive claims.",
    viewGuide: "Open related guide",
    topics: {
      beginner: {label: "First match", summary: "First-match setup, practical controls, and survival habits."},
      money: {label: "Money and XP", summary: "Creator routes for money and XP; verify current rewards and prices in the live client."},
      progression: {label: "Roles and progression", summary: "Role planning and progression observations, not guaranteed unlock timing."},
      loadouts: {label: "Weapons and loadouts", summary: "Creator loadout guidance; recheck balance, unlocks, and equipment availability."},
      fob: {label: "FOB operations", summary: "FOB placement and breach observations for the current Season 1 client."},
      cargo: {label: "Supply and logistics", summary: "Focused supply and delivery workflows; confirm menus and resources in-game."},
      vehicles: {label: "Vehicles", summary: "Vehicle-role guidance without promising a fixed unlock pace."},
      helicopter: {label: "Helicopters", summary: "Flight guidance for current controls, with input and handling rechecked in-client."},
      building: {label: "Building", summary: "A current creator case study for FOB construction and team coordination."},
      drones: {label: "Drones", summary: "Drone operation observations; supply, cost, and effectiveness are version-sensitive."},
      settings: {label: "Settings and performance", summary: "Visibility, FPS, and keybind guidance that depends on hardware and the current build."},
      teamplay: {label: "Teamplay", summary: "Teamwork and practical systems guidance from current creator footage."},
      controls: {label: "Controls", summary: "Hidden controls and interaction mechanics; verify shortcuts in the current client."},
      patches: {label: "Season 1 changes", summary: "Creator interpretation of a patch; official notes remain the authoritative record."},
      mortar: {label: "Mortars", summary: "Current mortar-operation guidance; ranges and damage require a live-client check."}
    }
  },
  de: {
    allTopics: "Alle Spieleraufgaben",
    filterLabel: "Geprüfte Videos nach Spieleraufgabe filtern",
    published: "Veröffentlicht",
    reviewed: "Geprüft",
    creatorGuidance: "Geprüfte Creator-Anleitung. Prüfe versionsabhängige Aussagen vor dem Handeln im aktuellen Client und in offiziellen Hinweisen.",
    viewGuide: "Verwandten Guide öffnen",
    topics: {
      beginner: {label: "Erstes Match", summary: "Vorbereitung für das erste Match, praktische Steuerung und Überlebensroutinen."},
      money: {label: "Geld und XP", summary: "Creator-Routen für Geld und XP; aktuelle Belohnungen und Preise im Live-Client prüfen."},
      progression: {label: "Rollen und Fortschritt", summary: "Rollenplanung und Fortschrittsbeobachtungen, keine garantierten Freischaltzeiten."},
      loadouts: {label: "Waffen und Loadouts", summary: "Creator-Loadout-Hinweise; Balance, Freischaltungen und Ausrüstung neu prüfen."},
      fob: {label: "FOB-Einsätze", summary: "Beobachtungen zu FOB-Platzierung und Durchbruch im aktuellen Season-1-Client."},
      cargo: {label: "Nachschub und Logistik", summary: "Konkrete Nachschub- und Lieferabläufe; Menüs und Ressourcen im Spiel bestätigen."},
      vehicles: {label: "Fahrzeuge", summary: "Fahrzeugrollen ohne Zusage eines festen Freischalttempos."},
      helicopter: {label: "Helikopter", summary: "Flughinweise für aktuelle Steuerung; Eingabe und Handling im Client erneut prüfen."},
      building: {label: "Bauen", summary: "Aktuelle Creator-Fallstudie zu FOB-Bau und Teamkoordination."},
      drones: {label: "Drohnen", summary: "Beobachtungen zur Drohnennutzung; Nachschub, Kosten und Wirkung sind versionsabhängig."},
      settings: {label: "Einstellungen und Leistung", summary: "Hinweise zu Sicht, FPS und Tasten, abhängig von Hardware und aktuellem Build."},
      teamplay: {label: "Teamspiel", summary: "Teamarbeit und praktische Systeme aus aktuellem Creator-Material."},
      controls: {label: "Steuerung", summary: "Versteckte Steuerung und Interaktionsmechaniken; Tastenkürzel im aktuellen Client prüfen."},
      patches: {label: "Season-1-Änderungen", summary: "Creator-Interpretation eines Patches; offizielle Hinweise bleiben maßgeblich."},
      mortar: {label: "Mörser", summary: "Aktuelle Mörser-Anleitung; Reichweite und Schaden im Live-Client prüfen."}
    }
  },
  ru: {
    allTopics: "Все задачи игрока",
    filterLabel: "Фильтровать проверенные видео по задаче игрока",
    published: "Опубликовано",
    reviewed: "Проверено",
    creatorGuidance: "Проверенное руководство автора. Перед действием сверяйте зависящие от версии утверждения с текущим клиентом и официальными заметками.",
    viewGuide: "Открыть связанный гайд",
    topics: {
      beginner: {label: "Первый матч", summary: "Подготовка к первому матчу, практичные настройки и привычки выживания."},
      money: {label: "Деньги и XP", summary: "Маршруты автора для денег и XP; текущие награды и цены проверяйте в клиенте."},
      progression: {label: "Роли и прогресс", summary: "Планирование ролей и наблюдения за прогрессом без обещаний сроков разблокировки."},
      loadouts: {label: "Оружие и комплекты", summary: "Советы автора по комплектам; перепроверяйте баланс, разблокировки и доступность."},
      fob: {label: "Операции FOB", summary: "Наблюдения о размещении и штурме FOB в текущем клиенте первого сезона."},
      cargo: {label: "Снабжение и логистика", summary: "Точные циклы снабжения и доставки; подтверждайте меню и ресурсы в игре."},
      vehicles: {label: "Техника", summary: "Рекомендации по ролям техники без обещания постоянного темпа разблокировки."},
      helicopter: {label: "Вертолеты", summary: "Советы по полету с проверкой текущих настроек управления и поведения в клиенте."},
      building: {label: "Строительство", summary: "Актуальный пример автора по строительству FOB и координации команды."},
      drones: {label: "Дроны", summary: "Наблюдения за дронами; снабжение, стоимость и эффективность зависят от версии."},
      settings: {label: "Настройки и производительность", summary: "Советы по видимости, FPS и клавишам зависят от железа и текущего билда."},
      teamplay: {label: "Командная игра", summary: "Командные и практические системы из актуального материала автора."},
      controls: {label: "Управление", summary: "Скрытые элементы управления и механики взаимодействия; проверяйте сочетания в текущем клиенте."},
      patches: {label: "Изменения первого сезона", summary: "Интерпретация патча автором; официальные заметки остаются главным источником."},
      mortar: {label: "Минометы", summary: "Актуальная работа с минометом; дальность и урон проверяйте в клиенте."}
    }
  },
  "pt-br": {
    allTopics: "Todas as tarefas do jogador",
    filterLabel: "Filtrar vídeos revisados por tarefa do jogador",
    published: "Publicado",
    reviewed: "Revisado",
    creatorGuidance: "Guia de criador revisado. Confirme alegações sensíveis à versão no cliente atual e nas notas oficiais antes de agir.",
    viewGuide: "Abrir guia relacionado",
    topics: {
      beginner: {label: "Primeira partida", summary: "Preparação para a primeira partida, controles práticos e hábitos de sobrevivência."},
      money: {label: "Dinheiro e XP", summary: "Rotas de dinheiro e XP do criador; confirme recompensas e preços no cliente ao vivo."},
      progression: {label: "Funções e progressão", summary: "Planejamento de função e observações de progresso, sem garantir tempo de desbloqueio."},
      loadouts: {label: "Armas e kits", summary: "Orientação de kit do criador; reveja balanceamento, desbloqueios e disponibilidade."},
      fob: {label: "Operações de FOB", summary: "Observações de colocação e invasão de FOB no cliente atual da Temporada 1."},
      cargo: {label: "Suprimento e logística", summary: "Ciclos diretos de suprimento e entrega; confirme menus e recursos no jogo."},
      vehicles: {label: "Veículos", summary: "Orientação de função de veículo sem prometer ritmo fixo de desbloqueio."},
      helicopter: {label: "Helicópteros", summary: "Orientação de voo com controles e dirigibilidade confirmados no cliente."},
      building: {label: "Construção", summary: "Estudo atual de criador sobre construção de FOB e coordenação de equipe."},
      drones: {label: "Drones", summary: "Observações sobre drones; suprimento, custo e eficácia dependem da versão."},
      settings: {label: "Configurações e desempenho", summary: "Dicas de visibilidade, FPS e teclas dependem do hardware e da build atual."},
      teamplay: {label: "Jogo em equipe", summary: "Trabalho em equipe e sistemas práticos em material atual de criador."},
      controls: {label: "Controles", summary: "Controles ocultos e mecânicas de interação; confirme atalhos no cliente atual."},
      patches: {label: "Mudanças da Temporada 1", summary: "Interpretação de patch por criador; as notas oficiais continuam sendo o registro principal."},
      mortar: {label: "Morteiros", summary: "Orientação atual de morteiro; confirme alcance e dano no cliente ao vivo."}
    }
  },
  ja: {
    allTopics: "すべてのプレイヤー課題",
    filterLabel: "プレイヤー課題で確認済み動画を絞り込む",
    published: "公開日",
    reviewed: "確認日",
    creatorGuidance: "確認済みのクリエイターガイドです。バージョン依存の主張は行動前に現行クライアントと公式ノートで確認してください。",
    viewGuide: "関連ガイドを開く",
    topics: {
      beginner: {label: "初戦", summary: "初戦の準備、実用的な操作、生存の基本。"},
      money: {label: "資金とXP", summary: "クリエイターによる資金とXPのルート。報酬と価格は現行クライアントで確認します。"},
      progression: {label: "ロールと進行", summary: "ロール計画と進行の観察であり、解除時間を保証しません。"},
      loadouts: {label: "武器とロードアウト", summary: "クリエイターの装備案。バランス、解除、入手可否を再確認します。"},
      fob: {label: "FOB運用", summary: "Season 1現行クライアントのFOB配置と攻略に関する観察。"},
      cargo: {label: "補給と兵站", summary: "直接的な補給・配送手順。メニューと資源はゲーム内で確認します。"},
      vehicles: {label: "車両", summary: "固定の解除ペースを約束しない車両ロールのガイド。"},
      helicopter: {label: "ヘリコプター", summary: "現行操作向けの飛行ガイド。入力と挙動はクライアントで再確認します。"},
      building: {label: "建設", summary: "FOB建設とチーム連携に関する現行クリエイター事例。"},
      drones: {label: "ドローン", summary: "ドローン運用の観察。補給、コスト、効果はバージョン依存です。"},
      settings: {label: "設定と性能", summary: "視認性、FPS、キー設定のガイドで、ハードウェアと現行ビルドに依存します。"},
      teamplay: {label: "チームプレイ", summary: "現行クリエイター映像によるチームワークと実用システム。"},
      controls: {label: "操作", summary: "隠れた操作とインタラクションの仕組み。ショートカットは現行クライアントで確認します。"},
      patches: {label: "Season 1の変更", summary: "クリエイターによるパッチ解釈であり、公式ノートが正式な記録です。"},
      mortar: {label: "迫撃砲", summary: "現行の迫撃砲ガイド。射程とダメージはライブクライアントで確認します。"}
    }
  },
  "zh-cn": {
    allTopics: "全部玩家任务",
    filterLabel: "按玩家任务筛选已审核视频",
    published: "发布日期",
    reviewed: "审核日期",
    creatorGuidance: "已审核的创作者指导。采取行动前，请在当前客户端和官方公告中复核版本敏感结论。",
    viewGuide: "打开相关攻略",
    topics: {
      beginner: {label: "第一局", summary: "第一局准备、实用操作和生存习惯。"},
      money: {label: "资金和 XP", summary: "创作者的资金与 XP 路线；当前奖励和价格请在客户端复核。"},
      progression: {label: "职业和进度", summary: "职业规划与进度观察，不保证固定解锁时间。"},
      loadouts: {label: "武器和配装", summary: "创作者配装指导；平衡、解锁和物品可用性需要重新确认。"},
      fob: {label: "FOB 行动", summary: "当前 Season 1 客户端中的 FOB 选址与突破观察。"},
      cargo: {label: "补给和后勤", summary: "直接的补给与运输流程；菜单和资源请在游戏中确认。"},
      vehicles: {label: "载具", summary: "载具职责指导，不承诺固定的解锁速度。"},
      helicopter: {label: "直升机", summary: "面向当前控制方式的飞行指导；输入和手感需在客户端复核。"},
      building: {label: "建造", summary: "关于 FOB 建造和团队协作的当前创作者案例。"},
      drones: {label: "无人机", summary: "无人机操作观察；补给、成本和效果均与版本相关。"},
      settings: {label: "设置和性能", summary: "可见度、FPS 与按键建议取决于硬件和当前版本。"},
      teamplay: {label: "团队协作", summary: "来自当前创作者视频的团队协作和实用系统指导。"},
      controls: {label: "操作", summary: "隐藏操作和交互机制；请在当前客户端复核快捷键。"},
      patches: {label: "Season 1 改动", summary: "创作者对补丁的解读；官方说明仍是权威记录。"},
      mortar: {label: "迫击炮", summary: "当前迫击炮操作指导；射程和伤害必须在客户端复核。"}
    }
  }
};

export function getCurrentVideoUi(locale: Locale) {
  return copy[locale];
}
