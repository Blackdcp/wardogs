import {AlertCircle, CheckCircle2, Clock, ExternalLink, Radio} from "lucide-react";
import type {Locale} from "@/config/site";
import {CURRENT_EVENT} from "@/features/live-ops/current-event";

const copy: Record<Locale, {
  eyebrow: string;
  unknown: string;
  notice: string;
  next: string;
  official: string;
  steamStatus: string;
  steamStatusVal: string;
  telemetryStatus: string;
  telemetryStatusVal: string;
  maintenanceStatus: string;
  maintenanceStatusVal: string;
}> = {
  en: {
    eyebrow: "Server status at a glance",
    unknown: "Live server uptime is not verified",
    notice: "The official Patch 0.11 notice covered a September 14 maintenance window. That window has passed; it does not prove servers are online now.",
    next: "If login or the server browser fails, check the official feed, then compare your region and error with other current reports.",
    official: "Official Steam notices",
    steamStatus: "Steam Platform",
    steamStatusVal: "Early Access Live",
    telemetryStatus: "Game Server Telemetry",
    telemetryStatusVal: "Unverified / Check Feed",
    maintenanceStatus: "Last Maintenance Window",
    maintenanceStatusVal: "Patch 0.11 (Sep 14) Concluded"
  },
  de: {
    eyebrow: "Serverstatus auf einen Blick",
    unknown: "Der aktuelle Serverbetrieb ist nicht verifiziert",
    notice: "Die offizielle Mitteilung zu Patch 0.11 nannte eine Wartung am 14. September. Das Zeitfenster ist vorbei; daraus folgt kein aktueller Online-Status.",
    next: "Bei Login- oder Browserproblemen zuerst offizielle Meldungen prüfen, dann Region und Fehlermeldung mit aktuellen Berichten vergleichen.",
    official: "Offizielle Steam-Meldungen",
    steamStatus: "Steam-Plattform",
    steamStatusVal: "Early Access aktiv",
    telemetryStatus: "Server-Telemetrie",
    telemetryStatusVal: "Unbestätigt / Feed prüfen",
    maintenanceStatus: "Letzte Wartung",
    maintenanceStatusVal: "Patch 0.11 (14. Sept.) beendet"
  },
  ru: {
    eyebrow: "Состояние серверов",
    unknown: "Работа серверов прямо сейчас не подтверждена",
    notice: "Официальное сообщение о Patch 0.11 указывало обслуживание 14 сентября. Оно уже завершилось, но это не подтверждает доступность серверов сейчас.",
    next: "При проблемах со входом или списком серверов проверьте официальные новости, регион и точную ошибку.",
    official: "Официальные новости Steam",
    steamStatus: "Платформа Steam",
    steamStatusVal: "Ранний доступ активен",
    telemetryStatus: "Телеметрия серверов",
    telemetryStatusVal: "Не подтверждена / лента",
    maintenanceStatus: "Последнее обслуживание",
    maintenanceStatusVal: "Patch 0.11 (14 сент.) завершено"
  },
  "pt-br": {
    eyebrow: "Status dos servidores",
    unknown: "A disponibilidade dos servidores agora não foi verificada",
    notice: "O aviso oficial do Patch 0.11 incluía manutenção em 14 de setembro. A janela passou, mas isso não confirma que os servidores estejam online agora.",
    next: "Se o login ou navegador de servidores falhar, confira os avisos oficiais e compare região e erro com relatos atuais.",
    official: "Avisos oficiais na Steam",
    steamStatus: "Plataforma Steam",
    steamStatusVal: "Acesso Antecipado ativo",
    telemetryStatus: "Telemetria de servidores",
    telemetryStatusVal: "Não verificada / veja avisos",
    maintenanceStatus: "Última manutenção",
    maintenanceStatusVal: "Patch 0.11 (14 de set.) concluída"
  },
  ja: {
    eyebrow: "サーバー状態の要点",
    unknown: "現在の稼働状況は確認できていません",
    notice: "公式のPatch 0.11告知には9月14日のメンテナンス予定がありました。予定時刻は過ぎていますが、現在の稼働を保証するものではありません。",
    next: "ログインやサーバー一覧に問題がある場合は、公式告知を確認し、地域とエラーを最近の報告と照合してください。",
    official: "Steam公式告知",
    steamStatus: "Steamプラットフォーム",
    steamStatusVal: "アーリーアクセス稼働中",
    telemetryStatus: "サーバーテレメトリ",
    telemetryStatusVal: "未確認 / 公式告知参照",
    maintenanceStatus: "前回のメンテナンス",
    maintenanceStatusVal: "Patch 0.11 (9月14日) 終了"
  },
  "zh-cn": {
    eyebrow: "服务器状态速览",
    unknown: "当前服务器在线情况尚未核实",
    notice: "官方 Patch 0.11 公告提到 9 月 14 日维护；该时间窗口已经过去，但不能据此断言现在服务器正常。",
    next: "若登录或服务器列表异常，先看官方公告，再按地区和具体报错核对近期反馈。",
    official: "Steam 官方公告",
    steamStatus: "Steam 平台状态",
    steamStatusVal: "抢先体验运行中",
    telemetryStatus: "游戏服务器遥测",
    telemetryStatusVal: "未核实 / 查看动态",
    maintenanceStatus: "最近计划维护",
    maintenanceStatusVal: "Patch 0.11 (9月14日) 已结束"
  },
  pl: {
    eyebrow: "Stan serwerów w skrócie",
    unknown: "Bieżąca dostępność serwerów nie jest potwierdzona",
    notice: "Oficjalny komunikat o aktualizacji 0.11 dotyczył konserwacji 14 września. Ten termin już minął i nie potwierdza, że serwery działają teraz.",
    next: "Jeśli logowanie lub przeglądarka serwerów nie działa, sprawdź oficjalne komunikaty, a następnie porównaj region i błąd z aktualnymi zgłoszeniami.",
    official: "Oficjalne komunikaty Steam",
    steamStatus: "Platforma Steam",
    steamStatusVal: "Wczesny dostęp aktywny",
    telemetryStatus: "Telemetria serwerów",
    telemetryStatusVal: "Niepotwierdzona / sprawdź wpisy",
    maintenanceStatus: "Ostatnia konserwacja",
    maintenanceStatusVal: "Patch 0.11 (14 wrz) zakończona"
  },
  "zh-tw": {
    eyebrow: "伺服器狀態速覽",
    unknown: "當前伺服器線上情況尚未核實",
    notice: "官方 Patch 0.11 公告提到 9 月 14 日維護；該時間視窗已經過去，但不能據此斷言現在伺服器正常。",
    next: "若登入或伺服器列表異常，先看官方公告，再按地區和具體報錯核對近期反饋。",
    official: "Steam 官方公告",
    steamStatus: "Steam 平台狀態",
    steamStatusVal: "搶先體驗運行中",
    telemetryStatus: "遊戲伺服器遙測",
    telemetryStatusVal: "未核實 / 查看動態",
    maintenanceStatus: "最近計劃維護",
    maintenanceStatusVal: "Patch 0.11 (9月14日) 已結束"
  }
};

