import type {ReactNode} from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {ArtilleryCalculator} from "../../src/components/artillery/artillery-calculator";
import {SystemChecker} from "../../src/components/tools/system-checker";
import {ToolShareNotice} from "../../src/components/tools/tool-share-notice";
import {getToolCopy} from "../../src/features/tools/tool-copy";
import {decodeSystemCheckState, encodeSystemCheckState} from "../../src/features/tools/share-state";

// Exercise the real component handlers without adding a DOM package or test hooks to production.
const hooks = vi.hoisted(() => ({
  index: 0,
  slots: [] as {value?: unknown; dependencies?: readonly unknown[]; cleanup?: () => void}[],
  effects: [] as (() => void)[],
  search: "",
}));

vi.mock("@/i18n/navigation", () => ({Link: "a"}));
vi.mock("next/image", () => ({default: "img"}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useState(initial: unknown) {
    const index = hooks.index++;
    hooks.slots[index] ??= {value: typeof initial === "function" ? (initial as () => unknown)() : initial};
    return [hooks.slots[index].value, (next: unknown) => {
      hooks.slots[index].value = typeof next === "function" ? (next as (previous: unknown) => unknown)(hooks.slots[index].value) : next;
    }];
  },
  useRef(initial: unknown) {
    const index = hooks.index++;
    hooks.slots[index] ??= {value: {current: initial}};
    return hooks.slots[index].value;
  },
  useCallback: (callback: unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
  useSyncExternalStore: () => hooks.search,
  useEffect(effect: () => (() => void) | void, dependencies?: readonly unknown[]) {
    const index = hooks.index++;
    const previous = hooks.slots[index];
    if (!previous || !dependencies || dependencies.some((value, i) => !Object.is(previous.dependencies?.[i], value))) {
      hooks.effects.push(() => {
        previous?.cleanup?.();
        hooks.slots[index] = {dependencies, cleanup: effect() || undefined};
      });
    }
  },
}));

type Element = {type: unknown; props: Record<string, unknown> & {children?: ReactNode}};
function elements(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object" || !("props" in node)) return [];
  const element = node as Element;
  return [element, ...elements(element.props.children)];
}
function text(node: unknown): string {
  if (Array.isArray(node)) return node.map(text).join("");
  if (typeof node === "string" || typeof node === "number") return String(node);
  return node && typeof node === "object" && "props" in node ? text((node as Element).props.children) : "";
}
function render(component: () => ReactNode) {
  hooks.index = 0;
  const nodes = elements(component());
  hooks.effects.splice(0).forEach((effect) => effect());
  return nodes;
}
function button(nodes: Element[], name: string) {
  const node = nodes.find((entry) => entry.type === "button" && text(entry) === name);
  expect(node, `button ${name}`).toBeDefined();
  return node!;
}
function click(node: Element) { (node.props.onClick as () => void)(); }
function change(node: Element, value: string) {
  (node.props.onChange as (event: unknown) => void)({target: {value, valueAsNumber: value ? Number(value) : NaN}});
}
function labeledControl(nodes: Element[], label: string) {
  const parent = nodes.find((entry) => entry.type === "label" && text(entry).startsWith(label));
  const node = elements(parent).find((entry) => entry.type === "input" || entry.type === "select");
  expect(node, `control ${label}`).toBeDefined();
  return node!;
}

let now: number;
let intervals: Map<number, () => void>;
let nextInterval: number;
let frequencies: number[];
let browser: {location: {href: string; search: string}; history: {replaceState: (...args: unknown[]) => void}; gtag: ReturnType<typeof vi.fn>};
let clipboard: ReturnType<typeof vi.fn>;

