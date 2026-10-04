import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(file), "utf8");
}

describe("homepage visual polish", () => {
  it("renders hero popular links as quiet editorial text instead of promo chips", () => {
    const heroSearch = source("src/components/home/hero-search-box.tsx");

    expect(heroSearch).toContain('data-hero-popular-links="true"');
    expect(heroSearch).not.toContain('[{item.tag}]');
    expect(heroSearch).not.toContain('font-mono text-[11px] font-bold uppercase tracking-wider text-[#d9a93a]');
    expect(heroSearch).not.toContain('border border-[#304538] bg-[#141e18]/90');
  });


  it("keeps hero popular links in player language rather than internal keyword shorthand", () => {
    const heroSearch = source("src/components/home/hero-search-box.tsx");

    expect(heroSearch).toContain('tag: "Season 2 wipe date"');
    expect(heroSearch).toContain('tag: "Build an M4 kit"');
    expect(heroSearch).toContain('tag: "第二赛季删档时间"');
    expect(heroSearch).not.toContain("S2 Wipe Matrix");
    expect(heroSearch).not.toContain("Ural Cargo SOP");
    expect(heroSearch).not.toContain('tag: "Montar M4", href: "/en');
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

  it("turns hero hot terms into a quiet popular-links row rather than promo chips", () => {
    const heroSearch = source("src/components/home/hero-search-box.tsx");

    expect(heroSearch).toContain('data-hero-popular-links="true"');
    expect(heroSearch).not.toContain('data-hero-trending="true"');
    expect(heroSearch).not.toContain('Flame');
    expect(heroSearch).not.toContain('rounded-full border border-[#2b3831]');
  });

  it("applies the same homepage section system to every downstream block", () => {
    const files = [
      "src/components/home/home-editorial-briefing.tsx",
      "src/components/home/start-here.tsx",
      "src/components/home/current-build-changes.tsx",
      "src/components/home/priority-guides.tsx",
      "src/components/catalogue/catalogue-home-band.tsx",
      "src/components/home/site-search.tsx"
    ];

    for (const file of files) {
      const text = source(file);
      expect(text, file).toContain("data-home-section=");
      expect(text, file).not.toContain("bg-gradient-to-r");
      expect(text, file).not.toContain("shadow-lg");
      expect(text, file).not.toContain('border-y border-[#526159]');
      expect(text, file).not.toContain('border-t border-[#3a473f]');
    }
  });


  it("keeps the homepage from becoming a long stack of low-priority sections", () => {
    const page = source("src/app/[locale]/page.tsx");
    const startHere = source("src/components/home/start-here.tsx");

    expect(page).not.toContain("<BeginnerTips");
    expect(page).not.toContain("<VideoIntelligence");
    expect(page).not.toContain("<CategoryGrid");
    expect(page).not.toContain("<AboutGame");
    expect(page).not.toContain("<HomeFaq");
    expect(page).not.toContain("<FinalCta");
    expect(startHere).toContain("xl:grid-cols-6");
    expect(startHere).not.toContain("min-h-[224px]");
  });

  it("keeps lower homepage cards compact and in the same visual language", () => {
    const videoGrid = source("src/components/videos/current-video-source-grid.tsx");
    const siteSearch = source("src/components/home/site-search.tsx");

    expect(videoGrid).toContain('data-home-video-grid="true"');
    expect(videoGrid).not.toContain('bg-[#d9a93a] text-[#111512]');
    expect(videoGrid).not.toContain('block min-h-64 p-5');
    expect(siteSearch).toContain('data-home-section="search"');
    expect(siteSearch).not.toContain('h-14 w-full border border-[#526159]');
    expect(siteSearch).not.toContain('focus:ring-2 focus:ring-[#79d19c]/35');
  });

});
