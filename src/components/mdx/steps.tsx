import type {ReactNode} from "react";

export function Steps({items = [], children}: {items?: string[]; children?: ReactNode}) {
  if (children) return <div className="my-8 border-l border-[#397b59] pl-6">{children}</div>;
  return (
    <ol className="my-8 space-y-4">
      {items.map((item, index) => (
        <li className="flex gap-4" key={item}>
          <span className="display-font flex size-8 shrink-0 items-center justify-center bg-[#397b59] text-white">{index + 1}</span>
          <span className="pt-1 text-[#dce5e0]">{item}</span>
        </li>
      ))}
    </ol>
  );
}
