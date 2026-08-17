import {existsSync, readdirSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const root = join(process.cwd(), "public", "images", "catalogue");

describe("catalogue assets", () => {
  it("imports the approved image inventory", () => {
    expect(readdirSync(join(root, "weapons"))).toHaveLength(14);
    expect(readdirSync(join(root, "vehicles"))).toHaveLength(20);
    expect(readdirSync(join(root, "ammo"))).toHaveLength(14);
    expect(readdirSync(join(root, "attachments"))).toHaveLength(40);
    expect(readdirSync(join(root, "gear"))).toHaveLength(11);
    expect(readdirSync(join(root, "factions"))).toHaveLength(3);
  });

  it("normalizes the three incorrect source names", () => {
    expect(existsSync(join(root, "ammo", "12-7x55mm.webp"))).toBe(true);
    expect(existsSync(join(root, "ammo", "338-norma-magnum-fmj.webp"))).toBe(true);
    expect(existsSync(join(root, "ammo", "5-45x39mm-fmj.webp"))).toBe(true);
  });
});
