export const MOBILE_AD_DISMISSAL_KEY = "wardogs-mobile-ad-dismissed";

type SessionStore = Pick<Storage, "getItem" | "setItem">;

export function readMobileAdDismissal(storage: SessionStore | null) {
  try { return storage?.getItem(MOBILE_AD_DISMISSAL_KEY) === "1"; } catch { return false; }
}

export function saveMobileAdDismissal(storage: SessionStore | null) {
  try { storage?.setItem(MOBILE_AD_DISMISSAL_KEY, "1"); } catch { /* Dismissal still applies to the current document. */ }
}

type Rect = Pick<DOMRect, "top" | "bottom" | "left" | "right" | "width" | "height">;

/** Includes the close button: an accessible ad must not hide a tool control. */
export function overlapsMobileAd(control: Rect, viewportWidth: number, viewportHeight: number, adHeight: number) {
  const left = (viewportWidth - 320) / 2;
  const top = viewportHeight - adHeight - 44;
  return control.width > 0 && control.height > 0 && control.bottom > top
    && control.top < viewportHeight && control.right > left && control.left < left + 320;
}

export type MobileAdSuppression = "viewport" | "page-hidden" | "modal" | "keyboard" | "tool-controls" | null;

export function getMobileAdSuppression(context: {
  width: number;
  height: number;
  visualHeight: number;
  visualScale: number;
  pageHidden: boolean;
  modalOpen: boolean;
  editableFocused: boolean;
  controlsOverlap: boolean;
}): MobileAdSuppression {
  if (context.width < 320 || context.width > 467 || context.height < 360 || context.visualScale > 1.05) return "viewport";
  if (context.pageHidden) return "page-hidden";
  if (context.modalOpen) return "modal";
  if (context.editableFocused || context.height - context.visualHeight > 120) return "keyboard";
  return context.controlsOverlap ? "tool-controls" : null;
}
