// Fetch before a reader reaches the slot, without letting deep-page inventory
// occupy the display loader's global configuration lease on initial navigation.
export const AD_LOAD_AHEAD_PX = 600;
export const AD_LOADER_DIAGNOSTIC_MS = 15_000;

export function whenAdNearViewport(container: HTMLElement, start: () => (() => void)) {
  const document = container.ownerDocument;
  const view = document.defaultView;
  let active = true;
  let started = false;
  let near = false;
  let stopLoad: (() => void) | undefined;
  let observer: IntersectionObserver | null = null;
  const begin = () => {
    if (!active || started || !near || document.hidden) return;
    started = true;
    observer?.disconnect();
    document.removeEventListener("visibilitychange", visible);
    stopLoad = start();
  };
  const visible = () => begin();
  if (typeof IntersectionObserver === "undefined") {
    // Browser support must not become a monetization gate.
    near = true;
  } else {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) near = entry.isIntersecting;
      }
      begin();
    }, {rootMargin: `${AD_LOAD_AHEAD_PX}px 0px`, threshold: 0});
    observer.observe(container);
    const bounds = container.getBoundingClientRect();
    near = bounds.width > 0 && bounds.height > 0
      && bounds.bottom >= -AD_LOAD_AHEAD_PX
      && bounds.top <= (view?.innerHeight ?? 0) + AD_LOAD_AHEAD_PX;
  }
  document.addEventListener("visibilitychange", visible);
  begin();
  return () => {
    active = false;
    observer?.disconnect();
    document.removeEventListener("visibilitychange", visible);
    stopLoad?.();
  };
}

// A slow response or occupied global lease is a diagnostic, never proof of an
// error. Background-tab time is excluded and callers decide what a deadline means.
export function afterForegroundTime(document: Document, milliseconds: number, callback: () => void) {
  let active = true;
  let remaining = milliseconds;
  let startedAt: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const pause = () => {
    if (timer !== null) clearTimeout(timer);
    if (startedAt !== null) remaining = Math.max(0, remaining - (Date.now() - startedAt));
    timer = null;
    startedAt = null;
  };
  const stop = () => {
    active = false;
    pause();
    document.removeEventListener("visibilitychange", update);
  };
  const update = () => {
    if (!active || document.hidden) {pause(); return;}
    if (timer !== null) return;
    startedAt = Date.now();
    timer = setTimeout(() => {
      stop();
      callback();
    }, remaining);
  };
  document.addEventListener("visibilitychange", update);
  update();
  return stop;
}
