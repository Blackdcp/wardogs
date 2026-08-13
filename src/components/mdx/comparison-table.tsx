import type {ReactNode} from "react";

export function ComparisonTable({children}: {children: ReactNode}) {
  return <div className="my-8 overflow-x-auto border border-[#2c3631] [&_table]:w-full [&_th]:bg-[#1b221f] [&_th]:p-4 [&_th]:text-left [&_td]:border-t [&_td]:border-[#2c3631] [&_td]:p-4">{children}</div>;
}
