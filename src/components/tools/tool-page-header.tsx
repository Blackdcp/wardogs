import {HubHeader, type HubHeaderProps} from "@/components/ui/hub-header";
import type {ToolId} from "@/features/tools/tool-registry";

export function ToolPageHeader(props: Omit<HubHeaderProps, "layout" | "toolId"> & {toolId: ToolId}) {
  return <HubHeader {...props} layout="tool" />;
}
