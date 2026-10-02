export const ADSTERRA_NATIVE_ZONE_ID = "481d6501bcd0c27b98bc3c4776a26f6e";
export const ADSTERRA_NATIVE_CONTAINER_ID = `container-${ADSTERRA_NATIVE_ZONE_ID}`;
export const ADSTERRA_NATIVE_SCRIPT_SRC = `https://arkgleamfox.com/${ADSTERRA_NATIVE_ZONE_ID}/invoke.js`;

export function configureAdsterraNativeScript(script: HTMLScriptElement) {
  script.async = true;
  script.dataset.cfasync = "false";
  script.src = ADSTERRA_NATIVE_SCRIPT_SRC;
}
