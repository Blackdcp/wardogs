import {describe, expect, it} from "vitest";
import {getMobileAdSuppression, MOBILE_AD_DISMISSAL_KEY, overlapsMobileAd, readMobileAdDismissal, saveMobileAdDismissal} from "../../src/features/ads/mobile-ad-policy";

const normal = {width: 390, height: 844, visualHeight: 844, visualScale: 1, pageHidden: false, modalOpen: false, editableFocused: false, controlsOverlap: false};
const rect = (left: number, top: number, width: number, height: number) => ({left, top, width, height, right: left + width, bottom: top + height});

describe("mobile ad experience policy", () => {
  it("retains an eligible real-size 320px creative and leaves desktop inventory alone", () => {
    expect(getMobileAdSuppression(normal)).toBeNull();
    expect(getMobileAdSuppression({...normal, width: 320})).toBeNull();
    expect(getMobileAdSuppression({...normal, width: 467})).toBeNull();
    expect(getMobileAdSuppression({...normal, width: 319})).toBe("viewport");
    expect(getMobileAdSuppression({...normal, width: 468})).toBe("viewport");
  });

  it("yields for navigation, search, fullscreen, background tabs and input", () => {
    expect(getMobileAdSuppression({...normal, modalOpen: true})).toBe("modal");
    expect(getMobileAdSuppression({...normal, pageHidden: true})).toBe("page-hidden");
    expect(getMobileAdSuppression({...normal, editableFocused: true})).toBe("keyboard");
    expect(getMobileAdSuppression({...normal, visualHeight: 540})).toBe("keyboard");
    expect(getMobileAdSuppression({...normal, visualScale: 1.5})).toBe("viewport");
    expect(getMobileAdSuppression({...normal, height: 320})).toBe("viewport");
    // Normal browser toolbar expansion must not be mistaken for a keyboard.
    expect(getMobileAdSuppression({...normal, visualHeight: 774})).toBeNull();
  });

  it("protects tool controls beneath both the creative and its dismiss target", () => {
    // Regression: the production map fullscreen button was covered at this position.
    expect(overlapsMobileAd(rect(25, 748.6, 44, 44), 390, 844, 80)).toBe(true);
    expect(overlapsMobileAd(rect(300, 723, 44, 44), 390, 844, 80)).toBe(true);
    expect(overlapsMobileAd(rect(40, 600, 44, 44), 390, 844, 80)).toBe(false);
    expect(overlapsMobileAd(rect(5, 770, 20, 44), 390, 844, 80)).toBe(false);
    expect(overlapsMobileAd(rect(40, 850, 44, 44), 390, 844, 80)).toBe(false);
    expect(overlapsMobileAd(rect(0, 0, 0, 0), 390, 844, 80)).toBe(false);
    expect(getMobileAdSuppression({...normal, controlsOverlap: true})).toBe("tool-controls");
    expect(getMobileAdSuppression({...normal, controlsOverlap: false})).toBeNull();
  });

  it("extends the protected region for the safe area without resizing the creative", () => {
    expect(overlapsMobileAd(rect(40, 691, 44, 20), 390, 844, 80)).toBe(false);
    expect(overlapsMobileAd(rect(40, 691, 44, 20), 390, 844, 114)).toBe(true);
  });

  it("persists the close decision across pages and reloads in the same tab session", () => {
    const data = new Map<string, string>();
    const storage = {getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => {data.set(key, value);}};
    expect(readMobileAdDismissal(storage)).toBe(false);
    saveMobileAdDismissal(storage);
    expect(data.get(MOBILE_AD_DISMISSAL_KEY)).toBe("1");
    expect(readMobileAdDismissal(storage)).toBe(true);
    expect(readMobileAdDismissal({getItem: () => null, setItem: () => {}})).toBe(false);
  });

  it("keeps storage-denied browsers usable", () => {
    const storage = {getItem: () => {throw new Error("denied");}, setItem: () => {throw new Error("denied");}};
    expect(readMobileAdDismissal(storage)).toBe(false);
    expect(() => saveMobileAdDismissal(storage)).not.toThrow();
    expect(readMobileAdDismissal(null)).toBe(false);
    expect(() => saveMobileAdDismissal(null)).not.toThrow();
  });
});
