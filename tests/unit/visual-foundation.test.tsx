import {readFile, stat} from "node:fs/promises";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {OfficialWordmark} from "../../src/components/brand/official-wordmark";

describe("visual foundation", () => {
  it("ships local official marks and approved CSS tokens", async () => {
    expect((await stat("public/images/wardogs-fullmark-white.png")).size).toBeGreaterThan(20_000);
    expect((await stat("public/images/wardogs-fullmark-full.png")).size).toBeGreaterThan(20_000);
    const css = await readFile("src/app/globals.css", "utf8");
    expect(css).toContain("--background: #0d0f0e");
    expect(css).toContain("--nav-theme: 152 45% 38%");
    expect(renderToStaticMarkup(createElement(OfficialWordmark, {variant: "white"}))).toContain("WARDOGS");
  });
});
