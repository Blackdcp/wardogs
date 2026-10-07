import {ADSTERRA_ENABLED, ADSTERRA_LEADERBOARD_ENABLED} from "./ad-policy";
import {ANALYTICS_EVENTS, isProductionHostname, normalizeAnalyticsPathname, trackAnalyticsEvent} from "@/lib/analytics-events";
import {AD_LOADER_DIAGNOSTIC_MS, afterForegroundTime} from "./ad-loading";

export type AdsterraBannerUnit = {
  height: number;
  key: string;
  src: string;
  width: number;
};

function bannerUnit(key: string, width: number, height: number): AdsterraBannerUnit {
  return {height, key, src: `https://bauval.org/22/${key}`, width};
}

export const ADSTERRA_BANNER_UNITS = {
  horizontal468: bannerUnit("c6d1a3e01dc90e01385598a3c84dcaea", 468, 60),
  rectangle300: bannerUnit("3342dc928824e6ed5c01555e7f9e9e0f", 300, 250),
  rail300: bannerUnit("f6fc5667adc4cb97634312e962c199c5", 160, 300),
  rail600: bannerUnit("b2a91c3759bccd2386763c1c71b7d7ad", 160, 600),
  mobile320: bannerUnit("174695845dde18793bf09d3361f8af30", 320, 50),
  leaderboard728: bannerUnit("035c3a3eb2cdc2bcb65b641e981d4874", 728, 90)
} as const;

const approvedKeys = new Set<string>([
  ADSTERRA_BANNER_UNITS.horizontal468.key,
  ADSTERRA_BANNER_UNITS.rectangle300.key,
  ADSTERRA_BANNER_UNITS.rail300.key,
  ADSTERRA_BANNER_UNITS.rail600.key,
  ADSTERRA_BANNER_UNITS.mobile320.key,
  ADSTERRA_BANNER_UNITS.leaderboard728.key
]);

export function getApprovedAdsterraBanner(key: string) {
  return approvedKeys.has(key) ? Object.values(ADSTERRA_BANNER_UNITS).find((unit) => unit.key === key) : undefined;
}

export function buildAdsterraBannerOptions(unit: AdsterraBannerUnit) {
  return {
    key: unit.key,
    format: "iframe",
    height: unit.height,
    width: unit.width,
    params: {}
  };
}

export function buildAdsterraBannerConfigCode(unit: AdsterraBannerUnit): string {
  return `atOptions = ${JSON.stringify(buildAdsterraBannerOptions(unit))};`;
}

export function selectAdsterraDisplayUnit(placement: "horizontal" | "rectangle", contentWidth: number): AdsterraBannerUnit | null {
  if (!ADSTERRA_ENABLED || !Number.isFinite(contentWidth)) return null;
  if (placement === "rectangle") return contentWidth >= 300 ? ADSTERRA_BANNER_UNITS.rectangle300 : null;
  if (contentWidth >= 728 && ADSTERRA_LEADERBOARD_ENABLED) return ADSTERRA_BANNER_UNITS.leaderboard728;
  return contentWidth >= 468 ? ADSTERRA_BANNER_UNITS.horizontal468 : null;
}

export function observeAdContainerWidth(container: HTMLElement, update: (width: number) => void) {
  let active = true;
  const view = container.ownerDocument.defaultView;
  const measure = () => {
    if (!active) return;
    const style = view?.getComputedStyle(container);
    update(Math.max(0, container.clientWidth - (parseFloat(style?.paddingLeft ?? "0") || 0) - (parseFloat(style?.paddingRight ?? "0") || 0)));
  };
  measure();
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
    if (!active) return;
    const entry = entries.find((item) => item.target === container);
    if (entry) update(Math.max(0, entry.contentRect.width));
  });
  observer?.observe(container);
  if (!observer) view?.addEventListener("resize", measure);
  return () => {
    active = false;
    observer?.disconnect();
    if (!observer) view?.removeEventListener("resize", measure);
  };
}

export type AdStatus = "script_loaded" | "script_error" | "slot_visible" | "creative_present" | "creative_visible" | "request_started" | "creative_missing" | "creative_viewable" | "queued" | "loader_wait" | "loader_stalled";

export type AdSlotMetadata = {
  ad_unit?: string;
  page_path?: string;
  page_type?: string;
  config_version?: string;
  section?: string;
};

