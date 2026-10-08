// Self-contained because the same function is embedded in the pre-loader bootstrap.
export function sanitizeAnalyticsUrl(value: string, attribution = true) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    const safe = new URL(url.origin + url.pathname);
    if (attribution) {
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term", "gclid", "dclid", "gbraid", "wbraid", "msclkid"]) {
        const values = url.searchParams.getAll(key);
        if (values.length === 1 && /^[a-zA-Z0-9][a-zA-Z0-9._~-]{0,199}$/.test(values[0])) safe.searchParams.set(key, values[0]);
      }
    }
    return safe.href;
  } catch { return ""; }
}
