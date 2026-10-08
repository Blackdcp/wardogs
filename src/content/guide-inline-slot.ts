import type {Root} from "mdast";

export const GUIDE_INLINE_SLOT = "GuideInlineAdSlot";
export const GUIDE_SUPPLEMENTAL_SLOT = "GuideSupplementalAdSlot";

type ContentNode = {type: string; name?: string | null; children?: readonly ContentNode[]; value?: string};

function hasBodyContent(node: ContentNode): boolean {
  if (["paragraph", "list", "table", "blockquote", "code"].includes(node.type)) return true;
  return node.type === "mdxJsxFlowElement" && ["FactGrid", "Steps", "ComparisonTable", "FactionVisuals"].includes(node.name ?? "");
}

/** Only complete top-level H2 sections qualify: nested lists, tables and JSX stay atomic. */
export function findGuideInlineSlotBoundary(tree: Root): number {
  const headings = tree.children.flatMap((node, index) => node.type === "heading" && node.depth === 2 ? [index] : []);
  const boundaries = headings.flatMap((start, index) => {
    const end = headings[index + 1] ?? tree.children.length;
    return end < tree.children.length && tree.children.slice(start + 1, end).some(hasBodyContent) ? [end] : [];
  });
  return boundaries[1] ?? boundaries[0] ?? tree.children.length;
}

// Register AFTER remarkWardogsMdxPolicy: this reserved component is never accepted
// from author MDX, and receives neither attributes nor executable expressions.
export function findGuideSupplementalSlotBoundary(tree: Root): number | null {
  const headings = tree.children.flatMap((node, index) => node.type === "heading" && node.depth === 2 ? [index] : []);
  const sections = headings.flatMap((start, index) => {
    const end = headings[index + 1] ?? tree.children.length;
    return tree.children.slice(start + 1, end).some(hasBodyContent) ? [{start, end}] : [];
  });
  return sections.length >= 6 ? sections[3].end : null;
}

export function remarkGuideInlineSlot(options?: {supplemental?: boolean}) {
  return (tree: Root) => {
    // Insert the later boundary first so both positions refer to the original AST.
    const supplemental = options?.supplemental ? findGuideSupplementalSlotBoundary(tree) : null;
    if (supplemental !== null) tree.children.splice(supplemental, 0, {
      type: "mdxJsxFlowElement", name: GUIDE_SUPPLEMENTAL_SLOT, attributes: [], children: []
    } as Root["children"][number]);
    tree.children.splice(findGuideInlineSlotBoundary(tree), 0, {
      type: "mdxJsxFlowElement",
      name: GUIDE_INLINE_SLOT,
      attributes: [],
      children: []
    } as Root["children"][number]);
  };
}
