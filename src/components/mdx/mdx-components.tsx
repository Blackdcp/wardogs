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

function tableHeaderText(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(tableHeaderText).find(Boolean) ?? "";
  if (isValidElement<{children?: ReactNode}>(node)) {
    return node.type === "thead" ? nodeText(node.props.children) : tableHeaderText(node.props.children);
  }
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

function MdxTable({children, ...props}: ComponentPropsWithoutRef<"table">) {
  const header = tableHeaderText(children);
  return (
    <div aria-label={header || undefined} className="guide-table-scroll" role={header ? "region" : undefined} tabIndex={0}>
      <table {...props}>{children}</table>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  table: MdxTable,
  FactionVisuals,
  ComparisonTable,
  FactGrid,
  Notice,
  OfficialVideo,
  SourceNote,
  Steps
};
