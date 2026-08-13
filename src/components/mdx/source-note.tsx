import type {ReactNode} from "react";

export function SourceNote({children}: {children: ReactNode}) {
  return <div className="my-8 border border-[#2c3631] bg-[#111512] p-4 text-sm text-[#a8b4ae]">{children}</div>;
}
