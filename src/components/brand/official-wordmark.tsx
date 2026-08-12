import Image from "next/image";

type OfficialWordmarkProps = {
  variant?: "white" | "full";
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function OfficialWordmark({variant = "white", className, priority = false, decorative = false}: OfficialWordmarkProps) {
  return <Image
    src={`/images/wardogs-fullmark-${variant}.png`}
    width={2468}
    height={490}
    alt={decorative ? "" : "WARDOGS"}
    aria-hidden={decorative || undefined}
    className={className}
    priority={priority}
  />;
}
