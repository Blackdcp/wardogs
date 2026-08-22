import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";

describe("guide index", () => {
  it("returns all 28 cards in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(28);
    expect(cards[0].slug).toBe("wardogs-playtest");
    expect(cards[27].slug).toBe("wardogs-mortar-guide");
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });
});
