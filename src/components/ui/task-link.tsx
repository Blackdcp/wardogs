import type {DiscoveryTask} from "@/features/discovery/discovery-types";
import {publicRoutePath} from "@/lib/public-url";

export type TaskLinkData = {
  href: string;
  label: string;
  description?: string;
  variant?: "primary" | "secondary" | "text";
  hub?: "guides" | "catalogue" | "tools";
  task?: DiscoveryTask;
  target?: string;
};

export function TaskLink({href, label, description, variant = "secondary", hub, task, target}: TaskLinkData) {
  return (
    <a className={`task-link task-link--${variant}`} href={publicRoutePath(href)} title={label} data-task-link={variant} data-discovery-hub={hub} data-discovery-task={task} data-discovery-target={target}>
      <span>{label}{description ? <span className="mt-1 block text-sm font-normal text-[#a8b4ae]">{description}</span> : null}</span>
    </a>
  );
}
