import type {ReactNode} from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import type {SiteSearchEntry} from "../../src/features/search/site-search-runtime";

type Slot = {value?: unknown; dependencies?: readonly unknown[]; cleanup?: () => void};
const hooks = vi.hoisted(() => ({index: 0, slots: [] as Slot[], effects: [] as (() => void)[]}));

// Retain real JSX and call the actual component handlers; only browser/framework plumbing is replaced.
vi.mock("react", async (importOriginal) => {
  function memo(factory: () => unknown, dependencies: readonly unknown[]) {
    const index = hooks.index++;
    const previous = hooks.slots[index];
    if (!previous || dependencies.some((value, i) => !Object.is(previous.dependencies?.[i], value))) {
      hooks.slots[index] = {value: factory(), dependencies};
    }
    return hooks.slots[index].value;
  }
  return {
    ...await importOriginal<typeof import("react")>(),
    useState(initial: unknown) {
      const index = hooks.index++;
      hooks.slots[index] ??= {value: initial};
      return [hooks.slots[index].value, (next: unknown) => {
        hooks.slots[index].value = typeof next === "function" ? (next as (previous: unknown) => unknown)(hooks.slots[index].value) : next;
      }];
    },
    useRef(initial: unknown) {
      const index = hooks.index++;
      hooks.slots[index] ??= {value: {current: initial}};
      return hooks.slots[index].value;
    },
    useMemo: memo,
    useCallback: (callback: unknown, dependencies: readonly unknown[]) => memo(() => callback, dependencies),
    useEffect(effect: () => (() => void) | void, dependencies: readonly unknown[]) {
      const index = hooks.index++;
      const previous = hooks.slots[index];
      if (!previous || dependencies.some((value, i) => !Object.is(previous.dependencies?.[i], value))) {
        hooks.effects.push(() => {
          previous?.cleanup?.();
          hooks.slots[index] = {dependencies, cleanup: effect() || undefined};
        });
      }
    },
  };
});
vi.mock("react-dom", () => ({createPortal: (children: ReactNode) => children}));
vi.mock("next-intl", () => ({useLocale: () => "en", useTranslations: () => (key: string) => key}));
vi.mock("@/i18n/navigation", () => ({useRouter: () => ({push() {}})}));

type Element = {type: unknown; props: Record<string, unknown> & {children?: ReactNode}};
function elements(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object" || !("props" in node)) return [];
  const element = node as Element;
  return [element, ...elements(element.props.children)];
}

type PendingRequest = {url: string; signal: AbortSignal; complete: (entries: SiteSearchEntry[]) => void; fail: () => void};
let requests: PendingRequest[];
let listeners: Map<string, Set<(event: {key: string}) => void>>;
let gtag: ReturnType<typeof vi.fn>;
let component: () => ReactNode;

function render() {
  hooks.index = 0;
  const nodes = elements(component());
  hooks.effects.splice(0).forEach((effect) => effect());
  return nodes;
}
function click(node: Element) { (node.props.onClick as () => void)(); }
function open() { click(render().find((node) => node.type === "button")!); return render(); }
function typeQuery(value: string) {
  const input = render().find((node) => node.type === "input")!;
  (input.props.onChange as (event: unknown) => void)({target: {value}});
  return render();
}
function closeButton() {
  const node = render().find((entry) => entry.type === "button" && entry.props["aria-label"] === "common.closeMenu")!;
  click(node);
  return render();
}
function escape() { listeners.get("keydown")?.forEach((listener) => listener({key: "Escape"})); return render(); }
async function flushPromises() { for (let i = 0; i < 8; i++) await Promise.resolve(); }
const loading = (nodes: Element[]) => nodes.some((node) => node.props["aria-label"] === "Loading");
const entry: SiteSearchEntry = {id: "guide:havoc", type: "guide", title: "Havoc", aliases: [], summary: "Helicopter guide", taskIntent: [], category: "Guide", href: "/guides/havoc"};

