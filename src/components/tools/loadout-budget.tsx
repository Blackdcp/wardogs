import type {ToolCopy} from "@/features/tools/tool-copy";
import {getLoadoutCatalogue} from "@/features/tools/loadout-catalogue";
import {LoadoutBudgetEditor} from "./loadout-budget-editor";

export function LoadoutBudget({copy}: {copy: ToolCopy}) {
  return <LoadoutBudgetEditor copy={copy} catalogue={getLoadoutCatalogue(copy.locale)} />;
}
