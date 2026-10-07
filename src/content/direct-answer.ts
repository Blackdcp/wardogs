import type {Root} from "mdast";

type TextNode = {type: string; value?: string; children?: readonly TextNode[]};
const textContainers = new Set(["paragraph", "heading", "emphasis", "strong", "delete", "link", "linkReference"]);

function proseText(node: TextNode): string | null {
  if (node.type === "text") {
    // CJK-adjacent emphasis can remain a text node under CommonMark's delimiter rules.
    return (node.value ?? "").replace(/(^|[^*])\*\*([^*\r\n]+)\*\*(?!\*)/g, "$1$2");
  }
  if (node.type === "inlineCode") return node.value ?? "";
  if (node.type === "break") return " ";
  // Do not read JSX attributes, expressions, image captions, or nested block content.
  if (!textContainers.has(node.type) || !node.children) return null;
  const children = node.children.map(proseText);
  return children.some((text) => text === null) ? null : children.join("");
}

function firstParagraph(nodes: Root["children"]): string | null {
  for (const node of nodes) {
    if (node.type !== "paragraph") continue;
    const text = proseText(node)?.replace(/\s+/g, " ").trim();
    if (text) return text;
  }
  return null;
}

/** Read parsed prose only: headings do not need a blank line before their answer. */
export function extractDirectAnswer(tree: Root): string | null {
  return firstParagraph(tree.children);
}

export function remarkDirectAnswer(receive: (answer: string | null) => void) {
  return () => (tree: Root) => receive(extractDirectAnswer(tree));
}
