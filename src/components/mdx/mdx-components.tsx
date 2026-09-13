import type {MDXComponents} from "mdx/types";
import {isValidElement, type ComponentPropsWithoutRef, type ReactNode} from "react";
import {ComparisonTable} from "./comparison-table";
import {FactGrid} from "./fact-grid";
import {FactionVisuals} from "./faction-visuals";
import {Notice} from "./notice";
import {OfficialVideo} from "./official-video";
import {SourceNote} from "./source-note";
import {Steps} from "./steps";

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(" ").replace(/\s+/g, " ").trim();
  if (isValidElement<{children?: ReactNode}>(node)) return nodeText(node.props.children);
  return "";
}

function MdxLink({children, href, rel, target, title, ...props}: ComponentPropsWithoutRef<"a">) {
  const label = nodeText(children);
  const external = typeof href === "string" && /^https?:\/\//.test(href);

  return (
    <a
      {...props}
      href={href}
      rel={rel ?? (external ? "noreferrer" : undefined)}
      target={target ?? (external ? "_blank" : undefined)}
      title={title ?? (label || undefined)}
    >
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  FactionVisuals,
  ComparisonTable,
  FactGrid,
  Notice,
  OfficialVideo,
  SourceNote,
  Steps
};
