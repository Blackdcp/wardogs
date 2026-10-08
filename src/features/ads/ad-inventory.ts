import type {AdStatus} from "./adsterra-banner";

type Zone = {requested: boolean; occupied: boolean; waiting: Set<() => void>};
type Page = {path: string; zones: Map<string, Zone>};
const pages = new WeakMap<Document, Page>();

/** Resize is not a new page view; returning via client navigation is. */
export function visitAdPage(document: Document, path: string): void {
  if (pages.get(document)?.path !== path) pages.set(document, {path, zones: new Map()});
}

/** One actual loader request per zone and page visit, including breakpoint changes.
 * A job canceled while still queued may be claimed by the replacement placement.
 * Started jobs are never refreshed or retried just because their shell unmounted.
 */
export function mountUniqueBanner(document: Document, path: string, key: string,
  mount: (report: (status: AdStatus) => void) => () => void,
  suppress: (hidden: boolean) => void
): () => void {
  visitAdPage(document, path);
  const zones = pages.get(document)!.zones;
  let zone = zones.get(key);
  if (!zone) { zone = {requested: false, occupied: false, waiting: new Set()}; zones.set(key, zone); }
  const state = zone;
  let active = true;
  let owns = false;
  let cleanup: (() => void) | undefined;
  const attempt = () => {
    if (!active) return;
    if (state.requested) { suppress(true); return; }
    if (state.occupied) { suppress(true); state.waiting.add(attempt); return; }
    state.waiting.delete(attempt);
    state.occupied = true;
    owns = true;
    suppress(false);
    cleanup = mount((status) => {
      if (status === "request_started") {
        state.requested = true;
        for (const waiting of state.waiting) waiting();
        state.waiting.clear();
      }
    });
  };
  attempt();
  return () => {
    active = false;
    state.waiting.delete(attempt);
    if (!owns) return;
    cleanup?.();
    state.occupied = false;
    for (const waiting of [...state.waiting]) waiting();
  };
}
