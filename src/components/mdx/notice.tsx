import type {ReactNode} from "react";

const tones = {
  info: "border-[#397b59] bg-[#15251d]",
  warning: "border-[#d9a93a] bg-[#2a2417]",
  unavailable: "border-[#d45d5d] bg-[#291c1c]"
};

export function Notice({children, tone = "info", title}: {children: ReactNode; tone?: keyof typeof tones; title?: string}) {
  return (
    <aside className={`my-8 border-l-4 p-5 text-[#dce5e0] ${tones[tone]}`}>
      {title ? <strong className="mb-2 block text-white">{title}</strong> : null}
      {children}
    </aside>
  );
}
