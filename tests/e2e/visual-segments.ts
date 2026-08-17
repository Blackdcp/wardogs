export const mobileStickyHeaderHeight = 64;
export const mobileSegmentOverlap = 96;

export function calculateMobileSegmentScrollTops(pageHeight: number, viewportHeight: number) {
  const maxScrollTop = Math.max(0, pageHeight - viewportHeight);
  const segmentHeight = viewportHeight - mobileSegmentOverlap;
  const segmentCount = Math.ceil(maxScrollTop / segmentHeight) + 1;

  return Array.from({length: segmentCount}, (_, segment) => Math.min(segment * segmentHeight, maxScrollTop));
}
