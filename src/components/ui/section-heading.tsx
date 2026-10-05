import type {ReactNode} from "react";

export function SectionHeading({id, title, description, eyebrow, children}: {id?: string; title: string; description?: string; eyebrow?: string; children?: ReactNode}) {
  return (
    <header className="section-heading">
      {eyebrow ? <p className="hub-eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="section-title">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a8b4ae] sm:text-base">{description}</p> : null}
      {children}
    </header>
  );
}
