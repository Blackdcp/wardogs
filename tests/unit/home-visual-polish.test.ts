import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(file), "utf8");
}

describe("homepage visual polish", () => {
  it("renders hero trending chips as editorial links instead of bracketed debug pills", () => {
    const heroSearch = source("src/components/home/hero-search-box.tsx");

    expect(heroSearch).toContain('data-hero-trending="true"');
    expect(heroSearch).not.toContain('[{item.tag}]');
    expect(heroSearch).not.toContain('font-mono text-[11px] font-bold uppercase tracking-wider text-[#d9a93a]');
    expect(heroSearch).not.toContain('border border-[#304538] bg-[#141e18]/90');
  });

  it("keeps the hero search trigger compact and aligned with the site card language", () => {
    const dialog = source("src/components/layout/site-search-dialog.tsx");

    expect(dialog).toContain('data-search-trigger-style="hero-compact"');
    expect(dialog).not.toContain("rounded-xl");
    expect(dialog).not.toContain("shadow-[0_16px_40px");
    expect(dialog).not.toContain("Open Search");
    expect(dialog).not.toContain("打开搜索");
  });

  it("keeps the search dialog as a refined command panel instead of a large boxed overlay", () => {
    const dialog = source("src/components/layout/site-search-dialog.tsx");

    expect(dialog).toContain('data-search-dialog-panel="command"');
    expect(dialog).toContain('data-search-dialog-input="command"');
    expect(dialog).not.toContain("max-w-2xl border border-[#536a58] bg-[#111713] p-4 shadow-2xl sm:p-6");
    expect(dialog).not.toContain('className="h-14 w-full border border-[#526159]');
    expect(dialog).not.toContain("focus:ring-1 focus:ring");
    expect(dialog).not.toContain("py-14");
  });

  it("demotes the header map/calculator shortcut from a heavy marketing capsule to compact utility links", () => {
    const header = source("src/components/layout/site-header.tsx");

    expect(header).toContain('data-header-tool-shortcuts="true"');
    expect(header).not.toContain('data-tactical-capsule="true"');
    expect(header).not.toContain("shadow-[0_0_15px");
    expect(header).not.toContain("bg-[#122319]");
  });
  it("overrides the global focus-visible ring inside the command search input only", () => {
    const globals = source("src/app/globals.css");

    expect(globals).toContain('[data-search-dialog-input="command"]:focus-visible');
    expect(globals).toContain("outline: 0");
  });

});