// These are DOM observations, not vendor impressions. Cross-origin contents,
// vendor fill, ad validity and billable impressions cannot be verified.
// creative_missing means no qualifying DOM after 15 foreground seconds;
// creative_viewable means >=50% intersection for one continuous foreground second.
export function observeAdSlot(container: HTMLElement, placement: string, format: "display" | "native", metadata: AdSlotMetadata = {}, onStatus?: (status: AdStatus, evidence: {creativePresent: boolean}) => void) {
  let active = true;
  const document = container.ownerDocument;
  const attribution: Record<string, string> = {};
  for (const key of ["ad_unit", "page_type", "config_version", "section"] as const) {
    const value = metadata[key];
    if (value && /^[a-zA-Z0-9_.:-]+$/.test(value)) attribution[key] = value.slice(0, 64);
  }
  if (metadata.page_path) attribution.page_path = normalizeAnalyticsPathname(metadata.page_path, process.env.NEXT_PUBLIC_BASE_PATH);
  const reported = new Set<AdStatus>();
  const candidates = new Set<Element>();
  const sources = new Map<Element, string>();
  const present = new Set<Element>();
  const ratios = new Map<Element, number>();
  const viewTimers = new Map<Element, ReturnType<typeof setTimeout>>();
  let missingTimer: ReturnType<typeof setTimeout> | null = null;
  let missingStartedAt: number | null = null;
  let missingRemaining = 15_000;
  const pauseMissing = () => {
    if (missingTimer !== null) clearTimeout(missingTimer);
    if (missingStartedAt !== null) missingRemaining = Math.max(0, missingRemaining - (Date.now() - missingStartedAt));
    missingTimer = null;
    missingStartedAt = null;
  };
  const report = (status: AdStatus) => {
    if (!active || reported.has(status)) return;
    reported.add(status);
    container.dataset.adStatus = status;
    if (status === "script_loaded") updateMissing();
    if (status === "creative_present" || status === "script_error") pauseMissing();
    onStatus?.(status, {creativePresent: present.size > 0});
    const locale = document.documentElement?.lang;
    try {
      trackAnalyticsEvent(ANALYTICS_EVENTS.adStatus, {placement, format, status, ...attribution, ...(locale ? {locale} : {})});
    } catch {
      // Analytics is best effort and must not interrupt loader/observer work.
    }
  };
  function updateMissing() {
    if (!active || document.hidden || !reported.has("script_loaded") || reported.has("creative_present") || reported.has("creative_missing") || reported.has("script_error")) {
      pauseMissing();
      return;
    }
    if (missingTimer !== null) return;
    missingStartedAt = Date.now();
    missingTimer = setTimeout(() => {
      pauseMissing();
      inspect();
      if (active && !document.hidden && !reported.has("creative_present")) report("creative_missing");
    }, missingRemaining);
  }
  const stopViewTimer = (candidate: Element) => {
    const timer = viewTimers.get(candidate);
    if (timer !== undefined) clearTimeout(timer);
    viewTimers.delete(candidate);
  };
  const updateVisibility = (candidate: Element) => {
    const ratio = ratios.get(candidate) ?? 0;
    if (!active || document.hidden || ratio <= 0) {
      stopViewTimer(candidate);
      return;
    }
    if (candidate === container) {
      report("slot_visible");
      return;
    }
    if (!present.has(candidate)) return;
    report("creative_visible");
    if (ratio < 0.5 || reported.has("creative_viewable")) {
      stopViewTimer(candidate);
      return;
    }
    if (viewTimers.has(candidate)) return;
    viewTimers.set(candidate, setTimeout(() => {
      viewTimers.delete(candidate);
      // Recheck dimensions/removal at the boundary before making a dwell claim.
      inspect();
      if (active && !document.hidden && present.has(candidate) && (ratios.get(candidate) ?? 0) >= 0.5) {
        report("creative_viewable");
        for (const observed of viewTimers.keys()) stopViewTimer(observed);
      }
    }, 1_000));
  };
  const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
    if (!active) return;
    for (const entry of entries) {
      ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      updateVisibility(entry.target);
    }
  }, {threshold: [0, 0.5]});
  intersection?.observe(container);
  const inspect = () => {
    if (!active) return;
    const current = new Set(container.querySelectorAll("iframe[src], img[src], video[src]"));
    for (const candidate of candidates) {
      if (current.has(candidate)) continue;
      candidate.removeEventListener("load", inspect);
      intersection?.unobserve(candidate);
      resize?.unobserve(candidate);
      stopViewTimer(candidate);
      ratios.delete(candidate);
      candidates.delete(candidate);
      sources.delete(candidate);
      present.delete(candidate);
    }
    for (const candidate of current) {
      if (!candidates.has(candidate)) {
        candidates.add(candidate);
        candidate.addEventListener("load", inspect);
        // Watch candidates before they qualify: asynchronous sizing need not
        // mutate their attributes or fire another load event.
        resize?.observe(candidate);
      }
      const src = candidate.getAttribute("src")?.trim() ?? "";
      if (sources.has(candidate) && sources.get(candidate) !== src) {
        // A reused DOM node may now contain a different creative. Require a new
        // intersection sample and a full dwell interval for the new source.
        present.delete(candidate);
        intersection?.unobserve(candidate);
        ratios.delete(candidate);
        stopViewTimer(candidate);
      }
      sources.set(candidate, src);
      const bounds = candidate.getBoundingClientRect();
      // Empty frames and tracking pixels are not evidence of an ad creative.
      const available = src && !src.startsWith("about:blank") && bounds.width > 1 && bounds.height > 1
        && (candidate.tagName !== "IMG" || ((candidate as HTMLImageElement).complete && (candidate as HTMLImageElement).naturalWidth > 0))
        && (candidate.tagName !== "VIDEO" || (candidate as HTMLVideoElement).readyState >= 2);
      if (!available) {
        if (present.delete(candidate)) {
          intersection?.unobserve(candidate);
          ratios.delete(candidate);
          stopViewTimer(candidate);
        }
        continue;
      }
      if (present.has(candidate)) continue;
      present.add(candidate);
      report("creative_present");
      intersection?.observe(candidate);
    }
  };
  const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(inspect);
  const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(inspect);
  mutations?.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ["src", "class", "style", "hidden"]});
  resize?.observe(container);
  if (!resize) document.defaultView?.addEventListener("resize", inspect);
  const visibilityChanged = () => {
    updateMissing();
    inspect();
    for (const candidate of ratios.keys()) updateVisibility(candidate);
  };
  document.addEventListener("visibilitychange", visibilityChanged);
  inspect();
  return {
    report,
    cleanup: () => {
      active = false;
      pauseMissing();
      for (const candidate of viewTimers.keys()) stopViewTimer(candidate);
      intersection?.disconnect();
      mutations?.disconnect();
      resize?.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
      if (!resize) document.defaultView?.removeEventListener("resize", inspect);
      for (const candidate of candidates) candidate.removeEventListener("load", inspect);
      candidates.clear();
      sources.clear();
      present.clear();
      ratios.clear();
    }
  };
}

