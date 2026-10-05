import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it, vi} from "vitest";
import {HeroSearchBox} from "../../src/components/home/hero-search-box";

vi.mock("@/components/layout/site-search-dialog", () => ({SiteSearchDialog: () => null}));

function source(file: string) {
  return readFileSync(path.resolve(file), "utf8");
}

describe("homepage visual polish", () => {
  it("keeps hero search as one command trigger without a second popular-terms row", () => {
    const searchBox = HeroSearchBox({locale: "en", placeholder: "Search"});
    const trigger = searchBox.props.children;
    expect(trigger.props.source).toBe("hero");
    expect(trigger.props.trigger).toBe("hero");
    expect(trigger.props.children).toBeUndefined();
    expect(searchBox.props["data-hero-search-box"]).toBe("true");
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

  it("applies the same homepage section system to every downstream block", () => {
    const files = [
      "src/components/home/home-hero.tsx",
      "src/components/home/home-proven-demand.tsx",
      "src/components/home/home-live-intel.tsx",
      "src/components/home/home-tool-workbench.tsx",
      "src/components/catalogue/catalogue-home-band.tsx",
      "src/components/home/home-library.tsx"
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

    expect(page).not.toContain("<BeginnerTips");
    expect(page).not.toContain("<VideoIntelligence");
    expect(page).not.toContain("<CategoryGrid");
    expect(page).not.toContain("<AboutGame");
    expect(page).not.toContain("<HomeFaq");
    expect(page).not.toContain("<FinalCta");
    expect(page).toContain("<HomeLibrary");
    expect(page).not.toContain("<SiteSearch");
    expect(page).not.toContain("<HomeDiscoveryCompact");
    expect(page).not.toContain("data-home-section=\"discovery\"");
  });

  it("keeps lower homepage cards compact and in the same visual language", () => {
    const videoGrid = source("src/components/videos/current-video-source-grid.tsx");

    expect(videoGrid).toContain('data-home-video-grid="true"');
    expect(videoGrid).not.toContain('bg-[#d9a93a] text-[#111512]');
    expect(videoGrid).not.toContain('block min-h-64 p-5');
  });

});
