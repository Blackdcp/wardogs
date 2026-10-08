"use client";

import {useEffect, useMemo} from "react";
import {createToolAnalytics, type AnalyticsToolId} from "@/features/tools/tool-analytics";

export function useToolAnalytics(tool: AnalyticsToolId, locale: string, hasSharedResult = false) {
  const recorder = useMemo(() => createToolAnalytics(tool, locale), [tool, locale]);
  useEffect(() => {
    if (hasSharedResult) recorder.openSharedResult();
  }, [hasSharedResult, recorder]);
  return recorder;
}
