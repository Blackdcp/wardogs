import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it, vi} from "vitest";

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

  it("skips notification when a deployment has no reliable changed-file diff", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };

    expect(indexNow.deriveIndexNowUrls([], [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides"
    ])).toEqual([]);
  });

  it("does not turn generic source changes into whole-site submissions", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };

    expect(indexNow.deriveIndexNowUrls(
      ["src/components/layout/header.tsx"],
      ["https://www.wardogswiki.com/en", "https://www.wardogswiki.com/en/guides"]
    )).toEqual([]);
  });

  it("limits catalogue changes to affected item routes and caps each run", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    const weaponUrls = Array.from({length: 120}, (_, index) =>
      `https://www.wardogswiki.com/en/items/weapons/weapon-${index}`
    );
    const sitemapUrls = [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/items",
      "https://www.wardogswiki.com/en/items/weapons",
      ...weaponUrls,
      weaponUrls[0],
      "https://www.wardogswiki.com/en/guides"
    ];

    const selected = indexNow.deriveIndexNowUrls(["src/features/items/weapon-items.ts"], sitemapUrls);

    expect(selected).toHaveLength(100);
    expect(new Set(selected).size).toBe(selected.length);
    expect(selected).toContain("https://www.wardogswiki.com/en/items");
    expect(selected).toContain("https://www.wardogswiki.com/en/items/weapons");
    expect(selected.some((url) => url.endsWith("/guides"))).toBe(false);
  });

  it("submits one throttled GET request per changed URL instead of batch JSON", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      submitIndexNowUrls: (
        urls: string[],
        options: {fetchImpl: typeof fetch; keyLocation: string; pause: () => Promise<void>}
      ) => Promise<{submitted: number}>;
    };
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response("", {status: 200}));
    const pause = vi.fn(async () => undefined);
    const urls = [
      "https://www.wardogswiki.com/en/guides/wardogs-money-guide",
      "https://www.wardogswiki.com/en/items/weapons"
    ];

    const result = await indexNow.submitIndexNowUrls(urls, {
      fetchImpl: fetchImpl as typeof fetch,
      keyLocation: `https://www.wardogswiki.com/${indexNow.INDEXNOW_KEY}.txt`,
      pause
    });

    expect(result).toEqual({submitted: 2});
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(pause).toHaveBeenCalledTimes(1);
    for (const [requestUrl, init] of fetchImpl.mock.calls) {
      const parsed = new URL(String(requestUrl));
      expect(parsed.origin + parsed.pathname).toBe("https://api.indexnow.org/indexnow");
      expect(parsed.searchParams.get("key")).toBe(indexNow.INDEXNOW_KEY);
      expect(parsed.searchParams.get("url")).toMatch(/^https:\/\/www\.wardogswiki\.com\//);
      expect(init).toBeUndefined();
    }
  });

  it("runs the notifier only after the deployment job succeeds", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    expect(workflow).toContain("notify-indexnow:");
    expect(workflow).toContain("needs: deploy");
    expect(workflow).toContain("node scripts/submit-indexnow.mjs");
  });
});
