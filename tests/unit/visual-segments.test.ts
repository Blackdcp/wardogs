import {describe, expect, it} from "vitest";
import {calculateMobileSegmentScrollTops, mobileSegmentOverlap, mobileStickyHeaderHeight} from "../e2e/visual-segments";

describe("mobile visual segments", () => {
  it("overlaps adjacent captures beyond the sticky header height", () => {
    const viewportHeight = 844;
    const scrollTops = calculateMobileSegmentScrollTops(17_427, viewportHeight);

    expect(mobileSegmentOverlap).toBeGreaterThan(mobileStickyHeaderHeight);
    for (let index = 1; index < scrollTops.length; index += 1) {
      const priorVisibleBottom = scrollTops[index - 1] + viewportHeight;
      const nextVisibleTop = scrollTops[index] + mobileStickyHeaderHeight;
      expect(nextVisibleTop).toBeLessThanOrEqual(priorVisibleBottom);
    }
  });
});
