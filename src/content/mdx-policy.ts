import type {Root} from "mdast";
import {visit} from "unist-util-visit";

const approvedComponents = new Set(["FactGrid", "Notice", "Steps", "ComparisonTable", "OfficialVideo", "SourceNote"]);

type MdxNode = {type: string; name?: string | null; url?: string};

export function remarkWardogsMdxPolicy() {
  return (tree: Root) => {
    visit(tree, (node: MdxNode) => {
      if (node.type === "html") throw new Error("Raw HTML is not allowed in guide MDX");
      if (node.type === "mdxjsEsm") throw new Error("Import and export syntax is not allowed in guide MDX");
      if (node.type === "image" && /^(?:https?:)?\/\//i.test(node.url ?? "")) {
        throw new Error("Remote image URLs are not allowed in guide MDX");
      }
      if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        if (node.name?.toLowerCase() === "script") {
          throw new Error("Raw HTML script elements are not allowed in guide MDX");
        }
        if (!node.name || !approvedComponents.has(node.name)) {
          throw new Error(`Component ${node.name ?? "fragment"} is not allowed in guide MDX`);
        }
      }
    });
  };
}
