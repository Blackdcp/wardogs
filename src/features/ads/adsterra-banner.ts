export type AdsterraBannerUnit = {
  height: number;
  key: string;
  src: string;
  width: number;
};

function bannerUnit(key: string, width: number, height: number): AdsterraBannerUnit {
  return {height, key, src: `https://arkgleamfox.com/${key}/invoke.js`, width};
}

export const ADSTERRA_BANNER_UNITS = {
  horizontal468: bannerUnit("c6d1a3e01dc90e01385598a3c84dcaea", 468, 60),
  rectangle300: bannerUnit("3342dc928824e6ed5c01555e7f9e9e0f", 300, 250),
  rail300: bannerUnit("f6fc5667adc4cb97634312e962c199c5", 160, 300),
  rail600: bannerUnit("b2a91c3759bccd2386763c1c71b7d7ad", 160, 600),
  mobile320: bannerUnit("174695845dde18793bf09d3361f8af30", 320, 50),
  leaderboard728: bannerUnit("035c3a3eb2cdc2bcb65b641e981d4874", 728, 90)
} as const;

// Keep the embedded creative isolated, but do not sandbox the advertiser's new tab.
// Popup permission also relaxes custom-protocol restrictions: this is not a universal SMS blocker.
export const ADSTERRA_BANNER_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";
export const ADSTERRA_FRAME_VERSION = "20261001-clicks";
const approvedKeys = new Set<string>([
  ADSTERRA_BANNER_UNITS.horizontal468.key,
  ADSTERRA_BANNER_UNITS.rectangle300.key,
  ADSTERRA_BANNER_UNITS.rail300.key,
  ADSTERRA_BANNER_UNITS.rail600.key,
  ADSTERRA_BANNER_UNITS.mobile320.key,
  ADSTERRA_BANNER_UNITS.leaderboard728.key
]);

export function getApprovedAdsterraBanner(key: string) {
  return approvedKeys.has(key) ? Object.values(ADSTERRA_BANNER_UNITS).find((unit) => unit.key === key) : undefined;
}

export function getAdsterraFrameOrigin(pageOrigin?: string) {
  if (pageOrigin && process.env.NODE_ENV !== "production") {
    const url = new URL(pageOrigin);
    if (url.hostname === "127.0.0.1") return `${url.protocol}//localhost:${url.port}`;
    if (url.hostname === "localhost") return `${url.protocol}//127.0.0.1:${url.port}`;
  }
  return "https://wardogswiki.com";
}

export function buildAdsterraBannerDocument(unit: AdsterraBannerUnit) {
  const options = JSON.stringify({key: unit.key, format: "iframe", height: unit.height, width: unit.width, params: {}}).replace(/</g, "\\u003c");
  const src = unit.src.replace(/[&"<>]/g, (character) => ({"&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;"})[character]!);
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>${buildAdsterraClickGuard()}<script>window.atOptions=${options};</script><script src="${src}"></script></body></html>`;
}

export function buildAdsterraClickGuard() {
  // First-hop checks cover this document, not cross-origin child frames or advertiser destinations.
  return `<script>(() => {
    const open = window.open.bind(window);
    const webLink = (value) => {
      try { return ["http:", "https:"].includes(new URL(value, location.href).protocol); }
      catch { return false; }
    };
    window.open = (url, target, features) => {
      const value = url == null ? "about:blank" : String(url);
      if (!navigator.userActivation?.isActive || (value !== "about:blank" && value !== "" && !webLink(value))) return null;
      return open(value, target === "_top" || target === "_parent" ? "_blank" : target, features);
    };
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href],area[href]") : null;
      if (!link) return;
      if (!event.isTrusted || !webLink(link.href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      link.target = "_blank";
      link.relList.add("noopener");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
  })();</script>`;
}
