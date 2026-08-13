import Image from "next/image";
import {assetPath} from "@/lib/assets";

type SiteBrandProps = {
  className?: string;
  markClassName?: string;
};

export function SiteBrand({className = "", markClassName = "w-[132px]"}: SiteBrandProps) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <Image
        src={assetPath("/images/wardogs-fullmark-white.png")}
        width={2468}
        height={490}
        alt="WARDOGS"
        className={`h-auto shrink-0 ${markClassName}`}
      />
      <span className="display-font shrink-0 border-l border-[#46534d] pl-2 text-sm font-bold text-[#69c78f]">
        Wiki
      </span>
    </span>
  );
}