beforeEach(async () => {
  vi.resetModules();
  hooks.index = 0; hooks.slots = []; hooks.effects = [];
  requests = [];
  listeners = new Map();
  gtag = vi.fn();
  vi.stubGlobal("window", {gtag});
  vi.stubGlobal("document", {
    body: {},
    addEventListener(name: string, listener: (event: {key: string}) => void) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(listener);
    },
    removeEventListener(name: string, listener: (event: {key: string}) => void) { listeners.get(name)?.delete(listener); },
  });
  vi.stubGlobal("fetch", (url: string, {signal}: {signal: AbortSignal}) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")), {once: true});
    requests.push({url, signal, complete: (entries) => resolve({ok: true, json: () => Promise.resolve(entries)}), fail: () => reject(new Error("Unavailable"))});
  }));
  const {SiteSearchDialog} = await import("../../src/components/layout/site-search-dialog");
  component = () => SiteSearchDialog({});
});
afterEach(async () => {
  hooks.slots.forEach((slot) => slot.cleanup?.());
  await flushPromises();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("search dialog request and analytics lifecycle", () => {
  it("masks typed search text and the associated result context from session replay", async () => {
    open(); requests[0].complete([entry]); await flushPromises();
    const nodes = typeQuery("Havoc");
    const dialog = nodes.find((node) => node.props.role === "dialog")!;
    expect(dialog.props["data-clarity-mask"]).toBe("true");
    const protectedNodes = elements(dialog.props.children);
    expect(protectedNodes.find((node) => node.type === "input")?.props.value).toBe("Havoc");
    expect(protectedNodes.some((node) => node.props.role === "option")).toBe(true);
  });

  it.each(["", "/wardogs"])("loads the search index through the deployment base path %s", (basePath) => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
    vi.stubEnv("GITHUB_PAGES", "true");
    open();
    expect(requests[0].url).toBe(`${basePath}/api/search-index/en`);
  });

  it.each(["header", "hero"] as const)("restores %s trigger focus without changing scroll position on Escape", async (triggerKind) => {
    const {SiteSearchDialog} = await import("../../src/components/layout/site-search-dialog");
    component = () => SiteSearchDialog({trigger: triggerKind});
    const trigger = render().find((node) => node.type === "button")!;
    expect(trigger.props.ref, "search trigger must keep a focus restoration ref").toBeDefined();
    const focus = vi.fn();
    (trigger.props.ref as {current: unknown}).current = {focus};
    open(); escape();
    expect(focus).toHaveBeenCalledExactlyOnceWith({preventScroll: true});
  });

  it("keeps keyboard focus inside the modal and result options outside the Tab sequence", async () => {
    open(); requests[0].complete([entry]); await flushPromises();
    const nodes = typeQuery("Havoc");
    const dialog = nodes.find((node) => node.props.role === "dialog")!;
    expect(dialog.props.ref, "dialog must keep its focus boundary").toBeDefined();
    const first = {focus: vi.fn()};
    const last = {focus: vi.fn()};
    (dialog.props.ref as {current: unknown}).current = {querySelectorAll: () => [first, last]};
    Object.assign(document, {activeElement: last});
    const event = {key: "Tab", shiftKey: false, preventDefault: vi.fn()};
    listeners.get("keydown")?.forEach((listener) => listener(event));
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(first.focus).toHaveBeenCalledExactlyOnceWith({preventScroll: true});
    const result = nodes.find((node) => node.type === "button" && node.props.role === "option")!;
    expect(result.props.tabIndex).toBe(-1);
    expect(nodes.find((node) => node.type === "input")?.props["aria-activedescendant"]).toBe("global-site-search-option-0");
    closeButton();
  });

  it("only changes result selection when the pointer actually moves", async () => {
    open(); requests[0].complete([entry, {...entry, id: "guide:havoc-flight", title: "Havoc flight", href: "/guides/havoc-flight"}]); await flushPromises();
    const nodes = typeQuery("Havoc");
    const options = nodes.filter((node) => node.props.role === "option");
    expect(options).toHaveLength(2);
    const move = options[1].props.onPointerMove as (event: {movementX: number; movementY: number}) => void;
    move({movementX: 0, movementY: 0});
    expect(render().find((node) => node.type === "input")?.props["aria-activedescendant"]).toBe("global-site-search-option-0");
    move({movementX: 1, movementY: 0});
    expect(render().find((node) => node.type === "input")?.props["aria-activedescendant"]).toBe("global-site-search-option-1");
    closeButton();
  });

  it("retries an unavailable index and offers a reachable Guides fallback", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "false");
    open();
    requests[0].fail();
    await flushPromises();
    const failed = render();
    const fallback = failed.find((node) => node.type === "a");
    expect(fallback?.props.href).toBe("/wardogs/en/guides/");
    const retry = failed.find((node) => node.type === "button" && node.props.children === "home.search.retry");
    expect(retry).toBeDefined();
    click(retry!); render();
    expect(requests).toHaveLength(2);
    expect(loading(render())).toBe(true);
    requests[1].complete([entry]);
    await flushPromises();
    expect(loading(render())).toBe(false);
    expect(typeQuery("Havoc").some((node) => node.props.children === "Havoc")).toBe(true);
    closeButton();
  });

  it("restores cached results into another already-mounted header search surface", async () => {
    render();
    const firstSurface = hooks.slots;
    hooks.slots = [];
    render();
    const secondSurface = hooks.slots;

    hooks.slots = firstSurface;
    open();
    requests[0].complete([entry]);
    await flushPromises();
    closeButton();

    hooks.slots = secondSurface;
    open();
    const nodes = typeQuery("Havoc");
    expect(requests).toHaveLength(1);
    expect(nodes.some((node) => node.props.children === "Havoc")).toBe(true);
    closeButton();
    expect(gtag.mock.calls).toEqual([
      ["event", "search", {result_count: 1, locale: "en", search_source: "header"}],
    ]);
  });

  it("does not let an aborted old request clear a newer request's loading state", async () => {
    open(); typeQuery("unmatched-query"); closeButton();
    expect(requests[0].signal.aborted).toBe(true);
    open();
    expect(requests).toHaveLength(2);
    expect(requests[1].signal.aborted).toBe(false);
    await flushPromises();
    expect(loading(render())).toBe(true);
    closeButton();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not report empty results when closing while the index is still loading", async () => {
    open(); typeQuery("unmatched-query");
    expect(loading(render())).toBe(true);
    closeButton();
    await flushPromises();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("records the completed result once across close, backdrop and Escape", async () => {
    open(); typeQuery("Havoc");
    requests[0].complete([entry]);
    await flushPromises();
    expect(loading(render())).toBe(false);
    closeButton();
    const nodes = open();
    const backdrop = nodes.find((node) => node.props.onMouseDown)!;
    const target = {};
    (backdrop.props.onMouseDown as (event: unknown) => void)({target, currentTarget: target});
    render(); open(); escape();
    expect(gtag.mock.calls).toEqual([
      ["event", "search", {result_count: 1, locale: "en", search_source: "header"}],
    ]);
  });

  it("records a completed empty query once and excludes sensitive queries on close", async () => {
    open();
    requests[0].complete([entry]);
    await flushPromises();
    typeQuery("unmatched-query"); closeButton(); open(); escape();
    open(); typeQuery("user@example.com"); closeButton();
    expect(gtag.mock.calls).toEqual([
      ["event", "search", {result_count: 0, locale: "en", search_source: "header"}],
      ["event", "site_search_no_results", {result_count: 0, locale: "en", search_source: "header"}],
    ]);
  });
});
