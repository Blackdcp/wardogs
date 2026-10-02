import {buildAdsterraClickGuard} from "./adsterra-banner";

export const ADSTERRA_NATIVE_ZONE_ID = "481d6501bcd0c27b98bc3c4776a26f6e";
export const ADSTERRA_NATIVE_CONTAINER_ID = `container-${ADSTERRA_NATIVE_ZONE_ID}`;
export const ADSTERRA_NATIVE_SCRIPT_SRC = `https://arkgleamfox.com/${ADSTERRA_NATIVE_ZONE_ID}/invoke.js`;
export const ADSTERRA_NATIVE_SIZE_MESSAGE = "wardogs-adsterra-native-size";

export function getAdsterraNativeFrameHeight(
  event: Pick<MessageEvent, "origin" | "source" | "data">,
  frameOrigin: string,
  frameWindow: Window | null
): number | null {
  if (!frameWindow || event.source !== frameWindow || event.origin !== frameOrigin) return null;
  const data = event.data;
  if (!data || typeof data !== "object" || data.type !== ADSTERRA_NATIVE_SIZE_MESSAGE ||
      data.zone !== ADSTERRA_NATIVE_ZONE_ID || data.filled !== true ||
      typeof data.height !== "number" || !Number.isFinite(data.height) || data.height <= 0) return null;
  return Math.max(90, Math.min(1800, Math.ceil(data.height)));
}
export function buildAdsterraNativeDocument() {
  // Parent messages remain layout-only; advertiser links open directly from the frame.
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:#0d0f0e;color:#d2dfd7;font:14px/1.4 Arial,sans-serif}</style></head><body>${buildAdsterraClickGuard(`${ADSTERRA_NATIVE_CONTAINER_ID}__link`)}<div id="${ADSTERRA_NATIVE_CONTAINER_ID}"></div><script>
    const container = document.getElementById("${ADSTERRA_NATIVE_CONTAINER_ID}");
    let queued = false;
    function report() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        parent.postMessage({type:"${ADSTERRA_NATIVE_SIZE_MESSAGE}",zone:"${ADSTERRA_NATIVE_ZONE_ID}",filled:!!container.querySelector("a[href]"),height:Math.ceil(container.getBoundingClientRect().height)}, "*");
      });
    }
    new ResizeObserver(report).observe(container);
    new MutationObserver(report).observe(container,{childList:true,subtree:true,attributes:true,characterData:true});
    container.addEventListener("load",report,true);
    window.addEventListener("load",report);
  </script><script async="async" data-cfasync="false" src="${ADSTERRA_NATIVE_SCRIPT_SRC}"></script></body></html>`;
}