type BannerLoadJob = {canceled: boolean; start: () => void};
type BannerLoadQueue = {active: BannerLoadJob | null; pending: BannerLoadJob[]};
const bannerQueues = new WeakMap<Document, BannerLoadQueue>();

// Serialize only the initial invoke script execution and its global atOptions.
// A loader that reads the global later still requires vendor-side verification.
export function mountAdsterraBanner(container: HTMLElement, unit: AdsterraBannerUnit, onStatus?: (status: AdStatus) => void) {
  const document = container.ownerDocument;
  const view = document.defaultView as (Window & {atOptions?: ReturnType<typeof buildAdsterraBannerOptions>}) | null;
  if (!ADSTERRA_ENABLED || !view || !isProductionHostname(view.location.hostname)) return () => {};
  let queue = bannerQueues.get(document);
  if (!queue) {
    queue = {active: null, pending: []};
    bannerQueues.set(document, queue);
  }
  const loadQueue = queue;
  let script: HTMLScriptElement | null = null;
  let stopDiagnostic: (() => void) | undefined;
  const pump = () => {
    if (loadQueue.active) return;
    let next: BannerLoadJob | undefined;
    while ((next = loadQueue.pending.shift())) {
      if (next.canceled) continue;
      loadQueue.active = next;
      next.start();
      return;
    }
  };
  const job: BannerLoadJob = {
    canceled: false,
    start: () => {
      stopDiagnostic?.();
      container.innerHTML = "";
      view.atOptions = buildAdsterraBannerOptions(unit);
      script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = unit.src;
      const finish = (status: "script_loaded" | "script_error") => {
        stopDiagnostic?.();
        script?.removeEventListener("load", loaded);
        script?.removeEventListener("error", failed);
        if (!job.canceled) onStatus?.(status);
        loadQueue.active = null;
        pump();
      };
      const loaded = () => finish("script_loaded");
      const failed = () => finish("script_error");
      script.addEventListener("load", loaded);
      script.addEventListener("error", failed);
      onStatus?.("request_started");
      stopDiagnostic = afterForegroundTime(document, AD_LOADER_DIAGNOSTIC_MS, () => {
        if (!job.canceled) onStatus?.("loader_stalled");
      });
      container.appendChild(script);
    }
  };
  if (loadQueue.active) {
    onStatus?.("queued");
    stopDiagnostic = afterForegroundTime(document, AD_LOADER_DIAGNOSTIC_MS, () => {
      if (!job.canceled) onStatus?.("loader_wait");
    });
  }
  loadQueue.pending.push(job);
  pump();
  return () => {
    job.canceled = true;
    stopDiagnostic?.();
    script?.remove();
    container.innerHTML = "";
    // Removing an in-flight script does not guarantee that it cannot execute.
    // Keep its config lease until load/error; never replace it on a timeout.
  };
}
