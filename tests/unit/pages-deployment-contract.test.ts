import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

function workflowStep(workflow: string, name: string) {
  const marker = `      - name: ${name}`;
  const start = workflow.indexOf(marker);
  const end = workflow.indexOf("\n      - name:", start + marker.length);
  return start < 0 ? "" : workflow.slice(start, end < 0 ? undefined : end);
}

describe("auxiliary GitHub Pages verification contract", () => {
  it("verifies a /wardogs export on pushes and pull requests without production deployment authority", async () => {
    const workflow = await readFile(".github/workflows/deploy-pages.yml", "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain('GITHUB_PAGES: "true"');
    expect(workflow).toContain("NEXT_PUBLIC_BASE_PATH: /wardogs");
    expect(workflow).toContain("NEXT_PUBLIC_SITE_URL: https://blackdcp.github.io/wardogs");
    expect(workflow).toContain("WARDOGSWIKI_RELEASE_SHA: ${{ github.sha }}");
    for (const command of ["npm run lint", "npm run typecheck", "npm run content:validate", "npm test", "npm run build:pages", "npm run test:pages:built"]) {
      expect(workflow, command).toContain(command);
    }
    expect(workflow).not.toMatch(/configure-pages|deploy-pages|upload-pages-artifact|notify-indexnow|submit-indexnow|pages:\s*write|id-token:\s*write/i);
    expect(workflow).not.toContain("https://www.wardogswiki.com");
  });

  it("passes identical Pages URL and revision inputs to build and browser verification", async () => {
    const workflow = await readFile(".github/workflows/deploy-pages.yml", "utf8");
    for (const stepName of ["Build auxiliary static export", "Verify auxiliary static export"]) {
      const step = workflowStep(workflow, stepName);
      expect(step).toContain("npm run");
      expect(step).toContain('GITHUB_PAGES: "true"');
      expect(step).toContain("NEXT_PUBLIC_BASE_PATH: /wardogs");
      expect(step).toContain("NEXT_PUBLIC_SITE_URL: https://blackdcp.github.io/wardogs");
      expect(step).toContain("WARDOGSWIKI_RELEASE_SHA: ${{ github.sha }}");
    }
    const jobEnv = workflow.slice(workflow.indexOf("jobs:"), workflow.indexOf("steps:"));
    expect(jobEnv).not.toContain("NEXT_PUBLIC_SITE_URL");
    expect(workflowStep(workflow, "Run unit tests")).not.toContain("NEXT_PUBLIC_SITE_URL");
  });

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

  it("runs an automatic Vercel production contract for the pushed main SHA without deployment or IndexNow authority", async () => {
    const workflow = await readFile(".github/workflows/verify-production.yml", "utf8");
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {scripts: Record<string, string>};

    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("WARDOGSWIKI_RELEASE_SHA: ${{ github.sha }}");
    expect(workflow).toContain("npm run release:verify");
    expect(workflow).not.toMatch(/submit-indexnow|release:finalize|deploy-pages|vercel deploy|pages:\s*write|id-token:\s*write/i);
    expect(packageJson.scripts["release:verify"]).toBe("node scripts/deploy-production.mjs verify");
  });
});
