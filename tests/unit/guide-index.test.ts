import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";

describe("guide index", () => {
  it("returns all 45 cards in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(45);
    expect(cards[0].slug).toBe("wardogs-playtest");
    expect(cards[38].slug).toBe("wardogs-oil-rig-guide");
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });
});
