import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

function workflowStep(workflow: string, name: string) {
  const marker = `      - name: ${name}`;
  const start = workflow.indexOf(marker);
  const end = workflow.indexOf("\n      - name:", start + marker.length);
  return workflow.slice(start, end < 0 ? undefined : end);
}

describe("GitHub Pages deployment contract", () => {
  it("builds and verifies the custom-domain export with identical URL inputs", async () => {
    const workflow = await readFile(".github/workflows/deploy-pages.yml", "utf8");
    const expected = [
      'GITHUB_PAGES: "true"',
      'NEXT_PUBLIC_BASE_PATH: ""',
      "NEXT_PUBLIC_SITE_URL: https://www.wardogswiki.com"
    ];

    for (const stepName of ["Build static site", "Verify exported site"]) {
      const step = workflowStep(workflow, stepName);
      for (const line of expected) expect(step, `${stepName}: ${line}`).toContain(line);
    }
  });

  it("keeps the local Pages smoke defaulted to the supported /wardogs deployment", async () => {
    const script = await readFile("scripts/run-pages-smoke.mjs", "utf8");

    expect(script).toContain('process.env.NEXT_PUBLIC_BASE_PATH ?? "/wardogs"');
    expect(script).toContain('process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackdcp.github.io"');
  });
});
