import type {ReactNode} from "react";
import styles from "./tool-sponsored-workspace.module.css";

type ToolSponsoredWorkspaceProps = {
  children: ReactNode;
  inventory: "tools-map" | "tools-artillery";
  label: string;
  sponsoredSlot: ReactNode;
  railSlot?: ReactNode;
};

// The same slot moves with CSS; resizing must never mount another ad request.
export function ToolSponsoredWorkspace({children, inventory, label, sponsoredSlot, railSlot}: ToolSponsoredWorkspaceProps) {
  return (
    <div className={styles.layout} data-tool-sponsored-workspace={inventory}>
      <div className={styles.workspace} data-tool-workspace data-mobile-ad-protected>{children}</div>
      <aside className={styles.sponsor} aria-label={label} data-page-ad-inventory={inventory} data-tool-workspace-sponsor>
        {sponsoredSlot}
      </aside>
      {railSlot ? <aside className={styles.rail} aria-label={label} data-tool-workspace-rail>{railSlot}</aside> : null}
    </div>
  );
}
