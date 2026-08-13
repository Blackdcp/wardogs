import {Plus} from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqListProps = {
  items: readonly FaqItem[];
};

export function FaqList({items}: FaqListProps) {
  return (
    <div className="border-t border-[#344039]">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-[#344039]">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left text-base font-semibold text-[#eef3f0] marker:hidden [&::-webkit-details-marker]:hidden sm:text-lg">
            <span>{item.question}</span>
            <Plus aria-hidden="true" className="size-5 shrink-0 text-[#69c78f] transition-transform group-open:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-5 pr-10 text-sm leading-7 text-[#a8b4ae] sm:text-base">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
