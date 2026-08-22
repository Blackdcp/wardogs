import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";

describe("guide index", () => {
  it("returns all 23 cards in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(23);
    expect(cards[0].slug).toBe("wardogs-playtest");
    expect(cards[22].slug).toBe("wardogs-fob-guide");
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });
});
