// Self-contained: embedded before the Google tag loads. The live collector E2E
// guards this adapter for Google's observed dataLayer history-event fields.
export function installAnalyticsHistoryPrivacy(
  layer: unknown[],
  sanitizeUrl: (value: string, attribution?: boolean) => string
) {
  const marker = Symbol.for("wardogs.analytics.history-privacy");
  if (Reflect.get(layer, marker)) return;

  function cleanMessage(message: unknown) {
    if (!message || typeof message !== "object") return message;
    const original = message as Record<string, unknown>;
    if (original.event !== "gtm.historyChange" && original.event !== "gtm.historyChange-v2") return message;
    let clean: Record<string, unknown> | undefined;
    const replace = (key: string, value: unknown) => {
      if (original[key] === value) return;
      clean ??= {...original};
      clean[key] = value;
    };
    for (const [key, attribution] of [["gtm.oldUrl", false], ["gtm.newUrl", true]] as const) {
      if (typeof original[key] === "string") replace(key, sanitizeUrl(original[key], attribution));
    }
    for (const key of ["gtm.oldUrlFragment", "gtm.newUrlFragment"]) {
      if (key in original) replace(key, "");
    }
    if (original.eventModel && typeof original.eventModel === "object") {
      const model = original.eventModel as Record<string, unknown>;
      let cleanModel: Record<string, unknown> | undefined;
      for (const [key, attribution] of [["page_referrer", false], ["page_location", true]] as const) {
        if (typeof model[key] !== "string") continue;
        const value = sanitizeUrl(model[key], attribution);
        if (model[key] === value) continue;
        cleanModel ??= {...model};
        cleanModel[key] = value;
      }
      if (cleanModel) replace("eventModel", cleanModel);
    }
    // Do not clone an already-clean event in an older wrapper: Google may add
    // its event ID to this same object after queueing it.
    return clean ?? message;
  }

  for (let index = 0; index < layer.length; index++) layer[index] = cleanMessage(layer[index]);
  const wrap = (delegate: typeof layer.push) => function (this: unknown, ...messages: unknown[]) {
    return Reflect.apply(delegate, this, messages.map(cleanMessage));
  };
  let currentPush = wrap(layer.push);
  Object.defineProperty(layer, "push", {
    configurable: true,
    get: () => currentPush,
    set: (delegate: typeof layer.push) => {
      if (delegate !== currentPush) currentPush = typeof delegate === "function" ? wrap(delegate) : delegate;
    }
  });
  Object.defineProperty(layer, marker, {value: true});
}
