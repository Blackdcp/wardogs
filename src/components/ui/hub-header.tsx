import type {ReactNode} from "react";
import {TaskLink, type TaskLinkData} from "./task-link";

export type HubHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  titleId?: string;
  actions?: readonly TaskLinkData[];
  children?: ReactNode;
  layout?: "hub" | "tool" | "overlay";
  toolId?: string;
};

export function HubHeader({eyebrow, title, description, titleId, actions = [], children, layout = "hub", toolId}: HubHeaderProps) {
  return (
    <header className={`hub-header hub-header--${layout}`} data-hub-header={layout} data-tool-page-hero={toolId}>
      <div className={layout === "hub" ? "site-container" : "min-w-0"}>
        {eyebrow ? <p className="hub-eyebrow">{eyebrow}</p> : null}
        <h1 className="hub-title" id={titleId}>{title}</h1>
        <p className="hub-description">{description}</p>
        {actions.length ? <div className="mt-5 flex flex-wrap gap-3">{actions.map((action) => <TaskLink {...action} key={action.href} />)}</div> : null}
        {children}
      </div>
    </header>
  );
}
