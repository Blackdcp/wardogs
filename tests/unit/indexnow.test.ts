import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "submit-indexnow.mjs");
const workflowPath = path.join(root, ".github", "workflows", "deploy-pages.yml");

describe("IndexNow deployment notification", () => {
  it("ships a public ownership key and a tested URL selection helper", async () => {
    expect(existsSync(scriptPath)).toBe(true);
    if (!existsSync(scriptPath)) return;

    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    const keyPath = path.join(root, "public", `${indexNow.INDEXNOW_KEY}.txt`);

    expect(readFileSync(keyPath, "utf8").trim()).toBe(indexNow.INDEXNOW_KEY);
    expect(indexNow.deriveIndexNowUrls(
      ["content/en/guides/wardogs-money-guide.mdx"],
      [
        "https://www.wardogswiki.com/en",
        "https://www.wardogswiki.com/en/guides",
        "https://www.wardogswiki.com/en/guides/wardogs-money-guide",
        "https://www.wardogswiki.com/de/guides/wardogs-money-guide"
      ]
    )).toEqual([
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides",
      "https://www.wardogswiki.com/en/guides/wardogs-money-guide"
    ]);
  });

  it("runs the notifier only after the deployment job succeeds", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    expect(workflow).toContain("notify-indexnow:");
    expect(workflow).toContain("needs: deploy");
    expect(workflow).toContain("node scripts/submit-indexnow.mjs");
  });
});
