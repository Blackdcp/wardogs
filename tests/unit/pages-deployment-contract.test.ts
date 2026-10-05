import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

describe("auxiliary GitHub Pages verification contract", () => {
  it("does not emit a production CNAME from the generic Pages builder", async () => {
    const script = await readFile("scripts/build-pages.mjs", "utf8");
    expect(script).not.toMatch(/out\/CNAME|resolve\("out\/CNAME"\)|resolve\("out",\s*"CNAME"\)|www\.wardogswiki\.com/);
    expect(script).toContain('writeFileSync(resolve("out/.nojekyll"), "")');
  });

  it("defines an isolated next start production-build test command", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {scripts: Record<string, string>};
    const config = await readFile("tests/production-local.playwright.config.ts", "utf8");

    expect(packageJson.scripts["test:e2e:build"]).toBe("playwright test --config tests/production-local.playwright.config.ts");
    expect(config).toContain("127.0.0.1:3100");
    expect(config).toContain("reuseExistingServer: false");
    expect(config).toContain("next start");
    expect(config).toContain('cwd: fileURLToPath(new URL("..", import.meta.url))');
    expect(config).toContain('process.env.NEXT_PUBLIC_SITE_URL ??= "https://www.wardogswiki.com"');
  });

  it("keeps the local Pages smoke defaulted to the supported /wardogs deployment", async () => {
    const script = await readFile("scripts/run-pages-smoke.mjs", "utf8");
    expect(script).toContain('process.env.NEXT_PUBLIC_BASE_PATH ?? "/wardogs"');
    expect(script).toContain('process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackdcp.github.io"');
  });

  it("exposes a caller-supplied Vercel production verification contract", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {scripts: Record<string, string>};
    const script = await readFile("scripts/deploy-production.mjs", "utf8");

    expect(packageJson.scripts["release:verify"]).toBe("node scripts/deploy-production.mjs verify");
    expect(script).toContain("process.env.WARDOGSWIKI_RELEASE_SHA");
    expect(script).toMatch(/verifyProductionRelease[\s\S]*verifyProduction/);
  });
});
