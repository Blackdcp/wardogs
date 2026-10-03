import {ADSTERRA_ENABLED, ADSTERRA_LEADERBOARD_ENABLED} from "./ad-policy";
import {ANALYTICS_EVENTS, isProductionHostname, trackAnalyticsEvent} from "@/lib/analytics-events";

export type AdsterraBannerUnit = {
  height: number;
  key: string;
  src: string;
  width: number;
};

function bannerUnit(key: string, width: number, height: number): AdsterraBannerUnit {
  return {height, key, src: `https://arkgleamfox.com/${key}/invoke.js`, width};
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

export type AdStatus = "script_loaded" | "script_error" | "slot_visible" | "creative_present" | "creative_visible";

// These are DOM observations, not vendor impressions. Cross-origin iframe
// contents, ad validity, dwell time and billable impressions cannot be verified.
export function observeAdSlot(container: HTMLElement, placement: string, format: "display" | "native") {
  let active = true;
  const reported = new Set<AdStatus>();
  const candidates = new Set<Element>();
  const present = new Set<Element>();
  const report = (status: AdStatus) => {
    if (!active || reported.has(status)) return;
    reported.add(status);
    trackAnalyticsEvent(ANALYTICS_EVENTS.adStatus, {placement, format, status});
  };
  const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
    if (!active) return;
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio <= 0) continue;
      if (entry.target === container) report("slot_visible");
      else if (present.has(entry.target)) report("creative_visible");
    }
  });
  intersection?.observe(container);
  const inspect = () => {
    if (!active) return;
    const current = new Set(container.querySelectorAll("iframe[src], img[src], video[src]"));
    for (const candidate of candidates) {
      if (current.has(candidate)) continue;
      candidate.removeEventListener("load", inspect);
      intersection?.unobserve(candidate);
      candidates.delete(candidate);
      present.delete(candidate);
    }
    for (const candidate of current) {
      if (!candidates.has(candidate)) {
        candidates.add(candidate);
        candidate.addEventListener("load", inspect);
      }
      const src = candidate.getAttribute("src")?.trim();
      const bounds = candidate.getBoundingClientRect();
      // Empty frames and tracking pixels are not evidence of an ad creative.
      const available = src && !src.startsWith("about:blank") && bounds.width > 1 && bounds.height > 1
        && (candidate.tagName !== "IMG" || ((candidate as HTMLImageElement).complete && (candidate as HTMLImageElement).naturalWidth > 0))
        && (candidate.tagName !== "VIDEO" || (candidate as HTMLVideoElement).readyState >= 2);
      if (!available) {
        if (present.delete(candidate)) intersection?.unobserve(candidate);
        continue;
      }
      if (present.has(candidate)) continue;
      present.add(candidate);
      report("creative_present");
      intersection?.observe(candidate);
    }
  };
  const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(inspect);
  mutations?.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ["src", "class", "style", "hidden"]});
  inspect();
  return {
    report,
    cleanup: () => {
      active = false;
      intersection?.disconnect();
      mutations?.disconnect();
      for (const candidate of candidates) candidate.removeEventListener("load", inspect);
      candidates.clear();
      present.clear();
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
      container.innerHTML = "";
      view.atOptions = buildAdsterraBannerOptions(unit);
      script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = unit.src;
      const finish = (status: "script_loaded" | "script_error") => {
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
      container.appendChild(script);
    }
  };
  loadQueue.pending.push(job);
  pump();
  return () => {
    job.canceled = true;
    script?.remove();
    container.innerHTML = "";
    // Removing an in-flight script does not guarantee that it cannot execute.
    // Keep its config lease until load/error; never replace it on a timeout.
  };
}
