import {Converter} from "opencc-js/cn2t";

const convertScript = Converter({from: "cn", to: "twp"});
// OpenCC's software glossary mistranslates cargo unloading as uninstallation.
const convert = (value: string) => convertScript(value).replaceAll("解除安裝", "卸載");

// Convert displayed values, never dictionary keys, URLs, identifiers or numbers.
export function toTraditional<T>(value: T): T {
  if (typeof value === "string") {
    return (/^(?:https?:\/\/|\/|#)/.test(value) ? value : convert(value)) as T;
  }
  if (typeof value === "function") {
    return ((...args: unknown[]) => toTraditional(value(...args))) as T;
  }
  if (Array.isArray(value)) return value.map(toTraditional) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, text]) => [key, toTraditional(text)])) as T;
  }
  return value;
}
