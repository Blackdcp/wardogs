import type {ReactNode} from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraDisplayBanner} from "../../src/components/ads/adsterra-display-banner";
import type {AdStatus} from "../../src/features/ads/adsterra-banner";

// Exercise the real component effects and inventory lease across pathname
// changes. Network/DOM boundaries are doubled; no advertiser is requested.
const state = vi.hoisted(() => ({
  index: 0,
  slots: [] as {value?: unknown; dependencies?: readonly unknown[]; cleanup?: () => void}[],
  effects: [] as (() => void)[],
  pathname: "/en/guides",
  loads: [] as {report: (status: AdStatus) => void; removed: boolean}[],
  events: [] as {path: string; status: AdStatus}[],
}));
vi.mock("next/navigation", () => ({usePathname: () => state.pathname}));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useState(initial: unknown) {
    const index = state.index++;
    state.slots[index] ??= {value: initial};
    return [state.slots[index].value, (next: unknown) => {
      state.slots[index].value = typeof next === "function" ? next(state.slots[index].value) : next;
    }];
  },
  useRef(initial: unknown) {
    const index = state.index++;
    state.slots[index] ??= {value: {current: initial}};
    return state.slots[index].value;
  },
  useEffect(effect: () => (() => void) | void, dependencies: readonly unknown[]) {
    const index = state.index++;
    const previous = state.slots[index];
    if (!previous || dependencies.some((value, i) => !Object.is(previous.dependencies?.[i], value))) {
      state.effects.push(() => {
        previous?.cleanup?.();
        state.slots[index] = {dependencies, cleanup: effect() || undefined};
      });
    }
  },
}));
vi.mock("@/features/ads/ad-loading", () => ({whenAdNearViewport: (_container: unknown, start: () => () => void) => start()}));
vi.mock("@/features/ads/adsterra-native", async (original) => ({
  ...await original<typeof import("../../src/features/ads/adsterra-native")>(),
  mountAdsterraNative: (_container: unknown, report: (status: AdStatus) => void) => mount(report),
}));
vi.mock("@/features/ads/adsterra-banner", async (original) => ({
  ...await original<typeof import("../../src/features/ads/adsterra-banner")>(),
  mountAdsterraBanner: (_container: unknown, _unit: unknown, report: (status: AdStatus) => void) => mount(report),
  observeAdSlot: (_container: unknown, _placement: unknown, _format: unknown, metadata: {page_path: string}, callback: (status: AdStatus, evidence: {creativePresent: boolean}) => void) => ({
    report: (status: AdStatus) => {
      state.events.push({path: metadata.page_path, status});
      callback(status, {creativePresent: status === "creative_present"});
    },
    cleanup: () => {},
  }),
}));

function mount(report: (status: AdStatus) => void) {
  const load = {report, removed: false};
  state.loads.push(load);
  report("request_started");
  return () => {load.removed = true;};
}
type Node = {type: unknown; props: Record<string, unknown> & {children?: ReactNode}};
function nodes(node: unknown): Node[] {
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (!node || typeof node !== "object" || !("props" in node)) return [];
  const element = node as Node;
  return [element, ...nodes(element.props.children)];
}
function render(component: () => ReactNode) {
  state.index = 0;
  const tree = nodes(component());
  for (const node of tree) {
    const ref = node.props.ref as {current: unknown} | undefined;
    if (ref && !ref.current) ref.current = {ownerDocument: document, parentNode: {}};
  }
  state.effects.splice(0).forEach((effect) => effect());
}
function componentFor(format: "native" | "rectangle") {
  if (format === "native") return () => AdsterraNativeBanner({label: "Advertisement"});
  // Invoke the actual non-exported BannerSlot selected by the rectangle wrapper,
  // with its real unit, after the width boundary has enabled it.
  const wrapper = AdsterraDisplayBanner({placement: "rectangle"}) as unknown as Node;
  const slot = wrapper.props.children as unknown as Node;
  state.index = 0; state.slots = []; state.effects = [];
  return () => (slot.type as (props: Record<string, unknown>) => ReactNode)({...slot.props, loadEnabled: true});
}
beforeEach(() => {
  state.index = 0; state.slots = []; state.effects = []; state.loads = []; state.events = []; state.pathname = "/en/guides";
  vi.stubGlobal("window", {location: {hostname: "www.wardogswiki.com"}});
  vi.stubGlobal("document", {});
});
afterEach(() => {
  state.slots.forEach((slot) => slot.cleanup?.());
  vi.unstubAllGlobals();
});

describe.each(["native", "rectangle"] as const)("%s confirmed loader failure recovery", (format) => {
  it("cleans the failed loader and permits one attempt on a new pathname, never on time or rerender alone", () => {
    const component = componentFor(format);
    render(component);
    expect(state.loads).toHaveLength(1);
    state.loads[0].report("script_error");
    render(component); render(component);
    expect(state.loads).toHaveLength(1);
    state.pathname = "/en/items";
    render(component); render(component);
    expect(state.loads).toHaveLength(2);
    expect(state.loads[0].removed).toBe(true);
    expect(state.events.filter((event) => event.path === "/en/items").map((event) => event.status)).toEqual(["request_started"]);
    state.loads[1].report("script_error");
    render(component); render(component);
    expect(state.loads).toHaveLength(2);
    state.pathname = "/en/tools/map";
    render(component); render(component);
    expect(state.loads).toHaveLength(3);
    expect(state.loads[1].removed).toBe(true);
    state.loads[2].report("script_loaded");
    state.loads[2].report("creative_present");
    state.pathname = "/en/guides";
    render(component); render(component);
    expect(state.loads).toHaveLength(3);
    expect(state.loads[2].removed).toBe(false);
  });

  it.each(["script_loaded", "creative_missing", "loader_stalled", "request_started"] as const)("does not refresh %s on navigation", (status) => {
    const component = componentFor(format);
    render(component);
    if (status === "creative_missing") state.loads[0].report("script_loaded");
    state.loads[0].report(status);
    state.pathname = "/en/items";
    render(component); render(component);
    expect(state.loads).toHaveLength(1);
    expect(state.loads[0].removed).toBe(false);
  });
});
