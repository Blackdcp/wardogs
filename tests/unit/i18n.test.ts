import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

const localeNames = ["en", "ru", "de", "pt-br"] as const;
const keys = (value: unknown, prefix = ""): string[] =>
  Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child) ? keys(child, path) : [path];
  });

describe("localized messages", () => {
  it("has four complete files with identical key paths", async () => {
    const messages = await Promise.all(localeNames.map(async (locale) =>
      JSON.parse(await readFile(`messages/${locale}.json`, "utf8"))
    ));
    const expected = keys(messages[0]).sort();
    for (const message of messages) {
      expect(keys(message).sort()).toEqual(expected);
      expect(JSON.stringify(message)).not.toContain('""');
    }
  });
});
