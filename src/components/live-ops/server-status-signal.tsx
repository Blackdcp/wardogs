import type {Locale} from "@/config/site";
import {CURRENT_EVENT} from "@/features/live-ops/current-event";

const copy: Record<Locale, {eyebrow: string; unknown: string; notice: string; next: string; official: string}> = {
  en: {
    eyebrow: "Server status at a glance",
    unknown: "Live server uptime is not verified",
    notice: "The official Patch 0.11 notice covered a September 14 maintenance window. That window has passed; it does not prove servers are online now.",
    next: "If login or the server browser fails, check the official feed, then compare your region and error with other current reports.",
    official: "Official Steam notices"
  },
  de: {
    eyebrow: "Serverstatus auf einen Blick",
    unknown: "Der aktuelle Serverbetrieb ist nicht verifiziert",
    notice: "Die offizielle Mitteilung zu Patch 0.11 nannte eine Wartung am 14. September. Das Zeitfenster ist vorbei; daraus folgt kein aktueller Online-Status.",
    next: "Bei Login- oder Browserproblemen zuerst offizielle Meldungen prüfen, dann Region und Fehlermeldung mit aktuellen Berichten vergleichen.",
    official: "Offizielle Steam-Meldungen"
  },
  ru: {
    eyebrow: "Состояние серверов",
    unknown: "Работа серверов прямо сейчас не подтверждена",
    notice: "Официальное сообщение о Patch 0.11 указывало обслуживание 14 сентября. Оно уже завершилось, но это не подтверждает доступность серверов сейчас.",
    next: "При проблемах со входом или списком серверов проверьте официальные новости, регион и точную ошибку.",
    official: "Официальные новости Steam"
  },
  "pt-br": {
    eyebrow: "Status dos servidores",
    unknown: "A disponibilidade dos servidores agora não foi verificada",
    notice: "O aviso oficial do Patch 0.11 incluía manutenção em 14 de setembro. A janela passou, mas isso não confirma que os servidores estejam online agora.",
    next: "Se o login ou navegador de servidores falhar, confira os avisos oficiais e compare região e erro com relatos atuais.",
    official: "Avisos oficiais na Steam"
  },
  ja: {
    eyebrow: "サーバー状態の要点",
    unknown: "現在の稼働状況は確認できていません",
    notice: "公式のPatch 0.11告知には9月14日のメンテナンス予定がありました。予定時刻は過ぎていますが、現在の稼働を保証するものではありません。",
    next: "ログインやサーバー一覧に問題がある場合は、公式告知を確認し、地域とエラーを最近の報告と照合してください。",
    official: "Steam公式告知"
  },
  "zh-cn": {
    eyebrow: "服务器状态速览",
    unknown: "当前服务器在线情况尚未核实",
    notice: "官方 Patch 0.11 公告提到 9 月 14 日维护；该时间窗口已经过去，但不能据此断言现在服务器正常。",
    next: "若登录或服务器列表异常，先看官方公告，再按地区和具体报错核对近期反馈。",
    official: "Steam 官方公告"
  }
};

export function ServerStatusSignal({locale}: {locale: Locale}) {
  const text = copy[locale];
  return (
    <section aria-labelledby="server-status-signal-title" className="border-b border-[#3a423b] bg-[#182119]" data-server-status-signal="unverified">
      <div className="site-container max-w-4xl py-5 md:py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#a9c1ae]">{text.eyebrow}</p>
        <h2 id="server-status-signal-title" className="display-font mt-2 text-2xl text-white md:text-3xl">{text.unknown}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d1dcd3]">{text.notice}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d1dcd3]">{text.next}</p>
        <a className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#8fdbab] underline underline-offset-4 hover:text-white" href={CURRENT_EVENT.latestOfficialUrl} rel="noreferrer" target="_blank" title={text.official}>{text.official}</a>
      </div>
    </section>
  );
}
