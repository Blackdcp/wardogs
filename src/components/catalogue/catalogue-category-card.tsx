import Image from "next/image";
import {ArrowUpRight} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";

type CatalogueCategoryCardProps = {
  title: string;
  description: string;
  count: string;
  href: `/items/${string}`;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
};

const categorySizes = "(min-width: 1280px) 386px, (min-width: 768px) calc(50vw - 44px), calc(100vw - 32px)";

export function CatalogueCategoryCard({
  title,
  description,
  count,
  href,
  image,
  imageAlt,
  imageFit = "cover"
}: CatalogueCategoryCardProps) {
  return (
    <li data-catalogue-category className="min-w-0 border border-[#303b35] bg-[#151b18]">
      <Link className="group flex h-full min-w-0 flex-col" href={href}>
        <span className="relative block aspect-[16/9] overflow-hidden bg-[#090c0a]">
          <Image
            src={assetPath(image)}
            alt={imageAlt}
            fill
            sizes={categorySizes}
            className={`${imageFit === "contain" ? "object-contain p-5" : "object-cover"} transition-transform duration-300 group-hover:scale-[1.02]`}
          />
        </span>
        <span className="flex min-w-0 flex-1 items-start justify-between gap-4 p-5">
          <span className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display-font text-2xl leading-tight text-[#f2f5f3] group-hover:text-[#79d19c]">{title}</span>
              <span className="font-mono text-xs uppercase leading-5 text-[#d9a93a]">{count}</span>
            </span>
            <span className="mt-3 block text-sm leading-6 text-[#a8b4ae]">{description}</span>
          </span>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#82938a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
        </span>
      </Link>
    </li>
  );
}
