import {ADSTERRA_ENABLED, ADSTERRA_NATIVE_ENABLED} from "./ad-policy";
import {isProductionHostname} from "@/lib/analytics-events";
import type {AdStatus} from "./adsterra-banner";

export const ADSTERRA_NATIVE_ZONE_ID = "481d6501bcd0c27b98bc3c4776a26f6e";
export const ADSTERRA_NATIVE_CONTAINER_ID = `container-${ADSTERRA_NATIVE_ZONE_ID}`;
export const ADSTERRA_NATIVE_SCRIPT_SRC = `https://bauval.org/21/${ADSTERRA_NATIVE_ZONE_ID}`;

export function configureAdsterraNativeScript(script: HTMLScriptElement) {
  script.async = true;
  script.dataset.cfasync = "false";
  script.src = ADSTERRA_NATIVE_SCRIPT_SRC;
}

export function mountAdsterraNative(container: HTMLElement, onStatus?: (status: AdStatus) => void) {
  const document = container.ownerDocument;
  const parent = container.parentNode;
  if (!ADSTERRA_ENABLED || !ADSTERRA_NATIVE_ENABLED || !parent || !isProductionHostname(document.defaultView?.location.hostname ?? "")) return () => {};
  if (parent.querySelector(`script[src="${ADSTERRA_NATIVE_SCRIPT_SRC}"]`)) return () => {};
  const script = document.createElement("script");
  configureAdsterraNativeScript(script);
  const loaded = () => onStatus?.("script_loaded");
  const failed = () => onStatus?.("script_error");
  script.addEventListener("load", loaded);
  script.addEventListener("error", failed);
  onStatus?.("request_started");
  parent.insertBefore(script, container);
  return () => {
    script.removeEventListener("load", loaded);
    script.removeEventListener("error", failed);
    script.remove();
    container.innerHTML = "";
  };
}
