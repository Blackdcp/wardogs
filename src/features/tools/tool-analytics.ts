import {ANALYTICS_EVENTS, trackAnalyticsEvent, type AnalyticsTarget} from "@/lib/analytics-events";
import type {ToolId} from "./tool-registry";
import {inspectToolState, isToolShareWithinLimit} from "./workflow-state";

export type AnalyticsToolId = ToolId | "equipment-compatibility" | "system-checker";

export function markToolShare(url: URL, tool: AnalyticsToolId) {
  url.searchParams.set("wd_share", tool);
  return url;
}

export function isMarkedToolShare(search: string, tool: AnalyticsToolId) {
  const values = new URLSearchParams(search).getAll("wd_share");
  return values.length === 1 && values[0] === tool;
}

// Compare only known state fields. Campaign parameters never qualify as a result.
export function hasSharedToolState(search: string, encoded: string, keys: readonly string[], tool: AnalyticsToolId) {
  if (!isMarkedToolShare(search, tool) || !isToolShareWithinLimit(search) || inspectToolState(search).status === "unsupported") return false;
  const incoming = new URLSearchParams(search);
  const restored = new URLSearchParams(encoded);
  return keys.some((key) => incoming.has(key)) && keys.every((key) => {
    const values = incoming.getAll(key);
    return values.length === 0 || (values.length === 1 && values[0] === restored.get(key));
  });
}

export function createToolAnalytics(tool: AnalyticsToolId, locale: string, target?: AnalyticsTarget) {
  let interacted = false;
  let opened = false;
  let engaged = false;
  const parameters = {tool, locale};
  return {
    openSharedResult() {
      if (opened || interacted) return;
      opened = true;
      trackAnalyticsEvent(ANALYTICS_EVENTS.resultSharedOpen, parameters, target);
    },
    engage() {
      interacted = true;
      if (engaged) return;
      engaged = true;
      trackAnalyticsEvent(ANALYTICS_EVENTS.engagedTool, parameters, target);
    },
    beginShare() { interacted = true; },
    shareCopied() {
      interacted = true;
      trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {...parameters, action: "share", result: "copied"}, target);
    },
  };
}
