type StatsGridProps = {
  items: readonly string[];
  label: string;
  className?: string;
};

export function StatsGrid({items, label, className = ""}: StatsGridProps) {
  return (
    <ul
      aria-label={label}
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-[#455149] bg-[#455149] md:grid-cols-4 ${className}`}
    >
      {items.map((item) => (
        <li key={item} className="flex min-h-[76px] items-center justify-center bg-[#101512]/95 px-3 py-3 text-center sm:min-h-[82px] sm:px-5">
          <span className="display-font text-sm leading-5 text-[#f4f6f5] sm:text-base">{item}</span>
        </li>
      ))}
    </ul>
  );
}