export function ServerStatusSignal({locale}: {locale: Locale}) {
  const text = copy[locale];
  return (
    <section aria-labelledby="server-status-signal-title" className="border-b border-[#3a423b] bg-[#141b16]" data-server-status-signal="unverified">
      <div className="site-container max-w-4xl py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29352c] pb-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a9c1ae]">
            <Radio aria-hidden="true" className="size-4 animate-pulse text-[#e5a840]" />
            {text.eyebrow}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#544321] bg-[#292010] px-2.5 py-0.5 font-mono text-xs font-medium text-[#ffd074]">
            <Clock aria-hidden="true" className="size-3" />
            Season 1 Live Ops
          </span>
        </div>

        <h2 id="server-status-signal-title" className="display-font mt-4 text-2xl font-bold text-white md:text-3xl">
          {text.unknown}
        </h2>

        {/* Diagnostic Status Cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[#2b3a30] bg-[#0c120e] p-3.5">
            <span className="block text-xs font-medium text-[#8ea496]">{text.steamStatus}</span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#82e1a3]">
              <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-[#69c78f]" />
              {text.steamStatusVal}
            </span>
          </div>
          <div className="rounded border border-[#43351f] bg-[#16120b] p-3.5">
            <span className="block text-xs font-medium text-[#d3b27b]">{text.telemetryStatus}</span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f8cb6e]">
              <AlertCircle aria-hidden="true" className="size-4 shrink-0 text-[#f59e0b]" />
              {text.telemetryStatusVal}
            </span>
          </div>
          <div className="rounded border border-[#2b3a30] bg-[#0c120e] p-3.5">
            <span className="block text-xs font-medium text-[#8ea496]">{text.maintenanceStatus}</span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#c8d4cd]">
              <Clock aria-hidden="true" className="size-4 shrink-0 text-[#8ea496]" />
              {text.maintenanceStatusVal}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#d1dcd3]">{text.notice}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d1dcd3]">{text.next}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            className="inline-flex min-h-11 items-center gap-1.5 rounded border border-[#3e7855] bg-[#1c3a29] px-4 py-2 text-sm font-semibold text-[#d4f6e1] transition-colors hover:bg-[#28533b] hover:text-white"
            href={CURRENT_EVENT.latestOfficialUrl}
            rel="noreferrer"
            target="_blank"
            title={text.official}
          >
            {text.official}
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