beforeEach(() => {
  hooks.index = 0;
  hooks.slots = [];
  hooks.effects = [];
  hooks.search = "";
  now = 0;
  intervals = new Map();
  nextInterval = 0;
  frequencies = [];
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("setInterval", (callback: () => void) => { intervals.set(++nextInterval, callback); return nextInterval; });
  vi.stubGlobal("clearInterval", (id: number) => intervals.delete(id));
  browser = {
    location: {href: "http://localhost/en/tools/system-check", search: ""},
    history: {replaceState: (_state, _unused, url) => { browser.location.href = String(url); hooks.search = new URL(String(url)).search; }},
    gtag: vi.fn(),
  };
  class Audio {
    currentTime = 0;
    destination = {};
    createOscillator() { return {type: "sine", frequency: {setValueAtTime: (value: number) => frequencies.push(value)}, connect() {}, start() {}, stop() {}, onended: null}; }
    createGain() { return {gain: {setValueAtTime() {}, exponentialRampToValueAtTime() {}}, connect() {}}; }
    close() { return Promise.resolve(); }
  }
  vi.stubGlobal("window", {...browser, AudioContext: Audio});
  clipboard = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", {clipboard: {writeText: clipboard}});
});
afterEach(() => {
  hooks.slots.forEach((slot) => slot.cleanup?.());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const artillery = () => ArtilleryCalculator({locale: "en"});
function direct() {
  click(button(render(artillery), "Direct Numeric"));
  return render(artillery);
}
function azimuthNumber(nodes: Element[]) { return nodes.filter((entry) => entry.type === "input" && entry.props.type === "number")[1]; }
function tick(at: number) { now = at; [...intervals.values()].forEach((callback) => callback()); }

describe("artillery input and timer regressions", () => {
  it.each([["720", "0.0°", "0 mil"], ["-10", "350.0°", "6222 mil"], ["359.999", "0.0°", "0 mil"]])("wraps typed %s into a valid bearing", (value, degrees, mils) => {
    change(azimuthNumber(direct()), value);
    const nodes = render(artillery);
    const bearing = nodes.find((entry) => entry.type === "div" && text(entry).startsWith("Azimuth (Bearing)") && text(entry).length < 100);
    expect(text(bearing)).toBe(`Azimuth (Bearing)${degrees}${mils}`);
  });

  it("names all four direct inputs through their visible labels", () => {
    const nodes = direct();
    const inputs = nodes.filter((entry) => entry.type === "input");
    expect(inputs).toHaveLength(4);
    for (const input of inputs) {
      const name = input.props["aria-label"] || (input.props["aria-labelledby"] && nodes.find((entry) => entry.props.id === input.props["aria-labelledby"])?.props.children) || nodes.find((entry) => entry.type === "label" && entry.props.htmlFor && entry.props.htmlFor === input.props.id)?.props.children;
      expect(text(name)).toMatch(/Target (Distance|Azimuth)/);
    }
  });

  it("allows keyboard placement of both map points and bounds the cursor", () => {
    let nodes = render(artillery);
    const map = () => nodes.find((entry) => entry.props.onKeyDown && entry.props.tabIndex === 0)!;
    expect(map()).toBeDefined();
    const key = (value: string) => {
      (map().props.onKeyDown as (event: unknown) => void)({key: value, preventDefault() {}});
      nodes = render(artillery);
    };
    const initialLine = nodes.find((entry) => entry.type === "line")!.props;
    key("ArrowRight"); key("Enter");
    expect(nodes.find((entry) => entry.type === "line")!.props.x2).not.toBe(initialLine.x2);
    key("ArrowLeft"); key(" ");
    expect(nodes.find((entry) => entry.type === "line")!.props.x1).not.toBe(initialLine.x1);
    for (let i = 0; i < 110; i++) key("ArrowLeft");
    key("Enter");
    expect(nodes.find((entry) => entry.type === "line")!.props.x2).toBe(1);
  });

  it("subtracts real elapsed time when the first timer callback is delayed", () => {
    click(button(direct(), "Fire Round (TOF Timer)"));
    expect(text(render(artillery))).toContain("18.8s");
    tick(5_000);
    expect(text(render(artillery))).toContain("13.8s");
  });

  it("cues a crossed final second once and stops at impact after skipped callbacks", () => {
    click(button(direct(), "Fire Round (TOF Timer)"));
    tick(16_000);
    expect(frequencies).toEqual([880, 660]);
    tick(16_100);
    expect(frequencies).toEqual([880, 660]);
    tick(18_000);
    expect(frequencies).toEqual([880, 660, 660]);
    tick(25_000);
    expect(text(render(artillery))).toContain("💥 Rounds On Target!");
    expect(frequencies).toEqual([880, 660, 660, 440]);
    expect(intervals.size).toBe(0);
  });

  it("keeps the countdown active until the exact impact deadline", () => {
    click(button(direct(), "Fire Round (TOF Timer)"));
    tick(18_780);
    const nodes = render(artillery);
    expect(nodes.some((entry) => entry.type === "button" && text(entry) === "Cancel countdown")).toBe(true);
    expect(nodes.some((entry) => entry.type === "div" && text(entry) === "0.1s")).toBe(true);
    tick(18_800);
    expect(text(render(artillery))).toContain("💥 Rounds On Target!");
  });

  it("cancels an active countdown, restarts from a new deadline and cleans up on unmount", () => {
    click(button(direct(), "Fire Round (TOF Timer)"));
    tick(5_000);
    click(button(render(artillery), "Cancel countdown"));
    expect(intervals.size).toBe(0);
    click(button(render(artillery), "Fire Round (TOF Timer)"));
    tick(10_000);
    expect(text(render(artillery))).toContain("13.8s");
    hooks.slots.forEach((slot) => { slot.cleanup?.(); slot.cleanup = undefined; });
    expect(intervals.size).toBe(0);
  });

  it("tracks only changed user-produced verdicts and fire actions without input values", () => {
    render(artillery);
    expect(browser.gtag).not.toHaveBeenCalled();
    let nodes = direct();
    change(nodes.filter((entry) => entry.type === "input" && entry.props.type === "number")[0], "400");
    nodes = render(artillery);
    click(button(nodes, "Fire Round (TOF Timer)"));
    nodes = render(artillery);
    change(nodes.filter((entry) => entry.type === "input" && entry.props.type === "number")[0], "750");
    render(artillery);
    expect(browser.gtag.mock.calls).toEqual([
      ["event", "tool_result", {tool: "artillery-calculator", result: "valid", result_type: "ready", weapon: "mortar", input_mode: "direct", locale: "en"}],
      ["event", "tool_result_artillery_calculator_ready", {tool: "artillery-calculator", result: "valid", result_type: "ready", weapon: "mortar", input_mode: "direct", locale: "en", legacy_compat: true}],
      ["event", "tool_action", {tool: "artillery-calculator", result: "valid", action: "fire", weapon: "mortar", locale: "en"}],
      ["event", "tool_action_artillery_fire", {tool: "artillery-calculator", result: "valid", action: "fire", weapon: "mortar", locale: "en", legacy_compat: true}],
      ["event", "tool_result", {tool: "artillery-calculator", result: "invalid", result_type: "out_of_range", weapon: "mortar", input_mode: "direct", locale: "en"}],
      ["event", "tool_result_artillery_calculator_out_of_range", {tool: "artillery-calculator", result: "invalid", result_type: "out_of_range", weapon: "mortar", input_mode: "direct", locale: "en", legacy_compat: true}],
    ]);
    expect(JSON.stringify(browser.gtag.mock.calls)).not.toMatch(/400|750|90\.0/);
    expect(intervals.size).toBe(0);
  });
});

describe("system checker decimal sharing", () => {
  const copy = getToolCopy("en");
  const system = () => SystemChecker({copy});

  it("restores all selections after sharing a fractional storage and RAM input", async () => {
    let nodes = render(system);
    change(labeledControl(nodes, copy.storage), "84.5");
    nodes = render(system);
    change(labeledControl(nodes, copy.ram), "16.5");
    nodes = render(system);
    change(labeledControl(nodes, copy.cpu), "recommended");
    nodes = render(system);
    change(labeledControl(nodes, copy.gpu), "recommended");
    nodes = render(system);
    expect(labeledControl(nodes, copy.storage).props.step).toBe("any");
    await (button(nodes, copy.share).props.onClick as () => Promise<void>)();
    expect(decodeSystemCheckState(new URL(clipboard.mock.calls[0][0]).search)).toEqual({os: "windows-11", ramGb: 16.5, storageGb: 84.5, cpuTier: "recommended", gpuTier: "recommended"});
    hooks.slots.forEach((slot) => slot.cleanup?.()); hooks.slots = [];
    nodes = render(system);
    expect(labeledControl(nodes, copy.storage).props.value).toBe(84.5);
    expect(labeledControl(nodes, copy.cpu).props.value).toBe("recommended");
    expect(text(nodes)).toContain(copy.resultRecommended);
  });

  it("keeps UI edits in shareable bounds including zero", () => {
    let nodes = render(system);
    change(labeledControl(nodes, copy.storage), "100001.5");
    nodes = render(system);
    expect(labeledControl(nodes, copy.storage).props.value).toBe(100000);
    change(labeledControl(nodes, copy.ram), "-1");
    nodes = render(system);
    expect(labeledControl(nodes, copy.ram).props.value).toBe(0);
    expect(text(nodes)).toContain(copy.resultBelow);
  });

  it("shows the shared-state error notice when a provided numeric parameter is invalid", () => {
    hooks.search = "?os=windows-11&ram=16&storage=NaN&cpu=recommended&gpu=recommended&schema=2";
    const nodes = render(system);
    expect(nodes.find((entry) => entry.type === ToolShareNotice)?.props.invalid).toBe(true);
  });

  it("does not track hydration or repeated verdicts, and sends no hardware values", () => {
    hooks.search = encodeSystemCheckState({os: "windows-11", ramGb: 16, storageGb: 84.5, cpuTier: "recommended", gpuTier: "recommended"});
    let nodes = render(system);
    expect(browser.gtag).not.toHaveBeenCalled();
    change(labeledControl(nodes, copy.storage), "90.5");
    nodes = render(system);
    change(labeledControl(nodes, copy.storage), "91.5");
    nodes = render(system);
    change(labeledControl(nodes, copy.ram), "8");
    render(system);
    expect(browser.gtag.mock.calls).toEqual([
      ["event", "tool_result", {tool: "system-checker", result: "recommended"}],
      ["event", "tool_result", {tool: "system-checker", result: "below"}],
    ]);
  });
});
