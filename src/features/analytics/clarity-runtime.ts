import {
  canStartClarity, clarityNeedsDocumentBoundary, CLARITY_CONSENT_KEY, CLARITY_SCRIPT_ID,
  CLARITY_SCRIPT_SRC, makeClarityPreference, parseClarityPreference, readClarityPreference, writeClarityPreference,
  type ClarityChoice, type ClarityPreference
} from "./clarity-consent";

type ClarityCommand = ((...args: unknown[]) => void) & {q?: unknown[][]};
type ClarityWindow = Window & {clarity?: ClarityCommand};
export type ClarityController = {
  getChoice: () => ClarityChoice | null;
  subscribe: (callback: () => void) => () => void;
  choose: (choice: ClarityChoice) => void;
};
const controllers = new WeakMap<Window, ClarityController>();
const DENIAL_STATE_KEY = "wardogsClarityDenied";

function storage(view: Window, kind: "localStorage" | "sessionStorage") {
  try { return view[kind]; } catch { return null; }
}

/** This controller belongs to the document, not to a route or React mount. */
export function getClarityController(view: Window): ClarityController {
  const prior = controllers.get(view);
  if (prior) return prior;
  const target = view as ClarityWindow;
  const document = view.document;
  const stores = [storage(view, "localStorage"), storage(view, "sessionStorage")];
  const listeners = new Set<() => void>();
  const entryDenial = parseClarityPreference(view.history.state?.[DENIAL_STATE_KEY] ?? null);
  let preference: ClarityPreference | null = entryDenial?.choice === "denied" ? entryDenial : readClarityPreference(stores);
  // Never start midway through a document whose original URL/referrer was private.
  const safeDocument = canStartClarity({href: view.location.href, referrer: document.referrer, choice: "allowed"});
  let requested = Boolean(document.getElementById(CLARITY_SCRIPT_ID));
  let ending = false;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;

  const signalDenied = () => {
    if (!requested) return;
    // consentv2 controls cookie consent; stop actually stops recorder modules.
    // A reload removes vendor listeners even if the async loader is still pending.
    try { target.clarity?.("consentv2", {analytics_Storage: "denied", ad_Storage: "denied"}); } catch { /* The full document boundary still stops an unavailable vendor. */ }
    try { target.clarity?.("stop"); } catch { /* The full document boundary still stops an unavailable vendor. */ }
  };
  const finishDocument = (url = view.location.href, replace = true) => {
    if (ending) return;
    ending = true;
    signalDenied();
    view.location[replace ? "replace" : "assign"](url);
  };
  const notify = () => { for (const listener of listeners) listener(); };
  const checkExpiry = () => {
    if (preference && preference.expiresAt <= Date.now()) {
      preference = null;
      notify();
      if (requested) finishDocument();
    }
  };
  const scheduleExpiry = () => {
    clearTimeout(expiryTimer);
    if (preference) {
      // Browser timer delays are signed 32-bit; renew the timer for long choices.
      expiryTimer = setTimeout(() => { checkExpiry(); scheduleExpiry(); }, Math.min(2_147_000_000, Math.max(1, preference.expiresAt - Date.now())));
    }
  };
  const installBoundary = () => {
    const needsBoundary = (url: string | URL | null | undefined) => clarityNeedsDocumentBoundary(view.location.href, url, (id) => Boolean(document.getElementById(id)));
    for (const method of ["pushState", "replaceState"] as const) {
      const original = view.history[method];
      view.history[method] = function (data, unused, url) {
        if (needsBoundary(url)) {
          finishDocument(new URL(String(url), view.location.href).href, method === "replaceState");
          return;
        }
        original.call(this, data, unused, url);
      };
    }
    view.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      if (!needsBoundary(anchor.href)) return;
      event.preventDefault();
      // Keep bubbling: GA's delegated navigation/tool events must still fire.
      finishDocument(anchor.href, false);
    }, true);
    for (const eventName of ["popstate", "hashchange"] as const) {
      view.addEventListener(eventName, (event) => {
        if (needsBoundary(view.location.href)) {
          event.stopImmediatePropagation();
          finishDocument();
        }
      }, true);
    }
  };
  const start = () => {
    checkExpiry();
    if (requested || ending || !safeDocument || !canStartClarity({href: view.location.href, referrer: document.referrer, choice: preference?.choice ?? null})) return;
    const clarity: ClarityCommand = target.clarity ?? Object.assign((...args: unknown[]) => { (clarity.q ??= []).push(args); }, {q: [] as unknown[][]});
    target.clarity = clarity;
    // The queue exists before the first vendor request; no Microsoft ad consent.
    clarity("consentv2", {analytics_Storage: "granted", ad_Storage: "denied"});
    installBoundary();
    const script = document.createElement("script");
    script.id = CLARITY_SCRIPT_ID;
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = CLARITY_SCRIPT_SRC;
    requested = true;
    document.head.appendChild(script);
  };

  const controller: ClarityController = {
    getChoice: () => preference?.choice ?? null,
    subscribe: (callback) => { listeners.add(callback); return () => listeners.delete(callback); },
    choose: (choice) => {
      preference = makeClarityPreference(choice);
      const persisted = writeClarityPreference(stores, preference);
      let safeReload = persisted;
      // Browser history survives reloading this entry without changing its URL.
      // It also prevents a temporarily unwritable store's old Allow resurrecting.
      try {
        const state = {...view.history.state};
        if ((choice === "denied" && !persisted) || state[DENIAL_STATE_KEY]) {
          if (choice === "denied" && !persisted) state[DENIAL_STATE_KEY] = JSON.stringify(preference);
          else delete state[DENIAL_STATE_KEY];
          view.history.replaceState(state, "");
          safeReload ||= choice === "denied" && view.history.state?.[DENIAL_STATE_KEY] === JSON.stringify(preference);
        }
      } catch { /* Retain the in-memory choice if even history state is unavailable. */ }
      scheduleExpiry();
      notify();
      if (choice === "denied" && requested) {
        if (safeReload) finishDocument();
        else { ending = true; signalDenied(); }
      }
      else start();
    }
  };
  controllers.set(view, controller);
  view.addEventListener("storage", (event) => {
    if (event.key !== CLARITY_CONSENT_KEY && event.key !== null) return;
    // A removal or invalid value revokes; stale session storage must not restore it.
    preference = event.newValue ? readClarityPreference([{getItem: () => event.newValue, setItem: () => {}}]) : null;
    if (preference) writeClarityPreference([stores[1]], preference);
    else { try { stores[1]?.removeItem(CLARITY_CONSENT_KEY); } catch {} }
    notify();
    scheduleExpiry();
    if (requested && preference?.choice !== "allowed") finishDocument();
    else start();
  });
  view.addEventListener("pageshow", (event) => {
    if (event.persisted && requested) { ending = false; finishDocument(); }
    else checkExpiry();
  });
  document.addEventListener("visibilitychange", checkExpiry);
  scheduleExpiry();
  start();
  return controller;
}
