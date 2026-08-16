import {ArrowRight, PlayCircle} from "lucide-react";
import type {Locale} from "@/config/site";
import type {VideoArticle} from "@/features/videos/video-library";

export function videoArticleHref(locale: Locale, slug: string) {
  return `/${locale}/videos/${slug}`;
}

export function VideoArticleCard({article, locale}: {article: VideoArticle; locale: Locale}) {
  return (
    <a
      href={videoArticleHref(locale, article.slug)}
      className="group flex min-h-64 flex-col justify-between border border-[#2c3631] bg-[#151b18] p-5 transition-colors hover:border-[#4d946d] hover:bg-[#1b241f]"
    >
      <span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
          <PlayCircle aria-hidden="true" className="size-4" />
          {article.kind === "official" ? "Official video" : "Creator footage"}
        </span>
        <span className="display-font mt-4 block text-2xl leading-tight text-white">{article.title}</span>
        <span className="mt-4 block text-sm leading-6 text-[#a8b4ae]">{article.quickAnswer}</span>
      </span>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">
        Read video breakdown
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  );
}
