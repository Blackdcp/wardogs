import type {ReactNode} from "react";

type FactGridProps = {
  items?: Array<{label: string; value: string}>;
  children?: ReactNode;
};

export function FactGrid({items = [], children}: FactGridProps) {
  if (children) return <div className="my-8 grid gap-px bg-[#2c3631] sm:grid-cols-2">{children}</div>;
  return (
    <dl className="my-8 grid gap-px bg-[#2c3631] sm:grid-cols-2">
      {items.map(({label, value}) => (
        <div className="bg-[#171d1a] p-5" key={`${label}-${value}`}>
          <dt className="text-xs font-semibold uppercase text-[#7f8e87]">{label}</dt>
          <dd className="mt-2 text-base font-semibold text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
